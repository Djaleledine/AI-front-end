/**
 * ANJUCIA Centralized Mock API SDK ("mock")
 * 
 * Provides a decoupled data layer for the entire application.
 * Designed to mirror future backend microservices / REST API contracts.
 * 
 * Usage:
 *   import { mock } from "@/services/mockApi";
 *   const products = await mock.products.getAll();
 *   const product = await mock.products.getById("soothing-gel-cream");
 *   const bundles = await mock.bundles.getAll();
 *   const rituals = await mock.rituals.getAll();
 *   const reviews = await mock.reviews.getAll();
 *   const pharmacies = await mock.pharmacies.getAll();
 *   const wilayas = await mock.wilayas.getAll();
 *   const presets = await mock.analyzer.getPresets();
 *   const scanResult = await mock.analyzer.scan(userData);
 *   const orderResult = await mock.orders.create(orderPayload);
 */

import { ANJUCIA_PRODUCTS, ALGERIAN_WILAYAS } from "../data/products";
import { CLINICAL_PRESETS } from "../data/analyzerData";

// --- Mock Database Stores ---

export const MOCK_BUNDLES = [
  {
    id: "solo",
    badge: { fr: "ESSENTIEL FORMULATEUR", en: "SOLO STAR CARE", dz: "المنتج النجم" },
    name: { fr: "Soin Seul Soothing Gel-Cream", en: "Single Soothing Gel-Cream", dz: "جل-كريم المرطب والمهدئ" },
    subtitle: { fr: "50 ml • Tube canule précision", en: "50 ml • Precision nozzle tube", dz: "50 مل • أنبوب كانول دقيق" },
    priceDZD: 1500,
    priceFormatted: "1 500 DA",
    originalPriceDZD: 2000,
    items: ["soothing-gel-cream"],
    features: [
      { fr: "Niacinamide pure 3% + Panthénol 2%", en: "Pure 3% Niacinamide + 2% Panthenol", dz: "نياسيناميد 3% وبانتينول B5 2%" },
      { fr: "Centella 1% + Squalane 3%", en: "1% Centella + 3% Squalane", dz: "سنتيلا 1% وسكوالان 3%" },
      { fr: "QR code scellé : abonnement VIP inclus", en: "Sealed QR code: VIP subscription included", dz: "كود QR مختوم : اشتراك تلقائي VIP" },
      { fr: "Expédition rapide 58 Wilayas", en: "Fast 58 Wilayas dispatch", dz: "توصيل سريع لـ 58 ولاية" }
    ],
    isPopular: false,
    freeDelivery: false
  },
  {
    id: "duo",
    badge: { fr: "⭐ LE PLUS POPULAIRE • LIVRAISON OFFERTE", en: "⭐ BESTSELLER • FREE SHIPPING", dz: "⭐ الأكثر طلباً • توصيل مجاني" },
    name: { fr: "Pack Duo Jour & Nuit", en: "Day & Night Duo Pack", dz: "باك ثنائي النهار والليل" },
    subtitle: { fr: "Gel-Cream 50ml + CeraHydra+ 50ml", en: "Gel-Cream 50ml + CeraHydra+ 50ml", dz: "جل-كريم 50مل + كريم سيراهيدرا 50مل" },
    priceDZD: 4200,
    priceFormatted: "4 200 DA",
    originalPriceDZD: 5300,
    items: ["soothing-gel-cream", "cerahydra-cream-50"],
    features: [
      { fr: "Matité apaisante le jour + Réparation 72H la nuit", en: "Matte soothing by day + 72H barrier repair by night", dz: "ترطيب ومات فالنهار + ترميم عميق فالليل" },
      { fr: "QR code scellé : suivi personnalisé automatique", en: "Sealed QR code: automatic personalized tracking", dz: "كود QR مختوم : متابعة روتين شخصية" },
      { fr: "Livraison Wilaya 100% Gratuite", en: "Free Delivery to all 58 Wilayas", dz: "توصيل مجاني 100% لولايتك" },
      { fr: "Économie de 800 DZD sur les frais", en: "Saves 800 DZD in shipping fees", dz: "توفير 800 دج تاع التوصيل" }
    ],
    isPopular: true,
    freeDelivery: true
  },
  {
    id: "total",
    badge: { fr: "BOUCLIER TOTAL CLIMAT ALGÉRIE", en: "FULL CLIMATE SHIELD PACK", dz: "باك الحماية القصوى للمناخ" },
    name: { fr: "Routine Complète 3 Soins", en: "Complete 3-Step Routine", dz: "الروتين الشامل 3 منتجات" },
    subtitle: { fr: "Gel-Cream + CeraHydra+ 100ml + BioShield SPF", en: "Gel-Cream + CeraHydra+ 100ml + BioShield SPF", dz: "جل-كريم + كريم 100مل + واقي شمس" },
    priceDZD: 6900,
    priceFormatted: "6 900 DA",
    originalPriceDZD: 8600,
    items: ["soothing-gel-cream", "cerahydra-cream-100", "bioshield-spf50"],
    features: [
      { fr: "Protection intégrale : Apaisement, Barrière 72H & SPF 50+", en: "Full protection: Soothing, 72H Barrier & SPF 50+", dz: "حماية قصوى : ترطيب، حاجز 72 ساعة وحماية شمس SPF 50+" },
      { fr: "Format 100ml économique haute durabilité", en: "Long-lasting 100ml eco-size", dz: "حجم اقتصادي 100مل يدوم طويلا" },
      { fr: "Livraison Express Prioritaire 58 Wilayas Gratuite", en: "Free Priority Express Delivery across 58 Wilayas", dz: "توصيل سريع أولوي مجاني لـ 58 ولاية" },
      { fr: "Consultation WhatsApp experte offerte", en: "Free expert WhatsApp routine consultation", dz: "استشارة روتين عبر واتساب مهداة" }
    ],
    isPopular: false,
    freeDelivery: true
  }
];

