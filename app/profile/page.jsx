"use client";

import React, { useState } from "react";
import { User, QrCode, Package, History, Bell, ShieldCheck, Sparkles, PhoneCall, ArrowRight, Clock } from "lucide-react";
import { DropletMark } from "../components/brand/AnjuciaLogo";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function ProfilePage() {
  const { lang } = useLanguage();
  const { showToast } = useCart();
  const [waitlistEmail, setWaitlistEmail] = useState("");

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    showToast(lang === "dz" ? "تم تسجيل بريدك في قائمة الانتظار !" : "Votre inscription au Club VIP est enregistrée !");
    setWaitlistEmail("");
  };

  const TILES = [
    {
      icon: Package,
      title: { fr: "Suivi de Commande 58 Wilayas", dz: "تتبع طلبيتك في 58 ولاية", en: "58 Wilayas Order Tracking" },
      desc: { fr: "Suivez votre coursier en temps réel avec notification SMS.", dz: "تتبع فوري لمسار التوصيل مع رسالة نصية قصيرة.", en: "Live courier tracking with instant SMS." },
      status: "Bientôt"
    },
    {
      icon: QrCode,
      title: { fr: "Scanner mon QR Code VIP", dz: "مسح كود الـ QR المختوم", en: "Scan Box VIP QR Code" },
      desc: { fr: "Activez votre garantie et gagnez des points fidélité sur chaque boîte.", dz: "فعّل الضمان واستفد من نقاط المكافأة داخل كل علبة.", en: "Activate authenticity seal & collect points." },
      status: "Bientôt"
    },
    {
      icon: History,
      title: { fr: "Journal d'Hydratation & Photos", dz: "مفكرة تطور البشرة والصور", en: "Skin Progress Journal" },
      desc: { fr: "Comparez vos résultats après 15 jours de Gel-Crème.", dz: "قارن نضارة بشرتك بعد 15 يوم من الاستعمال.", en: "Compare skin texture after 15 days." },
      status: "Bientôt"
    },
    {
      icon: Bell,
      title: { fr: "Alertes Sorties de Formules", dz: "إشعارات إطلاق المنتجات الجديدة", en: "New Release Alerts" },
      desc: { fr: "Soyez prévenu dès la sortie de la crème CeraHydra+ et de l'Essence.", dz: "توصل بإشعار حصري عند طرح المنتجات القادمة.", en: "Get notified when new skincare drops." },
      status: "Bientôt"
    }
  ];

  return (
    <main style={{ padding: "1.2rem 0 5.5rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "560px" }}>
        {/* User Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-light)",
            borderRadius: "var(--card-radius, 20px)",
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
              border: "1.5px solid var(--accent-aqua)",
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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>
                Espace Membre Anjucia
              </h1>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  background: "rgba(113, 159, 183, 0.16)",
                  color: "var(--accent-aqua)",
                  border: "1px solid var(--border-light)"
                }}
              >
                VIP 🇩🇿
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {lang === "dz" ? "كل خدمات تطبيق أنجوسيا في مكان واحد" : "Votre compte client & avantages officiels Algérie"}
            </p>
          </div>
        </div>

        {/* VIP Club Early Access banner */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--card-radius, 16px)",
            padding: "1.4rem",
            marginBottom: "1.8rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color: "var(--accent-aqua)", fontWeight: 800, fontSize: "0.85rem" }}>
            <Sparkles size={16} />
            <span>Club Privilège ANJUCIA • Accès Anticipé</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
            Inscrivez votre e-mail ou numéro pour être le premier à tester les prochaines formulations en avant-première.
          </p>
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Votre e-mail ou téléphone..."
              required
              style={{
                flex: 1,
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                outline: "none"
              }}
            />
            <button type="submit" className="btn-aqua" style={{ padding: "0.65rem 1.1rem", fontSize: "0.82rem" }}>
              Rejoindre
            </button>
          </form>
        </div>

        {/* Coming Soon Feature Tiles */}
        <div style={{ marginBottom: "1.8rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
            Fonctionnalités à venir dans l'application
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {TILES.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px dashed var(--border-light)",
                    borderRadius: "14px",
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
                        borderRadius: "10px",
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
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {t.title[lang] || t.title.fr}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                        {t.desc[lang] || t.desc.fr}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "9999px",
                      background: "rgba(113, 159, 183, 0.12)",
                      color: "var(--accent-aqua)",
                      border: "1px solid var(--border-light)",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <Clock size={11} />
                    <span>{t.status}</span>
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
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            padding: "1.1rem 1.3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem"
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>Besoin d'aide ou commande par téléphone ?</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.15rem" }}>Conseillère dermo disponible 7j/7</div>
          </div>
          <a
            href="tel:0550000000"
            className="btn-outline"
            style={{ padding: "0.45rem 0.95rem", fontSize: "0.78rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <PhoneCall size={14} color="var(--accent-aqua)" />
            <span>Appeler</span>
          </a>
        </div>
      </div>
    </main>
  );
}
