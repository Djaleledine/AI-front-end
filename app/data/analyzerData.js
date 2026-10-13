/**
 * ANJUCIA DermoScan AI™ - Clinical Presets, Natural Synergy Engine & Substance Matrix
 * (Completely Brand-Free: Pairs ANJUCIA Clinical Care with Generic Pure Natural Staples)
 */

export const CLINICAL_PRESETS = {
  amina: {
    id: "amina",
    name: "Amina M. (28 ans)",
    location: "Alger (Méditerranée Côtière / Urbain)",
    image: "/assets/preset-amina.svg",
    symptoms: "Tiraillements intenses après le lavage, desquamation légère autour de la bouche, rougeurs et sensation d'échauffement sur les pommettes après exposition au soleil côtier d'Alger.",
    skinType: "Peau Déshydratée & Sensible avec Érythème Solaire",
    overallScore: 61,
    radar: {
      hydration: 34,
      lipidBarrier: 42,
      tewlResistance: 48,
      sebumBalance: 52,
      elasticity: 78
    },
    tewl: "26.8 g/m²/h (Élevé)",
    sensitivity: 74,
    keyDeficit: "Déshydratation du Stratum Corneum & Micro-Érythème Côtier",
    heatmapSpots: [
      { x: 38, y: 48, r: 18, intensity: "high", zone: "Joue Gauche (Érythème Solaire)" },
      { x: 62, y: 48, r: 18, intensity: "high", zone: "Joue Droite (Érythème Solaire)" },
      { x: 50, y: 62, r: 14, intensity: "medium", zone: "Zone Péribuccale Déshydratée" },
      { x: 50, y: 32, r: 15, intensity: "medium", zone: "Front Ridules Déshydratation" }
    ],
    diagnosis: "Déshydratation épidermique modérée combinée à une réactivité au soleil côtier algérois. Bénéficie d'un apaisement doux (Centella + Panthénol B5) et d'un renforcement de la barrière sans occlusion lourde.",
    skincareAssessment: "Déshydratation épidermique modérée combinée à une réactivité au soleil côtier algérois. Bénéficie d'un apaisement doux (Centella + Panthénol B5) et d'un renforcement de la barrière sans occlusion lourde.",
    primaryProduct: {
      id: "soothing-gel-cream",
      name: "ANJUCIA Lightweight Soothing Face Gel-Cream",
      role: "Cœur du Soin Apaisant & Barrière",
      priceDZD: 1500,
      reason: "Notre formule gel-crème H/E apporte 3% de Niacinamide et 2% de Panthénol pur pour apaiser la peau tout en scellant l'eau avec le Squalane et le double Acide Hyaluronique, sans film collant sous l'humidité côtière."
    },
    hybridRoutine: [
      {
        step: 1,
        phase: "Nettoyage & Tonification Végétale (AM / PM)",
        isOurProduct: false,
        brand: "Trésor Botanique Naturel",
        product: "Hydrolat Pur d'Eau de Rose Distillée",
        size: "200 ml",
        type: "Tonifiant Astringent Doux pH 5.5",
        priceEst: "800 DZD",
        action: "Vaporiser sur le visage propre matin et soir. Calme les tiraillements et tonifie la peau sans tensioactif agressif.",
        synergyWhy: "Rétablit le pH acide naturel et prépare idéalement l'épiderme à absorber le Panthénol 2% et la Centella d'ANJUCIA."
      },
      {
        step: 2,
        phase: "Nutrition Lipidique Végétale (Soir)",
        isOurProduct: false,
        brand: "Huile Botanique Pure",
        product: "Huile d'Argan Pure Vierge Pressée à Froid",
        size: "30 ml",
        type: "Huile Végétale Riche en Vitamine E",
        priceEst: "1 200 DZD",
        action: "Chauffer 2 gouttes dans la paume et tapoter délicatement sur les zones sèches le soir.",
        synergyWhy: "Les acides gras insaturés (oméga 6 et 9) et la vitamine E naturelle renforcent le Squalane biomimétique d'ANJUCIA pour bloquer la perte d'eau nocturne."
      },
      {
        step: 3,
        phase: "CŒUR DU SOIN QUOTIDIEN (Matin & Soir)",
        isOurProduct: true,
        ourProductId: "soothing-gel-cream",
        brand: "Maison ANJUCIA Algérie",
        product: "ANJUCIA Lightweight Soothing Face Gel-Cream",
        size: "50 ml • Tube Canule Précision",
        type: "Gel-Crème Apaisant & Barrière H/E",
        priceDZD: 1500,
        action: "Appliquer délicatement sur le visage et le cou. Fini satiné et velouté, absorption express en 30 secondes.",
        isHero: true,
        highlight: "Formule locale experte • Niacinamide 3% + Panthénol 2% + Centella 1% + Squalane 3%",
        synergyWhy: "Véritable ancre de la routine : scelle les actifs des étapes végétales avec son double acide hyaluronique, apaise et protège la barrière à pH 5.2."
      },
      {
        step: 4,
        phase: "Photoprotection Solaire Minérale (Matin)",
        isOurProduct: false,
        brand: "Protection Solaire Experte",
        product: "Fluide Écran Solaire Minéral Invisible SPF 50+",
        size: "50 ml",
        type: "Filtre Solaire Haute Sécurité sans Parfum",
        priceEst: "1 800 DZD",
        action: "Appliquer généreusement 15 minutes avant toute exposition extérieure en ville ou sur le littoral.",
        synergyWhy: "Protège contre les rayons UV sans déplacer le fini non-gras du Gel-Crème ANJUCIA."
      }
    ],
    synergyInsights: {
      title: "Pourquoi cette Synergie Naturelle pour Amina ?",
      summary: "Cette routine combine la pureté des trésors botaniques locaux (Hydrolat de Rose et Huile d'Argan vierge) avec la haute précision biochimique de notre Soothing Gel-Cream ANJUCIA. Les actifs titrés (Niacinamide 3%, Panthénol 2%, Centella) comblent exactement ce que les huiles végétales seules ne peuvent pas apporter, sans film gras.",
      costComparison: "En associant des matières naturelles pures accessibles au Soin ANJUCIA (1 500 DA), Amina économise plus de 4 000 DZD par rapport aux crèmes importées surtaxées."
    }
  },

  karim: {
    id: "karim",
    name: "Karim B. (34 ans)",
    location: "Ghardaïa (Sahara Septentrional / Hyper-Aride)",
    image: "/assets/preset-karim.svg",
    symptoms: "Micro-fissures sévères, sensation de papier de verre sous l'effet du vent chaud de sable (Sirocco). Picotements intenses lors de la sudation, évaporation cutanée ultra-rapide.",
    skinType: "Rupture de Barrière Induite par le Climat Saharien",
    overallScore: 44,
    radar: {
      hydration: 19,
      lipidBarrier: 28,
      tewlResistance: 22,
      sebumBalance: 38,
      elasticity: 62
    },
    tewl: "38.5 g/m²/h (Perte Critique)",
    sensitivity: 86,
    keyDeficit: "Clivage du Ciment Lipidique Intercellulaire & Xérose Aiguë",
    heatmapSpots: [
      { x: 37, y: 46, r: 24, intensity: "critical", zone: "Lésion Éolienne Joue Gauche" },
      { x: 63, y: 46, r: 24, intensity: "critical", zone: "Lésion Éolienne Joue Droite" },
      { x: 50, y: 64, r: 20, intensity: "high", zone: "Gerçures Péribuccales Sévères" },
      { x: 50, y: 28, r: 18, intensity: "high", zone: "Desquamation Frontale Sirocco" }
    ],
    diagnosis: "Perte insensible en eau critique provoquée par l'air désertique desséchant et le vent de sable. Dégradation sévère du film hydrolipidique naturel. Nécessite une barrière occlusive biomimétique d'urgence.",
    primaryProduct: {
      id: "cerahydra-cream-50",
      name: "ANJUCIA CeraHydra+ Cellular Cream 50ml",
      role: "Reconstruction Lipidique 72H",
      priceDZD: 2400,
      reason: "Formule riche en complexe Céramide 3 biomimétique et Ectoïne pour verrouiller l'eau cellulaire contre le souffle abrasif du Sirocco."
    },
    hybridRoutine: [
      {
        step: 1,
        phase: "Nettoyage Apaisant Non-Moussant (AM / PM)",
        isOurProduct: false,
        brand: "Soin Lavant Physiologique",
        product: "Lait Nettoyant Doux Végétal sans Savon",
        size: "200 ml",
        type: "Émulsion Lavante Protectrice pH 5.5",
        priceEst: "950 DZD",
        action: "Nettoyer sans frotter à l'eau tempérée. Élimine les poussières de sable sans dessécher les microlésions.",
        synergyWhy: "Laisse un microfilm protecteur initial pour ne pas aggraver les gerçures avant l'application de la crème."
      },
      {
        step: 2,
        phase: "Infusion Hydratante Naturelle (AM / PM)",
        isOurProduct: false,
        brand: "Extrait Botanique Natif",
        product: "Gel d'Aloe Vera Pur Natif 99%",
        size: "100 ml",
        type: "Gelée Aqueuse Riche en Mucilages",
        priceEst: "750 DZD",
        action: "Appliquer en couche fine sur visage humide pour recharger l'épiderme en eau.",
        synergyWhy: "Les polysaccharides de l'aloe vera pénètrent instantanément et sont ensuite capturés en profondeur par le complexe céramide ANJUCIA."
      },
      {
        step: 3,
        phase: "CŒUR DU SOIN QUOTIDIEN (Matin & Soir)",
        isOurProduct: true,
        ourProductId: "cerahydra-cream-50",
        brand: "Maison ANJUCIA Algérie",
        product: "ANJUCIA CeraHydra+ Cellular Cream 50ml",
        size: "50 ml • Pot Protecteur Hermétique",
        type: "Crème Barrière Anti-TEWL 72H",
        priceDZD: 3800,
        action: "Masser généreusement matin et soir jusqu'à formation du bouclier soyeux protecteur.",
        isHero: true,
        highlight: "Complexe Céramide 3 + Ectoïne 1.5% + Phyto-Squalane 5% • Verrouillage 72 Heures",
        synergyWhy: "Recimente la barrière lipidique rompue de Karim, neutralise le stress thermique du désert et bloque la déshydratation TEWL."
      },
      {
        step: 4,
        phase: "Photoprotection Bouclier Solaire (Matin)",
        isOurProduct: false,
        brand: "Protection Solaire Haute Performance",
        product: "Crème Solaire Protectrice Anti-Sirocco SPF 50+",
        size: "50 ml",
        type: "Écran Solaire Minéral Résistant au Vent",
        priceEst: "1 900 DZD",
        action: "Appliquer généreusement toutes les 2 heures lors des expositions au soleil saharien.",
        synergyWhy: "Empêche les brûlures profondes des UV désertiques sur les zones de desquamation active."
      }
    ],
    synergyInsights: {
      title: "Pourquoi cette Synergie Naturelle pour Karim ?",
      summary: "Le climat hyper-aride du Sud exige un apport massif d'eau végétale (Gel d'Aloe Vera) immédiatement scellé par notre CeraHydra+ enrichie en Céramide 3 et Ectoïne. Cette association offre une résistance sans équivalent contre l'air sec du désert.",
      costComparison: "Une routine importée spécial barrière coûte plus de 9 500 DZD en Algérie. Cette routine hybride naturelle + ANJUCIA revient à moins de 6 000 DZD avec une efficacité supérieure."
    }
  },

  yasmine: {
    id: "yasmine",
    name: "Yasmine K. (23 ans)",
    location: "Oran (Méditerranée Ouest / Climat Marin & Vent)",
    image: "/assets/preset-yasmine.svg",
    symptoms: "Zone médiane (front, nez, menton) luisante dès 11h, pores dilatés et petits comédons récurrents, avec sensation d'inconfort et de déshydratation sous la surface.",
    skinType: "Peau Mixte à Grasse Asphyxiée par Déshydratation",
    overallScore: 58,
    radar: {
      hydration: 42,
      lipidBarrier: 55,
      tewlResistance: 50,
      sebumBalance: 24,
      elasticity: 82
    },
    tewl: "21.4 g/m²/h (Modéré)",
    sensitivity: 48,
    keyDeficit: "Hyper-Séborrhée Réactionnelle & Perte d'Hydratation Aqueuse",
    heatmapSpots: [
      { x: 50, y: 30, r: 18, intensity: "high", zone: "Front : Séborrhée & Comédons" },
      { x: 50, y: 50, r: 14, intensity: "high", zone: "Nez : Pores Dilatés & Brillance" },
      { x: 50, y: 70, r: 12, intensity: "medium", zone: "Menton : Microkystes Occasionnels" }
    ],
    diagnosis: "Excès de sébum provoqué paradoxalement par le manque d'hydratation aqueuse (séborrhée de compensation). Nécessite une régulation ciblée de la production sébacée sans alcool ni effet décapant.",
    skincareAssessment: "Excès de sébum provoqué par le manque d'hydratation aqueuse. Nécessite une régulation douce sans effet asséchant.",
    primaryProduct: {
      id: "soothing-gel-cream",
      name: "ANJUCIA Lightweight Soothing Face Gel-Cream",
      role: "Matité & Régulation Sébacée Niacinamide 3%",
      priceDZD: 1500,
      reason: "Texture gel-crème sans résidu gras, formulée à pH 5.2 avec 3% de Niacinamide pure qui normalise la taille des pores et réduit le flux sébacé sans assécher."
    },
    hybridRoutine: [
      {
        step: 1,
        phase: "Nettoyage Purifiant Végétal (AM / PM)",
        isOurProduct: false,
        brand: "Soin Botanique Purifiant",
        product: "Gel Nettoyant Doux aux Extraits Végétaux Purifiants",
        size: "200 ml",
        type: "Nettoyant Sans Savon Régulateur pH 5.5",
        priceEst: "900 DZD",
        action: "Faire mousser délicatement avec un peu d'eau tiède sur la zone T.",
        synergyWhy: "Désincruste les pores sans effet rebond, préparant le terrain pour la Niacinamide ANJUCIA."
      },
      {
        step: 2,
        phase: "Régulation Naturelle Sébacée (Soir)",
        isOurProduct: false,
        brand: "Huile Végétale Biomimétique",
        product: "Huile de Jojoba Pure Vierge Pressée à Froid",
        size: "30 ml",
        type: "Cire Liquide Séborégulatrice Non-Comédogène",
        priceEst: "1 100 DZD",
        action: "Appliquer 2 gouttes le soir sur les joues et le front.",
        synergyWhy: "L'huile de jojoba mime la composition du sébum pour signaler aux glandes sébacées de freiner leur production excessive."
      },
      {
        step: 3,
        phase: "CŒUR DU SOIN QUOTIDIEN (Matin & Soir)",
        isOurProduct: true,
        ourProductId: "soothing-gel-cream",
        brand: "Maison ANJUCIA Algérie",
        product: "ANJUCIA Lightweight Soothing Face Gel-Cream",
        size: "50 ml • Tube Canule Précision",
        type: "Gel-Crème Matifiant Apaisant H/E",
        priceDZD: 1500,
        action: "Appliquer sur l'ensemble du visage. Fini poudré instantané zéro brillance toute la journée.",
        isHero: true,
        highlight: "Niacinamide 3% + Panthénol 2% + Centella 1% + Squalane 3%",
        synergyWhy: "Fournit l'eau nécessaire qui régule la production de sébum et resserre le grain de peau."
      },
      {
        step: 4,
        phase: "Photoprotection Fluide Fini Mat (Matin)",
        isOurProduct: false,
        brand: "Protection Solaire Fluide",
        product: "Fluide Solaire Matifiant Sans Huile SPF 50+",
        size: "50 ml",
        type: "Écran Solaire Texture Eau Ultra-Légère",
        priceEst: "1 750 DZD",
        action: "Appliquer comme dernière étape le matin. Ne bouche pas les pores sous la chaleur.",
        synergyWhy: "Protège contre l'oxydation du sébum causée par les rayons UV sous le soleil d'Oran."
      }
    ],
    synergyInsights: {
      title: "Pourquoi cette Synergie Naturelle pour Yasmine ?",
      summary: "L'huile de jojoba pure mime le sébum naturel pour calmer la surproduction nocturne, tandis que le Gel-Cream ANJUCIA assure une hydratation matifiante parfaite avec sa Niacinamide 3% le jour. Une routine sans risque comédogène.",
      costComparison: "Économie de plus de 45% sur le budget beauté grâce au prix local accessible de 1 500 DA d'ANJUCIA."
    }
  },

  nadia: {
    id: "nadia",
    name: "Nadia T. (41 ans)",
    location: "Constantine (Hauts Plateaux / Climat Continental)",
    image: "/assets/preset-nadia.svg",
    symptoms: "Peau très sèche avec ridules de déshydratation marquées, sensation de brûlure avec le froid hivernal et le vent sec des gorges de Constantine.",
    skinType: "Peau Mature Xérotique Déshydratée",
    overallScore: 50,
    radar: {
      hydration: 26,
      lipidBarrier: 36,
      tewlResistance: 32,
      sebumBalance: 40,
      elasticity: 58
    },
    tewl: "32.1 g/m²/h (Élevé)",
    sensitivity: 68,
    keyDeficit: "Déficit en Facteurs Naturels d'Hydratation (NMF) & Lipides Cutanés",
    heatmapSpots: [
      { x: 38, y: 50, r: 20, intensity: "high", zone: "Joues : Fines Ridules de Xérose" },
      { x: 50, y: 35, r: 16, intensity: "high", zone: "Front : Tiraillements Constants" }
    ],
    diagnosis: "Xérose cutanée avec ralentissement du renouvellement lipidique, accentuée par les chocs thermiques continentaux. Nécessite une réhydratation profonde et un apport en phytostérols protecteurs.",
    primaryProduct: {
      id: "cerahydra-cream-100",
      name: "ANJUCIA CeraHydra+ Grand Format 100ml",
      role: "Reconstruction Barrière & NMF",
      priceDZD: 3800,
      reason: "Riche en céramides et squalane pour reconstituer le ciment cellulaire sur le long terme sans assécher."
    },
    hybridRoutine: [
      {
        step: 1,
        phase: "Nettoyage Réconfortant Sans Eau Calcaire (AM / PM)",
        isOurProduct: false,
        brand: "Soin Végétal Réconfortant",
        product: "Eau Florale Pure de Fleur d'Oranger (Néroli)",
        size: "200 ml",
        type: "Hydrolat Apaisant & Adoucissant",
        priceEst: "850 DZD",
        action: "Passer un coton imbibé sur le visage pour nettoyer en douceur sans agression calcaire.",
        synergyWhy: "Neutralise le calcaire de l'eau courante et détend immédiatement les traits du visage."
      },
      {
        step: 2,
        phase: "Booster Végétal Anti-Âge (Soir)",
        isOurProduct: false,
        brand: "Élixir Végétal Pur",
        product: "Huile de Pépins de Figue de Barbarie Pure",
        size: "15 ml",
        type: "Sérum Végétal Régénérant Riche en Stérols",
        priceEst: "2 200 DZD",
        action: "Masser délicatement 2-3 gouttes sur les ridules et le contour des yeux.",
        synergyWhy: "Apporte une concentration exceptionnelle en stérols végétaux et vitamine E pour régénérer la peau mature."
      },
      {
        step: 3,
        phase: "CŒUR DU SOIN QUOTIDIEN (Matin & Soir)",
        isOurProduct: true,
        ourProductId: "cerahydra-cream-100",
        brand: "Maison ANJUCIA Algérie",
        product: "ANJUCIA CeraHydra+ Cellular Cream 100ml",
        size: "100 ml • Grand Format Économique",
        type: "Crème Cellulaire Réparatrice 72H",
        priceDZD: 6200,
        action: "Appliquer généreusement matin et soir sur le visage, le cou et le décolleté.",
        isHero: true,
        highlight: "Céramides 3 + Ectoïne 1.5% + Double Acide Hyaluronique",
        synergyWhy: "Capture les acides gras des huiles végétales et les intègre dans le réseau lipidique cellulaire pour un effet repulpant 72H."
      },
      {
        step: 4,
        phase: "Protection UV Quotidienne Anti-Taches (Matin)",
        isOurProduct: false,
        brand: "Protection Solaire Hydratante",
        product: "Crème Solaire Protectrice Anti-Âge SPF 50+",
        size: "50 ml",
        type: "Écran Solaire Nourrissant sans Effet Blanc",
        priceEst: "1 950 DZD",
        action: "Appliquer tous les matins pour prévenir l'accentuation des taches pigmentaires.",
        synergyWhy: "Protège le collagène et prévient le photovieillissement accéléré sous le soleil des hauts plateaux."
      }
    ],
    synergyInsights: {
      title: "Pourquoi cette Synergie Naturelle pour Nadia ?",
      summary: "L'élixir de pépins de figue de barbarie apporte des antioxydants végétaux d'exception, amplifiés par la formule réparatrice CeraHydra+ d'ANJUCIA. Le grand format 100ml assure une protection durable tout au long de l'hiver.",
      costComparison: "Un soin réparateur importé de 100ml coûte entre 7 000 et 11 000 DZD. ANJUCIA propose cette formulation pure pour 6 200 DZD seulement."
    }
  }
};

