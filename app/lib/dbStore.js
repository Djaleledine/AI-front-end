import fs from "fs";
import path from "path";
import crypto from "crypto";
import { connectToMongoDB, getMongoStatus } from "./mongodb";
import {
  ProductModel,
  OrderModel,
  BundleModel,
  LeadModel,
  ReviewModel,
  PharmacyModel,
  DermoScanLogModel,
  SiteConfigModel
} from "./models";
import { ANJUCIA_PRODUCTS, AVAILABLE_PRODUCT_ID } from "../data/products";
import {
  CATALOG_BUNDLES,
  CATALOG_REVIEWS,
  PARTNER_PHARMACIES
} from "../data/catalogSeeds";
import { hashAdminPin } from "./security";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "anjucia-db.json");

// FIFO Async Mutex to serialize all file/DB read-modify-write cycles
let dbMutexChain = global.__anjuciaDbMutex || Promise.resolve();
if (!global.__anjuciaDbMutex) {
  global.__anjuciaDbMutex = dbMutexChain;
}

function withDbLock(taskFn) {
  const next = dbMutexChain.then(taskFn, taskFn);
  dbMutexChain = next.catch(() => {});
  global.__anjuciaDbMutex = dbMutexChain;
  return next;
}

const INITIAL_SITE_CONFIG = {
  key: "global",
  announcementText:
    "Livraison 58 Wilayas • Paiement à la livraison (COD) • Formule Clinique Haute Tolérance",
  supportPhone: "+213 550 12 34 56",
  whatsappNumber: "213550123456",
  heroHeadline: "Formulée en Algérie. Validée à l’international.",
  heroParagraph:
    "La crème Anjucia est conçue par une pharmacienne algérienne, et a obtenu la validation d’une experte internationale en formulation.",
  freeShippingThreshold: 2,
  enableFreeShippingPromo: true,
  algerDeliveryFee: 400,
  northDeliveryFee: 600,
  highPlateauDeliveryFee: 650,
  southDeliveryFee: 850,
  carriers: [
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
  ],
  dermoscanEnabled: true,
  adminPinHash: process.env.ADMIN_PIN ? hashAdminPin(process.env.ADMIN_PIN) : ""
};

function buildDefaultState() {
  return {
    products: ANJUCIA_PRODUCTS.map((p) => ({
      ...p,
      status: p.id === AVAILABLE_PRODUCT_ID ? "available" : "coming_soon",
      stockCount: p.id === AVAILABLE_PRODUCT_ID ? 150 : 0
    })),
    orders: [],
    bundles: [...CATALOG_BUNDLES],
    leads: [],
    reviews: CATALOG_REVIEWS.map((r) => ({
      ...r,
      visible: true,
      createdAt: new Date().toISOString()
    })),
    pharmacies: [...PARTNER_PHARMACIES],
    dermoscanLogs: [],
    siteConfig: { ...INITIAL_SITE_CONFIG },
    updatedAt: new Date().toISOString()
  };
}

function normalizeSiteConfig(rawConfig, defaultsConfig) {
  const merged = { ...defaultsConfig, ...(rawConfig || {}) };
  // Migrate any legacy plaintext adminPin into PBKDF2 adminPinHash and delete plaintext
  if (merged.adminPin && typeof merged.adminPin === "string") {
    if (!merged.adminPinHash) {
      merged.adminPinHash = hashAdminPin(merged.adminPin);
    }
    delete merged.adminPin;
  }
  return merged;
}

