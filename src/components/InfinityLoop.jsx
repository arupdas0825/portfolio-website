/**
 * InfinityLoop.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas-based infinity loop (Lemniscate of Bernoulli) featuring:
 *   - Multi-layer neon glow: deep outer → mid → bright core
 *   - Gradient colour: blue → cyan → violet → white (rotates with energy)
 *   - Energy particles flowing along the arc-length-parameterized path
 *   - Particles have individual hue drift, trailing glow, and size pulsation
 *   - Center intersection jewel with radial gradient burst
 *   - Subtle pulsation of the entire path (breathing effect)
 *   - GPU-friendly: single canvas, no layout thrashing
 *   - MOBILE FIX: 60 particles on mobile (vs 220), DPR cap 1.5 (vs 2),
 *     3 curve passes on mobile (vs 5) to prevent GPU OOM → black screen
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, memo } from 'react';
import { buildLemniscateTable, posAtArcLength, lemniscate } from '../utils/mathHelpers';

/**
 * IS_TOUCH — safe mobile detection (same pattern used everywhere in the project)
 * Computed once at module level; never changes at runtime.
 */
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

/** Number of energy particles — 60 on mobile, 220 on desktop */
const PARTICLE_COUNT = IS_TOUCH ? 60 : 220;

/**
 * @param {{ size: number, isMobile?: boolean }} props
 *   size     — canvas pixel dimensions (passed from InfinityVortex)
 *   isMobile — optional override; defaults to IS_TOUCH
 */
