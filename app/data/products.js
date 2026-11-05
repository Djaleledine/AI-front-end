/**
 * ANJUCIA Dermaceutical Products & Formulation Database
 * Formulated specifically for extreme North African & Algerian bioclimatic demands
 */

export const ANJUCIA_PRODUCTS = [
  {
    id: "soothing-gel-cream",
    name: "Lightweight Soothing Face Gel-Cream",
    frenchName: "Gel-Crème Apaisant Ultra-Léger",
    subtitle: "Émulsion H/E Équilibrante & Apaisante • Fini Zéro Brillance",
    category: "hydratation",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Tube Protecteur 50 ml (Haute Précision & Hygiène)",
    priceDZD: 1800,
    badge: "FORMULATION AVANCÉE",
    isHero: true,
    isNew: true,
    image: "/assets/soothing-gel-cream.svg",
    description: "Anjucia est une émulsion ultra-légère au fini pulpeux, velouté et naturellement satiné conçue pour protéger votre peau de la chaleur et de la déshydratation. Sa formule scientifique associe de la Niacinamide (3%), du Panthénol B5 (2%), de la Centella (1%), du Squalane (3%) et bien d'autres actifs experts qui agissent en synergie. Résultat ? Une peau intensément désaltérée et apaisée, sans effet gras, prix tout doux.",
    actives: [
      { name: "Niacinamide (Vitamine B3)", percentage: "3.0%", role: "Renforcement barrière & régulation sébacée" },
      { name: "Panthénol (Pro-Vitamine B5)", percentage: "2.0%", role: "Apaisement immédiat & hydratation" },
      { name: "Extrait de Centella Asiatica", percentage: "1.0%", role: "Bouclier végétal apaisant" },
      { name: "Bêta-Glucane Pur", percentage: "1.0%", role: "Défense de la barrière cutanée & confort" },
      { name: "Squalane Végétal", percentage: "3.0%", role: "Émollient biomimétique léger non-comédogène" },
      { name: "Double Acide Hyaluronique", percentage: "0.2%", role: "0.1% Bas PM (pénétration) + 0.1% Haut PM (plumping)" },
      { name: "Allantoïne", percentage: "0.2%", role: "Calmant cellulaire & réduction des échauffements" }
    ],
    technicalSpecs: {
      format: "Gel-Crème émulsion Huile dans Eau (H/E)",
      ph: "5.0 – 5.5 physiologique",
      texture: "Fraîche, aqueuse, pénétration en 30 secondes sans résidu gras",
      packaging: "Tube protecteur hygiénique pour préserver les actifs"
    },
    rating: 4.97,
    reviewsCount: 148,
    benefitClaim: "Absorption express en 30s • Apaisement cutané visible • pH 5.2"
  },
  {
    id: "anti-aging-serum",
    name: "Anti-aging Serum",
    frenchName: "Sérum Anti-Âge Haute Précision",
    subtitle: "Régénération Cellulaire & Lissage des Rides Sous Climat Aride",
    category: "anti-age",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Pot Verre Givré Traité Anti-UV",
    priceDZD: 3800,
    originalPriceDZD: 4500,
    badge: "HERO INNOVATION SAHARA",
    isHero: true,
    isNew: false,
    image: "/assets/cerahydra-cream.svg",
    description: "Sérum anti-âge haute précision formulé pour relancer le renouvellement cellulaire et lisser les ridules accentuées par la chaleur et le climat sec.",
    actives: [
      { name: "Complexe Rétinol-Like & Peptides", percentage: "2.4%", role: "Stimulation collagène & fermeté" },
      { name: "5 Céramides Biomimétiques", percentage: "3.5%", role: "Renforcement barrière & souplesse" },
      { name: "Panthénol Pro-Vitamine B5", percentage: "2.0%", role: "Protection cellulaire thermique" }
    ],
    technicalSpecs: {
      format: "Sérum fluide fondant",
      ph: "5.5",
      texture: "Pénétration immédiate, fini soyeux",
      packaging: "Flacon verre haute densité"
    },
    rating: 4.96,
    reviewsCount: 384,
    benefitClaim: "Régénération cutanée visible • Lissage des ridules"
  },
  {
    id: "active-repair-spf50",
    name: "Active Repair 50+ SPF Sunscreen",
    frenchName: "Soin Solaire Active Repair 50+ SPF",
    subtitle: "Très Haute Photoprotection & Réparation Barrière 50+ SPF",
    category: "solaire",
    volume: "100 ml ℮ 3.4 FL. OZ.",
    packaging: "Tube Pompe Haute Précision",
    priceDZD: 6200,
    originalPriceDZD: 7600,
    badge: "TRÈS HAUTE PROTECTION",
    isHero: true,
    isNew: false,
    image: "/assets/cerahydra-cream.svg",
    description: "Photoprotection solaire avancée SPF 50+ anti-UV algériens extrêmes combinée à une réparation active du ciment lipidique.",
    actives: [
      { name: "Filtres Solaires Photostables SPF 50+", percentage: "Large Spectre", role: "UVA, UVB & Infrarouges" },
      { name: "Complexe Réparateur Céramides", percentage: "3.5%", role: "Restauration barrière lipidique" },
      { name: "Acide Hyaluronique", percentage: "2.4%", role: "Hydratation continue anti-dessèchement" }
    ],
    technicalSpecs: {
      format: "Fluide fondant invisible",
      ph: "5.5",
      texture: "Toucher sec non gras, résistant à la chaleur",
      packaging: "Tube haute protection 100 ml"
    },
    rating: 4.98,
    reviewsCount: 192,
    benefitClaim: "Zéro trace blanche • Fini invisible • Protection SPF 50+"
  },
  {
    id: "bioshield-spf50",
    name: "BioShield Fluide Invisible SPF 50+ PA++++",
    frenchName: "Bouclier Anti-Évaporation & Photoprotection",
    subtitle: "Défense Ultime Indice UV > 10 & Anti-TEWL",
    category: "solaire",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Flacon Shaker Haute Précision",
    priceDZD: 2600,
    originalPriceDZD: 3100,
    badge: "FILTRES PHOTOSTABLES HAUTE TOLÉRANCE",
    isHero: false,
    isNew: false,
    image: "/assets/bioshield-spf50.svg",
    description: "Protection solaire invisible dermaceutique résistante à la transpiration, au vent de sable et à l'eau. Zéro traces blanches, fini sec 100% mat.",
    actives: [
      { name: "Filtres Mexoryl-Grade Photostables", percentage: "Broad Spectrum", role: "UVA, UVB, Lumière Visible & Infrarouges" },
      { name: "Panthénol Pro-Vitamine B5", percentage: "1.5%", role: "Protection des cellules contre le stress thermique" },
      { name: "Micro-Sphères d'Eau Osmotiques", percentage: "2.0%", role: "Frein à l'évaporation insensible sous soleil intense" }
    ],
    technicalSpecs: {
      format: "Fluide ultra-léger shaker",
      ph: "6.0",
      texture: "Toucher sec poudré, non gras, résistant au sable",
      packaging: "Flacon doseur avec bille de mélange"
    },
    rating: 4.93,
    reviewsCount: 220,
    benefitClaim: "Zéro trace blanche • Toucher sec immédiat • Résiste au sable"
  },
  {
    id: "ectorepair-balm",
    name: "Ecto-Repair Night Recovery Balm",
    frenchName: "Baume Nuit Réparation Nocturne",
    subtitle: "Régénération des Lipides Pendant le Sommeil",
    category: "reparation",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Pot Cosmétique Hermétique",
    priceDZD: 3400,
    originalPriceDZD: 4000,
    badge: "SOIN NOCTURNE CELLULAIRE",
    isHero: false,
    isNew: false,
    image: "/assets/ectorepair-balm.svg",
    description: "Baume fondant qui enveloppe la peau d'un cocon protecteur nocturne pour restaurer le ciment lipidique dégradé pendant la journée par le vent sec et la pollution.",
    actives: [
      { name: "Lipides de Datte du Sahara", percentage: "3.0%", role: "Acides gras essentiels bio-compatibles" },
      { name: "Céramides & Panthénol B5", percentage: "2.5%", role: "Accélération du renouvellement cellulaire de nuit" },
      { name: "Phytostérols Purs", percentage: "1.0%", role: "Anti-inflammatoire et apaisement des tiraillements" }
    ],
    technicalSpecs: {
      format: "Baume fondant velours",
      ph: "5.4",
      texture: "Fond au contact de la chaleur de la peau, fini satiné",
      packaging: "Pot double paroi anti-oxydation"
    },
    rating: 4.91,
    reviewsCount: 110,
    benefitClaim: "98% de réparation de barrière mesurée après 7 nuits"
  },
  {
    id: "dermocleanse-gel",
    name: "DermoCleanse Gentle Hydrating Emulsion",
    frenchName: "Émulsion Nettoyante Douce Sans Savon",
    subtitle: "Nettoyage Physiologique Respectueux pH 5.5",
    category: "nettoyant",
    volume: "200 ml ℮ 6.7 FL. OZ.",
    packaging: "Grand Flacon Pompe Verrouillable",
    priceDZD: 1850,
    originalPriceDZD: 2200,
    badge: "ZÉRO DÉCAPAGE • SANS SULFATES",
    isHero: false,
    isNew: false,
    image: "/assets/dermocleanse-gel.svg",
    description: "Nettoie le maquillage, le sébum oxydé et la poussière sans agresser le manteau acide protecteur ni dissoudre les lipides physiologiques.",
    actives: [
      { name: "Tensioactifs d'Acides Aminés", percentage: "Doux & Biodégradables", role: "Mousse onctueuse sans délipidation" },
      { name: "Glycérine Végétale Pure", percentage: "8.0%", role: "Humectant immédiat durant le rinçage" },
      { name: "Hydrolat Minéral Thermal", percentage: "5.0%", role: "Apaisement de la réactivité au calcaire de l'eau" }
    ],
    technicalSpecs: {
      format: "Émulsion gélifiée translucide",
      ph: "5.5 physiologique strict",
      texture: "Douce, se rince facilement sans laisser de film collant",
      packaging: "Flacon pompe 200 ml sécurisé"
    },
    rating: 4.87,
    reviewsCount: 265,
    benefitClaim: "Respecte scrupuleusement le film hydrolipidique • pH 5.5 certifié"
  }
];

/**
 * Launch configuration: only one product is purchasable for now.
 * Every other formula is shown as "coming soon" (no images, no price, no add-to-cart).
 */
export const AVAILABLE_PRODUCT_ID = "soothing-gel-cream";

ANJUCIA_PRODUCTS.forEach((p) => {
  p.status = p.id === AVAILABLE_PRODUCT_ID ? "available" : "coming_soon";
  p.image = null; // No product photography yet — UI renders an animated droplet placeholder
});

export const FLAGSHIP_PRODUCT = ANJUCIA_PRODUCTS.find((p) => p.id === AVAILABLE_PRODUCT_ID);
export const COMING_SOON_PRODUCTS = ANJUCIA_PRODUCTS.filter((p) => p.status === "coming_soon");
export const isPurchasable = (id) => id === AVAILABLE_PRODUCT_ID;

export const ALGERIAN_WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt",
  "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];
