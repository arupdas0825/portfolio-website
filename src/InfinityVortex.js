/**
 * InfinityVortex.js  ←  Master orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Combines:
 *   - InfinityLoop (canvas neon lemniscate + energy particles)
 *   - OrbitingLogos (12 circular-orbit tech badges)
 *   - Mouse tracking for 3-D tilt, magnetic pull, and parallax
 *
 * Used inside Home.js hero section, placed inside .blackhole-wrap
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import InfinityLoop   from './components/InfinityLoop';
import OrbitingLogos  from './components/OrbitingLogos';

/* ── CSS keyframe injected once ─────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes fadeUpIn {
  from { opacity: 0; transform: translateX(-50%) translateY(6px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes vortexPulseRing {
  0%,100% { opacity: 0.10; transform: translate(-50%,-50%) scale(1); }
  50%      { opacity: 0.22; transform: translate(-50%,-50%) scale(1.06); }
}
`;

let KEYFRAMES_INJECTED = false;
function injectKeyframes() {
  if (KEYFRAMES_INJECTED) return;
  const style     = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  KEYFRAMES_INJECTED = true;
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function InfinityVortex() {
  const wrapRef     = useRef(null);
  const [size, setSize]       = useState(480);
  const [isMobile, setMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  /* ── Inject keyframes ───────────────────────────────────────────────── */
  useEffect(() => injectKeyframes(), []);

  /* ── ResizeObserver — responsive sizing ─────────────────────────────── */
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;
      const s = Math.min(w, h, 520);
      setSize(Math.max(s, 220));
      setMobile(w < 360);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── Mouse tracking (relative to wrapper) ───────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: null, y: null });
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width:    '100%',
        height:   size,
        userSelect: 'none',
        // Ensure overflow visible so logos at edges aren't clipped
        overflow: 'visible',
      }}
    >
      {/* ── Ambient outer glow halo (behind everything) ──────────────── */}
      <div style={{
        position:      'absolute',
        top:           '50%',
        left:          '50%',
        width:          size * 0.9,
        height:         size * 0.9,
        transform:     'translate(-50%, -50%)',
        borderRadius:  '50%',
        background:    'radial-gradient(ellipse, rgba(100,60,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex:         0,
      }}/>

      {/* Pulsating ring around the infinity */}
      <div style={{
        position:      'absolute',
        top:           '50%',
        left:          '50%',
        width:          size * 0.62,
        height:         size * 0.38,
        borderRadius:  '50%',
        border:        '1px solid rgba(140,80,255,0.18)',
        animation:     'vortexPulseRing 3.8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex:         1,
      }}/>

      {/* ── Canvas: neon infinity path + particles ───────────────────── */}
      <div style={{
        position:      'absolute',
        top:           '50%',
        left:          '50%',
        transform:     'translate(-50%, -50%)',
        zIndex:         2,
        pointerEvents: 'none',
      }}>
        <InfinityLoop size={size} />
      </div>

      {/* ── Orbiting logo badges ─────────────────────────────────────── */}
      <div style={{
        position:      'absolute',
        inset:          0,
        zIndex:         3,
        // No overflow here — logos are positioned relative to this div
      }}>
        <OrbitingLogos
          containerW={size}
          containerH={size}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}