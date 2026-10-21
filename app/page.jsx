"use client";

import React, { useState, useEffect } from "react";
import { ANJUCIA_PRODUCTS, AVAILABLE_PRODUCT_ID, FLAGSHIP_PRODUCT, COMING_SOON_PRODUCTS } from "./data/products";
import { useCart } from "./context/CartContext";
import { useLanguage } from "./context/LanguageContext";
import DropletHeroVisual from "./components/ui/DropletHeroVisual";
import ComingSoonCard from "./components/ui/ComingSoonCard";
import DropletGame from "./components/game/DropletGame";
import BundleOffers from "./components/BundleOffers";
import QuickSkinMatchModal from "./components/QuickSkinMatchModal";
import AnjuciaLogo, { DropletMark } from "./components/brand/AnjuciaLogo";
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
  Gamepad2,
  Clock,
  Bell,
  HeartHandshake
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { t, lang } = useLanguage();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [wilayaWaitlist, setWilayaWaitlist] = useState("");

  const handleWilayaSubmit = (e) => {
    e.preventDefault();
    if (!wilayaWaitlist.trim()) return;
    showToast(
      lang === "dz"
        ? `تم تسجيلك ! سنخبرك فور توفر الصيدليات المعتمدة في ${wilayaWaitlist}`
        : `Enregistré ! Vous serez informé des officines partenaires à ${wilayaWaitlist} 🇩🇿`
    );
    setWilayaWaitlist("");
  };

  return (
    <main style={{ paddingBottom: "5rem" }}>
      {/* 10-Second Quick Skin Match Modal */}
      <QuickSkinMatchModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: "relative",
          padding: "2rem 0 3.5rem",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% -10%, var(--hero-glow-color, rgba(113, 159, 183, 0.18)) 0%, var(--bg-primary) 70%)",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        <div className="container">
          <div className="hero-grid-layout" style={{ alignItems: "center" }}>
            {/* Left — Brand copy */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--accent-aqua-subtle)",
                  border: "1px solid var(--border-light)",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--badge-radius, 9999px)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "var(--accent-aqua)",
                  marginBottom: "1.2rem"
                }}
              >
                <span className="topbar-dot" />
                <span>FORMULATION EXPERTE • 1800 DA • ALGÉRIE 🇩🇿</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  lineHeight: 1.16,
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.025em"
                }}
              >
                {lang === "dz"
                  ? "العناية الطبية الفائقة بالبشرة في الجزائر"
                  : "Le Soin Visage Apaisant & Hydratant Conçu pour le Climat Algérien"}
              </h1>

              <p
                style={{
                  fontSize: "1.02rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  maxWidth: "600px",
                  marginBottom: "1.8rem"
                }}
              >
                {lang === "dz"
                  ? "مستحلب خفيف فائق الترطيب بملمس حريري غير زيتي، يجمع بين النياسيناميد 3% والبانتينول B5 2%. مصمم ليحمي بشرتك من حرارة 45°C والشهيلي بسعر مناسب 1800 دج."
                  : "Une émulsion ultra-légère au fini satiné non gras formulée pour protéger votre peau des chaleurs extrêmes et du vent sec. Niacinamide 3% pure, Panthénol B5 2% et Centella 1%."}
              </p>

              {/* Stats Counters */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginBottom: "2rem",
                  padding: "1.1rem 1.4rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--card-radius, 16px)",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent-aqua)", lineHeight: 1 }}>+148%</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 700 }}>Hydratation 15min</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>45°C</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 700 }}>Stabilité Prouvée</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--success)", lineHeight: 1 }}>1 800 DA</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 700 }}>Tarif Officiel Unique</div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.4rem" }}>
                <button
                  className="btn-aqua magnetic-btn"
                  onClick={() => {
                    addToCart(AVAILABLE_PRODUCT_ID, 1);
                    setIsCartOpen(true);
                  }}
                  style={{ fontSize: "0.98rem", padding: "0.95rem 2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Droplets size={18} />
                  <span>{lang === "dz" ? "اطلب الجل-كريم (1800 دج)" : "Commander le Soin (1 800 DA)"}</span>
                </button>

                <button
                  className="btn-outline magnetic-btn"
                  onClick={() => setIsQuizOpen(true)}
                  style={{ fontSize: "0.92rem", padding: "0.95rem 1.6rem", display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
                >
                  <Sparkles size={17} color="var(--accent-aqua)" />
                  <span>{t.quickQuizBtn}</span>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontSize: "0.76rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><Truck size={14} color="var(--accent-aqua)" /> Livraison 58 Wilayas</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><ShieldCheck size={14} color="var(--success)" /> Paiement à la réception</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><Zap size={14} color="var(--accent-aqua)" /> Tube Canule Zéro-Panne</span>
              </div>
            </div>

            {/* Right — Single Flagship Hero Visual (vector droplet lockup, 1800 DA) */}
            <div>
              <DropletHeroVisual
                onAddToCart={() => {
                  addToCart(AVAILABLE_PRODUCT_ID, 1);
                  setIsCartOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ──────────────────────────────────────────────────── */}
      <div className="gsap-ticker-container" aria-hidden="true">
        <div className="gsap-ticker-track">
          {[
            "1 800 DA · Soin Visage Apaisant 50 ml",
            "58 Wilayas · Livraison Rapide & COD",
            "Formulé pour le Climat Algérien",
            "pH 5.2 Physiologique Strict",
            "Niacinamide Pure 3% + Panthénol B5 2%",
            "Tube Canule Zéro-Panne Hygiénique",
            "Application Mobile Installable (PWA)"
          ].concat([
            "1 800 DA · Soin Visage Apaisant 50 ml",
            "58 Wilayas · Livraison Rapide & COD",
            "Formulé pour le Climat Algérien",
            "pH 5.2 Physiologique Strict",
            "Niacinamide Pure 3% + Panthénol B5 2%",
            "Tube Canule Zéro-Panne Hygiénique",
            "Application Mobile Installable (PWA)"
          ]).map((item, i) => (
            <span key={i} className="gsap-ticker-item">
              <span className="gsap-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Interactive Arcade Game Block: Goutte Rescue (Replaced DermLab Mixer) ─ */}
      <section id="game-section" style={{ padding: "4rem 0", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto 2.5rem" }}>
            <span className="section-tag" style={{ background: "rgba(155, 176, 160, 0.16)", color: "var(--success)", borderColor: "rgba(155, 176, 160, 0.3)" }}>
              🎮 NOUVEAU • DÉFI INTERACTIF
            </span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {lang === "dz" ? "لعبة أنقذ القطرة : تفادى الحرارة واجمع الترطيب" : "Goutte Rescue : Le Défi de la Barrière Cutanée"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {lang === "dz"
                ? "حرّك القطرة بإصبعك على الشاشة : التقط مكونات كريم أنجوسيا وتفادى أشعة الشمس الحارقة."
                : "Glissez votre doigt pour attraper la Niacinamide et le Panthénol tout en esquivant les rayons UV et les pics de chaleur à 45°C."}
            </p>
          </div>

          <DropletGame compact={true} />

          <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
            <Link
              href="/game"
              className="btn-outline"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Gamepad2 size={16} color="var(--accent-aqua)" />
              <span>{lang === "dz" ? "فتح اللعبة في صفحة كاملة" : "Ouvrir en plein écran"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bundles ──────────────────────────────────────────────────────────── */}
      <BundleOffers />

      {/* ── Product Collection (1 Available, Rest Coming Soon without images) ──── */}
      <section style={{ padding: "4rem 0" }} id="produits">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.4rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-tag">{t.productsPage?.tag || "COLLECTION EXPERTE ANJUCIA"}</span>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                {t.nav.products}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                1 formule disponible en commande directe (1 800 DA) • Les autres formules arrivent bientôt.
              </p>
            </div>
            <Link href="/products" className="btn-outline magnetic-btn">
              <span>{t.productsPage?.all || "Voir le Catalogue"}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.6rem"
            }}
          >
            {/* The single live product card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "2px solid var(--accent-aqua)",
                borderRadius: "var(--card-radius, 18px)",
                padding: "1.8rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "var(--shadow-glow), var(--shadow-sm)",
                position: "relative"
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    background: "var(--accent-aqua)",
                    color: "#11171A",
                    marginBottom: "1rem"
                  }}
                >
                  DISPONIBLE (1 800 DA)
                </span>

                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <DropletMark size={84} color="var(--accent-aqua)" />
                  <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: "var(--accent-aqua)", fontWeight: 800 }}>
                    Tube canule haute précision 50 ml
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--accent-aqua)", fontWeight: 800, textTransform: "uppercase" }}>
                  Hydratation Apaisante
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Lightweight Soothing Face Gel-Cream
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                  Émulsion H/E ultra-légère au fini satiné non gras. Niacinamide 3%, Panthénol B5 2%, Centella 1% & Squalane 3%.
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="price-dzd" style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--accent-aqua)" }}>
                    1 800 DA
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--success)", fontWeight: 800 }}>✓ En Stock</div>
                </div>
                <button
                  className="btn-aqua magnetic-btn"
                  onClick={() => {
                    addToCart(AVAILABLE_PRODUCT_ID, 1);
                    setIsCartOpen(true);
                  }}
                  style={{ padding: "0.7rem 1.3rem", fontSize: "0.85rem" }}
                >
                  {lang === "dz" ? "أضف للسلة" : "Ajouter au Panier"}
                </button>
              </div>
            </div>

            {/* Coming Soon Formulas (No images, clean teaser) */}
            {COMING_SOON_PRODUCTS.slice(0, 3).map((product, idx) => (
              <ComingSoonCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Cards ─────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)" }} id="charte">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 3rem" }}>
            <span className="section-tag">{t.philosophy?.tag || "PHILOSOPHIE FORMULATEUR"}</span>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              {t.philosophy?.title || "Une Approche Scientifique Dédiée au Marché Algérien"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              {t.philosophy?.subtitle || "Des formules ciblées, développées spécifiquement pour répondre aux exigences réelles du climat algérien."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.6rem" }}>
            {[
              { icon: <ShieldCheck size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card1Title || "Actifs Validés par la Science", desc: t.philosophy?.card1Desc || "Priorité aux molécules pures de grade cosmétique expert (Niacinamide pure, Panthénol B5, Ectoïne)." },
              { icon: <Sun size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card2Title || "Stabilité Haute Température 45°C", desc: t.philosophy?.card2Desc || "Formule testée avec succès sous stress thermique à 45 °C, garantit une stabilité parfaite face aux conditions climatiques extrêmes." },
              { icon: <Zap size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card3Title || "Tube Canule Zéro-Panne", desc: t.philosophy?.card3Desc || "Embout canule de précision. Évite les pannes fréquentes des pompes importées et prévient la contamination." },
            ].map((card, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius, 16px)", padding: "1.8rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ marginBottom: "0.9rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{card.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customer Feedback & Wilaya Coverage (Coming soon preview) ──────── */}
      <section style={{ padding: "4rem 0" }} id="avis">
        <div className="container" style={{ maxWidth: "780px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1.5px dashed var(--border-light)",
              borderRadius: "var(--card-radius, 22px)",
              padding: "2.5rem 2rem",
              textAlign: "center"
            }}
          >
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", color: "var(--accent-aqua)" }}>
              <HeartHandshake size={28} />
            </div>

            <span className="section-tag">ENGAGEMENT TRANSPARENCE ANJUCIA</span>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Avis Clients Vérifiés & Réseau Pharmacies
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 1.6rem" }}>
              À l'ouverture du lancement officiel, les avis proviennent exclusivement des clients ayant reçu leur commande avec code de vérification scellé.
              Entrez votre Wilaya pour être informé de la mise en rayon dans votre secteur :
            </p>

            <form onSubmit={handleWilayaSubmit} style={{ display: "flex", gap: "0.6rem", maxWidth: "420px", margin: "0 auto" }}>
              <input
                type="text"
                value={wilayaWaitlist}
                onChange={(e) => setWilayaWaitlist(e.target.value)}
                placeholder="Votre Wilaya (ex: 16 Alger, 31 Oran...)"
                required
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
              <button type="submit" className="btn-aqua" style={{ padding: "0.75rem 1.4rem", fontSize: "0.85rem" }}>
                M'informer
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
