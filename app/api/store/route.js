import crypto from "crypto";
import { NextResponse } from "next/server";
import { getFullDatabaseState, mutateDatabase } from "../../lib/dbStore";
import {
  checkRateLimit,
  getClientIp,
  isValidAlgerianPhone,
  readBoundedJsonBody,
  sanitizePhone,
  sanitizeText,
  verifyFetchMetadata
} from "../../lib/security";

function computeServerDeliveryFee(wilayaStr = "16 - Alger", totalQty = 1, siteConfig = {}) {
  const freeThreshold = Number(siteConfig.freeShippingThreshold) || 2;
  if (siteConfig.enableFreeShippingPromo !== false && totalQty >= freeThreshold) {
    return 0;
  }

  const w = String(wilayaStr).toLowerCase();
  if (w.startsWith("16") || w.includes("alger")) {
    return Number(siteConfig.algerDeliveryFee) || 400;
  }

  const southKeywords = [
    "adrar", "biskra", "béchar", "bechar", "tamanrasset", "ouargla", "illizi",
    "tindouf", "el oued", "ghardaïa", "ghardaia", "naâma", "naama", "el bayadh",
    "timimoun", "bordj badji", "ouled djellal", "béni abbès", "in salah",
    "in guezzam", "touggourt", "djanet", "el m'ghair", "el meniaa"
  ];
  if (southKeywords.some((kw) => w.includes(kw))) {
    return Number(siteConfig.southDeliveryFee) || 850;
  }

  const plateauKeywords = [
    "sétif", "setif", "constantine", "batna", "djelfa", "tiaret", "m'sila",
    "msila", "bordj bou", "تبسة", "tébessa", "tebessa", "khenchela", "oum el bouaghi",
    "souk ahras", "médea", "medea", "saïda", "saida", "tissemsilt", "mila"
  ];
  if (plateauKeywords.some((kw) => w.includes(kw))) {
    return Number(siteConfig.highPlateauDeliveryFee) || 650;
  }

  return Number(siteConfig.northDeliveryFee) || 600;
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
    const {
      adminPin: _omitAdminPin,
      adminPinHash: _omitAdminPinHash,
      ...publicSiteConfig
    } = state.siteConfig || {};

    return NextResponse.json(
      {
        ok: true,
        mongoConnected: mongoStatus.isConnected,
        data: {
          products: state.products || [],
          bundles: state.bundles || [],
          reviews: (state.reviews || []).filter((r) => r.visible !== false),
          pharmacies: state.pharmacies || [],
          siteConfig: publicSiteConfig
        }
      },
      { headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Impossible de charger le catalogue." },
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
    const rate = checkRateLimit("store-submit", ip, 25, 10 * 60 * 1000, 120);
    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, error: `Trop de requêtes. Réessayez dans ${rate.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await readBoundedJsonBody(request, 20 * 1024); // Strict 20 KB cap
    } catch (parseErr) {
      return NextResponse.json(
        { ok: false, error: parseErr.status === 413 ? "Requête trop volumineuse." : "Format JSON invalide." },
        { status: parseErr.status || 400 }
      );
    }

    const { type = "order", payload = {} } = body || {};

    if (type === "order") {
      const cleanedPhone = sanitizePhone(payload.customerPhone || "");
      if (!isValidAlgerianPhone(cleanedPhone)) {
        return NextResponse.json(
          {
            ok: false,
            error: "Numéro de téléphone algérien invalide (ex: 05/06/07 XX XX XX XX)."
          },
          { status: 400 }
        );
      }

      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Votre panier est vide." },
          { status: 400 }
        );
      }
    }

    let createdRecord = null;
    let validationError = null;

    await mutateDatabase((curr) => {
      const next = { ...curr };

      if (type === "order") {
        const catalogMap = new Map();
        (curr.products || []).forEach((p) => {
          if (p && p.id) catalogMap.set(p.id, p);
        });
        (curr.bundles || []).forEach((b) => {
          if (b && b.id) {
            catalogMap.set(b.id, {
              id: b.id,
              name: typeof b.name === "object" ? b.name.fr : b.name,
              priceDZD: Number(b.priceDZD) || 1800,
              status: "available"
            });
          }
        });

        const verifiedItems = [];
        let totalQty = 0;
        let serverSubtotalDZD = 0;

        for (const rawItem of payload.items.slice(0, 10)) {
          const itemId = sanitizeText(rawItem?.id, 80);
          const catalogItem = catalogMap.get(itemId);
          if (!catalogItem) continue;

          const isAvailable =
            catalogItem.status === "available" || catalogItem.status === "in_stock";
          if (!isAvailable) continue;

          const qty = Math.max(1, Math.min(20, Math.floor(Number(rawItem?.qty) || 1)));
          const unitPriceDZD = Math.max(100, Number(catalogItem.priceDZD) || 1800);

          verifiedItems.push({
            id: catalogItem.id,
            name: sanitizeText(catalogItem.name, 140),
            qty,
            priceDZD: unitPriceDZD
          });
          totalQty += qty;
          serverSubtotalDZD += unitPriceDZD * qty;
        }

        if (verifiedItems.length === 0) {
          validationError = "Aucun produit disponible valide dans la commande.";
          return curr;
        }

        const wilaya = sanitizeText(payload.wilaya || "16 - Alger", 80);
        const serverDeliveryFeeDZD = computeServerDeliveryFee(
          wilaya,
          totalQty,
          curr.siteConfig
        );
        const serverTotalDZD = serverSubtotalDZD + serverDeliveryFeeDZD;

        // Server-generated unpredictable order ID and tracking code
        const orderId = `DZ-ANJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const trackingCode = `YAL-${crypto.randomInt(100000, 999999)}`;

        createdRecord = {
          id: orderId,
          orderId,
          trackingCode,
          customerName: sanitizeText(payload.customerName || "Client Anjucia", 120),
          customerPhone: sanitizePhone(payload.customerPhone || ""),
          customerAddress: sanitizeText(payload.customerAddress || "À domicile", 250),
          wilaya,
          commune: sanitizeText(payload.commune || "", 80),
          items: verifiedItems,
          subtotalDZD: serverSubtotalDZD,
          deliveryFeeDZD: serverDeliveryFeeDZD,
          totalDZD: serverTotalDZD,
          paymentMethod: "COD (Paiement à la Livraison)",
          carrier: sanitizeText(payload.carrier || "Yalidine Express", 80),
          status: "PENDING_VERIFICATION",
          notes: sanitizeText(payload.notes || "", 300),
          createdAt: new Date().toISOString()
        };
        next.orders = [createdRecord, ...(next.orders || [])];
      } else if (type === "lead") {
        const contact = sanitizeText(payload.contact || "", 140);
        if (!contact) {
          validationError = "Contact requis.";
          return curr;
        }
        createdRecord = {
          id: `LEAD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          productId: sanitizeText(payload.productId || "soothing-gel-cream", 80),
          productName: sanitizeText(payload.productName || "Formule Anjucia", 140),
          contact,
          wilaya: sanitizeText(payload.wilaya || "16 - Alger", 80),
          source: sanitizeText(payload.source || "Site Web", 80),
          status: "NEW",
          notes: sanitizeText(payload.notes || "", 240),
          createdAt: new Date().toISOString()
        };
        next.leads = [createdRecord, ...(next.leads || [])];
      } else {
        validationError = "Type de requête non supporté.";
      }
      return next;
    });

    if (validationError) {
      return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: true,
        data: createdRecord
      },
      { headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur lors de l'enregistrement." },
      { status: 500 }
    );
  }
}
