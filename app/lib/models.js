import mongoose from "mongoose";

const ActiveIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    percentage: { type: String, default: "1.0%" },
    role: { type: String, default: "" }
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    frenchName: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    category: { type: String, default: "hydratation" },
    volume: { type: String, default: "50 ml ℮ 1.7 FL. OZ." },
    packaging: { type: String, default: "Tube Protecteur 50 ml" },
    priceDZD: { type: Number, required: true, default: 1800 },
    originalPriceDZD: { type: Number, default: null },
    badge: { type: String, default: "FORMULATION AVANCÉE" },
    status: {
      type: String,
      enum: ["available", "in_stock", "coming_soon", "out_of_stock"],
      default: "available"
    },
    stockCount: { type: Number, default: 120 },
    isHero: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: true },
    image: { type: String, default: null },
    description: { type: String, default: "" },
    actives: { type: [ActiveIngredientSchema], default: [] },
    technicalSpecs: {
      format: { type: String, default: "Gel-Crème émulsion Huile dans Eau (H/E)" },
      ph: { type: String, default: "5.2 physiologique" },
      texture: { type: String, default: "Fraîche, aqueuse, pénétration en 30s" },
      packaging: { type: String, default: "Tube protecteur hygiénique" }
    },
    rating: { type: Number, default: 4.97 },
    reviewsCount: { type: Number, default: 148 },
    benefitClaim: { type: String, default: "" }
  },
  { timestamps: true }
);

const OrderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    priceDZD: { type: Number, default: 1800 }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true },
    trackingCode: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, default: "" },
    wilaya: { type: String, required: true },
    commune: { type: String, default: "" },
    items: { type: [OrderItemSchema], default: [] },
    subtotalDZD: { type: Number, default: 1800 },
    deliveryFeeDZD: { type: Number, default: 0 },
    totalDZD: { type: Number, required: true },
    paymentMethod: { type: String, default: "COD (Paiement à la Livraison)" },
    carrier: { type: String, default: "Yalidine Express" },
    status: {
      type: String,
      enum: [
        "PENDING_VERIFICATION",
        "CONFIRMED_PREPARING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PENDING_VERIFICATION"
    },
    notes: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

const BundleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    badge: { type: mongoose.Schema.Types.Mixed, default: {} },
    name: { type: mongoose.Schema.Types.Mixed, required: true },
    subtitle: { type: mongoose.Schema.Types.Mixed, default: {} },
    priceDZD: { type: Number, required: true },
    priceFormatted: { type: String, default: "" },
    originalPriceDZD: { type: Number, default: 0 },
    items: { type: [String], default: [] },
    features: { type: [mongoose.Schema.Types.Mixed], default: [] },
    isPopular: { type: Boolean, default: false },
    freeDelivery: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const LeadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: String, default: "soothing-gel-cream" },
    productName: { type: String, default: "" },
    contact: { type: String, required: true },
    wilaya: { type: String, default: "16 - Alger" },
    source: { type: String, default: "Web" },
    status: { type: String, default: "NEW" },
    notes: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    location: { type: String, default: "Alger (16)" },
    rating: { type: Number, default: 5 },
    verified: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    product: { type: String, default: "Lightweight Soothing Face Gel-Cream" },
    comment: {
      fr: { type: String, default: "" },
      en: { type: String, default: "" },
      dz: { type: String, default: "" }
    },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

const PharmacySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    wilaya: { type: String, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    statusText: { type: String, default: "En Stock Immédiat" }
  },
  { timestamps: true }
);

const DermoScanLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    wilaya: { type: String, default: "16 - Alger" },
    climateZone: { type: String, default: "coastal_calcaire" },
    mode: { type: String, default: "camera" },
    skinType: { type: String, default: "" },
    hydrationScore: { type: Number, default: 60 },
    barrierIntegrityScore: { type: Number, default: 65 },
    sebumLevel: { type: String, default: "" },
    rednessLevel: { type: String, default: "" },
    prescribedProducts: { type: [String], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

const SiteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    announcementText: {
      type: String,
      default:
        "Livraison 58 Wilayas • Paiement à la livraison (COD) • Formule Clinique Haute Tolérance"
    },
    supportPhone: { type: String, default: "+213 550 12 34 56" },
    whatsappNumber: { type: String, default: "213550123456" },
    heroHeadline: {
      type: String,
      default: "Formulée en Algérie. Validée à l’international."
    },
    heroParagraph: {
      type: String,
      default:
        "La crème Anjucia est conçue par une pharmacienne algérienne, et a obtenu la validation d’une experte internationale en formulation."
    },
    freeShippingThreshold: { type: Number, default: 2 },
    enableFreeShippingPromo: { type: Boolean, default: true },
    algerDeliveryFee: { type: Number, default: 400 },
    northDeliveryFee: { type: Number, default: 600 },
    highPlateauDeliveryFee: { type: Number, default: 650 },
    southDeliveryFee: { type: Number, default: 850 },
    carriers: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        {
          id: "yalidine",
          name: "Yalidine Express",
          coverage: "58 Wilayas (Stop-desk & Domicile)",
          status: "Connecté (Actif)",
          active: true
        },
        {
          id: "zr-express",
          name: "ZR Express",
          coverage: "Grandes villes & Nord",
          status: "Opérationnel",
          active: true
        },
        {
          id: "mayestro",
          name: "Mayestro Delivery",
          coverage: "Alger Express sous 4h",
          status: "Actif local",
          active: true
        }
      ]
    },
    dermoscanEnabled: { type: Boolean, default: true },
    adminPinHash: { type: String, default: "" }
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.AnjuciaProduct || mongoose.model("AnjuciaProduct", ProductSchema);
export const OrderModel =
  mongoose.models.AnjuciaOrder || mongoose.model("AnjuciaOrder", OrderSchema);
export const BundleModel =
  mongoose.models.AnjuciaBundle || mongoose.model("AnjuciaBundle", BundleSchema);
export const LeadModel =
  mongoose.models.AnjuciaLead || mongoose.model("AnjuciaLead", LeadSchema);
export const ReviewModel =
  mongoose.models.AnjuciaReview || mongoose.model("AnjuciaReview", ReviewSchema);
export const PharmacyModel =
  mongoose.models.AnjuciaPharmacy || mongoose.model("AnjuciaPharmacy", PharmacySchema);
export const DermoScanLogModel =
  mongoose.models.AnjuciaDermoScanLog ||
  mongoose.model("AnjuciaDermoScanLog", DermoScanLogSchema);
export const SiteConfigModel =
  mongoose.models.AnjuciaSiteConfig ||
  mongoose.model("AnjuciaSiteConfig", SiteConfigSchema);

