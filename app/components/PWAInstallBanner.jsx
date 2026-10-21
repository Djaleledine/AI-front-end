"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { DropletMark } from "./brand/AnjuciaLogo";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    // Register service worker if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if already in standalone mode
    const isStandalone =
      (typeof window !== "undefined" &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (typeof navigator !== "undefined" && navigator.standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIOS(isIosDevice);

    const dismissed = localStorage.getItem("anjucia_pwa_dismissed");

    // Android/Chrome beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If iOS and not dismissed, show install helper after 3 seconds
    if (isIosDevice && !dismissed) {
      const t = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(t);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSGuide(false);
    try {
      localStorage.setItem("anjucia_pwa_dismissed", "true");
    } catch (_) {}
  };

  if (isInstalled || !isVisible) return null;

  return (
    <>
      <aside
        aria-label="Installer l'application Anjucia"
        style={{
          position: "fixed",
          top: "max(env(safe-area-inset-top, 0px), 12px)",
          left: "12px",
          right: "12px",
          maxWidth: "480px",
          margin: "0 auto",
          zIndex: 1100,
          background: "rgba(17, 23, 26, 0.95)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "2px solid var(--accent-aqua)",
          borderRadius: "18px",
          padding: "0.85rem 1.1rem",
          boxShadow: "var(--shadow-md), var(--shadow-glow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem",
          animation: "slide-down 0.3s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "var(--bg-card)",
              border: "1.5px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <DropletMark size={24} color="var(--accent-aqua)" />
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {lang === "dz" ? "تطبيق أنجوسيا الرسمي 🇩🇿" : "Application ANJUCIA 🇩🇿"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {lang === "dz" ? "تثبيت خفيف وسريع للطلب بضغطة زر" : "Commander en 1 clic • Accès hors ligne"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <button
            className="btn-aqua"
            style={{ padding: "0.5rem 1rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            onClick={handleInstallClick}
          >
            <Download size={14} />
            <span>{lang === "dz" ? "تثبيت" : "Installer"}</span>
          </button>
          <button
            onClick={handleDismiss}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </aside>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "2px solid var(--accent-aqua)",
              borderRadius: "20px 20px 14px 14px",
              padding: "1.8rem",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "var(--shadow-md)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)" }}>
                Installer sur iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <ol style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>1. Appuyez sur le bouton <strong>Partager</strong></span>
                <Share size={16} color="var(--accent-aqua)" />
                <span>au bas de Safari.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>2. Faites défiler et choisissez <strong>Sur l'écran d'accueil</strong></span>
                <PlusSquare size={16} color="var(--accent-aqua)" />
              </li>
              <li>
                3. Touchez <strong>Ajouter</strong> en haut à droite. L'icône Anjucia apparaîtra comme une vraie application !
              </li>
            </ol>

            <button
              className="btn-aqua"
              style={{ width: "100%", marginTop: "1.4rem", padding: "0.85rem" }}
              onClick={() => setShowIOSGuide(false)}
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
}
