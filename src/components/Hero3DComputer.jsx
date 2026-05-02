/**
 * Hero3DComputer.jsx  v5.1 — ICON REFRESH
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ Replaced text icons with high-quality SVG floating tiles
 * ✅ Match the Tech Stack icon boxes style (rounded squares + logos)
 * ✅ 6 primary technologies: React, JS, Python, Node, TS, Figma
 * ✅ Soft glow + depth layering for each icon tile
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Device detection ────────────────────────────────────────────────────── */
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

/* ══════════════════════════════════════════════════════════════════════════
   SCREEN TEXTURE — Cyberpunk Terminal
══════════════════════════════════════════════════════════════════════════ */
const CODE_LINES = [
  { t: '>> initializing neural core...',           c: '#22d3ee' },
  { t: '>> system check: OPTIMAL',                  c: '#4ade80' },
  { t: '>> loading ai.arup.engineer...',            c: '#818cf8' },
  { t: '>> expertise: [AI, ML, FULL_STACK]',        c: '#c084fc' },
  { t: '----------------------------------',         c: 'rgba(129,140,248,0.3)' },
  { t: 'class CoreEngine {',                         c: '#6366f1' },
  { t: '  async build(spec) {',                      c: '#a78bfa' },
  { t: '    return await AI.scale(spec);',           c: '#67e8f9' },
  { t: '  }',                                        c: '#a78bfa' },
  { t: '}',                                          c: '#6366f1' },
  { t: '',                                           c: '#fff'    },
  { t: 'const engine = new CoreEngine();',           c: '#22d3ee' },
  { t: 'engine.build("precision_ai"); // ✓ OK',      c: '#4ade80' },
];
const TOTAL_CHARS = CODE_LINES.reduce((s, l) => s + l.t.length, 0);

function buildScreenCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 640;
  return c;
}

function drawScreen(canvas, charCount, cursorVisible, time) {
  const W = 1024, H = 640;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#060412';
  ctx.fillRect(0, 0, W, H);
  const flicker = Math.sin(time * 60) * 0.02 + 0.98;
  ctx.globalAlpha = flicker;
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, y, W, 2);
  }
  ctx.fillStyle = 'rgba(15, 12, 41, 0.98)';
  ctx.fillRect(0, 0, W, 52);
  [28, 56, 84].forEach((x, i) => {
    ctx.beginPath(); ctx.arc(x, 26, 8, 0, Math.PI * 2);
    ctx.fillStyle = ['#ff5f57','#febc2e','#28c840'][i]; ctx.fill();
  });
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(167,139,250,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('NEURAL-CORE.SH — ARUP_OS v5.1', W / 2, 34);
  ctx.textAlign = 'left';
  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  const lineH = 40; const startY = 110;
  let rendered = 0; let doneLine = -1;
  for (let i = 0; i < CODE_LINES.length; i++) {
    const y = startY + i * lineH; if (y > H - 20) break;
    ctx.fillStyle = 'rgba(138,92,246,0.35)'; ctx.fillText(String(i + 1).padStart(2, '0'), 30, y);
    const full = CODE_LINES[i].t; let show = '';
    if (rendered + full.length <= charCount) { show = full; rendered += full.length; }
    else { show = full.slice(0, charCount - rendered); rendered = charCount; doneLine = i; }
    if (show.length > 0) {
      ctx.fillStyle = CODE_LINES[i].c; ctx.shadowColor = CODE_LINES[i].c;
      ctx.shadowBlur = 12; ctx.fillText(show, 100, y); ctx.shadowBlur = 0;
    }
    if (doneLine === i) break;
  }
  if (cursorVisible && doneLine >= 0) {
    const lineIdx = doneLine; const y = startY + lineIdx * lineH;
    const partialText = CODE_LINES[lineIdx].t.slice(0, charCount - (TOTAL_CHARS - CODE_LINES.slice(lineIdx).reduce((s, l) => s + l.t.length, 0)));
    const tw = ctx.measureText(partialText).width;
    ctx.fillStyle = '#22d3ee'; ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 18;
    ctx.fillRect(100 + tw + 4, y - 30, 14, 36);
  }
  if (Math.random() > 0.98) { ctx.fillStyle = 'rgba(34,211,238,0.1)'; ctx.fillRect(0, Math.random() * H, W, 20); }
  ctx.globalAlpha = 1.0;
}