export const MOCK_RITUALS = [
  {
    id: "argan-oil",
    name: {
      fr: "Huile d'Argan Pure pressée à froid",
      en: "Pure Cold-Pressed Argan Oil",
      dz: "زيت الأركان النقي المعصور على البارد"
    },
    subtitle: {
      fr: "Acides Gras Essentiels & Vitamine E",
      en: "Essential Fatty Acids & Vitamin E",
      dz: "أحماض دهنية أساسية وفيتامين E"
    },
    iconBg: "rgba(230, 162, 60, 0.15)",
    iconColor: "#D99B38",
    image: "/assets/argan-oil.svg",
    baseDrops: 2,
    dropUnit: { fr: "gouttes", en: "drops", dz: "قطرات" },
    synergyPercent: 98,
    telemetry: { hydra: 96, barrier: 98, comfort: 95 },
    textureOptions: {
      1: {
        title: { fr: "Fluide Léger Satiné", en: "Lightweight Satin Fluid", dz: "سائل خفيف ساتيني" },
        desc: {
          fr: "1 goutte d'Argan apporte un éclat sain immédiat sans alourdir les peaux normales à mixtes.",
          en: "1 drop of Argan provides an instant healthy glow without weighing down normal-to-combination skin.",
          dz: "قطرة واحدة تعطيك نضارة طبيعية وخفة مثالية للنهار."
        }
      },
      2: {
        title: { fr: "Émulsion Veloutée Nourrissante", en: "Velvety Nourishing Emulsion", dz: "مستحلب مخملي مغذي" },
        desc: {
          fr: "2 gouttes d'Huile d'Argan associées à notre Gel-Cream créent un film protecteur riche en tocophérols naturels sans aucun effet gras.",
          en: "2 drops of pure Argan Oil paired with our Gel-Cream creates a soft protective film rich in natural tocopherols without any greasy finish.",
          dz: "زوج قطرات مع جل-كريم أنجوسيا يشكلوا طبقة حماية غنية بالفيتامينات بلا ما يزيت وجهك كامل."
        }
      },
      3: {
        title: { fr: "Baume Protecteur Nuit Réparateur", en: "Intense Barrier Night Balm", dz: "بلسم ليلي مرمم ومكثف" },
        desc: {
          fr: "3 gouttes créent un enveloppement réconfortant pour réparer la barrière cutanée agressée par le vent sec et la chaleur.",
          en: "3 drops create a restorative cocoon to heal the skin barrier stressed by dry desert winds and heat.",
          dz: "3 قطرات لترميم حاجز البشرة المتضرر من حرارة الصيف والشهيلي."
        }
      }
    }
  },
  {
    id: "rose-water",
    name: {
      fr: "Hydrolat Pur d'Eau de Rose distillée",
      en: "Pure Distilled Rose Water",
      dz: "ماء الورد المقطر الصافي"
    },
    subtitle: {
      fr: "Tonifiant Astringent & Anti-Rougeurs",
      en: "Astringent Toner & Anti-Redness",
      dz: "مهدئ للاحمرار ومنعش للمسامات"
    },
    iconBg: "rgba(224, 109, 138, 0.15)",
    iconColor: "#D85D7C",
    image: "/assets/rose-water.svg",
    baseDrops: 1,
    dropUnit: { fr: "brumisation", en: "mist", dz: "رشة" },
    synergyPercent: 97,
    telemetry: { hydra: 98, barrier: 94, comfort: 99 },
    textureOptions: {
      1: {
        title: { fr: "Hydro-Gel Frais Ultra-Pénétrant", en: "Ultra-Fast Absorbing Hydro-Gel", dz: "هيدرو-جل خفيف سريع الامتصاص" },
        desc: {
          fr: "1 brumisation d'Eau de Rose rafraîchit le teint et permet au Panthénol 2% et à la Centella d'apaiser rapidement la peau échauffée.",
          en: "1 mist of Rose Water refreshes the complexion, allowing Panthenol 2% and Centella to instantly calm sun-stressed skin.",
          dz: "رشة واحدة من ماء الورد تنعش الوجه وتخلي البانتينول والسنتيلا يريحو البشرة في ثواني."
        }
      },
      2: {
        title: { fr: "Sérum Apaisant Anti-Rougeurs", en: "Calming Anti-Redness Serum", dz: "سيروم مهدئ للاحمرار" },
        desc: {
          fr: "2 brumisations optimisent l'hydratation intracellulaire et resserrent l'apparence des pores après une journée au soleil.",
          en: "2 mists optimize intracellular hydration and tighten the appearance of pores after a warm day.",
          dz: "رشتين تعطي ترطيب أعمق وتساعد على تقليص المسامات الواسعة."
        }
      },
      3: {
        title: { fr: "Bain de Fraîcheur Décongestionnant", en: "Decongesting Moisture Bath", dz: "انتعاش مائي مكثف" },
        desc: {
          fr: "Infusion désaltérante maximale pour réconforter les peaux très sensibles ou sujettes aux rougeurs persistantes.",
          en: "Maximum refreshing infusion to comfort very sensitive skin prone to persistent redness.",
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
      dz: "جل الألوفيرا الطبيعي 99%"
    },
    subtitle: {
      fr: "Polysaccharides Hydratants Purs",
      en: "Pure Hydrating Polysaccharides",
      dz: "سكريات نباتية مرطبة بعمق"
    },
    iconBg: "rgba(100, 180, 120, 0.15)",
    iconColor: "#5FA072",
    image: "/assets/aloe-vera.svg",
    baseDrops: 1,
    dropUnit: { fr: "noisette", en: "pea-size", dz: "كمية صغيرة" },
    synergyPercent: 99,
    telemetry: { hydra: 100, barrier: 95, comfort: 97 },
    textureOptions: {
      1: {
        title: { fr: "Fluide Cristallin Repulpant", en: "Plumping Crystalline Fluid", dz: "سائل بلوري ينفخ ويرطب" },
        desc: {
          fr: "1 noisette d'Aloe Vera apporte une sensation d'eau immédiate, scellée par le Squalane 3% et le Double Acide Hyaluronique.",
          en: "1 pea-size of Aloe Vera provides an instant burst of water, sealed in by 3% Squalane and Double Hyaluronic Acid.",
          dz: "الألوفيرا يدخل الماء لداخل خلايا البشرة، والسكوالان يقفل عليه باش ما يتبخرش."
        }
      },
      2: {
        title: { fr: "Masque-Gel Hydratation 72H", en: "72H Moisture Shield Gel", dz: "ماسك جل ترطيب 72 ساعة" },
        desc: {
          fr: "En proportion égale avec le Gel-Cream, crée un masque hydro-désaltérant qui désamorce les tiraillements en quelques minutes.",
          en: "In equal ratio with the Gel-Cream, forms an intense hydro-quenching veil that stops tightness within minutes.",
          dz: "بكميات متساوية، يعطيك قناع مائي يوقف إحساس التجباد ونقص الماء فالحين."
        }
      },
      3: {
        title: { fr: "Gelée SOS Après-Soleil", en: "SOS After-Sun Recovery Gel", dz: "جل مهدئ بعد التعرض للشمس" },
        desc: {
          fr: "Concentration riche pour régénérer la peau après une exposition solaire prolongée en Algérie.",
          en: "Rich concentration to restore and calm skin after prolonged sun exposure in Algerian heat.",
          dz: "تركيز عالي لإنقاذ وترميم البشرة المحروقة من الشمس."
        }
      }
    }
  },
  {
    id: "jojoba-oil",
    name: {
      fr: "Huile de Jojoba Vierge Biomimétique",
      en: "Biomimetic Pure Jojoba Oil",
      dz: "زيت الجوجوبا النقي الحيوي"
    },
    subtitle: {
      fr: "Cires Liquides Régulatrices de Sébum",
      en: "Sebum-Balancing Liquid Waxes",
      dz: "منظم لإفراز الدهون والزيوت"
    },
    iconBg: "rgba(180, 160, 80, 0.15)",
    iconColor: "#A69240",
    image: "/assets/jojoba-oil.svg",
    baseDrops: 1,
    dropUnit: { fr: "goutte", en: "drop", dz: "قطرة" },
    synergyPercent: 96,
    telemetry: { hydra: 94, barrier: 97, comfort: 93 },
    textureOptions: {
      1: {
        title: { fr: "Gelée Soyeuse Fini Mat Longue Tenue", en: "Silk-Touch Longwear Matte Gel", dz: "جل حريري مات طويل الأمد" },
        desc: {
          fr: "1 goutte aide à réguler les brillances de la zone T sans dessécher, sublimée par les 3% de Niacinamide pure d'ANJUCIA.",
          en: "1 drop regulates T-zone shine without drying out skin, boosted by ANJUCIA's 3% pure Niacinamide.",
          dz: "قطرة وحدة تنقص تزييت منطقة الـ T بلا ما تنشف الخدود، بمساعدة النياسيناميد 3%."
        }
      },
      2: {
        title: { fr: "Émulsion Équilibrante Protectrice", en: "Balancing Protective Emulsion", dz: "مستحلب واقي ومتوازن" },
        desc: {
          fr: "2 gouttes renforcent le ciment intercellulaire tout en préservant un toucher sec et poudré toute la journée.",
          en: "2 drops strengthen the skin barrier while preserving a dry, powdery velvety touch all day.",
          dz: "زوج قطرات يقويو حاجز البشرة مع الحفاظ على ملمس جاف وناعم طول النهار."
        }
      },
      3: {
        title: { fr: "Soin Bouclier Anti-Pollution", en: "Anti-Pollution Shield Treatment", dz: "عناية مضادة للغبار والتلوث" },
        desc: {
          fr: "Protège contre l'adhérence des poussières urbaines et du sable tout en matifiant durablement la zone médiane.",
          en: "Shields against urban dust adhesion and sand while providing long-lasting shine control on the mid-face.",
          dz: "يحمي البشرة من التصاق الغبار والرمل ويثبت المظهر المات الطبيعي."
        }
      }
    }
  }
];

export const MOCK_REVIEWS = [
  {
    id: "rev-1",
    author: "Kenza B.",
    location: "Alger (16)",
    rating: 5,
    verified: true,
    product: "Lightweight Soothing Face Gel-Cream",
    comment: {
      fr: "« Formule incroyable sous l'humidité d'Alger. Fini mat immédiat sans aucune brillance à midi, ma peau reste douce et fraîche toute la journée. »",
      en: "« Incredible formula under Algiers humidity. Instant matte finish with zero midday shine, my skin stays fresh and calm all day. »",
      dz: "« الجل-كريم هايل بزاف، وجهي دهني مع رطوبة العاصمة وكان ديما يبرق. هذا خفيف وبلا زيوت وخلى وجهي مرتاح ومات طول النهار. »"
    }
  },
  {
    id: "rev-2",
    author: "Mehdi L.",
    location: "Oran (31)",
    rating: 5,
    verified: true,
    product: "Lightweight Soothing Face Gel-Cream",
    comment: {
      fr: "« Le tube canule est une idée géniale : marre des pompes qui se bloquent avec la chaleur. Flacon hyper hygiénique, livraison en 48h à Oran. »",
      en: "« The cannula tube is a brilliant idea: tired of pumps jamming in hot weather. Very hygienic package, delivered in 48h to Oran. »",
      dz: "« التيوب كانول فكرة ذكية بزااف، كل سمانة كنت نشري برودوي ببومبة وتخسر فالحرارة. هذا عملي ونقي ووصلني الكولي في 48 ساعة. »"
    }
  },
  {
    id: "rev-3",
    author: "Samira T.",
    location: "Constantine (25)",
    rating: 5,
    verified: true,
    product: "Lightweight Soothing Face Gel-Cream",
    comment: {
      fr: "« Associé à 2 gouttes d'huile d'argan le soir, ma peau ne tiraille plus du tout sous le vent sec de Constantine. Très satisfaite. »",
      en: "« Paired with 2 drops of pure argan oil at night, my skin no longer feels tight against the dry Constantine wind. Very satisfied. »",
      dz: "« خلطتو مع شوية زيت أركان طبيعي فالليل كيما شفت فالروتين، وجهي ارتاح مالتقشار وجفاف البرد. منتج يستاهل 10/10. »"
    }
  },
  {
    id: "rev-4",
    author: "Fatima Z.",
    location: "Biskra (07)",
    rating: 5,
    verified: true,
    product: "CeraHydra+ Cellular Barrier Cream",
    comment: {
      fr: "« Avec les 45°C et le sirocco à Biskra, ma barrière cutanée était détruite. La CeraHydra+ a sauvé ma peau en 3 jours seulement. »",
      en: "« In 45°C and the sirocco wind in Biskra, my skin barrier was impaired. CeraHydra+ saved my skin in just 3 days. »",
      dz: "« مع السخانة تاع 45 درجة والشهيلي في بسكرة، وجهي كان متقشر وحارق. سيراهيدرا عاودت بناتلي وجهي في 3 أيام برك. »"
    }
  }
];

export const MOCK_PHARMACIES = [
  {
    id: "pharma-alger",
    name: "Pharmacie El Djazaïr",
    city: "Alger",
    wilaya: "16 - Alger",
    address: "Boulevard Didouche Mourad, Alger-Centre",
    phone: "+213 (0) 21 74 12 30",
    inStock: true,
    statusText: "En Stock Immédiat"
  },
  {
    id: "pharma-oran",
    name: "Pharmacie Méditerranée",
    city: "Oran",
    wilaya: "31 - Oran",
    address: "Boulevard de la Soummam / Front de Mer, Oran",
    phone: "+213 (0) 41 33 45 80",
    inStock: true,
    statusText: "En Stock Immédiat"
  },
  {
    id: "pharma-constantine",
    name: "Pharmacie du Rocher",
    city: "Constantine",
    wilaya: "25 - Constantine",
    address: "Cité Bellevue, Avenue Kennedy, Constantine",
    phone: "+213 (0) 31 92 18 44",
    inStock: true,
    statusText: "En Stock Immédiat"
  },
  {
    id: "pharma-ghardaia",
    name: "Parapharmacie des Oasis",
    city: "Ghardaïa & Biskra",
    wilaya: "47 - Ghardaïa",
    address: "Avenue du 1er Novembre, Ghardaïa",
    phone: "+213 (0) 29 88 40 12",
    inStock: true,
    statusText: "En Stock Immédiat"
  }
];

export const MOCK_WILAYAS_DATA = ALGERIAN_WILAYAS.map((wilayaStr, index) => {
  const code = (index + 1).toString().padStart(2, "0");
  const name = wilayaStr.split(" - ")[1] || wilayaStr;
  const isSouth = [
    "Adrar", "Tamanrasset", "Illizi", "Tindouf", "Béchar", "Ouargla", 
    "El Bayadh", "Naâma", "Ghardaïa", "Timimoun", "Bordj Badji Mokhtar", 
    "In Salah", "In Guezzam", "Djanet", "El Meniaa", "Touggourt"
  ].includes(name);

  return {
    code,
    name,
    fullName: wilayaStr,
    deliveryFeeDZD: isSouth ? 900 : 600,
    deliveryDays: isSouth ? "3 à 5 jours ouvrés" : "24h à 48h ouvrées",
    codAvailable: true
  };
});

// In-memory mock orders DB
const mockOrdersDb = [];

// Helper for safe client fetch
async function safeFetch(url, options) {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback silently to internal datasets
    }
  }
  return null;
}

