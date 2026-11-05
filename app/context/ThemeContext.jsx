"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const PALETTES = [
  {
    id: "mineral",
    name: { fr: "Minérale & Botanique", en: "Mineral & Botanical", dz: "معدني ونباتي" },
    tagline: { fr: "Charbon ardoise, cyan glacier & sauge botanique", en: "Slate charcoal, glacier cyan & botanical sage", dz: "فخامة رمادية زرقاء مع لمسة أعشاب طبيعية" },
    hex: "#719FB7",
    glow: "rgba(113, 159, 183, 0.4)",
    bgDark: "#11171A",
    accentSecondary: "#9BB0A0",
    cardRadius: "16px",
    themeStyle: "mineral-botanical"
  }
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme] = useState("light");

  useEffect(() => {
    try {
      localStorage.setItem("anjucia_theme", "light");
    } catch (_) {}
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-color-palette", "mineral");
  }, []);

  const setTheme = () => {};
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider
      value={{
        theme: "light",
        setTheme,
        toggleTheme,
        isDark: false,
        colorPalette: "mineral",
        setColorPalette: () => {},
        nextColorPalette: () => {},
        palettes: PALETTES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
