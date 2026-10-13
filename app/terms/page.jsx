"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, AlertCircle, Sparkles, Lock, Truck, FileText, CheckCircle } from "lucide-react";

export default function TermsPage() {
  const { lang } = useLanguage();

  return (
    <main style={{ padding: "4rem 0 6rem", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "880px" }}>
        
        {/* Header */}
        <div className="scroll-reveal" style={{ maxWidth: "680px", margin: "0 auto 3.5rem" }}>
          <div className="section-header center">
            <span className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <FileText size={15} />
              <span>{lang === "dz" ? "الشروط القانونية والسرية" : "CADRE LÉGAL & CONFIDENTIALITÉ"}</span>
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text-primary)", marginTop: "0.5rem", marginBottom: "0.8rem" }}>
              {lang === "dz" ? "الشروط العامة وسياسة حماية البيانات" : "Conditions Générales & Confidentialité"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", margin: "0 auto" }}>
              {lang === "dz"
                ? "المتجر الرسمي لـ ANJUCIA في الجزائر. التزام صارم بحماية خصوصيتك، وضوح تام في الاشتراكات، وشفافية التوصيل."
                : "Boutique Officielle ANJUCIA Algérie. Engagement strict pour la confidentialité des profils, clarté sur les soins et transparence sur les commandes."}
            </p>
          </div>
        </div>

        {/* 1. Medical Disclaimer Banner */}
        <section className="scroll-reveal-scale stagger-1" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1.5px solid rgba(245, 158, 11, 0.35)", borderRadius: "18px", padding: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <AlertCircle size={28} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#F59E0B", marginBottom: "0.5rem" }}>
                {lang === "dz" ? "1. تنبيه طبي قانوني هام (غير مخصص للتشخيص الطبي)" : "1. Avertissement Médical Légal — Soins Cosmétiques Uniquement"}
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.8rem" }}>
                {lang === "dz"
                  ? "نظام الذكاء الاصطناعي ومحتويات المنصة مخصصة حصرياً لتقديم نصائح وروتينات العناية التجميلية بالبشرة (جافة، دهنية، مختلطة، منطقة T، متقشرة، حساسة، معرضة لحب الشباب، ومسامات واسعة). لا يقوم هذا النظام بأي تشخيص طبي للأمراض الجلدية ولا يصف أدوية صيدلانية."
                  : "Le système d'analyse d'ANJUCIA et l'ensemble des contenus de la plateforme ont pour vocation exclusive l'orientation cosmétique et la recommandation de routines d'hygiène de soin (peaux sèches, grasses, mixtes, zone T, desquamées, sensibles, à tendance acnéique ou pores dilatés)."}
              </p>
              <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.6 }}>
                {lang === "dz"
                  ? "⚠️ في حالة وجود طفح جلدي مستمر، حكة حادة، أو أي مرض جلدي مرضي، يجب استشارة طبيب أمراض جلدية مختص فوراً."
                  : "⚠️ En aucun cas nos outils ne se substituent à un diagnostic médical ni à une prescription dermatologique. Pour toute affection ou pathologie cutanée, la consultation d'un médecin dermatologue qualifié est impérative."}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Strict Data Confidentiality */}
        <section className="scroll-reveal-scale stagger-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "18px", padding: "2rem", marginBottom: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <Lock size={26} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {lang === "dz" ? "2. السرية التامة وحماية البيانات الشخصية" : "2. Confidentialité Stricte & Zéro Partage de Données"}
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.8rem" }}>
                {lang === "dz"
                  ? "كل بروفايل وكل صورة يتم فحصها تبقى سرية 100%. لا نشارك، ولا نبيع، ولا ننقل أي بيانات شخصية أو صور لأي طرف ثالث أو معلن."
                  : "Chaque profil utilisateur est strictement confidentiel. L'analyse spectrophotométrique et visuelle de la peau s'exécute directement et localement dans le navigateur de l'utilisateur. Aucune image brute de votre visage n'est stockée de façon non autorisée ni transmise à des tiers."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span>{lang === "dz" ? "معالجة محلية للصور دون تخزين خارجي" : "Traitement photographique local sans conservation non sollicitée"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span>{lang === "dz" ? "عدم بيع أو مشاركة أرقام الهواتف أو العناوين" : "Zéro revente de vos coordonnées de livraison ou résultats"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sealed QR Code Automatic Subscription */}
        <section className="scroll-reveal-scale stagger-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "18px", padding: "2rem", marginBottom: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <Sparkles size={26} color="var(--accent-aqua)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {lang === "dz" ? "3. الاشتراك التلقائي عبر كود QR المغلق في العلبة" : "3. Abonnement Automatique via QR Code Scellé"}
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.8rem" }}>
                {lang === "dz"
                  ? "عند شراء كريم أنجوسيا، ستجد داخل العلبة كود QR مختوم ومحمي. بمجرد مسحه بهاتفك، يتم تفعيل اشتراكك في المتابعة التلقائية المخصصة وتحديثات الروتين مجاناً دون أي مصاريف خفية."
                  : "L'achat de chaque flacon ou soin ANJUCIA donne droit à un abonnement de suivi personnalisé automatique. Un QR code sécurisé et scellé est apposé à l'intérieur de l'emballage d'origine."}
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {lang === "dz"
                  ? "هذا الكود هو إثبات أصالة المنتج ويمنحك وصولاً مباشراً إلى تجديد روتينك واستشارات العناية بالبشرة."
                  : "Le scan de ce QR code scellé authentifie le produit d'origine et active automatiquement votre accès privilégié aux ajustements saisonniers de votre routine, sans frais récurrents cachés."}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Ordering & Delivery across 58 Wilayas */}
        <section className="scroll-reveal-scale stagger-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "18px", padding: "2rem", marginBottom: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <Truck size={26} color="var(--accent-aqua)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {lang === "dz" ? "4. التوصيل والدفع عند الاستلام (58 ولاية)" : "4. Modalités de Commande & Livraison 58 Wilayas"}
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.8rem" }}>
                {lang === "dz"
                  ? "نوفر التوصيل السريع لكل ولايات الجزائر الـ 58. الدفع يتم نقداً عند الاستلام فقط (Main à la main) بعد معاينة الطرد."
                  : "Les commandes passées sur la boutique officielle ANJUCIA sont expédiées vers l'ensemble des 58 Wilayas d'Algérie sous 24h à 72h selon la région. Le règlement s'effectue exclusivement en espèces à la livraison (Cash on Delivery) auprès du livreur."}
              </p>
              <div style={{ background: "var(--bg-secondary)", borderRadius: "10px", padding: "0.9rem 1.2rem", border: "1px solid var(--border-subtle)", marginTop: "1rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {lang === "dz" ? "سعر المنتج النجم :" : "Tarif Officiel Produit Phare :"}
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 900, color: "var(--accent-aqua)", marginLeft: "0.5rem" }}>
                  1 500 DA (Lightweight Soothing Face Gel-Cream 50ml)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Return to home button */}
        <div className="scroll-reveal stagger-5" style={{ textAlign: "center", marginTop: "3rem" }}>
          <a href="/" className="btn-aqua" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
            {lang === "dz" ? "العودة إلى المتجر الرئيسي" : "Retourner à la Boutique Officielle"}
          </a>
        </div>

      </div>
    </main>
  );
}