/* ══════════════════════════════════════════════════════════════════════════
   MONITOR
══════════════════════════════════════════════════════════════════════════ */
function Monitor() {
  const screenGlow  = useRef();
  const scrCanvas   = useMemo(() => buildScreenCanvas(), []);
  const scrTex      = useMemo(() => {
    const t = new THREE.CanvasTexture(scrCanvas);
    t.minFilter = t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true; return t;
  }, [scrCanvas]);

  const charCount  = useRef(0);
  const typTimer   = useRef(0);
  const cursTimer  = useRef(0);
  const cursVis    = useRef(true);
  const pauseTimer = useRef(0);
  const inPause    = useRef(false);

  const bodyMat = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, '#0ea5e9'); g.addColorStop(0.5, '#6366f1'); g.addColorStop(1, '#a855f7');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.25, metalness: 0.7, envMapIntensity: 1.8 });
  }, []);

  const trimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22d3ee', roughness: 0.05, metalness: 0.9, emissive: '#22d3ee', emissiveIntensity: 0.4
  }), []);

  useFrame(({ clock }, delta) => {
    cursTimer.current += delta;
    if (cursTimer.current > 0.5) { cursVis.current = !cursVis.current; cursTimer.current = 0; }
    if (inPause.current) {
      pauseTimer.current += delta;
      if (pauseTimer.current > 2.0) { charCount.current = 0; inPause.current = false; pauseTimer.current = 0; }
    } else {
      typTimer.current += delta;
      if (typTimer.current >= 0.035) {
        typTimer.current = 0;
        if (charCount.current < TOTAL_CHARS) charCount.current++; else inPause.current = true;
      }
    }
    drawScreen(scrCanvas, charCount.current, cursVis.current, clock.getElapsedTime());
    scrTex.needsUpdate = true;
    if (screenGlow.current) screenGlow.current.intensity = 1.0 + Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
  });

  return (
    <group position={[0, 0.15, 0]}>
      <mesh castShadow receiveShadow material={bodyMat}><boxGeometry args={[4.9, 3.1, 0.15]} /></mesh>
      <mesh position={[0, 0, 0.076]} material={trimMat}><boxGeometry args={[4.6, 2.85, 0.01]} /></mesh>
      <mesh position={[0, 0.04, 0.082]}>
        <boxGeometry args={[4.44, 2.68, 0.005]} />
        <meshStandardMaterial map={scrTex} emissiveMap={scrTex} emissive="#fff" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, -1.4, 0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color='#22d3ee' emissive='#22d3ee' emissiveIntensity={5} />
      </mesh>
      <pointLight ref={screenGlow} position={[0, 0, 1.5]} color='#22d3ee' intensity={1.2} distance={6} />
      <mesh position={[0, -1.8, -0.15]} material={bodyMat}><boxGeometry args={[0.3, 0.8, 0.2]} /></mesh>
      <mesh position={[0, -2.2, -0.3]} material={bodyMat}><boxGeometry args={[1.8, 0.08, 0.8]} /></mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING ICON TILES
══════════════════════════════════════════════════════════════════════════ */
const TECH_ICONS = [
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61dafb' },
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776ab' },
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#f7df1e' },
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: '#3178c6' },
  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', color: '#f24e1e' },
];

const RX = 4.0, RY = 2.4;
const ICON_POSITIONS = TECH_ICONS.map((_, i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * RX, Math.sin(a) * RY, i % 2 === 0 ? 0.8 : -0.8];
});

function FloatingIcon({ url, color, pos, index }) {
  const mesh = useRef();
  const texture = useLoader(THREE.TextureLoader, url);
  const speed = 0.4 + index * 0.05;
  const phase = index * 1.1;

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = pos[1] + Math.sin(t * speed + phase) * 0.3;
    mesh.current.rotation.y = Math.sin(t * 0.4 + phase) * 0.2;
    mesh.current.rotation.x = Math.cos(t * 0.3 + phase) * 0.1;
  });

  return (
    <group position={pos} ref={mesh}>
      {/* The rounded square box (same style as Tech Stack section) */}
      <mesh>
        <boxGeometry args={[0.7, 0.7, 0.05]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} transparent opacity={0.9} />
      </mesh>
      {/* The Logo */}
      <mesh position={[0, 0, 0.03]} scale={0.5}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      </mesh>
      {/* Subtle glow behind */}
      <pointLight color={color} intensity={0.6} distance={2} decay={2} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════════════════════ */
function Scene() {
  const scale = IS_TOUCH ? 0.9 : 1.45;
  const iconsToShow = IS_TOUCH ? TECH_ICONS.slice(0, 3) : TECH_ICONS;

  return (
    <group scale={scale}>
      <Monitor />
      {iconsToShow.map((icon, i) => (
        <FloatingIcon key={i} index={i} url={icon.url} color={icon.color} pos={ICON_POSITIONS[i]} />
      ))}
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
    </group>
  );
}

export default memo(function Hero3DComputer() {
  return (
    <div className="hero3d-wrap" style={{ width: '100%', height: '100%', minHeight: '600px' }}>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
});
