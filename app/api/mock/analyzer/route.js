import { NextResponse } from "next/server";
import { CLINICAL_PRESETS } from "../../../data/analyzerData";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    data: CLINICAL_PRESETS
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { skinType, location, climate } = body || {};

    const scanId = `SCAN-ALG-${Math.floor(100000 + Math.random() * 900000)}`;
    const isArid = climate === "arid" || (location && ["Biskra", "Ouargla", "Ghardaïa", "Adrar"].some(w => location.includes(w)));
    
    const analysis = {
      scanId,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      skinProfile: {
        declaredType: skinType || "Combinaison Déshydratée",
        climateCondition: isArid ? "Aride & Vent Chaud (Sirocco)" : "Littoral Tempéré & Humidité Urbaine",
        barrierScore: isArid ? 44 : 58,
        hydrationPercentage: isArid ? 36 : 48,
        tewlIndex: isArid ? "28.4 g/m²/h (Sensibilité Élevée)" : "19.2 g/m²/h (Modéré)"
      },
      recommendedCare: {
        flagship: {
          id: "soothing-gel-cream",
          name: "Lightweight Soothing Face Gel-Cream",
          reason: "Apaisement immédiat au Panthénol B5 2% et régulation sébacée par la Niacinamide 3% sans film lourd.",
          priceDZD: 1800
        },
        booster: isArid ? {
          id: "cerahydra-cream-50",
          name: "CeraHydra+ Cellular Barrier Cream 50ml",
          reason: "Scellement céramidique 3:1:1 pour restaurer la barrière lipidique sous climat sec.",
          priceDZD: 3800
        } : null,
        botanicalSynergy: {
          staple: isArid ? "Huile d'Argan Pure (2 gouttes le soir)" : "Hydrolat Pur d'Eau de Rose (1 brumisation le matin)",
          synergyBenefit: "Amplifie le confort cutané et préserve le film hydrolipidique naturel."
        }
      }
    };

    return NextResponse.json({
      status: 200,
      success: true,
      data: analysis
    });
  } catch (error) {
    return NextResponse.json(
      { status: 400, success: false, message: "Invalid scan payload", error: error.message },
      { status: 400 }
    );
  }
}