export function readLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial = buildDefaultState();
      writeLocalDb(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const defaults = buildDefaultState();
    const cleanedConfig = normalizeSiteConfig(parsed.siteConfig, defaults.siteConfig);

    // If legacy plaintext adminPin was present on disk, rewrite immediately without it
    if (parsed?.siteConfig?.adminPin) {
      writeLocalDb({ ...parsed, siteConfig: cleanedConfig });
    }

    return {
      products: Array.isArray(parsed.products) ? parsed.products : defaults.products,
      orders: Array.isArray(parsed.orders) ? parsed.orders : defaults.orders,
      bundles: Array.isArray(parsed.bundles) ? parsed.bundles : defaults.bundles,
      leads: Array.isArray(parsed.leads) ? parsed.leads : defaults.leads,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaults.reviews,
      pharmacies: Array.isArray(parsed.pharmacies) ? parsed.pharmacies : defaults.pharmacies,
      dermoscanLogs: Array.isArray(parsed.dermoscanLogs)
        ? parsed.dermoscanLogs
        : defaults.dermoscanLogs,
      siteConfig: cleanedConfig,
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch (err) {
    console.warn("[dbStore] Fallback to in-memory default state:", err?.message);
    return buildDefaultState();
  }
}

export function writeLocalDb(nextState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const cleanConfig = { ...(nextState.siteConfig || {}) };
    delete cleanConfig.adminPin;

    const payload = {
      ...nextState,
      siteConfig: cleanConfig,
      updatedAt: new Date().toISOString()
    };
    const tmpPath = `${DB_FILE_PATH}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), "utf8");
    fs.renameSync(tmpPath, DB_FILE_PATH);
    return payload;
  } catch (err) {
    console.warn("[dbStore] Write error:", err?.message);
    return nextState;
  }
}

async function syncCollectionNonDestructive(Model, items = []) {
  const validItems = Array.isArray(items) ? items.filter((item) => item && item.id) : [];
  const ids = validItems.map((item) => item.id);

  if (validItems.length > 0) {
    const ops = validItems.map((doc) => {
      const { _id, __v, ...cleanDoc } = doc;
      return {
        updateOne: {
          filter: { id: cleanDoc.id },
          update: { $set: cleanDoc },
          upsert: true
        }
      };
    });
    await Model.bulkWrite(ops, { ordered: false });
  }

  await Model.deleteMany({ id: { $nin: ids } });
}

/**
 * Syncs local state with MongoDB if MongoDB is connected.
 */
async function syncWithMongoIfConnected(localState) {
  const { isConnected } = await connectToMongoDB();
  if (!isConnected) {
    return { state: localState, mongoStatus: getMongoStatus() };
  }

  try {
    const prodCount = await ProductModel.countDocuments();
    if (prodCount === 0 && localState.products.length > 0) {
      await syncCollectionNonDestructive(ProductModel, localState.products);
    }
    const bundleCount = await BundleModel.countDocuments();
    if (bundleCount === 0 && localState.bundles.length > 0) {
      await syncCollectionNonDestructive(BundleModel, localState.bundles);
    }
    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0 && localState.reviews.length > 0) {
      await syncCollectionNonDestructive(ReviewModel, localState.reviews);
    }
    const pharmaCount = await PharmacyModel.countDocuments();
    if (pharmaCount === 0 && localState.pharmacies.length > 0) {
      await syncCollectionNonDestructive(PharmacyModel, localState.pharmacies);
    }
    const configDoc = await SiteConfigModel.findOne({ key: "global" }).lean();
    if (!configDoc) {
      await SiteConfigModel.findOneAndUpdate(
        { key: "global" },
        { $set: localState.siteConfig },
        { upsert: true }
      );
    }

    const [
      products,
      orders,
      bundles,
      leads,
      reviews,
      pharmacies,
      dermoscanLogs,
      siteConfig
    ] = await Promise.all([
      ProductModel.find({}).sort({ createdAt: 1 }).lean(),
      OrderModel.find({}).sort({ createdAt: -1 }).lean(),
      BundleModel.find({}).lean(),
      LeadModel.find({}).sort({ createdAt: -1 }).lean(),
      ReviewModel.find({}).sort({ createdAt: -1 }).lean(),
      PharmacyModel.find({}).lean(),
      DermoScanLogModel.find({}).sort({ createdAt: -1 }).limit(100).lean(),
      SiteConfigModel.findOne({ key: "global" }).lean()
    ]);

    const merged = {
      products: products.length ? products : localState.products,
      orders: orders.length ? orders : localState.orders,
      bundles: bundles.length ? bundles : localState.bundles,
      leads: leads.length ? leads : localState.leads,
      reviews: reviews.length ? reviews : localState.reviews,
      pharmacies: pharmacies.length ? pharmacies : localState.pharmacies,
      dermoscanLogs: dermoscanLogs.length ? dermoscanLogs : localState.dermoscanLogs,
      siteConfig: normalizeSiteConfig(siteConfig, localState.siteConfig),
      updatedAt: new Date().toISOString()
    };

    writeLocalDb(merged);
    return { state: merged, mongoStatus: getMongoStatus() };
  } catch (err) {
    return { state: localState, mongoStatus: getMongoStatus() };
  }
}

export async function getFullDatabaseState() {
  const localState = readLocalDb();
  return await syncWithMongoIfConnected(localState);
}

export async function mutateDatabase(mutatorFn) {
  return await withDbLock(async () => {
    const localState = readLocalDb();
    const updatedState = await mutatorFn(localState);
    const saved = writeLocalDb(updatedState);

    const { isConnected } = await connectToMongoDB();
    if (isConnected) {
      try {
        await Promise.all([
          syncCollectionNonDestructive(ProductModel, saved.products),
          syncCollectionNonDestructive(OrderModel, saved.orders),
          syncCollectionNonDestructive(BundleModel, saved.bundles),
          syncCollectionNonDestructive(LeadModel, saved.leads),
          syncCollectionNonDestructive(ReviewModel, saved.reviews),
          syncCollectionNonDestructive(PharmacyModel, saved.pharmacies),
          syncCollectionNonDestructive(DermoScanLogModel, saved.dermoscanLogs),
          SiteConfigModel.findOneAndUpdate(
            { key: "global" },
            { $set: saved.siteConfig },
            { upsert: true }
          )
        ]);
      } catch (err) {
        console.warn("[dbStore] MongoDB sync warning:", err?.message);
      }
    }

    return { state: saved, mongoStatus: getMongoStatus() };
  });
}

export async function resetDatabaseToFactory() {
  const defaults = buildDefaultState();
  return await mutateDatabase(() => defaults);
}

export async function logDermoScanEvent(scanEntry) {
  return await mutateDatabase((state) => {
    const entry = {
      id: `SCAN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...scanEntry
    };
    return {
      ...state,
      dermoscanLogs: [entry, ...(state.dermoscanLogs || [])].slice(0, 200)
    };
  });
}
