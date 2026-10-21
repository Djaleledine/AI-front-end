"use client";

import React, { useId } from "react";

/**
 * Anjucia droplet mark — vector redraw of /public/brand/anjucia-logo.png.
 * The inner swirl is cut out with a mask so the mark works on any background.
 */
export const DROPLET_PATH =
  "M50 3C50 3 11 50 11 84C11 107 28.5 125 50 125C71.5 125 89 107 89 84C89 50 50 3 50 3Z";

export const SWIRL_PATH =
  "M11 80C23 70 39 65.5 54 67.5C66.5 69.5 73 78 67 86.5C63 92 55.5 91.5 53.5 87C58 86 61.5 82.5 59.5 78.5C56.5 73.5 46 73.5 36 77.5C26.5 81.5 18 87.5 11 93Z";

export function DropletMark({ size = 28, color = "currentColor", className = "", title = "Anjucia", style }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 100 128"
      width={size}
      height={(size * 128) / 100}
      className={className}
      style={style}
      role="img"
      aria-label={title}
    >
      <defs>
        <mask id={`swirl-${id}`}>
          <rect width="100" height="128" fill="#fff" />
          <path d={SWIRL_PATH} fill="#000" />
        </mask>
      </defs>
      <path d={DROPLET_PATH} fill={color} mask={`url(#swirl-${id})`} />
    </svg>
  );
}

/** Full lockup: droplet + "Anjucia" wordmark (rounded geometric type). */
export default function AnjuciaLogo({ variant = "full", size = 26, className = "", onClick }) {
  if (variant === "mark") return <DropletMark size={size} className={className} />;
  return (
    <span className={`anj-logo ${className}`} onClick={onClick}>
      <DropletMark size={size * 0.78} className="anj-logo-mark" />
      <span className="anj-logo-word" style={{ fontSize: size * 0.86 }}>Anjucia</span>
    </span>
  );
}
