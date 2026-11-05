"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ANJUCIA_PRODUCTS, isPurchasable, AVAILABLE_PRODUCT_ID } from "../data/products";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState("16 - Alger");
  const [toasts, setToasts] = useState([]);
  const [serverCatalog, setServerCatalog] = useState(ANJUCIA_PRODUCTS);

  // Load cart from localStorage and sync authoritative prices from /api/store
  useEffect(() => {
    let mounted = true;
    async function initCartAndCatalog() {
      let catalogList = ANJUCIA_PRODUCTS;
      try {
        const res = await fetch("/api/store");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.data?.products) && json.data.products.length > 0) {
            catalogList = json.data.products;
            if (mounted) setServerCatalog(catalogList);
          }
        }
      } catch (_) {}

      try {
        const saved = localStorage.getItem("anjucia_next_cart");
        if (saved && mounted) {
          const catalogMap = new Map(catalogList.map((p) => [p.id, p]));
          const items = JSON.parse(saved)
            .filter((i) => {
              const p = catalogMap.get(i.id);
              return p
                ? p.status === "available" || p.status === "in_stock"
                : isPurchasable(i.id);
            })
            .map((i) => {
              const p = catalogMap.get(i.id);
              return {
                ...i,
                priceDZD: p?.priceDZD ?? i.priceDZD,
                image: null
              };
            });
          setCartItems(items);
        }
      } catch (e) {
        console.warn("Could not load cart from localStorage", e);
      }
    }
    initCartAndCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  // Save to localStorage
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem("anjucia_next_cart", JSON.stringify(items));
    } catch (e) {}
  };

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const addToCart = (productOrId, qty = 1) => {
    const productId = typeof productOrId === "object" ? productOrId?.id : productOrId;
    const product =
      serverCatalog.find((p) => p.id === productId) ||
      ANJUCIA_PRODUCTS.find((p) => p.id === productId) ||
      (typeof productOrId === "object" ? productOrId : null);
    if (!product) return;

    const liveInStock =
      product.status === "available" ||
      product.status === "in_stock" ||
      isPurchasable(product.id);
    const livePriceDZD = Number(product.priceDZD) || 1800;

    if (!liveInStock) {
      showToast("Bientôt disponible — on vous préviendra ✨", "info");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.id === productId ? { ...item, priceDZD: livePriceDZD, qty: item.qty + qty } : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            priceDZD: livePriceDZD,
            volume: product.volume,
            image: product.image,
            qty: qty
          }
        ];
      }
      try {
        localStorage.setItem("anjucia_next_cart", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`Ajouté au panier : ${product.name}`);

    // Dispatch custom event for GSAP confetti burst
    try {
      window.dispatchEvent(new CustomEvent("anjucia:addtocart", {
        detail: {
          x: window._lastMouseX ?? window.innerWidth / 2,
          y: window._lastMouseY ?? window.innerHeight * 0.55,
        }
      }));
    } catch (_) {}

  };

  const addHybridHero = (productId = "soothing-gel-cream") => {
    addToCart(productId, 1);
    setIsCartOpen(true);
  };

  const addPrescriptionBundle = (routine) => {
    if (Array.isArray(routine) && routine.length > 0) {
      let addedCount = 0;
      routine.forEach((step) => {
        const prodId = step.ourProductId || step.productId || (step.isOurProduct || step.isAnjucia ? (step.id || "soothing-gel-cream") : null);
        if (prodId) {
          addToCart(prodId, 1);
          addedCount++;
        }
      });
      if (addedCount === 0) {
        addToCart(AVAILABLE_PRODUCT_ID, 1);
      }
    } else {
      addToCart(AVAILABLE_PRODUCT_ID, 1);
    }
    setIsCartOpen(true);
    showToast("Protocole Expert DermoScan ajouté au panier !");
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((i) => i.id !== productId);
    saveCart(updated);
  };

  const updateQty = (productId, delta) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      const updated = cartItems.map((i) =>
        i.id === productId ? { ...i, qty: newQty } : i
      );
      saveCart(updated);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotalDZD = cartItems.reduce(
    (sum, item) => sum + item.priceDZD * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        selectedWilaya,
        setSelectedWilaya,
        addToCart,
        addHybridHero,
        addPrescriptionBundle,
        removeFromCart,
        updateQty,
        clearCart,
        totalCount,
        subtotalDZD,
        showToast,
        toasts
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
