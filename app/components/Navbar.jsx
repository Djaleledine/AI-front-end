"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Home,
  Package,
  ShieldCheck,
  MapPin,
  FileText,
  Droplets,
  Truck,
  CheckCircle2,
  ChevronRight,
  Gamepad2
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import QuickSkinMatchModal from "./QuickSkinMatchModal";
import AnjuciaLogo from "./brand/AnjuciaLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, setIsCartOpen } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Dynamic Scroll Listener for Header Elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Quick Skin Match Quiz Modal Triggerable from Navbar */}
      <QuickSkinMatchModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Clean Topbar */}
      <div className="nav-topbar">
        <div className="container">
          <div className="topbar-badge">
            <span className="topbar-dot"></span>
            <span>{t.topbar.badge}</span>
          </div>

          <div className="topbar-shipping-text">
            <Truck size={14} color="var(--accent-aqua)" style={{ verticalAlign: "middle", marginRight: "6px" }} />
            <span>{t.topbar.shipping}</span>
          </div>
        </div>
      </div>

      {/* Main Clean Header */}
      <header className={`header-clinical ${isScrolled ? "scrolled" : ""}`}>
        {/* GSAP Scroll Progress Indicator */}
        <div className="gsap-scroll-progress" aria-hidden="true" />
        <div className="container">
          <nav className="nav-main">
            {/* Brand Logo & Tagline */}
            <a href="/" className="brand-logo-wrap" title="ANJUCIA • Haute Précision Skincare">
              <AnjuciaLogo size={26} />
            </a>

            {/* Desktop Navigation Links — Clean, perfectly spaced */}
            <ul className="nav-links">
              <li>
                <a href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className={`nav-link ${pathname === "/products" ? "active" : ""}`}
                >
                  {t.nav.products}
                </a>
              </li>
              <li>
                <a href="/#rituels" className="nav-link">
                  {t.nav.rituals || (lang === "dz" ? "خلطات طبيعية" : "Rituels Botaniques")}
                </a>
              </li>
              <li>
                <a href="/#charte" className="nav-link">
                  {t.nav.science || "Stabilité 45°C & Science"}
                </a>
              </li>
              <li>
                <a href="/#pharmacies" className="nav-link">
                  {t.nav.pharmacies}
                </a>
              </li>
              <li>
                <a
                  href="/analyzer"
                  className={`nav-link nav-link-ai ${pathname === "/analyzer" ? "active" : ""}`}
                  title="DermoScan AI™"
                >
                  <Sparkles size={14} />
                  <span>{t.nav.analyzer}</span>
                </a>
              </li>
            </ul>

            {/* Right Controls */}
            <div className="nav-controls">
              {/* Language Selector */}
              <div className="lang-selector-wrap" title="Choisir la langue / Select Language">
                <button
                  className={`lang-btn ${lang === "fr" ? "active" : ""}`}
                  onClick={() => setLang("fr")}
                  aria-label="Français"
                >
                  FR
                </button>
                <button
                  className={`lang-btn ${lang === "en" ? "active" : ""}`}
                  onClick={() => setLang("en")}
                  aria-label="English"
                >
                  EN
                </button>
                <button
                  className={`lang-btn ${lang === "dz" ? "active" : ""}`}
                  onClick={() => setLang("dz")}
                  aria-label="الدارجة الجزائرية"
                >
                  🇩🇿 دز
                </button>
              </div>

              {/* Dark / Light Theme Toggle */}
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={isDark ? t.nav.themeLight : t.nav.themeDark}
                aria-label="Changer le thème"
              >
                {isDark ? <Sun size={19} className="theme-icon-sun" /> : <Moon size={19} className="theme-icon-moon" />}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                className={`cart-trigger-btn ${totalCount > 0 ? "has-items" : ""}`}
                onClick={() => setIsCartOpen(true)}
                title={t.nav.cart}
                aria-label="Panier"
              >
                <ShoppingBag size={19} />
                {totalCount > 0 && (
                  <span className="cart-counter-badge">{totalCount}</span>
                )}
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                title="Menu"
              >
                {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`mobile-nav-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <AnjuciaLogo size={24} />
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Analyzer Quick Card inside Mobile Drawer */}
        <div style={{ margin: "1.2rem 1.2rem 0.8rem", padding: "1.1rem", background: "var(--bg-secondary)", borderRadius: "var(--card-radius, 14px)", border: "1.5px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <Sparkles size={18} color="var(--accent-aqua)" />
            <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "var(--text-primary)" }}>DermoScan AI™</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: "0.85rem" }}>
            {lang === "dz" ? "فحص فوري للبشرة واقتراح روتين مخصص بالذكاء الاصطناعي." : "Analyse cutanée personnalisée et routine naturelle sur-mesure."}
          </p>
          <a
            href="/analyzer"
            className="btn-aqua"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ width: "100%", padding: "0.7rem", fontSize: "0.85rem" }}
          >
            {lang === "dz" ? "ابدأ الفحص الآن ✨" : "Lancer l'Analyse ✨"}
          </a>
        </div>

        {/* Navigation Links List */}
        <ul className="mobile-drawer-links">
          <li>
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-drawer-link ${pathname === "/" ? "active" : ""}`}
            >
              <Home size={18} />
              <span>{t.nav.home}</span>
            </a>
          </li>
          <li>
            <a
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-drawer-link ${pathname === "/products" ? "active" : ""}`}
            >
              <Package size={18} />
              <span>{t.nav.products}</span>
            </a>
          </li>
          <li>
            <a
              href="/#rituels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <Droplets size={18} />
              <span>{t.nav.rituals || (lang === "dz" ? "خلطات طبيعية" : "Rituels Botaniques")}</span>
            </a>
          </li>
          <li>
            <a
              href="/#charte"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <ShieldCheck size={18} />
              <span>{t.nav.science || "Stabilité 45°C & Science"}</span>
            </a>
          </li>
          <li>
            <a
              href="/#pharmacies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <MapPin size={18} />
              <span>{t.nav.pharmacies} (58 Wilayas)</span>
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuizOpen(true);
              }}
              className="mobile-drawer-link"
              style={{ background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
            >
              <Sparkles size={18} color="var(--accent-aqua)" />
              <span>{t.quickQuizBtn || "Trouver ma Routine (10s)"}</span>
            </button>
          </li>
          <li>
            <a
              href="/terms"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-drawer-link ${pathname === "/terms" ? "active" : ""}`}
            >
              <FileText size={18} />
              <span>{t.nav.terms || "Conditions & Confidentialité"}</span>
            </a>
          </li>
        </ul>

        {/* Bottom Drawer Controls: Language & Cart */}
        <div className="mobile-drawer-footer">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)" }}>LANGUE / اللّغة :</span>
            <div className="lang-selector-wrap">
              <button
                className={`lang-btn ${lang === "fr" ? "active" : ""}`}
                onClick={() => setLang("fr")}
              >
                FR
              </button>
              <button
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                className={`lang-btn ${lang === "dz" ? "active" : ""}`}
                onClick={() => setLang("dz")}
              >
                🇩🇿 الدارجة
              </button>
            </div>
          </div>

          <button
            className="btn-aqua"
            style={{ width: "100%", padding: "0.9rem" }}
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCartOpen(true);
            }}
          >
            <ShoppingBag size={18} />
            <span>{t.nav.cart} ({totalCount})</span>
          </button>

          <div style={{ textAlign: "center", marginTop: "0.9rem", fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
            <Truck size={14} color="var(--accent-aqua)" />
            <span>Livraison 58 Wilayas • Paiement à la réception</span>
          </div>
        </div>
      </aside>
    </>
  );
}
