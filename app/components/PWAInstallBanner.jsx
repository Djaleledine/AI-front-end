"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    // Register service worker if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem("anjucia_pwa_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("anjucia_pwa_dismissed", "true");
  };

  if (!isVisible) return null;

  const labels = {
    fr: { text: "Installez l'App ANJUCIA sur votre téléphone pour commander plus vite !", btn: "Installer" },
    en: { text: "Install the ANJUCIA App on your phone for faster 1-click orders!", btn: "Install" },
    dz: { text: "ثبّت تطبيق أنجوسيا في هاتفك باش تكوموندي بسرعة في أي وقت !", btn: "تثبيت التطبيق" }
  };

  const currentLabel = labels[lang] || labels.fr;

  return (
    <aside aria-label="Installer l'application" style={{ position: "fixed", top: "1rem", left: "1rem", right: "1rem", maxWidth: "480px", margin: "0 auto", zIndex: 1200, background: "var(--bg-card)", border: "2px solid var(--accent-aqua)", borderRadius: "16px", padding: "0.85rem 1.1rem", boxShadow: "var(--shadow-md), var(--shadow-glow)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", animation: "slide-down 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-aqua)", flexShrink: 0 }}>
          <Download size={20} />
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35 }}>
          {currentLabel.text}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <button
          className="btn-aqua"
          style={{ padding: "0.45rem 0.95rem", fontSize: "0.8rem" }}
          onClick={handleInstallClick}
        >
          {currentLabel.btn}
        </button>
        <button
          onClick={handleDismiss}
          style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px" }}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
}
