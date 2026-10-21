"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Download } from "lucide-react";
import AnjuciaLogo from "../brand/AnjuciaLogo";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

export default function TopAppBar({ onInstallClick }) {
  const { totalCount, setIsCartOpen } = useCart();
  const { lang, setLang } = useLanguage();

  return (
    <header
      className="top-app-bar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 890,
        background: "rgba(17, 23, 26, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0.6rem 1rem"
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem"
        }}
      >
        {/* Brand Logo Lockup */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center" }}>
          <AnjuciaLogo size={24} />
        </Link>

        {/* Right Controls: Language Selector, PWA Install prompt trigger, Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Quick Language switch */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "9999px",
              padding: "2px"
            }}
          >
            {["fr", "dz", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--accent-aqua)" : "transparent",
                  color: lang === l ? "#11171A" : "var(--text-muted)",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.22rem 0.5rem",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                {l === "dz" ? "🇩🇿" : l}
              </button>
            ))}
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Ouvrir le panier"
            style={{
              position: "relative",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--accent-aqua)",
                  color: "#11171A",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1
                }}
              >
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
