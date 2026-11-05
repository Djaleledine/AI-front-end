"use client";

import React, { useState } from "react";
import { User, QrCode, Package, History, Bell, ShieldCheck, Sparkles, PhoneCall, ArrowRight, Clock } from "lucide-react";
import { DropletMark } from "../components/brand/AnjuciaLogo";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { storeApi } from "../services/storeApi";

const TEXTS = {
  fr: {
    toastSuccess: "Votre inscription au Club VIP est enregistrée !",
    title: "Espace Membre Anjucia",
    subtitle: "Votre compte client & avantages officiels Algérie",
    vipBannerTitle: "Club Privilège ANJUCIA • Accès Anticipé",
    vipBannerDesc: "Inscrivez votre e-mail ou numéro pour être le premier à tester les prochaines formulations en avant-première.",
    placeholder: "Votre e-mail ou téléphone...",
    btnJoin: "Rejoindre",
    upcomingTitle: "Fonctionnalités à venir dans l'application",
    statusSoon: "Bientôt",
    supportTitle: "Besoin d'aide ou commande par téléphone ?",
    supportSub: "Conseillère dermo disponible 7j/7",
    btnCall: "Appeler"
  },
  en: {
    toastSuccess: "Your registration to the VIP Club has been saved!",
    title: "Anjucia Member Space",
    subtitle: "Your customer account & exclusive Algeria benefits",
    vipBannerTitle: "ANJUCIA Privilege Club • Early Access",
    vipBannerDesc: "Enter your email or phone to be among the first to sample our upcoming formulations before launch.",
    placeholder: "Your email or phone number...",
    btnJoin: "Join Club",
    upcomingTitle: "Upcoming Features in the App",
    statusSoon: "Soon",
    supportTitle: "Need assistance or phone order?",
    supportSub: "Dermo advisor available 7 days a week",
    btnCall: "Call"
  },
  dz: {
    toastSuccess: "تم تسجيل بريدك في قائمة الانتظار !",
    title: "فضاء زبائن أنجوسيا",
    subtitle: "كل خدمات تطبيق أنجوسيا في مكان واحد",
    vipBannerTitle: "نادي الامتياز أنجوسيا • وصول مبكر",
    vipBannerDesc: "سجل بريدك أو رقم هاتفك لتكون أول من يجرب التركيبات القادمة قبل طرحها في الصيدليات.",
    placeholder: "بريدك الإلكتروني أو رقم الهاتف...",
    btnJoin: "انضمام",
    upcomingTitle: "خدمات قادمة قريباً في التطبيق",
    statusSoon: "قريباً",
    supportTitle: "تحتاج مساعدة أو طلب بالهاتف ؟",
    supportSub: "مستشارة عناية متوفرة 7 أيام في الأسبوع",
    btnCall: "اتصال"
  }
};

