"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck, ThermometerSnowflake, Droplets } from "lucide-react";
import { DropletMark } from "../brand/AnjuciaLogo";
import { useLanguage } from "../../context/LanguageContext";

export default function DropletHeroVisual({ onAddToCart, showPrice = false }) {
  const { lang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="droplet-hero-wrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "340px",
        padding: "2rem 1.5rem",
        background: "radial-gradient(circle at 50% 45%, var(--bg-card-hover) 0%, var(--bg-card) 75%)",
        border: "none",
        borderRadius: "0px",
        boxShadow: "var(--shadow-md), var(--shadow-glow)",
        overflow: "hidden"
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-aqua-glow) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }}
      />

      {/* Floating active badges */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(113, 159, 183, 0.15)",
          border: "none",
          padding: "0.35rem 0.75rem",
          borderRadius: "0px",
          fontSize: "0.72rem",
          fontWeight: 400,
          color: "var(--accent-aqua)"
        }}
      >
        <span className="topbar-dot" />
        <span>{lang === "dz" || lang === "ar" ? "المنتج الحصري المتاح" : lang === "en" ? "SINGLE EXCLUSIVE PRODUCT" : "PRODUIT UNIQUE DISPONIBLE"}</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(155, 176, 160, 0.15)",
          border: "none",
          padding: "0.35rem 0.75rem",
          borderRadius: "0px",
          fontSize: "0.72rem",
          fontWeight: 400,
          color: "var(--success)"
        }}
      >
        <ShieldCheck size={13} />
        <span>{lang === "dz" || lang === "ar" ? "ثبات حراري 45°C" : lang === "en" ? "45°C Thermal Stability" : "Stabilité 45°C"}</span>
      </div>

      {/* Main Stylized Droplet Sculpture */}
      <div
        style={{
          margin: "1.8rem 0 1rem",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        {/* Outer glowing halo ring */}
        <div
          className="hero-droplet-halo"
          style={{
            position: "absolute",
            width: "190px",
            height: "190px",
            borderRadius: "50%",
            border: "none",
            opacity: 0.45,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "spin 28s linear infinite",
            pointerEvents: "none"
          }}
        />

        {/* Droplet SVG Icon */}
        <div
          style={{
            position: "relative",
            filter: "drop-shadow(0 14px 28px rgba(113, 159, 183, 0.35))"
          }}
        >
          <DropletMark size={118} color="var(--accent-aqua)" />
        </div>

      </div>

      {/* Product identification labels */}
      <div style={{ textAlign: "center", maxWidth: "320px", marginBottom: "1.2rem" }}>
        <h3
          style={{
            fontSize: "1.28rem",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.25,
            marginBottom: "0.35rem"
          }}
        >
          Lightweight Soothing Face Gel-Cream
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
          Niacinamide 3% • Panthénol B5 2% • Centella 1% • pH 5.2 physiologique
        </p>
      </div>

      {/* Bottom stock status + CTA bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-subtle)",
          gap: "1rem"
        }}
      >
        <div>
          {showPrice && (
            <div
              className="price-dzd"
              style={{
                fontSize: "1.7rem",
                fontWeight: 400,
                color: "var(--accent-aqua)",
                lineHeight: 1,
                marginBottom: "0.25rem",
                direction: "ltr",
                unicodeBidi: "isolate"
              }}
            >
              {lang === "dz" || lang === "ar" ? "1800 دج" : lang === "en" ? "1,800 DZD" : "1 800 DA"}
            </div>
          )}
          <div style={{ fontSize: "0.82rem", color: "var(--success)", fontWeight: 400 }}>
            {lang === "dz" || lang === "ar" ? "✓ متوفر فوراً • توصيل 58 ولاية" : lang === "en" ? "✓ In Stock • 58 Wilayas Delivery" : "✓ En Stock Immédiat • 58 Wilayas"}
          </div>
        </div>

        <button
          className="btn-aqua magnetic-btn"
          onClick={onAddToCart}
          style={{ padding: "0.85rem 1.6rem", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "#4d7358", color: "#ffffff" }}
        >
          <Droplets size={16} />
          <span>
            {showPrice
              ? (lang === "dz" || lang === "ar" ? "أضف للسلة (1800 دج)" : lang === "en" ? "Add to Bag (1,800 DZD)" : "Ajouter (1 800 DA)")
              : (lang === "dz" || lang === "ar" ? "أضف للسلة" : lang === "en" ? "Add to Bag" : "Ajouter au Panier")}
          </span>
        </button>
      </div>
    </div>
  );
}
