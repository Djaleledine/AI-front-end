"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function StickyMobileBuyBar() {
  const { addHybridHero, setIsCartOpen } = useCart();
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 250px down
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickBuy = () => {
    addHybridHero("soothing-gel-cream");
    setIsCartOpen(true);
  };

  if (!isVisible) return null;

  const labels = {
    fr: { title: "Soothing Gel-Cream", badge: "Livraison 58 Wilayas", btn: "Commander en 1 Clic" },
    en: { title: "Soothing Gel-Cream", badge: "58 Wilayas Delivery", btn: "1-Click Order" },
    dz: { title: "جل-كريم مرطب ومهدئ", badge: "توصيل لـ 58 ولاية", btn: "اطلب في ثواني" }
  };

  const current = labels[lang] || labels.fr;

  return (
    <div className="sticky-mobile-buy-bar">
      <div className="sticky-mobile-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <img
            src="/assets/soothing-gel-cream.svg"
            alt="ANJUCIA Gel-Cream"
            style={{ width: "38px", height: "46px", objectFit: "contain" }}
          />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {current.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "2px" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--accent-aqua)" }}>
                {lang === "dz" ? "1500 دج" : "1 500 DA"}
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--success)", fontWeight: 800 }}>
                • {current.badge}
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn-aqua"
          style={{ padding: "0.65rem 1.1rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
          onClick={handleQuickBuy}
        >
          <ShoppingBag size={16} />
          <span>{current.btn}</span>
        </button>
      </div>
    </div>
  );
}
