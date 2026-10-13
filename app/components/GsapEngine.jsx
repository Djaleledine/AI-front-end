"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Mobile detection ────────────────────────────────────────────────────────
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// ─── Confetti Burst ───────────────────────────────────────────────────────────
function spawnConfetti(ox = window.innerWidth / 2, oy = window.innerHeight * 0.6) {
  const colors = ["#719FB7", "#9BB0A0", "#D0E1E9", "#436D88", "#38BDF8", "#FFFFFF", "#A8D8EA"];
  for (let i = 0; i < 52; i++) {
    const el = document.createElement("div");
    const sz = Math.random() * 9 + 4;
    el.style.cssText = `position:fixed;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.45 ? "50%" : "2px"};left:${ox}px;top:${oy}px;pointer-events:none;z-index:9998;will-change:transform,opacity;`;
    document.body.appendChild(el);
    gsap.to(el, {
      x: (Math.random() - 0.5) * 420,
      y: -(Math.random() * 340 + 100),
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      scale: Math.random() * 1.6 + 0.3,
      duration: Math.random() * 1.1 + 0.7,
      ease: "power2.out",
      delay: Math.random() * 0.25,
      onComplete: () => el.remove()
    });
  }
}

// ─── Hero Floating Particles ──────────────────────────────────────────────────
function spawnHeroParticles() {
  const hero = document.querySelector(".gsap-hero-particles");
  if (!hero) return;
  hero.innerHTML = "";
  const colors = ["rgba(113,159,183,0.55)", "rgba(155,176,160,0.45)", "rgba(208,225,233,0.35)", "rgba(67,109,136,0.4)"];
  for (let i = 0; i < (isTouch() ? 12 : 24); i++) {
    const dot = document.createElement("div");
    const sz = Math.random() * 6 + 2;
    dot.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:${Math.random() * 100}%;pointer-events:none;will-change:transform;filter:${Math.random() > 0.6 ? "blur(1px)" : "none"};`;
    hero.appendChild(dot);
    gsap.to(dot, {
      y: (Math.random() - 0.5) * 80,
      x: (Math.random() - 0.5) * 40,
      opacity: Math.random() * 0.7 + 0.2,
      duration: Math.random() * 5 + 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 4
    });
  }
}

// ─── Luminous Dermo Particles Spawning on Scroll ─────────────────────────────
function initScrollSparks() {
  let lastSparkTime = 0;
  const colors = ["#719FB7", "#9BB0A0", "#D0E1E9", "#38BDF8", "#FFFFFF"];

  const onScroll = () => {
    const now = Date.now();
    if (now - lastSparkTime < 140) return;
    lastSparkTime = now;

    if (isTouch()) return;

    const count = Math.random() > 0.6 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = "scroll-spark-particle";
      const sz = Math.random() * 5 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isRight = Math.random() > 0.5;
      const posX = isRight
        ? window.innerWidth - (Math.random() * 120 + 30)
        : Math.random() * 120 + 30;
      const posY = Math.random() * (window.innerHeight * 0.75) + (window.innerHeight * 0.12);

      spark.style.cssText = `position:fixed;left:${posX}px;top:${posY}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}, 0 0 4px #FFFFFF;pointer-events:none;z-index:9990;will-change:transform,opacity;`;
      document.body.appendChild(spark);

      gsap.to(spark, {
        y: (Math.random() - 0.5) * 50,
        x: (isRight ? -1 : 1) * (Math.random() * 40 + 10),
        scale: Math.random() * 1.5 + 0.5,
        opacity: 0,
        duration: Math.random() * 0.75 + 0.55,
        ease: "power2.out",
        onComplete: () => spark.remove(),
      });
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// ─── GSAP Velocity Marquee ───────────────────────────────────────────────────
function initVelocityMarquee() {
  const track = document.querySelector("[data-gsap-marquee]");
  if (!track) return () => {};

  const baseSpeed = 0.65;
  let xPos = 0;
  let scrollVelocity = 0;
  let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const totalWidth = track.scrollWidth / 2 || 1200;

  const tickerFn = () => {
    xPos -= (baseSpeed + scrollVelocity);
    scrollVelocity *= 0.92;
    if (Math.abs(xPos) >= totalWidth) xPos = 0;
    gsap.set(track, { x: xPos });
  };
  gsap.ticker.add(tickerFn);

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    scrollVelocity = Math.min(delta * 0.15, 9);
    lastScrollY = currentScrollY;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    gsap.ticker.remove(tickerFn);
    window.removeEventListener("scroll", onScroll);
  };
}

