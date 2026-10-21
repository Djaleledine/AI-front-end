"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Check, Droplets, Leaf, Sun, Moon, ArrowRight, ShieldCheck, Activity, RotateCw, ShoppingBag, FlaskConical, Beaker, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import gsap from "gsap";

const BOTANICALS = [
  {
    id: "argan-oil",
    name: {
      fr: "Huile d'Argan Pure pressée à froid",
      en: "Pure Cold-Pressed Argan Oil",
      dz: "زيت الأركان النقي المعصور على البارد"
    },
    subtitle: {
      fr: "Acides Gras Essentiels & Vitamine E Pure",
      en: "Essential Fatty Acids & Pure Vitamin E",
      dz: "أحماض دهنية أوميغا وفيتامين E طبيعي"
    },
    origin: "Tindouf / Atlas",
    color: "#D99B38",
    glowColor: "rgba(217, 155, 56, 0.4)",
    dropUnit: { fr: "gouttes", en: "drops", dz: "قطرات" },
    synergyPercent: 98,
    telemetry: { hydra: 96, barrier: 98, comfort: 95 },
    swatchGradient: "radial-gradient(circle at 30% 30%, #FFE0B2 0%, #FFB74D 45%, #E65100 100%)",
    textureOptions: {
      1: {
        title: { fr: "Fluide Satiné Ultra-Léger", dz: "سائل حريري خفيف" },
        desc: {
          fr: "1 goutte d'Argan pure apporte un éclat sain immédiat sans alourdir les peaux mixtes.",
          dz: "قطرة واحدة تعطيك نضارة طبيعية وملمس حريري خفيف للنهار."
        }
      },
      2: {
        title: { fr: "Émulsion Veloutée Nourrissante (Équilibre Idéal)", dz: "مستحلب مخملي مغذي (الجرعة المثالية)" },
        desc: {
          fr: "2 gouttes d'Argan associées au Gel-Cream créent un bouclier riche en tocophérols sans fini gras.",
          dz: "زوج قطرات مع جل-كريم أنجوسيا يشكلوا طبقة حماية غنية بالفيتامينات بلا تزييت."
        }
      },
      3: {
        title: { fr: "Baume Protecteur Nuit Réparateur SOS", dz: "بلسم ليلي مكثف لترميم البشرة" },
        desc: {
          fr: "3 gouttes créent un enveloppement réparateur face aux agressions du sirocco et du vent sec.",
          dz: "3 قطرات لترميم حاجز البشرة المتضرر من حرارة الصيف ورياح الشهيلي الجافة."
        }
      }
    }
  },
  {
    id: "rose-water",
    name: {
      fr: "Hydrolat Pur d'Eau de Rose distillée",
      en: "Pure Distilled Rose Water Hydrosol",
      dz: "ماء الورد المقطر الصافي 100%"
    },
    subtitle: {
      fr: "Tonifiant Astringent & Anti-Rougeurs",
      en: "Astringent Toner & Calming Anti-Redness",
      dz: "مهدئ فوري للاحمرار ومنعش للمسامات"
    },
    origin: "Distillation Vapeur Pure",
    color: "#E05A84",
    glowColor: "rgba(224, 90, 132, 0.4)",
    dropUnit: { fr: "brumisation", en: "mist", dz: "رشة" },
    synergyPercent: 97,
    telemetry: { hydra: 99, barrier: 94, comfort: 98 },
    swatchGradient: "radial-gradient(circle at 30% 30%, #FCE4EC 0%, #F48FB1 45%, #C2185B 100%)",
    textureOptions: {
      1: {
        title: { fr: "Hydro-Gel Frais Pénétrant", dz: "هيدرو-جل منعش وسريع الامتصاص" },
        desc: {
          fr: "1 vaporisation d'Eau de Rose rafraîchit le teint et permet au Panthénol 2% d'apaiser rapidement.",
          dz: "رشة واحدة من ماء الورد تنعش الوجه وتخلي البانتينول يهدئ البشرة في ثواني."
        }
      },
      2: {
        title: { fr: "Sérum Désaltérant Pores Resserrés", dz: "سيروم مهدئ ومرطب للمسامات" },
        desc: {
          fr: "2 vaporisations optimisent l'hydratation intracellulaire et resserrent les pores après la chaleur.",
          dz: "رشتين تعطي ترطيب أعمق وتساعد على تقليص المسامات الواسعة بعد التعرض للشمس."
        }
      },
      3: {
        title: { fr: "Bain de Fraîcheur Anti-Échauffement", dz: "ارتواء مائي مكثف ضد الالتهاب" },
        desc: {
          fr: "Infusion désaltérante maximale pour réconforter les peaux très sensibles ou réactives.",
          dz: "ارتواء مائي كامل يهدي البشرة الحساسة المعرضة للالتهاب والحكة."
        }
      }
    }
  },
  {
    id: "aloe-vera",
    name: {
      fr: "Gel d'Aloe Vera Natif 99%",
      en: "Pure Native 99% Aloe Vera",
      dz: "جل الألوفيرا الطبيعي النقي 99%"
    },
    subtitle: {
      fr: "Polysaccharides Hydratants Purs 72H",
      en: "Pure Hydrating Polysaccharides",
      dz: "سكريات نباتية مرطبة ومجددة للخلايا"
    },
    origin: "Gelée Fraîche Concentrée",
    color: "#48BB78",
    glowColor: "rgba(72, 187, 120, 0.4)",
    dropUnit: { fr: "noisette", en: "pea-size", dz: "كمية صغيرة" },
    synergyPercent: 99,
    telemetry: { hydra: 100, barrier: 95, comfort: 97 },
    swatchGradient: "radial-gradient(circle at 30% 30%, #E8F5E9 0%, #81C784 45%, #2E7D32 100%)",
    textureOptions: {
      1: {
        title: { fr: "Fluide Cristallin Repulpant", dz: "سائل بلوري مرطب وناعم" },
        desc: {
          fr: "1 noisette apporte un shot d'eau immédiat scellé par le Squalane végétal.",
          dz: "كمية صغيرة تدخل الترطيب لأعماق البشرة والسكوالان يحافظ عليه بلا تبخر."
        }
      },
      2: {
        title: { fr: "Masque-Gel Hydratation 72H", dz: "ماسك جل ترطيب عميق 72 ساعة" },
        desc: {
          fr: "En proportion égale avec le Gel-Cream, forme un voile hydro-désaltérant qui stoppe les tiraillements.",
          dz: "بكميات متساوية، يعطيك قناع مائي يوقف إحساس التجباد ونقص الماء فالحين."
        }
      },
      3: {
        title: { fr: "Gelée Réparatrice SOS Coup de Chaud", dz: "جل مهدئ لترميم البشرة بعد الشمس" },
        desc: {
          fr: "Concentration riche pour régénérer la barrière cutanée après une exposition solaire prolongée.",
          dz: "تركيز عالي لإنقاذ وترميم البشرة المجهدة من حرارة الصيف الحارقة."
        }
      }
    }
  },
  {
    id: "jojoba-oil",
    name: {
      fr: "Huile de Jojoba Vierge Biomimétique",
      en: "Biomimetic Pure Jojoba Oil",
      dz: "زيت الجوجوبا الحيوي النقي"
    },
    subtitle: {
      fr: "Cires Liquides Régulatrices Zone T",
      en: "Sebum-Balancing Liquid Waxes",
      dz: "منظم ومعدل لإفراز الدهون والزيوت"
    },
    origin: "Pression à froid 100%",
    color: "#CCA326",
    glowColor: "rgba(204, 163, 38, 0.4)",
    dropUnit: { fr: "goutte", en: "drop", dz: "قطرة" },
    synergyPercent: 96,
    telemetry: { hydra: 94, barrier: 97, comfort: 93 },
    swatchGradient: "radial-gradient(circle at 30% 30%, #FFF9C4 0%, #FBC02D 45%, #F57F17 100%)",
    textureOptions: {
      1: {
        title: { fr: "Gelée Soyeuse Fini Mat Longue Durée", dz: "جل حريري بلمسة جافة ومات" },
        desc: {
          fr: "1 goutte aide à réguler les brillances de la zone T sans assécher, sublimée par 3% Niacinamide.",
          dz: "قطرة واحدة تنقص لمعان الجبهة والأنف بلا ما تنشف الوجه، بفضل النياسيناميد 3%."
        }
      },
      2: {
        title: { fr: "Émulsion Équilibrante Fini Velours", dz: "مستحلب متوازن بملمس مخملي" },
        desc: {
          fr: "2 gouttes renforcent le ciment cellulaire tout en préservant un toucher sec et poudré.",
          dz: "زوج قطرات يقويو حاجز البشرة مع الحفاظ على ملمس جاف وناعم طول النهار."
        }
      },
      3: {
        title: { fr: "Bouclier Anti-Pollution & Sable", dz: "حماية عازلة ضد الغبار والتلوث" },
        desc: {
          fr: "Protège contre l'adhérence des poussières urbaines et du sable tout en matifiant durablement.",
          dz: "يعزل البشرة عن ذرات الغبار والرمل ويثبت المظهر المات الطبيعي طول اليوم."
        }
      }
    }
  }
];

