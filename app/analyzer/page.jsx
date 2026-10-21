"use client";

import React, { useState } from "react";
import { Sparkles, Camera, ShieldCheck, Clock, Bell, CheckCircle2, Droplets, Zap, ArrowRight, ScanLine } from "lucide-react";
import { DropletMark } from "../components/brand/AnjuciaLogo";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function AnalyzerPage() {
  const { lang } = useLanguage();
  const { showToast } = useCart();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setIsSubscribed(true);
    showToast(
      lang === "dz"
        ? "تم تسجيلك ! ستصلك دعوة حصرية لتجربة الفحص الذكي أول ما يفتح"
        : "Inscrit avec succès ! Vous recevrez une invitation prioritaire dès l'ouverture de DermoScan AI ✨"
    );
  };

  const UPCOMING_MODULES = [
    {
      title: "Cartographie Cutanée Multi-Zones",
      desc: "Détection automatique des zones de déshydratation, brillance sébacée de la zone T et rougeurs dues au sirocco.",
      tag: "Vision IA 2026"
    },
    {
      title: "Indice Bioclimatique par Wilaya",
      desc: "Corrélation en direct entre la météo de votre wilaya (taux d'humidité, UV, chaleur) et le besoin en Niacinamide.",
      tag: "58 Wilayas"
    },
    {
      title: "Protocole Personnalisé 100% Sans Alcool",
      desc: "Prescription exacte de votre dosage de Gel-Crème 1 800 DA combiné aux hydrolats locaux.",
      tag: "Sur-Mesure"
    }
  ];

  return (
    <main style={{ padding: "1.5rem 0 5.5rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        {/* Header Tag */}
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              background: "rgba(113, 159, 183, 0.14)",
              color: "var(--accent-aqua)",
              border: "1px solid var(--border-light)",
              fontSize: "0.74rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.8rem"
            }}
          >
            <Clock size={13} />
            <span>BIENTÔT DISPONIBLE • PHASE DE CALIBRATION</span>
          </span>

          <h1
            style={{
              fontSize: "clamp(1.9rem, 4vw, 2.7rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              lineHeight: 1.18,
              marginBottom: "0.6rem"
            }}
          >
            DermoScan AI™ Station
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>
            {lang === "dz"
              ? "مخبر الفحص الذكي للبشرة قيد الإعداد النهائي. سيتيح لك مسح بشرتك وتحديد احتياجاتها الدقيقة وفق مناخ ولايتك."
              : "Le premier scanner dermatologique assisté par IA conçu et entraîné pour répondre aux réalités climatiques algériennes."}
          </p>
        </div>

        {/* High-Tech Biometric Scanner Preview Frame */}
        <div
          style={{
            position: "relative",
            background: "radial-gradient(circle at 50% 50%, var(--bg-card-hover) 0%, var(--bg-card) 80%)",
            border: "2px solid var(--accent-aqua)",
            borderRadius: "var(--card-radius, 24px)",
            padding: "2.4rem 1.8rem",
            boxShadow: "var(--shadow-md), var(--shadow-glow)",
            overflow: "hidden",
            marginBottom: "2rem",
            textAlign: "center"
          }}
        >
          {/* Animated Laser Scanning Line */}
          <div className="analyzer-laser-line" />

          {/* Scanner Viewfinder Box */}
          <div
            style={{
              width: "200px",
              height: "230px",
              margin: "0 auto 1.4rem",
              border: "1.5px dashed var(--accent-aqua)",
              borderRadius: "28px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(17, 23, 26, 0.65)"
            }}
          >
            {/* Corner Bracket Reticles */}
            <span style={{ position: "absolute", top: "-2px", left: "-2px", width: "16px", height: "16px", borderTop: "3px solid var(--accent-aqua)", borderLeft: "3px solid var(--accent-aqua)" }} />
            <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "16px", height: "16px", borderTop: "3px solid var(--accent-aqua)", borderRight: "3px solid var(--accent-aqua)" }} />
            <span style={{ position: "absolute", bottom: "-2px", left: "-2px", width: "16px", height: "16px", borderBottom: "3px solid var(--accent-aqua)", borderLeft: "3px solid var(--accent-aqua)" }} />
            <span style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "16px", height: "16px", borderBottom: "3px solid var(--accent-aqua)", borderRight: "3px solid var(--accent-aqua)" }} />

            <DropletMark size={64} color="var(--accent-aqua)" />
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 800, marginTop: "0.6rem", letterSpacing: "0.1em" }}>
              ANJUCIA SCAN ENGINE
            </div>
          </div>

          <div style={{ maxWidth: "420px", margin: "0 auto" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              Préparez-vous à Scanner Votre Peau
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.4rem" }}>
              Entrez vos coordonnées pour recevoir un accès bêta prioritaire dès le déploiement sur les 58 Wilayas :
            </p>

            <form onSubmit={handleNotify} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Votre e-mail ou n° de téléphone..."
                required
                style={{
                  flex: 1,
                  padding: "0.75rem 0.95rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "0.84rem",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                className="btn-aqua"
                style={{ padding: "0.75rem 1.3rem", fontSize: "0.84rem", whiteSpace: "nowrap" }}
              >
                {isSubscribed ? "Inscrit ✓" : "M'avertir"}
              </button>
            </form>
          </div>
        </div>

        {/* What DermoScan AI Will Do */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
            Ce que DermoScan AI vous apportera
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {UPCOMING_MODULES.map((mod, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px dashed var(--border-light)",
                  borderRadius: "14px",
                  padding: "1.1rem 1.3rem",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.desc}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    color: "var(--accent-aqua)",
                    border: "1px solid var(--border-subtle)",
                    flexShrink: 0
                  }}
                >
                  {mod.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instant Available Alternative: Order 1800 DA Product */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
            padding: "1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)" }}>
              Besoin d'un soin hydratant immédiat ?
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Le Soin Visage Apaisant 50 ml est disponible à 1 800 DA avec livraison 58 Wilayas.
            </div>
          </div>
          <Link
            href="/products"
            className="btn-aqua"
            style={{ padding: "0.65rem 1.25rem", fontSize: "0.84rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <span>Commander (1 800 DA)</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
