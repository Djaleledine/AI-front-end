"use client";

import React, { useState } from "react";
import { Sparkles, Check, Truck, Gift, ShoppingBag, Clock, Bell } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function BundleOffers() {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { lang } = useLanguage();
  const [notifiedDuo, setNotifiedDuo] = useState(false);
  const [notifiedTotal, setNotifiedTotal] = useState(false);

  const handleNotify = (packName, setFn) => {
    setFn(true);
    showToast(
      lang === "dz"
        ? `تم تسجيلك ! سنخبرك فور توفر ${packName}`
        : `Enregistré ! Vous serez prévenu du lancement du ${packName} ✨`
    );
  };

  const handleOrderSolo = () => {
    addToCart("soothing-gel-cream", 1);
    showToast("Gel-Crème 50 ml ajouté au panier (1 800 DA) !");
    setIsCartOpen(true);
  };

  return (
    <section id="packs" style={{ padding: "4rem 0", background: "var(--bg-primary)" }}>
      <div className="container">
        <div style={{ maxWidth: "720px", margin: "0 auto 3rem", textAlign: "center" }}>
          <span className="section-tag">
            {lang === "dz" ? "عروض حصرية مع توصيل 58 ولاية" : "OFFRES & PROTOCOLES ANJUCIA"}
          </span>
          <h2 style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            {lang === "dz" ? "اختر الصيغة المناسبة لبشرتك" : "Commandez le Soin ou Découvrez les Packs"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {lang === "dz"
              ? "الجل-كريم متوفر حالياً للشحن الفوري. الباقات المتعددة في مرحلة الإطلاق القريب."
              : "Le Soin Visage Apaisant 50 ml est disponible dès aujourd'hui. Les coffrets duo & trio arrivent très bientôt."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.8rem", alignItems: "stretch" }}>
          {/* Solo Card — LIVE */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "2px solid var(--accent-aqua)",
              borderRadius: "20px",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-glow), var(--shadow-md)",
              position: "relative"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    padding: "0.3rem 0.8rem",
                    borderRadius: "9999px",
                    background: "var(--accent-aqua)",
                    color: "#11171A"
                  }}
                >
                  DISPONIBLE IMMÉDIATEMENT
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--success)", fontWeight: 800 }}>
                  ✓ En Stock
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                Pack Découverte Solo (50 ml)
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                Tube Canule Zéro-Panne • Formule Apaisante Niacinamide 3%
              </div>

              <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--accent-aqua)", marginBottom: "1.5rem" }}>
                1 800 DA
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem", padding: 0 }}>
                {[
                  "1x Soin Visage Apaisant Ultra-Léger 50 ml",
                  "Tube canule haute précision anti-contamination",
                  "Expédition express 58 Wilayas en 24-48h",
                  "Paiement à la livraison après vérification du colis",
                  "QR Code VIP scellé dans chaque boîte"
                ].map((txt, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    <Check size={16} color="var(--accent-aqua)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                className="btn-aqua magnetic-btn"
                style={{ width: "100%", padding: "0.95rem" }}
                onClick={handleOrderSolo}
              >
                <ShoppingBag size={18} />
                <span>{lang === "dz" ? "اطلب الآن (1800 دج)" : "Commander ce Soin (1 800 DA)"}</span>
              </button>
            </div>
          </div>

          {/* Duo Pack — COMING SOON */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px dashed var(--border-light)",
              borderRadius: "20px",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              opacity: 0.95
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    background: "rgba(113, 159, 183, 0.14)",
                    color: "var(--accent-aqua)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <Clock size={12} />
                  Bientôt Disponible
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  Pack Synergie
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                Pack Duo Barrière Cellulaire
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                Gel-Crème 50 ml + Crème CeraHydra+ 50 ml
              </div>

              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Tarif au Lancement
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem", padding: 0 }}>
                {[
                  "Protocole jour (Gel-Crème) & nuit (CeraHydra+)",
                  "5 Céramides biomimétiques 3:1:1",
                  "Livraison offerte 58 Wilayas incluse",
                  "Visuels et lancement officiel très prochainement"
                ].map((txt, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    <Check size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                className={notifiedDuo ? "btn-outline" : "btn-aqua"}
                style={{ width: "100%", padding: "0.95rem" }}
                onClick={() => handleNotify("Pack Duo Barrière", setNotifiedDuo)}
              >
                {notifiedDuo ? <Check size={18} color="var(--success)" /> : <Bell size={18} />}
                <span>{notifiedDuo ? "Inscrit pour le Duo ✓" : "Me prévenir au lancement"}</span>
              </button>
            </div>
          </div>

          {/* Total Trio Pack — COMING SOON */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px dashed var(--border-light)",
              borderRadius: "20px",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              opacity: 0.95
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    background: "rgba(113, 159, 183, 0.14)",
                    color: "var(--accent-aqua)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <Clock size={12} />
                  Bientôt Disponible
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  Rituel Intégral
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                Pack Bouclier Total SPF50
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                Nettoyant + Gel-Crème + BioShield SPF50+
              </div>

              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Tarif au Lancement
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem", padding: 0 }}>
                {[
                  "Routine dermaceutique 3 étapes complète",
                  "Protection solaire maximale anti-UV algérien",
                  "Trousse isotherme thermo-résistante offerte",
                  "Bientôt en pharmacie et sur l'application"
                ].map((txt, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    <Check size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                className={notifiedTotal ? "btn-outline" : "btn-aqua"}
                style={{ width: "100%", padding: "0.95rem" }}
                onClick={() => handleNotify("Pack Bouclier Total", setNotifiedTotal)}
              >
                {notifiedTotal ? <Check size={18} color="var(--success)" /> : <Bell size={18} />}
                <span>{notifiedTotal ? "Inscrit pour le Trio ✓" : "Me prévenir au lancement"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
