"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { Sparkles, CheckCircle2, Info } from "lucide-react";

export default function ToastContainer() {
  const { toasts } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: "fixed",
        top: "max(env(safe-area-inset-top, 0px), 16px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2500,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        pointerEvents: "none",
        width: "92%",
        maxWidth: "400px"
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: "rgba(17, 23, 26, 0.96)",
            backdropFilter: "blur(14px)",
            border: "1.5px solid var(--accent-aqua)",
            borderRadius: "14px",
            padding: "0.75rem 1rem",
            color: "#FFFFFF",
            boxShadow: "var(--shadow-md), var(--shadow-glow)",
            fontSize: "0.82rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            animation: "slide-down 0.25s ease"
          }}
        >
          {toast.type === "info" ? (
            <Info size={17} color="var(--accent-aqua)" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={17} color="var(--success)" style={{ flexShrink: 0 }} />
          )}
          <span style={{ lineHeight: 1.35 }}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
