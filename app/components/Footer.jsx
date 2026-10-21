"use client";

import React from "react";
import { ShieldCheck, Truck, RefreshCw, Sun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import AnjuciaLogo from "./brand/AnjuciaLogo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer-clinical">
      <div className="container">
        {/* Value Props Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", paddingBottom: "3rem", marginBottom: "3rem", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <ShieldCheck size={32} color="var(--accent-aqua)" />
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "0.9rem" }}>{t.footer.grade}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.footer.gradeSub}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <Sun size={32} color="var(--accent-aqua)" />
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "0.9rem" }}>{t.footer.climate || "Stabilité Thermique 45°C"}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.footer.climateSub || "Résistance prouvée au climat extrême"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <Truck size={32} color="var(--accent-aqua)" />
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "0.9rem" }}>{t.footer.delivery}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.footer.deliverySub}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <RefreshCw size={32} color="var(--accent-aqua)" />
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "0.9rem" }}>{t.footer.zeroBreakdown}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.footer.zeroBreakdownSub}</div>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <AnjuciaLogo size={28} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "320px", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              {t.footer.about}
            </p>
            <div style={{ fontSize: "0.78rem", color: "var(--accent-aqua)", fontWeight: 800 }}>
              {t.footer.madeInDz}
            </div>
          </div>

          <div>
            <h4 style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.nav.products}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", padding: 0 }}>
              <li><a href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Soothing Face Gel-Cream (1 800 DA)</a></li>
              <li><a href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>CeraHydra+ Cellular Cream 50ml</a></li>
              <li><a href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>CeraHydra+ Grand Format 100ml</a></li>
              <li><a href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>AquaLipid Hydro-Infusion Essence</a></li>
              <li><a href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>BioShield Fluide Solaire SPF 50+</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.nav.science}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", padding: 0 }}>
              <li><a href="/analyzer" style={{ color: "var(--accent-aqua)", fontWeight: 800, textDecoration: "none" }}>DermoScan AI™ Station</a></li>
              <li><a href="/#charte" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{t.philosophy?.tag || "Philosophie & Charte"}</a></li>
              <li><a href="/#pharmacies" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{t.nav?.pharmacies || "Réseau Pharmacies"}</a></li>
              <li><a href="/terms" style={{ color: "var(--accent-aqua)", fontWeight: 700, textDecoration: "none" }}>{t.footer?.termsLink || "Conditions Générales & Confidentialité"}</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.nav.pharmacies}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.8rem", lineHeight: 1.5 }}>
              Disponible dans les parapharmacies conventionnées à Alger, Oran, Constantine, Sétif, Annaba, Biskra et Sud.
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {t.footer.contactPharma} <strong>+213 (0) 23 XX XX XX</strong>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {t.footer?.confidentialityNote || "Profils 100% Confidentiels • Zéro Partage"}
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>© 2026 ANJUCIA ALGÉRIE. Tous droits réservés.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8rem" }}>{t.footer?.termsLink || "Conditions Générales & Confidentialité"}</a>
            <span>Conforme aux Normes Parapharmaceutiques Algériennes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
