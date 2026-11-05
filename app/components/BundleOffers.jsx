"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Check, ShoppingBag, Bell, Sparkles, Clock } from "lucide-react";

export default function BundleOffers() {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { lang } = useLanguage();
  const [notifiedDuo, setNotifiedDuo] = useState(false);
  const [notifiedTotal, setNotifiedTotal] = useState(false);

  const langKey = (lang === "dz" || lang === "ar") ? "dz" : lang === "en" ? "en" : "fr";

  const content = {
    fr: {
      tag: "OFFRES & PROTOCOLES ANJUCIA",
      title: "Commandez le Soin ou Découvrez les Packs",
      desc: "Le Soin Visage Apaisant 50 ml est disponible dès aujourd'hui. Les coffrets duo & trio arrivent très bientôt.",
      soloBadge: "DISPONIBLE IMMÉDIATEMENT",
      inStock: "✓ En Stock",
      soloTitle: "Pack Découverte Solo (50 ml)",
      soloSub: "Format 50 ml • Formule Apaisante Niacinamide 3%",
      soloFeatures: [
        "1x Soin Visage Apaisant Ultra-Léger 50 ml",
        "Conditionnement protecteur haute précision",
        "Expédition express 58 Wilayas en 24-48h",
        "Paiement à la livraison après vérification du colis",
        "QR Code VIP scellé dans chaque boîte"
      ],
      soloBtn: "Commander ce Soin",
      soloAdded: "Gel-Crème 50 ml ajouté au panier !",
      soonBadge: "Bientôt Disponible",
      duoTag: "Pack Synergie",
      duoTitle: "Pack Duo Barrière Cellulaire",
      duoSub: "Gel-Crème 50 ml + Crème CeraHydra+ 50 ml",
      comingSoonTitle: "Coming Soon",
      comingSoonDesc: "Formulation en cours • Lancement officiel très prochainement",
      notifyBtn: "Me prévenir au lancement",
      duoNotified: "Inscrit pour le Duo ✓",
      trioTag: "Rituel Intégral",
      trioTitle: "Pack Bouclier Total SPF50",
      trioSub: "Nettoyant + Gel-Crème + BioShield SPF50+",
      trioNotified: "Inscrit pour le Trio ✓",
      notifyToast: (name) => `Enregistré ! Vous serez prévenu du lancement du ${name} ✨`
    },
    en: {
      tag: "ANJUCIA OFFERS & PROTOCOLS",
      title: "Order Face Care or Discover Bundles",
      desc: "The Soothing Face Gel-Cream 50 ml is available now. Duo & trio sets are coming very soon.",
      soloBadge: "AVAILABLE NOW",
      inStock: "✓ In Stock",
      soloTitle: "Solo Discovery Pack (50 ml)",
      soloSub: "50 ml Format • Soothing 3% Niacinamide Formula",
      soloFeatures: [
        "1x Ultra-Lightweight Soothing Face Care 50 ml",
        "High-precision protective packaging",
        "Express delivery across all 58 Wilayas in 24-48h",
        "Cash on delivery after package inspection",
        "Sealed VIP QR Code inside every box"
      ],
      soloBtn: "Order Face Care",
      soloAdded: "Gel-Cream 50 ml added to bag!",
      soonBadge: "Coming Soon",
      duoTag: "Synergy Pack",
      duoTitle: "Cellular Barrier Duo Pack",
      duoSub: "Gel-Cream 50 ml + CeraHydra+ Cream 50 ml",
      comingSoonTitle: "Coming Soon",
      comingSoonDesc: "Formulation in progress • Official launch coming soon",
      notifyBtn: "Notify Me on Launch",
      duoNotified: "Registered for Duo ✓",
      trioTag: "Complete Ritual",
      trioTitle: "Total Shield SPF50 Pack",
      trioSub: "Cleanser + Gel-Cream + BioShield SPF50+",
      trioNotified: "Registered for Trio ✓",
      notifyToast: (name) => `Saved! You will be notified when ${name} launches ✨`
    },
    dz: {
      tag: "عروض حصرية مع توصيل 58 ولاية",
      title: "اختر الصيغة المناسبة لبشرتك",
      desc: "الجل-كريم متوفر حالياً للشحن الفوري. الباقات المتعددة في مرحلة الإطلاق القريب.",
      soloBadge: "متوفر للشراء الفوري",
      inStock: "✓ متوفر في المخزون",
      soloTitle: "باقة ديسكوفري الفردية (50 مل)",
      soloSub: "حجم 50 مل • تركيبة مهدئة بنياسيناميد 3%",
      soloFeatures: [
        "1x جل-كريم طبي مرطب ومهدئ 50 مل",
        "تعليب صحي عالي الدقة يحمي التركيبة",
        "شحن سريع لـ 58 ولاية خلال 24-48 ساعة",
        "دفع عند الاستلام بعد معاينة الطرد",
        "كود QR خاص ومختوم في كل علبة"
      ],
      soloBtn: "اطلب الآن",
      soloAdded: "تمت إضافة الجل-كريم 50 مل إلى السلة !",
      soonBadge: "قريباً",
      duoTag: "باقة التكامل",
      duoTitle: "باقة الديو لترميم حاجز البشرة",
      duoSub: "جل-كريم 50 مل + كريم سيراهيدرا+ 50 مل",
      comingSoonTitle: "Coming Soon • قريباً",
      comingSoonDesc: "في مرحلة التحضير المخبري • الإطلاق قريباً",
      notifyBtn: "أعلمني فور التوفر",
      duoNotified: "تم تسجيلك للديو ✓",
      trioTag: "الروتين الكامل",
      trioTitle: "باقة الحماية الشاملة SPF50",
      trioSub: "غسول + جل-كريم + واقي شمس بيوشيلد SPF50+",
      trioNotified: "تم تسجيلك للتريو ✓",
      notifyToast: (name) => `تم تسجيلك ! سنخبرك فور توفر ${name} ✨`
    }
  };

  const c = content[langKey];

  const handleNotify = (packName, setFn) => {
    setFn(true);
    showToast(c.notifyToast(packName));
  };

  const handleOrderSolo = () => {
    addToCart("soothing-gel-cream", 1);
    showToast(c.soloAdded);
    setIsCartOpen(true);
  };

  return (
    <section id="packs" style={{ padding: "4rem 0" }}>
      <div className="container">
        <div style={{ maxWidth: "720px", margin: "0 auto 3rem", textAlign: "center" }}>
          <span className="section-tag">{c.tag}</span>
          <h2 style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            {c.title}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {c.desc}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.8rem", alignItems: "stretch" }}>
          {/* Solo Card — LIVE */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "none",
              borderRadius: "0px",
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
                    fontWeight: 400,
                    padding: "0.3rem 0.8rem",
                    borderRadius: "0px",
                    background: "#4d7358",
                    color: "#ffffff"
                  }}
                >
                  {c.soloBadge}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--success)", fontWeight: 400 }}>
                  {c.inStock}
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                {c.soloTitle}
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                {c.soloSub}
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem", padding: 0 }}>
                {c.soloFeatures.map((txt, i) => (
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
                style={{ width: "100%", padding: "0.95rem", background: "#4d7358", color: "#ffffff" }}
                onClick={handleOrderSolo}
              >
                <ShoppingBag size={18} />
                <span>{c.soloBtn}</span>
              </button>
            </div>
          </div>

          {/* Duo Pack — COMING SOON */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "none",
              borderRadius: "0px",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              opacity: 0.95
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.72rem",
                    fontWeight: 400,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "0px",
                    background: "rgba(113, 159, 183, 0.14)",
                    color: "var(--accent-aqua)",
                    border: "none"
                  }}
                >
                  <Clock size={12} />
                  {c.soonBadge}
                </span>
              </div>

              {/* Clean Coming Soon Block */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "4.8rem 1.2rem",
                  margin: "1rem 0 1.8rem",
                  background: "rgba(113, 159, 183, 0.05)",
                  border: "none",
                  borderRadius: "0px"
                }}
              >
                <div
                  style={{
                    fontFamily: "'Zain', sans-serif",
                    fontSize: "2.1rem",
                    fontWeight: 400,
                    color: "var(--text-primary)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.1
                  }}
                >
                  {c.comingSoonTitle}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.6rem", maxWidth: "260px", lineHeight: 1.5 }}>
                  {c.comingSoonDesc}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                className={notifiedDuo ? "btn-outline" : "btn-aqua"}
                style={{ width: "100%", padding: "0.95rem" }}
                onClick={() => handleNotify(c.comingSoonTitle, setNotifiedDuo)}
              >
                {notifiedDuo ? <Check size={18} color="var(--success)" /> : <Bell size={18} />}
                <span>{notifiedDuo ? c.duoNotified : c.notifyBtn}</span>
              </button>
            </div>
          </div>

          {/* Total Trio Pack — COMING SOON */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "none",
              borderRadius: "0px",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              opacity: 0.95
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.72rem",
                    fontWeight: 400,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "0px",
                    background: "rgba(113, 159, 183, 0.14)",
                    color: "var(--accent-aqua)",
                    border: "none"
                  }}
                >
                  <Clock size={12} />
                  {c.soonBadge}
                </span>
              </div>

              {/* Clean Coming Soon Block */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "4.8rem 1.2rem",
                  margin: "1rem 0 1.8rem",
                  background: "rgba(113, 159, 183, 0.05)",
                  border: "none",
                  borderRadius: "0px"
                }}
              >
                <div
                  style={{
                    fontFamily: "'Zain', sans-serif",
                    fontSize: "2.1rem",
                    fontWeight: 400,
                    color: "var(--text-primary)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.1
                  }}
                >
                  {c.comingSoonTitle}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.6rem", maxWidth: "260px", lineHeight: 1.5 }}>
                  {c.comingSoonDesc}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: "1.2rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                className={notifiedTotal ? "btn-outline" : "btn-aqua"}
                style={{ width: "100%", padding: "0.95rem" }}
                onClick={() => handleNotify(c.comingSoonTitle, setNotifiedTotal)}
              >
                {notifiedTotal ? <Check size={18} color="var(--success)" /> : <Bell size={18} />}
                <span>{notifiedTotal ? c.trioNotified : c.notifyBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
