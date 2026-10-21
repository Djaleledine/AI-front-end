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
    packaging: "Tube Canule Haute Précision (Anti-Contamination, Zéro Panne de Pompe)",
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
      packaging: "Tube à embout canule effilé évitant les défaillances de pompe"
    },
    rating: 4.97,
    reviewsCount: 148,
    benefitClaim: "Absorption express en 30s • Apaisement cutané visible • pH 5.2"
  },
  {
    id: "cerahydra-cream-50",
    name: "CeraHydra+ Cellular Barrier Cream",
    frenchName: "Crème Barrière Cellulaire 72H",
    subtitle: "Restauration des Ponts Lipidiques Sous Climat Aride",
    category: "reparation",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Pot Verre Givré Traité Anti-UV",
    priceDZD: 3800,
    originalPriceDZD: 4500,
    badge: "HERO INNOVATION SAHARA",
    isHero: true,
    isNew: false,
    image: "/assets/cerahydra-cream.svg",
    description: "Soin barrière cellulaire intensif formulé pour faire face aux agressions thermiques extrêmes du Sahara et du littoral. Infuse un complexe biomimétique de 5 céramides (3:1:1) et de bio-ferment de datte du désert.",
    actives: [
      { name: "Complexe 7x Acide Hyaluronique", percentage: "2.4%", role: "Multi-poids pour hydratation en surface et en profondeur" },
      { name: "5 Céramides Biomimétiques (NP/AP/EOP)", percentage: "3.5%", role: "Ratio physiologique 3:1:1 avec cholestérol" },
      { name: "Bio-Ferment de Datte du Sahara", percentage: "1.8%", role: "Résilience thermique & osmo-protection" },
      { name: "Éctoïne Pure", percentage: "2.0%", role: "Extrémolyte protégeant contre le choc salin et UV" },
      { name: "Niacinamide", percentage: "5.0%", role: "Stimulation de la filaggrine et des lipides" }
    ],
    technicalSpecs: {
      format: "Émulsion riche fondante",
      ph: "5.5",
      texture: "Onctueuse, scellement protecteur longue durée 72H",
      packaging: "Verre givré recyclable haute densité"
    },
    rating: 4.96,
    reviewsCount: 384,
    benefitClaim: "+148% d'hydratation immédiate en 15 min • Scellement 72h"
  },
  {
    id: "cerahydra-cream-100",
    name: "CeraHydra+ Format Économique 100ml",
    frenchName: "Grand Format Économique 60 Jours",
    subtitle: "Cure de Continuité pour Peaux Sèches & Déshydratées",
    category: "reparation",
    volume: "100 ml ℮ 3.4 FL. OZ.",
    packaging: "Double Contenance Avancée",
    priceDZD: 6200,
    originalPriceDZD: 7600,
    badge: "MEILLEURE VALEUR ÉCONOMIQUE",
    isHero: true,
    isNew: false,
    image: "/assets/cerahydra-cream.svg",
    description: "Double format économique idéal pour couvrir un cycle complet de renouvellement de 60 jours.",
    actives: [
      { name: "Matrice 3:1:1 Céramides & Lipides", percentage: "3.5%", role: "Reconstruction continue du ciment épidermique" },
      { name: "Bio-Ferment de Datte du Sahara", percentage: "1.8%", role: "Bouclier anti-déshydratation thermique" },
      { name: "7x Acide Hyaluronique", percentage: "2.4%", role: "Repulpage multi-profondeurs" }
    ],
    technicalSpecs: {
      format: "Émulsion riche réparatrice",
      ph: "5.5",
      texture: "Confort suprême pour peaux très sèches",
      packaging: "Flacon verre 100 ml"
    },
    rating: 4.98,
    reviewsCount: 192,
    benefitClaim: "Économie de 1 400 DZD • Traitement complet du cycle épidermique"
  },
  {
    id: "aqualipid-essence",
    name: "AquaLipid Hydro-Infusion Essence",
    frenchName: "Essence Pré-Infusion Hydratante",
    subtitle: "Préparation & Hydratation Légère du Teint",
    category: "hydratation",
    volume: "100 ml ℮ 3.4 FL. OZ.",
    packaging: "Flacon Compte-Gouttes Précision",
    priceDZD: 2900,
    originalPriceDZD: 3400,
    badge: "BOOSTER D'ABSORPTION 3.2X",
    isHero: false,
    isNew: false,
    image: "/assets/aqualipid-essence.svg",
    description: "Essence aqueuse ultra-pénétrante formulée pour préparer la peau et optimiser l'absorption de votre crème ou gel-crème.",
    actives: [
      { name: "Acide Polyglutamique (PGA)", percentage: "1.5%", role: "Retient l'eau pour un toucher repulpé et frais" },
      { name: "Centella Asiatica Titrée", percentage: "1.0%", role: "Apaisement et confort immédiat" },
      { name: "Panthénol Pro-Vitamine B5", percentage: "4.0%", role: "Hydratation profonde & souplesse" }
    ],
    technicalSpecs: {
      format: "Essence aqueuse fluide ultra-légère",
      ph: "5.2",
      texture: "Fraîche comme l'eau, pénétration instantanée",
      packaging: "Flacon doseur avec pipette compte-gouttes"
    },
    rating: 4.88,
    reviewsCount: 145,
    benefitClaim: "Multiplie par 3 l'absorption des soins barrières suivants"
  },
  {
    id: "bioshield-spf50",
    name: "BioShield Fluide Invisible SPF 50+ PA++++",
    frenchName: "Bouclier Anti-Évaporation & Photoprotection",
    subtitle: "Défense Ultime Indice UV > 10 & Anti-TEWL",
    category: "solaire",
    volume: "50 ml ℮ 1.7 FL. OZ.",
    packaging: "Flacon Agitateur Canule Précision",
    priceDZD: 2600,
    originalPriceDZD: 3100,
    badge: "FILTRES PHOTOSTABLES HAUTE TOLÉRANCE",
    isHero: false,
    isNew: false,
    image: "/assets/bioshield-spf50.svg",
    description: "Protection solaire invisible dermaceutique résistante à la transpiration, au vent de sable et à l'eau. Zéro traces blanches, fini sec 100% mat.",
    actives: [
      { name: "Filtres Mexoryl-Grade Photostables", percentage: "Broad Spectrum", role: "UVA, UVB, Lumière Visible & Infrarouges" },
      { name: "Éctoïne Pure", percentage: "1.5%", role: "Protection des cellules contre l'apoptose thermique" },
      { name: "Micro-Sphères d'Eau Osmotiques", percentage: "2.0%", role: "Frein à l'évaporation insensible sous soleil intense" }
    ],
    technicalSpecs: {
      format: "Fluide ultra-léger shaker",
      ph: "6.0",
      texture: "Toucher sec poudré, non gras, résistant au sable",
      packaging: "Flacon canule précision avec bille de mélange"
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
      { name: "Éctoïne Médicale", percentage: "2.5%", role: "Accélération du renouvellement cellulaire de nuit" },
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
