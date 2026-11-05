"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Users,
  Settings,
  Search,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Phone,
  MessageSquare,
  LogOut,
  RefreshCw,
  ExternalLink,
  Edit2,
  Save,
  Layers,
  Sparkles,
  Database,
  Activity,
  Star,
  MapPin,
  ShoppingBag,
  Eye,
  EyeOff
} from "lucide-react";
import AnjuciaLogo, { DropletMark } from "../components/brand/AnjuciaLogo";
import { ALGERIAN_WILAYAS } from "../data/products";
import { useCart } from "../context/CartContext";

const STATUS_CONFIG = {
  PENDING_VERIFICATION: {
    label: "À Vérifier",
    color: "#E6A23C",
    bg: "rgba(230, 162, 60, 0.12)",
    icon: Clock
  },
  CONFIRMED_PREPARING: {
    label: "Confirmée / Préparation",
    color: "#409EFF",
    bg: "rgba(64, 158, 255, 0.12)",
    icon: Package
  },
  SHIPPED: {
    label: "Expédiée (Yalidine)",
    color: "#719FB7",
    bg: "rgba(113, 159, 183, 0.15)",
    icon: Truck
  },
  DELIVERED: {
    label: "Livrée & Encaissée",
    color: "#67C23A",
    bg: "rgba(103, 194, 58, 0.12)",
    icon: CheckCircle
  },
  CANCELLED: {
    label: "Annulée",
    color: "#F56C6C",
    bg: "rgba(245, 108, 108, 0.12)",
    icon: XCircle
  }
};

const EMPTY_PRODUCT_FORM = {
  id: "",
  name: "",
  frenchName: "",
  subtitle: "",
  category: "hydratation",
  volume: "50 ml ℮ 1.7 FL. OZ.",
  priceDZD: 1800,
  originalPriceDZD: 2200,
  badge: "FORMULATION AVANCÉE",
  status: "available",
  stockCount: 100,
  ph: "5.2 physiologique",
  description: "",
  activesText:
    "Niacinamide (Vitamine B3) | 3.0% | Régulation sébacée\nPanthénol (Pro-Vitamine B5) | 2.0% | Apaisement barrière\nSqualane Végétal | 3.0% | Émollient biomimétique"
};

