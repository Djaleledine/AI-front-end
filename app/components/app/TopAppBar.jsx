"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Shield } from "lucide-react";
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
        background: "var(--bg-glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0.6rem 1rem",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        direction: "ltr"
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem",
          direction: "ltr"
        }}
      >
        {/* Brand Logo Lockup */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center" }}>
          <AnjuciaLogo size={38} />
        </Link>

        {/* Right Controls: Language Selector, Admin link, Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          {/* Quick Language switch */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: "0px",
              padding: "2px"
            }}
          >
            {["fr", "dz", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--accent-aqua)" : "transparent",
                  color: lang === l ? "var(--text-inverse)" : "var(--text-muted)",
                  border: "none",
                  borderRadius: "0px",
                  padding: "0.22rem 0.48rem",
                  fontSize: "0.68rem",
                  fontWeight: 400,
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                {l === "dz" ? "AR" : l}
              </button>
            ))}
          </div>

          {/* Admin Dashboard Quick Access Button */}
          <Link
            href="/admin"
            title="Panneau d'administration Anjucia"
            aria-label="Tableau de bord admin"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "0px",
              background: "var(--bg-secondary)",
              border: "none",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none"
            }}
          >
            <Shield size={16} />
          </Link>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Ouvrir le panier"
            style={{
              position: "relative",
              width: "38px",
              height: "38px",
              borderRadius: "0px",
              background: "var(--bg-secondary)",
              border: "none",
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
                  color: "var(--text-inverse)",
                  fontSize: "0.65rem",
                  fontWeight: 400,
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
