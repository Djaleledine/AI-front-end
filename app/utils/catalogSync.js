/**
 * ANJUCIA Zero-Hardcoding Dynamic Product Catalog & 58-Wilaya Bioclimatic Sync
 *
 * Extracts all current products from ANJUCIA_PRODUCTS + real-time /admin overrides
 * (custom price in DA, stock status, or newly added formulas) so DermoScan AI™
 * adapts in real time with zero code or prompt edits.
 */

import { ANJUCIA_PRODUCTS, AVAILABLE_PRODUCT_ID, ALGERIAN_WILAYAS } from "../data/products";

const CATEGORY_CONCERNS_MAP = {
  hydratation: [
    "Déshydratation épidermique (TEWL)",
    "Tiraillements après lavage à l'eau calcaire",
    "Brillance zone T & pores dilatés (séborrhée réactionnelle)",
    "Rougeurs, échauffements & barrière cutanée fragilisée"
  ],
  "anti-age": [
    "Ridules de déshydratation thermique",
    "Perte de fermeté & élasticité",
    "Stress oxydatif & photovieillissement",
    "Renouvellement cellulaire ralenti"
  ],
  solaire: [
    "Photoprotection UV extrême (Indice UV > 10)",
    "Prévention des taches pigmentaires & mélasma",
    "Protection cellulaire thermique & anti-sirocco"
  ],
  reparation: [
    "Barrière lipidique rompue & desquamation",
    "Sécheresse sévère sous climat aride",
    "Récupération nocturne post-exposition solaire"
  ],
  nettoyant: [
    "Nettoyage doux pH 5.5 sans sulfates",
    "Protection du manteau acide face au calcaire",
    "Élimination du sébum oxydé & poussières fines"
  ]
};

/**
 * Dynamically extracts the live ANJUCIA catalog, merging base product definitions
 * with any real-time /admin state overrides (price in DA, stock status, custom products).
 *
 * @param {Object} [externalOverrides] Optional overrides passed from client/admin
 * @returns {Array<Object>} Structured live catalog array
 */
export function getLiveAnjuciaCatalog(externalOverrides = null) {
  let customPrice = null;
  let customStock = null;
  let customCatalogMap = {};
  let extraAdminProducts = [];

  // Apply authoritative server catalog overrides if provided
  if (externalOverrides && typeof externalOverrides === "object") {
    if (typeof externalOverrides.flagshipPrice === "number") {
      customPrice = externalOverrides.flagshipPrice;
    }
    if (typeof externalOverrides.flagshipInStock === "boolean") {
      customStock = externalOverrides.flagshipInStock;
    }
    if (Array.isArray(externalOverrides.products)) {
      externalOverrides.products.forEach((item) => {
        if (item && item.id) {
          customCatalogMap[item.id] = item;
        }
      });
    }
  }

  // Merge base products with any dynamic admin additions
  const baseIds = new Set(ANJUCIA_PRODUCTS.map((p) => p.id));
  Object.values(customCatalogMap).forEach((item) => {
    if (!baseIds.has(item.id)) {
      extraAdminProducts.push(item);
    }
  });

  const combinedProducts = [...ANJUCIA_PRODUCTS, ...extraAdminProducts];

  return combinedProducts.map((rawProduct) => {
    const override = customCatalogMap[rawProduct.id] || {};
    const product = { ...rawProduct, ...override };
    const isFlagship = product.id === AVAILABLE_PRODUCT_ID;

    const livePriceDZD =
      isFlagship && typeof customPrice === "number" && customPrice > 0
        ? customPrice
        : typeof product.priceDZD === "number"
        ? product.priceDZD
        : 1800;

    let liveStatus = "pre_order";
    if (isFlagship) {
      const inStock = customStock !== null ? customStock : true;
      liveStatus = inStock ? "in_stock" : "out_of_stock";
    } else if (product.status === "available" || product.status === "in_stock") {
      liveStatus = "in_stock";
    } else if (product.status === "out_of_stock") {
      liveStatus = "out_of_stock";
    }

    const actives = Array.isArray(product.actives)
      ? product.actives.map((a) => ({
          name: a.name,
          percentage: a.percentage,
          role: a.role
        }))
      : [];

    const activesSummary = actives
      .map((a) => `${a.name} (${a.percentage})`)
      .join(", ");

    const targetSkinConcerns = product.targetSkinConcerns || [
      ...(CATEGORY_CONCERNS_MAP[product.category] || []),
      ...(product.benefitClaim ? [product.benefitClaim] : [])
    ];

    return {
      id: product.id,
      slug: product.id,
      name: product.name,
      frenchName: product.frenchName || product.name,
      subtitle: product.subtitle || "",
      category: product.category || "hydratation",
      volume: product.volume || "50 ml",
      priceDZD: livePriceDZD,
      priceFormatted: `${livePriceDZD.toLocaleString("fr-FR")} DA`,
      actives,
      activesSummary,
      targetSkinConcerns,
      status: liveStatus,
      isPurchasable: liveStatus === "in_stock",
      technicalSpecs: {
        format: product.technicalSpecs?.format || "Émulsion H/E",
        ph: product.technicalSpecs?.ph || "5.2 physiologique",
        texture: product.technicalSpecs?.texture || "Ultra-légère non grasse"
      },
      description: product.description || ""
    };
  });
}

