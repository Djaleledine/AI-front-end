"use client";

import React, { useState } from "react";
import { Sun, Droplets, Wind, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const REGIONAL_CLIMATES = [
  {
    id: "algiers",
    name: { fr: "Alger & Littoral Centre", en: "Algiers & Central Coast", dz: "الجزائر العاصمة والساحل" },
    humidity: "76%",
    uvIndex: "UV 9 (Très Élevé)",
    risk: {
      fr: "Excès de sébum et oxydation urbaine",
      en: "Excess sebum and urban oxidation",
      dz: "لمعان الزيوت مع تلوث العاصمة"
    },
    recommendation: {
      fr: "Appliquer le Lightweight Soothing Face Gel-Cream : Niacinamide 3% pour réguler le sébum et fini mat non gras sous l'humidité.",
      en: "Apply the Lightweight Soothing Face Gel-Cream: 3% Niacinamide to balance sebum and a shine-free matte finish in high humidity.",
      dz: "استعمل جل-كريم أنجوسيا الخفيف: النياسيناميد 3% ينقص الزيوت وما يخليش وجهك يبرق مع الرطوبة تاع البحر."
    }
  },
  {
    id: "oran",
    name: { fr: "Oran & Côte Ouest", en: "Oran & Western Coast", dz: "وهران والساحل الغربي" },
    humidity: "68%",
    uvIndex: "UV 10 (Extrême)",
    risk: {
      fr: "Déshydratation par le vent marin et les UV",
      en: "Dehydration from sea breeze and intense UV",
      dz: "نشفان الوجه مع هواء البحر والشمس الحارة"
    },
    recommendation: {
      fr: "Protéger la barrière avec le Soothing Gel-Cream enrichi en Squalane 3% végétal avant l'application de votre écran solaire.",
      en: "Protect the skin barrier with Soothing Gel-Cream loaded with 3% Phyto-Squalane before applying sunscreen.",
      dz: "احمي وجهك بالجل-كريم لي فيه سكوالان 3% وبانتينول B5 قبل ما دير واقي الشمس باش ما يقشرلكش."
    }
  },
  {
    id: "constantine",
    name: { fr: "Constantine, Sétif & Hauts Plateaux", en: "Constantine, Sétif & High Plateaus", dz: "قسنطينة، سطيف والهضاب العليا" },
    humidity: "42%",
    uvIndex: "UV 9 (Élevé)",
    risk: {
      fr: "Tiraillements intenses et chocs thermiques",
      en: "Skin tightness and thermal shock",
      dz: "بشرة تجبد وتتقشر من البرد وتقلبات الطقس"
    },
    recommendation: {
      fr: "Associer le Gel-Cream le matin et la crème cellulaire CeraHydra+ le soir pour réparer les microlésions dues au climat continental sec.",
      en: "Pair the Gel-Cream in the morning with CeraHydra+ cream at night to repair micro-fissures caused by the dry continental weather.",
      dz: "دير الجل-كريم الصباح وكريم CeraHydra+ فالليل باش تعمر خلايا الوجه بالترطيب وما تخليهش يتقشر."
    }
  },
  {
    id: "sahara",
    name: { fr: "Ghardaïa, Biskra, Hassi Messaoud & Sahara", en: "Ghardaïa, Biskra, Hassi Messaoud & Sahara", dz: "غرداية، بسكرة، حاسي مسعود والجنوب" },
    humidity: "18% (Air Aride)",
    uvIndex: "UV 11+ (Extrême Danger)",
    risk: {
      fr: "Évaporation hydrique accélérée (TEWL) et vent de sable Sirocco",
      en: "Accelerated transepidermal water loss (TEWL) and Sirocco desert winds",
      dz: "تبخر سريع للماء TEWL وسخانة حارقة مع ريح الشهيلي"
    },
    recommendation: {
      fr: "Protocole barrière d'urgence : CeraHydra+ Cellular Cream ou double couche Gel-Cream + protection solaire obligatoire réappliquée toutes les 2h.",
      en: "Emergency barrier protocol: CeraHydra+ Cellular Cream or double layer Gel-Cream + strict SPF reapplication every 2 hours.",
      dz: "حماية قصوى للحاجز الواقي: دير كريم CeraHydra+ ولا جل-كريم مع واقي شمس كل ساعتين باش تحبس التبخر التام للماء."
    }
  }
];

export default function AlgerianClimateWidget() {
  const { t, lang } = useLanguage();
  const [activeZone, setActiveZone] = useState(REGIONAL_CLIMATES[0]);

  return (
    <section style={{ padding: "3.5rem 0", background: "var(--bg-primary)" }}>
      <div className="container">
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "20px", padding: "2.2rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <span className="section-tag">{t.climate.badge}</span>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.4rem 0" }}>
                {t.climate.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                {t.climate.subtitle}
              </p>
            </div>

            {/* Region Selector Pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {REGIONAL_CLIMATES.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setActiveZone(reg)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    border: activeZone.id === reg.id ? "1.5px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                    background: activeZone.id === reg.id ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                    color: activeZone.id === reg.id ? "var(--accent-aqua)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {reg.name[lang] || reg.name.fr}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Readout Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "1.8rem" }}>
            <div style={{ background: "var(--bg-secondary)", padding: "1.2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--accent-aqua)", marginBottom: "0.4rem" }}>
                <Droplets size={18} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>{t.climate.humidity}</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {activeZone.humidity}
              </div>
            </div>

            <div style={{ background: "var(--bg-secondary)", padding: "1.2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#F59E0B", marginBottom: "0.4rem" }}>
                <Sun size={18} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>{t.climate.uvIndex}</span>
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {activeZone.uvIndex}
              </div>
            </div>

            <div style={{ background: "var(--bg-secondary)", padding: "1.2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#EF4444", marginBottom: "0.4rem" }}>
                <ShieldAlert size={18} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>{t.climate.skinImpact}</span>
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {activeZone.risk[lang] || activeZone.risk.fr}
              </div>
            </div>
          </div>

          {/* Tailored Derm Advice Box */}
          <div style={{ background: "var(--accent-aqua-subtle)", border: "1.5px solid var(--border-light)", borderRadius: "14px", padding: "1.3rem 1.6rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <CheckCircle2 size={26} color="var(--accent-aqua)" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-aqua)", textTransform: "uppercase" }}>
                {t.climate.advice}
              </span>
              <p style={{ fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 600, marginTop: "2px" }}>
                {activeZone.recommendation[lang] || activeZone.recommendation.fr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
