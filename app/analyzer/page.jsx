"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { CLINICAL_PRESETS, IN_HOUSE_ROUTINE_TEMPLATE } from "../data/analyzerData";
import { ALGERIAN_WILAYAS } from "../data/products";
import { mock } from "../services/mockApi";
import {
  Camera,
  UploadCloud,
  Users,
  FileText,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Activity,
  Droplets,
  Sun,
  Layers,
  CheckCircle,
  Play,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Eye,
  Check,
  Zap,
  Info
} from "lucide-react";

export default function AnalyzerPage() {
  const { addHybridHero, addPrescriptionBundle } = useCart();
  const { t, lang, isRTL } = useLanguage();
  const { isDark, colorPalette, palettes } = useTheme();
  const activePaletteObj = palettes?.find((p) => p.id === colorPalette) || palettes?.[0];
  const accentColor = activePaletteObj?.hex || (isDark ? "#00D2C4" : "#009688");
  const accentGlow = activePaletteObj?.glow || (isDark ? "rgba(0, 210, 196, 0.35)" : "rgba(0, 150, 136, 0.25)");

  // Mode: 'camera' | 'presets' | 'symptoms'
  const [activeTab, setActiveTab] = useState("camera");
  const [selectedPreset, setSelectedPreset] = useState("amina");

  // Camera & media states
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("user"); // 'user' | 'environment'
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState("/assets/preset-amina.svg");
  const [activeBioPoint, setActiveBioPoint] = useState(null);

  // Symptoms state
  const [symptomText, setSymptomText] = useState("");
  const [selectedClimate, setSelectedClimate] = useState("coastal");
  const [selectedWilaya, setSelectedWilaya] = useState("16 - Alger");
  const [activeTags, setActiveTags] = useState([]);

  // Telemetry & progress
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStepTitle, setProgressStepTitle] = useState("");

  // Results state
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [routineMode, setRoutineMode] = useState("hybrid"); // 'hybrid' | 'inhouse'

  const radarCanvasRef = useRef(null);

  // The 8 Skincare Concerns (strictly non-medical)
  const QUICK_TAGS = [
    { id: "dry", label: { fr: "Peau Sèche (Dry)", en: "Dry Skin", dz: "بشرة جافة (Dry)" } },
    { id: "oily", label: { fr: "Peau Grasse (Oily)", en: "Oily Skin", dz: "بشرة دهنية (Oily)" } },
    { id: "mixed", label: { fr: "Peau Mixte (Mixed)", en: "Combination / Mixed Skin", dz: "بشرة مختلطة (Mixed)" } },
    { id: "tzone", label: { fr: "Zone T luisante (T-Zone)", en: "T-Zone Shine", dz: "منطقة T تبرق (T-Zone)" } },
    { id: "flaky", label: { fr: "Desquamée / Pèle (Flaky)", en: "Flaky / Peeling", dz: "بشرة تتقشر (Flaky)" } },
    { id: "sensitive", label: { fr: "Sensible / Réactive (Sensitive)", en: "Sensitive / Reactive", dz: "بشرة حساسة (Sensitive)" } },
    { id: "acneprone", label: { fr: "Tendance acnéique (Acne prone)", en: "Acne-prone", dz: "معرضة لحب الشباب (Acne prone)" } },
    { id: "enlargedpores", label: { fr: "Pores dilatés (Enlarged pores)", en: "Enlarged Pores", dz: "مسامات واسعة (Enlarged pores)" } }
  ];

  const handleTagToggle = (tagLabel) => {
    setActiveTags((prev) => {
      const exists = prev.includes(tagLabel);
      const updated = exists ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel];
      setSymptomText(updated.join(", "));
      return updated;
    });
  };

  // Safe camera stream cleanup
  const stopCameraStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.warn("Error stopping stream tracks", e);
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Stop camera when unmounting or switching to presets/symptoms
  useEffect(() => {
    if (activeTab !== "camera") {
      stopCameraStream();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Start Camera with user facing mode
  const handleStartCamera = async (targetFacing = facingMode) => {
    stopCameraStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        lang === "dz"
          ? "المتصفح لا يدعم الوصول المباشر للكاميرا. يمكنك تحميل صورة وجهك بدلاً من ذلك."
          : "L'accès à la caméra n'est pas pris en charge par ce navigateur ou nécessite une connexion sécurisée (HTTPS). Vous pouvez téléverser une photo."
      );
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: targetFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setFacingMode(targetFacing);
    } catch (err) {
      console.warn("Camera access failed", err);
      setIsCameraActive(false);
      let errMsg = lang === "dz"
        ? "تعذر تشغيل الكاميرا (يرجى السماح بالوصول في المتصفح أو اختيار صورة)."
        : "Accès à la caméra refusé ou périphérique indisponible. Vous pouvez téléverser une photo ou tester un profil type.";
      if (err.name === "NotAllowedError") {
        errMsg = lang === "dz"
          ? "تم حظر إذن الكاميرا. يرجى الضغط على القفل بجانب الرابط للسماح."
          : "Autorisation caméra refusée. Activez l'accès caméra dans les paramètres de votre navigateur.";
      }
      setCameraError(errMsg);
    }
  };

  // Switch between front and back camera
  const handleFlipCamera = () => {
    const nextFacing = facingMode === "user" ? "environment" : "user";
    handleStartCamera(nextFacing);
  };

  // Capture instant photo from video element
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedImage(dataUrl);
      stopCameraStream();
    } catch (e) {
      console.error("Error capturing frame", e);
    }
  };

  // Upload image from file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      stopCameraStream();
      setCameraError(null);
    };
    reader.readAsDataURL(file);
  };

  // Load a demo face immediately
  const handleSelectDemo = (presetKey) => {
    setSelectedPreset(presetKey);
    const p = CLINICAL_PRESETS[presetKey];
    if (p) {
      setCapturedImage(p.image);
      stopCameraStream();
      setCameraError(null);
    }
  };

  // Run Scan Pipeline
  const runDiagnostic = async (payload) => {
    if (isAnalyzing) return;

    // If camera is still actively running, snap it first
    if (isCameraActive && videoRef.current) {
      handleCaptureSnapshot();
    }

    setIsAnalyzing(true);
    setProgressPercent(15);
    setProgressStepTitle(lang === "dz" ? "معايرة الحساسات الضوئية..." : "Calibration des capteurs spectrophotométriques...");

    const stages = [
      { p: 35, t: lang === "dz" ? "قياس درجة ترطيب الخلايا والطبقة السطحية..." : "Cartographie de l'hydratation épidermique & éclat..." },
      { p: 65, t: lang === "dz" ? "حساب نسبة التبخر ومقاومة شمس الجزائر..." : "Calcul de l'évaporation TEWL sous bioclimat algérien..." },
      { p: 90, t: lang === "dz" ? "توليد الروتين الهجين المناسب لحالتك..." : "Formulation de votre routine experte ANJUCIA..." },
      { p: 100, t: lang === "dz" ? "اكتمل تحليل البشرة بنجاح !" : "Analyse de peau validée avec succès !" }
    ];

    for (const stage of stages) {
      await new Promise((r) => setTimeout(r, 480));
      setProgressPercent(stage.p);
      setProgressStepTitle(stage.t);
    }

    // Call mock API scan endpoint
    try {
      await mock.analyzer.scan({
        skinType: payload.mode === "preset" ? payload.presetId : symptomText,
        location: selectedWilaya,
        climate: selectedClimate,
        tags: activeTags
      });
    } catch {
      // Safe fallback handled within mockApi
    }

    let res;
    let faceImg = capturedImage || "/assets/preset-amina.svg";

    if (payload.mode === "preset") {
      const p = CLINICAL_PRESETS[payload.presetId] || CLINICAL_PRESETS.amina;
      faceImg = p.image;
      res = {
        scanId: "ANJ-ALG-" + Math.floor(100000 + Math.random() * 900000),
        profile: p,
        scannedFace: faceImg,
        hybridRoutine: p.hybridRoutine,
        inHouseRoutine: IN_HOUSE_ROUTINE_TEMPLATE,
        synergyInsights: p.synergyInsights
      };
    } else {
      const isSahara = selectedClimate === "sahara" || symptomText.toLowerCase().includes("sahara") || symptomText.toLowerCase().includes("شهيلي");
      const isOily = symptomText.toLowerCase().includes("gras") || symptomText.toLowerCase().includes("زيت") || symptomText.toLowerCase().includes("sebum");
      const presetRef = isSahara ? CLINICAL_PRESETS.karim : isOily ? CLINICAL_PRESETS.yasmine : CLINICAL_PRESETS.amina;

      res = {
        scanId: "ANJ-ALG-" + Math.floor(100000 + Math.random() * 900000),
        profile: {
          ...presetRef,
          name: lang === "dz" ? "تحليل فوتومتري مباشر" : "Profil Skincare Direct",
          location: `${selectedWilaya} (Algérie)`
        },
        scannedFace: faceImg,
        hybridRoutine: presetRef.hybridRoutine,
        inHouseRoutine: IN_HOUSE_ROUTINE_TEMPLATE,
        synergyInsights: presetRef.synergyInsights
      };
    }

    setDiagnosticResult(res);
    setIsAnalyzing(false);

    // Smooth scroll to results
    setTimeout(() => {
      const el = document.getElementById("resultsSection");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Draw 5-Axis Radar Chart on result or theme change
  useEffect(() => {
    if (!diagnosticResult || !radarCanvasRef.current) return;
    const canvas = radarCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = 340);
    const h = (canvas.height = 300);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 10;
    const radius = 100;
    const metrics = diagnosticResult.profile.radar;

    const axes = [
      { label: lang === "dz" ? "الترطيب" : "Hydratation", val: metrics.hydration },
      { label: lang === "dz" ? "الحاجز الدهني" : "Barrière Lipide", val: metrics.lipidBarrier },
      { label: lang === "dz" ? "مقاومة الجفاف" : "Résistance TEWL", val: metrics.tewlResistance },
      { label: lang === "dz" ? "توازن الزيوت" : "Équilibre Sébum", val: metrics.sebumBalance },
      { label: lang === "dz" ? "المرونة" : "Élasticité", val: metrics.elasticity }
    ];

    const totalAxes = axes.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Web background rings
    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(15, 23, 42, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes lines & labels
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(15, 23, 42, 0.16)";
      ctx.stroke();

      const lx = cx + Math.cos(angle) * (radius + 24);
      const ly = cy + Math.sin(angle) * (radius + 15);
      ctx.fillStyle = isDark ? "#CBD5E1" : "#334155";
      ctx.font = "bold 13px 'Zain', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(axis.label, lx, ly);
    });

    // Patient Metric Polygon
    ctx.beginPath();
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (axis.val / 100) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = accentGlow;
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // Vertex points
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (axis.val / 100) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    });
  }, [diagnosticResult, isDark, lang, colorPalette, accentColor, accentGlow]);

  return (
    <main style={{ paddingBottom: "5rem" }}>
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />

      {/* ── Analyzer Header Banner ───────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(165deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)", padding: "4rem 0 2.5rem", borderBottom: "1px solid var(--border-subtle)", position: "relative", overflow: "hidden" }}>
        
        {/* Decorative blur orb */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, var(--accent-aqua-glow) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div className="container">

          {/* Brand + title row */}
          <div className="scroll-reveal" style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", borderRadius: "14px", background: "var(--bg-card)", border: "1.5px solid var(--border-light)", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
              <img src="/assets/anjucia-symbol-aj.png" alt="Anjucia" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "var(--logo-filter, none)" }} />
            </div>
            <div className="section-header">
              <span className="section-tag">{t.analyzerPage.tag}</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.15, margin: 0 }} className="gsap-headline">
                {t.analyzerPage.title}
              </h1>
            </div>
          </div>

          <div className="scroll-reveal" style={{ maxWidth: "780px" }}>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              {t.analyzerPage.subtitle}
            </p>
          </div>

          {/* Info banners */}
          <div className="scroll-reveal-scale" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.9rem", marginTop: "1.5rem", maxWidth: "880px" }}>
            
            {/* Medical disclaimer */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.9rem 1.1rem", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "14px" }}>
              <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "#F59E0B" }}>{t.analyzerPage.medicalDisclaimerTitle}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.5 }}>{t.analyzerPage.medicalDisclaimerText}</div>
              </div>
            </div>

            {/* Confidentiality */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.9rem 1.1rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "14px" }}>
              <ShieldCheck size={20} color="var(--success)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>{t.analyzerPage.confidentialityTitle}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>{t.analyzerPage.confidentialityText}</div>
              </div>
            </div>

            {/* QR Subscription */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.9rem 1.1rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "14px" }}>
              <Sparkles size={20} color="var(--accent-aqua)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>{t.analyzerPage.qrSubscriptionTitle}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>{t.analyzerPage.qrSubscriptionText}</div>
              </div>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="scroll-reveal" style={{ marginTop: "1.6rem", maxWidth: "880px" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={15} color="var(--accent-aqua)" />
              <span>{t.analyzerPage.concernsTitle || "Sélectionnez votre type de peau & préoccupation :"}</span>
            </div>
            <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
              {QUICK_TAGS.map((tag) => {
                const tagText = tag.label[lang] || tag.label.fr;
                const isSelected = activeTags.includes(tagText);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tagText)}
                    className="magnetic-btn"
                    style={{ padding: "0.45rem 0.9rem", borderRadius: "var(--badge-radius)", fontSize: "0.8rem", fontWeight: 800, border: isSelected ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)", background: isSelected ? "var(--accent-aqua-subtle)" : "var(--bg-card)", color: isSelected ? "var(--accent-aqua)" : "var(--text-secondary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s ease", boxShadow: isSelected ? "var(--shadow-glow)" : "none" }}
                  >
                    {isSelected && <Check size={13} color="var(--accent-aqua)" />}
                    <span>{tagText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Navigation Tabs */}
          <div className="scroll-reveal" style={{ display: "flex", gap: "0.7rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
            {[
              { id: "camera", icon: <Camera size={17} />, label: lang === "dz" ? "الماسح الكاميرا" : "Scanner / Caméra" },
              { id: "presets", icon: <Users size={17} />, label: t.analyzerPage.quickPresets },
              { id: "symptoms", icon: <FileText size={17} />, label: lang === "dz" ? "الأعراض والمناخ" : "Questionnaire & Wilaya" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="magnetic-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.65rem 1.3rem", borderRadius: "var(--badge-radius)", fontSize: "0.86rem", fontWeight: 800, border: activeTab === tab.id ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)", background: activeTab === tab.id ? "var(--btn-gradient)" : "var(--bg-card)", color: activeTab === tab.id ? "#FFFFFF" : "var(--text-secondary)", cursor: "pointer", boxShadow: activeTab === tab.id ? "var(--shadow-glow)" : "none", transition: "all 0.25s ease" }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Interactive Workstation Panel */}
      <section className="container" style={{ paddingTop: "3rem" }}>
        <div className="scroll-reveal-scale" style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-light)", borderRadius: "var(--card-radius)", padding: "2.5rem", boxShadow: "var(--shadow-md)" }}>
          
          {/* TAB 1: High-Tech Optical Scanner View */}
          {activeTab === "camera" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Zap size={20} color="var(--accent-aqua)" />
                    <span>{lang === "dz" ? "فحص مباشر للوجه عبر الماسح" : "Scanner Spectrophotométrique DermoScan™"}</span>
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0.3rem 0 0" }}>
                    {lang === "dz" ? "الكاميرا تقيس توزيع الرطوبة والزيوت في الوجه ومقاومة شمس الجزائر." : "Cartographie optique haute résolution : Perte insensible en eau (TEWL), érythème et sébum."}
                  </p>
                </div>

                {/* Quick actions: Upload photo, flip camera, choose clinical sample */}
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--badge-radius)",
                      padding: "0.5rem 1rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <UploadCloud size={15} color="var(--accent-aqua)" />
                    <span>{lang === "dz" ? "تحميل صورة" : "Importer photo"}</span>
                  </button>

                  {isCameraActive && (
                    <button
                      onClick={handleFlipCamera}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--badge-radius)",
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}
                      title="Changer de caméra (Front/Back)"
                    >
                      <RefreshCw size={15} color="var(--accent-aqua)" />
                      <span>{lang === "dz" ? "قلب الكاميرا" : "Changer caméra"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Camera Error Alert if blocked */}
              {cameraError && (
                <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid var(--danger)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                  <AlertCircle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ flex: 1, fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                    <strong>{lang === "dz" ? "ملاحظة حول الكاميرا :" : "Notice d'accès optique :"}</strong> {cameraError}
                    <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleStartCamera()}
                        style={{ background: "var(--danger)", color: "#FFFFFF", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        {lang === "dz" ? "إعادة المحاولة" : "Réessayer la caméra"}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        {lang === "dz" ? "اختيار صورة من الهاتف" : "Téléverser une image"}
                      </button>
                      <button
                        onClick={() => handleSelectDemo("amina")}
                        style={{ background: "var(--accent-aqua-subtle)", color: "var(--accent-aqua)", border: "1px solid var(--accent-aqua)", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        {lang === "dz" ? "تجربة وجه سريري (أمينة)" : "Tester le profil témoin"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Scanner Viewfinder Box */}
              <div className="scanner-box" style={{ marginBottom: "1.5rem" }}>
                
                {/* 4 Viewfinder Corner Accents */}
                <div className="scanner-corner scanner-corner-tl" />
                <div className="scanner-corner scanner-corner-tr" />
                <div className="scanner-corner scanner-corner-bl" />
                <div className="scanner-corner scanner-corner-br" />

                {/* Matrix Grid Lines */}
                <div className="scanner-matrix-grid" />

                {/* Top HUD Telemetry */}
                <div className="scanner-hud-bar scanner-hud-top">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: isAnalyzing ? "var(--warning)" : "var(--accent-aqua)", display: "inline-block", boxShadow: "0 0 8px currentColor" }} />
                  <span>ANJUCIA OPTICAL DERMOSCAN™ 450-680nm</span>
                  <span style={{ opacity: 0.6 }}>•</span>
                  <span>{isCameraActive ? "LIVE FEED" : "CALIBRATED IMAGE"}</span>
                </div>

                {/* Bottom HUD Telemetry */}
                <div className="scanner-hud-bar scanner-hud-bottom">
                  <span>TEWL REFLECTANCE: 99.2%</span>
                  <span style={{ opacity: 0.6 }}>•</span>
                  <span>SPECTROPHOTOMETRY: READY</span>
                </div>

                {/* Laser Sweep & Radar Ring when Analyzing */}
                {isAnalyzing && (
                  <>
                    <div className="scanner-laser-line" />
                    <div className="scanner-radar-ring" />
                  </>
                )}

                {/* Oval Guide Overlay */}
                <div className="scanner-face-oval" />

                {/* Video Stream or Captured Preview */}
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src={capturedImage}
                      alt="Visage analysé"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />

                    {/* Bio-Points on the face */}
                    <div
                      className="biopoint-spot"
                      style={{ top: "32%", left: "50%" }}
                      onClick={() => setActiveBioPoint("Front : Perte Insensible en Eau")}
                    >
                      <div className="biopoint-dot" />
                      <div className="biopoint-tag">Front: TEWL 28 g/m²</div>
                    </div>

                    <div
                      className="biopoint-spot"
                      style={{ top: "52%", left: "35%" }}
                      onClick={() => setActiveBioPoint("Joue Gauche : Érythème Solaire")}
                    >
                      <div className="biopoint-dot" />
                      <div className="biopoint-tag">Joue G: Érythème UV</div>
                    </div>

                    <div
                      className="biopoint-spot"
                      style={{ top: "52%", left: "65%" }}
                      onClick={() => setActiveBioPoint("Joue Droite : Ciment Lipidique")}
                    >
                      <div className="biopoint-dot" />
                      <div className="biopoint-tag">Joue D: Lipides -38%</div>
                    </div>

                    <div
                      className="biopoint-spot"
                      style={{ top: "70%", left: "50%" }}
                      onClick={() => setActiveBioPoint("Zone T : Sébum & Pores")}
                    >
                      <div className="biopoint-dot" />
                      <div className="biopoint-tag">Zone T: Sébum 42%</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical Samples Row */}
              <div style={{ marginBottom: "1.8rem", background: "var(--bg-secondary)", borderRadius: "calc(var(--card-radius) / 1.5)", padding: "1rem", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={16} color="var(--accent-aqua)" />
                  <span>{lang === "dz" ? "أو جرّب أحد البروفايلات الجزائرية النموذجية :" : "Ou choisir un profil algérien type :"}</span>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {[
                    { key: "amina", label: "Amina (Alger • Déshydratée)", img: "/assets/preset-amina.svg" },
                    { key: "karim", label: "Karim (Sahara • Barrière)", img: "/assets/preset-karim.svg" },
                    { key: "yasmine", label: "Yasmine (Oran • Mixte/Grasse)", img: "/assets/preset-yasmine.svg" }
                  ].map((demo) => (
                    <button
                      key={demo.key}
                      onClick={() => handleSelectDemo(demo.key)}
                      style={{
                        background: capturedImage === demo.img ? "var(--accent-aqua-subtle)" : "var(--bg-card)",
                        border: capturedImage === demo.img ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                        borderRadius: "var(--badge-radius)",
                        padding: "0.45rem 0.9rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: capturedImage === demo.img ? "var(--accent-aqua)" : "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {demo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                {!isCameraActive ? (
                  <button
                    className="btn-aqua magnetic-btn"
                    style={{ padding: "0.95rem 2.2rem", fontSize: "1rem" }}
                    disabled={isAnalyzing}
                    onClick={() => runDiagnostic({ mode: "camera" })}
                  >
                    <Sparkles size={18} />
                    <span>{lang === "dz" ? "تحليل هذا الوجه الآن" : "Diagnostiquer ce Visage"}</span>
                  </button>
                ) : (
                  <button
                    className="btn-aqua magnetic-btn"
                    style={{ padding: "0.95rem 2.2rem", fontSize: "1rem" }}
                    onClick={handleCaptureSnapshot}
                  >
                    <Camera size={18} />
                    <span>{lang === "dz" ? "التقاط الصورة وفحصها" : "Capturer & Diagnostiquer"}</span>
                  </button>
                )}

                {!isCameraActive ? (
                  <button
                    className="btn-outline magnetic-btn"
                    style={{ padding: "0.95rem 1.8rem", fontSize: "0.92rem" }}
                    onClick={() => handleStartCamera()}
                  >
                    <Camera size={18} />
                    <span>{lang === "dz" ? "تشغيل الكاميرا المباشرة" : "Activer la Caméra Directe"}</span>
                  </button>
                ) : (
                  <button
                    className="btn-outline magnetic-btn"
                    style={{ padding: "0.95rem 1.8rem", fontSize: "0.92rem" }}
                    onClick={stopCameraStream}
                  >
                    <RotateCcw size={18} />
                    <span>{lang === "dz" ? "إيقاف الكاميرا" : "Fermer la caméra"}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Clinical Presets List */}
          {activeTab === "presets" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1rem" }}>
                {t.analyzerPage.quickPresets}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
                {[
                  { id: "amina", label: t.analyzerPage.profileAmina, icon: "💧", desc: "28 ans • Alger • Peau déshydratée" },
                  { id: "karim", label: t.analyzerPage.profileKarim, icon: "☀️", desc: "34 ans • Ghardaïa • Climat saharien" },
                  { id: "yasmine", label: t.analyzerPage.profileYasmine, icon: "🌊", desc: "23 ans • Oran • Mixte à grasse" },
                  { id: "nadia", label: t.analyzerPage.profileNadia, icon: "❄️", desc: "45 ans • Sétif • Haute altitude" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPreset(item.id)}
                    style={{
                      background: selectedPreset === item.id ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                      border: selectedPreset === item.id ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                      borderRadius: "calc(var(--card-radius) / 1.5)",
                      padding: "1.2rem",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="btn-aqua"
                style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}
                disabled={isAnalyzing}
                onClick={() => runDiagnostic({ mode: "preset", presetId: selectedPreset })}
              >
                <Play size={18} />
                <span>{lang === "dz" ? "ابدأ تحليل هذا البروفايل" : "Lancer l'Analyse de Peau"}</span>
              </button>
            </div>
          )}

          {/* TAB 3: Symptoms & Wilaya Questionnaire */}
          {activeTab === "symptoms" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1rem" }}>
                {lang === "dz" ? "حدد أعراض بشرتك وولايتك" : "Déclaration des Symptômes & Bioclimat"}
              </h3>

              {/* Quick symptom tags */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {QUICK_TAGS.map((tag) => {
                  const tagText = tag.label[lang] || tag.label.fr;
                  const isSelected = activeTags.includes(tagText);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tagText)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--badge-radius)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        border: isSelected ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                        background: isSelected ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                        color: isSelected ? "var(--accent-aqua)" : "var(--text-secondary)",
                        cursor: "pointer"
                      }}
                    >
                      {tagText}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.8rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                    {t.climate.selectWilaya}
                  </label>
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", background: "var(--bg-input)", border: "1px solid var(--border-light)", borderRadius: "calc(var(--card-radius) / 2)", color: "var(--text-primary)", fontSize: "0.9rem" }}
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                    {lang === "dz" ? "نوع المناخ في محيطك :" : "Environnement d'exposition :"}
                  </label>
                  <select
                    value={selectedClimate}
                    onChange={(e) => setSelectedClimate(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", background: "var(--bg-input)", border: "1px solid var(--border-light)", borderRadius: "calc(var(--card-radius) / 2)", color: "var(--text-primary)", fontSize: "0.9rem" }}
                  >
                    <option value="coastal">{lang === "dz" ? "ساحلي رطب (الجزائر، وهران، بجاية)" : "Littoral / Humide marin (Alger, Oran, Béjaïa)"}</option>
                    <option value="plateau">{lang === "dz" ? "هضاب عليا جافة وباردة (سطيف، قسنطينة)" : "Hauts Plateaux semi-arides (Sétif, Constantine)"}</option>
                    <option value="sahara">{lang === "dz" ? "صحراوي حار وشديد الجفاف (غرداية، ورقلة)" : "Sahara aride / Sirocco extrême (Biskra, Ghardaïa)"}</option>
                  </select>
                </div>
              </div>

              <button
                className="btn-aqua"
                style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}
                disabled={isAnalyzing}
                onClick={() => runDiagnostic({ mode: "symptoms" })}
              >
                <Play size={18} />
                <span>{lang === "dz" ? "ابدأ التحليل الدقيق" : "Formuler ma Routine Skincare"}</span>
              </button>
            </div>
          )}

          {/* Progress Bar with Technical Readouts while analyzing */}
          {isAnalyzing && (
            <div style={{ marginTop: "2rem", background: "var(--bg-secondary)", borderRadius: "calc(var(--card-radius) / 1.5)", padding: "1.5rem", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 800, color: "var(--accent-aqua)", marginBottom: "0.5rem" }}>
                <span>{progressStepTitle}</span>
                <span>{progressPercent}%</span>
              </div>
              <div style={{ height: "8px", background: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--btn-gradient)", transition: "width 0.3s ease", boxShadow: "var(--shadow-glow)" }} />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* RESULTS SECTION */}
      {diagnosticResult && (
        <section id="resultsSection" className="container" style={{ paddingTop: "4rem" }}>
          
          {/* Header Summary Card */}
          <div style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--accent-aqua)", borderRadius: "var(--card-radius)", padding: "2rem", marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-aqua)", textTransform: "uppercase" }}>
                {lang === "dz" ? "تقرير فحص البشرة المعتمد" : "Bilan Skincare Validé"} • ID: {diagnosticResult.scanId}
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.3rem 0" }}>
                {diagnosticResult.profile.name}
              </h2>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                {diagnosticResult.profile.location} • {diagnosticResult.profile.skinType}
              </div>
            </div>

            {/* Protocol Mode Toggle */}
            <div style={{ display: "flex", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--badge-radius)", padding: "4px" }}>
              <button
                onClick={() => setRoutineMode("hybrid")}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "calc(var(--badge-radius) - 2px)",
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  border: "none",
                  background: routineMode === "hybrid" ? "var(--btn-gradient)" : "transparent",
                  color: routineMode === "hybrid" ? "#FFFFFF" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {t.analyzerPage.switchHybrid}
              </button>
              <button
                onClick={() => setRoutineMode("inhouse")}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "calc(var(--badge-radius) - 2px)",
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  border: "none",
                  background: routineMode === "inhouse" ? "var(--btn-gradient)" : "transparent",
                  color: routineMode === "inhouse" ? "#FFFFFF" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {t.analyzerPage.switch100}
              </button>
            </div>
          </div>

          {/* Scanned Face & 5-Axis Radar Chart Side-by-Side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            
            {/* Analyzed Face & Heatmap */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius)", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span className="section-tag" style={{ margin: 0 }}>
                  {lang === "dz" ? "خريطة الحرارة ودرجة التحسس" : "Cartographie Optique"}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-aqua)", fontWeight: 800 }}>
                  TEWL: {diagnosticResult.profile.tewl}
                </span>
              </div>

              <div style={{ position: "relative", width: "100%", maxWidth: "280px", aspectRatio: "1 / 1", borderRadius: "calc(var(--card-radius) / 1.5)", overflow: "hidden", border: "2px solid var(--border-light)", margin: "0.5rem 0 1rem" }}>
                <img
                  src={diagnosticResult.scannedFace || diagnosticResult.profile.image}
                  alt={diagnosticResult.profile.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Hotspots from preset or defaults */}
                {(diagnosticResult.profile.heatmapSpots || [
                  { x: 50, y: 30, zone: "Front : Déshydratation", intensity: "medium" },
                  { x: 35, y: 50, zone: "Joue G : Érythème Solaire", intensity: "high" },
                  { x: 65, y: 50, zone: "Joue D : Barrière TEWL", intensity: "high" }
                ]).map((spot, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: `${spot.y}%`,
                      left: `${spot.x}%`,
                      transform: "translate(-50%, -50%)",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: spot.intensity === "critical" ? "var(--danger)" : "var(--accent-aqua)",
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 0 10px currentColor",
                      cursor: "pointer"
                    }}
                    title={spot.zone}
                  />
                ))}
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.45 }}>
                {diagnosticResult.profile.keyDeficit}
              </div>
            </div>

            {/* 5-Axis Radar Chart */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius)", padding: "2rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
              <span className="section-tag">{t.analyzerPage.radarTitle}</span>
              <div style={{ display: "flex", justifyContent: "center", margin: "0.8rem 0" }}>
                <canvas ref={radarCanvasRef} width={340} height={300} style={{ maxWidth: "100%" }} />
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                {lang === "dz" ? "مؤشر مقاومة التبخر TEWL ومستوى الترطيب العميق." : "Modélisation spectrophotométrique de la barrière cutanée."}
              </div>
            </div>

            {/* Diagnosis & Natural Synergy Insights */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--card-radius)", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "var(--shadow-sm)" }}>
              <div>
                <span className="section-tag" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)" }}>
                  {t.analyzerPage.savingsBadge}
                </span>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.6rem 0 0.8rem" }}>
                  {lang === "dz" ? "تحليل احتياجات البشرة :" : "Besoins Fondamentaux de la Peau :"}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
                  {diagnosticResult.profile.diagnosis}
                </p>

                <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--accent-aqua)", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                  {diagnosticResult.synergyInsights?.title || t.analyzerPage.synergyExplanation}
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", lineHeight: 1.55 }}>
                  {typeof diagnosticResult.synergyInsights === "string"
                    ? diagnosticResult.synergyInsights
                    : diagnosticResult.synergyInsights?.summary}
                </p>

                {diagnosticResult.synergyInsights?.costComparison && (
                  <div style={{ marginTop: "0.8rem", background: "var(--bg-secondary)", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.8rem", color: "var(--accent-aqua)", fontWeight: 700, border: "1px solid var(--border-subtle)" }}>
                    💡 {diagnosticResult.synergyInsights.costComparison}
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.2rem", marginTop: "1.5rem" }}>
                <button
                  className="btn-aqua magnetic-btn"
                  style={{ width: "100%", padding: "0.95rem" }}
                  onClick={() => addHybridHero(diagnosticResult.profile.primaryProduct?.id || "soothing-gel-cream")}
                >
                  <Droplets size={18} />
                  <span>
                    {t.analyzerPage.addAnjuciaStar} ({diagnosticResult.profile.primaryProduct?.priceDZD?.toLocaleString() || "1,500"} DZD)
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* PRESCRIPTION ROUTINE STEPS */}
          <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-light)", borderRadius: "var(--card-radius)", padding: "2.5rem", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="section-tag">
                  {routineMode === "hybrid" ? t.analyzerPage.switchHybrid : t.analyzerPage.switch100}
                </span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)", marginTop: "0.3rem" }}>
                  {t.analyzerPage.hybridRoutineTitle}
                </h3>
              </div>

              <button
                className="btn-aqua magnetic-btn"
                onClick={() => {
                  const routine = routineMode === "hybrid" ? diagnosticResult.hybridRoutine : diagnosticResult.inHouseRoutine;
                  addPrescriptionBundle(routine);
                }}
              >
                <ShoppingBag size={18} />
                <span>{t.analyzerPage.addFullRoutine}</span>
              </button>
            </div>

            {/* Routine Steps Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              {(routineMode === "hybrid" ? diagnosticResult.hybridRoutine : diagnosticResult.inHouseRoutine).map((step, idx) => {
                const isAnjucia = step.isOurProduct || step.isAnjucia;
                const prodName = step.product || step.name;
                const roleDesc = step.type || step.phase || step.role;
                const actionDesc = step.action || step.instruction;
                const priceFormatted = step.priceDZD ? `${step.priceDZD.toLocaleString()} DZD` : (step.priceEst || "—");

                return (
                  <div
                    key={idx}
                    style={{
                      background: isAnjucia ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                      border: isAnjucia ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                      borderRadius: "calc(var(--card-radius) / 1.3)",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative"
                    }}
                  >
                    {isAnjucia && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: isRTL ? "auto" : "12px",
                          left: isRTL ? "12px" : "auto",
                          background: "var(--accent-aqua)",
                          color: "#06111C",
                          fontSize: "0.68rem",
                          fontWeight: 900,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "var(--badge-radius)"
                        }}
                      >
                        ANJUCIA FLAGSHIP
                      </span>
                    )}

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase" }}>
                        {step.step ? `ÉTAPE ${step.step}` : `ÉTAPE ${idx + 1}`} • {step.brand}
                      </div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.3rem 0" }}>
                        {prodName}
                      </h4>
                      <div style={{ fontSize: "0.8rem", color: "var(--accent-aqua)", fontWeight: 700, marginBottom: "0.6rem" }}>
                        {roleDesc}
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                        {actionDesc}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)" }}>
                        {priceFormatted}
                      </div>
                      {isAnjucia && (
                        <button
                          className="btn-aqua magnetic-btn"
                          style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem" }}
                          onClick={() => addHybridHero(step.ourProductId || step.productId || "soothing-gel-cream")}
                        >
                          {t.hero.addToCart}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </section>
      )}
    </main>
  );
}
