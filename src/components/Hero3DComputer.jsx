/**
 * Hero3DComputer.jsx  v3.0
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXED:
 *   ✅ No clipping — wider FOV (55°) + camera pushed to z=7.5 so all
 *      floating elements are fully inside the frustum
 *   ✅ Live animated coding screen (class AIEngineer typing effect via
 *      CanvasTexture updated every frame — no external font load needed)
 *   ✅ Premium matte-charcoal body (dark #1c1c24, not pure black)
 *   ✅ Balanced 6-icon orbital ring at fixed radius
 *   ✅ 3 code bubbles — wide-spaced, no overlap
 *   ✅ Ultra-smooth lerp tilt (LERP=0.04, max ±10°/8°)
 *   ✅ Single useFrame loop per component — zero RAF abuse
 *   ✅ Mobile: computer only, no icons, no bubbles, DPR capped at 1
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useMemo, useState, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Device detection ────────────────────────────────────────────────────── */
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

/* ── Shared colour constants ─────────────────────────────────────────────── */
const C_BODY   = '#1c1c28';   // Matte charcoal (not pure black)
const C_TRIM   = '#2a2640';   // Slightly lighter inner border
const C_STAND  = '#17172200'; // Transparent trick → replaced by mesh below
const C_PURPLE = '#8a5cf6';
const C_CYAN   = '#22d3ee';

/* ══════════════════════════════════════════════════════════════════════════
   SCREEN TEXTURE — live coding typewriter
   Renders to a 2D canvas that is uploaded as a THREE.CanvasTexture.
   We re-draw it every ~60ms to animate the blinking cursor + new lines.
══════════════════════════════════════════════════════════════════════════ */
const CODE_LINES = [
  { text: 'class AIEngineer {',                       color: '#c084fc' },
  { text: '  constructor() {',                         color: '#a78bfa' },
  { text: '    this.name = "Arup Das";',               color: '#67e8f9' },
  { text: '    this.skills = ["AI","ML","Full Stack"];',color: '#86efac' },
  { text: '  }',                                       color: '#a78bfa' },
  { text: '  build() {',                               color: '#c084fc' },
  { text: '    return "AI-powered precision.";',       color: '#fbbf24' },
  { text: '  }',                                       color: '#a78bfa' },
  { text: '}',                                         color: '#c084fc' },
  { text: '',                                          color: '#fff'    },
  { text: 'const dev = new AIEngineer();',             color: '#67e8f9' },
  { text: 'dev.build(); // ✓ running',                 color: '#4ade80' },
];

function buildScreenCanvas() {
  const W = 512, H = 320;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  return canvas;
}

function drawScreen(canvas, charCount, cursorVisible) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');

  /* Background */
  ctx.fillStyle = '#0d0a1e';
  ctx.fillRect(0, 0, W, H);

  /* Subtle grid pattern */
  ctx.strokeStyle = 'rgba(138,92,246,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  /* Title bar */
  ctx.fillStyle = 'rgba(26,20,50,0.95)';
  ctx.fillRect(0, 0, W, 28);
  ['#ff5f57','#febc2e','#28c840'].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(14 + i * 18, 14, 5, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  ctx.font = '11px monospace';
  ctx.fillStyle = 'rgba(180,160,220,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('main.js — Hero3DComputer', W / 2, 19);
  ctx.textAlign = 'left';

  /* Line numbers + code */
  const lineH  = 22;
  const startY = 50;
  const fontSize = 13;

  ctx.font = `${fontSize}px "Courier New", Courier, monospace`;

  let rendered = 0;
  for (let i = 0; i < CODE_LINES.length; i++) {
    const y = startY + i * lineH;
    if (y > H - 10) break;

    /* Line number */
    ctx.fillStyle = 'rgba(138,92,246,0.35)';
    ctx.fillText(String(i + 1).padStart(2, ' '), 10, y);

    const fullLine = CODE_LINES[i].text;
    let lineToShow = '';

    if (rendered + fullLine.length <= charCount) {
      lineToShow = fullLine;
      rendered += fullLine.length;
    } else {
      const remaining = charCount - rendered;
      lineToShow = fullLine.slice(0, remaining);
      rendered = charCount;

      /* Blinking cursor at end of current line */
      if (cursorVisible) {
        const textW = ctx.measureText(lineToShow).width;
        ctx.fillStyle = C_PURPLE;
        ctx.fillRect(40 + textW, y - fontSize + 2, 2, fontSize + 2);
      }
      i = CODE_LINES.length; // stop after this line
    }

    if (lineToShow.length > 0) {
      ctx.fillStyle = CODE_LINES[i >= CODE_LINES.length ? CODE_LINES.length - 1 : i].color;
      ctx.fillText(lineToShow, 40, y);
    }
  }

  /* Bottom glow line */
  const grad = ctx.createLinearGradient(0, H - 2, W, H - 2);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, C_PURPLE);
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H - 2);
  ctx.lineTo(W, H - 2);
  ctx.stroke();
}

