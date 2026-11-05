"use client";

import React from "react";
import DropletGame from "../components/game/DropletGame";
import { Sparkles, Trophy, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function GamePage() {
  const { lang } = useLanguage();

  return (
    <main style={{ padding: "1rem 0 5.5rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "580px" }}>
        {/* Top return & title bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 400
            }}
          >
            <ArrowLeft size={16} />
            <span>{lang === "dz" || lang === "ar" ? "رجوع" : lang === "en" ? "Back" : "Retour"}</span>
          </Link>

          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 400,
              padding: "0.25rem 0.65rem",
              borderRadius: "0px",
              background: "rgba(155, 176, 160, 0.16)",
              color: "var(--success)",
              border: "none"
            }}
          >
            {lang === "dz" || lang === "ar" ? "🎮 لعبة سريرية مصغرة" : lang === "en" ? "🎮 CLINICAL MINI-GAME" : "🎮 MINI-JEU CLINIQUE"}
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
            {lang === "dz" || lang === "ar" ? "لعبة أنقذ القطرة • أنعش الترطيب" : lang === "en" ? "Droplet Rescue • Shield Skin Moisture" : "Goutte Rescue • Sauvez l'Hydratation"}
          </h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {lang === "dz" || lang === "ar"
              ? "التقط جزيئات النياسيناميد والبانتينول لتعبئة خزان الترطيب وتفادى حرارة 45°C والرياح الجافة."
              : lang === "en"
              ? "Catch pure dermaceutical actives to restore the skin barrier against extreme North African climate."
              : "Capturez les actifs dermocosmétiques purs pour restaurer la barrière cutanée face au climat algérien."}
          </p>
        </div>

        {/* Playable Canvas Game */}
        <DropletGame compact={false} />

        {/* Game instructions & skin advice */}
        <div
          style={{
            marginTop: "1.4rem",
            padding: "1.2rem",
            background: "var(--bg-card)",
            border: "none",
            borderRadius: "0px",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6
          }}
        >
          <div style={{ fontWeight: 400, color: "var(--accent-aqua)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={16} />
            <span>{lang === "dz" || lang === "ar" ? "لماذا هذه اللعبة ؟" : lang === "en" ? "Why this game?" : "Pourquoi ce jeu ?"}</span>
          </div>
          <p style={{ marginBottom: "0.6rem" }}>
            {lang === "dz" || lang === "ar"
              ? "في الجزائر، تعاني البشرة يومياً من ضغط حراري شديد (حرارة حتى 45°C والشهيلي). جل-كريم أنجوسيا 50 مل يشتغل تماماً كدرعك في اللعبة : يعوض نقص الماء فوراً ويقوي حاجز البشرة."
              : lang === "en"
              ? "In North Africa, skin undergoes intense daily thermal stress (heat up to 45°C, dry sirocco winds). Our Soothing Face Gel-Cream 50 ml acts just like your shield in the game: instantly replenishing water loss."
              : "En Algérie, la peau subit quotidiennement un stress thermique intense (chaleur jusqu'à 45°C, sirocco sec). Notre Soin Gel-Crème 50 ml agit exactement comme votre bouclier en jeu : il compense instantanément la perte en eau."}
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span>💧 <strong>Niacinamide 3%</strong> = {lang === "dz" || lang === "ar" ? "حاجز حماية" : lang === "en" ? "barrier" : "barrière"}</span>
            <span>✨ <strong>Panthénol B5 2%</strong> = {lang === "dz" || lang === "ar" ? "تهدئة عميقة" : lang === "en" ? "soothing" : "apaisement"}</span>
            <span>🛡️ <strong>Squalane 3%</strong> = {lang === "dz" || lang === "ar" ? "درع واقي" : lang === "en" ? "shield" : "bouclier"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