function InfinityLoop({ size = 440, isMobile }) {
  const canvasRef = useRef(null);

  // Resolve mobile flag (prop takes precedence over module-level detection)
  const onMobile = isMobile !== undefined ? isMobile : IS_TOUCH;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // MOBILE FIX: cap DPR at 1.5 on mobile (was 2 — caused GPU OOM)
    const dpr = onMobile
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : Math.min(window.devicePixelRatio || 1, 2);

    // Resize inside rAF to avoid synchronous layout thrashing
    requestAnimationFrame(() => {
      canvas.width  = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width  = size + 'px';
      canvas.style.height = size + 'px';
    });

    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ── Infinity curve scale ────────────────────────────────────────────────
    const A = size * 0.36;
    const cx = size / 2;
    const cy = size / 2;

    // Pre-build arc-length table for uniform-speed particles
    const tableSteps = onMobile ? 400 : 800;
    const table = buildLemniscateTable(A, tableSteps);

    // ── Particle system ─────────────────────────────────────────────────────
    const particleCount = onMobile ? 60 : PARTICLE_COUNT;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      u:      i / particleCount,
      speed:  0.00045 + Math.random() * 0.0004,
      size:   1.0   + Math.random() * 2.2,
      bright: 0.5   + Math.random() * 0.5,
      hue:    190   + Math.random() * 120,
      hueSpeed: (Math.random() - 0.5) * 0.3,
      trail:  [],
      trailLen: onMobile ? 3 : 5 + Math.floor(Math.random() * 7),
    }));

    // ── Draw the smooth infinity curve with N gradient passes ───────────────
    const drawCurve = (lineW, alpha, blurAmt, colorStops) => {
      ctx.save();
      ctx.translate(cx, cy);

      ctx.beginPath();
      const STEPS = onMobile ? 250 : 500;
      for (let i = 0; i <= STEPS; i++) {
        const t = (i / STEPS) * Math.PI * 2;
        const p = lemniscate(t, A);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(-A, 0, A, 0);
      colorStops.forEach(([stop, col]) => grad.addColorStop(stop, col));

      ctx.strokeStyle = grad;
      ctx.lineWidth   = lineW;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(160,100,255,0.9)';
      ctx.shadowBlur  = blurAmt;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();
    };

    // ── Center glow burst ───────────────────────────────────────────────────
    const drawCenter = (pulse) => {
      const r = A * (0.10 + pulse * 0.04);

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.8);
      halo.addColorStop(0,   'rgba(220,160,255,0.25)');
      halo.addColorStop(0.5, 'rgba(140,80,255,0.10)');
      halo.addColorStop(1,   'transparent');
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.restore();

      const jewel = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      jewel.addColorStop(0,   'rgba(255,255,255,1)');
      jewel.addColorStop(0.3, 'rgba(210,170,255,0.9)');
      jewel.addColorStop(0.7, 'rgba(100,80,255,0.6)');
      jewel.addColorStop(1,   'rgba(60,30,180,0)');
      ctx.save();
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur  = onMobile ? 16 : 30;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = jewel;
      ctx.fill();
      ctx.restore();
    };

    let frame = 0;
    let rafId;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      const pulse = Math.sin(frame * 0.018) * 0.5 + 0.5;

      if (onMobile) {
        // ── MOBILE: 3 curve passes (saves ~40% GPU) ──────────────────────
        drawCurve(20, 0.045 + pulse * 0.015, 20, [
          [0,   'rgba(88,40,220,0.85)'],
          [0.5, 'rgba(255,240,255,0.6)'],
          [1,   'rgba(0,190,220,0.85)'],
        ]);
        drawCurve(9, 0.18 + pulse * 0.06, 10, [
          [0,    'rgba(120,60,255,1)'],
          [0.5,  'rgba(255,255,255,1)'],
          [1,    'rgba(0,160,220,1)'],
        ]);
        drawCurve(2.5, 0.88 + pulse * 0.12, 5, [
          [0,   'rgba(180,130,255,1)'],
          [0.5, 'rgba(255,255,255,1)'],
          [1,   'rgba(100,230,255,1)'],
        ]);
      } else {
        // ── DESKTOP: full 5 curve passes ─────────────────────────────────
        drawCurve(36, 0.018 + pulse * 0.008, 60, [
          [0,   'rgba(50,20,180,0.7)'],
          [0.5, 'rgba(255,255,255,0.4)'],
          [1,   'rgba(0,180,220,0.7)'],
        ]);
        drawCurve(20, 0.045 + pulse * 0.015, 35, [
          [0,   'rgba(88,40,220,0.85)'],
          [0.4, 'rgba(180,110,255,0.9)'],
          [0.5, 'rgba(255,240,255,0.6)'],
          [0.6, 'rgba(100,220,255,0.9)'],
          [1,   'rgba(0,190,220,0.85)'],
        ]);
        drawCurve(9, 0.18 + pulse * 0.06, 18, [
          [0,    'rgba(120,60,255,1)'],
          [0.35, 'rgba(180,100,255,1)'],
          [0.5,  'rgba(255,255,255,1)'],
          [0.65, 'rgba(0,220,255,1)'],
          [1,    'rgba(0,160,220,1)'],
        ]);
        drawCurve(3.5, 0.88 + pulse * 0.12, 8, [
          [0,    'rgba(180,130,255,1)'],
          [0.25, 'rgba(220,200,255,1)'],
          [0.5,  'rgba(255,255,255,1)'],
          [0.75, 'rgba(180,240,255,1)'],
          [1,    'rgba(100,230,255,1)'],
        ]);
        drawCurve(1.0, 1.0, 4, [
          [0,   'rgba(255,255,255,0.9)'],
          [0.5, 'rgba(255,255,255,1)'],
          [1,   'rgba(220,255,255,0.9)'],
        ]);
      }

      drawCenter(pulse);

      // ── Energy particles ────────────────────────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);

      for (const p of particles) {
        p.u     = (p.u + p.speed) % 1;
        p.hue  += p.hueSpeed;
        const pos = posAtArcLength(table, p.u);

        p.trail.push({ x: pos.x, y: pos.y });
        if (p.trail.length > p.trailLen) p.trail.shift();

        for (let i = 0; i < p.trail.length; i++) {
          const tf  = i / p.trail.length;
          const tr  = p.trail[i];
          const ta  = tf * p.bright * 0.55;
          const tr2 = p.size * tf * 0.8;
          if (tr2 < 0.1) continue;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, tr2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},90%,75%,${ta})`;
          ctx.fill();
        }

        const sz  = p.size * (0.85 + Math.sin(frame * 0.06 + p.u * 10) * 0.15);

        if (!onMobile) {
          // Desktop: full glow gradient
          const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, sz * 2.8);
          glow.addColorStop(0,   `hsla(${p.hue},100%,90%,${p.bright * 0.7})`);
          glow.addColorStop(1,   'transparent');
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, sz * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sz * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,96%,${p.bright})`;
        ctx.shadowColor = `hsl(${p.hue},100%,75%)`;
        ctx.shadowBlur  = onMobile ? 4 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      frame++;
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, onMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        pointerEvents: 'none',
        transform: 'translateZ(0)', // paint layer — prevents blank on mobile Safari
      }}
      aria-hidden="true"
    />
  );
}

export default memo(InfinityLoop);