export default function DermLabMixer() {
  const { lang } = useLanguage();
  const { addHybridHero, setIsCartOpen, showToast } = useCart();

  const [selectedBotanical, setSelectedBotanical] = useState(BOTANICALS[0]);
  const [drops, setDrops] = useState(2);
  const [routineMode, setRoutineMode] = useState("day");
  const [isBlending, setIsBlending] = useState(false);

  const crucibleRef = useRef(null);
  const pipetteDropRef = useRef(null);
  const rippleRef = useRef(null);
  const textureSwatchRef = useRef(null);

  // Dynamic telemetry calculations
  const baseHydra = selectedBotanical.telemetry.hydra;
  const baseBarrier = selectedBotanical.telemetry.barrier;
  const baseComfort = selectedBotanical.telemetry.comfort;

  const hydraVal = Math.min(100, baseHydra + (drops - 2) * 2);
  const barrierVal = Math.min(100, baseBarrier + (drops - 2) * 2);
  const comfortVal = Math.min(100, baseComfort + (drops - 2) * 2);

  // Trigger liquid drop animation into crucible
  const triggerDropAnimation = () => {
    setIsBlending(true);

    if (pipetteDropRef.current && rippleRef.current) {
      const tl = gsap.timeline();
      // Drop falls from pipette
      tl.fromTo(pipetteDropRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: 64, scale: 0.8, opacity: 0.9, duration: 0.38, ease: "power2.in" }
      );
      // Ripple expands in crucible pool
      tl.fromTo(rippleRef.current,
        { scale: 0.2, opacity: 0.9, borderColor: selectedBotanical.color },
        { scale: 2.4, opacity: 0, duration: 0.65, ease: "power2.out" },
        "-=0.08"
      );
      // Texture swatch shimmers
      if (textureSwatchRef.current) {
        tl.fromTo(textureSwatchRef.current,
          { scale: 0.96, filter: "brightness(1.25)" },
          { scale: 1, filter: "brightness(1)", duration: 0.45, ease: "back.out(1.4)" },
          "-=0.4"
        );
      }
    }

    setTimeout(() => setIsBlending(false), 650);
  };

  const handleSelectBotanical = (botanical) => {
    setSelectedBotanical(botanical);
    triggerDropAnimation();
  };

  const handleSetDrops = (val) => {
    setDrops(val);
    triggerDropAnimation();
  };

  const handleRoutineToggle = (mode) => {
    setRoutineMode(mode);
    if (mode === "day") {
      setDrops(1);
    } else {
      setDrops(2);
    }
    triggerDropAnimation();
  };

  const handleAddToCart = () => {
    addHybridHero("soothing-gel-cream");
    showToast(`Rituel "${selectedBotanical.name.fr}" ajouté au panier avec QR Code scellé !`);
    setIsCartOpen(true);
  };

  const currentTexture = selectedBotanical.textureOptions[drops] || selectedBotanical.textureOptions[2];

  // Circular SVG Gauge calculation (radius = 32, circumference ~ 201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;

  return (
    <section id="rituels" className="dermlab-luxury-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header center" style={{ maxWidth: "840px", margin: "0 auto 3rem", textAlign: "center" }}>
          <div className="section-tag">
            <FlaskConical size={14} />
            <span>{lang === "dz" ? "مختبر الخلطات الصيدلانية" : "LABORATOIRE DERMACEUTIQUE SUR-MESURE"}</span>
          </div>
          <h2 className="section-title gsap-headline">
            {lang === "dz"
              ? "اصنعي ملمسكِ الخاص : امزجي كريم الأساس مع خلاصات نقية"
              : "Formulez Votre Texture Sur-Mesure en Direct"}
          </h2>
          <p className="section-subtitle">
            {lang === "dz"
              ? "تفاعل حي ومبتكر : اختاري الخلاصة الطبيعية وعدّلي عدد القطرات لمشاهدة تحوّل المستحلب ومؤشرات الراحة الجلدية."
              : "Associez notre Soin Visage Apaisant (pH 5.2) aux essences botaniques pures et observez la transformation texturale en temps réel."}
          </p>

          {/* Interactive Day / Night Routine Toggle */}
          <div className="dermlab-routine-switcher">
            <button
              onClick={() => handleRoutineToggle("day")}
              className={`routine-switch-btn ${routineMode === "day" ? "active-day" : ""}`}
            >
              <Sun size={15} />
              <span>{lang === "dz" ? "روتين الصباح (مات وحماية)" : "Routine Matin (Fini Mat & Bouclier)"}</span>
            </button>
            <button
              onClick={() => handleRoutineToggle("night")}
              className={`routine-switch-btn ${routineMode === "night" ? "active-night" : ""}`}
            >
              <Moon size={15} />
              <span>{lang === "dz" ? "روتين المساء (ترميم 72 ساعة)" : "Routine Soir (Réparation Barrière)"}</span>
            </button>
          </div>
        </div>

        {/* ── The 3-Zone Formulation Workstation ───────────────────────────────── */}
        <div className="dermlab-workstation-board">
          {/* ZONE 1: BOTANICAL ESSENCES RACK (LEFT) */}
          <div className="dermlab-rack-zone">
            <div className="zone-header">
              <span className="zone-step-num">01</span>
              <div>
                <h4 className="zone-title">{lang === "dz" ? "اختر الخلاصة الطبيعية" : "Choisissez l'Actif Botanique"}</h4>
                <div className="zone-subtitle">{lang === "dz" ? "مكونات نقية 100% طبيعية" : "100% Matières Premières Nobles"}</div>
              </div>
            </div>

            <div className="dermlab-botanical-cards">
              {BOTANICALS.map((bot) => {
                const isSelected = selectedBotanical.id === bot.id;
                return (
                  <button
                    key={bot.id}
                    onClick={() => handleSelectBotanical(bot)}
                    className={`dermlab-botanical-item ${isSelected ? "selected" : ""}`}
                    style={{
                      borderColor: isSelected ? bot.color : "var(--border-subtle)",
                      boxShadow: isSelected ? `0 0 16px ${bot.glowColor}` : "none"
                    }}
                  >
                    {/* Glowing colored droplet indicator */}
                    <div
                      className="botanical-drop-bubble"
                      style={{ background: bot.glowColor, color: bot.color, border: `1.5px solid ${bot.color}` }}
                    >
                      <Droplets size={18} />
                    </div>

                    <div className="botanical-item-body">
                      <div className="botanical-item-top">
                        <span className="botanical-name">{bot.name[lang] || bot.name.fr}</span>
                        <span className="botanical-synergy-pill" style={{ color: bot.color, background: bot.glowColor }}>
                          {bot.synergyPercent}%
                        </span>
                      </div>
                      <div className="botanical-desc">{bot.subtitle[lang] || bot.subtitle.fr}</div>
                      <div className="botanical-origin">📍 {bot.origin}</div>
                    </div>

                    <div className="botanical-check-dot">
                      {isSelected ? (
                        <CheckCircle2 size={20} color={bot.color} />
                      ) : (
                        <div className="empty-radio" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ZONE 2: INTERACTIVE CRUCIBLE & PIPETTE (CENTER) */}
          <div className="dermlab-crucible-zone">
            <div className="zone-header center">
              <span className="zone-step-num">02</span>
              <div>
                <h4 className="zone-title">{lang === "dz" ? "حوض المزج والتفاعل" : "Creuset de Formulation Virtuel"}</h4>
                <div className="zone-subtitle">{lang === "dz" ? "تفاعل قطرات الزيت مع الجل-كريم" : "Micro-infusion en direct"}</div>
              </div>
            </div>

            {/* The Laboratory Crucible Flask */}
            <div ref={crucibleRef} className="crucible-vessel-container">
              {/* Laboratory Pipette Dropper */}
              <div className="crucible-pipette-rig">
                <div className="pipette-tube">
                  <div className="pipette-liquid" style={{ background: selectedBotanical.color }} />
                </div>
                {/* Falling Droplet */}
                <div
                  ref={pipetteDropRef}
                  className="pipette-falling-drop"
                  style={{ background: selectedBotanical.color, boxShadow: `0 0 10px ${selectedBotanical.color}` }}
                />
              </div>

              {/* Glass Mixing Dish */}
              <div className="crucible-glass-dish">
                {/* Expanding Concentric Ripple */}
                <div ref={rippleRef} className="crucible-liquid-ripple" />

                {/* Base Gel-Cream Pool with Botanical Aura */}
                <div
                  className="crucible-cream-base"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.9) 65%, ${selectedBotanical.glowColor} 100%)`
                  }}
                >
                  <div className="cream-surface-glint" />
                  <div className="crucible-center-badge">
                    <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "var(--brand-deep)" }}>
                      ANJUCIA GEL-CREAM
                    </span>
                    <span style={{ fontSize: "0.62rem", color: "var(--accent-aqua)", fontWeight: 800 }}>
                      + {drops} {selectedBotanical.dropUnit[lang] || selectedBotanical.dropUnit.fr}
                    </span>
                  </div>
                </div>

                {/* Crucible Rim & Graduations */}
                <div className="dish-graduations">
                  <span>50 ml</span>
                  <span>pH 5.2</span>
                </div>
              </div>

              {/* Dynamic Action Pulse Button */}
              <button
                onClick={triggerDropAnimation}
                className="crucible-blend-btn magnetic-btn"
                title="Cliquez pour ré-infuser une goutte d'actif"
              >
                <RotateCw size={15} className={isBlending ? "spin-active" : ""} />
                <span>{isBlending ? "Infusion en cours..." : "Homogénéiser la Formule"}</span>
              </button>
            </div>

            {/* Tactile 3-Step Dosage Selector */}
            <div className="dermlab-dosage-controller">
              <div className="dosage-header">
                <span className="dosage-label">{lang === "dz" ? "مقدار الجرعة المضافة :" : "Dosage en Actif Botanique :"}</span>
                <span className="dosage-val" style={{ color: selectedBotanical.color }}>
                  {drops} {selectedBotanical.dropUnit[lang] || selectedBotanical.dropUnit.fr}
                </span>
              </div>

              <div className="dosage-stepper-grid">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSetDrops(num)}
                    className={`dosage-step-card ${drops === num ? "active" : ""}`}
                    style={{
                      borderColor: drops === num ? selectedBotanical.color : "var(--border-subtle)",
                      background: drops === num ? selectedBotanical.glowColor : "var(--bg-secondary)"
                    }}
                  >
                    <div className="step-drops-icon">
                      {"💧".repeat(num)}
                    </div>
                    <div className="step-title">
                      {num === 1 ? "1 Goutte" : num === 2 ? "2 Gouttes" : "3 Gouttes"}
                    </div>
                    <div className="step-desc">
                      {num === 1 ? "Léger Satiné" : num === 2 ? "Émulsion Idéale" : "Baume SOS Nuit"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ZONE 3: TEXTURE PREVIEW & CIRCULAR TELEMETRY (RIGHT) */}
          <div className="dermlab-preview-zone">
            <div className="zone-header">
              <span className="zone-step-num">03</span>
              <div>
                <h4 className="zone-title">{lang === "dz" ? "النتيجة والمؤشرات الحيوية" : "Fini Obtenu & Télémétrie"}</h4>
                <div className="zone-subtitle">{lang === "dz" ? "توافق معتمد سريرياً" : "Diagnostic Formulateur"}</div>
              </div>
            </div>

            {/* Macro Texture Swatch Visualizer */}
            <div ref={textureSwatchRef} className="macro-texture-swatch-card">
              <div className="swatch-header">
                <Sparkles size={14} color="var(--accent-aqua)" />
                <span>TEXTURE FORMULÉE OBTENUE</span>
              </div>

              <div className="swatch-visual-disc" style={{ background: selectedBotanical.swatchGradient }}>
                <div className="swatch-gloss-streak" />
              </div>

              <h3 className="swatch-title" style={{ color: "var(--text-primary)" }}>
                {currentTexture.title[lang] || currentTexture.title.fr}
              </h3>
              <p className="swatch-description">
                {currentTexture.desc[lang] || currentTexture.desc.fr}
              </p>
            </div>

            {/* Circular Bio-Telemetry Gauges */}
            <div className="dermlab-circular-telemetry">
              <div className="telemetry-bar-title">
                <Activity size={14} color="var(--accent-aqua)" />
                <span>TÉLÉMÉTRIE CUTANÉE • MESURE EN DIRECT</span>
              </div>

              <div className="circular-gauges-row">
                {/* Gauge 1: Hydratation */}
                <div className="gauge-cell">
                  <div className="gauge-svg-wrap">
                    <svg width="68" height="68" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r={radius} stroke="var(--border-subtle)" strokeWidth="6" fill="none" />
                      <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        stroke="var(--accent-aqua)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (hydraVal / 100) * circumference}
                        strokeLinecap="round"
                        transform="rotate(-90 38 38)"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <span className="gauge-value">{hydraVal}%</span>
                  </div>
                  <span className="gauge-label">Hydratation</span>
                </div>

                {/* Gauge 2: Barrière Lipide */}
                <div className="gauge-cell">
                  <div className="gauge-svg-wrap">
                    <svg width="68" height="68" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r={radius} stroke="var(--border-subtle)" strokeWidth="6" fill="none" />
                      <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        stroke={selectedBotanical.color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (barrierVal / 100) * circumference}
                        strokeLinecap="round"
                        transform="rotate(-90 38 38)"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <span className="gauge-value">{barrierVal}%</span>
                  </div>
                  <span className="gauge-label">Barrière 72H</span>
                </div>

                {/* Gauge 3: Confort Apaisant */}
                <div className="gauge-cell">
                  <div className="gauge-svg-wrap">
                    <svg width="68" height="68" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r={radius} stroke="var(--border-subtle)" strokeWidth="6" fill="none" />
                      <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        stroke="#10B981"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (comfortVal / 100) * circumference}
                        strokeLinecap="round"
                        transform="rotate(-90 38 38)"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <span className="gauge-value">{comfortVal}%</span>
                  </div>
                  <span className="gauge-label">Confort SOS</span>
                </div>
              </div>
            </div>

            {/* Direct Add to Cart Action */}
            <div className="dermlab-order-card">
              <div className="order-price-row">
                <div>
                  <div className="order-price">1 800 DA</div>
                  <div className="order-shipping-note">Livraison 58 Wilayas • QR Code VIP Inclus</div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-aqua magnetic-btn"
                  style={{ padding: "0.85rem 1.6rem", fontSize: "0.92rem" }}
                >
                  <ShoppingBag size={17} />
                  <span>{lang === "dz" ? "اطلبي هذا الروتين" : "Commander ce Rituel"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
