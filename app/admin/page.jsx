"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Users,
  Settings,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Phone,
  MessageSquare,
  AlertCircle,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit2,
  Save,
  Check,
  Layers,
  Sparkles,
  Sliders
} from "lucide-react";
import AnjuciaLogo, { DropletMark } from "../components/brand/AnjuciaLogo";
import { ANJUCIA_PRODUCTS, ALGERIAN_WILAYAS } from "../data/products";
import { mock, INITIAL_ORDERS } from "../services/mockApi";
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

export default function AdminDashboardPage() {
  const { showToast } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("orders"); // orders | products | leads | logistics | settings

  // Orders State
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [wilayaFilter, setWilayaFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    wilaya: "16 - Alger",
    commune: "",
    qty: 1,
    carrier: "Yalidine Express"
  });

  // Flagship Product Management
  const [flagshipPrice, setFlagshipPrice] = useState(1800);
  const [flagshipInStock, setFlagshipInStock] = useState(true);
  const [flagshipBadge, setFlagshipBadge] = useState("FORMULATION AVANCÉE");
  const [priceSaving, setPriceSaving] = useState(false);

  // Leads State
  const [leads, setLeads] = useState([]);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    announcementText: "Livraison 58 Wilayas • Paiement à la livraison (COD) • Formule Clinique Haute Tolérance",
    supportPhone: "+213 550 12 34 56",
    freeShippingThreshold: 2,
    enableFreeShippingPromo: true,
    algerDeliveryFee: 400,
    northDeliveryFee: 600,
    southDeliveryFee: 850
  });

  // Check existing session
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem("anjucia_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    } catch (_) {}
  }, []);

  // Load store data on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAllData();
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      // 1. Orders
      const list = await mock.orders.list();
      setOrders(list || []);

      // 2. Leads
      const storedLeads = localStorage.getItem("anjucia_waitlist_leads");
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      } else {
        // Mock sample leads
        const sampleLeads = [
          {
            id: "LEAD-101",
            productId: "cerahydra-cream-50",
            productName: "CeraHydra+ Cellular Barrier Cream",
            contact: "souad.k@gmail.com",
            wilaya: "16 - Alger",
            source: "ComingSoonCard",
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
          },
          {
            id: "LEAD-102",
            productId: "bioshield-spf50",
            productName: "BioShield Fluide Invisible SPF 50+",
            contact: "0662 44 55 66",
            wilaya: "31 - Oran",
            source: "ComingSoonCard",
            createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
          },
          {
            id: "LEAD-103",
            productId: "vip-club-access",
            productName: "Club VIP Anjucia",
            contact: "dr.cherif@sante.dz",
            wilaya: "25 - Constantine",
            source: "Profile VIP Waitlist",
            createdAt: new Date(Date.now() - 3600000 * 42).toISOString()
          }
        ];
        setLeads(sampleLeads);
        localStorage.setItem("anjucia_waitlist_leads", JSON.stringify(sampleLeads));
      }

      // 3. Product Custom Settings
      const customPrice = localStorage.getItem("anjucia_custom_price");
      if (customPrice) setFlagshipPrice(parseInt(customPrice, 10));

      const customStock = localStorage.getItem("anjucia_custom_stock");
      if (customStock !== null) setFlagshipInStock(customStock === "true");

      // 4. Store Settings
      const savedSettings = localStorage.getItem("anjucia_store_settings");
      if (savedSettings) setStoreSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.warn("Could not load admin data", e);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === "anjucia2026" || pinInput === "admin" || pinInput === "1800") {
      setIsAuthenticated(true);
      setPinError(false);
      try {
        sessionStorage.setItem("anjucia_admin_auth", "true");
      } catch (_) {}
      showToast("Bienvenue sur le panneau d'administration Anjucia");
    } else {
      setPinError(true);
    }
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem("anjucia_admin_auth", "true");
    } catch (_) {}
    showToast("Accès administrateur démo déverrouillé");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("anjucia_admin_auth");
    } catch (_) {}
    showToast("Session déconnectée");
  };

  // Orders Filter
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerPhone || "").includes(searchTerm) ||
        (o.id || o.orderId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.wilaya || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchWilaya = wilayaFilter === "ALL" || (o.wilaya || "").includes(wilayaFilter);

      return matchSearch && matchStatus && matchWilaya;
    });
  }, [orders, searchTerm, statusFilter, wilayaFilter]);

  // KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (o.totalDZD || 1800), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === "PENDING_VERIFICATION" || o.status === "CONFIRMED_PREPARING").length;
  }, [orders]);

  const deliveredCount = useMemo(() => {
    return orders.filter((o) => o.status === "DELIVERED").length;
  }, [orders]);

  // Order Actions
  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await mock.orders.updateStatus(orderId, newStatus);
    setOrders([...updated]);
    showToast(`Statut de la commande mis à jour : ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Confirmer la suppression de cette commande ?")) {
      const updated = await mock.orders.delete(orderId);
      setOrders([...updated]);
      showToast("Commande supprimée.");
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  const handleCreateManualOrder = async (e) => {
    e.preventDefault();
    if (!newOrderForm.customerName || !newOrderForm.customerPhone) {
      showToast("Veuillez renseigner le nom et le numéro du client", "error");
      return;
    }

    const order = await mock.orders.create({
      customerName: newOrderForm.customerName,
      customerPhone: newOrderForm.customerPhone,
      customerAddress: newOrderForm.customerAddress || newOrderForm.commune || "Centre-ville",
      wilaya: newOrderForm.wilaya,
      commune: newOrderForm.commune,
      carrier: newOrderForm.carrier,
      items: [
        {
          id: "soothing-gel-cream",
          name: "Lightweight Soothing Face Gel-Cream 50ml",
          qty: newOrderForm.qty,
          priceDZD: flagshipPrice
        }
      ],
      totalDZD: flagshipPrice * newOrderForm.qty
    });

    setOrders((prev) => [order, ...prev]);
    setShowNewOrderModal(false);
    setNewOrderForm({
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      wilaya: "16 - Alger",
      commune: "",
      qty: 1,
      carrier: "Yalidine Express"
    });
    showToast("Nouvelle commande enregistrée avec succès !");
  };

  // Flagship Product Save
  const handleSaveProductConfig = () => {
    setPriceSaving(true);
    try {
      localStorage.setItem("anjucia_custom_price", flagshipPrice.toString());
      localStorage.setItem("anjucia_custom_stock", flagshipInStock.toString());
      window.dispatchEvent(new CustomEvent("anjucia:price_updated", { detail: { price: flagshipPrice, inStock: flagshipInStock } }));
      setTimeout(() => {
        setPriceSaving(false);
        showToast(`Tarif boutique enregistré : ${flagshipPrice} DA (${flagshipInStock ? "En stock" : "Rupture"})`);
      }, 400);
    } catch (_) {
      setPriceSaving(false);
    }
  };

  // Export to CSV
  const exportOrdersCSV = () => {
    const headers = ["ID Commande", "Date", "Client", "Telephone", "Wilaya", "Adresse", "Articles", "Total DZD", "Statut", "Transporteur"];
    const rows = orders.map((o) => [
      o.id || o.orderId,
      new Date(o.createdAt).toLocaleDateString("fr-FR"),
      `"${o.customerName || ""}"`,
      `"${o.customerPhone || ""}"`,
      `"${o.wilaya || ""}"`,
      `"${(o.customerAddress || "").replace(/"/g, '""')}"`,
      o.items ? o.items.map((i) => `${i.qty}x ${i.name}`).join(" + ") : "1x Gel-Crème",
      o.totalDZD || 1800,
      STATUS_CONFIG[o.status]?.label || o.status,
      o.carrier || "Yalidine Express"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anjucia_commandes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV généré avec succès !");
  };

  const exportLeadsCSV = () => {
    const headers = ["ID", "Formule d'intérêt", "Contact Client", "Wilaya", "Date", "Source"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.productName || l.productId}"`,
      `"${l.contact}"`,
      `"${l.wilaya || ""}"`,
      new Date(l.createdAt).toLocaleDateString("fr-FR"),
      l.source || "Web"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anjucia_prospects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Liste des prospects exportée !");
  };

  const handleResetDefaults = async () => {
    if (confirm("Réinitialiser les commandes et paramètres aux valeurs d'usine ?")) {
      const reset = await mock.orders.resetDefaults();
      setOrders(reset);
      setFlagshipPrice(1800);
      setFlagshipInStock(true);
      localStorage.removeItem("anjucia_custom_price");
      localStorage.removeItem("anjucia_custom_stock");
      showToast("Données réinitialisées.");
    }
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "var(--bg-primary)" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "22px",
            padding: "2.5rem 2rem",
            boxShadow: "var(--shadow-md)",
            textAlign: "center"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "18px", background: "var(--accent-aqua-subtle)", color: "var(--accent-aqua)", marginBottom: "1.2rem" }}>
            <DropletMark size={38} color="var(--accent-aqua)" />
          </div>

          <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
            Administration Anjucia
          </h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1.8rem" }}>
            Portail de gestion des commandes, formules et logistique 58 Wilayas.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                Code PIN Administrateur
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Entrez le code PIN (ex: anjucia2026)"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  border: pinError ? "2px solid #F56C6C" : "1px solid var(--border-light)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  outline: "none"
                }}
                autoFocus
              />
              {pinError && (
                <span style={{ fontSize: "0.74rem", color: "#F56C6C", fontWeight: 700, marginTop: "0.4rem", display: "block" }}>
                  Code PIN incorrect. Utilisez « anjucia2026 » ou le bouton ci-dessous.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-aqua"
              style={{
                width: "100%",
                padding: "0.9rem",
                borderRadius: "12px",
                fontSize: "0.92rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.8rem"
              }}
            >
              <ShieldCheck size={18} />
              <span>Accéder au Panneau</span>
            </button>
          </form>

          <button
            onClick={handleDemoLogin}
            type="button"
            className="btn-outline"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "12px",
              fontSize: "0.82rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            <Sparkles size={14} color="var(--accent-aqua)" />
            <span>Connexion Rapide Démo (1-Clic)</span>
          </button>

          <div style={{ marginTop: "1.8rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              ← Retourner à la boutique publique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", paddingBottom: "5rem" }}>
      {/* Top Header */}
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <AnjuciaLogo size={22} />
            </Link>
            <div style={{ height: "20px", width: "1px", background: "var(--border-light)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-aqua)", background: "var(--accent-aqua-subtle)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
                Admin Portal
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "none" }}>Alger GMT+1</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={loadAllData}
              title="Rafraîchir les données"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-light)",
                borderRadius: "9px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={15} />
            </button>

            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "9px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                fontSize: "0.78rem",
                fontWeight: 700,
                textDecoration: "none"
              }}
            >
              <span>Voir la Boutique</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "9px",
                background: "rgba(245, 108, 108, 0.1)",
                border: "1px solid rgba(245, 108, 108, 0.3)",
                color: "#F56C6C",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <LogOut size={13} />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div style={{ maxWidth: "1280px", margin: "1.4rem auto 0", padding: "0 1.2rem" }}>
        {/* KPI Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {/* Revenue */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Chiffre d'Affaires</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(103, 194, 58, 0.12)", color: "#67C23A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {totalRevenue.toLocaleString("fr-FR")} <span style={{ fontSize: "0.95rem", color: "var(--accent-aqua)" }}>DA</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              Encaissé / Confirmé à la livraison (COD)
            </div>
          </div>

          {/* Orders Count */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Commandes</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-aqua-subtle)", color: "var(--accent-aqua)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {orders.length}
            </div>
            <div style={{ fontSize: "0.72rem", color: pendingCount > 0 ? "#E6A23C" : "var(--text-muted)", marginTop: "0.3rem", fontWeight: 700 }}>
              {pendingCount} en attente de vérification / envoi
            </div>
          </div>

          {/* Active Product */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Produit Phare Actif</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(113, 159, 183, 0.15)", color: "var(--accent-aqua)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DropletMark size={18} color="var(--accent-aqua)" />
              </div>
            </div>
            <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {flagshipPrice} <span style={{ fontSize: "0.95rem", color: "var(--accent-aqua)" }}>DA</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: flagshipInStock ? "#67C23A" : "#F56C6C", marginTop: "0.3rem", fontWeight: 700 }}>
              {flagshipInStock ? "● En stock (Commandes ouvertes)" : "● Rupture temporaire"}
            </div>
          </div>

          {/* Waitlist Leads */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", padding: "1.2rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Prospects & Waitlist</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(180, 130, 240, 0.12)", color: "#9B51E0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {leads.length}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              Inscrits aux alertes formules futures
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "0.2rem" }}>
          {[
            { id: "orders", label: "Commandes & Expéditions", icon: Package, count: orders.length },
            { id: "products", label: "Catalogue & Tarifs", icon: Layers, count: 1 },
            { id: "leads", label: "Listes d'Attente (Leads)", icon: Users, count: leads.length },
            { id: "logistics", label: "Wilayas & Logistique", icon: Truck },
            { id: "settings", label: "Paramètres Boutique", icon: Settings }
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
                  borderBottom: isActive ? "2px solid var(--accent-aqua)" : "2px solid transparent",
                  color: isActive ? "var(--accent-aqua)" : "var(--text-secondary)",
                  padding: "0.65rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 900 : 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  borderRadius: "8px 8px 0 0"
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.45rem",
                      borderRadius: "9999px",
                      background: isActive ? "var(--accent-aqua)" : "var(--bg-secondary)",
                      color: isActive ? "var(--text-inverse)" : "var(--text-muted)"
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: COMMANDES ==================== */}
        {activeTab === "orders" && (
          <div>
            {/* Action Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flex: 1, minWidth: "260px" }}>
                {/* Search */}
                <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
                  <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher client, tél, wilaya, réf..."
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.8rem 0.55rem 2.2rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "0.55rem 0.8rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    outline: "none"
                  }}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="PENDING_VERIFICATION">À Vérifier</option>
                  <option value="CONFIRMED_PREPARING">Confirmée / Préparation</option>
                  <option value="SHIPPED">Expédiée (Yalidine)</option>
                  <option value="DELIVERED">Livrée & Encaissée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>

                {/* Wilaya Filter */}
                <select
                  value={wilayaFilter}
                  onChange={(e) => setWilayaFilter(e.target.value)}
                  style={{
                    padding: "0.55rem 0.8rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    outline: "none"
                  }}
                >
                  <option value="ALL">Toutes les 58 Wilayas</option>
                  <option value="16 - Alger">16 - Alger</option>
                  <option value="31 - Oran">31 - Oran</option>
                  <option value="25 - Constantine">25 - Constantine</option>
                  <option value="06 - Béjaïa">06 - Béjaïa</option>
                  <option value="19 - Sétif">19 - Sétif</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button
                  onClick={exportOrdersCSV}
                  className="btn-outline"
                  style={{ padding: "0.55rem 0.9rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Download size={14} />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={() => setShowNewOrderModal(true)}
                  className="btn-aqua"
                  style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Plus size={15} />
                  <span>Nouvelle Commande</span>
                </button>
              </div>
            </div>

            {/* Orders Table Card */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                      <th style={{ padding: "0.8rem 1rem" }}>Réf. / Date</th>
                      <th style={{ padding: "0.8rem 1rem" }}>Client & Coordonnées</th>
                      <th style={{ padding: "0.8rem 1rem" }}>Wilaya & Livraison</th>
                      <th style={{ padding: "0.8rem 1rem" }}>Article(s)</th>
                      <th style={{ padding: "0.8rem 1rem" }}>Total (DZD)</th>
                      <th style={{ padding: "0.8rem 1rem" }}>Statut Commande</th>
                      <th style={{ padding: "0.8rem 1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
                          Aucune commande trouvée selon vos filtres.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusObj = STATUS_CONFIG[order.status] || STATUS_CONFIG.CONFIRMED_PREPARING;
                        const StatusIcon = statusObj.icon;
                        const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        return (
                          <tr
                            key={order.id || order.orderId}
                            style={{
                              borderBottom: "1px solid var(--border-subtle)",
                              transition: "background-color 0.15s ease"
                            }}
                          >
                            {/* Ref & Date */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              <div style={{ fontWeight: 800, color: "var(--accent-aqua)", fontFamily: "monospace" }}>
                                {order.id || order.orderId}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                                {orderDate}
                              </div>
                              {order.trackingCode && (
                                <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "0.2rem", fontWeight: 700 }}>
                                  Suivi : {order.trackingCode}
                                </div>
                              )}
                            </td>

                            {/* Customer */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                                {order.customerName}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
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
                                  href={`https://wa.me/213${(order.customerPhone || "").replace(/[^0-9]/g, "").replace(/^0/, "")}`}
                                  target="_blank"
                                  title="Ouvrir WhatsApp"
                                  style={{ color: "#25D366" }}
                                >
                                  <MessageSquare size={13} />
                                </a>
                              </div>
                            </td>

                            {/* Wilaya & Address */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                                {order.wilaya}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                                {order.customerAddress || order.commune || "À domicile"}
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "var(--accent-aqua)", marginTop: "0.2rem", fontWeight: 700 }}>
                                {order.carrier || "Yalidine Express"}
                              </div>
                            </td>

                            {/* Items */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              {order.items && order.items.length > 0 ? (
                                order.items.map((it, idx) => (
                                  <div key={idx} style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.78rem" }}>
                                    <span style={{ color: "var(--accent-aqua)" }}>{it.qty}x</span> {it.name || "Gel-Crème 50ml"}
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontWeight: 700 }}>1x Gel-Crème 50ml</div>
                              )}
                            </td>

                            {/* Total */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              <div style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "0.92rem" }}>
                                {(order.totalDZD || 1800).toLocaleString("fr-FR")} DA
                              </div>
                              <span style={{ fontSize: "0.68rem", color: "#67C23A", fontWeight: 800 }}>
                                COD (Espèces)
                              </span>
                            </td>

                            {/* Status Selector */}
                            <td style={{ padding: "0.85rem 1rem" }}>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id || order.orderId, e.target.value)}
                                style={{
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: "9999px",
                                  border: `1px solid ${statusObj.color}`,
                                  background: statusObj.bg,
                                  color: statusObj.color,
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  outline: "none"
                                }}
                              >
                                {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                                  <option key={k} value={k} style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>
                                    {cfg.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                              <button
                                onClick={() => handleDeleteOrder(order.id || order.orderId)}
                                title="Supprimer la commande"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "var(--text-muted)",
                                  cursor: "pointer",
                                  padding: "0.3rem"
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: CATALOGUE & TARIFS ==================== */}
        {activeTab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {/* Live Flagship Product Manager */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "18px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-aqua)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Produit Actuel en Vente
                  </span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                    Gel-Crème Apaisant Ultra-Léger 50ml
                  </h3>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DropletMark size={24} color="var(--accent-aqua)" />
                </div>
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  Prix de Vente Public (DZD)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <input
                    type="number"
                    value={flagshipPrice}
                    onChange={(e) => setFlagshipPrice(parseInt(e.target.value, 10) || 0)}
                    step="50"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "1.1rem",
                      fontWeight: 900,
                      outline: "none"
                    }}
                  />
                  <span style={{ fontWeight: 800, color: "var(--text-secondary)", fontSize: "0.95rem" }}>DA</span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
                  Modifie instantanément le prix dans le panier, l'écran d'accueil et le récapitulatif.
                </span>
              </div>

              {/* Stock Toggle */}
              <div style={{ marginBottom: "1.4rem", padding: "1rem", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                      Disponibilité à la Vente
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {flagshipInStock ? "Les clients peuvent commander normalement." : "Affiche « Rupture Temporaire » et désactive le bouton commander."}
                    </div>
                  </div>
                  <button
                    onClick={() => setFlagshipInStock(!flagshipInStock)}
                    style={{
                      padding: "0.45rem 0.9rem",
                      borderRadius: "9999px",
                      border: "none",
                      background: flagshipInStock ? "var(--success)" : "#F56C6C",
                      color: "#11171A",
                      fontWeight: 900,
                      fontSize: "0.78rem",
                      cursor: "pointer"
                    }}
                  >
                    {flagshipInStock ? "En Stock ✓" : "Rupture ✕"}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProductConfig}
                disabled={priceSaving}
                className="btn-aqua"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                {priceSaving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
                <span>Enregistrer les Modifications</span>
              </button>
            </div>

            {/* Pipeline of Coming Soon Formulas */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "18px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ marginBottom: "1.2rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Pipeline R&D & Formulations
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                  Formules Futures (Coming Soon)
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {ANJUCIA_PRODUCTS.filter((p) => p.status === "coming_soon").map((prod) => {
                  const subscribersCount = leads.filter((l) => l.productId === prod.id).length;
                  return (
                    <div
                      key={prod.id}
                      style={{
                        padding: "0.9rem",
                        borderRadius: "12px",
                        border: "1px dashed var(--border-light)",
                        background: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.8rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <DropletMark size={16} color="var(--accent-aqua)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {prod.volume} • {prod.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-aqua)", background: "var(--accent-aqua-subtle)", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                          {subscribersCount} inscrit(s)
                        </span>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                          Lancement Q2-Q3
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: LISTES D'ATTENTE (LEADS) ==================== */}
        {activeTab === "leads" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)" }}>
                  Prospects & Inscriptions aux Formules
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Clients intéressés ayant cliqué sur « Me prévenir » ou inscrits au Club VIP.
                </p>
              </div>

              <button
                onClick={exportLeadsCSV}
                className="btn-outline"
                style={{ padding: "0.55rem 0.9rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Download size={14} />
                <span>Exporter les Prospects (CSV)</span>
              </button>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", textTransform: "uppercase", fontSize: "0.72rem" }}>
                    <th style={{ padding: "0.8rem 1rem" }}>Réf. Prospect</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Formule Souhaitée</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Coordonnées Client</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Wilaya</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Source Inscription</th>
                    <th style={{ padding: "0.8rem 1rem" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
                        Aucun prospect enregistré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "0.8rem 1rem", fontFamily: "monospace", color: "var(--accent-aqua)", fontWeight: 700 }}>
                          {lead.id || `LEAD-${i + 1}`}
                        </td>
                        <td style={{ padding: "0.8rem 1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          {lead.productName || lead.productId}
                        </td>
                        <td style={{ padding: "0.8rem 1rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                          {lead.contact}
                        </td>
                        <td style={{ padding: "0.8rem 1rem", color: "var(--text-muted)" }}>
                          {lead.wilaya || "Algérie"}
                        </td>
                        <td style={{ padding: "0.8rem 1rem" }}>
                          <span style={{ fontSize: "0.72rem", background: "var(--bg-secondary)", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 700, color: "var(--text-secondary)" }}>
                            {lead.source || "Web"}
                          </span>
                        </td>
                        <td style={{ padding: "0.8rem 1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WILAYAS & LOGISTIQUE ==================== */}
        {activeTab === "logistics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "18px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                Grille Tarifaire de Livraison (58 Wilayas)
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                Tarifs de livraison à domicile appliqués au paiement à la livraison (COD).
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {[
                  { region: "Alger (Zone 1)", wilayas: "16 - Alger Centre, Bab Ezzouar, Hydra, Dely Ibrahim", fee: 400, delay: "24h chrono" },
                  { region: "Wilayas Centre & Métropoles (Zone 2)", wilayas: "09 Blida, 35 Boumerdès, 42 Tipaza, 31 Oran, 25 Constantine", fee: 600, delay: "24h à 48h" },
                  { region: "Grand Nord & Hauts-Plateaux (Zone 3)", wilayas: "19 Sétif, 06 Béjaïa, 15 Tizi-Ouzou, 13 Tlemcen, 23 Annaba", fee: 650, delay: "48h" },
                  { region: "Sahara & Grand Sud (Zone 4)", wilayas: "30 Ouargla, 07 Biskra, 47 Ghardaïa, 08 Béchar, 11 Tamanrasset", fee: 850, delay: "48h à 72h" }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: "0.85rem", borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)" }}>{item.region}</span>
                      <span style={{ fontWeight: 900, color: "var(--accent-aqua)", fontSize: "0.95rem" }}>{item.fee} DA</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{item.wilayas}</div>
                    <div style={{ fontSize: "0.68rem", color: "#67C23A", fontWeight: 700, marginTop: "0.25rem" }}>Délai : {item.delay}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "18px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                Partenaires Transporteurs Express
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                Services d'expédition intégrés avec suivi par SMS.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {[
                  { name: "Yalidine Express", coverage: "58 Wilayas (Stop-desk & Domicile)", status: "Connecté (Actif)", color: "#409EFF" },
                  { name: "ZR Express", coverage: "Grandes villes & Nord", status: "Opérationnel", color: "#67C23A" },
                  { name: "Mayestro Delivery", coverage: "Alger Express sous 4h", status: "Actif local", color: "#E6A23C" }
                ].map((partner, idx) => (
                  <div key={idx} style={{ padding: "0.85rem", borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)" }}>{partner.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{partner.coverage}</div>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: partner.color, background: "var(--bg-card)", padding: "0.2rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                      {partner.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: PARAMÈTRES BOUTIQUE ==================== */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "680px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "18px", padding: "1.8rem", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              Configuration Générale de la Boutique
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Paramètres visibles par les visiteurs sur le site public.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>
                  Bandeau d'Annonce Supérieur
                </label>
                <input
                  type="text"
                  value={storeSettings.announcementText}
                  onChange={(e) => setStoreSettings({ ...storeSettings, announcementText: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>
                  Numéro Support Client WhatsApp
                </label>
                <input
                  type="text"
                  value={storeSettings.supportPhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ paddingTop: "0.5rem" }}>
                <button
                  onClick={() => {
                    localStorage.setItem("anjucia_store_settings", JSON.stringify(storeSettings));
                    showToast("Paramètres boutique enregistrés !");
                  }}
                  className="btn-aqua"
                  style={{ padding: "0.75rem 1.4rem", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Save size={15} />
                  <span>Enregistrer les Paramètres</span>
                </button>
              </div>

              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.4rem", marginTop: "0.8rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#F56C6C", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Zone de Réinitialisation
                </span>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.8rem" }}>
                  Rétablit les commandes d'exemple et les prix initiaux d'usine (1 800 DA).
                </p>
                <button
                  onClick={handleResetDefaults}
                  type="button"
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "10px",
                    background: "transparent",
                    border: "1px solid #F56C6C",
                    color: "#F56C6C",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Réinitialiser les Données de Démonstration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL NOUVELLE COMMANDE MANUELLE ==================== */}
      {showNewOrderModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setShowNewOrderModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "var(--shadow-lg)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>
                Ajouter une Commande Manuelle
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Nom complet du client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Dr. Amine Taleb"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 0550 12 34 56"
                  value={newOrderForm.customerPhone}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                    Wilaya de destination
                  </label>
                  <select
                    value={newOrderForm.wilaya}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, wilaya: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                    Quantité (Gel-Crème)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newOrderForm.qty}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, qty: parseInt(e.target.value, 10) || 1 })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Adresse complète / Commune
                </label>
                <input
                  type="text"
                  placeholder="ex: Rue Larbi Ben M'hidi, Bâtiment 3"
                  value={newOrderForm.customerAddress}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerAddress: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ padding: "0.8rem", borderRadius: "10px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-secondary)" }}>
                  Total à encaisser (COD) :
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--accent-aqua)" }}>
                  {(flagshipPrice * newOrderForm.qty).toLocaleString("fr-FR")} DA
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: "0.75rem", fontSize: "0.85rem" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-aqua"
                  style={{ flex: 1, padding: "0.75rem", fontSize: "0.85rem" }}
                >
                  Valider la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
