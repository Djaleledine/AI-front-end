"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Check, Truck, Gift, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { mock } from "../services/mockApi";

export default function BundleOffers() {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { lang } = useLanguage();
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    async function loadBundles() {
      const data = await mock.bundles.getAll();
      setBundles(data);
    }
    loadBundles();
  }, []);

  const handleAddBundle = (bundleId, name) => {
    if (bundleId === "duo") {
      addToCart("soothing-gel-cream");
      addToCart("cerahydra-cream-50");
    } else if (bundleId === "total") {
      addToCart("soothing-gel-cream");
      addToCart("cerahydra-cream-100");
      addToCart("bioshield-spf50");
    } else {
      addToCart("soothing-gel-cream");
    }
    showToast(`Pack "${name}" ajouté à votre panier avec livraison prioritaire !`);
    setIsCartOpen(true);
  };

  return (
    <section id="packs" style={{ padding: "4.5rem 0", background: "var(--bg-primary)" }}>
      <div className="container">
        <div className="scroll-reveal" style={{ maxWidth: "720px", margin: "0 auto 3.2rem" }}>
          <div className="section-header center">
            <span className="section-tag">
              {lang === "dz" ? "عروض حصرية مع توصيل مجاني" : "OFFRES PACKS AVANTAGEUX"}
            </span>
            <h2 className="section-title gsap-headline">
              {lang === "dz" ? "اختر الباك المناسب لبشرتك وميزانيتك" : "Commandez en Pack et Économisez sur la Livraison"}
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              {lang === "dz" ? "منتجات مطابقة لأعلى معايير العناية بالبشرة، مع خلاص عند الاستلام كي يوصلك الكولي." : "Des protocoles complets conçus pour le climat algérien avec expédition directe sécurisée 58 Wilayas."}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "2rem", alignItems: "stretch" }}>
          {bundles.map((b, idx) => (
            <div
              key={b.id}
              className={`bundle-card gsap-card-glow ${idx % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"} stagger-${idx + 1}`}
              style={{
                background: "var(--bg-card)",
                border: b.isPopular ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                borderRadius: "20px",
                padding: "2.4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: b.isPopular ? "var(--shadow-glow), var(--shadow-md)" : "var(--shadow-sm)",
                transition: "all 0.25s ease"
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.74rem",
                    fontWeight: 900,
                    padding: "0.35rem 0.85rem",
                    borderRadius: "9999px",
                    background: b.isPopular ? "var(--accent-aqua)" : "var(--accent-aqua-subtle)",
                    color: b.isPopular ? "#06111C" : "var(--accent-aqua)",
                    marginBottom: "1.1rem"
                  }}
                >
                  {b.badge[lang] || b.badge.fr}
                </span>

                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  {b.name[lang] || b.name.fr}
                </h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                  {b.subtitle[lang] || b.subtitle.fr}
                </div>

                <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.6rem" }}>
                  {b.priceFormatted || b.price || (b.priceDZD ? `${b.priceDZD.toLocaleString()} DA` : "1 500 DA")}
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "2rem", padding: 0 }}>
                  {b.features?.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      <Check size={16} color="var(--accent-aqua)" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{f[lang] || f.fr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-footer-action" style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  className="btn-aqua magnetic-btn"
                  style={{ width: "100%", padding: "0.95rem" }}
                  onClick={() => handleAddBundle(b.id, b.name[lang] || b.name.fr)}
                >
                  <ShoppingBag size={18} />
                  <span>{lang === "dz" ? "اطلب هذا الباك الآن" : "Commander ce Pack"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
