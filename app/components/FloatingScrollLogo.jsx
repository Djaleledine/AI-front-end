"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingScrollLogo() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        if (totalHeight > 0) {
          const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
          setScrollProgress(progress);
        }

        setIsVisible(currentScroll > 240);
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SVG Circle measurements
  const size = 52;
  const strokeWidth = 2.5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <aside
      className={`floating-scroll-companion ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="ANJUCIA • Remonter en haut de page"
      aria-label="Remonter en haut de page"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToTop();
        }
      }}
    >
      {/* Circular SVG Scroll Progress Ring */}
      <svg
        className="companion-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className="companion-track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Active progress stroke */}
        <circle
          className="companion-indicator"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center Icon: Anjucia AJ symbol or ArrowUp on hover */}
      <div className="companion-inner-core">
        {isHovered ? (
          <ArrowUp size={18} color="var(--accent-aqua)" className="companion-arrow" />
        ) : (
          <img
            src="/assets/anjucia-symbol.png"
            alt="Anjucia"
            className="companion-symbol"
          />
        )}
      </div>

      {/* Floating Tooltip */}
      <span className="companion-tooltip">Haut de page</span>
    </aside>
  );
}
