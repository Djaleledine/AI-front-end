import crypto from "crypto";
import { NextResponse } from "next/server";
import {
  getFullDatabaseState,
  mutateDatabase,
  resetDatabaseToFactory
} from "../../lib/dbStore";
import { connectToMongoDB } from "../../lib/mongodb";
import {
  ADMIN_COOKIE_NAME,
  checkRateLimit,
  createAdminSessionToken,
  getClientIp,
  hashAdminPin,
  isAuthorizedAdminRequest,
  maskMongoUri,
  readBoundedJsonBody,
  revokeAdminSessionToken,
  revokeAllAdminSessions,
  sanitizePhone,
  sanitizeText,
  verifyAdminPin,
  verifyFetchMetadata
} from "../../lib/security";

function sanitizeMongoStatus(mongoStatus) {
  if (!mongoStatus) return mongoStatus;
  return {
    ...mongoStatus,
    uri: maskMongoUri(mongoStatus.uri)
  };
}

function sanitizeStateForClient(state) {
  if (!state) return state;
  const {
    adminPin: _omitPin,
    adminPinHash: _omitHash,
    ...safeSiteConfig
  } = state.siteConfig || {};
  return {
    ...state,
    siteConfig: safeSiteConfig
  };
}

export async function GET(request) {
  try {
    const fetchMeta = verifyFetchMetadata(request);
    if (!fetchMeta.allowed) {
      return NextResponse.json(
        { ok: false, error: fetchMeta.reason },
        { status: 403, headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
      );
    }

    const { state, mongoStatus } = await getFullDatabaseState();
    const storedPinHash = state?.siteConfig?.adminPinHash || null;

    if (!isAuthorizedAdminRequest(request, storedPinHash)) {
      return NextResponse.json(
        { ok: false, authenticated: false, error: "Authentification Administrateur requise." },
        { status: 401, headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        authenticated: true,
        mongoStatus: sanitizeMongoStatus(mongoStatus),
        data: sanitizeStateForClient(state)
      },
      { headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Impossible de charger l'état administrateur." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const fetchMeta = verifyFetchMetadata(request);
    if (!fetchMeta.allowed) {
      return NextResponse.json(
        { ok: false, error: fetchMeta.reason },
        { status: 403, headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
      );
    }

    const ip = getClientIp(request);

    let body;
    try {
      body = await readBoundedJsonBody(request, 64 * 1024); // Strict 64 KB cap
    } catch (parseErr) {
      return NextResponse.json(
        { ok: false, error: parseErr.status === 413 ? "Requête trop volumineuse." : "Format JSON invalide." },
        { status: parseErr.status || 400 }
      );
    }

    const { entity, action } = body || {};
    const payload = body?.payload || body?.data || {};

    const currentDb = await getFullDatabaseState();
    const storedPinHash = currentDb.state?.siteConfig?.adminPinHash || null;

    // 0. Handle Admin Login / Session Authentication (with both per-IP and global brute-force ceiling)
    if (entity === "auth" && action === "login") {
      const rate = checkRateLimit("admin-login", ip, 8, 15 * 60 * 1000, 10);
      if (!rate.allowed) {
        return NextResponse.json(
          {
            ok: false,
            error: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec}s.`
          },
          { status: 429 }
        );
      }

      const providedPin = String(payload.pin || "").trim();
      if (!verifyAdminPin(providedPin, storedPinHash)) {
        return NextResponse.json(
          { ok: false, authenticated: false, error: "Code PIN Administrateur invalide." },
          { status: 401 }
        );
      }

      const token = createAdminSessionToken();
      const response = NextResponse.json({
        ok: true,
        authenticated: true,
        mongoStatus: sanitizeMongoStatus(currentDb.mongoStatus),
        data: sanitizeStateForClient(currentDb.state)
      });

      response.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8 // 8 hours
      });

      return response;
    }

    // 0b. Handle Admin Logout with server-side revocation & Clear-Site-Data
    if (entity === "auth" && action === "logout") {
      const prodCookie = request.cookies?.get?.("__Host-anjucia_admin_session")?.value;
      const devCookie = request.cookies?.get?.("anjucia_admin_session")?.value;
      revokeAdminSessionToken(prodCookie || devCookie);

      const response = NextResponse.json(
        { ok: true, authenticated: false },
        {
          headers: {
            "Clear-Site-Data": '"cookies", "storage"'
          }
        }
      );
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    // Require Admin Authentication for all mutations
    if (!isAuthorizedAdminRequest(request, storedPinHash)) {
      return NextResponse.json(
        { ok: false, authenticated: false, error: "Session Administrateur expirée ou non autorisée." },
        { status: 401 }
      );
    }

    // 1. Custom MongoDB URI connection test / switch (restricted by ALLOW_RUNTIME_MONGO_SWITCH)
    if (entity === "mongodb" && action === "connect") {
      if (process.env.ALLOW_RUNTIME_MONGO_SWITCH !== "true") {
        return NextResponse.json(
          {
            ok: false,
            error: "Pour des raisons de sécurité, modifiez MONGODB_URI via les variables d'environnement (.env.local)."
          },
          { status: 403 }
        );
      }
      const uri = String(payload?.uri || "").trim();
      if (
        !uri.startsWith("mongodb://") &&
        !uri.startsWith("mongodb+srv://")
      ) {
        return NextResponse.json(
          { ok: false, error: "Format d'URI MongoDB invalide." },
          { status: 400 }
        );
      }
      if (/169\.254\.|metadata\.google/i.test(uri)) {
        return NextResponse.json(
          { ok: false, error: "Hôte MongoDB non autorisé." },
          { status: 400 }
        );
      }

      await connectToMongoDB(uri);
      const { state, mongoStatus } = await getFullDatabaseState();
      return NextResponse.json({
        ok: true,
        mongoStatus: sanitizeMongoStatus(mongoStatus),
        data: sanitizeStateForClient(state)
      });
    }

    // 2. Factory Reset
    if (entity === "reset" || action === "factory_reset") {
      const { state, mongoStatus } = await resetDatabaseToFactory();
      return NextResponse.json({
        ok: true,
        mongoStatus: sanitizeMongoStatus(mongoStatus),
        data: sanitizeStateForClient(state)
      });
    }

    let pinRotated = false;

    // 3. Mutate specific collection
    const { state, mongoStatus } = await mutateDatabase((curr) => {
      const next = { ...curr };

      switch (entity) {
        case "product": {
          if (action === "delete") {
            next.products = (next.products || []).filter((p) => p.id !== payload.id);
          } else if (action === "quick_price_stock") {
            const targetId = sanitizeText(payload.id || "soothing-gel-cream", 80);
            next.products = (next.products || []).map((p) =>
              p.id === targetId
                ? {
                    ...p,
                    priceDZD: Math.max(100, Number(payload.priceDZD) || p.priceDZD),
                    status: payload.inStock ? "available" : "out_of_stock"
                  }
                : p
            );
          } else {
            const prodId =
              sanitizeText(payload.id, 80) ||
              payload.name
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") ||
              `prod-${crypto.randomUUID().slice(0, 6)}`;
            const updatedProd = {
              id: prodId,
              name: sanitizeText(payload.name || "Nouvelle Formule Anjucia", 140),
              frenchName: sanitizeText(payload.frenchName || payload.name || "", 140),
              subtitle: sanitizeText(payload.subtitle || "", 240),
              category: sanitizeText(payload.category || "hydratation", 60),
              volume: sanitizeText(payload.volume || "50 ml ℮ 1.7 FL. OZ.", 60),
              packaging: sanitizeText(payload.packaging || "Tube Protecteur 50 ml", 80),
              priceDZD: Math.max(100, Number(payload.priceDZD) || 1800),
              originalPriceDZD: payload.originalPriceDZD
                ? Number(payload.originalPriceDZD)
                : null,
              badge: sanitizeText(payload.badge || "FORMULATION AVANCÉE", 80),
              status: ["available", "coming_soon", "out_of_stock"].includes(payload.status)
                ? payload.status
                : "available",
              stockCount:
                typeof payload.stockCount === "number" ? payload.stockCount : 100,
              isHero: Boolean(payload.isHero),
              isNew: Boolean(payload.isNew),
              image: payload.image ? sanitizeText(payload.image, 250) : null,
              description: sanitizeText(payload.description || "", 1200),
              actives: Array.isArray(payload.actives) ? payload.actives.slice(0, 20) : [],
              technicalSpecs: {
                format: sanitizeText(
                  payload.technicalSpecs?.format ||
                    "Gel-Crème émulsion Huile dans Eau (H/E)",
                  120
                ),
                ph: sanitizeText(
                  payload.technicalSpecs?.ph || "5.2 physiologique",
                  60
                ),
                texture: sanitizeText(
                  payload.technicalSpecs?.texture ||
                    "Fraîche, aqueuse, pénétration en 30s",
                  120
                ),
                packaging: sanitizeText(
                  payload.technicalSpecs?.packaging || "Tube protecteur hygiénique",
                  120
                )
              },
              rating: Number(payload.rating) || 4.95,
              reviewsCount: Number(payload.reviewsCount) || 120,
              benefitClaim: sanitizeText(payload.benefitClaim || "", 240)
            };

            const exists = (next.products || []).some((p) => p.id === prodId);
            next.products = exists
              ? next.products.map((p) => (p.id === prodId ? { ...p, ...updatedProd } : p))
              : [updatedProd, ...(next.products || [])];
          }
          break;
        }

        case "order": {
          if (action === "delete") {
            next.orders = (next.orders || []).filter(
              (o) => o.id !== payload.id && o.orderId !== payload.id
            );
          } else if (action === "update_status" || action === "update") {
            next.orders = (next.orders || []).map((o) =>
              o.id === payload.id || o.orderId === payload.id
                ? {
                    ...o,
                    status: payload.status ? sanitizeText(payload.status, 40) : o.status,
                    trackingCode:
                      payload.trackingCode !== undefined
                        ? sanitizeText(payload.trackingCode, 60)
                        : o.trackingCode,
                    carrier:
                      payload.carrier !== undefined
                        ? sanitizeText(payload.carrier, 80)
                        : o.carrier,
                    notes:
                      payload.notes !== undefined
                        ? sanitizeText(payload.notes, 500)
                        : o.notes
                  }
                : o
            );
          } else {
            const orderId = `DZ-ANJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            const newOrder = {
              id: orderId,
              orderId,
              trackingCode:
                sanitizeText(payload.trackingCode, 60) ||
                `YAL-${crypto.randomInt(100000, 999999)}`,
              customerName: sanitizeText(payload.customerName || "Client Anjucia", 120),
              customerPhone: sanitizePhone(payload.customerPhone || ""),
              customerAddress: sanitizeText(payload.customerAddress || "À domicile", 250),
              wilaya: sanitizeText(payload.wilaya || "16 - Alger", 80),
              commune: sanitizeText(payload.commune || "", 80),
              items: Array.isArray(payload.items) ? payload.items.slice(0, 20) : [],
              subtotalDZD: Number(payload.subtotalDZD) || Number(payload.totalDZD) || 1800,
              deliveryFeeDZD: Number(payload.deliveryFeeDZD) || 0,
              totalDZD: Number(payload.totalDZD) || 1800,
              paymentMethod: "COD (Paiement à la Livraison)",
              carrier: sanitizeText(payload.carrier || "Yalidine Express", 80),
              status: sanitizeText(payload.status || "CONFIRMED_PREPARING", 40),
              notes: sanitizeText(payload.notes || "", 500),
              createdAt: new Date().toISOString()
            };
            next.orders = [newOrder, ...(next.orders || [])];
          }
          break;
        }

        case "bundle": {
          if (action === "delete") {
            next.bundles = (next.bundles || []).filter((b) => b.id !== payload.id);
          } else {
            const bundleId =
              sanitizeText(payload.id, 60) ||
              `pack-${crypto.randomUUID().slice(0, 6)}`;
            const priceDZD = Math.max(100, Number(payload.priceDZD) || 1800);
            const bundleObj = {
              id: bundleId,
              badge:
                typeof payload.badge === "object"
                  ? payload.badge
                  : {
                      fr: sanitizeText(payload.badge || "OFFRE SPÉCIALE", 80),
                      en: sanitizeText(payload.badge || "SPECIAL OFFER", 80),
                      dz: sanitizeText(payload.badge || "عرض خاص", 80)
                    },
              name:
                typeof payload.name === "object"
                  ? payload.name
                  : {
                      fr: sanitizeText(payload.name || "Nouveau Pack", 120),
                      en: sanitizeText(payload.name || "New Pack", 120),
                      dz: sanitizeText(payload.name || "باك جديد", 120)
                    },
              subtitle:
                typeof payload.subtitle === "object"
                  ? payload.subtitle
                  : {
                      fr: sanitizeText(payload.subtitle || "Protocole Complet", 160),
                      en: sanitizeText(payload.subtitle || "Complete Protocol", 160),
                      dz: sanitizeText(payload.subtitle || "بروتوكول متكامل", 160)
                    },
              priceDZD,
              priceFormatted: `${priceDZD.toLocaleString("fr-FR")} DA`,
              originalPriceDZD:
                Number(payload.originalPriceDZD) || Math.round(priceDZD * 1.2),
              items: Array.isArray(payload.items)
                ? payload.items.slice(0, 10)
                : ["soothing-gel-cream"],
              features: Array.isArray(payload.features)
                ? payload.features.slice(0, 10)
                : [],
              isPopular: Boolean(payload.isPopular),
              freeDelivery: Boolean(payload.freeDelivery)
            };
            const exists = (next.bundles || []).some((b) => b.id === bundleId);
            next.bundles = exists
              ? next.bundles.map((b) => (b.id === bundleId ? { ...b, ...bundleObj } : b))
              : [...(next.bundles || []), bundleObj];
          }
          break;
        }

        case "lead": {
          if (action === "delete") {
            next.leads = (next.leads || []).filter((l) => l.id !== payload.id);
          } else if (action === "update") {
            next.leads = (next.leads || []).map((l) =>
              l.id === payload.id
                ? {
                    ...l,
                    status: payload.status ? sanitizeText(payload.status, 40) : l.status,
                    notes: payload.notes !== undefined ? sanitizeText(payload.notes, 400) : l.notes
                  }
                : l
            );
          } else {
            const newLead = {
              id: `LEAD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
              productId: sanitizeText(payload.productId || "soothing-gel-cream", 80),
              productName: sanitizeText(payload.productName || "Gel-Crème Apaisant 50 ml", 140),
              contact: sanitizeText(payload.contact || "", 140),
              wilaya: sanitizeText(payload.wilaya || "16 - Alger", 80),
              source: sanitizeText(payload.source || "Site Web", 80),
              status: sanitizeText(payload.status || "NEW", 40),
              notes: sanitizeText(payload.notes || "", 400),
              createdAt: new Date().toISOString()
            };
            next.leads = [newLead, ...(next.leads || [])];
          }
          break;
        }

        case "review": {
          if (action === "delete") {
            next.reviews = (next.reviews || []).filter((r) => r.id !== payload.id);
          } else if (action === "toggle_visibility") {
            next.reviews = (next.reviews || []).map((r) =>
              r.id === payload.id ? { ...r, visible: !r.visible } : r
            );
          } else {
            const revId =
              sanitizeText(payload.id, 60) ||
              `rev-${crypto.randomUUID().slice(0, 6)}`;
            const commentText = sanitizeText(
              typeof payload.comment === "string"
                ? payload.comment
                : payload.comment?.fr || "",
              600
            );
            const revObj = {
              id: revId,
              author: sanitizeText(payload.author || "Client Vérifié", 80),
              location: sanitizeText(payload.location || "Alger (16)", 80),
              rating: Math.min(5, Math.max(1, Number(payload.rating) || 5)),
              verified: payload.verified !== undefined ? Boolean(payload.verified) : true,
              visible: payload.visible !== undefined ? Boolean(payload.visible) : true,
              product: sanitizeText(payload.product || "Lightweight Soothing Face Gel-Cream", 140),
              comment:
                typeof payload.comment === "object"
                  ? payload.comment
                  : {
                      fr: `« ${commentText} »`,
                      en: `« ${commentText} »`,
                      dz: `« ${commentText} »`
                    },
              createdAt: new Date().toISOString()
            };
            const exists = (next.reviews || []).some((r) => r.id === revId);
            next.reviews = exists
              ? next.reviews.map((r) => (r.id === revId ? { ...r, ...revObj } : r))
              : [revObj, ...(next.reviews || [])];
          }
          break;
        }

        case "pharmacy": {
          if (action === "delete") {
            next.pharmacies = (next.pharmacies || []).filter(
              (ph) => ph.id !== payload.id
            );
          } else {
            const phId =
              sanitizeText(payload.id, 60) ||
              `pharma-${crypto.randomUUID().slice(0, 6)}`;
            const phObj = {
              id: phId,
              name: sanitizeText(payload.name || "Pharmacie Partenaire", 140),
              city: sanitizeText(payload.city || "Alger", 80),
              wilaya: sanitizeText(payload.wilaya || "16 - Alger", 80),
              address: sanitizeText(payload.address || "", 240),
              phone: sanitizePhone(payload.phone || ""),
              inStock: payload.inStock !== undefined ? Boolean(payload.inStock) : true,
              statusText: payload.inStock === false ? "En Réapprovisionnement" : "En Stock Immédiat"
            };
            const exists = (next.pharmacies || []).some((ph) => ph.id === phId);
            next.pharmacies = exists
              ? next.pharmacies.map((ph) => (ph.id === phId ? { ...ph, ...phObj } : ph))
              : [...(next.pharmacies || []), phObj];
          }
          break;
        }

        case "siteConfig": {
          const currentCfg = next.siteConfig || {};
          const updatedCfg = {
            ...currentCfg,
            announcementText:
              payload.announcementText !== undefined
                ? sanitizeText(payload.announcementText, 280)
                : currentCfg.announcementText,
            supportPhone:
              payload.supportPhone !== undefined
                ? sanitizePhone(payload.supportPhone)
                : currentCfg.supportPhone,
            whatsappNumber:
              payload.whatsappNumber !== undefined
                ? sanitizePhone(payload.whatsappNumber)
                : currentCfg.whatsappNumber,
            heroHeadline:
              payload.heroHeadline !== undefined
                ? sanitizeText(payload.heroHeadline, 200)
                : currentCfg.heroHeadline,
            heroParagraph:
              payload.heroParagraph !== undefined
                ? sanitizeText(payload.heroParagraph, 500)
                : currentCfg.heroParagraph,
            freeShippingThreshold:
              payload.freeShippingThreshold !== undefined
                ? Math.max(1, Math.min(20, Number(payload.freeShippingThreshold) || 2))
                : currentCfg.freeShippingThreshold,
            enableFreeShippingPromo:
              payload.enableFreeShippingPromo !== undefined
                ? Boolean(payload.enableFreeShippingPromo)
                : currentCfg.enableFreeShippingPromo,
            algerDeliveryFee:
              payload.algerDeliveryFee !== undefined
                ? Math.max(0, Number(payload.algerDeliveryFee) || 400)
                : currentCfg.algerDeliveryFee,
            northDeliveryFee:
              payload.northDeliveryFee !== undefined
                ? Math.max(0, Number(payload.northDeliveryFee) || 600)
                : currentCfg.northDeliveryFee,
            highPlateauDeliveryFee:
              payload.highPlateauDeliveryFee !== undefined
                ? Math.max(0, Number(payload.highPlateauDeliveryFee) || 650)
                : currentCfg.highPlateauDeliveryFee,
            southDeliveryFee:
              payload.southDeliveryFee !== undefined
                ? Math.max(0, Number(payload.southDeliveryFee) || 850)
                : currentCfg.southDeliveryFee,
            dermoscanEnabled:
              payload.dermoscanEnabled !== undefined
                ? Boolean(payload.dermoscanEnabled)
                : currentCfg.dermoscanEnabled
          };

          if (payload.newAdminPin && String(payload.newAdminPin).trim().length >= 6) {
            updatedCfg.adminPinHash = hashAdminPin(String(payload.newAdminPin).trim());
            pinRotated = true;
          }
          delete updatedCfg.adminPin;
          next.siteConfig = updatedCfg;
          break;
        }

        case "dermoscanLog": {
          if (action === "clear") {
            next.dermoscanLogs = [];
          }
          break;
        }

        default:
          break;
      }

      return next;
    });

    const response = NextResponse.json({
      ok: true,
      mongoStatus: sanitizeMongoStatus(mongoStatus),
      data: sanitizeStateForClient(state)
    });

    if (pinRotated) {
      revokeAllAdminSessions();
      response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Opération administrateur refusée." },
      { status: 500 }
    );
  }
}
