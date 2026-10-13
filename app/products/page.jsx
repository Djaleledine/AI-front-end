"use client";

import React, { useState, useEffect } from "react";
import { mock } from "../services/mockApi";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Sparkles, X, Info } from "lucide-react";

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await mock.products.getAll({ category: activeCategory });
      setProductsList(data);
    }
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = productsList;

  const categories = [
    { id: "all", label: t.productsPage.all },
    { id: "hydratation", label: t.productsPage.hydratation },
    { id: "reparation", label: t.productsPage.reparation },
    { id: "solaire", label: t.productsPage.solaire },
    { id: "nettoyant", label: t.productsPage.nettoyant }
  ];

  return (
    <main style={{ paddingBottom: "5rem" }}>
      {/* Header Banner */}
      <section style={{ background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)", padding: "4.5rem 0 3rem", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div className="scroll-reveal">
            <div className="section-header">
              <span className="section-tag">{t.productsPage.tag}</span>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "0.5rem" }} className="gsap-headline">
                {t.productsPage.title}
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "820px", lineHeight: 1.65 }}>
                {t.productsPage.desc}
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="scroll-reveal" style={{ display: "flex", gap: "0.8rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="magnetic-btn"
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "var(--badge-radius)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: activeCategory === cat.id ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                  background: activeCategory === cat.id ? "var(--btn-gradient)" : "var(--bg-card)",
                  color: activeCategory === cat.id ? "#FFFFFF" : "var(--text-secondary)",
                  cursor: "pointer",
                  boxShadow: activeCategory === cat.id ? "var(--shadow-glow)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container" style={{ paddingTop: "3.5rem" }}>
        <div className="products-grid">
          {filteredProducts.map((prod, idx) => (
            <div
              key={prod.id}
              className={`product-card gsap-card-glow scroll-reveal-scale stagger-${(idx % 4) + 1}`}
              style={{
                borderColor: prod.isNew ? "var(--accent-aqua)" : "var(--border-subtle)",
                boxShadow: prod.isNew ? "var(--shadow-glow)" : "var(--shadow-sm)"
              }}
            >
              <span className="product-badge-flag">
                {prod.badge}
              </span>

              <div className="product-card-img-wrap">
                <img src={prod.image} alt={prod.name} />
              </div>

              <div className="product-card-vol">{prod.volume}</div>
              <h3 className="product-card-title">{prod.name}</h3>
              <p className="product-card-desc">{prod.description}</p>

              {/* Actives preview */}
              <div style={{ fontSize: "0.76rem", color: "var(--accent-aqua)", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.45 }}>
                {t.productsPage.activesKey} {prod.actives.map((a) => `${a.name} (${a.percentage})`).join(" • ")}
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <button
                  onClick={() => setSelectedProduct(prod)}
                  style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}
                >
                  <Info size={14} color="var(--accent-aqua)" />
                  <span>{t.productsPage.seeINCI}</span>
                </button>
              </div>

              <div className="card-footer-action product-card-footer">
                <div>
                  <div className="price-dzd">{prod.priceDZD.toLocaleString()} <span>DZD</span></div>
                  <div style={{ fontSize: "0.72rem", color: "var(--success)", fontWeight: 800 }}>{t.hero.inStock}</div>
                </div>
                <button
                  className="btn-aqua magnetic-btn"
                  style={{ padding: "0.65rem 1.2rem", fontSize: "0.85rem" }}
                  onClick={() => addToCart(prod.id)}
                >
                  {t.hero.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analyzer Callout Footer Banner */}
        <div style={{ marginTop: "4.5rem", background: "var(--bg-secondary)", borderRadius: "var(--card-radius)", padding: "3rem", border: "1.5px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", boxShadow: "var(--shadow-sm)" }}>
          <div>
            <span style={{ color: "var(--accent-aqua)", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t.analyzerPage.tag}
            </span>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.5rem 0" }} className="gsap-headline">
              {t.analyzerPage.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "580px", lineHeight: 1.6 }}>
              {t.analyzerPage.subtitle}
            </p>
          </div>
          <a href="/analyzer" className="btn-aqua magnetic-btn" style={{ fontSize: "1rem", padding: "1rem 2rem", display: "inline-flex" }}>
            <Sparkles size={18} />
            <span>{t.hero.launchAI} →</span>
          </a>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{ background: "var(--bg-card)", border: "2px solid var(--accent-aqua)", borderRadius: "var(--card-radius)", maxWidth: "640px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2.2rem", position: "relative", boxShadow: "var(--shadow-md)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            <span className="product-badge-flag" style={{ position: "static", display: "inline-block", marginBottom: "0.8rem" }}>
              {selectedProduct.badge}
            </span>

            <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
              {selectedProduct.name}
            </h3>
            <div style={{ fontSize: "0.85rem", color: "var(--accent-aqua)", fontWeight: 800, marginBottom: "1.2rem" }}>
              {selectedProduct.subtitle}
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {selectedProduct.description}
            </p>

            <h4 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 800, marginBottom: "0.8rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
              {t.productsPage.activesKey}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {selectedProduct.actives.map((act, i) => (
                <div key={i} style={{ background: "var(--bg-secondary)", padding: "0.7rem 0.9rem", borderRadius: "10px", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "var(--text-primary)", fontSize: "0.88rem" }}>{act.name}</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{act.role}</div>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--accent-aqua)" }}>{act.percentage}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--accent-aqua-subtle)", border: "1px solid var(--border-light)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
              <strong>Conditionnement :</strong> {selectedProduct.packaging}
              <br />
              <strong>pH Physiologique :</strong> {selectedProduct.technicalSpecs.ph}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.2rem" }}>
              <div>
                <div className="price-dzd">{selectedProduct.priceDZD.toLocaleString()} <span>DZD</span></div>
                <div style={{ fontSize: "0.72rem", color: "var(--success)", fontWeight: 800 }}>{t.hero.inStock}</div>
              </div>
              <button
                className="btn-aqua"
                onClick={() => {
                  addToCart(selectedProduct.id);
                  setSelectedProduct(null);
                }}
              >
                {t.hero.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
