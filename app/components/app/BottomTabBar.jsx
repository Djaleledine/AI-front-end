"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, Gamepad2, Sparkles, User } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";

const TABS = [
  { id: "home", path: "/", icon: Home, label: { fr: "Accueil", dz: "الرئيسية", en: "Home" } },
  { id: "products", path: "/products", icon: ShoppingBag, label: { fr: "Boutique", dz: "المتجر", en: "Shop" } },
  { id: "game", path: "/game", icon: Gamepad2, label: { fr: "Jeu", dz: "اللعبة", en: "Game" }, badge: "Nouveau" },
  { id: "analyzer", path: "/analyzer", icon: Sparkles, label: { fr: "Scan AI", dz: "فحص AI", en: "Scan AI" } },
  { id: "profile", path: "/profile", icon: User, label: { fr: "Profil", dz: "حسابي", en: "Profile" } }
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const { totalCount } = useCart();

  const handleNav = (targetPath) => {
    if (pathname === targetPath) return;

    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch (_) {}

    // Modern View Transitions API integration
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(targetPath);
      });
    } else {
      router.push(targetPath);
    }
  };

  return (
    <nav
      className="bottom-tab-bar"
      aria-label="Navigation principale de l'application"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: "rgba(17, 23, 26, 0.94)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderTop: "1px solid var(--border-subtle)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.45)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)"
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          padding: "0.35rem 0.4rem 0.2rem"
        }}
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== "/" && pathname.startsWith(tab.path));
          const Icon = tab.icon;
          const label = tab.label[lang] || tab.label.fr;

          return (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.path)}
              className={`tab-bar-item ${isActive ? "active" : ""}`}
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.35rem 0.2rem",
                color: isActive ? "var(--accent-aqua)" : "var(--text-muted)",
                cursor: "pointer",
                position: "relative",
                transition: "color 0.2s ease, transform 0.15s ease",
                transform: isActive ? "scale(1.04)" : "scale(1)"
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active pill background aura */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    width: "36px",
                    height: "30px",
                    borderRadius: "12px",
                    background: "rgba(113, 159, 183, 0.16)",
                    zIndex: 0
                  }}
                />
              )}

              <div style={{ position: "relative", zIndex: 1 }}>
                <Icon size={20} strokeWidth={isActive ? 2.6 : 1.9} />
                {tab.id === "products" && totalCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-6px",
                      background: "var(--accent-aqua)",
                      color: "#11171A",
                      fontSize: "0.62rem",
                      fontWeight: 900,
                      width: "14px",
                      height: "14px",
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
                {tab.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-12px",
                      background: "var(--success)",
                      color: "#11171A",
                      fontSize: "0.55rem",
                      fontWeight: 900,
                      padding: "1px 3px",
                      borderRadius: "4px",
                      lineHeight: 1
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: isActive ? 800 : 600,
                  marginTop: "0.22rem",
                  lineHeight: 1,
                  zIndex: 1
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
