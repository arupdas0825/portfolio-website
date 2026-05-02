/**
 * Hero3DComputer.jsx  v5.0 — CYBERPUNK EDITION
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ Persistent 3D scene (no re-mount scaling issues)
 * ✅ SHARP High-DPI textures (1024x640, DPR 2)
 * ✅ Cyberpunk premium body (cyan-indigo-purple gradient)
 * ✅ Advanced Terminal UI (initializing neural core, scanlines, flicker)
 * ✅ Locked Scale System (1.4 Desktop / 0.85 Mobile)
 * ✅ Soft neon icon glows & pulsing
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

// High-resolution canvas for crystal clear text
function buildScreenCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 640;
  return c;
}

function drawScreen(canvas, charCount, cursorVisible, time) {
  const W = 1024, H = 640;
  const ctx = canvas.getContext('2d');

  /* Background */
  ctx.fillStyle = '#060412';
  ctx.fillRect(0, 0, W, H);

  /* Cyberpunk scanlines (flickering) */
  const flicker = Math.sin(time * 60) * 0.02 + 0.98;
  ctx.globalAlpha = flicker;
  
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, y, W, 2);
  }

  /* Title bar */
  ctx.fillStyle = 'rgba(15, 12, 41, 0.98)';
  ctx.fillRect(0, 0, W, 52);
  [28, 56, 84].forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, 26, 8, 0, Math.PI * 2);
    ctx.fillStyle = ['#ff5f57','#febc2e','#28c840'][i];
    ctx.fill();
  });
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = 'rgba(167,139,250,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('NEURAL-CORE.SH — ARUP_OS v5.0', W / 2, 34);
  ctx.textAlign = 'left';

  /* Code lines */
  ctx.font = 'bold 30px "JetBrains Mono", "Courier New", monospace';
  const lineH = 40;
  const startY = 110;
  let rendered = 0;
  let doneLine = -1;

  for (let i = 0; i < CODE_LINES.length; i++) {
    const y = startY + i * lineH;
    if (y > H - 20) break;

    /* Line number */
    ctx.fillStyle = 'rgba(138,92,246,0.35)';
    ctx.fillText(String(i + 1).padStart(2, '0'), 30, y);

    const full = CODE_LINES[i].t;
    let show = '';

    if (rendered + full.length <= charCount) {
      show = full;
      rendered += full.length;
    } else {
      show = full.slice(0, charCount - rendered);
      rendered = charCount;
      doneLine = i;
    }

    if (show.length > 0) {
      ctx.fillStyle = CODE_LINES[i].c;
      ctx.shadowColor = CODE_LINES[i].c;
      ctx.shadowBlur = 12;
      ctx.fillText(show, 100, y);
      ctx.shadowBlur = 0;
    }

    if (doneLine === i) break;
  }


  /* Blinking terminal cursor */
  if (cursorVisible && doneLine >= 0) {
    const lineIdx = doneLine;
    const y = startY + lineIdx * lineH;
    const partialText = CODE_LINES[lineIdx].t.slice(0, charCount - (TOTAL_CHARS - CODE_LINES.slice(lineIdx).reduce((s, l) => s + l.t.length, 0)));
    const tw = ctx.measureText(partialText).width;
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 18;
    ctx.fillRect(100 + tw + 4, y - 30, 14, 36);
  }


  /* Glitch effect bar */
  if (Math.random() > 0.98) {
    ctx.fillStyle = 'rgba(34,211,238,0.1)';
    ctx.fillRect(0, Math.random() * H, W, 20);
  }

  ctx.globalAlpha = 1.0;
}