// --- Public Mock API Interface ---

export const mock = {
  // Products endpoint
  products: {
    async getAll(filters = {}) {
      const apiResult = await safeFetch(`/api/mock/products${filters.category && filters.category !== "all" ? `?category=${filters.category}` : ""}`);
      if (apiResult && apiResult.data) return apiResult.data;

      let list = [...ANJUCIA_PRODUCTS];
      if (filters.category && filters.category !== "all") {
        list = list.filter((p) => p.category === filters.category);
      }
      return list;
    },

    async getById(id) {
      const apiResult = await safeFetch(`/api/mock/products/${id}`);
      if (apiResult && apiResult.data) return apiResult.data;

      return ANJUCIA_PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  // Bundles endpoint
  bundles: {
    async getAll() {
      const apiResult = await safeFetch("/api/mock/bundles");
      if (apiResult && apiResult.data) return apiResult.data;
      return MOCK_BUNDLES;
    }
  },

  // Botanicals and Rituals endpoint
  rituals: {
    async getAll() {
      const apiResult = await safeFetch("/api/mock/rituals");
      if (apiResult && apiResult.data) return apiResult.data;
      return MOCK_RITUALS;
    }
  },

  // Customer Reviews endpoint
  reviews: {
    async getAll() {
      const apiResult = await safeFetch("/api/mock/reviews");
      if (apiResult && apiResult.data) return apiResult.data;
      return MOCK_REVIEWS;
    }
  },

  // Partner Pharmacies endpoint
  pharmacies: {
    async getAll() {
      const apiResult = await safeFetch("/api/mock/pharmacies");
      if (apiResult && apiResult.data) return apiResult.data;
      return MOCK_PHARMACIES;
    }
  },

  // Algerian 58 Wilayas endpoint
  wilayas: {
    async getAll() {
      const apiResult = await safeFetch("/api/mock/wilayas");
      if (apiResult && apiResult.data) return apiResult.data;
      return MOCK_WILAYAS_DATA;
    }
  },

  // DermoScan AI presets and scan endpoint
  analyzer: {
    async getPresets() {
      const apiResult = await safeFetch("/api/mock/analyzer");
      if (apiResult && apiResult.data) return apiResult.data;
      return CLINICAL_PRESETS;
    },

    async scan(userData) {
      if (typeof window !== "undefined") {
        try {
          const res = await fetch("/api/mock/analyzer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
          });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch {
          // Fallback below
        }
      }
      return {
        scanId: `SCAN-${Date.now()}`,
        status: "COMPLETED",
        telemetry: {
          hydration: 42,
          barrierLipids: 50,
          tewlIndex: 38,
          sebumEquilibrium: 65,
          cellularResilience: 70
        },
        recommendedPrimary: "soothing-gel-cream",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Orders and COD checkout endpoint
  orders: {
    async create(orderPayload) {
      if (typeof window !== "undefined") {
        try {
          const res = await fetch("/api/mock/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
          });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch {
          // Fallback below
        }
      }

      const orderId = `DZ-ANJ-${Date.now().toString().slice(-6)}`;
      const order = {
        orderId,
        trackingCode: `YAL-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "CONFIRMED_PENDING_DISPATCH",
        paymentMethod: "COD_PAIEMENT_A_LA_LIVRAISON",
        createdAt: new Date().toISOString(),
        ...orderPayload
      };
      mockOrdersDb.push(order);
      return order;
    },

    async list() {
      const apiResult = await safeFetch("/api/mock/orders");
      if (apiResult && apiResult.data) return apiResult.data;
      return mockOrdersDb;
    }
  }
};

export const mockApi = mock;
export default mock;
