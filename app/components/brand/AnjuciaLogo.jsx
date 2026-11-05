"use client";

import React from "react";

/**
 * Anjucia Droplet Mark — official symbol extracted from brand logo.
 * Supports custom tinting via mask-image when `color` is provided.
 */
export function DropletMark({
  size = 28,
  color,
  className = "",
  title = "Anjucia",
  style
}) {
  const height = Math.round((size * 124) / 89);

  if (color && color !== "currentColor") {
    return (
      <span
        role="img"
        aria-label={title}
        className={`anj-droplet-mark ${className}`}
        style={{
          display: "inline-block",
          width: size,
          height: height,
          backgroundColor: color,
          WebkitMaskImage: "url('/brand/anjucia-mark.png')",
          maskImage: "url('/brand/anjucia-mark.png')",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          verticalAlign: "middle",
          ...style
        }}
      />
    );
  }

  return (
    <img
      src="/brand/anjucia-mark.png"
      alt={title}
      width={size}
      height={height}
      className={`anj-droplet-mark ${className}`}
      style={{
        width: size,
        height: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        filter: "var(--logo-filter, none)",
        ...style
      }}
    />
  );
}

/**
 * Official ANJUCIA Brand Logo
 * - variant="stacked" (default): Droplet on top, "Anjucia" below (exact 1:1 match of brand logo)
 * - variant="horizontal": Droplet on left, "Anjucia" on right
 * - variant="mark": Standalone droplet symbol
 * - variant="wordmark": Standalone typography
 */
export default function AnjuciaLogo({
  variant = "stacked",
  size = 38,
  className = "",
  onClick,
  style
}) {
  if (variant === "mark") {
    return <DropletMark size={size} className={className} style={style} />;
  }

  if (variant === "horizontal") {
    return (
      <img
        src="/brand/anjucia-logo-horizontal.png"
        alt="ANJUCIA"
        height={size}
        className={`anj-logo anj-logo-horizontal ${className}`}
        onClick={onClick}
        style={{
          height: size,
          width: "auto",
          display: "inline-block",
          verticalAlign: "middle",
          filter: "var(--logo-filter, none)",
          cursor: onClick ? "pointer" : "default",
          ...style
        }}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      <img
        src="/brand/anjucia-wordmark.png"
        alt="ANJUCIA"
        height={size}
        className={`anj-logo anj-logo-wordmark ${className}`}
        onClick={onClick}
        style={{
          height: size,
          width: "auto",
          display: "inline-block",
          verticalAlign: "middle",
          filter: "var(--logo-filter, none)",
          cursor: onClick ? "pointer" : "default",
          ...style
        }}
      />
    );
  }

  // Default: stacked lockup (the exact uploaded logo)
  return (
    <img
      src="/brand/anjucia-logo.png"
      alt="ANJUCIA"
      height={size}
      className={`anj-logo anj-logo-stacked ${className}`}
      onClick={onClick}
      style={{
        height: size,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        filter: "var(--logo-filter, none)",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    />
  );
}