/* ══════════════════════════════════════════════════════════════════════════
   MONITOR COMPONENT
══════════════════════════════════════════════════════════════════════════ */
function Monitor() {
  const screenGlow   = useRef();
  const screenMesh   = useRef();
  const screenCanvas = useMemo(() => buildScreenCanvas(), []);
  const screenTex    = useMemo(() => {
    const t = new THREE.CanvasTexture(screenCanvas);
    t.needsUpdate = true;
    return t;
  }, [screenCanvas]);

  /* Typing state — use refs so they don't cause re-renders */
  const charCount    = useRef(0);
  const totalChars   = CODE_LINES.reduce((s, l) => s + l.text.length, 0);
  const typingTimer  = useRef(0);
  const cursorTimer  = useRef(0);
  const cursorVis    = useRef(true);

  useFrame(({ clock }, delta) => {
    /* Cursor blink */
    cursorTimer.current += delta;
    if (cursorTimer.current > 0.53) {
      cursorVis.current   = !cursorVis.current;
      cursorTimer.current = 0;
    }

    /* Typing advance */
    typingTimer.current += delta;
    const speed = charCount.current >= totalChars ? 999 : 0.045; // pause when done
    if (typingTimer.current >= speed) {
      typingTimer.current = 0;
      if (charCount.current < totalChars) charCount.current++;
      else {
        /* Reset after pause */
        typingTimer.current = -2.5;
        charCount.current   = 0;
      }
    }

    /* Redraw screen texture */
    drawScreen(screenCanvas, charCount.current, cursorVis.current);
    screenTex.needsUpdate = true;

    /* Screen glow pulse */
    if (screenGlow.current) {
      screenGlow.current.intensity = 1.0 + Math.sin(clock.getElapsedTime() * 0.9) * 0.25;
    }
  });

  const bodyMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: C_BODY,  roughness: 0.55, metalness: 0.4 }), []);
  const trimMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: C_TRIM,  roughness: 0.15, metalness: 0.85 }), []);
  const standMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#141420', roughness: 0.5,  metalness: 0.45 }), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Bezel outer ── */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <boxGeometry args={[3.6, 2.25, 0.10]} />
      </mesh>

      {/* ── Bezel inner rim (metallic) ── */}
      <mesh position={[0, 0, 0.052]} material={trimMat}>
        <boxGeometry args={[3.38, 2.08, 0.008]} />
      </mesh>

      {/* ── Live coding screen ── */}
      <mesh ref={screenMesh} position={[0, 0, 0.060]}>
        <boxGeometry args={[3.22, 1.94, 0.004]} />
        <meshStandardMaterial
          map={screenTex}
          roughness={0.05}
          metalness={0.0}
          emissiveMap={screenTex}
          emissiveIntensity={0.55}
          emissive={new THREE.Color('#ffffff')}
        />
      </mesh>

      {/* ── Screen edge soft glow plane ── */}
      <mesh position={[0, 0, 0.058]}>
        <planeGeometry args={[3.26, 1.98]} />
        <meshBasicMaterial
          color='#8a5cf6'
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* ── Power LED ── */}
      <mesh position={[0, -1.07, 0.056]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color='#22c55e' emissive='#22c55e' emissiveIntensity={3} />
      </mesh>

      {/* ── Screen point light ── */}
      <pointLight ref={screenGlow} position={[0, 0, 0.8]} color={C_PURPLE} intensity={1.0} distance={3.5} decay={2} />

      {/* ── Stand neck ── */}
      <mesh position={[0, -1.38, -0.14]} material={standMat}>
        <boxGeometry args={[0.20, 0.58, 0.16]} />
      </mesh>

      {/* ── Stand base (rounded via subdivided box) ── */}
      <mesh position={[0, -1.69, -0.30]} receiveShadow material={standMat}>
        <boxGeometry args={[1.30, 0.07, 0.62]} />
      </mesh>

      {/* ── Keyboard body ── */}
      <mesh position={[0, -1.72, 0.62]} receiveShadow material={bodyMat}>
        <boxGeometry args={[2.7, 0.055, 0.84]} />
      </mesh>

      {/* ── Key rows (merged into 4 thin bars for perf) ── */}
      {[-0.25, -0.07, 0.11, 0.25].map((z, ri) => (
        <mesh key={ri} position={[0, -1.695, 0.65 + z]} material={trimMat}>
          <boxGeometry args={[2.44, 0.035, 0.15]} />
        </mesh>
      ))}

      {/* ── Soft floor shadow plane ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.78, 0.3]} receiveShadow>
        <planeGeometry args={[4.5, 3]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CURSOR TILT RIG
   Ultra-soft lerp — feels like a premium Mac-like parallax
══════════════════════════════════════════════════════════════════════════ */
const _mt = { x: 0, y: 0 };  // target
const _mc = { x: 0, y: 0 };  // current (lerped)

if (typeof window !== 'undefined' && !IS_TOUCH) {
  window.addEventListener('mousemove', (e) => {
    _mt.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    _mt.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

function TiltRig({ children }) {
  const group = useRef();
  useFrame(() => {
    if (IS_TOUCH) return;
    const L = 0.04;
    _mc.x += (_mt.x - _mc.x) * L;
    _mc.y += (_mt.y - _mc.y) * L;
    if (group.current) {
      group.current.rotation.y =  _mc.x * 0.10;  // max ≈ ±10°
      group.current.rotation.x = -_mc.y * 0.08;  // max ≈ ±8°
    }
  });
  return <group ref={group}>{children}</group>;
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING ICONS — 6 icons in a balanced orbital ring
   Positioned at fixed radius so they never crowd each other
══════════════════════════════════════════════════════════════════════════ */
const ICONS = [
  { label: 'JS', color: '#f7df1e' },
  { label: 'PY', color: '#3572A5' },
  { label: '⚛',  color: '#61dafb' },
  { label: 'TS', color: '#3178c6' },
  { label: '🔥', color: '#ff6d00' },
  { label: 'GO', color: '#00aed8' },
];

function makeIconTex(label, color) {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');

  /* Outer glow */
  const grd = ctx.createRadialGradient(S/2,S/2, S/2-18, S/2,S/2, S/2);
  grd.addColorStop(0, color + '22');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, S, S);

  /* Dark circle */
  ctx.beginPath();
  ctx.arc(S/2, S/2, S/2 - 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(14, 10, 28, 0.92)';
  ctx.fill();

  /* Coloured ring */
  ctx.beginPath();
  ctx.arc(S/2, S/2, S/2 - 7, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.globalAlpha = 0.82;
  ctx.stroke();
  ctx.globalAlpha = 1;

  /* Label */
  ctx.font = label.length > 2 ? `bold 44px serif` : `bold 38px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillText(label, S/2, S/2 + 2);

  return new THREE.CanvasTexture(c);
}

/* Place 6 icons in a ring of radius R, alternating z depth */
const RING_R = 2.8;
const ICON_POSITIONS = ICONS.map((_, i) => {
  const angle = (i / ICONS.length) * Math.PI * 2 - Math.PI / 2;
  return [
    Math.cos(angle) * RING_R,
    Math.sin(angle) * RING_R * 0.55,   // squish Y so ring feels flat
    (i % 2 === 0 ? 0.3 : -0.5),        // alternating depth
  ];
});

function FloatingIcon({ label, color, pos, index }) {
  const mesh = useRef();
  const tex  = useMemo(() => makeIconTex(label, color), [label, color]);
  const speed = 0.38 + index * 0.06;
  const phase = index * 1.04;
  const baseY = pos[1];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y       = baseY + Math.sin(t * speed + phase) * 0.20;
    mesh.current.material.opacity = 0.75 + Math.sin(t * 0.5 + phase) * 0.15;
    /* Very slow self-rotation — feels alive not dizzy */
    mesh.current.rotation.z = Math.sin(t * 0.22 + phase) * 0.12;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[0.55, 0.55]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CODE BUBBLES — 3 bubbles, well-spaced
══════════════════════════════════════════════════════════════════════════ */
const BUBBLES = [
  { text: 'const model = new NeuralNet()', pos: [-2.6,  1.6, 0.4], speed: 0.32, phase: 0   },
  { text: 'model.train(dataset) → 98.7%',  pos: [ 2.4,  1.4, 0.2], speed: 0.40, phase: 2.1 },
  { text: '✓ git push origin main',         pos: [ 0.1, -2.1, 0.6], speed: 0.36, phase: 4.3 },
];

function makeBubbleTex(text) {
  const W = 400, H = 76;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  /* Rounded rect helper */
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* Glass bg */
  rr(3, 3, W - 6, H - 6, 14);
  ctx.fillStyle = 'rgba(18, 10, 38, 0.90)';
  ctx.fill();

  /* Purple glow border */
  rr(3, 3, W - 6, H - 6, 14);
  ctx.strokeStyle = 'rgba(138, 92, 246, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  /* Top glow strip */
  const tg = ctx.createLinearGradient(3, 3, W - 3, 3);
  tg.addColorStop(0, 'rgba(138,92,246,0)');
  tg.addColorStop(0.5, 'rgba(138,92,246,0.25)');
  tg.addColorStop(1, 'rgba(138,92,246,0)');
  rr(3, 3, W - 6, 1.5, 14);
  ctx.fillStyle = tg;
  ctx.fill();

  /* Traffic dots */
  [16, 29, 42].forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, 18, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = ['#ff5f57','#febc2e','#28c840'][i];
    ctx.fill();
  });

  /* Code text */
  ctx.font = '15px "Courier New", Courier, monospace';
  ctx.fillStyle = '#c4b5fd';
  ctx.shadowColor = '#8a5cf6';
  ctx.shadowBlur = 8;
  ctx.fillText(text, 16, 52);

  return new THREE.CanvasTexture(c);
}

function CodeBubble({ text, pos, speed, phase }) {
  const mesh = useRef();
  const tex  = useMemo(() => makeBubbleTex(text), [text]);
  const baseY = pos[1];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = baseY + Math.sin(t * speed + phase) * 0.28;
    mesh.current.rotation.y = Math.sin(t * 0.09 + phase) * 0.10;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[2.6, 0.50]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
══════════════════════════════════════════════════════════════════════════ */
function Particles() {
  const pts = useRef();
  const N   = IS_TOUCH ? 35 : 70;

  const pos = useMemo(() => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      a[i*3]   = (Math.random() - 0.5) * 9;
      a[i*3+1] = (Math.random() - 0.5) * 7;
      a[i*3+2] = (Math.random() - 0.5) * 5;
    }
    return a;
  }, [N]);

  useFrame(({ clock }) => {
    if (!pts.current) return;
    const t = clock.getElapsedTime();
    pts.current.rotation.y = t * 0.010;
    pts.current.rotation.x = Math.sin(t * 0.006) * 0.04;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.030} color="#a78bfa" transparent opacity={0.45} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCENE ROOT
══════════════════════════════════════════════════════════════════════════ */
function Scene() {
  const { scene } = useThree();
  useEffect(() => {
    // Very subtle fog so far-back icons fade slightly — not heavy
    scene.fog = new THREE.FogExp2('#0a0812', 0.035);
    return () => { scene.fog = null; };
  }, [scene]);

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.35} />

      {/* Key light — warm purple from upper right */}
      <directionalLight position={[5, 7, 4]} intensity={1.1} color="#c4b0ff" castShadow
        shadow-mapSize-width={512} shadow-mapSize-height={512}
        shadow-camera-near={0.5} shadow-camera-far={20}
      />
      {/* Fill light — cool cyan from left */}
      <directionalLight position={[-4, 2, -1]} intensity={0.45} color="#22d3ee" />
      {/* Rim / back light — lifts the bezel edges */}
      <directionalLight position={[0, -3, -4]} intensity={0.25} color="#8a5cf6" />
      {/* Scene fill point */}
      <pointLight position={[0, 4, 6]} color="#8a5cf6" intensity={0.6} distance={12} />

      {/* ── Tiltable group ── */}
      <TiltRig>
        <Monitor />

        {!IS_TOUCH && ICONS.map((icon, i) => (
          <FloatingIcon key={i} index={i} pos={ICON_POSITIONS[i]} {...icon} />
        ))}

        {!IS_TOUCH
          ? BUBBLES.map((b, i) => <CodeBubble key={i} {...b} />)
          : null
        }
      </TiltRig>

      {/* Particles outside tilt so they feel spacially independent */}
      <Particles />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════ */
export default memo(function Hero3DComputer() {
  return (
    <div className="hero3d-wrap">
      <Canvas
        /*
         * FOV 55° + z=7.5 ensures the full monitor (3.6w × 2.25h) plus
         * ring icons at r=2.8 all fit inside the frustum with ~15% margin.
         * No clipping at any reasonable viewport width.
         */
        camera={{ position: [0, 0.2, 7.5], fov: 55, near: 0.1, far: 60 }}
        gl={{
          antialias:        !IS_TOUCH,
          powerPreference:  'high-performance',
          alpha:            true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, IS_TOUCH ? 1 : 1.5]}
        shadows={!IS_TOUCH}
        style={{ background: 'transparent' }}
        aria-label="3D interactive computer illustration"
      >
        <Scene />
      </Canvas>
    </div>
  );
});
