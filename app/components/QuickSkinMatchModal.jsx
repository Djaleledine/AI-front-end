"use client";

import React, { useState } from "react";
import { Sparkles, X, CheckCircle, ArrowRight, Droplets, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function QuickSkinMatchModal({ isOpen, onClose }) {
  const { addHybridHero, setIsCartOpen } = useCart();
  const { lang } = useLanguage();

  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState("oily");
  const [region, setRegion] = useState("coast");
  const [goal, setGoal] = useState("hydration");
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFinish = () => {
    // Generate recommendation
    const isDry = skinType === "dry" || region === "sahara";
    const recommendedProduct = isDry ? "cerahydra-cream-50" : "soothing-gel-cream";
    const naturalTip = isDry
      ? {
          fr: "Ajoutez 2 gouttes d'Huile d'Argan pure le soir pour sceller l'hydratation sans effet comédogène.",
          en: "Add 2 drops of pure cold-pressed Argan Oil at night to seal moisture without clogging pores.",
          dz: "زيد 2 قطرات تاع زيت الأركان الطبيعي فالليل باش تقفل المسامات وتحبس الماء داخل البشرة."
        }
      : {
          fr: "Vaporisez de l'Eau de Rose pure le matin avant votre Gel-Cream pour un effet matifiant et frais.",
          en: "Spritz pure Rose Water in the morning before your Gel-Cream for a refreshing matte finish.",
          dz: "رش ماء الورد المقطر الصباح قبل الجل-كريم باش وجهك يمتصو مليح وما يزيتلكش كامل."
        };

    setResult({
      productId: recommendedProduct,
      productName: isDry ? "CeraHydra+ Cellular Cream (3 800 DZD)" : "Lightweight Soothing Face Gel-Cream (1 500 DA)",
      naturalTip: naturalTip[lang] || naturalTip.fr
    });
    setStep(4);
  };

  const handleOrderRecommendation = () => {
    if (result) {
      addHybridHero(result.productId);
      onClose();
      setIsCartOpen(true);
    }
  };

  return (
    <div className="cart-drawer-overlay open" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--accent-aqua)",
          borderRadius: "var(--card-radius)",
          maxWidth: "520px",
          width: "100%",
          padding: "2.2rem",
          boxShadow: "var(--shadow-md), var(--shadow-glow)",
          position: "relative",
          animation: "scale-up 0.25s ease"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          aria-label="Fermer"
        >
          <X size={22} />
        </button>

        {step < 4 ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-aqua)", fontWeight: 800, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
              <Sparkles size={16} />
              <span>TEST EXPRESS 10 SECONDES • ÉTAPE {step}/3</span>
            </div>

            {step === 1 && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.2rem" }}>
                  {lang === "dz" ? "واش هو نوع بشرتك ؟" : "Quel est votre type de peau ?"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem" }}>
                  {[
                    { id: "oily", label: { fr: "Mixte à Grasse (Brillance & Pores)", en: "Combination to Oily (Shine & Pores)", dz: "مختلطة إلى دهنية (تزيت والمسامات واسعة)" } },
                    { id: "dry", label: { fr: "Sèche à Très Sèche (Tiraillements)", en: "Dry to Very Dry (Tightness)", dz: "ناشفة بزاف وتجبد كي نغسلها" } },
                    { id: "sensitive", label: { fr: "Sensible & Réactive (Rougeurs)", en: "Sensitive & Reactive (Redness)", dz: "حساسة وتحمار بالخف مالشمس" } }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSkinType(opt.id)}
                      style={{
                        padding: "0.9rem 1.1rem",
                        borderRadius: "12px",
                        border: skinType === opt.id ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                        background: skinType === opt.id ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {opt.label[lang] || opt.label.fr}
                    </button>
                  ))}
                </div>
                <button className="btn-aqua" style={{ width: "100%" }} onClick={() => setStep(2)}>
                  <span>{lang === "dz" ? "التالي ←" : "Continuer →"}</span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.2rem" }}>
                  {lang === "dz" ? "وين تسكن في الجزائر ؟" : "Dans quelle région vivez-vous ?"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem" }}>
                  {[
                    { id: "coast", label: { fr: "Alger, Oran, Littoral (Humidité & Chaleur)", en: "Coastal (Humidity & Heat)", dz: "الساحل (الجزائر، وهران، بجاية - رطوبة البحر)" } },
                    { id: "plateau", label: { fr: "Constantine, Sétif (Hauts Plateaux secs)", en: "High Plateaus (Dry air & wind)", dz: "الهضاب العليا (سطيف، قسنطينة، باتنة - برد وجفاف)" } },
                    { id: "sahara", label: { fr: "Biskra, Ghardaïa, Sud (Chaleur aride & Sirocco)", en: "Sahara & South (Arid heat & Sirocco)", dz: "الصحراء والجنوب (بسكرة، ورقلة - سخانة وشهيلي)" } }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setRegion(opt.id)}
                      style={{
                        padding: "0.9rem 1.1rem",
                        borderRadius: "12px",
                        border: region === opt.id ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                        background: region === opt.id ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {opt.label[lang] || opt.label.fr}
                    </button>
                  ))}
                </div>
                <button className="btn-aqua" style={{ width: "100%" }} onClick={() => setStep(3)}>
                  <span>{lang === "dz" ? "التالي ←" : "Continuer →"}</span>
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.2rem" }}>
                  {lang === "dz" ? "واش هي أولويتك الأساسية ؟" : "Quel résultat recherchez-vous ?"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem" }}>
                  {[
                    { id: "matte", label: { fr: "Hydratation légère sans brillance (Fini Mat)", en: "Matte hydration with zero shine", dz: "ترطيب خفيف بدون لمعان ولا تزييت" } },
                    { id: "barrier", label: { fr: "Réparation barrière 72H anti-tiraillement", en: "72H barrier repair against tightness", dz: "ترميم الحاجز الواقي وما يخليش الوجه يزير" } },
                    { id: "soothing", label: { fr: "Apaisement immédiat des rougeurs et irritations", en: "Instant soothing of redness and flushes", dz: "تهدئة سريعة للحمرار والحريق تاع الشمس" } }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGoal(opt.id)}
                      style={{
                        padding: "0.9rem 1.1rem",
                        borderRadius: "12px",
                        border: goal === opt.id ? "2px solid var(--accent-aqua)" : "1px solid var(--border-subtle)",
                        background: goal === opt.id ? "var(--accent-aqua-subtle)" : "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {opt.label[lang] || opt.label.fr}
                    </button>
                  ))}
                </div>
                <button className="btn-aqua" style={{ width: "100%" }} onClick={handleFinish}>
                  <span>{lang === "dz" ? "شوف نتيجتي ووصفة علاجي ✨" : "Découvrir ma Formule Idéale ✨"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "var(--accent-aqua-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "var(--accent-aqua)" }}>
              <CheckCircle size={32} />
            </div>

            <span className="section-tag" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)" }}>
              {lang === "dz" ? "تم تحديد العلاج المثالي لبشرتك !" : "Votre Correspondance Parfaite Identifiée !"}
            </span>

            <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.6rem 0" }}>
              {result.productName}
            </h3>

            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "14px", padding: "1.2rem", margin: "1.2rem 0", textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent-aqua)", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                💡 {lang === "dz" ? "نصيحة الصيدلي الطبيعية المرافقة :" : "Astuce Synergie Naturelle Associée :"}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {result.naturalTip}
              </p>
            </div>

            <button
              className="btn-aqua"
              style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginBottom: "0.8rem" }}
              onClick={handleOrderRecommendation}
            >
              <Droplets size={18} />
              <span>{lang === "dz" ? "أضف هذا العلاج إلى السلة واطلب الآن" : "Commander ma Routine (Paiement à la Réception)"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
