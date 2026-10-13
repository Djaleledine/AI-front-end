"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("fr");

  useEffect(() => {
    const saved = localStorage.getItem("anjucia_lang");
    if (saved && (saved === "fr" || saved === "en" || saved === "dz")) {
      setLangState(saved);
      applyLangAttributes(saved);
    } else {
      applyLangAttributes("fr");
    }
  }, []);

  const applyLangAttributes = (currentLang) => {
    if (typeof document === "undefined") return;
    if (currentLang === "dz") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
      document.body.classList.add("rtl-mode");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", currentLang);
      document.body.classList.remove("rtl-mode");
    }
  };

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("anjucia_lang", newLang);
    applyLangAttributes(newLang);
  };

  const t = translations[lang] || translations.fr;
  const isRTL = lang === "dz";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
