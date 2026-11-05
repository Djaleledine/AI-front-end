"use client";

import React, { useState } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { storeApi } from "../../services/storeApi";

export default function ComingSoonCard({ product, index = 0 }) {
  const { showToast } = useCart();
  const { lang } = useLanguage();
  const [notified, setNotified] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(`anjucia_notify_${product.id}`);
  });

  const handleNotify = async () => {
    if (notified) {
      showToast(lang === "dz" || lang === "ar" ? "أنت مسجل بالفعل في قائمة الإشعار !" : lang === "en" ? "You are already registered for notifications!" : "Vous êtes déjà inscrit pour être notifié !");
      return;
    }
    try {
      localStorage.setItem(`anjucia_notify_${product.id}`, "true");
      await storeApi.leads.create({
        productId: product.id,
        productName: product.name,
        contact: "Visiteur Boutique (App Web)",
        wilaya: "Algérie",
        source: "ComingSoonCard"
      });
    } catch (_) {}
    setNotified(true);
    showToast(
      lang === "dz" || lang === "ar"
        ? `تم تسجيلك ! سنخبرك فور توفر ${product.name}`
        : lang === "en"
        ? `Registered! You will be first to know when ${product.name} launches ✨`
        : `Enregistré ! Vous serez le premier informé du lancement de ${product.name} ✨`
    );
  };

  return (
    <article
      className="coming-soon-card"
      style={{
        position: "relative",
        background: "var(--bg-card)",
        border: "none",
        borderRadius: "0px",
        padding: "1.8rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "260px",
        overflow: "hidden",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-aqua-subtle) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }}
      />

      {/* Top Header & Badge */}
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.2rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.72rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.3rem 0.75rem",
              borderRadius: "0px",
              background: "rgba(113, 159, 183, 0.14)",
              color: "var(--accent-aqua)",
              border: "none"
            }}
          >
            <Clock size={12} />
            {lang === "dz" || lang === "ar" ? "قريباً • في مرحلة التحضير" : lang === "en" ? "Coming Soon • In Formulation" : "Bientôt Disponible"}
          </span>
        </div>

        {/* Product Details */}
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent-aqua)",
            display: "block",
            marginBottom: "0.35rem"
          }}
        >
          {product.category || "Dermocosmétique"}
        </span>
        <h3
          style={{
            fontSize: "1.24rem",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.25,
            marginBottom: "0.5rem"
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            marginBottom: "1.2rem"
          }}
        >
          {product.subtitle || product.description}
        </p>
      </div>

      {/* Card Action footer */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "1.1rem",
          display: "flex",
          alignItems: "center"
        }}
      >
        <button
          onClick={handleNotify}
          className={notified ? "btn-outline" : "btn-aqua"}
          style={{
            width: "100%",
            padding: "0.75rem 1.1rem",
            fontSize: "0.84rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem"
          }}
        >
          {notified ? (
            <>
              <Check size={14} color="var(--success)" />
              <span>{lang === "dz" || lang === "ar" ? "تم التسجيل ✓" : lang === "en" ? "Registered ✓" : "Inscrit ✓"}</span>
            </>
          ) : (
            <>
              <Bell size={14} />
              <span>{lang === "dz" || lang === "ar" ? "أعلمني عند التوفر" : lang === "en" ? "Notify Me" : "Me prévenir"}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