export default function AdminDashboardPage() {
  const { showToast } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Module Tab
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoading, setIsLoading] = useState(false);

  // Backend & MongoDB State
  const [mongoStatus, setMongoStatus] = useState({
    isConnected: false,
    uri: "mongodb://127.0.0.1:27017/anjucia_dermaceutical",
    lastError: null
  });
  const [customMongoUri, setCustomMongoUri] = useState("");

  // Full Collections State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [dermoscanLogs, setDermoscanLogs] = useState([]);
  const [siteConfig, setSiteConfig] = useState({
    announcementText:
      "Livraison 58 Wilayas • Paiement à la livraison (COD) • Formule Clinique Haute Tolérance",
    supportPhone: "+213 550 12 34 56",
    whatsappNumber: "213550123456",
    heroHeadline: "Formulée en Algérie. Validée à l’international.",
    heroParagraph:
      "La crème Anjucia est conçue par une pharmacienne algérienne, et a obtenu la validation d’une experte internationale en formulation.",
    freeShippingThreshold: 2,
    enableFreeShippingPromo: true,
    algerDeliveryFee: 400,
    northDeliveryFee: 600,
    highPlateauDeliveryFee: 650,
    southDeliveryFee: 850,
    newAdminPin: ""
  });

  // Filters for Orders
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [wilayaFilter, setWilayaFilter] = useState("ALL");

  // Modals & Forms
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    wilaya: "16 - Alger",
    commune: "",
    productId: "soothing-gel-cream",
    qty: 1,
    carrier: "Yalidine Express"
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  const [showBundleModal, setShowBundleModal] = useState(false);
  const [bundleForm, setBundleForm] = useState({
    id: "",
    name: "",
    subtitle: "",
    badge: "OFFRE SPÉCIALE",
    priceDZD: 3500,
    originalPriceDZD: 4200,
    freeDelivery: true,
    isPopular: false
  });

  const [newReviewForm, setNewReviewForm] = useState({
    author: "",
    location: "Alger (16)",
    rating: 5,
    product: "Lightweight Soothing Face Gel-Cream",
    comment: ""
  });

  const [newPharmacyForm, setNewPharmacyForm] = useState({
    name: "",
    city: "Alger",
    wilaya: "16 - Alger",
    address: "",
    phone: "+213 "
  });

  const [newLeadForm, setNewLeadForm] = useState({
    productName: "Anti-aging Serum",
    contact: "",
    wilaya: "16 - Alger",
    source: "Admin Manuel"
  });

  // Never store customer PII (orders/leads) or spoofable prices in browser localStorage
  const syncBrowserStorage = useCallback((stateData) => {
    if (typeof window === "undefined" || !stateData) return;
    try {
      localStorage.removeItem("anjucia_orders");
      localStorage.removeItem("anjucia_waitlist_leads");
      localStorage.removeItem("anjucia_custom_price");
      localStorage.removeItem("anjucia_custom_stock");
      localStorage.removeItem("anjucia_custom_catalog");
    } catch (_) {}
  }, []);

  const applyServerPayload = useCallback(
    (json) => {
      if (!json?.data) return;
      const d = json.data;
      if (json.mongoStatus) setMongoStatus(json.mongoStatus);
      setProducts(d.products || []);
      setOrders(d.orders || []);
      setBundles(d.bundles || []);
      setLeads(d.leads || []);
      setReviews(d.reviews || []);
      setPharmacies(d.pharmacies || []);
      setDermoscanLogs(d.dermoscanLogs || []);
      if (d.siteConfig) setSiteConfig((prev) => ({ ...prev, ...d.siteConfig }));
      syncBrowserStorage(d);
    },
    [syncBrowserStorage]
  );

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin", { credentials: "same-origin" });
      if (res.ok) {
        const json = await res.json();
        setIsAuthenticated(true);
        applyServerPayload(json);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn("Admin load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [applyServerPayload]);

  const sendAdminAction = async (entity, action, payload, successMessage) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, action, payload })
      });
      const json = await res.json();
      if (json?.ok) {
        applyServerPayload(json);
        if (successMessage) showToast(successMessage);
        return true;
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
        }
        showToast(json?.error || "Erreur serveur", "error");
        return false;
      }
    } catch (err) {
      showToast("Erreur de communication avec le serveur Node.js", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setIsLoading(true);
    setPinError(false);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "auth",
          action: "login",
          payload: { pin: pinInput.trim() }
        })
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setIsAuthenticated(true);
        setPinInput("");
        applyServerPayload(json);
        showToast("Authentification réussie • Centre de Contrôle Anjucia");
      } else {
        setPinError(true);
        showToast(json?.error || "Code PIN Administrateur invalide", "error");
      }
    } catch (_) {
      setPinError(true);
      showToast("Erreur de connexion au serveur", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "auth", action: "logout" })
      });
    } catch (_) {}
    setIsAuthenticated(false);
    setPinInput("");
    showToast("Session Administrateur verrouillée");
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerPhone || "").includes(searchTerm) ||
        (o.id || o.orderId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.wilaya || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchWilaya =
        wilayaFilter === "ALL" || (o.wilaya || "").includes(wilayaFilter);

      return matchSearch && matchStatus && matchWilaya;
    });
  }, [orders, searchTerm, statusFilter, wilayaFilter]);

  // KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (Number(o.totalDZD) || 1800), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "PENDING_VERIFICATION" || o.status === "CONFIRMED_PREPARING"
    ).length;
  }, [orders]);

  const availableProductsCount = useMemo(() => {
    return products.filter(
      (p) => p.status === "available" || p.status === "in_stock"
    ).length;
  }, [products]);

  const avgHydrationScore = useMemo(() => {
    if (!dermoscanLogs.length) return 58;
    const sum = dermoscanLogs.reduce(
      (acc, l) => acc + (Number(l.hydrationScore) || 58),
      0
    );
    return Math.round(sum / dermoscanLogs.length);
  }, [dermoscanLogs]);

  // Open Product Modal for Create or Edit
  const openEditProductModal = (prod = null) => {
    if (!prod) {
      setProductForm(EMPTY_PRODUCT_FORM);
    } else {
      const activesText = Array.isArray(prod.actives)
        ? prod.actives
            .map((a) => `${a.name} | ${a.percentage} | ${a.role || ""}`)
            .join("\n")
        : "";
      setProductForm({
        id: prod.id,
        name: prod.name || "",
        frenchName: prod.frenchName || prod.name || "",
        subtitle: prod.subtitle || "",
        category: prod.category || "hydratation",
        volume: prod.volume || "50 ml",
        priceDZD: prod.priceDZD || 1800,
        originalPriceDZD: prod.originalPriceDZD || "",
        badge: prod.badge || "FORMULATION AVANCÉE",
        status: prod.status || "available",
        stockCount: prod.stockCount ?? 100,
        ph: prod.technicalSpecs?.ph || "5.2 physiologique",
        description: prod.description || "",
        activesText
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProductModal = async (e) => {
    e.preventDefault();
    const parsedActives = (productForm.activesText || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((s) => s.trim());
        return {
          name: parts[0] || "Actif Dermaceutique",
          percentage: parts[1] || "1.0%",
          role: parts[2] || "Synergie cutanée"
        };
      });

    const ok = await sendAdminAction(
      "product",
      "upsert",
      {
        ...productForm,
        priceDZD: Number(productForm.priceDZD) || 1800,
        originalPriceDZD: productForm.originalPriceDZD
          ? Number(productForm.originalPriceDZD)
          : null,
        stockCount: Number(productForm.stockCount) || 0,
        actives: parsedActives,
        technicalSpecs: {
          format: "Émulsion Dermaceutique",
          ph: productForm.ph || "5.2 physiologique",
          texture: "Ultra-légère non grasse"
        }
      },
      "Formule enregistrée et synchronisée avec DermoScan AI™ !"
    );
    if (ok) setShowProductModal(false);
  };

  const handleCreateManualOrder = async (e) => {
    e.preventDefault();
    const chosenProd =
      products.find((p) => p.id === newOrderForm.productId) || products[0];
    const unitPrice = chosenProd?.priceDZD || 1800;
    const qty = Number(newOrderForm.qty) || 1;

    const ok = await sendAdminAction(
      "order",
      "create",
      {
        customerName: newOrderForm.customerName,
        customerPhone: newOrderForm.customerPhone,
        customerAddress:
          newOrderForm.customerAddress || newOrderForm.commune || "Centre-ville",
        wilaya: newOrderForm.wilaya,
        commune: newOrderForm.commune,
        carrier: newOrderForm.carrier,
        items: [
          {
            id: chosenProd?.id || "soothing-gel-cream",
            name: chosenProd?.name || "Lightweight Soothing Face Gel-Cream",
            qty,
            priceDZD: unitPrice
          }
        ],
        totalDZD: unitPrice * qty
      },
      "Nouvelle commande créée dans la base de données !"
    );

    if (ok) {
      setShowNewOrderModal(false);
      setNewOrderForm({
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        wilaya: "16 - Alger",
        commune: "",
        productId: "soothing-gel-cream",
        qty: 1,
        carrier: "Yalidine Express"
      });
    }
  };

  // CSV Exports
  const exportOrdersCSV = () => {
    const headers = [
      "ID Commande",
      "Date",
      "Client",
      "Telephone",
      "Wilaya",
      "Adresse",
      "Articles",
      "Total DZD",
      "Statut",
      "Transporteur"
    ];
    const rows = orders.map((o) => [
      o.id || o.orderId,
      new Date(o.createdAt).toLocaleDateString("fr-FR"),
      `"${o.customerName || ""}"`,
      `"${o.customerPhone || ""}"`,
      `"${o.wilaya || ""}"`,
      `"${(o.customerAddress || "").replace(/"/g, '""')}"`,
      o.items
        ? `"${o.items.map((i) => `${i.qty}x ${i.name}`).join(" + ")}"`
        : "1x Gel-Crème",
      o.totalDZD || 1800,
      STATUS_CONFIG[o.status]?.label || o.status,
      o.carrier || "Yalidine Express"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `anjucia_commandes_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV des commandes téléchargé !");
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          background: "var(--bg-primary)"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "var(--bg-card)",
            border: "none",
            borderRadius: "0px",
            padding: "2.5rem 2rem",
            boxShadow: "var(--shadow-md)",
            textAlign: "center"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              background: "var(--accent-aqua-subtle)",
              color: "var(--accent-aqua)",
              marginBottom: "1.2rem"
            }}
          >
            <DropletMark size={38} color="var(--accent-aqua)" />
          </div>

          <h1
            style={{
              fontSize: "1.45rem",
              fontWeight: 400,
              color: "var(--text-primary)",
              marginBottom: "0.3rem"
            }}
          >
            Centre de Contrôle Anjucia
          </h1>
          <p
            style={{
              fontSize: "0.84rem",
              color: "var(--text-secondary)",
              marginBottom: "1.8rem"
            }}
          >
            Administration Intégrale Node.js + MongoDB • Commandes, Catalogue, DermoScan AI™ & CMS 58 Wilayas.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
              <label
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 400,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: "0.4rem"
                }}
              >
                Code PIN Administrateur
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Entrez votre code PIN sécurisé"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "0px",
                  border: pinError
                    ? "2px solid #F56C6C"
                    : "1px solid var(--border-light)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
                autoFocus
              />
              {pinError && (
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "#F56C6C",
                    marginTop: "0.4rem",
                    display: "block"
                  }}
                >
                  Code PIN Administrateur invalide. Veuillez vérifier vos identifiants.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: "#4d7358",
                color: "#ffffff",
                border: "none",
                borderRadius: "0px",
                fontSize: "0.92rem",
                cursor: isLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.8rem"
              }}
            >
              <ShieldCheck size={18} />
              <span>{isLoading ? "Vérification..." : "Déverrouiller le Dashboard"}</span>
            </button>
          </form>

          <div
            style={{
              marginTop: "1.8rem",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "1rem"
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textDecoration: "none"
              }}
            >
              ← Retourner à la boutique publique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        paddingBottom: "5rem"
      }}
    >
      {/* Top Sticky Admin Bar */}
      <header
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky",
          top: 0,
          zIndex: 800,
          padding: "0.8rem 1.4rem"
        }}
      >
        <div
          style={{
            maxWidth: "1340px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <AnjuciaLogo size={34} />
            </Link>
            <span
              style={{
                fontSize: "0.74rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "#4d7358",
                padding: "0.25rem 0.7rem"
              }}
            >
              ADMINISTRATION CENTRALE
            </span>

            {/* Live Backend & MongoDB Status Indicator */}
            <span
              style={{
                fontSize: "0.73rem",
                padding: "0.25rem 0.65rem",
                background: "var(--bg-secondary)",
                color: mongoStatus.isConnected ? "#67C23A" : "var(--accent-aqua)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Database size={13} />
              <span>
                {mongoStatus.isConnected
                  ? "MongoDB Connecté (Live)"
                  : "Node.js + Persistance Hybride Active"}
              </span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={loadAllData}
              title="Synchroniser avec le serveur"
              style={{
                background: "var(--bg-secondary)",
                border: "none",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={15} className={isLoading ? "spin" : ""} />
            </button>

            <Link
              href="/analyzer"
              style={{
                padding: "0.45rem 0.85rem",
                background: "var(--bg-secondary)",
                color: "var(--accent-aqua)",
                fontSize: "0.78rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Sparkles size={13} />
              <span>DermoScan AI™</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.45rem 0.85rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.78rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <span>Voir Boutique</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: "0.45rem 0.85rem",
                background: "rgba(245, 108, 108, 0.12)",
                border: "none",
                color: "#F56C6C",
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <LogOut size={13} />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1340px", margin: "1.4rem auto 0", padding: "0 1.2rem" }}>
        {/* KPI Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}
        >
          <div style={{ background: "var(--bg-card)", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Chiffre d&apos;Affaires (COD)
              </span>
              <TrendingUp size={16} color="#67C23A" />
            </div>
            <div style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
              {totalRevenue.toLocaleString("fr-FR")}{" "}
              <span style={{ fontSize: "0.95rem", color: "var(--accent-aqua)" }}>DA</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {orders.length} commandes enregistrées
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Expéditions à Traiter
              </span>
              <Package size={16} color="var(--accent-aqua)" />
            </div>
            <div style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#E6A23C", marginTop: "0.25rem" }}>
              En attente de confirmation / Yalidine
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Catalogue & Formules
              </span>
              <Layers size={16} color="#4d7358" />
            </div>
            <div style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
              {products.length} <span style={{ fontSize: "0.85rem", color: "#4d7358" }}>({availableProductsCount} en vente)</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Synchronisé en direct avec DermoScan AI™
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Télémétrie DermoScan AI™
              </span>
              <Activity size={16} color="var(--accent-aqua)" />
            </div>
            <div style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
              {dermoscanLogs.length}{" "}
              <span style={{ fontSize: "0.82rem", color: "var(--accent-aqua)" }}>
                (Moy. Hydratation: {avgHydrationScore}/100)
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Consultations IA enregistrées (58 Wilayas)
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            borderBottom: "1px solid var(--border-light)",
            marginBottom: "1.5rem",
            overflowX: "auto",
            paddingBottom: "0.2rem"
          }}
        >
          {[
            { id: "orders", label: "Commandes & Expéditions", icon: Package, count: orders.length },
            { id: "products", label: "Catalogue Produits & Actifs", icon: Layers, count: products.length },
            { id: "bundles", label: "Packs & Promotions", icon: ShoppingBag, count: bundles.length },
            { id: "dermoscan", label: "Télémétrie DermoScan AI™", icon: Activity, count: dermoscanLogs.length },
            { id: "reviews_pharmacies", label: "Avis & Pharmacies", icon: Star, count: reviews.length + pharmacies.length },
            { id: "leads", label: "Prospects & Waitlist", icon: Users, count: leads.length },
            { id: "logistics", label: "Logistique 58 Wilayas", icon: Truck },
            { id: "settings", label: "CMS & Base MongoDB", icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #4d7358"
                    : "2px solid transparent",
                  color: isActive ? "#4d7358" : "var(--text-secondary)",
                  padding: "0.65rem 0.95rem",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  whiteSpace: "nowrap"
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.12rem 0.4rem",
                      background: isActive ? "#4d7358" : "var(--bg-secondary)",
                      color: isActive ? "#ffffff" : "var(--text-muted)"
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: ORDERS ==================== */}
        {activeTab === "orders" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1.2rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, flexWrap: "wrap" }}>
                <div style={{ position: "relative", minWidth: "250px", flex: 1, maxWidth: "340px" }}>
                  <Search
                    size={15}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)"
                    }}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher client, téléphone, wilaya, réf..."
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem 0.6rem 2.1rem",
                      border: "none",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "0.6rem 0.8rem",
                    border: "none",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem"
                  }}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="PENDING_VERIFICATION">À Vérifier</option>
                  <option value="CONFIRMED_PREPARING">Confirmée / Préparation</option>
                  <option value="SHIPPED">Expédiée (Yalidine)</option>
                  <option value="DELIVERED">Livrée & Encaissée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>

                <select
                  value={wilayaFilter}
                  onChange={(e) => setWilayaFilter(e.target.value)}
                  style={{
                    padding: "0.6rem 0.8rem",
                    border: "none",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem"
                  }}
                >
                  <option value="ALL">Toutes les 58 Wilayas</option>
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  onClick={exportOrdersCSV}
                  className="btn-outline"
                  style={{
                    padding: "0.6rem 0.95rem",
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Download size={14} />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={() => setShowNewOrderModal(true)}
                  style={{
                    padding: "0.6rem 1.1rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Plus size={15} />
                  <span>Nouvelle Commande</span>
                </button>
              </div>
            </div>

            <div style={{ background: "var(--bg-card)", overflowX: "auto", boxShadow: "var(--shadow-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontSize: "0.72rem"
                    }}
                  >
                    <th style={{ padding: "0.8rem 1rem" }}>Réf. & Suivi</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Client & Contact Direct</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Wilaya & Adresse</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Articles</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Total COD</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Statut</th>
                    <th style={{ padding: "0.8rem 1rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const statusObj =
                      STATUS_CONFIG[order.status] || STATUS_CONFIG.CONFIRMED_PREPARING;
                    return (
                      <tr
                        key={order.id || order.orderId}
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}
                      >
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ color: "var(--accent-aqua)", fontFamily: "monospace" }}>
                            {order.id || order.orderId}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                            {order.trackingCode}
                          </div>
                        </td>

                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div>{order.customerName}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
                            <a
                              href={`tel:${(order.customerPhone || "").replace(/\s/g, "")}`}
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem"
                              }}
                            >
                              <Phone size={12} />
                              <span>{order.customerPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/213${(order.customerPhone || "")
                                .replace(/[^0-9]/g, "")
                                .replace(/^0/, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#25D366" }}
                            >
                              <MessageSquare size={13} />
                            </a>
                          </div>
                        </td>

                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div>{order.wilaya}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {order.customerAddress}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--accent-aqua)" }}>
                            {order.carrier || "Yalidine Express"}
                          </div>
                        </td>

                        <td style={{ padding: "0.85rem 1rem" }}>
                          {(order.items || []).map((it, idx) => (
                            <div key={idx} style={{ fontSize: "0.78rem" }}>
                              <span style={{ color: "var(--accent-aqua)" }}>{it.qty}×</span>{" "}
                              {it.name}
                            </div>
                          ))}
                        </td>

                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ fontSize: "0.92rem" }}>
                            {Number(order.totalDZD || 1800).toLocaleString("fr-FR")} DA
                          </div>
                          <span style={{ fontSize: "0.68rem", color: "#67C23A" }}>
                            COD Espèces
                          </span>
                        </td>

                        <td style={{ padding: "0.85rem 1rem" }}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              sendAdminAction(
                                "order",
                                "update_status",
                                {
                                  id: order.id || order.orderId,
                                  status: e.target.value
                                },
                                "Statut commande mis à jour !"
                              )
                            }
                            style={{
                              padding: "0.35rem 0.65rem",
                              border: `1px solid ${statusObj.color}`,
                              background: statusObj.bg,
                              color: statusObj.color,
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                              <option
                                key={k}
                                value={k}
                                style={{
                                  background: "var(--bg-card)",
                                  color: "var(--text-primary)"
                                }}
                              >
                                {cfg.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                          <button
                            onClick={() =>
                              sendAdminAction(
                                "order",
                                "delete",
                                { id: order.id || order.orderId },
                                "Commande supprimée."
                              )
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: FULL PRODUCTS CATALOG CRUD ==================== */}
        {activeTab === "products" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.2rem",
                flexWrap: "wrap",
                gap: "0.8rem"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 400 }}>
                  Gestion Intégrale du Catalogue & des Formules ({products.length})
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Ajoutez de nouveaux produits, modifiez les prix en DA, les pourcentages d&apos;actifs ou basculez n&apos;importe quelle formule « En Stock » / « Bientôt Disponible ». DermoScan AI™ se met à jour instantanément.
                </p>
              </div>

              <button
                onClick={() => openEditProductModal(null)}
                style={{
                  padding: "0.65rem 1.2rem",
                  background: "#4d7358",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem"
                }}
              >
                <Plus size={16} />
                <span>Ajouter un Nouveau Produit</span>
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "1.2rem"
              }}
            >
              {products.map((prod) => {
                const isAvailable =
                  prod.status === "available" || prod.status === "in_stock";
                return (
                  <div
                    key={prod.id}
                    style={{
                      background: "var(--bg-card)",
                      padding: "1.4rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.6rem"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.6rem",
                            background: isAvailable
                              ? "#4d7358"
                              : prod.status === "out_of_stock"
                              ? "rgba(245,108,108,0.18)"
                              : "var(--bg-secondary)",
                            color: isAvailable
                              ? "#ffffff"
                              : prod.status === "out_of_stock"
                              ? "#F56C6C"
                              : "var(--accent-aqua)"
                          }}
                        >
                          {isAvailable
                            ? "EN STOCK IMMÉDIAT"
                            : prod.status === "out_of_stock"
                            ? "RUPTURE DE STOCK"
                            : "BIENTÔT DISPONIBLE"}
                        </span>

                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {prod.volume}
                        </span>
                      </div>

                      <h4 style={{ fontSize: "1.08rem", fontWeight: 400, marginBottom: "0.25rem" }}>
                        {prod.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-secondary)",
                          marginBottom: "0.8rem"
                        }}
                      >
                        {prod.subtitle}
                      </p>

                      {/* Inline Quick Price & Status Controls */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                          marginBottom: "0.85rem",
                          padding: "0.75rem",
                          background: "var(--bg-secondary)"
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              display: "block",
                              marginBottom: "0.25rem"
                            }}
                          >
                            Prix (DA)
                          </label>
                          <input
                            type="number"
                            value={prod.priceDZD}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === prod.id ? { ...p, priceDZD: val } : p
                                )
                              );
                            }}
                            onBlur={(e) =>
                              sendAdminAction(
                                "product",
                                "upsert",
                                {
                                  ...prod,
                                  priceDZD: parseInt(e.target.value, 10) || 1800
                                },
                                `Prix de ${prod.name} mis à jour !`
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "0.45rem 0.6rem",
                              background: "var(--bg-input)",
                              color: "var(--text-primary)",
                              border: "none",
                              fontSize: "0.88rem"
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              display: "block",
                              marginBottom: "0.25rem"
                            }}
                          >
                            Statut Boutique
                          </label>
                          <select
                            value={prod.status}
                            onChange={(e) =>
                              sendAdminAction(
                                "product",
                                "upsert",
                                { ...prod, status: e.target.value },
                                `Statut de ${prod.name} mis à jour !`
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "0.45rem 0.6rem",
                              background: "var(--bg-input)",
                              color: "var(--text-primary)",
                              border: "none",
                              fontSize: "0.8rem"
                            }}
                          >
                            <option value="available">En Stock (Achetable)</option>
                            <option value="coming_soon">Bientôt Disponible</option>
                            <option value="out_of_stock">Rupture de Stock</option>
                          </select>
                        </div>
                      </div>

                      {/* Active Ingredients Tags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                          marginBottom: "1rem"
                        }}
                      >
                        {(prod.actives || []).map((a, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.2rem 0.5rem",
                              background: "var(--bg-secondary)",
                              color: "var(--accent-aqua)"
                            }}
                          >
                            {a.name} ({a.percentage})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.6rem",
                        paddingTop: "0.8rem",
                        borderTop: "1px solid var(--border-subtle)"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openEditProductModal(prod)}
                        style={{
                          flex: 1,
                          padding: "0.55rem 0.9rem",
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          border: "none",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Modifier Formule & Actifs</span>
                      </button>

                      {prod.id !== "soothing-gel-cream" && (
                        <button
                          type="button"
                          onClick={() =>
                            sendAdminAction(
                              "product",
                              "delete",
                              { id: prod.id },
                              "Formule supprimée."
                            )
                          }
                          style={{
                            padding: "0.55rem 0.75rem",
                            background: "rgba(245,108,108,0.12)",
                            color: "#F56C6C",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BUNDLES & PACKS CRUD ==================== */}
        {activeTab === "bundles" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
                flexWrap: "wrap",
                gap: "0.8rem"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 400 }}>
                  Packs Promotionnels & Offres Groupées ({bundles.length})
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Configurez les tarifs des packs Solo, Duo et Routine Complète ainsi que la livraison offerte.
                </p>
              </div>

              <button
                onClick={() => {
                  setBundleForm({
                    id: "",
                    name: "",
                    subtitle: "",
                    badge: "OFFRE SPÉCIALE",
                    priceDZD: 3400,
                    originalPriceDZD: 4200,
                    freeDelivery: true,
                    isPopular: false
                  });
                  setShowBundleModal(true);
                }}
                style={{
                  padding: "0.65rem 1.2rem",
                  background: "#4d7358",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Plus size={15} />
                <span>Créer un Pack</span>
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.2rem"
              }}
            >
              {bundles.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: "var(--bg-card)",
                    padding: "1.4rem",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--accent-aqua)",
                        background: "var(--bg-secondary)",
                        padding: "0.2rem 0.55rem"
                      }}
                    >
                      {typeof b.badge === "object" ? b.badge.fr : b.badge}
                    </span>
                    <button
                      onClick={() =>
                        sendAdminAction(
                          "bundle",
                          "delete",
                          { id: b.id },
                          "Pack supprimé."
                        )
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: "1.05rem", fontWeight: 400, marginBottom: "0.25rem" }}>
                    {typeof b.name === "object" ? b.name.fr : b.name}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.9rem" }}>
                    {typeof b.subtitle === "object" ? b.subtitle.fr : b.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={b.priceDZD}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setBundles((prev) =>
                          prev.map((item) =>
                            item.id === b.id ? { ...item, priceDZD: val } : item
                          )
                        );
                      }}
                      onBlur={(e) =>
                        sendAdminAction(
                          "bundle",
                          "upsert",
                          { ...b, priceDZD: parseInt(e.target.value, 10) || 1800 },
                          "Tarif du pack mis à jour !"
                        )
                      }
                      style={{
                        padding: "0.5rem 0.7rem",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        border: "none",
                        width: "120px"
                      }}
                    />
                    <span style={{ fontSize: "0.84rem" }}>DA</span>
                    <label
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.76rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(b.freeDelivery)}
                        onChange={(e) =>
                          sendAdminAction(
                            "bundle",
                            "upsert",
                            { ...b, freeDelivery: e.target.checked },
                            "Option livraison du pack mise à jour !"
                          )
                        }
                      />
                      <span>Livraison Gratuite</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: DERMOSCAN AI TELEMETRY LOGS ==================== */}
        {activeTab === "dermoscan" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
                flexWrap: "wrap",
                gap: "0.8rem"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 400 }}>
                  Journal Télémétrique DermoScan AI™ ({dermoscanLogs.length} consultations)
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Suivi anonymisé en temps réel des diagnostics cutanés réalisés sur la station DermoScan AI™ (zéro photo stockée).
                </p>
              </div>

              <button
                onClick={() =>
                  sendAdminAction(
                    "dermoscanLog",
                    "clear",
                    {},
                    "Historique télémétrique purgé."
                  )
                }
                className="btn-outline"
                style={{ padding: "0.55rem 1rem", fontSize: "0.8rem" }}
              >
                Vider le journal
              </button>
            </div>

            <div style={{ background: "var(--bg-card)", overflowX: "auto", boxShadow: "var(--shadow-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontSize: "0.72rem"
                    }}
                  >
                    <th style={{ padding: "0.8rem 1rem" }}>ID Scan / Date</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Wilaya & Climat</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Mode</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Diagnostic Cutané</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Hydratation</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Barrière</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Sébum / Rougeurs</th>
                  </tr>
                </thead>
                <tbody>
                  {dermoscanLogs.map((log, i) => (
                    <tr key={log.id || i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "0.8rem 1rem", fontFamily: "monospace", color: "var(--accent-aqua)" }}>
                        <div>{log.id}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {new Date(log.createdAt).toLocaleString("fr-FR")}
                        </div>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <div>{log.wilaya}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {log.climateZone}
                        </div>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            background: "var(--bg-secondary)",
                            fontSize: "0.72rem"
                          }}
                        >
                          {log.mode === "camera" ? "Caméra 3-Zones" : "Sans Caméra"}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>{log.skinType}</td>
                      <td style={{ padding: "0.8rem 1rem", color: "var(--accent-aqua)" }}>
                        {log.hydrationScore}/100
                      </td>
                      <td style={{ padding: "0.8rem 1rem", color: "#4d7358" }}>
                        {log.barrierIntegrityScore}/100
                      </td>
                      <td style={{ padding: "0.8rem 1rem", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                        {log.sebumLevel} • {log.rednessLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: REVIEWS & PARTNER PHARMACIES CRUD ==================== */}
        {activeTab === "reviews_pharmacies" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: "1.5rem"
            }}
          >
            {/* Customer Reviews Manager */}
            <div style={{ background: "var(--bg-card)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.12rem", fontWeight: 400, marginBottom: "0.8rem" }}>
                Avis Clients Vérifiés ({reviews.length})
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newReviewForm.author || !newReviewForm.comment) return;
                  const ok = await sendAdminAction(
                    "review",
                    "upsert",
                    newReviewForm,
                    "Nouvel avis client publié !"
                  );
                  if (ok) {
                    setNewReviewForm({
                      author: "",
                      location: "Alger (16)",
                      rating: 5,
                      product: "Lightweight Soothing Face Gel-Cream",
                      comment: ""
                    });
                  }
                }}
                style={{
                  display: "grid",
                  gap: "0.6rem",
                  marginBottom: "1.2rem",
                  padding: "1rem",
                  background: "var(--bg-secondary)"
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <input
                    type="text"
                    placeholder="Nom du client (ex: Amina K.)"
                    value={newReviewForm.author}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, author: e.target.value })
                    }
                    required
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Ville / Wilaya (ex: Oran (31))"
                    value={newReviewForm.location}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, location: e.target.value })
                    }
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Commentaire du client..."
                  value={newReviewForm.comment}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, comment: e.target.value })
                  }
                  required
                  style={{
                    padding: "0.55rem 0.75rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none",
                    fontSize: "0.8rem"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  + Ajouter l&apos;Avis Client
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: "0.85rem",
                      background: "var(--bg-secondary)",
                      opacity: rev.visible === false ? 0.5 : 1
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.3rem"
                      }}
                    >
                      <span style={{ fontSize: "0.84rem" }}>
                        {rev.author} —{" "}
                        <span style={{ color: "var(--accent-aqua)" }}>{rev.location}</span>
                      </span>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() =>
                            sendAdminAction(
                              "review",
                              "toggle_visibility",
                              { id: rev.id },
                              "Visibilité de l'avis modifiée."
                            )
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-secondary)",
                            cursor: "pointer"
                          }}
                        >
                          {rev.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() =>
                            sendAdminAction(
                              "review",
                              "delete",
                              { id: rev.id },
                              "Avis supprimé."
                            )
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#F56C6C",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      {typeof rev.comment === "object" ? rev.comment.fr : rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Pharmacies Manager */}
            <div style={{ background: "var(--bg-card)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.12rem", fontWeight: 400, marginBottom: "0.8rem" }}>
                Pharmacies & Parapharmacies Partenaires ({pharmacies.length})
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newPharmacyForm.name) return;
                  const ok = await sendAdminAction(
                    "pharmacy",
                    "upsert",
                    newPharmacyForm,
                    "Pharmacie partenaire ajoutée !"
                  );
                  if (ok) {
                    setNewPharmacyForm({
                      name: "",
                      city: "Alger",
                      wilaya: "16 - Alger",
                      address: "",
                      phone: "+213 "
                    });
                  }
                }}
                style={{
                  display: "grid",
                  gap: "0.6rem",
                  marginBottom: "1.2rem",
                  padding: "1rem",
                  background: "var(--bg-secondary)"
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <input
                    type="text"
                    placeholder="Nom de la Pharmacie"
                    value={newPharmacyForm.name}
                    onChange={(e) =>
                      setNewPharmacyForm({ ...newPharmacyForm, name: e.target.value })
                    }
                    required
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                  <select
                    value={newPharmacyForm.wilaya}
                    onChange={(e) =>
                      setNewPharmacyForm({
                        ...newPharmacyForm,
                        wilaya: e.target.value,
                        city: e.target.value.split(" - ")[1] || e.target.value
                      })
                    }
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <input
                    type="text"
                    placeholder="Adresse complète"
                    value={newPharmacyForm.address}
                    onChange={(e) =>
                      setNewPharmacyForm({ ...newPharmacyForm, address: e.target.value })
                    }
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newPharmacyForm.phone}
                    onChange={(e) =>
                      setNewPharmacyForm({ ...newPharmacyForm, phone: e.target.value })
                    }
                    style={{
                      padding: "0.55rem 0.75rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  + Ajouter la Pharmacie Partenaire
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {pharmacies.map((ph) => (
                  <div
                    key={ph.id}
                    style={{
                      padding: "0.85rem",
                      background: "var(--bg-secondary)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.86rem" }}>
                        {ph.name} ({ph.wilaya})
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                        {ph.address} • {ph.phone}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() =>
                          sendAdminAction(
                            "pharmacy",
                            "upsert",
                            { ...ph, inStock: !ph.inStock },
                            "Disponibilité pharmacie mise à jour."
                          )
                        }
                        style={{
                          padding: "0.25rem 0.55rem",
                          background: ph.inStock ? "#4d7358" : "var(--bg-card)",
                          color: ph.inStock ? "#ffffff" : "var(--text-muted)",
                          border: "none",
                          fontSize: "0.7rem",
                          cursor: "pointer"
                        }}
                      >
                        {ph.inStock ? "En Stock" : "Rupture"}
                      </button>
                      <button
                        onClick={() =>
                          sendAdminAction(
                            "pharmacy",
                            "delete",
                            { id: ph.id },
                            "Pharmacie retirée."
                          )
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#F56C6C",
                          cursor: "pointer"
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: LEADS & VIP WAITLIST CRUD ==================== */}
        {activeTab === "leads" && (
          <div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newLeadForm.contact) return;
                const ok = await sendAdminAction(
                  "lead",
                  "create",
                  newLeadForm,
                  "Prospect ajouté !"
                );
                if (ok) {
                  setNewLeadForm({
                    productName: "Anti-aging Serum",
                    contact: "",
                    wilaya: "16 - Alger",
                    source: "Admin Manuel"
                  });
                }
              }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
                marginBottom: "1.2rem",
                background: "var(--bg-card)",
                padding: "1rem"
              }}
            >
              <input
                type="text"
                placeholder="Email ou Téléphone du prospect..."
                value={newLeadForm.contact}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, contact: e.target.value })
                }
                required
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "0.6rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none",
                  fontSize: "0.82rem"
                }}
              />
              <select
                value={newLeadForm.wilaya}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, wilaya: e.target.value })
                }
                style={{
                  padding: "0.6rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none",
                  fontSize: "0.82rem"
                }}
              >
                {ALGERIAN_WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1.1rem",
                  background: "#4d7358",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                + Ajouter Prospect
              </button>
            </form>

            <div style={{ background: "var(--bg-card)", overflowX: "auto", boxShadow: "var(--shadow-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontSize: "0.72rem"
                    }}
                  >
                    <th style={{ padding: "0.8rem 1rem" }}>ID</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Formule Souhaitée</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Contact Client</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Wilaya</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Source</th>
                    <th style={{ padding: "0.8rem 1rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "0.8rem 1rem", fontFamily: "monospace", color: "var(--accent-aqua)" }}>
                        {lead.id}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        {lead.productName || lead.productId}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>{lead.contact}</td>
                      <td style={{ padding: "0.8rem 1rem" }}>{lead.wilaya}</td>
                      <td style={{ padding: "0.8rem 1rem" }}>{lead.source}</td>
                      <td style={{ padding: "0.8rem 1rem", textAlign: "right" }}>
                        <button
                          onClick={() =>
                            sendAdminAction(
                              "lead",
                              "delete",
                              { id: lead.id },
                              "Prospect supprimé."
                            )
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#F56C6C",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: LOGISTICS 58 WILAYAS ==================== */}
        {activeTab === "logistics" && (
          <div style={{ background: "var(--bg-card)", padding: "1.6rem", maxWidth: "740px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "0.4rem" }}>
              Tarification Logistique & Livraison 58 Wilayas (DZD)
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.3rem" }}>
              Ajustez les frais de livraison COD par zone géographique et le seuil de gratuité.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.3rem"
              }}
            >
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Zone 1 — Alger (16) (DA)
                </label>
                <input
                  type="number"
                  value={siteConfig.algerDeliveryFee}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      algerDeliveryFee: parseInt(e.target.value, 10) || 0
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Zone 2 — Littoral & Métropoles (DA)
                </label>
                <input
                  type="number"
                  value={siteConfig.northDeliveryFee}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      northDeliveryFee: parseInt(e.target.value, 10) || 0
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Zone 3 — Hauts-Plateaux (DA)
                </label>
                <input
                  type="number"
                  value={siteConfig.highPlateauDeliveryFee}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      highPlateauDeliveryFee: parseInt(e.target.value, 10) || 0
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Zone 4 — Grand Sud & Sahara (DA)
                </label>
                <input
                  type="number"
                  value={siteConfig.southDeliveryFee}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      southDeliveryFee: parseInt(e.target.value, 10) || 0
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
              </div>
            </div>

            <button
              onClick={() =>
                sendAdminAction(
                  "siteConfig",
                  "update",
                  siteConfig,
                  "Grille tarifaire 58 Wilayas enregistrée !"
                )
              }
              style={{
                padding: "0.75rem 1.4rem",
                background: "#4d7358",
                color: "#ffffff",
                border: "none",
                fontSize: "0.86rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem"
              }}
            >
              <Save size={15} />
              <span>Enregistrer la Logistique</span>
            </button>
          </div>
        )}

        {/* ==================== TAB 8: CMS CONTENT & MONGODB CONFIG ==================== */}
        {activeTab === "settings" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "1.5rem"
            }}
          >
            {/* CMS Storefront Settings */}
            <div style={{ background: "var(--bg-card)", padding: "1.6rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "1rem" }}>
                CMS Contenu Boutique & Coordonnées
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                    Bandeau d&apos;Annonce Supérieur
                  </label>
                  <input
                    type="text"
                    value={siteConfig.announcementText}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, announcementText: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                    Titre Principal (Hero / Validation)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroHeadline}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, heroHeadline: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                    Paragraphe Officiel
                  </label>
                  <textarea
                    rows={3}
                    value={siteConfig.heroParagraph}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, heroParagraph: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                      Téléphone Support WhatsApp
                    </label>
                    <input
                      type="text"
                      value={siteConfig.supportPhone}
                      onChange={(e) =>
                        setSiteConfig({ ...siteConfig, supportPhone: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        border: "none",
                        fontSize: "0.83rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                      Nouveau Code PIN Admin (Haché PBKDF2)
                    </label>
                    <input
                      type="password"
                      value={siteConfig.newAdminPin || ""}
                      placeholder="Laisser vide pour conserver le PIN actuel"
                      onChange={(e) =>
                        setSiteConfig({ ...siteConfig, newAdminPin: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        border: "none",
                        fontSize: "0.83rem"
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    sendAdminAction(
                      "siteConfig",
                      "update",
                      siteConfig,
                      "Configuration CMS enregistrée sur le serveur !"
                    )
                  }
                  style={{
                    padding: "0.75rem 1.3rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem"
                  }}
                >
                  <Save size={15} />
                  <span>Enregistrer le CMS</span>
                </button>
              </div>
            </div>

            {/* MongoDB & Node.js Persistence Engine Panel */}
            <div style={{ background: "var(--bg-card)", padding: "1.6rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "0.5rem" }}>
                Moteur Backend Node.js & Base MongoDB
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Vos données sont persistées en temps réel via Mongoose (MongoDB) avec réplication automatique sur disque serveur (`data/anjucia-db.json`).
              </p>

              <div
                style={{
                  padding: "0.9rem",
                  background: "var(--bg-secondary)",
                  marginBottom: "1rem",
                  fontSize: "0.8rem"
                }}
              >
                <div style={{ marginBottom: "0.3rem" }}>
                  État MongoDB :{" "}
                  <span
                    style={{
                      color: mongoStatus.isConnected ? "#67C23A" : "var(--accent-aqua)"
                    }}
                  >
                    {mongoStatus.isConnected
                      ? "● Connecté au cluster MongoDB"
                      : "● Persistance Hybride Node.js Active (Prêt pour URI MongoDB Atlas/Local)"}
                  </span>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  URI Cible : {mongoStatus.uri}
                </div>
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>
                  Connecter un Cluster MongoDB Atlas ou Local (MONGODB_URI)
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={customMongoUri}
                    onChange={(e) => setCustomMongoUri(e.target.value)}
                    placeholder="mongodb+srv://user:pass@cluster.mongodb.net/anjucia"
                    style={{
                      flex: 1,
                      padding: "0.65rem 0.85rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.8rem"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      sendAdminAction(
                        "mongodb",
                        "connect",
                        { uri: customMongoUri },
                        "Connexion MongoDB mise à jour !"
                      )
                    }
                    className="btn-aqua"
                    style={{ padding: "0.65rem 1rem", fontSize: "0.8rem" }}
                  >
                    Connecter
                  </button>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Réinitialiser toutes les collections aux valeurs d'usine Anjucia ?"
                      )
                    ) {
                      sendAdminAction(
                        "reset",
                        "factory_reset",
                        {},
                        "Base de données réinitialisée aux valeurs d'usine !"
                      );
                    }
                  }}
                  style={{
                    padding: "0.6rem 1rem",
                    background: "rgba(245,108,108,0.12)",
                    color: "#F56C6C",
                    border: "none",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  Réinitialiser la Base de Données (Valeurs d&apos;Usine)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL CREATE / EDIT PRODUCT ==================== */}
      {showProductModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.68)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto"
          }}
          onClick={() => setShowProductModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "580px",
              background: "var(--bg-card)",
              padding: "1.8rem",
              maxHeight: "92vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 400, marginBottom: "1rem" }}>
              {productForm.id ? `Modifier : ${productForm.name}` : "Créer une Nouvelle Formule Anjucia"}
            </h3>

            <form
              onSubmit={handleSaveProductModal}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Nom Officiel du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Catégorie
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  >
                    <option value="hydratation">Hydratation</option>
                    <option value="anti-age">Anti-Âge</option>
                    <option value="solaire">Solaire SPF</option>
                    <option value="reparation">Réparation</option>
                    <option value="nettoyant">Nettoyant</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Prix (DA) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.priceDZD}
                    onChange={(e) =>
                      setProductForm({ ...productForm, priceDZD: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Volume
                  </label>
                  <input
                    type="text"
                    value={productForm.volume}
                    onChange={(e) =>
                      setProductForm({ ...productForm, volume: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Statut
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({ ...productForm, status: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      border: "none",
                      fontSize: "0.83rem"
                    }}
                  >
                    <option value="available">En Stock (Achetable)</option>
                    <option value="coming_soon">Bientôt Disponible</option>
                    <option value="out_of_stock">Rupture de Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Sous-titre Clinique
                </label>
                <input
                  type="text"
                  value={productForm.subtitle}
                  onChange={(e) =>
                    setProductForm({ ...productForm, subtitle: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none",
                    fontSize: "0.83rem"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Actifs & Dosages (1 par ligne : Nom | % | Rôle)
                </label>
                <textarea
                  rows={4}
                  value={productForm.activesText}
                  onChange={(e) =>
                    setProductForm({ ...productForm, activesText: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none",
                    fontSize: "0.8rem",
                    fontFamily: "monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none",
                    fontSize: "0.82rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: "0.75rem" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Enregistrer le Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL CREATE BUNDLE ==================== */}
      {showBundleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.68)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setShowBundleModal(false)}
        >
          <div
            style={{ width: "100%", maxWidth: "460px", background: "var(--bg-card)", padding: "1.8rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "1rem" }}>
              Créer un Nouveau Pack Promotionnel
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const ok = await sendAdminAction(
                  "bundle",
                  "upsert",
                  bundleForm,
                  "Pack créé avec succès !"
                );
                if (ok) setShowBundleModal(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
            >
              <input
                type="text"
                placeholder="Nom du Pack (ex: Pack Duo Éclat)"
                required
                value={bundleForm.name}
                onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none"
                }}
              />
              <input
                type="text"
                placeholder="Sous-titre (ex: 2x Gel-Crème 50 ml)"
                value={bundleForm.subtitle}
                onChange={(e) =>
                  setBundleForm({ ...bundleForm, subtitle: e.target.value })
                }
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none"
                }}
              />
              <input
                type="number"
                placeholder="Prix du Pack (DA)"
                required
                value={bundleForm.priceDZD}
                onChange={(e) =>
                  setBundleForm({ ...bundleForm, priceDZD: e.target.value })
                }
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none"
                }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowBundleModal(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: "0.7rem" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.7rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Créer le Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL NOUVELLE COMMANDE MANUELLE ==================== */}
      {showNewOrderModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.68)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setShowNewOrderModal(false)}
        >
          <div
            style={{ width: "100%", maxWidth: "480px", background: "var(--bg-card)", padding: "1.8rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 400, marginBottom: "1rem" }}>
              Ajouter une Commande Manuelle
            </h3>
            <form
              onSubmit={handleCreateManualOrder}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            >
              <input
                type="text"
                required
                placeholder="Nom complet du client *"
                value={newOrderForm.customerName}
                onChange={(e) =>
                  setNewOrderForm({ ...newOrderForm, customerName: e.target.value })
                }
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none"
                }}
              />
              <input
                type="tel"
                required
                placeholder="Téléphone *"
                value={newOrderForm.customerPhone}
                onChange={(e) =>
                  setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })
                }
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none"
                }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <select
                  value={newOrderForm.wilaya}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, wilaya: e.target.value })
                  }
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>

                <select
                  value={newOrderForm.productId}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, productId: e.target.value })
                  }
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.priceDZD} DA)
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="Adresse / Commune"
                  value={newOrderForm.customerAddress}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, customerAddress: e.target.value })
                  }
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newOrderForm.qty}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, qty: e.target.value })
                  }
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: "0.75rem" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Enregistrer Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
