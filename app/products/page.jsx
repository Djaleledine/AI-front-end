"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { ANJUCIA_PRODUCTS, AVAILABLE_PRODUCT_ID, FLAGSHIP_PRODUCT, COMING_SOON_PRODUCTS } from "../data/products";
import DropletHeroVisual from "../components/ui/DropletHeroVisual";
import ComingSoonCard from "../components/ui/ComingSoonCard";
import { Sparkles, ShieldCheck, Droplets, Info, Check, Clock } from "lucide-react";

export default function ProductsPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");

  const flagship = FLAGSHIP_PRODUCT || ANJUCIA_PRODUCTS[0];
  const comingSoonList = COMING_SOON_PRODUCTS.filter((p) => {
    if (activeTab === "all") return true;
    return p.category === activeTab;
  });

  const categories = [
    { id: "all", label: lang === "en" ? "All Formulas" : (lang === "dz" || lang === "ar") ? "كل الصيغ" : "Toutes les Formules" },
    { id: "reparation", label: lang === "en" ? "Anti-aging & Repair" : (lang === "dz" || lang === "ar") ? "سيروم وترميم" : "Anti-âge & Réparation" },
    { id: "solaire", label: lang === "en" ? "BioShield Solar" : (lang === "dz" || lang === "ar") ? "واقي شمس" : "Solaire BioShield" },
    { id: "nettoyant", label: lang === "en" ? "Gentle Cleanser" : (lang === "dz" || lang === "ar") ? "تنظيف فيزيولوجي" : "Nettoyant Doux" }
  ];

  return (
    <main style={{ paddingBottom: "5.5rem" }}>
      {/* Header Banner */}
      <section
        style={{
          background: "radial-gradient(circle at 50% -20%, var(--accent-aqua-subtle) 0%, transparent 70%)",
          padding: "2.5rem 0 2rem",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
            <span className="section-tag">
              {t.productsPage?.tag || (lang === "en" ? "OFFICIAL ANJUCIA CATALOG" : (lang === "dz" || lang === "ar") ? "صيدلية أنجوسيا الرسمية 🇩🇿" : "CATALOGUE OFFICIEL ANJUCIA")}
            </span>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 400,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: "0.6rem"
              }}
            >
              {t.productsPage?.title || (lang === "en" ? "High-Precision Skincare for Algerian Climate" : (lang === "dz" || lang === "ar") ? "صيغ متطورة خصيصاً للمناخ الجزائري" : "Formulations Expertes & Haute Précision")}
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {lang === "en"
                ? "Only the Soothing Face Care 50 ml is currently in stock. Other clinical treatments are previewed below."
                : (lang === "dz" || lang === "ar")
                ? "منتج واحد متوفر حالياً للشراء الفوري. باقي المنتجات قيد الإطلاق قريباً بدون صور حالية."
                : "Seul le Soin Visage Apaisant 50 ml est actuellement en vente. Les autres soins cliniques sont présentés en avant-première."}
            </p>
          </div>
        </div>
      </section>

      {/* Flagship Product Showcase (1 Live Product) */}
      <section className="container" style={{ maxWidth: "1080px", paddingTop: "2.5rem" }}>
        <div style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {lang === "en" ? "Sole Product Currently Available for Immediate Order" : (lang === "dz" || lang === "ar") ? "المنتج الوحيد المتاح للطلب الفوري" : "Produit Actuellement Disponible à la Vente"}
            </span>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--accent-aqua)" }}>
            {lang === "en" ? "58 Wilayas • Cash on Delivery" : (lang === "dz" || lang === "ar") ? "58 ولاية • الدفع عند الاستلام" : "58 Wilayas • Paiement Cash"}
          </span>
        </div>

        <div style={{ maxWidth: "560px", margin: "0 auto 3.5rem" }}>
          <DropletHeroVisual
            showPrice={true}
            onAddToCart={() => {
              addToCart(AVAILABLE_PRODUCT_ID, 1);
              setIsCartOpen(true);
            }}
          />
        </div>

        {/* Coming Soon Formulas Header */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", fontWeight: 400, color: "var(--accent-aqua)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                <Clock size={13} />
                <span>{lang === "en" ? "Coming Soon" : (lang === "dz" || lang === "ar") ? "في مرحلة التحضير والإطلاق" : "Prochainement Disponibles"}</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 400, color: "var(--text-primary)" }}>
                {lang === "en" ? "Upcoming ANJUCIA Formulations" : (lang === "dz" || lang === "ar") ? "تشكيلة أنجوسيا القادمة (قريباً)" : "Les Formules en Avant-Première"}
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                {lang === "en"
                  ? "Exclusive preview of active ingredients. Official imagery and pricing will be revealed at launch."
                  : (lang === "dz" || lang === "ar")
                  ? "سجّل لتكون أول من يجرب هذه التراكيب فور توفرها في الصيدليات."
                  : "Aperçu exclusif des actifs. Les visuels et tarifs définitifs seront révélés au lancement."}
              </p>
            </div>

            {/* Filter tags */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "0px",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    border: activeTab === c.id ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                    background: activeTab === c.id ? "var(--accent-aqua-subtle)" : "var(--bg-card)",
                    color: activeTab === c.id ? "var(--accent-aqua)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Cards Grid (No Images, pure silhouette & teaser) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.4rem"
          }}
        >
          {comingSoonList.map((product, idx) => (
            <ComingSoonCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>
    </main>
  );
}