/**
 * Classifies any of the 58 Algerian Wilayas into its clinical bioclimatic profile.
 */
export function classifyWilayaClimate(wilayaStr = "16 - Alger") {
  const codeMatch = String(wilayaStr).match(/^(\d{1,2})/);
  const code = codeMatch ? parseInt(codeMatch[1], 10) : 16;

  // Saharan & Pre-Saharan Arid Wilayas
  const saharanCodes = new Set([
    1, 3, 7, 8, 11, 30, 32, 33, 37, 39, 45, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58
  ]);

  // Coastal Mediterranean Humid + Hard Calcaire Tap Water Wilayas
  const coastalCodes = new Set([
    2, 6, 9, 13, 15, 16, 18, 21, 23, 27, 31, 35, 36, 42, 46
  ]);

  if (saharanCodes.has(code)) {
    return {
      zoneId: "saharan_arid",
      wilaya: wilayaStr,
      label: {
        fr: "Climat Saharien & Aride (Chaleur 45°C, Vent de Sable / Sirocco & Air Hyper-Sec)",
        en: "Saharan Hyper-Arid Climate (45°C Heat, Sirocco Wind & Extreme Low Humidity)",
        dz: "مناخ صحراوي جاف (حرارة 45°C، رياح الشهيلي وجفاف شديد)"
      },
      humidityRange: "10% – 25%",
      waterHardness: "Élevée (Minéralisation saharienne)",
      uvIndex: "Extrême (10 – 12+)",
      clinicalStressors: [
        "Perte insensible en eau (TEWL) accélérée par l'air sec (<20% humidité)",
        "Stress thermique à 45°C provoquant une vasodilatation et des rougeurs",
        "Micro-abrasion de la barrière lipidique par les poussières fines et le Sirocco"
      ]
    };
  }

  if (coastalCodes.has(code)) {
    return {
      zoneId: "coastal_calcaire",
      wilaya: wilayaStr,
      label: {
        fr: "Climat Méditerranéen Humide & Eau Très Calcaire (Ca²⁺/Mg²⁺)",
        en: "Coastal Humid Climate & Hard Calcaire Tap Water (Ca²⁺/Mg²⁺)",
        dz: "مناخ ساحلي رطب مع ماء حنفية غني بالكلس (Calcaire)"
      },
      humidityRange: "65% – 85%",
      waterHardness: "Très Élevée (Eau dure riche en ions Ca²⁺ et Mg²⁺, pH > 7.8)",
      uvIndex: "Élevé à Très Élevé (8 – 10)",
      clinicalStressors: [
        "Oxydation du sébum en zone T sous l'effet combiné de l'humidité marine et de la pollution urbaine",
        "Dépôts de sels de calcium (Ca²⁺/Mg²⁺) de l'eau du robinet qui alcalinisent le manteau acide (pH 5.2)",
        "Risque de comédons fermés si utilisation de crèmes riches ou occlusives"
      ]
    };
  }

  // Default: Continental High Plateau (Hauts Plateaux)
  return {
    zoneId: "continental_plateau",
    wilaya: wilayaStr,
    label: {
      fr: "Climat Continental des Hauts Plateaux (Amplitude Thermique, Vent Sec & Eau Calcaire)",
      en: "Continental High Plateau Climate (Sharp Thermal Swings, Dry Wind & Hard Water)",
      dz: "مناخ الهضاب العليا القاري (تقلبات الحرارة، رياح جافة وماء كلسي)"
    },
    humidityRange: "30% – 50%",
    waterHardness: "Élevée (Calcaire continental)",
    uvIndex: "Très Élevé en altitude (9 – 11)",
    clinicalStressors: [
      "Chocs thermiques jour/nuit fragilisant la cohésion des cornéocytes",
      "Déshydratation des joues (Zone U) combinée à une réactivité vasculaire au froid/chaleur",
      "Eau calcaire alcaline accentuant les tiraillements post-nettoyage"
    ]
  };
}

export { ALGERIAN_WILAYAS };

