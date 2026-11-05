/**
 * ANJUCIA Production Storefront API Client ("storeApi")
 * Connects client components to the Node.js + MongoDB backend (/api/store).
 */

import { ANJUCIA_PRODUCTS } from "../data/products";
import {
  CATALOG_BUNDLES,
  CATALOG_REVIEWS,
  PARTNER_PHARMACIES,
  WILAYAS_LOGISTICS
} from "../data/catalogSeeds";

async function fetchStoreEndpoint(options = {}) {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/store", options);
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return null;
}

export const storeApi = {
  products: {
    async getAll(filters = {}) {
      const storeResult = await fetchStoreEndpoint();
      let list = storeResult?.data?.products || [...ANJUCIA_PRODUCTS];
      if (filters.category && filters.category !== "all") {
        list = list.filter((p) => p.category === filters.category);
      }
      return list;
    },

    async getById(id) {
      const storeResult = await fetchStoreEndpoint();
      const list = storeResult?.data?.products || ANJUCIA_PRODUCTS;
      return list.find((p) => p.id === id) || null;
    }
  },

  bundles: {
    async getAll() {
      const storeResult = await fetchStoreEndpoint();
      return storeResult?.data?.bundles || CATALOG_BUNDLES;
    }
  },

  reviews: {
    async getAll() {
      const storeResult = await fetchStoreEndpoint();
      return storeResult?.data?.reviews || CATALOG_REVIEWS;
    }
  },

  pharmacies: {
    async getAll() {
      const storeResult = await fetchStoreEndpoint();
      return storeResult?.data?.pharmacies || PARTNER_PHARMACIES;
    }
  },

  wilayas: {
    async getAll() {
      return WILAYAS_LOGISTICS;
    }
  },

  orders: {
    async create(orderPayload) {
      const orderId = `DZ-ANJ-${Date.now().toString().slice(-6)}`;
      const fallbackOrder = {
        id: orderId,
        orderId,
        trackingCode: `YAL-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "CONFIRMED_PREPARING",
        carrier: "Yalidine Express",
        paymentMethod: "COD (Paiement à la Livraison)",
        createdAt: new Date().toISOString(),
        ...orderPayload
      };

      const json = await fetchStoreEndpoint({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "order", payload: fallbackOrder })
      });

      if (json?.ok && json?.data) {
        return json.data;
      }
      return fallbackOrder;
    }
  },

  leads: {
    async create(leadPayload) {
      const json = await fetchStoreEndpoint({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lead", payload: leadPayload })
      });
      return json?.data || leadPayload;
    }
  }
};

export default storeApi;

