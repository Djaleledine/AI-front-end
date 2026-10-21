"use client";

import React, { useState } from "react";
import { Bell, Check, Sparkles, Shield, Clock } from "lucide-react";
import { DropletMark } from "../brand/AnjuciaLogo";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ComingSoonCard({ product, index = 0 }) {
  const { showToast } = useCart();
  const { lang } = useLanguage();
  const [notified, setNotified] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(`anjucia_notify_${product.id}`);
  });

  const handleNotify = () => {
    if (notified) {
      showToast(lang === "dz" ? "أنت مسجل بالفعل في قائمة الإشعار !" : "Vous êtes déjà inscrit pour être notifié !");
      return;
    }
    try {
      localStorage.setItem(`anjucia_notify_${product.id}`, "true");
    } catch (_) {}
    setNotified(true);
    showToast(
      lang === "dz"
        ? `تم تسجيلك ! سنخبرك فور توفر ${product.name}`
        : `Enregistré ! Vous serez le premier informé du lancement de ${product.name} ✨`
    );
  };

  const activesList = Array.isArray(product.actives)
    ? product.actives.slice(0, 3)
    : [];

  return (
    <article
      className="coming-soon-card"
      style={{
        position: "relative",
        background: "var(--bg-card)",
        border: "1px dashed var(--border-light)",
        borderRadius: "var(--card-radius, 18px)",
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "360px",
        overflow: "hidden",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-aqua-subtle) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }}
      />

      {/* Top Header & Badge */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              background: "rgba(113, 159, 183, 0.14)",
              color: "var(--accent-aqua)",
              border: "1px solid var(--border-light)"
            }}
          >
            <Clock size={12} />
            {lang === "dz" ? "قريباً • في مرحلة التحضير" : "Bientôt Disponible"}
          </span>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>
            {product.volume || "Formule Experte"}
          </span>
        </div>

        {/* Droplet Silhouette placeholder (NO image) */}
        <div
          style={{
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-input) 100%)",
            borderRadius: "14px",
            border: "1px solid var(--border-subtle)",
            position: "relative",
            marginBottom: "1.2rem",
            overflow: "hidden"
          }}
        >
          {/* Subtle shimmering scan line */}
          <div className="coming-soon-shimmer" />

          <div style={{ textAlign: "center", opacity: 0.85, transform: "scale(1)" }}>
            <DropletMark size={52} color="var(--accent-aqua)" />
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "var(--text-muted)",
                textTransform: "uppercase"
              }}
            >
              {lang === "dz" ? "صورة المنتج قريباً" : "Visuel en Préparation"}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent-aqua)",
            display: "block",
            marginBottom: "0.25rem"
          }}
        >
          {product.category || "Dermocosmétique"}
        </span>
        <h3
          style={{
            fontSize: "1.18rem",
            fontWeight: 900,
            color: "var(--text-primary)",
            lineHeight: 1.25,
            marginBottom: "0.35rem"
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginBottom: "0.9rem"
          }}
        >
          {product.subtitle || product.description}
        </p>

        {/* Actives preview bullets */}
        {activesList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
            {activesList.map((act, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-muted)"
                }}
              >
                {act.name} {act.percentage ? `(${act.percentage})` : ""}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action footer */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem"
        }}
      >
        <div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>
            {lang === "dz" ? "السعر" : "Tarif Officiel"}
          </span>
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--accent-aqua)" }}>
            {lang === "dz" ? "يُحدد عند الإطلاق" : "Annoncé au lancement"}
          </span>
        </div>

        <button
          onClick={handleNotify}
          className={notified ? "btn-outline" : "btn-aqua"}
          style={{
            padding: "0.6rem 1.1rem",
            fontSize: "0.82rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          {notified ? (
            <>
              <Check size={14} color="var(--success)" />
              <span>{lang === "dz" ? "تم التسجيل ✓" : "Inscrit ✓"}</span>
            </>
          ) : (
            <>
              <Bell size={14} />
              <span>{lang === "dz" ? "أعلمني عند التوفر" : "Me prévenir"}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
