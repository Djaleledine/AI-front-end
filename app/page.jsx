"use client";

import React, { useState, useEffect } from "react";
import { mock, MOCK_REVIEWS, MOCK_PHARMACIES } from "./services/mockApi";
import { ANJUCIA_PRODUCTS } from "./data/products";
import { useCart } from "./context/CartContext";
import { useLanguage } from "./context/LanguageContext";
import DermLabMixer from "./components/DermLabMixer";
import BundleOffers from "./components/BundleOffers";
import QuickSkinMatchModal from "./components/QuickSkinMatchModal";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Droplets,
  ArrowRight,
  MapPin,
  Star,
  Truck,
  Sun,
  PhoneCall
} from "lucide-react";

export default function HomePage() {
  const { addToCart, addHybridHero, setIsCartOpen } = useCart();
  const { t, lang } = useLanguage();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [pharmacies, setPharmacies] = useState(MOCK_PHARMACIES);
  const [products, setProducts] = useState(ANJUCIA_PRODUCTS);

  useEffect(() => {
    async function loadData() {
      const [reviewsData, pharmaciesData, productsData] = await Promise.all([
        mock.reviews.getAll(),
        mock.pharmacies.getAll(),
        mock.products.getAll()
      ]);
      if (reviewsData?.length) setReviews(reviewsData);
      if (pharmaciesData?.length) setPharmacies(pharmaciesData);
      if (productsData?.length) setProducts(productsData);
    }
    loadData();
  }, []);

  // Track mouse position globally for confetti origin
  useEffect(() => {
    const trackMouse = (e) => {
      window._lastMouseX = e.clientX;
      window._lastMouseY = e.clientY;
    };
    window.addEventListener("mousemove", trackMouse, { passive: true });
    return () => window.removeEventListener("mousemove", trackMouse);
  }, []);

  return (
    <main>
      {/* Cursor Follower Elements (GSAP controlled) */}
      <div className="anjucia-cursor" aria-hidden="true" />
      <div className="anjucia-cursor-dot" aria-hidden="true" />

      {/* 10-Second Quick Skin Match Modal */}
      <QuickSkinMatchModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section id="hero" style={{ position: "relative", padding: "2.5rem 0 3.5rem", overflow: "hidden", background: "radial-gradient(circle at 50% -10%, var(--hero-glow-color, rgba(113, 159, 183, 0.18)) 0%, var(--bg-primary) 70%)", borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Hero floating particles layer */}
        <div className="gsap-hero-particles" aria-hidden="true" />
        <div style={{ position: "absolute", top: "-120px", right: "-120px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, var(--accent-aqua-glow) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

        <div className="container" style={{ marginTop: "1rem" }}>
          <div className="hero-grid-layout">
            {/* Left — Brand copy */}
            <div>
              <div className="gsap-hero-el" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-aqua-subtle)", border: "1px solid var(--border-light)", padding: "0.45rem 1rem", borderRadius: "var(--badge-radius, 9999px)", fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-aqua)", marginBottom: "1.2rem" }}>
                <span className="topbar-dot" />
                <span>{t.hero.pill}</span>
              </div>

              <h1 className="gsap-headline gsap-hero-el" style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.16, marginBottom: "1.3rem", letterSpacing: "-0.025em" }}>
                {t.hero.title}
              </h1>

              <p className="gsap-hero-el" style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.68, maxWidth: "620px", marginBottom: "2.2rem" }}>
                {t.hero.desc}
              </p>

              {/* Stats with rolling GSAP counters */}
              <div className="gsap-hero-el" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem", marginBottom: "2.4rem", padding: "1.3rem 1.6rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius, 16px)", boxShadow: "var(--shadow-sm)" }}>
                <div>
                  <div data-gsap-counter="148" data-prefix="+" data-suffix="%" className="gsap-roll-number" style={{ fontSize: "1.85rem", fontWeight: 900, color: "var(--accent-aqua)", lineHeight: 1 }}>{t.hero.stat1Val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.35rem", fontWeight: 600 }}>{t.hero.stat1Lbl}</div>
                </div>
                <div>
                  <div data-gsap-counter="72" data-suffix="H" className="gsap-roll-number" style={{ fontSize: "1.85rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{t.hero.stat2Val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.35rem", fontWeight: 600 }}>{t.hero.stat2Lbl}</div>
                </div>
                <div>
                  <div data-gsap-counter="58" data-suffix="" className="gsap-roll-number" style={{ fontSize: "1.85rem", fontWeight: 900, color: "var(--success)", lineHeight: 1 }}>{t.hero.stat3Val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.35rem", fontWeight: 600 }}>{t.hero.stat3Lbl}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="gsap-hero-el" style={{ display: "flex", gap: "1.1rem", flexWrap: "wrap", marginBottom: "1.6rem" }}>
                <button
                  className="btn-aqua magnetic-btn"
                  onClick={() => { addHybridHero("soothing-gel-cream"); setIsCartOpen(true); }}
                  style={{ fontSize: "1rem", padding: "1rem 2.2rem" }}
                >
                  <Droplets size={19} />
                  <span>{t.hero.orderFlagship}</span>
                </button>

                <button
                  className="btn-outline magnetic-btn"
                  onClick={() => setIsQuizOpen(true)}
                  style={{ fontSize: "0.95rem", padding: "1rem 1.8rem" }}
                >
                  <Sparkles size={18} color="var(--accent-aqua)" />
                  <span>{t.quickQuizBtn}</span>
                </button>
              </div>

              <div className="gsap-hero-el" style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontSize: "0.78rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><Truck size={15} color="var(--accent-aqua)" /> 58 Wilayas</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><ShieldCheck size={15} color="var(--success)" /> Paiement à la livraison</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><Star size={15} color="#F59E0B" /> 4.9/5 Avis Clients</span>
              </div>
            </div>

            {/* Right — Flagship product */}
            <div className="scroll-reveal-scale" style={{ position: "relative" }}>
              <div style={{ background: "var(--bg-card)", border: "2px solid var(--accent-aqua)", borderRadius: "var(--card-radius, 24px)", padding: "2.2rem", boxShadow: "var(--shadow-md), var(--shadow-glow)", position: "relative" }}>
                <span className="product-badge-flag">{t.hero.flagshipBadge}</span>

                {/* Rolling Circular Dermo Seal */}
                <div className="gsap-rotating-badge" aria-label="ANJUCIA Clinical Dermo Seal">
                  <svg viewBox="0 0 160 160" className="rotating-text-svg">
                    <circle cx="80" cy="80" r="76" fill="var(--bg-card)" stroke="var(--border-light)" strokeWidth="1.5" />
                    <path
                      id="heroBadgePath"
                      d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                      fill="none"
                    />
                    <text>
                      <textPath href="#heroBadgePath" className="rotating-text-path">
                        ✦ CLINICAL DERMO ✦ FORMULÉ EN ALGÉRIE ✦ 58 WILAYAS ✦
                      </textPath>
                    </text>
                  </svg>
                  <div className="rotating-badge-center">
                    <img src="/assets/anjucia-symbol.png" alt="AJ" className="rotating-badge-symbol" />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "290px", margin: "1.2rem 0" }}>
                  <img
                    src="/assets/soothing-gel-cream.svg"
                    alt="ANJUCIA Lightweight Soothing Face Gel-Cream"
                    className="parallax-float hero-tube-parallax"
                    style={{ maxHeight: "280px", width: "auto", filter: "drop-shadow(0 20px 38px rgba(0, 0, 0, 0.32))", transformOrigin: "center center" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.6rem 0.95rem", background: "var(--bg-secondary)", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
                    <ShieldCheck size={16} color="var(--accent-aqua)" style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>{t.hero.flagshipVol} • Tube canule hygiénique zéro-panne</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.6rem 0.95rem", background: "var(--accent-aqua-subtle)", borderRadius: "10px", fontSize: "0.8rem", color: "var(--accent-aqua)", border: "1px solid var(--border-light)", fontWeight: 700 }}>
                    <Sparkles size={15} style={{ flexShrink: 0 }} />
                    <span>{lang === "dz" ? "اشتراك تلقائي مرفق : كود QR مختوم داخل كل علبة" : "Abonnement VIP automatique inclus : QR code scellé dans la boîte"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.1rem" }}>
                  <div>
                    <div className="price-dzd" style={{ fontSize: "1.55rem", fontWeight: 900, color: "var(--accent-aqua)" }}>{t.hero.flagshipPrice}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--success)", fontWeight: 800 }}>{t.hero.inStock}</div>
                  </div>
                  <button
                    className="btn-aqua magnetic-btn"
                    onClick={() => { addHybridHero("soothing-gel-cream"); setIsCartOpen(true); }}
                    style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}
                  >
                    {t.hero.addToCart}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GSAP Velocity Marquee Ticker ────────────────────────────────────── */}
      <div className="gsap-ticker-container" aria-hidden="true">
        <div className="gsap-ticker-track" data-gsap-marquee="true">
          {[
            "58 Wilayas · Livraison Rapide & COD",
            "Formulé pour le Climat Algérien",
            "pH 5.2 Physiologique Strict",
            "Niacinamide Pure 3% + Panthénol B5 2%",
            "Tube Canule Zéro-Panne Hygiénique",
            "QR Code Scellé VIP Inclus",
            "DermoScan AI · Analyse Cutanée Gratuite",
            "Tolérance Testée Dermatologiquement",
          ].concat([
            "58 Wilayas · Livraison Rapide & COD",
            "Formulé pour le Climat Algérien",
            "pH 5.2 Physiologique Strict",
            "Niacinamide Pure 3% + Panthénol B5 2%",
            "Tube Canule Zéro-Panne Hygiénique",
            "QR Code Scellé VIP Inclus",
            "DermoScan AI · Analyse Cutanée Gratuite",
            "Tolérance Testée Dermatologiquement",
          ]).map((item, i) => (
            <span key={i} className="gsap-ticker-item">
              <span className="gsap-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bundles ──────────────────────────────────────────────────────────── */}
      <BundleOffers />

      {/* ── DermLab Mixer ────────────────────────────────────────────────────── */}
      <DermLabMixer />

      {/* ── Flagship Catalog Grid ────────────────────────────────────────────── */}
      <section style={{ padding: "4.5rem 0" }} id="produits">
        <div className="container">
          <div className="scroll-reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="section-header">
              <span className="section-tag">{t.productsPage?.tag || "COLLECTION EXPERTE ANJUCIA"}</span>
              <h2 className="section-title gsap-headline" style={{ marginBottom: "0.4rem" }}>{t.nav.products}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {t.productsPage?.desc || "Formulations pures et expertes pour la peau algérienne."}
              </p>
            </div>
            <a href="/products" className="btn-outline magnetic-btn">
              <span>{t.productsPage?.all || "Voir Tous les Soins"}</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="products-grid">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className={`product-card gsap-card-glow scroll-reveal-scale stagger-${(idx % 4) + 1}`}
                style={{ border: product.isHero ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)", position: "relative" }}
              >
                {product.badge && (
                  <span className={product.isHero ? "product-badge-hero" : "product-badge-clean"}>
                    {product.badge}
                  </span>
                )}

                <div className="product-card-img-wrap">
                  <img src={product.image} alt={product.name} className="product-card-img" />
                </div>

                <div className="product-card-body">
                  <span className="product-category-tag">{product.category}</span>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-subtitle">{product.subtitle}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "0.8rem", fontWeight: 700 }}>{product.packaging}</div>
                  <p className="product-desc">{product.description}</p>

                  <div className="card-footer-action product-card-footer">
                    <div>
                      <div className="price-dzd">{product.priceDZD.toLocaleString()} DZD</div>
                      {product.originalPriceDZD && (
                        <div style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "var(--text-muted)" }}>
                          {product.originalPriceDZD.toLocaleString()} DZD
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-aqua magnetic-btn"
                      onClick={() => { addToCart(product.id); setIsCartOpen(true); }}
                      style={{ padding: "0.65rem 1.15rem", fontSize: "0.85rem" }}
                    >
                      {lang === "dz" ? "أضف للسلة" : "Ajouter au Panier"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ─────────────────────────────────────────────────── */}
      <section style={{ padding: "4.5rem 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)" }} id="avis">
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 3rem" }}>
            <div className="section-header center">
              <span className="section-tag">AVIS CLIENTS VÉRIFIÉS 🇩🇿</span>
              <h2 className="section-title gsap-headline">
                {lang === "dz" ? "أكثر من 8500 زبون راضٍ في الجزائر" : "Adopté par plus de 8 500 Utilisateurs en Algérie"}
              </h2>
              <p className="section-subtitle">
                {lang === "dz" ? "شوف واش قالو مستعملي جل-كريم أنجوسيا في مختلف الولايات." : "Des retours d'expérience concrets sous le climat algérien."}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.8rem" }}>
            {reviews.map((rev, idx) => (
              <div
                key={rev.id}
                className={`review-card gsap-card-glow ${idx % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"} stagger-${(idx % 4) + 1}`}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius, 18px)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}
              >
                <div>
                  <div style={{ display: "flex", gap: "2px", color: "#F59E0B", marginBottom: "0.9rem" }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1.4rem" }}>
                    {rev.comment[lang] || rev.comment.fr}
                  </p>
                </div>
                <div className="card-footer-action" style={{ paddingTop: "0.8rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.88rem" }}>{rev.author}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--accent-aqua)", fontWeight: 700, marginTop: "0.15rem" }}>{rev.location}</div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--success)", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontWeight: 800 }}>
                    Achat Vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Cards ─────────────────────────────────────────────────── */}
      <section style={{ padding: "4.5rem 0" }} id="charte">
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 3rem" }}>
            <div className="section-header center">
              <span className="section-tag">{t.philosophy?.tag || "PHILOSOPHIE FORMULATEUR"}</span>
              <h2 className="section-title gsap-headline">{t.philosophy?.title || "Une Approche Scientifique Dédiée au Marché Algérien"}</h2>
              <p className="section-subtitle">
                {t.philosophy?.subtitle || "Des formules de pointe ciblées, développées spécifiquement pour répondre aux exigences réelles du climat algérien."}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              { icon: <ShieldCheck size={36} color="var(--accent-aqua)" />, title: t.philosophy?.card1Title || "Actifs Validés par la Science", desc: t.philosophy?.card1Desc || "Priorité aux molécules pures de grade cosmétique expert (Niacinamide pure, Panthénol B5, Ectoïne)." },
              { icon: <Sun size={36} color="var(--accent-aqua)" />, title: t.philosophy?.card2Title || "Stabilité Haute Température", desc: t.philosophy?.card2Desc || "Formule testée avec succès sous stress thermique à 45 °C, garantit une stabilité parfaite face aux conditions climatiques extrêmes." },
              { icon: <Zap size={36} color="var(--accent-aqua)" />, title: t.philosophy?.card3Title || "Tube Canule Zéro-Panne", desc: t.philosophy?.card3Desc || "Embout canule de précision. Évite les pannes fréquentes des pompes importées et prévient la contamination." },
            ].map((card, i) => (
              <div key={i} className={`feature-box gsap-card-glow ${i % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"} stagger-${i + 1}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius, 16px)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.6rem" }}>{card.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Points de Vente ──────────────────────────────────────────────────── */}
      <section style={{ padding: "4.5rem 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)" }} id="pharmacies">
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 2.8rem" }}>
            <div className="section-header center">
              <span className="section-tag">{t.nav.pharmacies}</span>
              <h2 className="section-title gsap-headline">
                {lang === "dz" ? "اعثر على منتجاتنا قريباً منك" : "Trouvez-nous Près de Chez Vous"}
              </h2>
              <p className="section-subtitle">
                Disponible en commande en ligne avec livraison 58 Wilayas ou dans notre réseau d'officines conventionnées.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.6rem" }}>
            {pharmacies.map((pharma, idx) => (
              <div
                key={pharma.id}
                className={`pharmacy-card gsap-card-glow ${idx % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"} stagger-${(idx % 4) + 1}`}
                style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-subtle)", borderRadius: "16px", padding: "1.8rem", boxShadow: "var(--shadow-sm)" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                    <div className="radar-ping-dot" style={{ width: "32px", height: "32px" }}>
                      <span className="radar-ping-wave" />
                      <MapPin size={22} color="var(--accent-aqua)" style={{ position: "relative", zIndex: 2 }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--accent-aqua)", fontWeight: 800, background: "var(--accent-aqua-subtle)", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
                      {pharma.wilaya || pharma.city}
                    </span>
                  </div>

                  <h4 style={{ color: "var(--text-primary)", fontWeight: 900, marginBottom: "0.4rem", fontSize: "1.1rem" }}>{pharma.name}</h4>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>{pharma.address}</p>
                </div>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--success)", fontWeight: 800 }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 6px var(--success)" }} />
                      <span>{pharma.statusText || "En Stock Immédiat"}</span>
                    </div>
                  </div>

                  {pharma.phone && (
                    <a
                      href={`tel:${pharma.phone}`}
                      className="btn-outline magnetic-btn"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", width: "100%", padding: "0.55rem 0.8rem", fontSize: "0.78rem", textDecoration: "none" }}
                    >
                      <PhoneCall size={13} color="var(--accent-aqua)" />
                      <span>{pharma.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