/* ══════════════════════════════════════════════════════════════════════════
   MONITOR — Cyberpunk Premium
══════════════════════════════════════════════════════════════════════════ */
function Monitor() {
  const screenGlow  = useRef();
  const screenMesh  = useRef();
  const scrCanvas   = useMemo(() => buildScreenCanvas(), []);
  const scrTex      = useMemo(() => {
    const t = new THREE.CanvasTexture(scrCanvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }, [scrCanvas]);

  const charCount  = useRef(0);
  const typTimer   = useRef(0);
  const cursTimer  = useRef(0);
  const cursVis    = useRef(true);
  const pauseTimer = useRef(0);
  const inPause    = useRef(false);

  /* ── Cyberpunk body gradient ── */
  const bodyMat = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0,   '#0ea5e9'); // bright cyan
    g.addColorStop(0.5, '#6366f1'); // indigo
    g.addColorStop(1,   '#a855f7'); // purple
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    
    // Metallic gloss
    const gl = ctx.createLinearGradient(0, 0, 100, 100);
    gl.addColorStop(0, 'rgba(255,255,255,0.15)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(c);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.7,
      envMapIntensity: 1.8,
    });
  }, []);

  const trimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22d3ee', roughness: 0.05, metalness: 0.9, emissive: '#22d3ee', emissiveIntensity: 0.4
  }), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    cursTimer.current += delta;
    if (cursTimer.current > 0.5) { cursVis.current = !cursVis.current; cursTimer.current = 0; }

    if (inPause.current) {
      pauseTimer.current += delta;
      if (pauseTimer.current > 2.0) {
        charCount.current  = 0;
        inPause.current    = false;
        pauseTimer.current = 0;
      }
    } else {
      typTimer.current += delta;
      if (typTimer.current >= 0.035) {
        typTimer.current = 0;
        if (charCount.current < TOTAL_CHARS) {
          charCount.current++;
        } else {
          inPause.current = true;
        }
      }
    }

    drawScreen(scrCanvas, charCount.current, cursVis.current, t);
    scrTex.needsUpdate = true;

    if (screenGlow.current) {
      screenGlow.current.intensity = 1.0 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* ── Bezel ── */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <boxGeometry args={[4.9, 3.1, 0.15]} />
      </mesh>

      {/* ── Inner neon trim ── */}
      <mesh position={[0, 0, 0.076]} material={trimMat}>
        <boxGeometry args={[4.6, 2.85, 0.01]} />
      </mesh>

      {/* ── Live screen ── */}
      <mesh ref={screenMesh} position={[0, 0.04, 0.082]}>
        <boxGeometry args={[4.44, 2.68, 0.005]} />
        <meshStandardMaterial
          map={scrTex}
          emissiveMap={scrTex}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={0.65}
        />
      </mesh>

      {/* ── Power LED ── */}
      <mesh position={[0, -1.4, 0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color='#22d3ee' emissive='#22d3ee' emissiveIntensity={5} />
      </mesh>

      <pointLight ref={screenGlow} position={[0, 0, 1.5]} color='#22d3ee' intensity={1.2} distance={6} decay={2} />

      {/* ── Stand ── */}
      <mesh position={[0, -1.8, -0.15]} material={bodyMat}>
        <boxGeometry args={[0.3, 0.8, 0.2]} />
      </mesh>
      <mesh position={[0, -2.2, -0.3]} material={bodyMat}>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING ICONS
══════════════════════════════════════════════════════════════════════════ */
const ALL_ICONS = [
  { label: 'JS', color: '#f7df1e' },
  { label: 'PY', color: '#3572A5' },
  { label: '⚛',  color: '#61dafb' },
  { label: 'TS', color: '#3178c6' },
  { label: 'ND', color: '#6da55f' },
  { label: '🔥', color: '#ff6d00' },
];

const RX = 3.8, RY = 2.2;
const ICON_POSITIONS = ALL_ICONS.map((_, i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * RX, Math.sin(a) * RY, i % 2 === 0 ? 0.6 : -0.6];
});

function FloatingIcon({ label, color, pos, index }) {
  const mesh = useRef();
  const speed = 0.4 + index * 0.05;
  const phase = index * 1.1;

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = pos[1] + Math.sin(t * speed + phase) * 0.25;
    mesh.current.rotation.z = Math.sin(t * 0.2 + phase) * 0.15;
    mesh.current.material.opacity = 0.8 + Math.sin(t * 0.6 + phase) * 0.2;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <circleGeometry args={[0.35, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      <pointLight color={color} intensity={0.5} distance={2} />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCENE & CAMERA
══════════════════════════════════════════════════════════════════════════ */
function Scene() {
  const scale = IS_TOUCH ? 0.9 : 1.45;
  const iconsToShow = IS_TOUCH ? ALL_ICONS.slice(0, 3) : ALL_ICONS;

  return (
    <group scale={scale}>
      <Monitor />
      {iconsToShow.map((icon, i) => (
        <FloatingIcon key={i} index={i} label={icon.label} color={icon.color} pos={ICON_POSITIONS[i]} />
      ))}
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
    </group>
  );
}


export default memo(function Hero3DComputer() {
  return (
    <div className="hero3d-wrap" style={{ width: '100%', height: '100%', minHeight: '560px' }}>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // High resolution
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
});
