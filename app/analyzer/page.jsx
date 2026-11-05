"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  ShieldCheck,
  Sparkles,
  Droplets,
  Sun,
  Wind,
  AlertTriangle,
  Check,
  CheckCircle2,
  ShoppingBag,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  X,
  Loader2,
  Activity,
  FlaskConical,
  TrendingUp,
  Trash2,
  MapPin,
  Sliders,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { ALGERIAN_WILAYAS } from "../data/products";
import { getLiveAnjuciaCatalog, classifyWilayaClimate } from "../utils/catalogSync";
import { useAnjuciaSkinMemory } from "../hooks/useAnjuciaSkinMemory";

const UI_TEXT = {
  fr: {
    tag: "DERMOSCAN AI™ STATION • TÉLÉMÉTRIE CLINIQUE 58 WILAYAS",
    title: "DermoScan AI™ Station",
    subtitle:
      "Diagnostic biophotonique & biochimique assisté par IA, calibré pour les réalités climatiques algériennes (Eau calcaire, Humidité côtière, Hauts Plateaux & Sirocco saharien).",
    modeCamera: "Mode Caméra Biophotonique",
    modeFallback: "Diagnostic Sans Caméra",
    ephemeralBadge: "🔒 Traitement éphémère sécurisé — Aucune photo n'est stockée sur nos serveurs.",
    startCamera: "Activer la Caméra Clinique",
    captureBtn: "Capturer & Analyser (3 Zones)",
    retakeBtn: "Nouvelle Capture",
    cropToggleLabel: "Inclure les patchs haute résolution Zone T (Front) & Zone U (Joues) (< 250 Ko)",
    lightOptimal: "Éclairage optimal",
    lightTooDark: "Rapprochez-vous d'une source de lumière",
    lightTooBright: "Surexposition — Éloignez légèrement la source lumineuse",
    lightWaiting: "Calibration optique en cours...",
    tZoneGuide: "ZONE T • FRONT & NEZ",
    uZoneGuide: "ZONE U • JOUES & BARRIÈRE",
    wilayaLabel: "1. Votre Wilaya (Calibrage Bioclimatique & Dureté de l'Eau)",
    tZoneLabel: "2. Brillance Sébacée sur la Zone T (Front / Nez)",
    tZoneOptions: [
      { value: "low", label: "Faible / Mate toute la journée" },
      { value: "moderate", label: "Modérée en milieu d'après-midi" },
      { value: "high", label: "Forte brillance & pores dilatés" }
    ],
    cheekLabel: "3. Tiraillement des Joues après lavage à l'eau du robinet",
    cheekOptions: [
      { value: "none", label: "Aucun tiraillement (Confortable)" },
      { value: "mild", label: "Léger tiraillement passager" },
      { value: "severe", label: "Tiraillement marqué / Peau qui pèle ou chauffe" }
    ],
    rednessLabel: "4. Rougeurs & Réactivité Thermique / Solaire",
    rednessOptions: [
      { value: "none", label: "Aucune rougeur visible" },
      { value: "mild", label: "Rougeurs diffuses aux changements de température" },
      { value: "high", label: "Rougeurs persistantes & échauffements fréquents" }
    ],
    routineLabel: "5. Produits actuels ou recettes maison utilisés (Optionnel — Détection des conflits pH)",
    routinePlaceholder: "Ex: Savon de Marseille, eau de rose, jus de citron, gommage grain, gel nettoyant...",
    runScanBtn: "Lancer la Consultation DermoScan AI™",
    scanningStatus: "Analyse télémétrique & biochimique en cours...",
    telemetryTitle: "1. Télémétrie Clinique Cutanée",
    hydrationLabel: "Score d'Hydratation",
    barrierLabel: "Intégrité Barrière",
    sebumLabel: "Sébum Zone T",
    rednessStatLabel: "Indice Rougeurs",
    tZoneObsTitle: "Observation Zone T (Front & Nez)",
    cheeksObsTitle: "Observation Zone U (Joues & Contour)",
    prescriptionTitle: "2. Prescription Dynamique Anjucia",
    synergyTitle: "3. Synergie Biochimique Naturelle",
    guardrailTitle: "4. Analyse des Conflits de Routine & pH",
    amApplication: "Protocole Matin (AM)",
    pmApplication: "Protocole Soir (PM)",
    addRoutineBtn: "Ajouter ma routine au panier - Paiement à la livraison 58 Wilayas",
    addSingleBtn: "Ajouter au Panier",
    inStockBadge: "DISPONIBLE IMMÉDIATEMENT",
    preOrderBadge: "PRÉ-COMMANDE",
    activeMoleculeLabel: "Molécule Active",
    protocolTimingLabel: "Protocole d'Application",
    safeReplacementLabel: "Alternative Physiologique Sécurisée",
    chatTitle: "Suivi Dermatologique & Mémoire Cutanée Continue",
    chatSub:
      "Posez une question sur votre protocole ou partagez le ressenti de votre peau. DermoScan AI™ mémorise vos retours pour personnaliser vos prochains suivis.",
    chatPlaceholder: "Ex: Ma peau tire moins sur les joues aujourd'hui, puis-je appliquer l'infusion de thé vert ce soir ?",
    chatSend: "Envoyer",
    memoryTitle: "Mémoire Clinique Enregistrée (Appareil Local)",
    clearMemory: "Réinitialiser l'historique",
    scansCountLabel: "Scans effectués",
    comingSoonTag: "EN COURS DE DÉPLOIEMENT • PHASE DE FORMULATION CLINIQUE",
    comingSoonTitle: "DermoScan AI™ Station arrive prochainement",
    comingSoonSubtitle:
      "La première station clinique d'analyse biophotonique et d'adaptation bioclimatique pour les 58 Wilayas algériennes est actuellement en phase de calibrage et réservée aux tests dermatologiques.",
    comingSoonFeature1Title: "Cartographie 3 Zones Haute Précision",
    comingSoonFeature1Desc:
      "Analyse télémétrique du front (Zone T) et des joues (Zone U) avec détection du stress cutané, tiraillement et rougeurs.",
    comingSoonFeature2Title: "Bioclimat 58 Wilayas & Eau Calcaire",
    comingSoonFeature2Desc:
      "Ajustement selon les agressions locales : humidité côtière, froid sec des hauts plateaux, sirocco saharien et eau dure.",
    comingSoonFeature3Title: "Synergies Naturelles & Détection Conflits pH",
    comingSoonFeature3Desc:
      "Prescription d'actifs purs combinés aux bio-actifs locaux (thé vert EGCG, avoine, hydrolats) et neutralisation des fausses recettes maison.",
    waitlistBadge: "LISTE D'ATTENTE PRIORITAIRE",
    waitlistTitle: "Soyez informé(e) en avant-première dès l'ouverture officielle",
    waitlistDesc: "Laissez votre contact pour recevoir une invitation prioritaire dès l'ouverture publique de la station.",
    waitlistPlaceholder: "Votre numéro de téléphone (05/06/07) ou e-mail",
    waitlistBtn: "Rejoindre la liste d'attente",
    waitlistSuccess: "Inscription validée ! Vous recevrez une invitation prioritaire dès l'ouverture officielle.",
    waitlistError: "Veuillez renseigner un numéro de téléphone algérien ou un e-mail valide.",
    labUnlockBtn: "Accès Laboratoire / Déverrouiller",
    labUnlockModalTitle: "Accès Laboratoire DermoScan AI™",
    labUnlockModalDesc:
      "Veuillez saisir le mot de passe d'accès réservé pour déverrouiller la station de diagnostic en avant-première.",
    labPasswordLabel: "Mot de passe d'accès",
    labPasswordPlaceholder: "Entrez le mot de passe...",
    labUnlockSubmit: "Déverrouiller la Station",
    labUnlockClose: "Fermer",
    labUnlockedBanner: "Session Laboratoire Active • DermoScan AI™ Déverrouillé",
    labRelockBtn: "Reverrouiller"
  },
  en: {
    tag: "DERMOSCAN AI™ STATION • 58-WILAYA CLINICAL TELEMETRY",
    title: "DermoScan AI™ Station",
    subtitle:
      "AI-assisted biophotonic & biochemical skin diagnostic calibrated for Algerian climate conditions (Hard calcareous water, Coastal humidity, High Plateau & Saharan Sirocco).",
    modeCamera: "Biophotonic Camera Mode",
    modeFallback: "Camera-Free Diagnostic",
    ephemeralBadge: "🔒 Secure Ephemeral Processing — No photo is stored on our servers.",
    startCamera: "Enable Clinical Camera",
    captureBtn: "Capture & Analyze (3 Zones)",
    retakeBtn: "Retake Capture",
    cropToggleLabel: "Include high-res T-Zone (Forehead) & U-Zone (Cheeks) crop patches (< 250 KB)",
    lightOptimal: "Éclairage optimal (Optimal Lighting)",
    lightTooDark: "Rapprochez-vous d'une source de lumière (Move closer to light)",
    lightTooBright: "Overexposed — Step slightly back from bright light",
    lightWaiting: "Optical calibration in progress...",
    tZoneGuide: "T-ZONE • FOREHEAD & NOSE",
    uZoneGuide: "U-ZONE • CHEEKS & BARRIER",
    wilayaLabel: "1. Your Wilaya (Bioclimatic & Water Hardness Calibration)",
    tZoneLabel: "2. T-Zone Sebum Shine (Forehead / Nose)",
    tZoneOptions: [
      { value: "low", label: "Low / Matte all day" },
      { value: "moderate", label: "Moderate shine by mid-afternoon" },
      { value: "high", label: "High shine & visible pores" }
    ],
    cheekLabel: "3. Cheek Tightness after washing with tap water",
    cheekOptions: [
      { value: "none", label: "No tightness (Comfortable)" },
      { value: "mild", label: "Mild temporary tightness" },
      { value: "severe", label: "Marked tightness / Flaking or burning sensation" }
    ],
    rednessLabel: "4. Redness & Thermal / Sun Reactivity",
    rednessOptions: [
      { value: "none", label: "No visible redness" },
      { value: "mild", label: "Mild flushing with temperature shifts" },
      { value: "high", label: "Persistent redness & frequent heat sensitivity" }
    ],
    routineLabel: "5. Current products or DIY remedies used (Optional — pH Conflict Guardrail)",
    routinePlaceholder: "E.g., Savon de Marseille, rose water, lemon juice, physical scrub, foaming cleanser...",
    runScanBtn: "Launch DermoScan AI™ Consultation",
    scanningStatus: "Running telemetric & biochemical analysis...",
    telemetryTitle: "1. Clinical Skin Telemetry",
    hydrationLabel: "Hydration Score",
    barrierLabel: "Barrier Integrity",
    sebumLabel: "T-Zone Sebum",
    rednessStatLabel: "Redness Index",
    tZoneObsTitle: "T-Zone Observation (Forehead & Nose)",
    cheeksObsTitle: "U-Zone Observation (Cheeks & Contour)",
    prescriptionTitle: "2. Dynamic Anjucia Prescription",
    synergyTitle: "3. Ubiquitous Natural Biochemical Synergies",
    guardrailTitle: "4. Routine Conflict & DIY Myth Guardrail",
    amApplication: "Morning Protocol (AM)",
    pmApplication: "Evening Protocol (PM)",
    addRoutineBtn: "Ajouter ma routine au panier - Paiement à la livraison 58 Wilayas",
    addSingleBtn: "Add to Cart",
    inStockBadge: "IN STOCK NOW",
    preOrderBadge: "PRE-ORDER",
    activeMoleculeLabel: "Active Molecule",
    protocolTimingLabel: "Application Protocol",
    safeReplacementLabel: "Safe Physiological Replacement",
    chatTitle: "Follow-Up Consultation & Long-Term Skin Memory",
    chatSub:
      "Ask a follow-up question or log how your skin feels today. DermoScan AI™ remembers your progress locally for future scans.",
    chatPlaceholder: "E.g., My cheeks feel less tight today, can I use the cold green tea compress tonight?",
    chatSend: "Send",
    memoryTitle: "Saved Clinical Memory (Local Device)",
    clearMemory: "Reset History",
    scansCountLabel: "Completed scans",
    comingSoonTag: "COMING SOON • CLINICAL FORMULATION PHASE",
    comingSoonTitle: "DermoScan AI™ Station is Coming Soon",
    comingSoonSubtitle:
      "The first clinical biophotonic and bioclimatic skin diagnostic station calibrated for all 58 Algerian Wilayas is currently undergoing calibration and restricted to laboratory testing.",
    comingSoonFeature1Title: "High-Precision 3-Zone Mapping",
    comingSoonFeature1Desc:
      "Telemetric scanning of the forehead (T-Zone) and cheeks (U-Zone) detecting barrier stress, dryness, and redness.",
    comingSoonFeature2Title: "58-Wilaya Bioclimate & Hard Water",
    comingSoonFeature2Desc:
      "Physiological tuning for local climate stressors: coastal humidity, continental high plateaus, Saharan sirocco, and hard water.",
    comingSoonFeature3Title: "Natural Synergies & pH Conflict Guardrail",
    comingSoonFeature3Desc:
      "Prescription of pure actives paired with local botanical treasures (EGCG green tea, colloidal oat, hydrolats) and replacement of caustic DIY recipes.",
    waitlistBadge: "PRIORITY WAITLIST",
    waitlistTitle: "Get notified first when the station goes live",
    waitlistDesc: "Leave your contact details to receive an exclusive priority invitation to the public launch.",
    waitlistPlaceholder: "Phone number (05/06/07) or email address",
    waitlistBtn: "Join Priority Waitlist",
    waitlistSuccess: "You're registered! You will receive priority access when DermoScan AI™ opens publicly.",
    waitlistError: "Please enter a valid Algerian phone number or email address.",
    labUnlockBtn: "Lab Access / Unlock Station",
    labUnlockModalTitle: "DermoScan AI™ Laboratory Access",
    labUnlockModalDesc:
      "Enter the laboratory access password to unlock the diagnostic station in preview mode.",
    labPasswordLabel: "Access Password",
    labPasswordPlaceholder: "Enter password...",
    labUnlockSubmit: "Unlock Station",
    labUnlockClose: "Cancel",
    labUnlockedBanner: "Active Laboratory Session • DermoScan AI™ Unlocked",
    labRelockBtn: "Relock Station"
  },
  dz: {
    tag: "DERMOSCAN AI™ STATION • التشخيص العيادي الذكي عبر 58 ولاية",
    title: "DermoScan AI™ Station",
    subtitle:
      "فحص بيومتري وبيوكيميائي للبشرة بالذكاء الاصطناعي، مبرمج خصيصاً لمناخ ولايات الجزائر (الماء الكلسي، الرطوبة الساحلية، الهضاب العليا والشهيلي الصحراوي).",
    modeCamera: "فحص بالكاميرا الذكية",
    modeFallback: "Diagnostic Sans Caméra (فحص بدون كاميرا)",
    ephemeralBadge: "🔒 Traitement éphémère sécurisé — Aucune photo n'est stockée sur nos serveurs.",
    startCamera: "تشغيل الكاميرا الفاحصة",
    captureBtn: "التقاط وتحليل (3 مناطق)",
    retakeBtn: "إعادة الالتقاط",
    cropToggleLabel: "إرفاق صور مكبرة لمنطقة الجبين (T-Zone) والخدود (U-Zone) (< 250 KB)",
    lightOptimal: "Éclairage optimal (إضاءة ممتازة)",
    lightTooDark: "Rapprochez-vous d'une source de lumière (اقترب من مصدر إضاءة)",
    lightTooBright: "إضاءة قوية جداً — ابتعد قليلاً عن الضوء المباشر",
    lightWaiting: "جاري معايرة الإضاءة...",
    tZoneGuide: "ZONE T • الجبين والأنف",
    uZoneGuide: "ZONE U • الخدود والحاجز الجلدي",
    wilayaLabel: "1. ولايتك (معايرة المناخ وملوحة/كلس الماء)",
    tZoneLabel: "2. لمعان الزيوت في منطقة T (الجبين والأنف)",
    tZoneOptions: [
      { value: "low", label: "قليل / بشرة غير لامعة طوال اليوم" },
      { value: "moderate", label: "لمعان متوسط في منتصف النهار" },
      { value: "high", label: "لمعان قوي ومسامات واضحة" }
    ],
    cheekLabel: "3. شد أو جفاف الخدود بعد الغسل بماء الحنفية",
    cheekOptions: [
      { value: "none", label: "لا يوجد شد (بشرة مرتاحة)" },
      { value: "mild", label: "شد خفيف ومؤقت" },
      { value: "severe", label: "شد قوي أو تقشر واحمرار بعد الغسل" }
    ],
    rednessLabel: "4. الاحمرار والحساسية للحرارة والشمس",
    rednessOptions: [
      { value: "none", label: "لا يوجد احمرار" },
      { value: "mild", label: "احمرار خفيف مع تغير الجو" },
      { value: "high", label: "احمرار مستمر وسخونة في الوجه" }
    ],
    routineLabel: "5. المنتجات أو الخلطات المنزلية المستعملة حالياً (اختياري — لكشف تعارض الـ pH)",
    routinePlaceholder: "مثال: صابون طرف (مرسيليا)، ماء الورد، الليمون، مقشر حبيبات، بيكربونات...",
    runScanBtn: "بدء التشخيص الذكي DermoScan AI™",
    scanningStatus: "جاري التحليل البيومتري والبيوكيميائي...",
    telemetryTitle: "1. القياسات العيادية للبشرة",
    hydrationLabel: "نسبة الترطيب",
    barrierLabel: "قوة الحاجز الجلدي",
    sebumLabel: "إفرازات منطقة T",
    rednessStatLabel: "مؤشر الاحمرار",
    tZoneObsTitle: "ملاحظات منطقة T (الجبين والأنف)",
    cheeksObsTitle: "ملاحظات منطقة U (الخدود)",
    prescriptionTitle: "2. وصفة Anjucia المخصصة لك",
    synergyTitle: "3. Synergie Biochimique Naturelle (التناغم الطبيعي الآمن)",
    guardrailTitle: "4. تنبيهات تعارض الروتين والخلطات المنزلية",
    amApplication: "طريقة الاستعمال صباحاً (AM)",
    pmApplication: "طريقة الاستعمال مساءً (PM)",
    addRoutineBtn: "Ajouter ma routine au panier - Paiement à la livraison 58 Wilayas",
    addSingleBtn: "أضف إلى السلة",
    inStockBadge: "متوفر حالياً",
    preOrderBadge: "طلب مسبق",
    activeMoleculeLabel: "الجزيء الفعال",
    protocolTimingLabel: "بروتوكول التطبيق",
    safeReplacementLabel: "البديل الصحي الآمن",
    chatTitle: "المتابعة الذكية وذاكرة البشرة المستمرة",
    chatSub:
      "اطرح أي سؤال حول روتينك أو شاركنا كيفاش تحس بشرتك اليوم. النظام يحفظ تطور بشرتك محلياً للمرات القادمة.",
    chatPlaceholder: "مثال: اليوم خدودي ما راهمش مشدودين بزاف، نقدر ندير كمادات الشاي الأخضر البارد الليلة؟",
    chatSend: "إرسال",
    memoryTitle: "الذاكرة العيادية المحفوظة",
    clearMemory: "مسح السجل",
    scansCountLabel: "عدد الفحوصات",
    comingSoonTag: "قريباً • مرحلة التطوير والضبط المخبري",
    comingSoonTitle: "محطة DermoScan AI™ قادمة قريباً",
    comingSoonSubtitle:
      "أول محطة تشخيص بيومتري وبيوكيميائي للبشرة مخصصة لولايات الجزائر الـ 58 (الماء الكلسي، رطوبة الساحل، الهضاب والشهيلي الصحراوي)، مخصصة حالياً للتجارب المخبرية.",
    comingSoonFeature1Title: "مسح ثلاثي الأبعاد عالي الدقة",
    comingSoonFeature1Desc:
      "تحليل دقيق لمنطقة T (الجبين والأنف) ومنطقة U (الخدود) للكشف عن جفاف الحاجز الجلدي والاحمرار.",
    comingSoonFeature2Title: "معايرة مناخ 58 ولاية والماء الكلسي",
    comingSoonFeature2Desc:
      "ضبط البروتوكول حسب مناخ ولايتك: الرطوبة الساحلية، جفاف الهضاب العليا، حرارة الشهيلي وملوحة الماء.",
    comingSoonFeature3Title: "تكامل طبيعي ومنع تعارضات الـ pH",
    comingSoonFeature3Desc:
      "توليفات علمية مع المكونات الطبيعية المتوفرة في البيت الجزائري (مغلي الشاي الأخضر EGCG، دقيق الشوفان، مقطرات الورد).",
    waitlistBadge: "قائمة الانتظار الأولوية",
    waitlistTitle: "كوني أول من يستفيد من الفحص عند الإطلاق الرسمي",
    waitlistDesc: "سجلي رقم هاتفك أو بريدك الإلكتروني ليصلك رابط الفحص فور افتتاحه للعموم.",
    waitlistPlaceholder: "رقم الهاتف (05/06/07) أو البريد الإلكتروني",
    waitlistBtn: "الانضمام لقائمة الانتظار",
    waitlistSuccess: "تم تسجيلك بنجاح! سنقوم بإشعارك بالأولوية فور فتح المحطة.",
    waitlistError: "يرجى إدخال رقم هاتف جزائري أو بريد إلكتروني صحيح.",
    labUnlockBtn: "ولوج المخبر / فتح القفل",
    labUnlockModalTitle: "ولوج مخبر DermoScan AI™",
    labUnlockModalDesc:
      "أدخلي كلمة سر المخبر لفتح محطة الفحص الذكي في النسخة التجريبية الحصرية.",
    labPasswordLabel: "كلمة السر",
    labPasswordPlaceholder: "أدخل كلمة المرور...",
    labUnlockSubmit: "تأكيد وفتح المحطة",
    labUnlockClose: "إلغاء",
    labUnlockedBanner: "جلسة مخبرية مفعّلة • محطة DermoScan AI™ مفتوحة",
    labRelockBtn: "إعادة القفل"
  }
};

