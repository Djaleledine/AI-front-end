"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ANJUCIA_PRODUCTS } from "../data/products";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState("16 - Alger");
  const [toasts, setToasts] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("anjucia_next_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    }
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
    const product = ANJUCIA_PRODUCTS.find((p) => p.id === productId) || (typeof productOrId === "object" ? productOrId : null);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            priceDZD: product.priceDZD,
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
        addToCart("soothing-gel-cream", 1);
        addToCart("cerahydra-cream-50", 1);
        addToCart("bioshield-spf50", 1);
      }
    } else {
      addToCart("soothing-gel-cream", 1);
      addToCart("cerahydra-cream-50", 1);
      addToCart("bioshield-spf50", 1);
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
