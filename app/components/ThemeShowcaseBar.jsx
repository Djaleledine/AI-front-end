"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Sparkles, Sun, Moon } from "lucide-react";

export default function ThemeShowcaseBar() {
  const { colorPalette, setColorPalette, palettes, isDark, toggleTheme } = useTheme();
  const { lang } = useLanguage();

  const labels = {
    fr: { title: "Ambiances & Design de la Boutique :", darkLight: isDark ? "Mode Clair" : "Mode Sombre" },
    en: { title: "Store Aesthetics & Design Systems:", darkLight: isDark ? "Light Mode" : "Dark Mode" },
    dz: { title: "ستايلات وألوان المتجر :", darkLight: isDark ? "الستايل النهاري" : "الستايل الليلي" }
  };

  const cur = labels[lang] || labels.fr;

  return (
    <div className="container" style={{ margin: "1.2rem auto 0" }}>
      <div className="theme-showcase-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.78rem", fontWeight: 900, color: "var(--accent-aqua)", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: "0.5rem" }}>
          <Sparkles size={15} />
          <span>{cur.title}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {palettes.map((p) => {
            const isActive = colorPalette === p.id;
            const pName = p.name[lang] || p.name.fr;
            return (
              <button
                key={p.id}
                type="button"
                className={`theme-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => setColorPalette(p.id)}
                title={p.tagline ? (p.tagline[lang] || p.tagline.fr) : pName}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: p.hex,
                    boxShadow: isActive ? `0 0 10px ${p.hex}` : "none",
                    flexShrink: 0
                  }}
                />
                <span>{pName}</span>
                {isActive && (
                  <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "9999px", background: "var(--accent-aqua)", color: "#06111C", fontWeight: 900 }}>
                    Actif
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Dark/Light Switcher Pill */}
          <button
            type="button"
            className="theme-pill-btn"
            onClick={toggleTheme}
            style={{ border: "1.5px solid var(--border-light)" }}
            title={cur.darkLight}
          >
            {isDark ? <Sun size={14} color="#F59E0B" /> : <Moon size={14} color="var(--accent-aqua)" />}
            <span>{cur.darkLight}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