export default function AnalyzerPage() {
  const { lang } = useLanguage();
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const t = UI_TEXT[lang] || (lang === "ar" ? UI_TEXT.dz : UI_TEXT.fr);

  // Persistent localStorage Skin Memory Hook
  const {
    profile,
    isLoaded: memoryLoaded,
    recordScan,
    appendMemories,
    updateWilaya,
    removeMemory,
    clearProfile,
    progressComparison
  } = useAnjuciaSkinMemory();

  // Mode: "camera" | "fallback"
  const [scanMode, setScanMode] = useState("camera");

  // Camera & Real-time Luminance/Contrast State
  const videoRef = useRef(null);
  const analysisCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const calibrationFormRef = useRef(null);
  const resultsSectionRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [lightingStats, setLightingStats] = useState({
    luminance: 0,
    contrast: 0,
    sharpnessOk: false,
    status: "waiting" // "waiting" | "too_dark" | "too_bright" | "optimal"
  });
  const [includeZoneCrops, setIncludeZoneCrops] = useState(true);
  const [capturedImages, setCapturedImages] = useState(null); // { fullFrameBase64, foreheadPatchBase64, cheeksPatchBase64, payloadSizeKB, previewUrl }
  const [ephemeralStopped, setEphemeralStopped] = useState(false);

  // Questionnaire & Wilaya State
  const [wilaya, setWilaya] = useState("16 - Alger");
  const [tZoneShine, setTZoneShine] = useState("moderate");
  const [cheekTightness, setCheekTightness] = useState("mild");
  const [redness, setRedness] = useState("mild");
  const [currentRoutineInput, setCurrentRoutineInput] = useState("");

  // Live Catalog State (synced with /admin overrides)
  const [liveCatalog, setLiveCatalog] = useState(() => getLiveAnjuciaCatalog());

  // Consultation Result & Loading State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [activeModelUsed, setActiveModelUsed] = useState("");

  // Follow-up Chat State
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  // Coming Soon & Lab Access Gate State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isSubmittingUnlock, setIsSubmittingUnlock] = useState(false);
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [waitlistInput, setWaitlistInput] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [waitlistMsg, setWaitlistMsg] = useState("");

  // Check initial DermoScan unlock status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/dermoscan/auth", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setIsUnlocked(Boolean(json?.unlocked));
          }
        }
      } catch {
        // Defaults to locked
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUnlockSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!unlockPassword.trim() || isSubmittingUnlock) return;
    setIsSubmittingUnlock(true);
    setUnlockError("");

    try {
      const res = await fetch("/api/dermoscan/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: unlockPassword.trim() })
      });
      const json = await res.json();
      if (res.ok && json.unlocked) {
        setIsUnlocked(true);
        setIsUnlockModalOpen(false);
        setUnlockPassword("");
        showToast?.(
          lang === "dz" || lang === "ar"
            ? "تم تفعيل محطة DermoScan AI™ بنجاح 🔓"
            : lang === "en"
            ? "DermoScan AI™ Station Unlocked 🔓"
            : "Station DermoScan AI™ déverrouillée avec succès 🔓",
          "success"
        );
      } else {
        setUnlockError(
          json?.error ||
            (lang === "dz"
              ? "كلمة المرور غير صحيحة."
              : lang === "en"
              ? "Incorrect access password."
              : "Mot de passe d'accès incorrect.")
        );
      }
    } catch {
      setUnlockError(
        lang === "dz"
          ? "تعذر الاتصال بخادم التحقق."
          : lang === "en"
          ? "Network error while checking password."
          : "Erreur de connexion au serveur d'authentification."
      );
    } finally {
      setIsSubmittingUnlock(false);
    }
  };

  const handleRelock = async () => {
    try {
      await fetch("/api/dermoscan/auth", { method: "DELETE" });
    } catch {}
    setIsUnlocked(false);
    stopCameraStream();
    showToast?.(
      lang === "dz" || lang === "ar"
        ? "تم إعادة قفل المحطة"
        : lang === "en"
        ? "Station Relocked"
        : "Station DermoScan reverrouillée",
      "info"
    );
  };

  const handleWaitlistSubmit = async (e) => {
    if (e) e.preventDefault();
    const contact = waitlistInput.trim();
    if (!contact) {
      setWaitlistMsg(t.waitlistError);
      setWaitlistStatus("error");
      return;
    }

    setWaitlistStatus("loading");
    setWaitlistMsg("");
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead",
          payload: {
            contact,
            productName: "DermoScan AI™ Station - Early Access",
            source: "dermoscan_coming_soon",
            notes: `Wilaya selected: ${wilaya}`
          }
        })
      });

      if (res.ok) {
        setWaitlistStatus("success");
        setWaitlistMsg(t.waitlistSuccess);
        setWaitlistInput("");
      } else {
        setWaitlistStatus("error");
        setWaitlistMsg(t.waitlistError);
      }
    } catch {
      setWaitlistStatus("error");
      setWaitlistMsg(t.waitlistError);
    }
  };

  // Sync saved Wilaya once memory loads
  useEffect(() => {
    if (memoryLoaded && profile?.wilaya) {
      setWilaya(profile.wilaya);
    }
  }, [memoryLoaded, profile?.wilaya]);

  // Keep live catalog synced with Node.js + MongoDB /api/store
  const refreshLiveCatalog = useCallback((serverProducts = null) => {
    const fresh = getLiveAnjuciaCatalog(
      serverProducts ? { products: serverProducts } : null
    );
    setLiveCatalog(fresh);
    return fresh;
  }, []);

  useEffect(() => {
    refreshLiveCatalog();
    fetch("/api/store")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data?.products) && json.data.products.length > 0) {
          refreshLiveCatalog(json.data.products);
        }
      })
      .catch(() => {});
  }, [refreshLiveCatalog]);

  // Stop camera stream helper (strictly enforces stream.getTracks().forEach(t => t.stop()))
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Ensure camera is stopped on unmount or mode switch
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Bind stream to <video> element as soon as it mounts or updates across PC / Mobile
  const bindStreamToVideoElement = useCallback(async (videoEl, mediaStream) => {
    if (!videoEl || !mediaStream) return;
    try {
      if (videoEl.srcObject !== mediaStream) {
        videoEl.srcObject = mediaStream;
      }
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute("playsinline", "true");
      videoEl.setAttribute("webkit-playsinline", "true");
      videoEl.setAttribute("autoplay", "true");
      await videoEl.play();
    } catch (_) {
      // Fallback: play on loadedmetadata if immediate play was deferred
      videoEl.onloadedmetadata = () => {
        videoEl.play().catch(() => {});
      };
    }
  }, []);

  // Callback ref so that as soon as React mounts <video>, the active stream is attached immediately
  const setVideoElementRef = useCallback(
    (node) => {
      videoRef.current = node;
      if (node && streamRef.current) {
        bindStreamToVideoElement(node, streamRef.current);
      }
    },
    [bindStreamToVideoElement]
  );

  // Also ensure stream is bound whenever cameraActive flips to true
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      bindStreamToVideoElement(videoRef.current, streamRef.current);
    }
  }, [cameraActive, bindStreamToVideoElement]);

  // Start Live Camera Stream with Cross-Device Fallback (PC USB/Integrated Webcams, iOS Safari, Android Chrome)
  const startCamera = async (overrideDeviceId = null) => {
    setCameraError("");
    setEphemeralStopped(false);
    setCapturedImages(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "L'accès caméra n'est pas disponible sur ce navigateur. Basculez vers le mode « Diagnostic Sans Caméra »."
      );
      setScanMode("fallback");
      return;
    }

    // Stop any previous stream before opening a new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const targetDeviceId =
      typeof overrideDeviceId === "string" ? overrideDeviceId : selectedDeviceId;

    // Progressive constraint tiers so PC webcams (16:9 / 4:3) and mobile selfie cameras never fail or show black
    const constraintCandidates = [
      targetDeviceId
        ? {
            video: {
              deviceId: { exact: targetDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          }
        : {
            video: {
              facingMode: { ideal: "user" },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          },
      {
        video: {
          facingMode: "user"
        },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    ];

    let acquiredStream = null;
    let lastErr = null;

    for (const constraints of constraintCandidates) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (acquiredStream) break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!acquiredStream) {
      setCameraError(
        lastErr?.name === "NotAllowedError" || lastErr?.name === "PermissionDeniedError"
          ? "Autorisation caméra refusée dans le navigateur. Autorisez l'accès caméra ou utilisez le mode « Diagnostic Sans Caméra »."
          : "Impossible d'ouvrir la caméra sur cet appareil. Vous pouvez utiliser le mode « Diagnostic Sans Caméra » ci-dessus."
      );
      setScanMode("fallback");
      return;
    }

    streamRef.current = acquiredStream;
    setCameraActive(true);

    // Enumerate available video inputs (helpful on PC with multiple webcams / virtual cameras)
    if (navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d) => d.kind === "videoinput");
        setVideoDevices(cams);
        const currentTrack = acquiredStream.getVideoTracks()[0];
        const activeId = currentTrack?.getSettings?.()?.deviceId;
        if (activeId) {
          setSelectedDeviceId(activeId);
        }
      } catch (_) {}
    }

    if (videoRef.current) {
      await bindStreamToVideoElement(videoRef.current, acquiredStream);
    }
  };

  // Real-time HTML5 <canvas> luminance & contrast check on the center frame every 250ms
  useEffect(() => {
    if (!cameraActive) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = analysisCanvasRef.current;
      if (
        !video ||
        !canvas ||
        video.readyState < 2 ||
        !video.videoWidth ||
        !video.videoHeight
      ) {
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const sampleSize = 120;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const cropSide = Math.min(vw, vh) * 0.6;
      const sx = (vw - cropSide) / 2;
      const sy = (vh - cropSide) / 2;

      ctx.drawImage(video, sx, sy, cropSide, cropSide, 0, 0, sampleSize, sampleSize);
      const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

      let sumLum = 0;
      let sumLumSq = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        // Rec. 709 relative luminance
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        sumLum += lum;
        sumLumSq += lum * lum;
      }

      const meanLum = sumLum / pixelCount;
      const variance = Math.max(0, sumLumSq / pixelCount - meanLum * meanLum);
      const stdDevContrast = Math.sqrt(variance);

      let status = "optimal";
      if (meanLum < 45) {
        status = "too_dark";
      } else if (meanLum > 235) {
        status = "too_bright";
      }

      setLightingStats({
        luminance: Math.round(meanLum),
        contrast: Math.round(stdDevContrast),
        sharpnessOk: stdDevContrast >= 14,
        status
      });
    }, 250);

    return () => clearInterval(interval);
  }, [cameraActive]);

  // Capture 800x800 JPEG (0.82 quality) + optional Forehead (T-Zone) & Cheeks (U-Zone) patches < 250KB
  const handleCaptureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || lightingStats.status !== "optimal") return;

    const vw = video.videoWidth || 800;
    const vh = video.videoHeight || 800;
    const squareSide = Math.min(vw, vh);
    const sx = (vw - squareSide) / 2;
    const sy = (vh - squareSide) / 2;

    // 1. Main 800x800 frame at 0.82 JPEG quality
    const mainCanvas = document.createElement("canvas");
    mainCanvas.width = 800;
    mainCanvas.height = 800;
    const mainCtx = mainCanvas.getContext("2d");
    mainCtx.drawImage(video, sx, sy, squareSide, squareSide, 0, 0, 800, 800);

    let fullDataUrl = mainCanvas.toDataURL("image/jpeg", 0.82);
    let fullFrameBase64 = fullDataUrl.split(",")[1];

    let foreheadPatchBase64 = undefined;
    let cheeksPatchBase64 = undefined;

    if (includeZoneCrops) {
      // 2. Forehead (T-Zone) crop patch: top-center region of the 800x800 frame
      const tCanvas = document.createElement("canvas");
      tCanvas.width = 360;
      tCanvas.height = 220;
      const tCtx = tCanvas.getContext("2d");
      tCtx.drawImage(mainCanvas, 220, 130, 360, 220, 0, 0, 360, 220);
      foreheadPatchBase64 = tCanvas.toDataURL("image/jpeg", 0.78).split(",")[1];

      // 3. Cheeks (U-Zone) crop patch: mid-lower cheek band of the 800x800 frame
      const uCanvas = document.createElement("canvas");
      uCanvas.width = 420;
      uCanvas.height = 220;
      const uCtx = uCanvas.getContext("2d");
      uCtx.drawImage(mainCanvas, 190, 380, 420, 220, 0, 0, 420, 220);
      cheeksPatchBase64 = uCanvas.toDataURL("image/jpeg", 0.78).split(",")[1];
    }

    // Verify payload stays strictly under 250KB; if larger, step down JPEG quality automatically
    const calcSizeKB = (f, tPatch, uPatch) => {
      const totalChars = (f?.length || 0) + (tPatch?.length || 0) + (uPatch?.length || 0);
      return Math.round((totalChars * 0.75) / 1024);
    };

    let payloadSizeKB = calcSizeKB(fullFrameBase64, foreheadPatchBase64, cheeksPatchBase64);
    if (payloadSizeKB > 240) {
      fullDataUrl = mainCanvas.toDataURL("image/jpeg", 0.68);
      fullFrameBase64 = fullDataUrl.split(",")[1];
      payloadSizeKB = calcSizeKB(fullFrameBase64, foreheadPatchBase64, cheeksPatchBase64);
    }

    // Immediately stop camera stream tracks right after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tTrack) => tTrack.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCountdown(0);
    setEphemeralStopped(true);

    setCapturedImages({
      fullFrameBase64,
      foreheadPatchBase64,
      cheeksPatchBase64,
      payloadSizeKB,
      previewUrl: fullDataUrl
    });

    // Smooth-scroll down to the Wilaya & Launch Scan button
    setTimeout(() => {
      calibrationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 180);
  }, [includeZoneCrops, lightingStats.status]);

  // 3-Second Hands-Free Auto-Countdown Capture
  const startCountdownCapture = () => {
    if (lightingStats.status !== "optimal" || countdown > 0) return;
    setCountdown(3);
    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearInterval(timer);
        setCountdown(0);
        handleCaptureFrame();
      } else {
        setCountdown(current);
      }
    }, 950);
  };

  // Run DermoScan AI™ Consultation (Camera or Camera-Shy)
  const handleRunConsultation = async (e) => {
    if (e) e.preventDefault();
    setIsScanning(true);

    const currentCatalog = refreshLiveCatalog();
    updateWilaya(wilaya);

    try {
      const payload = {
        action: "scan",
        mode: scanMode === "camera" && capturedImages ? "camera" : "camera_shy",
        lang,
        wilaya,
        questionnaire: {
          tZoneShine,
          cheekTightness,
          redness,
          currentRoutine: currentRoutineInput
        },
        images:
          scanMode === "camera" && capturedImages
            ? {
                fullFrameBase64: capturedImages.fullFrameBase64,
                foreheadPatchBase64: capturedImages.foreheadPatchBase64,
                cheeksPatchBase64: capturedImages.cheeksPatchBase64
              }
            : null,
        liveCatalog: currentCatalog,
        memoryProfile: profile
      };

      const res = await fetch("/api/dermoscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.status === 403 || json?.isLocked) {
        setIsUnlocked(false);
        setIsUnlockModalOpen(true);
        showToast?.(
          json?.error ||
            (lang === "dz"
              ? "محطة DermoScan مقفلة حالياً. يرجى إدخال كلمة السر."
              : "DermoScan AI™ est actuellement en formulation. Mot de passe requis."),
          "warning"
        );
        return;
      }

      if (json?.data) {
        setScanResult(json.data);
        setActiveModelUsed(json.modelUsed || "gemini-3.8-flash");

        // Save scan telemetry + any newly extracted memories to localStorage
        recordScan({
          wilaya,
          telemetry: json.data.telemetry,
          extractedNewMemories: json.data.extractedNewMemories || []
        });

        // Seed follow-up chat with the personalized greeting
        setChatHistory([
          {
            role: "assistant",
            content:
              json.data.greetingAndMemoryNote ||
              json.data.personalizedGreeting ||
              "Votre bilan DermoScan AI™ est prêt."
          }
        ]);

        // Automatically smooth-scroll directly to the Clinical Results Dashboard
        setTimeout(() => {
          resultsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 160);
      }
    } catch (error) {
      showToast("Erreur réseau momentanée. Veuillez réessayer.");
    } finally {
      setIsScanning(false);
    }
  };

  // Send Follow-up Chat Message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    const nextHistory = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(nextHistory);
    setIsChatting(true);

    const currentCatalog = refreshLiveCatalog();

    try {
      const res = await fetch("/api/dermoscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          lang,
          wilaya,
          chatMessage: userMsg,
          chatHistory: chatHistory.map((m) => ({ role: m.role, text: m.content })),
          liveCatalog: currentCatalog,
          userProfile: profile
        })
      });

      const json = await res.json();

      if (res.status === 403 || json?.isLocked) {
        setIsUnlocked(false);
        setIsUnlockModalOpen(true);
        showToast?.(
          json?.error ||
            (lang === "dz"
              ? "محطة DermoScan مقفلة حالياً. يرجى إدخال كلمة السر."
              : "DermoScan AI™ est actuellement en formulation. Mot de passe requis."),
          "warning"
        );
        return;
      }

      if (json?.data) {
        const replyText = json.data.reply;
        const conflictAlert = json.data.routineConflictAlert;
        let formattedReply = replyText;
        if (conflictAlert) {
          formattedReply += `\n\n⚠️ ${conflictAlert}`;
        }

        setChatHistory([...nextHistory, { role: "assistant", content: formattedReply }]);

        if (
          Array.isArray(json.data.extractedNewMemories) &&
          json.data.extractedNewMemories.length > 0
        ) {
          appendMemories(json.data.extractedNewMemories);
        }
      }
    } catch {
      setChatHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: "Connexion momentanément interrompue. Vos données locales restent sauvegardées."
        }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  // 1-Click Express COD Checkout for Prescribed Routine
  const handleAddRoutineToCart = () => {
    const freshCatalog = refreshLiveCatalog();
    const prescribedList =
      scanResult?.prescription || scanResult?.prescriptions || [];

    let addedCount = 0;
    prescribedList.forEach((presc) => {
      const matched = freshCatalog.find(
        (item) => item.id === presc.productId && item.isPurchasable
      );
      if (matched) {
        addToCart(matched.id, 1);
        addedCount++;
      }
    });

    if (addedCount === 0) {
      const firstInStock = freshCatalog.find((item) => item.isPurchasable);
      if (firstInStock) {
        addToCart(firstInStock.id, 1);
      }
    }
    setIsCartOpen(true);
  };

  const renderUnlockModal = () => {
    if (!isUnlockModalOpen) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsUnlockModalOpen(false);
          }
        }}
      >
        <div
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0px",
            width: "100%",
            maxWidth: "460px",
            padding: "2rem",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
            position: "relative"
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsUnlockModalOpen(false)}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "0.4rem"
            }}
          >
            <X size={18} />
          </button>

          {/* Icon + Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem"
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                background: "rgba(113, 159, 183, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0px"
              }}
            >
              <Lock size={18} color="var(--accent-aqua)" />
            </div>
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                margin: 0
              }}
            >
              {t.labUnlockModalTitle}
            </h2>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              marginBottom: "1.4rem"
            }}
          >
            {t.labUnlockModalDesc}
          </p>

          <form onSubmit={handleUnlockSubmit}>
            <div style={{ marginBottom: "1.2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                  marginBottom: "0.45rem"
                }}
              >
                {t.labPasswordLabel}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showUnlockPassword ? "text" : "password"}
                  value={unlockPassword}
                  onChange={(e) => {
                    setUnlockPassword(e.target.value);
                    if (unlockError) setUnlockError("");
                  }}
                  placeholder={t.labPasswordPlaceholder}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.8rem 0.75rem 0.95rem",
                    background: "var(--bg-secondary)",
                    border: unlockError
                      ? "1px solid #ef4444"
                      : "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    borderRadius: "0px",
                    outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                  style={{
                    position: "absolute",
                    right: "0.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "0.3rem"
                  }}
                  aria-label={showUnlockPassword ? "Masquer" : "Afficher"}
                >
                  {showUnlockPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {unlockError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "#f87171",
                    fontSize: "0.8rem",
                    marginTop: "0.5rem"
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>{unlockError}</span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end"
              }}
            >
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(false)}
                style={{
                  padding: "0.65rem 1.1rem",
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  borderRadius: "0px"
                }}
              >
                {t.labUnlockClose}
              </button>
              <button
                type="submit"
                disabled={isSubmittingUnlock || !unlockPassword.trim()}
                className="btn-aqua"
                style={{
                  padding: "0.65rem 1.3rem",
                  fontSize: "0.84rem",
                  cursor:
                    isSubmittingUnlock || !unlockPassword.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isSubmittingUnlock || !unlockPassword.trim() ? 0.7 : 1,
                  borderRadius: "0px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem"
                }}
              >
                {isSubmittingUnlock ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <Key size={14} />
                    <span>{t.labUnlockSubmit}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isCheckingAuth) {
    return (
      <main
        style={{
          padding: "5rem 0 6rem",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <Loader2
            size={32}
            style={{
              animation: "spin 1s linear infinite",
              color: "var(--accent-aqua)",
              marginBottom: "0.9rem"
            }}
          />
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            Vérification des accès cliniques...
          </p>
        </div>
      </main>
    );
  }

  if (!isUnlocked) {
    return (
      <main style={{ padding: "2.2rem 0 6rem", minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: "880px" }}>
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.4rem 1.1rem",
                borderRadius: "0px",
                background: "rgba(113, 159, 183, 0.12)",
                color: "var(--accent-aqua)",
                fontSize: "0.74rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "1rem",
                border: "1px solid rgba(113, 159, 183, 0.24)"
              }}
            >
              <Lock size={13} />
              <span>{t.comingSoonTag}</span>
            </span>

            <h1
              style={{
                fontSize: "clamp(1.9rem, 4.4vw, 2.75rem)",
                fontWeight: 400,
                color: "var(--text-primary)",
                lineHeight: 1.18,
                marginBottom: "0.85rem"
              }}
            >
              {t.comingSoonTitle}
            </h1>

            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "680px",
                margin: "0 auto 1.6rem"
              }}
            >
              {t.comingSoonSubtitle}
            </p>

            {/* Unlock Toggle Button */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem" }}>
              <button
                type="button"
                onClick={() => {
                  setUnlockError("");
                  setIsUnlockModalOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.65rem 1.4rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  borderRadius: "0px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-aqua)";
                  e.currentTarget.style.color = "var(--accent-aqua)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                <Key size={15} color="var(--accent-aqua)" />
                <span>{t.labUnlockBtn}</span>
              </button>
            </div>
          </div>

          {/* 3 Innovation Pillar Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.2rem",
              marginBottom: "2.8rem"
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem"
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(113, 159, 183, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.3rem",
                  borderRadius: "0px"
                }}
              >
                <Camera size={20} color="var(--accent-aqua)" />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: 0
                }}
              >
                {t.comingSoonFeature1Title}
              </h3>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {t.comingSoonFeature1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem"
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(113, 159, 183, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.3rem",
                  borderRadius: "0px"
                }}
              >
                <MapPin size={20} color="var(--accent-aqua)" />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: 0
                }}
              >
                {t.comingSoonFeature2Title}
              </h3>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {t.comingSoonFeature2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem"
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(113, 159, 183, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.3rem",
                  borderRadius: "0px"
                }}
              >
                <FlaskConical size={20} color="var(--accent-aqua)" />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: 0
                }}
              >
                {t.comingSoonFeature3Title}
              </h3>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {t.comingSoonFeature3Desc}
              </p>
            </div>
          </div>

          {/* Waitlist Lead Capture Card */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0px",
              padding: "clamp(1.6rem, 3.2vw, 2.4rem)",
              textAlign: "center",
              maxWidth: "680px",
              margin: "0 auto"
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--accent-aqua)",
                fontWeight: 500,
                display: "block",
                marginBottom: "0.45rem"
              }}
            >
              {t.waitlistBadge}
            </span>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: "0.5rem"
              }}
            >
              {t.waitlistTitle}
            </h2>
            <p
              style={{
                fontSize: "0.86rem",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                marginBottom: "1.4rem"
              }}
            >
              {t.waitlistDesc}
            </p>

            <form
              onSubmit={handleWaitlistSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                maxWidth: "480px",
                margin: "0 auto"
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={waitlistInput}
                  onChange={(e) => setWaitlistInput(e.target.value)}
                  placeholder={t.waitlistPlaceholder}
                  style={{
                    flex: "1 1 240px",
                    padding: "0.75rem 1rem",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    borderRadius: "0px",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === "loading"}
                  className="btn-aqua"
                  style={{
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.86rem",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    borderRadius: "0px"
                  }}
                >
                  {waitlistStatus === "loading" ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <span>{t.waitlistBtn}</span>
                  )}
                </button>
              </div>

              {waitlistStatus === "success" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    justifyContent: "center",
                    fontSize: "0.82rem",
                    color: "#4ade80",
                    marginTop: "0.4rem"
                  }}
                >
                  <Check size={15} />
                  <span>{waitlistMsg}</span>
                </div>
              )}

              {waitlistStatus === "error" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    justifyContent: "center",
                    fontSize: "0.82rem",
                    color: "#f87171",
                    marginTop: "0.4rem"
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>{waitlistMsg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Unlock Modal */}
          {renderUnlockModal()}
        </div>
      </main>
    );
  }

  const climateInfo = classifyWilayaClimate(wilaya);

  return (
    <main style={{ padding: "1.5rem 0 6rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "920px" }}>
        {/* Laboratory Active Session Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
            padding: "0.75rem 1.1rem",
            marginBottom: "1.5rem",
            background: "rgba(77, 115, 88, 0.12)",
            border: "1px solid rgba(77, 115, 88, 0.35)",
            borderRadius: "0px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Unlock size={16} color="#4d7358" />
            <span
              style={{
                fontSize: "0.84rem",
                fontWeight: 500,
                color: "var(--text-primary)"
              }}
            >
              {t.labUnlockedBanner}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRelock}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "var(--text-secondary)",
              padding: "0.3rem 0.75rem",
              fontSize: "0.76rem",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Lock size={12} />
            <span>{t.labRelockBtn}</span>
          </button>
        </div>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "0px",
              background: "rgba(113, 159, 183, 0.14)",
              color: "var(--accent-aqua)",
              fontSize: "0.74rem",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem"
            }}
          >
            <Sparkles size={13} />
            <span>{t.tag}</span>
          </span>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 4vw, 2.65rem)",
              fontWeight: 400,
              color: "var(--text-primary)",
              lineHeight: 1.18,
              marginBottom: "0.6rem"
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "680px",
              margin: "0 auto"
            }}
          >
            {t.subtitle}
          </p>

          {/* Returning User Progress Comparison Badge */}
          {memoryLoaded && progressComparison && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                background: "rgba(77, 115, 88, 0.18)",
                color: "#4d7358",
                fontSize: "0.82rem",
                fontWeight: 400
              }}
            >
              <TrendingUp size={15} />
              <span>
                {progressComparison.hydrationDelta >= 0 ? "+" : ""}
                {progressComparison.hydrationDelta}% Hydratation •{" "}
                {progressComparison.barrierDelta >= 0 ? "+" : ""}
                {progressComparison.barrierDelta}% Barrière depuis votre dernier scan
              </span>
              <span style={{ opacity: 0.75, fontSize: "0.75rem" }}>
                ({t.scansCountLabel} : {progressComparison.totalScans})
              </span>
            </div>
          )}
        </div>

        {/* Mode Selector Tabs: Live Camera vs. Camera-Shy Fallback */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setScanMode("camera");
            }}
            style={{
              padding: "0.95rem 1.2rem",
              background:
                scanMode === "camera" ? "var(--accent-aqua)" : "var(--bg-card)",
              color: scanMode === "camera" ? "#ffffff" : "var(--text-primary)",
              border: "none",
              borderRadius: "0px",
              fontSize: "0.88rem",
              fontWeight: 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              transition: "all 0.2s ease"
            }}
          >
            <Camera size={17} />
            <span>{t.modeCamera}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              setScanMode("fallback");
            }}
            style={{
              padding: "0.95rem 1.2rem",
              background:
                scanMode === "fallback" ? "var(--accent-aqua)" : "var(--bg-card)",
              color: scanMode === "fallback" ? "#ffffff" : "var(--text-primary)",
              border: "none",
              borderRadius: "0px",
              fontSize: "0.88rem",
              fontWeight: 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              transition: "all 0.2s ease"
            }}
          >
            <EyeOff size={17} />
            <span>{t.modeFallback}</span>
          </button>
        </div>

        {/* Ephemeral Privacy Security Badge */}
        <div
          style={{
            background: ephemeralStopped
              ? "rgba(77, 115, 88, 0.16)"
              : "var(--bg-card)",
            padding: "0.75rem 1.1rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.82rem",
            color: ephemeralStopped ? "#4d7358" : "var(--text-secondary)",
            textAlign: "center"
          }}
        >
          <Lock size={14} />
          <span>{t.ephemeralBadge}</span>
        </div>

        {/* MODE A: LIVE CAMERA HUD & 3-ZONE CROPPING */}
        {scanMode === "camera" && (
          <div
            style={{
              background: "var(--bg-card)",
              padding: "1.6rem",
              marginBottom: "1.6rem",
              boxShadow: "var(--shadow-md)"
            }}
          >
            {cameraError && (
              <div
                style={{
                  padding: "0.9rem 1rem",
                  background: "rgba(217, 119, 6, 0.14)",
                  color: "#d97706",
                  fontSize: "0.83rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <AlertTriangle size={16} />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Hidden Canvas for 250ms Real-Time Luminance & Contrast Check */}
            <canvas ref={analysisCanvasRef} style={{ display: "none" }} />

            {!cameraActive && !capturedImages && (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div
                  style={{
                    width: "220px",
                    height: "240px",
                    margin: "0 auto 1.4rem",
                    position: "relative",
                    background: "rgba(17, 23, 26, 0.72)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "18px",
                      height: "18px",
                      borderTop: "2px solid var(--accent-aqua)",
                      borderLeft: "2px solid var(--accent-aqua)"
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "18px",
                      height: "18px",
                      borderTop: "2px solid var(--accent-aqua)",
                      borderRight: "2px solid var(--accent-aqua)"
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "18px",
                      height: "18px",
                      borderBottom: "2px solid var(--accent-aqua)",
                      borderLeft: "2px solid var(--accent-aqua)"
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "18px",
                      height: "18px",
                      borderBottom: "2px solid var(--accent-aqua)",
                      borderRight: "2px solid var(--accent-aqua)"
                    }}
                  />
                  <Camera size={42} color="var(--accent-aqua)" />
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      marginTop: "0.65rem",
                      letterSpacing: "0.08em"
                    }}
                  >
                    HUD T-ZONE & U-ZONE
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="btn-aqua"
                  style={{
                    padding: "0.85rem 1.8rem",
                    fontSize: "0.88rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer"
                  }}
                >
                  <Camera size={17} />
                  <span>{t.startCamera}</span>
                </button>
              </div>
            )}

            {/* Live Video Feed + Parapharmaceutical HUD Overlay */}
            {cameraActive && (
              <div style={{ textAlign: "center" }}>
                {/* Real-Time 3-Metric Photo Quality Coach Checklist */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "0.65rem"
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.35rem 0.8rem",
                      background:
                        lightingStats.status === "optimal"
                          ? "rgba(77, 115, 88, 0.22)"
                          : "rgba(217, 119, 6, 0.2)",
                      color:
                        lightingStats.status === "optimal" ? "#4d7358" : "#d97706",
                      fontSize: "0.78rem"
                    }}
                  >
                    <Sun size={14} />
                    <span>
                      {lightingStats.status === "optimal"
                        ? `✓ ${t.lightOptimal} (${lightingStats.luminance}/255)`
                        : lightingStats.status === "too_dark"
                        ? `⚠️ ${t.lightTooDark}`
                        : lightingStats.status === "too_bright"
                        ? `⚠️ ${t.lightTooBright}`
                        : t.lightWaiting}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.35rem 0.8rem",
                      background: lightingStats.sharpnessOk
                        ? "rgba(77, 115, 88, 0.22)"
                        : "rgba(113, 159, 183, 0.16)",
                      color: lightingStats.sharpnessOk
                        ? "#4d7358"
                        : "var(--text-secondary)",
                      fontSize: "0.78rem"
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>
                      {lightingStats.sharpnessOk
                        ? `✓ Netteté & Texture (${lightingStats.contrast})`
                        : "Stabilisez votre visage face caméra"}
                    </span>
                  </div>
                </div>

                {/* Live Coaching Advice Banner */}
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.75rem"
                  }}
                >
                  {lightingStats.status === "optimal"
                    ? "🎯 Alignez vos yeux sur l'axe horizontal et votre visage dans l'ovale clinique."
                    : "💡 Conseil photo parfaite : Placez-vous face à une fenêtre ou une lumière douce, sans contre-jour."}
                </div>

                {/* Multi-Camera Device Selector (for PCs with multiple webcams / virtual cameras) */}
                {videoDevices.length > 1 && (
                  <div style={{ marginBottom: "0.8rem" }}>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setSelectedDeviceId(newId);
                        startCamera(newId);
                      }}
                      style={{
                        padding: "0.45rem 0.85rem",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        border: "none",
                        borderRadius: "0px",
                        fontSize: "0.78rem",
                        outline: "none"
                      }}
                    >
                      {videoDevices.map((dev, idx) => (
                        <option key={dev.deviceId || idx} value={dev.deviceId}>
                          {dev.label || `Caméra ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Video + Anatomical SVG HUD Guides Container */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "440px",
                    aspectRatio: "1 / 1",
                    margin: "0 auto 1.2rem",
                    background: "#0d1317",
                    overflow: "hidden"
                  }}
                >
                  <video
                    ref={setVideoElementRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scaleX(-1)"
                    }}
                  />

                  {/* Animated Laser Line */}
                  <div className="analyzer-laser-line" />

                  {/* Precision Anatomical SVG Face Contour & 3-Zone Reticle Overlay */}
                  <svg
                    viewBox="0 0 400 400"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none"
                    }}
                  >
                    {/* Darkened vignette outside oval */}
                    <defs>
                      <mask id="faceOvalMask">
                        <rect width="400" height="400" fill="white" />
                        <ellipse cx="200" cy="198" rx="122" ry="156" fill="black" />
                      </mask>
                    </defs>
                    <rect
                      width="400"
                      height="400"
                      fill="rgba(10, 16, 20, 0.42)"
                      mask="url(#faceOvalMask)"
                    />

                    {/* Outer Corner Reticle Brackets */}
                    <path
                      d="M 28 52 L 28 28 L 52 28"
                      fill="none"
                      stroke="#719FB7"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 372 52 L 372 28 L 348 28"
                      fill="none"
                      stroke="#719FB7"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 28 348 L 28 372 L 52 372"
                      fill="none"
                      stroke="#719FB7"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 372 348 L 372 372 L 348 372"
                      fill="none"
                      stroke="#719FB7"
                      strokeWidth="2.5"
                    />

                    {/* Anatomical Face Contour Oval (Turns green #4d7358 when optimal) */}
                    <ellipse
                      cx="200"
                      cy="198"
                      rx="122"
                      ry="156"
                      fill="none"
                      stroke={
                        lightingStats.status === "optimal" ? "#4d7358" : "#719FB7"
                      }
                      strokeWidth="2.2"
                      strokeDasharray="8 5"
                    />

                    {/* Ocular Alignment Line & Nasal Vertical Axis */}
                    <line
                      x1="92"
                      y1="168"
                      x2="308"
                      y2="168"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="200"
                      y1="55"
                      x2="200"
                      y2="335"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* 1. T-ZONE (Forehead & Nasal Bridge) Target Box */}
                    <rect
                      x="118"
                      y="68"
                      width="164"
                      height="74"
                      fill="rgba(113, 159, 183, 0.14)"
                      stroke="#719FB7"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <rect x="135" y="56" width="130" height="16" fill="rgba(13, 19, 23, 0.82)" />
                    <text
                      x="200"
                      y="67"
                      fill="#ffffff"
                      fontSize="8.5"
                      textAnchor="middle"
                      letterSpacing="1.2"
                    >
                      {t.tZoneGuide}
                    </text>

                    {/* 2. Left U-ZONE (Cheek) Target Box */}
                    <rect
                      x="92"
                      y="196"
                      width="84"
                      height="76"
                      fill="rgba(77, 115, 88, 0.16)"
                      stroke="#4d7358"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    {/* 3. Right U-ZONE (Cheek) Target Box */}
                    <rect
                      x="224"
                      y="196"
                      width="84"
                      height="76"
                      fill="rgba(77, 115, 88, 0.16)"
                      stroke="#4d7358"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <rect x="125" y="278" width="150" height="16" fill="rgba(13, 19, 23, 0.82)" />
                    <text
                      x="200"
                      y="289"
                      fill="#ffffff"
                      fontSize="8.5"
                      textAnchor="middle"
                      letterSpacing="1.2"
                    >
                      {t.uZoneGuide}
                    </text>
                  </svg>

                  {/* 3-2-1 Countdown Overlay */}
                  {countdown > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(13, 19, 23, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "4.5rem",
                        color: "#ffffff",
                        fontWeight: 400
                      }}
                    >
                      {countdown}
                    </div>
                  )}
                </div>

                {/* 3-Zone Crop Toggle */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeZoneCrops}
                    onChange={(e) => setIncludeZoneCrops(e.target.checked)}
                  />
                  <span>{t.cropToggleLabel}</span>
                </label>

                {/* Instant Capture + 3s Hands-Free Auto-Pose Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem"
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCaptureFrame}
                    disabled={lightingStats.status !== "optimal"}
                    style={{
                      padding: "0.85rem 1.7rem",
                      background:
                        lightingStats.status === "optimal"
                          ? "#4d7358"
                          : "var(--bg-secondary)",
                      color:
                        lightingStats.status === "optimal"
                          ? "#ffffff"
                          : "var(--text-muted)",
                      border: "none",
                      borderRadius: "0px",
                      fontSize: "0.88rem",
                      fontWeight: 400,
                      cursor:
                        lightingStats.status === "optimal"
                          ? "pointer"
                          : "not-allowed"
                    }}
                  >
                    {t.captureBtn}
                  </button>

                  <button
                    type="button"
                    onClick={startCountdownCapture}
                    disabled={lightingStats.status !== "optimal" || countdown > 0}
                    style={{
                      padding: "0.85rem 1.3rem",
                      background: "var(--bg-secondary)",
                      color:
                        lightingStats.status === "optimal"
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                      border: "none",
                      borderRadius: "0px",
                      fontSize: "0.84rem",
                      fontWeight: 400,
                      cursor:
                        lightingStats.status === "optimal"
                          ? "pointer"
                          : "not-allowed"
                    }}
                  >
                    {countdown > 0 ? `Pose (${countdown}s)...` : "⏱ Retardateur 3s (Auto-Pose)"}
                  </button>
                </div>
              </div>
            )}

            {/* Captured Preview + Payload Telemetry */}
            {capturedImages && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}
                >
                  <div>
                    <img
                      src={capturedImages.previewUrl}
                      alt="DermoScan Ephemeral Frame"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        transform: "scaleX(-1)"
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-secondary)",
                        marginTop: "0.3rem"
                      }}
                    >
                      800×800 JPEG ({capturedImages.payloadSizeKB} Ko &lt; 250 Ko)
                    </div>
                  </div>

                  {capturedImages.foreheadPatchBase64 && (
                    <div>
                      <img
                        src={`data:image/jpeg;base64,${capturedImages.foreheadPatchBase64}`}
                        alt="T-Zone Crop"
                        style={{
                          width: "130px",
                          height: "80px",
                          objectFit: "cover",
                          transform: "scaleX(-1)"
                        }}
                      />
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.25rem"
                        }}
                      >
                        Patch Zone T (Front)
                      </div>
                    </div>
                  )}

                  {capturedImages.cheeksPatchBase64 && (
                    <div>
                      <img
                        src={`data:image/jpeg;base64,${capturedImages.cheeksPatchBase64}`}
                        alt="U-Zone Crop"
                        style={{
                          width: "130px",
                          height: "80px",
                          objectFit: "cover",
                          transform: "scaleX(-1)"
                        }}
                      />
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.25rem"
                        }}
                      >
                        Patch Zone U (Joues)
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => startCamera()}
                  style={{
                    padding: "0.55rem 1.1rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "0px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <RefreshCw size={14} />
                  <span>{t.retakeBtn}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 58-WILAYA CLIMATE & CLINICAL CALIBRATION FORM */}
        <form
          ref={calibrationFormRef}
          onSubmit={handleRunConsultation}
          style={{
            background: "var(--bg-card)",
            padding: "1.8rem",
            marginBottom: "2rem",
            boxShadow: "var(--shadow-md)",
            scrollMarginTop: "85px"
          }}
        >
          {/* 1. Wilaya Selector + Live Bioclimatic Telemetry Pill */}
          <div style={{ marginBottom: "1.3rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                fontSize: "0.86rem",
                color: "var(--text-primary)",
                marginBottom: "0.5rem"
              }}
            >
              <MapPin size={15} color="var(--accent-aqua)" />
              <span>{t.wilayaLabel}</span>
            </label>

            <select
              value={wilaya}
              onChange={(e) => {
                setWilaya(e.target.value);
                updateWilaya(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: "0px",
                fontSize: "0.86rem",
                outline: "none",
                marginBottom: "0.6rem"
              }}
            >
              {ALGERIAN_WILAYAS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>

            {/* Live Climate Profile Badge */}
            <div
              style={{
                padding: "0.65rem 0.9rem",
                background: "var(--bg-secondary)",
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem"
              }}
            >
              <span style={{ color: "var(--accent-aqua)" }}>
                <Wind size={13} style={{ display: "inline", marginRight: "0.35rem" }} />
                {climateInfo.label?.[lang] || climateInfo.label?.fr}
              </span>
              <span>{climateInfo.waterHardness}</span>
            </div>
          </div>

          {/* 2. T-Zone Shine, Cheek Tightness & Redness Selectors */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "1rem",
              marginBottom: "1.3rem"
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.45rem"
                }}
              >
                {t.tZoneLabel}
              </label>
              <select
                value={tZoneShine}
                onChange={(e) => setTZoneShine(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none",
                  borderRadius: "0px",
                  fontSize: "0.83rem"
                }}
              >
                {t.tZoneOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.45rem"
                }}
              >
                {t.cheekLabel}
              </label>
              <select
                value={cheekTightness}
                onChange={(e) => setCheekTightness(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none",
                  borderRadius: "0px",
                  fontSize: "0.83rem"
                }}
              >
                {t.cheekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.45rem"
                }}
              >
                {t.rednessLabel}
              </label>
              <select
                value={redness}
                onChange={(e) => setRedness(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "none",
                  borderRadius: "0px",
                  fontSize: "0.83rem"
                }}
              >
                {t.rednessOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Current Routine / DIY Conflict Input */}
          <div style={{ marginBottom: "1.4rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                color: "var(--text-primary)",
                marginBottom: "0.45rem"
              }}
            >
              {t.routineLabel}
            </label>
            <input
              type="text"
              value={currentRoutineInput}
              onChange={(e) => setCurrentRoutineInput(e.target.value)}
              placeholder={t.routinePlaceholder}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: "0px",
                fontSize: "0.84rem",
                outline: "none"
              }}
            />
          </div>

          {/* Submit Consultation Button */}
          <button
            type="submit"
            disabled={isScanning}
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              background: "#4d7358",
              color: "#ffffff",
              border: "none",
              borderRadius: "0px",
              fontSize: "0.92rem",
              fontWeight: 400,
              cursor: isScanning ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem"
            }}
          >
            <Sparkles size={17} />
            <span>{isScanning ? t.scanningStatus : t.runScanBtn}</span>
          </button>
        </form>

        {/* CONSULTATION RESULTS DASHBOARD */}
        {scanResult && (
          <div
            ref={resultsSectionRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.6rem",
              scrollMarginTop: "85px"
            }}
          >
            {/* Personalized Greeting & Bioclimatic Summary */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.5rem 1.6rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.6rem"
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "var(--accent-aqua)"
                  }}
                >
                  BILAN BIOCHIMIQUE PERSONNALISÉ • {wilaya}
                </span>
                {activeModelUsed && (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Moteur IA : {activeModelUsed}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  marginBottom: "0.8rem"
                }}
              >
                {scanResult.greetingAndMemoryNote || scanResult.personalizedGreeting}
              </p>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6
                }}
              >
                {scanResult.wilayaClimateAnalysis ||
                  `${climateInfo.label?.[lang] || climateInfo.label?.fr} — Humidité : ${climateInfo.humidityRange} • Dureté eau : ${climateInfo.waterHardness}`}
              </p>
            </div>

            {/* 1. Clinical Skin Telemetry */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.6rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Activity size={18} color="var(--accent-aqua)" />
                <span>{t.telemetryTitle}</span>
              </h2>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--bg-secondary)",
                  marginBottom: "1.1rem",
                  fontSize: "0.88rem",
                  color: "var(--text-primary)"
                }}
              >
                Type Cutané Identifié :{" "}
                <span style={{ color: "var(--accent-aqua)" }}>
                  {scanResult.telemetry?.skinType}
                </span>
              </div>

              {/* Score Gauges */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.9rem",
                  marginBottom: "1.2rem"
                }}
              >
                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.3rem"
                    }}
                  >
                    {t.hydrationLabel}
                  </div>
                  <div
                    style={{
                      fontSize: "1.55rem",
                      color: "var(--accent-aqua)",
                      marginBottom: "0.4rem"
                    }}
                  >
                    {scanResult.telemetry?.hydrationScore}/100
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "rgba(113,159,183,0.2)",
                      width: "100%"
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, Math.max(0, scanResult.telemetry?.hydrationScore || 0))}%`,
                        background: "var(--accent-aqua)"
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.3rem"
                    }}
                  >
                    {t.barrierLabel}
                  </div>
                  <div
                    style={{
                      fontSize: "1.55rem",
                      color: "#4d7358",
                      marginBottom: "0.4rem"
                    }}
                  >
                    {scanResult.telemetry?.barrierIntegrityScore}/100
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "rgba(77,115,88,0.2)",
                      width: "100%"
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, Math.max(0, scanResult.telemetry?.barrierIntegrityScore || 0))}%`,
                        background: "#4d7358"
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.3rem"
                    }}
                  >
                    {t.sebumLabel}
                  </div>
                  <div style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
                    {scanResult.telemetry?.sebumLevel}
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.3rem"
                    }}
                  >
                    {t.rednessStatLabel}
                  </div>
                  <div style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
                    {scanResult.telemetry?.rednessLevel}
                  </div>
                </div>
              </div>

              {/* Zone T vs Zone U Observations */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1rem"
                }}
              >
                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--accent-aqua)",
                      marginBottom: "0.35rem"
                    }}
                  >
                    {t.tZoneObsTitle}
                  </div>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.55
                    }}
                  >
                    {scanResult.telemetry?.zoneObservations?.tZone}
                  </p>
                </div>

                <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#4d7358",
                      marginBottom: "0.35rem"
                    }}
                  >
                    {t.cheeksObsTitle}
                  </div>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.55
                    }}
                  >
                    {scanResult.telemetry?.zoneObservations?.cheeks}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Dynamic Anjucia Prescription + 1-Click COD Checkout */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.6rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Droplets size={18} color="#4d7358" />
                <span>{t.prescriptionTitle}</span>
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "1.3rem"
                }}
              >
                {(scanResult.prescription || scanResult.prescriptions || []).map((presc, idx) => {
                  const liveItem =
                    liveCatalog.find((p) => p.id === presc.productId) ||
                    liveCatalog[0];
                  const displayPrice = liveItem?.priceDZD ?? presc.priceDZD;
                  const isAvailable = liveItem
                    ? liveItem.isPurchasable
                    : presc.status === "in_stock";
                  const citedList = Array.isArray(presc.citedActives)
                    ? presc.citedActives
                    : typeof presc.activesCited === "string"
                    ? presc.activesCited.split(",").map((s) => s.trim())
                    : [];

                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-secondary)",
                        padding: "1.3rem"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.6rem",
                          marginBottom: "0.6rem"
                        }}
                      >
                        <span
                          style={{
                            padding: "0.25rem 0.65rem",
                            background: isAvailable
                              ? "#4d7358"
                              : "rgba(113,159,183,0.2)",
                            color: isAvailable ? "#ffffff" : "var(--text-secondary)",
                            fontSize: "0.7rem"
                          }}
                        >
                          {isAvailable ? t.inStockBadge : t.preOrderBadge}
                        </span>

                        <span
                          style={{
                            fontSize: "1.15rem",
                            color: "var(--text-primary)"
                          }}
                        >
                          {Number(displayPrice).toLocaleString("fr-DZ")} DA
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 400,
                          color: "var(--text-primary)",
                          marginBottom: "0.5rem"
                        }}
                      >
                        {presc.name || presc.productName}
                      </h3>

                      {/* Cited Active Percentages */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.4rem",
                          marginBottom: "0.8rem"
                        }}
                      >
                        {citedList.map((act, i) => (
                          <span
                            key={i}
                            style={{
                              padding: "0.25rem 0.6rem",
                              background: "var(--bg-card)",
                              color: "var(--accent-aqua)",
                              fontSize: "0.75rem"
                            }}
                          >
                            {act}
                          </span>
                        ))}
                      </div>

                      <p
                        style={{
                          fontSize: "0.84rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.55,
                          marginBottom: "0.9rem"
                        }}
                      >
                        {presc.clinicalRationale || presc.whyItMatches}
                      </p>

                      {/* Exact AM / PM Quantities */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "0.75rem",
                          marginBottom: "1rem"
                        }}
                      >
                        <div style={{ background: "var(--bg-card)", padding: "0.8rem" }}>
                          <div
                            style={{
                              fontSize: "0.73rem",
                              color: "var(--accent-aqua)",
                              marginBottom: "0.25rem"
                            }}
                          >
                            {t.amApplication}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-primary)",
                              lineHeight: 1.45
                            }}
                          >
                            {presc.amApplication}
                          </div>
                        </div>

                        <div style={{ background: "var(--bg-card)", padding: "0.8rem" }}>
                          <div
                            style={{
                              fontSize: "0.73rem",
                              color: "#4d7358",
                              marginBottom: "0.25rem"
                            }}
                          >
                            {t.pmApplication}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-primary)",
                              lineHeight: 1.45
                            }}
                          >
                            {presc.pmApplication}
                          </div>
                        </div>
                      </div>

                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(liveItem?.id || presc.productId, 1);
                            setIsCartOpen(true);
                          }}
                          style={{
                            padding: "0.65rem 1.2rem",
                            background: "#4d7358",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "0px",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem"
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>
                            {t.addSingleBtn} — {Number(displayPrice).toLocaleString("fr-DZ")} DA
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 1-Click Full Routine COD Button */}
              <button
                type="button"
                onClick={handleAddRoutineToCart}
                style={{
                  width: "100%",
                  padding: "1rem 1.4rem",
                  background: "#4d7358",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0px",
                  fontSize: "0.92rem",
                  fontWeight: 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem"
                }}
              >
                <ShoppingBag size={17} />
                <span>{t.addRoutineBtn}</span>
              </button>
            </div>

            {/* 3. Ubiquitous Natural Biochemical Synergies */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.6rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <FlaskConical size={18} color="var(--accent-aqua)" />
                <span>{t.synergyTitle}</span>
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1rem"
                }}
              >
                {(scanResult.naturalSynergies || []).map((syn, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--bg-secondary)",
                      padding: "1.2rem"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--accent-aqua)",
                        marginBottom: "0.3rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em"
                      }}
                    >
                      {t.activeMoleculeLabel} : {syn.activeMolecule}
                    </div>
                    <h3
                      style={{
                        fontSize: "0.96rem",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        marginBottom: "0.45rem"
                      }}
                    >
                      {syn.title || syn.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.55,
                        marginBottom: "0.7rem"
                      }}
                    >
                      {syn.biochemicalMechanism || syn.mechanism}
                    </p>
                    <div
                      style={{
                        background: "var(--bg-card)",
                        padding: "0.65rem 0.8rem",
                        fontSize: "0.78rem",
                        color: "var(--text-primary)",
                        lineHeight: 1.45
                      }}
                    >
                      <span style={{ color: "#4d7358" }}>
                        {t.protocolTimingLabel} :{" "}
                      </span>
                      {syn.protocolTiming}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Routine Conflict & DIY Myth Guardrail */}
            {(scanResult.routineConflicts || scanResult.routineConflictGuardrails || []).length > 0 && (
              <div
                style={{
                  background: "var(--bg-card)",
                  padding: "1.6rem",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                <h2
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 400,
                    color: "var(--text-primary)",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <AlertTriangle size={18} color="#d97706" />
                  <span>{t.guardrailTitle}</span>
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {(scanResult.routineConflicts || scanResult.routineConflictGuardrails || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-secondary)",
                        padding: "1.1rem"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#d97706",
                          marginBottom: "0.35rem"
                        }}
                      >
                        ⚠️ {item.offendingPractice || item.detectedPractice}
                      </div>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.55,
                          marginBottom: "0.55rem"
                        }}
                      >
                        {item.biochemicalReason || item.biochemicalHazard}
                      </p>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#4d7358"
                        }}
                      >
                        ✓ {t.safeReplacementLabel} : {item.safeReplacement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Interactive Follow-Up Consultation Chat & Memory Manager */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.6rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: "0.35rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <MessageSquare size={18} color="var(--accent-aqua)" />
                <span>{t.chatTitle}</span>
              </h2>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  marginBottom: "1.1rem",
                  lineHeight: 1.5
                }}
              >
                {t.chatSub}
              </p>

              {/* Chat Messages Feed */}
              <div
                style={{
                  background: "var(--bg-secondary)",
                  padding: "1rem",
                  maxHeight: "320px",
                  overflowY: "auto",
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}
              >
                {chatHistory.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      background:
                        m.role === "user" ? "var(--accent-aqua)" : "var(--bg-card)",
                      color:
                        m.role === "user" ? "#ffffff" : "var(--text-primary)",
                      padding: "0.75rem 1rem",
                      fontSize: "0.83rem",
                      lineHeight: 1.55,
                      whiteSpace: "pre-line"
                    }}
                  >
                    {m.content}
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendChat}
                style={{ display: "flex", gap: "0.6rem" }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.chatPlaceholder}
                  style={{
                    flex: 1,
                    padding: "0.8rem 1rem",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "0px",
                    fontSize: "0.84rem",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  disabled={isChatting}
                  style={{
                    padding: "0.8rem 1.3rem",
                    background: "#4d7358",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0px",
                    fontSize: "0.84rem",
                    cursor: isChatting ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Send size={14} />
                  <span>{t.chatSend}</span>
                </button>
              </form>

              {/* Saved LocalStorage Skin Memories */}
              {memoryLoaded && (profile?.memories?.length > 0 || profile?.scanHistory?.length > 0) && (
                <div
                  style={{
                    marginTop: "1.3rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(113,159,183,0.15)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.6rem"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em"
                      }}
                    >
                      {t.memoryTitle} ({profile.scanHistory?.length || 0} scans)
                    </span>
                    <button
                      type="button"
                      onClick={clearProfile}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}
                    >
                      <Trash2 size={12} />
                      <span>{t.clearMemory}</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {(profile.memories || []).map((mem, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "0.28rem 0.65rem",
                          background: "var(--bg-secondary)",
                          color: "var(--text-secondary)",
                          fontSize: "0.75rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <span>{mem}</span>
                        <button
                          type="button"
                          onClick={() => removeMemory(idx)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab Unlock Modal (available in unlocked view if needed) */}
        {renderUnlockModal()}
      </div>
    </main>
  );
}
