"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, Trophy, Sparkles, Volume2, VolumeX, Shield, Heart, Zap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";

const GOOD_ITEMS = [
  { name: "Niacinamide 3%", type: "good", color: "#719FB7", score: 20, icon: "💧", label: "Niacinamide" },
  { name: "Panthénol B5", type: "good", color: "#8AB2C7", score: 15, icon: "✨", label: "Panthénol B5" },
  { name: "Centella Asiatica", type: "good", color: "#9BB0A0", score: 25, icon: "🌿", label: "Centella" },
  { name: "Squalane Pur", type: "good", color: "#D0E1E9", score: 30, icon: "🛡️", label: "Squalane" }
];

const BAD_ITEMS = [
  { name: "Rayons UV Intenses", type: "bad", color: "#E06D6D", damage: 20, icon: "☀️", label: "UV" },
  { name: "Sirocco & Poussière", type: "bad", color: "#D9A066", damage: 15, icon: "🌪️", label: "Sirocco" },
  { name: "Chaleur 45°C", type: "bad", color: "#E74C3C", damage: 25, icon: "🔥", label: "Canicule" }
];

export default function DropletGame({ compact = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const { showToast } = useCart();

  const [gameState, setGameState] = useState("start"); // "start" | "playing" | "gameover"
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [unlockedReward, setUnlockedReward] = useState(false);

  // Mutable game loop references
  const gameRef = useRef({
    running: false,
    score: 0,
    health: 100,
    combo: 0,
    playerX: 200,
    targetX: 200,
    playerY: 340,
    playerRadius: 28,
    items: [],
    particles: [],
    lastSpawn: 0,
    spawnInterval: 900,
    speedMultiplier: 1,
    eyeLookX: 0
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anjucia_game_high");
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch (_) {}
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameRef.current = {
      running: true,
      score: 0,
      health: 100,
      combo: 0,
      playerX: canvas.width / (2 * (window.devicePixelRatio || 1)),
      targetX: canvas.width / (2 * (window.devicePixelRatio || 1)),
      playerY: canvas.height / (window.devicePixelRatio || 1) - 60,
      playerRadius: 26,
      items: [],
      particles: [],
      lastSpawn: performance.now(),
      spawnInterval: 950,
      speedMultiplier: 1,
      eyeLookX: 0
    };

    setScore(0);
    setHealth(100);
    setCombo(0);
    setGameState("playing");
  };

  // Touch & pointer movement
  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    gameRef.current.targetX = Math.max(30, Math.min(rect.width - 30, x));
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = (compact ? 380 : 480) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${compact ? 380 : 480}px`;
      ctx.scale(dpr, dpr);
      gameRef.current.playerY = (compact ? 380 : 480) - 55;
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      animationId = requestAnimationFrame(loop);
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      const logicalW = canvas.width / dpr;
      const logicalH = canvas.height / dpr;

      // Clear with dark clinical background
      ctx.fillStyle = "#11171A";
      ctx.fillRect(0, 0, logicalW, logicalH);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(113, 159, 183, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < logicalW; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, logicalH);
        ctx.stroke();
      }

      if (!gameRef.current.running) return;

      const game = gameRef.current;

      // Smooth player movement lerp
      const dx = game.targetX - game.playerX;
      game.playerX += dx * 0.18;
      game.eyeLookX = Math.max(-4, Math.min(4, dx * 0.15));

      // Spawning falling items
      if (currentTime - game.lastSpawn > game.spawnInterval) {
        game.lastSpawn = currentTime;
        game.spawnInterval = Math.max(500, 950 - game.score * 0.5);
        game.speedMultiplier = 1 + Math.min(1.8, game.score * 0.002);

        const isGood = Math.random() > 0.35;
        const pool = isGood ? GOOD_ITEMS : BAD_ITEMS;
        const template = pool[Math.floor(Math.random() * pool.length)];

        game.items.push({
          ...template,
          x: 25 + Math.random() * (logicalW - 50),
          y: -20,
          speed: (2.4 + Math.random() * 1.6) * game.speedMultiplier,
          radius: 18,
          rotation: Math.random() * Math.PI
        });
      }

      // Update and render falling items
      for (let i = game.items.length - 1; i >= 0; i--) {
        const item = game.items[i];
        item.y += item.speed;
        item.rotation += 0.03;

        // Collision detection with player droplet
        const dist = Math.hypot(item.x - game.playerX, item.y - game.playerY);
        if (dist < game.playerRadius + item.radius) {
          if (item.type === "good") {
            game.score += item.score * (1 + Math.floor(game.combo / 5) * 0.5);
            game.combo += 1;
            game.health = Math.min(100, game.health + 4);
            try { navigator.vibrate?.(10); } catch (_) {}

            // Burst particles
            for (let p = 0; p < 8; p++) {
              game.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: item.color,
                life: 1
              });
            }
          } else {
            game.health = Math.max(0, game.health - item.damage);
            game.combo = 0;
            try { navigator.vibrate?.(35); } catch (_) {}

            for (let p = 0; p < 12; p++) {
              game.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: "#E06D6D",
                life: 1
              });
            }

            if (game.health <= 0) {
              game.running = false;
              setGameState("gameover");
              setScore(Math.floor(game.score));
              try {
                if (game.score > highScore) {
                  setHighScore(Math.floor(game.score));
                  localStorage.setItem("anjucia_game_high", Math.floor(game.score).toString());
                }
              } catch (_) {}
              if (game.score >= 350) setUnlockedReward(true);
            }
          }

          game.items.splice(i, 1);
          setScore(Math.floor(game.score));
          setHealth(Math.round(game.health));
          setCombo(game.combo);
          continue;
        }

        // Out of bounds
        if (item.y > logicalH + 30) {
          if (item.type === "good") {
            game.combo = 0;
            setCombo(0);
          }
          game.items.splice(i, 1);
          continue;
        }

        // Draw item bubble
        ctx.save();
        ctx.translate(item.x, item.y);

        // Glow ring
        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.type === "good" ? "rgba(113, 159, 183, 0.22)" : "rgba(224, 109, 109, 0.2)";
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon text
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, 0, 1);
        ctx.restore();
      }

      // Draw particle bursts
      for (let p = game.particles.length - 1; p >= 0; p--) {
        const pt = game.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.045;
        if (pt.life <= 0) {
          game.particles.splice(p, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3 * pt.life, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ── DRAW ANJUCIA DROPLET HERO PLAYER ───────────────────
      ctx.save();
      ctx.translate(game.playerX, game.playerY);

      // Droplet glow
      ctx.beginPath();
      ctx.arc(0, 5, game.playerRadius + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(113, 159, 183, 0.25)";
      ctx.fill();

      // Droplet body path scaled
      const s = 0.55;
      ctx.save();
      ctx.scale(s, s);
      ctx.translate(-50, -65);

      ctx.beginPath();
      // SVG path approximation in canvas
      ctx.moveTo(50, 5);
      ctx.bezierCurveTo(40, 25, 12, 60, 12, 85);
      ctx.bezierCurveTo(12, 110, 28, 125, 50, 125);
      ctx.bezierCurveTo(72, 125, 88, 110, 88, 85);
      ctx.bezierCurveTo(88, 60, 60, 25, 50, 5);
      ctx.closePath();

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 100, 128);
      grad.addColorStop(0, "#8AB2C7");
      grad.addColorStop(1, "#436D88");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Swirl cutout accent
      ctx.beginPath();
      ctx.arc(42, 88, 14, 0, Math.PI);
      ctx.strokeStyle = "rgba(17, 23, 26, 0.65)";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();

      // ── CUTE INTERACTIVE EYES ─────────────────────────────
      const eyeY = 2;
      const eyeSpacing = 9;

      // Left Eye
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.arc(eyeSpacing, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupils (track movement direction)
      ctx.fillStyle = "#11171A";
      ctx.beginPath();
      ctx.arc(-eyeSpacing + game.eyeLookX, eyeY, 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eyeSpacing + game.eyeLookX, eyeY, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(-eyeSpacing + game.eyeLookX - 1, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.arc(eyeSpacing + game.eyeLookX - 1, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();

      // Smile mouth
      ctx.beginPath();
      ctx.arc(0, eyeY + 9, 4, 0, Math.PI);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();
    };

    animationId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [compact, highScore]);

  return (
    <div
      ref={containerRef}
      className="droplet-game-container"
      style={{
        position: "relative",
        background: "var(--bg-card)",
        border: "2px solid var(--accent-aqua)",
        borderRadius: "var(--card-radius, 22px)",
        boxShadow: "var(--shadow-md), var(--shadow-glow)",
        overflow: "hidden",
        userSelect: "none"
      }}
    >
      {/* Top HUD Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1.2rem",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          fontSize: "0.82rem",
          fontWeight: 800
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-primary)" }}>
            <Sparkles size={16} color="var(--accent-aqua)" />
            <span>Score: <strong style={{ color: "var(--accent-aqua)", fontSize: "1.05rem" }}>{score}</strong></span>
          </div>
          {combo > 1 && (
            <span
              style={{
                fontSize: "0.72rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "9999px",
                background: "var(--accent-aqua-subtle)",
                color: "var(--accent-aqua)",
                border: "1px solid var(--border-light)"
              }}
            >
              Combo ×{combo} 🔥
            </span>
          )}
        </div>

        {/* Health / Hydration bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Hydratation:</span>
          <div
            style={{
              width: "80px",
              height: "10px",
              background: "var(--bg-primary)",
              borderRadius: "9999px",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <div
              style={{
                width: `${health}%`,
                height: "100%",
                background: health > 30 ? "linear-gradient(90deg, #719FB7, #9BB0A0)" : "var(--danger)",
                transition: "width 0.2s ease"
              }}
            />
          </div>
          <span style={{ fontSize: "0.72rem", color: health > 30 ? "var(--success)" : "var(--danger)" }}>
            {health}%
          </span>
        </div>
      </div>

      {/* Main Touch Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        style={{
          display: "block",
          width: "100%",
          cursor: "ew-resize",
          touchAction: "none"
        }}
      />

      {/* Start Overlay */}
      {gameState === "start" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(17, 23, 26, 0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "var(--accent-aqua-subtle)",
              border: "1.5px solid var(--accent-aqua)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "var(--shadow-glow)"
            }}
          >
            <span style={{ fontSize: "2rem" }}>💧</span>
          </div>

          <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            Goutte Rescue • Anjucia Lab
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "340px", lineHeight: 1.5, marginBottom: "1.4rem" }}>
            {lang === "dz"
              ? "حرّك قطرة أنجوسيا بإصبعك : التقط النياسيناميد والبانتينول وتفادى ضربات الشمس والشهيلي !"
              : "Glissez votre doigt pour attraper la Niacinamide et le Panthénol, et esquivez les UV et la chaleur !"}
          </p>

          <button
            onClick={startGame}
            className="btn-aqua"
            style={{ padding: "0.95rem 2.4rem", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
          >
            <Play size={18} />
            <span>{lang === "dz" ? "ابدأ اللعب الآن" : "Jouer Maintenant"}</span>
          </button>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === "gameover" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(17, 23, 26, 0.94)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center"
          }}
        >
          <Trophy size={48} color="var(--accent-aqua)" style={{ marginBottom: "0.8rem" }} />
          <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
            {lang === "dz" ? "انتهت الجولة !" : "Partie Terminée !"}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
            Score Final : <strong style={{ color: "var(--accent-aqua)", fontSize: "1.3rem" }}>{score}</strong>
            {score >= highScore && score > 0 && <span style={{ color: "var(--success)", display: "block", fontSize: "0.78rem" }}>🏆 Nouveau Record Personnel !</span>}
          </p>

          {unlockedReward && (
            <div
              style={{
                marginBottom: "1.2rem",
                padding: "0.75rem 1.2rem",
                background: "var(--accent-aqua-subtle)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                fontSize: "0.82rem",
                color: "var(--text-primary)"
              }}
            >
              🎉 <strong>Félicitations Expert !</strong> Vous avez atteint plus de 350 pts. Votre peau est parfaitement protégée.
            </div>
          )}

          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={startGame}
              className="btn-aqua"
              style={{ padding: "0.85rem 1.8rem", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <RotateCcw size={16} />
              <span>{lang === "dz" ? "إعادة المحاولة" : "Rejouer"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
