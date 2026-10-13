"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { Sparkles, ArrowUp, Zap, MessageCircle, X, ChevronRight, Compass } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FLIGHT_STATIONS = {
  hero: {
    side: "right",
    topV: 26,
    xOffset: 0,
    bubblePos: "left",
    highlightText: {
      fr: "✦ Analyse Clinique : Soin apaisant 1 500 DA formulé sous climat algérien !",
      dz: "✦ تحليل مخبري : جل-كريم طبي 1500 دج مصمم خصيصاً لمناخ الجزائر !"
    }
  },
  packs: {
    side: "left",
    topV: 24,
    xOffset: 0,
    bubblePos: "right",
    highlightText: {
      fr: "✦ Alerte Économie : Le Pack Duo offre la livraison sur les 58 Wilayas ! 📦",
      dz: "✦ فرصة توفير : باك الثنائي مع توصيل مجاني لكل الـ 58 ولاية ! 📦"
    }
  },
  mixer: {
    side: "center",
    topV: 18,
    xOffset: 0,
    bubblePos: "bottom",
    highlightText: {
      fr: "✦ Labo Virtuel : Choisissez votre trésor végétal & observez la réaction ! 🧪",
      dz: "✦ مخبر الخلطات : اختر الزيت الطبيعي وشوف النتيجة والملمس مباشرة ! 🧪"
    }
  },
  rituels: {
    side: "center",
    topV: 18,
    xOffset: 0,
    bubblePos: "bottom",
    highlightText: {
      fr: "✦ Labo Virtuel : Choisissez votre trésor végétal & observez la réaction ! 🧪",
      dz: "✦ مخبر الخلطات : اختر الزيت الطبيعي وشوف النتيجة والملمس مباشرة ! 🧪"
    }
  },
  produits: {
    side: "right",
    topV: 28,
    xOffset: 0,
    bubblePos: "left",
    highlightText: {
      fr: "✦ Pureté Maximale : Niacinamide 3% pure, 0% parfum, pH 5.2 strict ✨",
      dz: "✦ نقاوة طبية : نياسيناميد 3%، بدون عطور، بـ pH 5.2 متوازن تماماً ✨"
    }
  },
  avis: {
    side: "left",
    topV: 25,
    xOffset: 0,
    bubblePos: "right",
    highlightText: {
      fr: "✦ 8 500+ Utilisateurs : Retours réels testés sous vent sec et chaleur ⭐",
      dz: "✦ أكثر من 8500 تجربة حقيقية وموثقة تحت حرارة ورياح بلادنا ⭐"
    }
  },
  charte: {
    side: "right",
    topV: 28,
    xOffset: 0,
    bubblePos: "left",
    highlightText: {
      fr: "✦ Charte Formulateur : Stabilité 45°C & embout canule zéro-panne 🛡️",
      dz: "✦ ضمان الجودة : مقاومة حتى 45 درجة وتيوب كانول محمي من الأعطال 🛡️"
    }
  },
  pharmacies: {
    side: "center",
    topV: 22,
    xOffset: 0,
    bubblePos: "bottom",
    highlightText: {
      fr: "✦ Réseau National : Disponible en ligne et en officines 58 Wilayas 📍",
      dz: "✦ شبكة التوزيع : متوفر بالطلب السريع أو في الصيدليات المعتمدة 📍"
    }
  }
};

