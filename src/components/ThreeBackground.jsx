/**
 * ThreeBackground.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Three.js rotating starfield — fixed behind all content on desktop.
 * Disabled on touch devices (mobile/tablet) to protect GPU resources.
 * Uses powerPreference:'low-power' and DPR cap [1, 1.5] per perf rules.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Safe IS_TOUCH check — never runs at SSR, safe at module level for CRA
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

/* ── Rotating star field ─────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef();

  // 3000 stars scattered in a 20-unit cube — generated once
  const [sphere] = useState(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    return positions;
  });

  // Gentle rotation — delta-based so it's frame-rate independent
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function ThreeBackground() {
  // Strictly disable on all touch/mobile devices — use CSS blobs instead
  if (IS_TOUCH) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        transform: 'translateZ(0)', // own paint layer
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: false,
          powerPreference: 'low-power',
          alpha: true,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <StarField />
      </Canvas>
    </div>
  );
}