export const SKINCARE_PRESETS = CLINICAL_PRESETS;

export const IN_HOUSE_ROUTINE_TEMPLATE = [
  {
    step: 1,
    phase: "Nettoyage Physiologique Doux",
    isOurProduct: true,
    brand: "Maison ANJUCIA Algérie",
    product: "AquaLipid Nettoyant Doux pH 5.5",
    size: "200 ml",
    type: "Gel Nettoyant Physiologique Moussant",
    priceDZD: 1600,
    action: "Nettoie délicatement sans altérer le film hydrolipidique."
  },
  {
    step: 2,
    phase: "Infusion Hydratante Cellulaire",
    isOurProduct: true,
    brand: "Maison ANJUCIA Algérie",
    product: "AquaLipid Hydro-Infusion Essence",
    size: "150 ml",
    type: "Essence Cellulaire Micro-Hyaluronique",
    priceDZD: 1900,
    action: "Prépare l'épiderme et infuse les couches superficielles en eau osmorégulée."
  },
  {
    step: 3,
    phase: "Cœur du Soin Soothing Gel-Cream",
    isOurProduct: true,
    brand: "Maison ANJUCIA Algérie",
    product: "ANJUCIA Lightweight Soothing Face Gel-Cream",
    size: "50 ml",
    type: "Gel-Crème Apaisant & Barrière H/E",
    priceDZD: 1500,
    action: "Niacinamide 3% + Panthénol 2% + Centella 1% : scelle l'hydratation et apaise la peau."
  },
  {
    step: 4,
    phase: "Protection Barrière Photoprotectrice",
    isOurProduct: true,
    brand: "Maison ANJUCIA Algérie",
    product: "BioShield Fluide Solaire SPF 50+",
    size: "50 ml",
    type: "Fluide Minéral Invisible Anti-TEWL",
    priceDZD: 2200,
    action: "Protège contre le spectre solaire UVA/UVB et bloque l'évaporation d'eau induite par la chaleur."
  }
];
