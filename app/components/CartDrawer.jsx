"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, CheckCircle, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { mock } from "../services/mockApi";
import { ALGERIAN_WILAYAS } from "../data/products";
import { DropletMark } from "./brand/AnjuciaLogo";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQty,
    clearCart,
    subtotalDZD,
    selectedWilaya,
    setSelectedWilaya,
    showToast
  } = useCart();
  const { t, lang } = useLanguage();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [wilayasList, setWilayasList] = useState(ALGERIAN_WILAYAS);

  useEffect(() => {
    async function loadWilayas() {
      const data = await mock.wilayas.getAll();
      if (data && data.length > 0) {
        setWilayasList(data.map(w => w.fullName || w.name));
      }
    }
    loadWilayas();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast(lang === "dz" ? "يرجى كتابة الاسم ورقم الهاتف لتأكيد الطلب !" : "Veuillez renseigner votre nom et votre numéro de téléphone !");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await mock.orders.create({
        customerName,
        customerPhone,
        customerAddress,
        wilaya: selectedWilaya,
        items: cartItems,
        totalDZD: subtotalDZD
      });

      setConfirmedOrder(order);
      setOrderPlaced(true);
      showToast(t.cart.orderSuccess);
      setTimeout(() => {
        clearCart();
        setOrderPlaced(false);
        setConfirmedOrder(null);
        setIsCartOpen(false);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
      }, 5500);
    } catch {
      showToast("Erreur lors de la confirmation du panier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)" }}>{t.cart.title}</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--accent-aqua)", fontWeight: 800 }}>
              {t.cart.badge}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}
            aria-label="Fermer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="cart-body">
          {orderPlaced ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", color: "var(--accent-aqua)" }}>
                <CheckCircle size={36} />
              </div>
              <h4 style={{ color: "var(--text-primary)", fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                {t.cart.orderSuccess}
              </h4>
              {confirmedOrder && (
                <div style={{ margin: "1rem 0", padding: "0.8rem", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-light)", fontSize: "0.82rem" }}>
                  <div style={{ fontWeight: 800, color: "var(--accent-aqua)" }}>Réf. Commande : {confirmedOrder.id}</div>
                  <div style={{ color: "var(--text-secondary)", marginTop: "0.2rem" }}>N° de Suivi Express : <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{confirmedOrder.trackingCode}</span></div>
                </div>
              )}
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {t.cart.orderSuccessDesc} <strong>{selectedWilaya}</strong>.
                <br />
                {lang === "dz" ? "سيتصل بك مسؤول التوصيل لتأكيد موعد الاستلام." : "Un agent de livraison vous contactera sous 2h pour la remise en main propre."}
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {t.cart.empty}
              </p>
              <p style={{ fontSize: "0.85rem", maxWidth: "260px", margin: "0 auto 1.5rem" }}>
                {t.cart.emptySub}
              </p>
              <a href="/#produits" className="btn-aqua" onClick={() => setIsCartOpen(false)}>
                {t.cart.explore}
              </a>
            </div>
          ) : (
            <div>
              {/* Product items in cart */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="cart-item-thumb" />
                    ) : (
                      <div
                        className="cart-item-thumb"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--bg-secondary)",
                          borderRadius: "10px",
                          border: "1px solid var(--border-light)"
                        }}
                      >
                        <DropletMark size={28} color="var(--accent-aqua)" />
                      </div>
                    )}
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{item.volume}</div>
                      <div className="cart-item-price">
                        {(item.priceDZD * item.qty).toLocaleString()} DZD
                      </div>

                      <div className="cart-qty-ctrl">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, -1)}
                          title="Diminuer"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", minWidth: "16px", textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, 1)}
                          title="Augmenter"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: "transparent", border: "none", color: "var(--danger)", padding: "0.5rem", cursor: "pointer" }}
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Express Point of Sale Order Form */}
              <form onSubmit={handleCheckout} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "calc(var(--card-radius) / 1.2)", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 900, color: "var(--accent-aqua)", textTransform: "uppercase" }}>
                  📍 {lang === "dz" ? "معلومات استلام الطلب :" : "Coordonnées de Livraison Express :"}
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    {t.cart.customerName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === "dz" ? "مثال: أمينة بن علي" : "ex: Amina Benali"}
                    style={{ width: "100%", padding: "0.65rem 0.8rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    {t.cart.customerPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    style={{ width: "100%", padding: "0.65rem 0.8rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    {t.cart.wilayaLabel}
                  </label>
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.8rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" }}
                  >
                    {wilayasList.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    {t.cart.customerAddress}
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder={lang === "dz" ? "البلدية أو الحي..." : "Commune, quartier ou rue..."}
                    style={{ width: "100%", padding: "0.65rem 0.8rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", color: "var(--success)", fontWeight: 700, marginTop: "0.2rem" }}>
                  <ShieldCheck size={16} />
                  <span>{lang === "dz" ? "الدفع نقداً بعد استلام الطرد ومعاينته" : "Paiement en espèces à la livraison après vérification du colis"}</span>
                </div>
              </form>
            </div>
          )}
        </div>

        {cartItems.length > 0 && !orderPlaced && (
          <div className="cart-footer">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", color: "var(--accent-aqua)", fontWeight: 700, padding: "0.5rem 0.75rem", background: "var(--accent-aqua-subtle)", borderRadius: "8px", border: "1px solid var(--border-light)", marginBottom: "0.8rem" }}>
              <Sparkles size={15} style={{ flexShrink: 0 }} />
              <span>{t.cart.qrNotice || "Abonnement VIP automatique inclus : QR code scellé dans la boîte de votre crème."}</span>
            </div>

            <div className="cart-subtotal-row">
              <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>{t.cart.subtotal}</span>
              <span style={{ color: "var(--accent-aqua)" }}>{subtotalDZD.toLocaleString()} DZD</span>
            </div>

            <button
              className="btn-aqua"
              style={{ width: "100%", fontSize: "0.95rem", padding: "0.95rem" }}
              onClick={handleCheckout}
            >
              <Truck size={18} />
              <span>{t.cart.checkoutBtn}</span>
            </button>

            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.6rem" }}>
              <span>{lang === "dz" ? "بالضغط على تأكيد، توافق على " : "En confirmant, vous acceptez nos "}</span>
              <a href="/terms" onClick={() => setIsCartOpen(false)} style={{ color: "var(--accent-aqua)", textDecoration: "underline" }}>
                {lang === "dz" ? "الشروط العامة والسرية" : "Conditions & Confidentialité"}
              </a>
              <span> • {lang === "dz" ? "بياناتك سرية 100%" : "Données 100% confidentielles"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
