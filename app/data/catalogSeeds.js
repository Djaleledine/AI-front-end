import { ALGERIAN_WILAYAS } from "./products";

export const CATALOG_BUNDLES = [
  {
    id: "solo",
    badge: { fr: "ESSENTIEL FORMULATEUR", en: "SOLO STAR CARE", dz: "المنتج النجم" },
    name: { fr: "Soin Seul Soothing Gel-Cream", en: "Single Soothing Gel-Cream", dz: "جل-كريم المرطب والمهدئ" },
    subtitle: { fr: "50 ml • Format Précision", en: "50 ml • Precision Format", dz: "50 مل • حجم دقيق وعملي" },
    priceDZD: 1800,
    priceFormatted: "1 800 DA",
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

export const CATALOG_REVIEWS = [
  {
    id: "rev-1",
    author: "Kenza B.",
    location: "Alger (16)",
    rating: 5,
    verified: true,
    visible: true,
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
    visible: true,
    product: "Lightweight Soothing Face Gel-Cream",
    comment: {
      fr: "« La texture est une idée géniale : ultra-légère et absorption immédiate sans effet gras. Flacon hyper hygiénique, livraison en 48h à Oran. »",
      en: "« The texture is brilliant: ultra-lightweight and absorbs immediately with no greasy feel. Very hygienic packaging, delivered in 48h to Oran. »",
      dz: "« التركيبة خفيفة بزااف وتمتصها البشرة تم-تم بلا ما تزيت. تعليب نقي وعملي ووصلني الكولي في 48 ساعة. »"
    }
  },
  {
    id: "rev-3",
    author: "Samira T.",
    location: "Constantine (25)",
    rating: 5,
    verified: true,
    visible: true,
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
    visible: true,
    product: "CeraHydra+ Cellular Barrier Cream",
    comment: {
      fr: "« Avec les 45°C et le sirocco à Biskra, ma barrière cutanée était détruite. La CeraHydra+ a sauvé ma peau en 3 jours seulement. »",
      en: "« In 45°C and the sirocco wind in Biskra, my skin barrier was impaired. CeraHydra+ saved my skin in just 3 days. »",
      dz: "« مع السخانة تاع 45 درجة والشهيلي في بسكرة، وجهي كان متقشر وحارق. سيراهيدرا عاودت بناتلي وجهي في 3 أيام برك. »"
    }
  }
];

export const PARTNER_PHARMACIES = [
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

export const WILAYAS_LOGISTICS = ALGERIAN_WILAYAS.map((wilayaStr, index) => {
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
    deliveryFeeDZD: isSouth ? 850 : code === "16" ? 400 : 600,
    deliveryDays: isSouth ? "3 à 5 jours ouvrés" : "24h à 48h ouvrées",
    codAvailable: true
  };
});

