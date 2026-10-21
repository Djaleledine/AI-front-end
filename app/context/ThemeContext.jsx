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
  const [theme, setThemeState] = useState("dark");
  const [colorPalette, setColorPaletteState] = useState("mineral");

  useEffect(() => {
    // Load Dark/Light Mode
    const savedTheme = localStorage.getItem("anjucia_theme");
    const initialTheme = savedTheme || "light";
    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.documentElement.setAttribute("data-color-palette", "mineral");
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("anjucia_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const setColorPalette = (newPalette) => {
    setColorPaletteState("mineral");
  };

  const nextColorPalette = () => {
    setColorPaletteState("mineral");
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark,
        colorPalette: "mineral",
        setColorPalette,
        nextColorPalette,
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