export default function AnjuBotCompanion() {
  const { lang } = useLanguage();
  const [currentStation, setCurrentStation] = useState("hero");
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const containerRef = useRef(null);
  const botPodRef = useRef(null);
  const bubbleRef = useRef(null);
  const thrusterRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const activeStationData = FLIGHT_STATIONS[currentStation] || FLIGHT_STATIONS.hero;

  // Fly Anju-Bot dynamically between sections!
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;

    if (!botPodRef.current) return;

    let targetLeft = "calc(100vw - 86px)";
    let targetTop = `${activeStationData.topV}vh`;

    if (isMobile) {
      targetLeft = "calc(100vw - 64px)";
      targetTop = "78vh";
    } else {
      if (activeStationData.side === "left") {
        targetLeft = "24px";
      } else if (activeStationData.side === "center") {
        targetLeft = "calc(50vw - 36px)";
      } else {
        targetLeft = "calc(100vw - 92px)";
      }
    }

    // Swoop flight animation with banking tilt
    gsap.to(botPodRef.current, {
      left: targetLeft,
      top: targetTop,
      duration: 1.15,
      ease: "power2.inOut",
      overwrite: "auto"
    });

    // Animate bubble pop
    if (bubbleRef.current && isBubbleOpen) {
      gsap.fromTo(bubbleRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.8)" }
      );
    }
  }, [currentStation, activeStationData, isBubbleOpen]);

  // Section Tracking via ScrollTrigger
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Ambient Hover Bobbing
    const bobTween = gsap.to(botPodRef.current, {
      y: "-=8",
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 2. Thruster flame pulsating
    const thrusterTween = gsap.to(thrusterRef.current, {
      scaleY: 1.35,
      scaleX: 1.2,
      opacity: 0.95,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // 3. Scroll Tracking & Velocity Banking
    let scrollTimeout;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent(Math.round((currentScrollY / total) * 100));
      }

      // Bank tilt based on scroll speed
      const targetTilt = Math.max(Math.min(delta * 0.45, 18), -18);
      if (botPodRef.current) {
        gsap.to(botPodRef.current, {
          rotation: targetTilt,
          duration: 0.2,
          ease: "power1.out",
          overwrite: "auto"
        });
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (botPodRef.current) {
          gsap.to(botPodRef.current, {
            rotation: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto"
          });
        }
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // 4. Section Triggers
    const stationIds = ["hero", "packs", "mixer", "rituels", "produits", "avis", "charte", "pharmacies"];
    const triggers = [];

    stationIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => setCurrentStation(id),
        onEnterBack: () => setCurrentStation(id),
      });
      triggers.push(st);
    });

    return () => {
      bobTween.kill();
      thrusterTween.kill();
      window.removeEventListener("scroll", onScroll);
      triggers.forEach((t) => t.kill());
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Bot Click Action: 360° Joyful Backflip + Sparkle Burst
  const handleBotClick = () => {
    if (botPodRef.current) {
      gsap.fromTo(botPodRef.current,
        { scale: 1, rotation: 0 },
        {
          scale: 1.3,
          rotation: 360,
          duration: 0.7,
          ease: "back.out(2.2)",
          onComplete: () => {
            gsap.to(botPodRef.current, { scale: 1, rotation: 0, duration: 0.3 });
          }
        }
      );
      spawnBotSparks();
    }
    setIsMenuOpen((prev) => !prev);
  };

  const spawnBotSparks = () => {
    if (!botPodRef.current) return;
    const rect = botPodRef.current.getBoundingClientRect();
    const colors = ["#38BDF8", "#719FB7", "#FFFFFF", "#9BB0A0"];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("div");
      const sz = Math.random() * 6 + 3;
      p.style.cssText = `position:fixed;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};box-shadow:0 0 8px #38BDF8;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;pointer-events:none;z-index:9999;`;
      document.body.appendChild(p);
      gsap.to(p, {
        x: (Math.random() - 0.5) * 140,
        y: (Math.random() - 0.5) * 140 - 20,
        scale: 0,
        opacity: 0,
        duration: Math.random() * 0.7 + 0.4,
        ease: "power2.out",
        onComplete: () => p.remove(),
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const currentHighlightText = activeStationData.highlightText[lang] || activeStationData.highlightText.fr;

  return (
    <div ref={containerRef} className="anjubot-viewport-stage" aria-label="Anju-Bot Volant">
      {/* ── Autonomous Flying Pod ───────────────────────────────────────────── */}
      <div
        ref={botPodRef}
        className={`anjubot-flying-pod station-${currentStation} side-${activeStationData.side}`}
      >
        {/* Holographic Speech HUD Bubble */}
        {isBubbleOpen && (
          <div
            ref={bubbleRef}
            className={`anjubot-flight-bubble bubble-dock-${activeStationData.bubblePos}`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setIsBubbleOpen(false); }}
              className="anjubot-bubble-close"
              title="Masquer le message"
              aria-label="Masquer"
            >
              <X size={12} />
            </button>
            <div className="anjubot-bubble-header">
              <span className="anjubot-status-dot" />
              <span className="anjubot-badge-title">ANJU-BOT EN VOL</span>
              <span className="anjubot-section-pill">{currentStation.toUpperCase()}</span>
            </div>
            <p className="anjubot-bubble-text">{currentHighlightText}</p>
            <div className="anjubot-bubble-footer">
              <span>Position : {scrollPercent}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
                className="anjubot-action-link"
              >
                <span>Menu</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* The Physical Mascot Drone Orb */}
        <div
          className="anjubot-drone-core"
          onClick={handleBotClick}
          title="Anju-Bot • Cliquez pour faire un salto ou ouvrir les actions !"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleBotClick(); }}
        >
          {/* Orbital Glowing Cyan Ring */}
          <div className="anjubot-orbital-ring" />

          {/* Holographic Drone Dome Frame */}
          <div className="anjubot-dome-frame">
            <img
              src="/assets/anju-bot.jpg"
              alt="Anju-Bot Mascot ANJUCIA"
              className="anjubot-mascot-img"
            />
          </div>

          {/* Ion Thruster Flare Below */}
          <div ref={thrusterRef} className="anjubot-ion-thruster" />

          {/* Online Beacon */}
          <div className="anjubot-pulse-beacon" />
        </div>

        {/* Quick Bubble Re-open Button if closed */}
        {!isBubbleOpen && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsBubbleOpen(true); }}
            className="anjubot-reopen-bubble-btn"
            title="Afficher les conseils d'Anju-Bot"
          >
            💬
          </button>
        )}

        {/* Command Menu Popover */}
        {isMenuOpen && (
          <div className="anjubot-command-menu">
            <div className="anjubot-menu-head">
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Zap size={15} color="var(--accent-aqua)" />
                <span style={{ fontWeight: 900, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                  ANJU-BOT ACTIONS
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="anjubot-menu-items">
              <a
                href="/analyzer"
                className="anjubot-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles size={16} color="var(--accent-aqua)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                    Station DermoScan AI™
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    Diagnostic cutané & formule sur-mesure
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/213550000000?text=Bonjour%20Anjucia,%20je%20souhaite%20un%20conseil%20sur%20ma%20routine."
                target="_blank"
                rel="noopener noreferrer"
                className="anjubot-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle size={16} color="var(--success)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                    Conseil Expert WhatsApp
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    Assistance formateur en direct
                  </div>
                </div>
              </a>

              <button
                onClick={scrollToTop}
                className="anjubot-menu-item"
                style={{ width: "100%", background: "none", border: "none", textAlign: "left" }}
              >
                <ArrowUp size={16} color="var(--accent-aqua)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                    Remonter en Haut de Page
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    Retour instantané au sommet
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