export default function ProfilePage() {
  const { lang } = useLanguage();
  const { showToast } = useCart();
  const [waitlistEmail, setWaitlistEmail] = useState("");

  const t = TEXTS[lang] || (lang === "ar" ? TEXTS.dz : TEXTS.fr);

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      await storeApi.leads.create({
        productId: "vip-club-access",
        productName: "Club VIP Anjucia",
        contact: waitlistEmail.trim(),
        wilaya: "Algérie",
        source: "Profile VIP Waitlist"
      });
    } catch (_) {}
    showToast(t.toastSuccess);
    setWaitlistEmail("");
  };

  const TILES = [
    {
      icon: Package,
      title: { fr: "Suivi de Commande 58 Wilayas", dz: "تتبع طلبيتك في 58 ولاية", en: "58 Wilayas Order Tracking" },
      desc: { fr: "Suivez votre coursier en temps réel avec notification SMS.", dz: "تتبع فوري لمسار التوصيل مع رسالة نصية قصيرة.", en: "Live courier tracking with instant SMS." },
      status: t.statusSoon
    },
    {
      icon: QrCode,
      title: { fr: "Scanner mon QR Code VIP", dz: "مسح كود الـ QR المختوم", en: "Scan Box VIP QR Code" },
      desc: { fr: "Activez votre garantie et gagnez des points fidélité sur chaque boîte.", dz: "فعّل الضمان واستفد من نقاط المكافأة داخل كل علبة.", en: "Activate authenticity seal & collect points." },
      status: t.statusSoon
    },
    {
      icon: History,
      title: { fr: "Journal d'Hydratation & Photos", dz: "مفكرة تطور البشرة والصور", en: "Skin Progress Journal" },
      desc: { fr: "Comparez vos résultats après 15 jours de Gel-Crème.", dz: "قارن نضارة بشرتك بعد 15 يوم من الاستعمال.", en: "Compare skin texture after 15 days." },
      status: t.statusSoon
    },
    {
      icon: Bell,
      title: { fr: "Alertes Sorties de Formules", dz: "إشعارات إطلاق المنتجات الجديدة", en: "New Release Alerts" },
      desc: { fr: "Soyez prévenu dès la sortie du Sérum Anti-Âge et des nouvelles formules.", dz: "توصل بإشعار حصري عند طرح المنتجات القادمة.", en: "Get notified when new skincare drops." },
      status: t.statusSoon
    }
  ];

  return (
    <main style={{ padding: "1.2rem 0 5.5rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "560px" }}>
        {/* User Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "none",
            borderRadius: "0px",
            padding: "1.6rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--accent-aqua-subtle) 0%, transparent 70%)",
              filter: "blur(20px)"
            }}
          />

          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--accent-aqua-subtle)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <DropletMark size={32} color="var(--accent-aqua)" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.2rem" }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 400, color: "var(--text-primary)" }}>
                {t.title}
              </h1>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 400,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "0px",
                  background: "rgba(113, 159, 183, 0.16)",
                  color: "var(--accent-aqua)",
                  border: "none"
                }}
              >
                VIP 🇩🇿
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* VIP Club Early Access banner */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
            border: "none",
            borderRadius: "0px",
            padding: "1.4rem",
            marginBottom: "1.8rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color: "var(--accent-aqua)", fontWeight: 400, fontSize: "0.85rem" }}>
            <Sparkles size={16} />
            <span>{t.vipBannerTitle}</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
            {t.vipBannerDesc}
          </p>
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              style={{
                flex: 1,
                padding: "0.65rem 0.85rem",
                borderRadius: "0px",
                border: "none",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                outline: "none"
              }}
            />
            <button type="submit" className="btn-aqua" style={{ padding: "0.65rem 1.1rem", fontSize: "0.82rem" }}>
              {t.btnJoin}
            </button>
          </form>
        </div>

        {/* Coming Soon Feature Tiles */}
        <div style={{ marginBottom: "1.8rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 400, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
            {t.upcomingTitle}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {TILES.map((tile, idx) => {
              const Icon = tile.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    border: "none",
                    borderRadius: "0px",
                    padding: "1rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "0px",
                        background: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-aqua)",
                        flexShrink: 0
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 400, color: "var(--text-primary)" }}>
                        {tile.title[lang] || tile.title.fr}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                        {tile.desc[lang] || tile.desc.fr}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 400,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "0px",
                      background: "rgba(113, 159, 183, 0.12)",
                      color: "var(--accent-aqua)",
                      border: "none",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <Clock size={11} />
                    <span>{tile.status}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Support */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "none",
            borderRadius: "0px",
            padding: "1.1rem 1.3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem"
          }}
        >
          <div>
            <div style={{ fontWeight: 400, color: "var(--text-primary)" }}>{t.supportTitle}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.15rem" }}>{t.supportSub}</div>
          </div>
          <a
            href="tel:0550000000"
            className="btn-outline"
            style={{ padding: "0.45rem 0.95rem", fontSize: "0.78rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <PhoneCall size={14} color="var(--accent-aqua)" />
            <span>{t.btnCall}</span>
          </a>
        </div>
      </div>
    </main>
  );
}
