"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollAnimationEngine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Track scroll progress and scroll-to-top visibility
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0) {
            const current = (window.scrollY / totalScroll) * 100;
            setScrollProgress(Math.min(100, Math.max(0, current)));
          }
          setShowScrollTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Circular gauge calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Luminous Top Scroll Progress Bar */}
      <div
        className="global-scroll-progress-wrap"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="global-scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Circular Progress / Scroll to Top Orb */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`scroll-to-top-orb ${showScrollTop ? "visible" : ""}`}
        aria-label="Retour en haut de page"
        title="Retour en haut de page"
      >
        <svg className="scroll-progress-ring" width="46" height="46" viewBox="0 0 46 46">
          <circle
            className="scroll-progress-ring-bg"
            stroke="var(--border-light)"
            strokeWidth="2.5"
            fill="transparent"
            r={radius}
            cx="23"
            cy="23"
          />
          <circle
            className="scroll-progress-ring-circle"
            stroke="var(--accent-aqua)"
            strokeWidth="2.5"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="23"
            cy="23"
          />
        </svg>
        <div className="scroll-orb-icon">
          <ArrowUp size={16} />
        </div>
      </button>
    </>
  );
}
