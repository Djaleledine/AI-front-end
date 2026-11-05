"use client";

import React, { useState, useEffect } from "react";
import { ANJUCIA_PRODUCTS, AVAILABLE_PRODUCT_ID, FLAGSHIP_PRODUCT, COMING_SOON_PRODUCTS } from "./data/products";
import { useCart } from "./context/CartContext";
import { useLanguage } from "./context/LanguageContext";
import ComingSoonCard from "./components/ui/ComingSoonCard";
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
  Clock,
  Bell,
  HeartHandshake,
  Globe
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
      lang === "dz" || lang === "ar"
        ? `تم تسجيلك ! سنخبرك فور توفر الصيدليات المعتمدة في ${wilayaWaitlist} 🇩🇿`
        : lang === "en"
        ? `Saved! You will be notified of partner pharmacies in ${wilayaWaitlist} 🇩🇿`
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
          background: "radial-gradient(circle at 50% -10%, var(--hero-glow-color, rgba(113, 159, 183, 0.18)) 0%, transparent 70%)",
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
                  border: "none",
                  padding: "0.45rem 1rem",
                  borderRadius: "0px",
                  fontSize: "0.8rem",
                  fontWeight: 400,
                  color: "var(--accent-aqua)",
                  marginBottom: "1.2rem"
                }}
              >
                <span className="topbar-dot" />
                <span>{t.hero?.pill || (lang === "en" ? "ADVANCED FORMULATION • MADE IN ALGERIA 🇩🇿" : lang === "dz" || lang === "ar" ? "تركيبة عناية متطورة • مخدوم فالدزاير 🇩🇿" : "FORMULATION EXPERTE • ALGÉRIE 🇩🇿")}</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  lineHeight: 1.16,
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.025em"
                }}
              >
                {t.hero?.title || (lang === "dz" || lang === "ar"
                  ? "العناية الطبية الفائقة بالبشرة في الجزائر"
                  : lang === "en"
                  ? "Soothing & Hydrating Skincare Designed for All Skin Types"
                  : "Le Soin Visage Apaisant & Hydratant Conçu pour le Climat Algérien")}
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
                {t.hero?.desc || (lang === "dz" || lang === "ar"
                  ? "مستحلب خفيف فائق الترطيب بملمس حريري غير زيتي، يجمع بين النياسيناميد 3% والبانتينول B5 2%. مصمم ليحمي بشرتك من حرارة 45°C والشهيلي بسعر مناسب."
                  : lang === "en"
                  ? "An ultra-lightweight emulsion with a non-greasy satin finish formulated to protect your skin from extreme heat and dry winds. Pure 3% Niacinamide, 2% Panthenol B5 and 1% Centella."
                  : "Une émulsion ultra-légère au fini satiné non gras formulée pour protéger votre peau des chaleurs extrêmes et du vent sec. Niacinamide 3% pure, Panthénol B5 2% et Centella 1%.")}
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
                  border: "none",
                  borderRadius: "0px",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div>
                  <div className="stats-number" style={{ fontSize: "1.8rem", fontWeight: 400, color: "var(--accent-aqua)", lineHeight: 1, direction: "ltr", unicodeBidi: "isolate" }}>+148%</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 400 }}>
                    {t.hero?.stat1Lbl || (lang === "dz" || lang === "ar" ? "ترطيب 15 دقيقة" : lang === "en" ? "Hydration 15min" : "Hydratation 15min")}
                  </div>
                </div>
                <div>
                  <div className="stats-number" style={{ fontSize: "1.8rem", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1, direction: "ltr", unicodeBidi: "isolate" }}>45°C</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 400 }}>
                    {lang === "dz" || lang === "ar" ? "ثبات مثبت" : lang === "en" ? "Proven Stability" : "Stabilité Prouvée"}
                  </div>
                </div>
                <div>
                  <div className="stats-number" style={{ fontSize: "1.8rem", fontWeight: 400, color: "var(--success)", lineHeight: 1, direction: "ltr", unicodeBidi: "isolate" }}>pH 5.2</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 400 }}>
                    {t.hero?.stat3Lbl || (lang === "dz" || lang === "ar" ? "حموضة فيزيولوجية مثالية" : lang === "en" ? "Strict Physiological pH" : "pH Physiologique Strict")}
                  </div>
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
                  <span>{t.hero?.orderFlagship || (lang === "dz" || lang === "ar" ? "اطلب الجل-كريم" : lang === "en" ? "Order Face Care" : "Commander le Soin")}</span>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <Truck size={14} color="var(--accent-aqua)" /> {lang === "dz" || lang === "ar" ? "توصيل لـ 58 ولاية" : lang === "en" ? "58 Wilayas Delivery" : "Livraison 58 Wilayas"}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <ShieldCheck size={14} color="var(--success)" /> {lang === "dz" || lang === "ar" ? "الدفع عند الاستلام" : lang === "en" ? "Cash on Delivery" : "Paiement à la réception"}
                </span>
              </div>
            </div>

            {/* Right — Single Flagship Hero Visual (Replaced with Official Anjucia Boutique Visual) */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "520px",
                  borderRadius: "0px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md), var(--shadow-glow)",
                  border: "none",
                  background: "var(--bg-card)",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease"
                }}
              >
                <img
                  src="/assets/anjucia-bag-hero.jpg"
                  alt="ANJUCIA Advanced Skincare Boutique"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                    aspectRatio: "1024 / 765"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ──────────────────────────────────────────────────── */}
      <div className="gsap-ticker-container" aria-hidden="true">
        <div className="gsap-ticker-track">
          {(lang === "en"
            ? [
                "Soothing Face Gel-Cream 50 ml",
                "58 Wilayas · Fast Shipping & COD",
                "Formulated for North African Climate",
                "pH 5.2 Strict Physiological Balance",
                "Pure 3% Niacinamide + 2% Panthenol B5",
                "Clinically Validated Tolerance",
                "Installable Native App (PWA)"
              ]
            : (lang === "dz" || lang === "ar")
            ? [
                "جل-كريم مرطب ومهدئ 50 مل",
                "توصيل سريع ودفع عند الاستلام لـ 58 ولاية",
                "مخصص لمناخ الجزائر",
                "حموضة فيزيولوجية مثالية pH 5.2",
                "نياسيناميد نقي 3% + بانتينول B5 2%",
                "تركيبة معتمدة عالية التحمل",
                "تطبيق الهاتف الذكي متاح للتثبيت (PWA)"
              ]
            : [
                "Soin Visage Apaisant 50 ml",
                "58 Wilayas · Livraison Rapide & COD",
                "Formulé pour le Climat Algérien",
                "pH 5.2 Physiologique Strict",
                "Niacinamide Pure 3% + Panthénol B5 2%",
                "Formule Validée Haute Tolérance",
                "Application Mobile Installable (PWA)"
              ]
          ).concat(lang === "en"
            ? [
                "Soothing Face Gel-Cream 50 ml",
                "58 Wilayas · Fast Shipping & COD",
                "Formulated for North African Climate",
                "pH 5.2 Strict Physiological Balance",
                "Pure 3% Niacinamide + 2% Panthenol B5",
                "Clinically Validated Tolerance",
                "Installable Native App (PWA)"
              ]
            : (lang === "dz" || lang === "ar")
            ? [
                "جل-كريم مرطب ومهدئ 50 مل",
                "توصيل سريع ودفع عند الاستلام لـ 58 ولاية",
                "مخصص لمناخ الجزائر",
                "حموضة فيزيولوجية مثالية pH 5.2",
                "نياسيناميد نقي 3% + بانتينول B5 2%",
                "تركيبة معتمدة عالية التحمل",
                "تطبيق الهاتف الذكي متاح للتثبيت (PWA)"
              ]
            : [
                "Soin Visage Apaisant 50 ml",
                "58 Wilayas · Livraison Rapide & COD",
                "Formulé pour le Climat Algérien",
                "pH 5.2 Physiologique Strict",
                "Niacinamide Pure 3% + Panthénol B5 2%",
                "Formule Validée Haute Tolérance",
                "Application Mobile Installable (PWA)"
              ]
          ).map((item, i) => (
            <span key={i} className="gsap-ticker-item">
              <span className="gsap-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bundles ──────────────────────────────────────────────────────────── */}
      <BundleOffers />

      {/* ── Product Collection (1 Available, Rest Coming Soon without images) ──── */}
      <section style={{ padding: "4rem 0" }} id="produits">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.4rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-tag">{t.productsPage?.tag || "COLLECTION EXPERTE ANJUCIA"}</span>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                {t.nav.products}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                {lang === "dz" || lang === "ar"
                  ? "صيغة واحدة متوفرة حالياً للشراء المباشر • الصيغ الأخرى قادمة قريباً."
                  : lang === "en"
                  ? "1 formula available for immediate order • Other clinical formulas arriving soon."
                  : "1 formule disponible en commande directe • Les autres formules arrivent bientôt."}
              </p>
            </div>
            <Link href="/products" className="btn-outline magnetic-btn">
              <span>{t.productsPage?.all || (lang === "en" ? "View Catalog" : lang === "dz" || lang === "ar" ? "عرض الكتالوج" : "Voir le Catalogue")}</span>
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
                border: "none",
                borderRadius: "0px",
                padding: "1.8rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "var(--shadow-glow), var(--shadow-sm)",
                position: "relative"
              }}
            >
              <div>
                <div style={{ marginBottom: "1.2rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      padding: "0.3rem 0.75rem",
                      borderRadius: "0px",
                      background: "#4d7358",
                      color: "#ffffff",
                      direction: "ltr",
                      unicodeBidi: "isolate"
                    }}
                  >
                    {lang === "dz" || lang === "ar" ? "متوفر حالياً" : lang === "en" ? "AVAILABLE" : "DISPONIBLE"}
                  </span>
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--accent-aqua)", fontWeight: 400, textTransform: "uppercase" }}>
                  {lang === "dz" || lang === "ar" ? "ترطيب مهدئ" : lang === "en" ? "Soothing Hydration" : "Hydratation Apaisante"}
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Lightweight Soothing Face Gel-Cream
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {lang === "dz" || lang === "ar"
                    ? "مستحلب خفيف جداً بلمسة ساتانية غير دهنية. نياسيناميد 3%، بانتينول B5 2%، سنتيلا 1% وسكوالان 3%."
                    : lang === "en"
                    ? "Ultra-lightweight O/W emulsion with a non-greasy satin finish. 3% Niacinamide, 2% Panthenol B5, 1% Centella & 3% Squalane."
                    : "Émulsion H/E ultra-légère au fini satiné non gras. Niacinamide 3%, Panthénol B5 2%, Centella 1% & Squalane 3%."}
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--success)", fontWeight: 400 }}>
                    {lang === "dz" || lang === "ar"
                      ? "✓ متوفر فوراً • 58 ولاية"
                      : lang === "en"
                      ? "✓ In Stock • 58 Wilayas"
                      : "✓ En Stock Immédiat • 58 Wilayas"}
                  </div>
                </div>
                <button
                  className="btn-aqua magnetic-btn"
                  onClick={() => {
                    addToCart(AVAILABLE_PRODUCT_ID, 1);
                    setIsCartOpen(true);
                  }}
                  style={{ padding: "0.7rem 1.3rem", fontSize: "0.85rem", background: "#4d7358", color: "#ffffff" }}
                >
                  {t.hero?.addToCart || (lang === "dz" || lang === "ar" ? "أضف للسلة" : lang === "en" ? "Add to Bag" : "Ajouter au Panier")}
                </button>
              </div>
            </div>

            {/* Coming Soon Formulas (No images, clean teaser) */}
            {COMING_SOON_PRODUCTS.slice(0, 2).map((product, idx) => (
              <ComingSoonCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Cards ─────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0", background: "var(--bg-glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderTop: "1px solid var(--border-subtle)" }} id="charte">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 3rem" }}>
            <span className="section-tag">{t.philosophy?.tag || "PHILOSOPHIE FORMULATEUR"}</span>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              {t.philosophy?.title || "Une Approche Scientifique Dédiée au Marché Algérien"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              {t.philosophy?.subtitle || "Des formules ciblées, développées spécifiquement pour répondre aux exigences réelles du climat algérien."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.6rem" }}>
            {[
              { icon: <ShieldCheck size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card1Title || "Actifs Validés par la Science", desc: t.philosophy?.card1Desc || "Priorité aux molécules pures de grade cosmétique expert (Niacinamide pure, Panthénol B5)." },
              { icon: <Sun size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card2Title || "Stabilité Haute Température 45°C", desc: t.philosophy?.card2Desc || "Formule testée avec succès sous stress thermique à 45 °C, garantit une stabilité parfaite face aux conditions climatiques extrêmes." },
              { icon: <Globe size={34} color="var(--accent-aqua)" />, title: t.philosophy?.card3Title || "Formulée en Algérie. Validée à l’international.", desc: t.philosophy?.card3Desc || "La crème Anjucia est conçue par une pharmacienne algérienne, et a obtenu la validation d’une experte internationale en formulation." },
            ].map((card, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "none", borderRadius: "0px", padding: "1.8rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ marginBottom: "0.9rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{card.title}</h3>
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
              border: "none",
              borderRadius: "0px",
              padding: "2.5rem 2rem",
              textAlign: "center"
            }}
          >
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", color: "var(--accent-aqua)" }}>
              <HeartHandshake size={28} />
            </div>

            <span className="section-tag">
              {lang === "dz" || lang === "ar" ? "التزام الشفافية من أنجوسيا" : lang === "en" ? "ANJUCIA TRANSPARENCY PLEDGE" : "ENGAGEMENT TRANSPARENCE ANJUCIA"}
            </span>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {lang === "dz" || lang === "ar" ? "آراء الزبائن الموثقة وشبكة الصيدليات" : lang === "en" ? "Verified Customer Reviews & Pharmacy Network" : "Avis Clients Vérifiés & Réseau Pharmacies"}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 1.6rem" }}>
              {lang === "dz" || lang === "ar"
                ? "عند الإطلاق الرسمي، تأتي التقييمات حصرياً من الزبائن الذين استلموا طلبياتهم مع كود التوثيق. اكتب ولايتك لتصلك إشعارات توفر المنتج في منطقتك :"
                : lang === "en"
                ? "Upon official launch, reviews come exclusively from verified buyers who received their package with a sealed verification code. Enter your Wilaya to get notified of availability in your area:"
                : "À l'ouverture du lancement officiel, les avis proviennent exclusivement des clients ayant reçu leur commande avec code de vérification scellé. Entrez votre Wilaya pour être informé de la mise en rayon dans votre secteur :"}
            </p>

            <form onSubmit={handleWilayaSubmit} style={{ display: "flex", gap: "0.6rem", maxWidth: "420px", margin: "0 auto" }}>
              <input
                type="text"
                value={wilayaWaitlist}
                onChange={(e) => setWilayaWaitlist(e.target.value)}
                placeholder={lang === "dz" || lang === "ar" ? "ولايتك (مثال: 16 الجزائر، 31 وهران...)" : lang === "en" ? "Your Wilaya (e.g. 16 Algiers, 31 Oran...)" : "Votre Wilaya (ex: 16 Alger, 31 Oran...)"}
                required
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  background: "var(--bg-input)",
                  border: "none",
                  borderRadius: "0px",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
              <button type="submit" className="btn-aqua" style={{ padding: "0.75rem 1.4rem", fontSize: "0.85rem" }}>
                {lang === "dz" || lang === "ar" ? "أعلمني" : lang === "en" ? "Notify Me" : "M'informer"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