export default function GsapEngine() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const touch = isTouch();
    const cleanups = [];

    const ctx = gsap.context(() => {

      // ── 1. HERO BESPOKE 3D ENTRANCE ────────────────────────────────────────
      const heroEls = document.querySelectorAll(".gsap-hero-el");
      if (heroEls.length) {
        gsap.fromTo(heroEls,
          { opacity: 0, y: 36, rotateX: touch ? 0 : 6, transformPerspective: 1000, filter: "blur(5px)" },
          { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.1 }
        );
      }

      spawnHeroParticles();
      cleanups.push(initVelocityMarquee());
      cleanups.push(initScrollSparks());

      // ── 2. HERO NUMBER ROLL COUNTERS (Re-rolls Cleanly on Scroll) ───────────
      document.querySelectorAll("[data-gsap-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.gsapCounter);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";

        const obj = { val: 0 };
        let lastVal = -1;

        const rollAnim = gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: "power4.out",
          paused: true,
          onUpdate() {
            const rounded = Math.round(obj.val);
            if (rounded !== lastVal) {
              lastVal = rounded;
              el.textContent = `${prefix}${rounded.toLocaleString()}${suffix}`;
              gsap.fromTo(el, { y: -2, opacity: 0.8 }, { y: 0, opacity: 1, duration: 0.08, ease: "power2.out", overwrite: "auto" });
            }
          }
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          onEnter: () => {
            obj.val = 0;
            lastVal = -1;
            rollAnim.restart();
          },
          onEnterBack: () => {
            obj.val = 0;
            lastVal = -1;
            rollAnim.restart();
          },
        });
      });

      // ── 3. SPLIT TEXT HEADLINE REVEALS (Stays Visible When Scrolling Past) ──
      document.querySelectorAll(".gsap-headline").forEach((heading) => {
        if (!heading.dataset.splitDone) {
          heading.dataset.splitDone = "true";
          const words = heading.textContent.trim().split(" ");
          heading.innerHTML = words.map((w) =>
            `<span class="gsap-word-mask"><span class="gsap-word">${w}&nbsp;</span></span>`
          ).join("");
        }
        const wordEls = heading.querySelectorAll(".gsap-word");
        gsap.fromTo(wordEls,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 0.8, stagger: 0.035, ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 88%",
              toggleActions: "play none none reverse", // Stays visible while reading!
            },
          }
        );
      });

      // ── 4. SMOOTH SIDE REVEALS (Subtle & Natural, Never Inverted) ───────────
      gsap.utils.toArray(".scroll-reveal-left").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, x: touch ? -14 : -32 },
          {
            opacity: 1, x: 0, duration: 0.75, ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      gsap.utils.toArray(".scroll-reveal-right").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, x: touch ? 14 : 32 },
          {
            opacity: 1, x: 0, duration: 0.75, ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // ── 5. BUNDLE OFFERS SECTION: 3D CARD FAN-OUT DECK ─────────────────────
      const bundleCards = document.querySelectorAll("#packs .bundle-card");
      if (bundleCards.length >= 2 && !touch) {
        ScrollTrigger.create({
          trigger: "#packs",
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(bundleCards[0],
              { opacity: 0, x: -40, rotationZ: -4, scale: 0.96 },
              { opacity: 1, x: 0, rotationZ: -1.5, scale: 1, duration: 0.85, ease: "power3.out" }
            );
            if (bundleCards[1]) {
              gsap.fromTo(bundleCards[1],
                { opacity: 0, y: 40, scale: 0.94 },
                { opacity: 1, y: -6, scale: 1.02, duration: 0.85, delay: 0.08, ease: "back.out(1.4)" }
              );
            }
            if (bundleCards[2]) {
              gsap.fromTo(bundleCards[2],
                { opacity: 0, x: 40, rotationZ: 4, scale: 0.96 },
                { opacity: 1, x: 0, rotationZ: 1.5, scale: 1, duration: 0.85, delay: 0.16, ease: "power3.out" }
              );
            }
          },
          onLeaveBack: () => {
            gsap.to(bundleCards, { opacity: 0, y: 24, duration: 0.4, stagger: 0.04, ease: "power2.in" });
          },
          onEnterBack: () => {
            gsap.to(bundleCards, { opacity: 1, y: 0, duration: 0.65, stagger: 0.06, ease: "power3.out" });
          }
        });
      }

      // ── 6. CATALOG: 3D CARD PERSPECTIVE LIFT ───────────────────────────────
      const catalogCards = document.querySelectorAll("#produits .product-card");
      if (catalogCards.length) {
        ScrollTrigger.batch(catalogCards, {
          start: "top 90%",
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { opacity: 0, y: touch ? 20 : 45, rotateX: touch ? 0 : 8, transformPerspective: 1000 },
              { opacity: 1, y: 0, rotateX: 0, duration: 0.72, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
            );
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, { opacity: 0, y: touch ? 18 : 36, duration: 0.35, stagger: 0.03, ease: "power2.in", overwrite: "auto" });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", overwrite: "auto" });
          }
        });
      }

      // ── 7. VERIFIED REVIEWS: STAGGERED STAR SPARKLE & WAVE ─────────────────
      const reviewCards = document.querySelectorAll("#avis .review-card");
      if (reviewCards.length) {
        ScrollTrigger.batch(reviewCards, {
          start: "top 90%",
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { opacity: 0, y: touch ? 18 : 38, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
            );
            batch.forEach((card) => {
              const stars = card.querySelectorAll("svg");
              if (stars.length) {
                gsap.fromTo(stars,
                  { scale: 0, opacity: 0 },
                  { scale: 1, opacity: 1, duration: 0.35, stagger: 0.04, ease: "back.out(2)", delay: 0.15 }
                );
              }
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, { opacity: 0, y: 24, duration: 0.35, stagger: 0.03, ease: "power2.in", overwrite: "auto" });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", overwrite: "auto" });
          }
        });
      }

      // ── 8. SCIENTIFIC CHARTER: ICON SCALE POP ──────────────────────────────
      const charterBoxes = document.querySelectorAll("#charte .feature-box");
      if (charterBoxes.length) {
        ScrollTrigger.batch(charterBoxes, {
          start: "top 90%",
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { opacity: 0, y: touch ? 18 : 38 },
              { opacity: 1, y: 0, duration: 0.68, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
            );
            batch.forEach((box) => {
              const icon = box.querySelector("svg");
              if (icon) {
                gsap.fromTo(icon,
                  { scale: 0.4, rotate: -10 },
                  { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)", delay: 0.12 }
                );
              }
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, { opacity: 0, y: 24, duration: 0.35, stagger: 0.03, ease: "power2.in", overwrite: "auto" });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", overwrite: "auto" });
          }
        });
      }

      // ── 9. PHARMACIES NETWORK: RADAR SONAR PULSE ───────────────────────────
      const pharmaCards = document.querySelectorAll("#pharmacies .pharmacy-card");
      if (pharmaCards.length) {
        ScrollTrigger.batch(pharmaCards, {
          start: "top 90%",
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { opacity: 0, y: touch ? 18 : 36, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.68, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
            );
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, { opacity: 0, y: 20, duration: 0.35, stagger: 0.03, ease: "power2.in", overwrite: "auto" });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", overwrite: "auto" });
          }
        });
      }

      // ── 10. SECTION TAGS (Clean pop on enter) ──────────────────────────────
      document.querySelectorAll(".section-tag").forEach((tag) => {
        gsap.fromTo(tag,
          { scale: 0.85, opacity: 0.4 },
          {
            scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.8)",
            scrollTrigger: {
              trigger: tag,
              start: "top 92%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // ── 11. ROLLING CIRCULAR SEAL (Ambient Roll + Scroll Scrub) ────────────
      const rotatingBadge = document.querySelector(".rotating-text-svg");
      const badgeWrap = document.querySelector(".gsap-rotating-badge");
      if (rotatingBadge) {
        gsap.to(rotatingBadge, {
          rotation: "+=360",
          duration: 22,
          ease: "none",
          repeat: -1,
        });

        gsap.to(rotatingBadge, {
          rotation: "+=720",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        if (badgeWrap) {
          gsap.to(badgeWrap, {
            y: -24,
            rotation: -8,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          });
        }
      }

      // ── 12. HERO PRODUCT 3D PARALLAX TUBE ──────────────────────────────────
      const heroTube = document.querySelector(".hero-tube-parallax");
      if (heroTube) {
        gsap.to(heroTube, {
          yPercent: -14,
          rotationZ: -4,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        if (!touch) {
          const onMove = (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 28;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 28;
            gsap.to(heroTube, { x: xPos, y: yPos, rotationY: xPos * 0.7, rotationX: -yPos * 0.7, duration: 1.1, ease: "power2.out" });
          };
          window.addEventListener("mousemove", onMove);
          cleanups.push(() => window.removeEventListener("mousemove", onMove));
        }
      }

      // ── 13. MAGNETIC BUTTONS (Desktop only + Clean Detach) ──────────────────
      if (!touch) {
        document.querySelectorAll(".magnetic-btn, .btn-aqua, .btn-primary").forEach((btn) => {
          const onMove = (e) => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) * 0.35;
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
            gsap.to(btn, { x: dx, y: dy, rotation: dx * 0.04, scale: 1.04, duration: 0.32, ease: "power2.out" });
          };
          const onLeave = () => gsap.to(btn, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.65, ease: "elastic.out(1, 0.42)" });
          btn.addEventListener("mousemove", onMove);
          btn.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            btn.removeEventListener("mousemove", onMove);
            btn.removeEventListener("mouseleave", onLeave);
          });
        });
      }

      // ── 14. 3D CARD TILT (Desktop only + Clean Detach) ──────────────────────
      if (!touch) {
        document.querySelectorAll(".product-card, .bundle-card").forEach((card) => {
          card.style.willChange = "transform";
          card.style.transformStyle = "preserve-3d";
          const onMove = (e) => {
            const r = card.getBoundingClientRect();
            const rotY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7;
            const rotX = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 5;
            gsap.to(card, { rotateX: rotX, rotateY: rotY, transformPerspective: 900, duration: 0.38, ease: "power2.out" });
          };
          const onLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" });
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
          });
        });
      }

      // ── 15. CURSOR FOLLOWER (Desktop Fine Pointer Only + Clean Detach) ──────
      const cursor = document.querySelector(".anjucia-cursor");
      const cursorDot = document.querySelector(".anjucia-cursor-dot");
      if (cursor && cursorDot && !touch && window.matchMedia("(pointer: fine)").matches) {
        gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50 });
        const onMove = (e) => {
          gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.06, ease: "none" });
          gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.48, ease: "power2.out" });
        };
        window.addEventListener("mousemove", onMove);
        cleanups.push(() => window.removeEventListener("mousemove", onMove));

        const interactiveEls = document.querySelectorAll("button, a, .product-card, .bundle-card, input, select");
        const onEnter = () => gsap.to(cursor, { scale: 2.4, opacity: 0.55, duration: 0.28 });
        const onLeave = () => gsap.to(cursor, { scale: 1, opacity: 0.85, duration: 0.32 });
        interactiveEls.forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          });
        });
      }

      // ── 16. CONFETTI ON ADD-TO-CART ─────────────────────────────────────────
      const onCartAdd = (e) => spawnConfetti(e.detail?.x ?? window.innerWidth / 2, e.detail?.y ?? window.innerHeight * 0.55);
      window.addEventListener("anjucia:addtocart", onCartAdd);
      cleanups.push(() => window.removeEventListener("anjucia:addtocart", onCartAdd));

      setTimeout(() => ScrollTrigger.refresh(), 350);
    });

    return () => {
      cleanups.forEach((fn) => {
        try { if (typeof fn === "function") fn(); } catch (e) { /* no-op */ }
      });
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
