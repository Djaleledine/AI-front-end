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
              fontWeight: 700
            }}
          >
            <ArrowLeft size={16} />
            <span>{lang === "dz" ? "رجوع" : "Retour"}</span>
          </Link>

          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              background: "rgba(155, 176, 160, 0.16)",
              color: "var(--success)",
              border: "1px solid rgba(155, 176, 160, 0.3)"
            }}
          >
            🎮 MINI-JEU CLINIQUE
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
            Goutte Rescue • Sauvez l'Hydratation
          </h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {lang === "dz"
              ? "التقط جزيئات النياسيناميد والبانتينول لتعبئة خزان الترطيب وتفادى حرارة 45°C والرياح الجافة."
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
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--card-radius, 16px)",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6
          }}
        >
          <div style={{ fontWeight: 800, color: "var(--accent-aqua)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={16} />
            <span>Pourquoi ce jeu ?</span>
          </div>
          <p style={{ marginBottom: "0.6rem" }}>
            En Algérie, la peau subit quotidiennement un stress thermique intense (chaleur jusqu'à 45°C, sirocco sec). Notre Soin Gel-Crème 50 ml (1 800 DA) agit exactement comme votre bouclier en jeu : il compense instantanément la perte en eau.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span>💧 <strong>Niacinamide 3%</strong> = barrière</span>
            <span>✨ <strong>Panthénol B5 2%</strong> = apaisement</span>
            <span>🛡️ <strong>Squalane 3%</strong> = bouclier</span>
          </div>
        </div>
      </div>
    </main>
  );
}
