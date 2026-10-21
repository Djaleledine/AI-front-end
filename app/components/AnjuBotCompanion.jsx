"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { Sparkles, X, ChevronRight, MessageCircle } from "lucide-react";
import { DropletMark } from "./brand/AnjuciaLogo";

const TIPS = {
  fr: [
    "✦ Soin Apaisant disponible : Gel-Crème 50 ml à 1 800 DA, livraison 58 Wilayas !",
    "✦ Formulé pour le climat algérien : Niacinamide 3% pure, 0% parfum, pH 5.2 strict ✨",
    "✦ Astuce : Vous pouvez installer l'App ANJUCIA sur votre écran d'accueil 📲",
    "✦ Nouveau : Testez le jeu Goutte Rescue dans l'onglet Jeu 🎮 !",
    "✦ Tube canule hygiénique : dosage précis sans risque de panne de pompe 🛡️"
  ],
  dz: [
    "✦ متوفر الآن : جل-كريم طبي 50 مل بسعر 1800 دج مع توصيل لكل الـ 58 ولاية !",
    "✦ تركيبة مخصصة لبلادنا : نياسيناميد 3%، بدون عطور، وبـ pH 5.2 متوازن تماماً ✨",
    "✦ نصيحة : تقدر تثبت تطبيق أنجوسيا في شاشة هاتفك باش تطلب في ثواني 📲",
    "✦ جرب اللعبة الجديدة : أنقذ القطرة في قسم الألعاب 🎮 !",
    "✦ تيوب كانول محمي : يضمنلك استعمال نظيف وبلا أعطال 🛡️"
  ],
  en: [
    "✦ Live Flagship: Soothing Face Gel-Cream 50 ml at 1,800 DZD, 58 Wilayas shipping!",
    "✦ Formulated for North African climate: 3% pure Niacinamide, pH 5.2, 0% fragrance ✨",
    "✦ Tip: Install ANJUCIA as a native app on your home screen 📲",
    "✦ New: Play Droplet Rescue in the Game tab 🎮!",
    "✦ Zero-fail cannula tube: maximum hygienic precision 🛡️"
  ]
};

export default function AnjuBotCompanion() {
  const { lang } = useLanguage();
  const { isCartOpen } = useCart();

  const [isOpen, setIsOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  // Spring physics position
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const companionRef = useRef(null);

  // Periodically cycle tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % (TIPS[lang] || TIPS.fr).length);
    }, 9000);
    return () => clearInterval(timer);
  }, [lang]);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Eye tracking: pupils follow pointer
  useEffect(() => {
    const handleMove = (e) => {
      if (!companionRef.current) return;
      const rect = companionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      const dist = Math.min(3.5, Math.hypot(clientX - centerX, clientY - centerY) * 0.03);

      setPupilPos({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  // Damped spring animation loop for dragging / settling
  useEffect(() => {
    let animId;
    const springK = 0.16;
    const damping = 0.72;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (isDragging.current) return;

      const fX = (targetPos.current.x - currentPos.current.x) * springK;
      const fY = (targetPos.current.y - currentPos.current.y) * springK;

      velocity.current.x = (velocity.current.x + fX) * damping;
      velocity.current.y = (velocity.current.y + fY) * damping;

      currentPos.current.x += velocity.current.x;
      currentPos.current.y += velocity.current.y;

      // Only update react state if movement is non-negligible
      if (
        Math.abs(velocity.current.x) > 0.01 ||
        Math.abs(velocity.current.y) > 0.01 ||
        Math.abs(currentPos.current.x - pos.x) > 0.2
      ) {
        setPos({ x: currentPos.current.x, y: currentPos.current.y });
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [pos.x]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = {
      x: clientX - currentPos.current.x,
      y: clientY - currentPos.current.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    currentPos.current = {
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    };
    setPos({ ...currentPos.current });
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Spring back to base dock
    targetPos.current = { x: 0, y: 0 };
  };

  const handleCompanionClick = () => {
    setIsHappy(true);
    setTipIndex((prev) => (prev + 1) % (TIPS[lang] || TIPS.fr).length);
    try { navigator.vibrate?.(12); } catch (_) {}
    setTimeout(() => setIsHappy(false), 900);
  };

  if (isCartOpen) return null; // Avoid overlapping cart drawer

  const currentTip = (TIPS[lang] || TIPS.fr)[tipIndex];

  return (
    <aside
      ref={companionRef}
      aria-label="Compagnon Anjucia Droplet"
      className="anju-companion-dock"
      style={{
        position: "fixed",
        bottom: "calc(var(--tab-bar-height, 64px) + 14px)",
        right: "14px",
        zIndex: 990,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        touchAction: "none"
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Speech Tip Bubble */}
      {isOpen && (
        <div
          className="companion-bubble"
          style={{
            maxWidth: "260px",
            background: "var(--bg-card)",
            border: "1.5px solid var(--accent-aqua)",
            borderRadius: "16px 16px 4px 16px",
            padding: "0.75rem 0.95rem",
            marginBottom: "0.55rem",
            boxShadow: "var(--shadow-md), var(--shadow-glow)",
            fontSize: "0.78rem",
            color: "var(--text-primary)",
            lineHeight: 1.45,
            position: "relative",
            animation: "fade-in 0.25s ease"
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "2px"
            }}
            aria-label="Fermer"
          >
            <X size={12} />
          </button>
          <div style={{ paddingRight: "0.8rem" }}>{currentTip}</div>
        </div>
      )}

      {/* Main Droplet Creature */}
      <button
        onClick={handleCompanionClick}
        aria-label="Interagir avec la goutte Anjucia"
        style={{
          background: "none",
          border: "none",
          cursor: "grab",
          padding: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "68px",
          filter: "drop-shadow(0 8px 16px rgba(113, 159, 183, 0.45))",
          transform: isHappy ? "scale(1.18) translateY(-6px)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        {/* Vector Anjucia Droplet Body */}
        <DropletMark size={54} color="#719FB7" />

        {/* Cute Face Overlay positioned on the droplet belly */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -40%)",
            width: "30px",
            height: "20px",
            pointerEvents: "none"
          }}
        >
          {/* Eyes */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Left Eye */}
            <div
              style={{
                width: "7px",
                height: isBlinking ? "1.5px" : isHappy ? "5px" : "7px",
                borderRadius: isHappy ? "7px 7px 0 0" : "50%",
                background: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
                transition: "height 0.1s ease"
              }}
            >
              {!isBlinking && !isHappy && (
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#11171A",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px))`
                  }}
                />
              )}
            </div>

            {/* Right Eye */}
            <div
              style={{
                width: "7px",
                height: isBlinking ? "1.5px" : isHappy ? "5px" : "7px",
                borderRadius: isHappy ? "7px 7px 0 0" : "50%",
                background: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
                transition: "height 0.1s ease"
              }}
            >
              {!isBlinking && !isHappy && (
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#11171A",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px))`
                  }}
                />
              )}
            </div>
          </div>

          {/* Cute Smile */}
          <div
            style={{
              width: "6px",
              height: isHappy ? "4px" : "2.5px",
              borderBottom: "1.8px solid #FFFFFF",
              borderRadius: "0 0 6px 6px",
              margin: "2px auto 0"
            }}
          />
        </div>
      </button>
    </aside>
  );
}
