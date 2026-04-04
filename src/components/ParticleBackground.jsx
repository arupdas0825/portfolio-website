/**
 * ParticleBackground.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas-based deep-space starfield with three depth layers:
 *   1. Far stars  — tiny, slow, faint
 *   2. Mid stars  — medium, slight parallax
 *   3. Near dust  — larger, subtle glow, slight mouse parallax
 *
 * Performance: single canvas, no DOM per particle, RAF-optimised.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, memo } from 'react';

/** @param {{ mouseNX: number, mouseNY: number }} props */
function ParticleBackground({ mouseNX = 0, mouseNY = 0 }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({
    stars:  [],
    rafId:  null,
    W: 0, H: 0,
    dpr: 1,
    mouseNX: 0,
    mouseNY: 0,
    time: 0,
  });

  // Keep mouse values in a ref so the RAF loop reads them without re-renders
  useEffect(() => {
    stateRef.current.mouseNX = mouseNX;
    stateRef.current.mouseNY = mouseNY;
  }, [mouseNX, mouseNY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    /* ── Resize handler ───────────────────────────────────────────────────── */
    const resize = () => {
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.W   = window.innerWidth;
      s.H   = window.innerHeight;
      canvas.width  = s.W * s.dpr;
      canvas.height = s.H * s.dpr;
      canvas.style.width  = s.W + 'px';
      canvas.style.height = s.H + 'px';
      ctx.scale(s.dpr, s.dpr);
      spawnStars();
    };

    /* ── Star factory ─────────────────────────────────────────────────────── */
    const isMobile = () => s.W < 768;

    const spawnStars = () => {
      const count = isMobile() ? 120 : 220;
      s.stars = Array.from({ length: count }, (_, i) => {
        const layer = i < count * 0.55 ? 0   // far
                    : i < count * 0.85 ? 1   // mid
                    : 2;                     // near
        return {
          x:      Math.random() * s.W,
          y:      Math.random() * s.H,
          r:      layer === 0 ? 0.4 + Math.random() * 0.6
                : layer === 1 ? 0.7 + Math.random() * 1.0
                :               1.2 + Math.random() * 1.8,
          alpha:  0.1 + Math.random() * 0.75,
          twinkle: 0.008 + Math.random() * 0.018,
          twDir:  Math.random() < 0.5 ? 1 : -1,
          // parallax multiplier — far stars barely move
          px:     layer === 0 ? 2 : layer === 1 ? 8 : 18,
          py:     layer === 0 ? 2 : layer === 1 ? 8 : 18,
          // original centre position
          ox:     Math.random() * s.W,
          oy:     Math.random() * s.H,
          layer,
        };
      });
    };

    /* ── Draw loop ────────────────────────────────────────────────────────── */
    const draw = () => {
      s.time += 1;
      const { W, H, stars, mouseNX, mouseNY } = s;

      // Gradient background — deep space
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   '#04020e');
      bg.addColorStop(0.4, '#080414');
      bg.addColorStop(1,   '#030210');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebula glow patches
      const drawNebula = (nx, ny, r, col, alpha) => {
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        g.addColorStop(0,   col);
        g.addColorStop(1,   'transparent');
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawNebula(W * 0.15, H * 0.25, Math.min(W, H) * 0.35, 'rgba(88,28,220,0.25)', 0.5);
      drawNebula(W * 0.82, H * 0.7,  Math.min(W, H) * 0.28, 'rgba(6,90,180,0.22)',  0.4);
      drawNebula(W * 0.5,  H * 0.5,  Math.min(W, H) * 0.22, 'rgba(120,40,180,0.12)',0.3);

      // Stars
      for (const star of stars) {
        // Twinkle
        star.alpha += star.twinkle * star.twDir;
        if (star.alpha > 0.95) { star.alpha = 0.95; star.twDir = -1; }
        if (star.alpha < 0.05) { star.alpha = 0.05; star.twDir =  1; }

        // Parallax offset
        const sx = star.ox + mouseNX * star.px;
        const sy = star.oy + mouseNY * star.py;

        ctx.save();

        // Near stars get a soft glow
        if (star.layer === 2) {
          ctx.shadowColor = 'rgba(180,160,255,0.8)';
          ctx.shadowBlur  = star.r * 3;
        }

        ctx.beginPath();
        ctx.arc(
          ((sx % W) + W) % W,   // wrap around screen edges
          ((sy % H) + H) % H,
          star.r, 0, Math.PI * 2
        );
        const brightness = star.layer === 2 ? 200 : star.layer === 1 ? 185 : 165;
        ctx.fillStyle = `rgba(${brightness},175,255,${star.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      s.rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:  'fixed',
        inset:     0,
        zIndex:    0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default memo(ParticleBackground);
