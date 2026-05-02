/**
 * InfinityVortex.js — FIXED for mobile
 * Changes: safe initial size, ResizeObserver fix, touch-friendly
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import InfinityLoop  from './components/InfinityLoop';
import OrbitingLogos from './components/OrbitingLogos';

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
  const style = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  KEYFRAMES_INJECTED = true;
}

// Safe initial size — use window width on mobile to avoid oversized canvas
function getInitialSize() {
  if (typeof window === 'undefined') return 400;
  const w = window.innerWidth;
  if (w < 480) return Math.min(w * 0.85, 320);
  if (w < 768) return Math.min(w * 0.80, 420);
  return 480;
}

export default function InfinityVortex() {
  const wrapRef   = useRef(null);
  const [size, setSize]       = useState(getInitialSize);
  const [isMobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 480);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  useEffect(() => injectKeyframes(), []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      const w = rect.width;
      const h = rect.height;
      if (w === 0) return; // skip zero-width during init
      const s = Math.min(w, h > 0 ? h : w, 520);
      setSize(Math.max(s, 200));
      setMobile(w < 480);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = useCallback(e => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: null, y: null });
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position:   'relative',
        width:      '100%',
        height:     size,
        userSelect: 'none',
        overflow:   'visible',
        // Force a paint layer — prevents blank on mobile Safari
        transform:  'translateZ(0)',
        willChange: 'contents',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position:    'absolute',
        top: '50%', left: '50%',
        width:  size * 0.9,
        height: size * 0.9,
        transform:   'translate(-50%, -50%)',
        borderRadius: '50%',
        background:  'radial-gradient(ellipse, rgba(100,60,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}/>

      {/* Pulsating ring */}
      <div style={{
        position:    'absolute',
        top: '50%', left: '50%',
        width:  size * 0.62,
        height: size * 0.38,
        borderRadius: '50%',
        border: '1px solid rgba(140,80,255,0.18)',
        animation:   'vortexPulseRing 3.8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }}/>

      {/* Canvas: neon infinity */}
      <div style={{
        position:  'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <InfinityLoop size={size} isMobile={isMobile} />
      </div>

      {/* Orbiting logos */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
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