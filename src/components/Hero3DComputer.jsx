/**
 * Hero3DComputer.jsx  v4.0 — FINAL
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ Chat bubbles REMOVED completely
 * ✅ 6 icons in clean orbital ring — zero clipping
 * ✅ Premium dark-bluish-purple body (gradient, not flat black)
 * ✅ Looping typewriter screen — types → pauses → resets
 * ✅ Ultra-soft lerp tilt (LERP 0.035, max ±8°/6°)
 * ✅ Mobile: computer + 3 icons, no bubbles, DPR 1
 * ✅ Single useFrame per component — zero RAF abuse
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
   SCREEN TEXTURE — looping typewriter
   Canvas re-drawn each frame by the Monitor component's useFrame.
══════════════════════════════════════════════════════════════════════════ */
const CODE_LINES = [
  { t: 'class AIEngineer {',                              c: '#c084fc' },
  { t: '  constructor() {',                               c: '#a78bfa' },
  { t: '    this.name = "Arup Das";',                     c: '#67e8f9' },
  { t: '    this.expertise = ["AI","ML","Full Stack"];',  c: '#86efac' },
  { t: '  }',                                             c: '#a78bfa' },
  { t: '',                                                c: '#fff'    },
  { t: '  buildSystem() {',                               c: '#c084fc' },
  { t: '    return "Scalable intelligent systems.";',     c: '#fbbf24' },
  { t: '  }',                                             c: '#a78bfa' },
  { t: '}',                                               c: '#c084fc' },
  { t: '',                                                c: '#fff'    },
  { t: 'const engineer = new AIEngineer();',              c: '#67e8f9' },
  { t: 'engineer.buildSystem(); // ✓ live',               c: '#4ade80' },
];
const TOTAL_CHARS = CODE_LINES.reduce((s, l) => s + l.t.length, 0);

function buildScreenCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 320;
  return c;
}

function drawScreen(canvas, charCount, cursorVisible) {
  const W = 512, H = 320;
  const ctx = canvas.getContext('2d');

  /* Background */
  ctx.fillStyle = '#070515';
  ctx.fillRect(0, 0, W, H);

  /* Subtle scan-line feel */
  for (let y = 0; y < H; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, W, 1);
  }

  /* Title bar */
  ctx.fillStyle = 'rgba(30, 18, 60, 0.95)';
  ctx.fillRect(0, 0, W, 26);
  [14, 28, 42].forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, 13, 5, 0, Math.PI * 2);
    ctx.fillStyle = ['#ff5f57','#febc2e','#28c840'][i];
    ctx.fill();
  });
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(167,139,250,0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('AIEngineer.js — arupdas0825', W / 2, 17);
  ctx.textAlign = 'left';

  /* Code lines */
  ctx.font = '13px "Courier New", Courier, monospace';
  const lineH = 21;
  const startY = 48;
  let rendered = 0;
  let doneLine = -1;

  for (let i = 0; i < CODE_LINES.length; i++) {
    const y = startY + i * lineH;
    if (y > H - 8) break;

    /* Line number */
    ctx.fillStyle = 'rgba(138,92,246,0.30)';
    ctx.fillText(String(i + 1).padStart(2), 8, y);

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
      ctx.shadowBlur = 4;
      ctx.fillText(show, 36, y);
      ctx.shadowBlur = 0;
    }

    if (doneLine === i) break;
  }

  /* Blinking cursor */
  if (cursorVisible && doneLine >= 0) {
    const lineIdx = doneLine;
    const y = startY + lineIdx * lineH;
    const partialText = CODE_LINES[lineIdx].t.slice(0, charCount - (TOTAL_CHARS - CODE_LINES.slice(lineIdx).reduce((s, l) => s + l.t.length, 0)));
    const tw = ctx.measureText(partialText).width;
    ctx.fillStyle = '#8a5cf6';
    ctx.fillRect(36 + tw, y - 13, 2, 15);
  }

  /* Bottom glow bar */
  const g = ctx.createLinearGradient(0, H - 2, W, H - 2);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.5, 'rgba(138,92,246,0.6)');
  g.addColorStop(1, 'transparent');
  ctx.strokeStyle = g;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H - 1); ctx.lineTo(W, H - 1);
  ctx.stroke();
}

/* ══════════════════════════════════════════════════════════════════════════
   MONITOR — Premium dark-purple-blue gradient body
══════════════════════════════════════════════════════════════════════════ */
function Monitor() {
  const screenGlow  = useRef();
  const screenMesh  = useRef();
  const scrCanvas   = useMemo(() => buildScreenCanvas(), []);
  const scrTex      = useMemo(() => {
    const t = new THREE.CanvasTexture(scrCanvas);
    t.needsUpdate = true;
    return t;
  }, [scrCanvas]);

  /* Typewriter state refs */
  const charCount  = useRef(0);
  const typTimer   = useRef(0);
  const cursTimer  = useRef(0);
  const cursVis    = useRef(true);
  const pauseTimer = useRef(0);
  const inPause    = useRef(false);

  /* ── Premium body gradient — bright indigo ── */
  const bodyMat = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    // 3-stop bright indigo gradient matching portfolio accent
    const g = ctx.createLinearGradient(0, 0, 128, 128);
    g.addColorStop(0,   '#1e293b');   // slate-800
    g.addColorStop(0.5, '#312e81');   // indigo-900
    g.addColorStop(1,   '#4f46e5');   // indigo-600 — bright pop
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    // Subtle gloss streak in top-left
    const gl = ctx.createLinearGradient(0, 0, 60, 60);
    gl.addColorStop(0, 'rgba(255,255,255,0.10)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.30,
      metalness: 0.65,
      envMapIntensity: 1.5,
    });
  }, []);

  const trimMat  = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6366f1', roughness: 0.08, metalness: 0.95,
  }), []);

  const standMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e1b4b', roughness: 0.45, metalness: 0.6,
  }), []);

  useFrame(({ clock }, delta) => {
    /* Cursor blink */
    cursTimer.current += delta;
    if (cursTimer.current > 0.52) { cursVis.current = !cursVis.current; cursTimer.current = 0; }

    /* Typewriter with pause-reset loop */
    if (inPause.current) {
      pauseTimer.current += delta;
      if (pauseTimer.current > 1.8) {           // 1.8s pause after complete
        charCount.current  = 0;
        inPause.current    = false;
        pauseTimer.current = 0;
      }
    } else {
      typTimer.current += delta;
      if (typTimer.current >= 0.042) {           // ~42ms per char
        typTimer.current = 0;
        if (charCount.current < TOTAL_CHARS) {
          charCount.current++;
        } else {
          inPause.current = true;
        }
      }
    }

    /* Redraw screen texture */
    drawScreen(scrCanvas, charCount.current, cursVis.current);
    scrTex.needsUpdate = true;

    /* Breathing screen glow */
    if (screenGlow.current) {
      screenGlow.current.intensity = 0.85 + Math.sin(clock.getElapsedTime() * 0.9) * 0.2;
    }
  });

  return (
    // Scaled up ~40% from v4 for dominant presence
    <group position={[0, 0.15, 0]}>
      {/* ── Bezel outer ── */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <boxGeometry args={[4.9, 3.1, 0.13]} />
      </mesh>

      {/* ── Inner trim ring ── */}
      <mesh position={[0, 0, 0.066]} material={trimMat}>
        <boxGeometry args={[4.64, 2.88, 0.008]} />
      </mesh>

      {/* ── Neon edge highlights ── */}
      {/* Top */}
      <mesh position={[0, 1.52, 0.012]}>
        <boxGeometry args={[4.9, 0.014, 0.14]} />
        <meshStandardMaterial color='#818cf8' emissive='#818cf8' emissiveIntensity={2.2} transparent opacity={0.85} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -1.52, 0.012]}>
        <boxGeometry args={[4.9, 0.014, 0.14]} />
        <meshStandardMaterial color='#6366f1' emissive='#6366f1' emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>
      {/* Left */}
      <mesh position={[-2.435, 0, 0.012]}>
        <boxGeometry args={[0.014, 3.1, 0.14]} />
        <meshStandardMaterial color='#8a5cf6' emissive='#8a5cf6' emissiveIntensity={1.8} transparent opacity={0.75} />
      </mesh>
      {/* Right */}
      <mesh position={[2.435, 0, 0.012]}>
        <boxGeometry args={[0.014, 3.1, 0.14]} />
        <meshStandardMaterial color='#8a5cf6' emissive='#8a5cf6' emissiveIntensity={1.8} transparent opacity={0.75} />
      </mesh>

      {/* ── Outer screen glow halo ── */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[4.75, 2.95, 0.005]} />
        <meshStandardMaterial
          color='#6366f1' emissive='#6366f1' emissiveIntensity={0.55}
          transparent opacity={0.18} depthWrite={false}
        />
      </mesh>

      {/* ── Live coding screen ── */}
      <mesh ref={screenMesh} position={[0, 0.04, 0.072]}>
        <boxGeometry args={[4.44, 2.68, 0.004]} />
        <meshStandardMaterial
          map={scrTex}
          roughness={0.03}
          metalness={0}
          emissiveMap={scrTex}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* ── Power LED ── */}
      <mesh position={[0, -1.44, 0.068]}>
        <sphereGeometry args={[0.040, 8, 8]} />
        <meshStandardMaterial color='#22c55e' emissive='#22c55e' emissiveIntensity={4.0} />
      </mesh>

      {/* ── Screen glow point light ── */}
      <pointLight ref={screenGlow} position={[0, 0, 1.2]}
        color='#818cf8' intensity={1.2} distance={5.0} decay={2} />

      {/* ── Stand neck ── */}
      <mesh position={[0, -1.84, -0.16]} material={standMat}>
        <boxGeometry args={[0.24, 0.72, 0.18]} />
      </mesh>

      {/* ── Stand base ── */}
      <mesh position={[0, -2.24, -0.36]} receiveShadow material={standMat}>
        <boxGeometry args={[1.70, 0.080, 0.72]} />
      </mesh>

      {/* ── Keyboard ── */}
      <mesh position={[0, -2.30, 0.82]} receiveShadow material={bodyMat}>
        <boxGeometry args={[3.6, 0.065, 1.10]} />
      </mesh>
      {/* Key bar rows */}
      {[-0.33, -0.09, 0.14, 0.34].map((z, i) => (
        <mesh key={i} position={[0, -2.268, 0.86 + z]} material={trimMat}>
          <boxGeometry args={[3.26, 0.038, 0.17]} />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CURSOR TILT RIG — ultra-soft lerp
══════════════════════════════════════════════════════════════════════════ */
const _mt = { x: 0, y: 0 };
const _mc = { x: 0, y: 0 };

if (typeof window !== 'undefined' && !IS_TOUCH) {
  window.addEventListener('mousemove', e => {
    _mt.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    _mt.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

function TiltRig({ children }) {
  const group = useRef();
  useFrame(() => {
    if (IS_TOUCH || !group.current) return;
    const L = 0.035;
    _mc.x += (_mt.x - _mc.x) * L;
    _mc.y += (_mt.y - _mc.y) * L;
    group.current.rotation.y =  _mc.x * 0.08;   // max ≈ ±8°
    group.current.rotation.x = -_mc.y * 0.06;   // max ≈ ±6°
  });
  return <group ref={group}>{children}</group>;
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING TECH ICONS
   6 icons in a clean elliptical ring — desktop
   3 icons on mobile
   All positions computed at fixed radius — never clip viewport
══════════════════════════════════════════════════════════════════════════ */
const ALL_ICONS = [
  { label: 'JS', color: '#f7df1e' },
  { label: 'PY', color: '#3572A5' },
  { label: '⚛',  color: '#61dafb' },
  { label: 'TS', color: '#3178c6' },
  { label: 'ND', color: '#6da55f' },
  { label: '🔥', color: '#ff6d00' },
];

/* Elliptical ring: rx=3.4, ry=2.0 — scaled with bigger monitor, fits at z=10 */
const RX = 3.4, RY = 2.0;
const ICON_POSITIONS = ALL_ICONS.map((_, i) => {
  const n = ALL_ICONS.length;
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return [
    Math.cos(a) * RX,
    Math.sin(a) * RY,
    i % 2 === 0 ? 0.5 : -0.6,   // alternating depth
  ];
});

function makeIconTex(label, color) {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');

  /* Outer glow halo */
  const grd = ctx.createRadialGradient(S/2, S/2, S/2-20, S/2, S/2, S/2);
  grd.addColorStop(0, color + '28');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, S, S);

  /* Dark circle */
  ctx.beginPath();
  ctx.arc(S/2, S/2, S/2 - 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 8, 22, 0.90)';
  ctx.fill();

  /* Coloured ring */
  ctx.beginPath();
  ctx.arc(S/2, S/2, S/2 - 7, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;

  /* Icon label */
  const isEmoji = label.length > 2 || /\p{Emoji}/u.test(label);
  ctx.font = isEmoji ? 'bold 46px serif' : 'bold 36px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillText(label, S/2, S/2 + 2);

  return new THREE.CanvasTexture(c);
}

function FloatingIcon({ label, color, pos, index }) {
  const mesh = useRef();
  const tex  = useMemo(() => makeIconTex(label, color), [label, color]);
  const speed = 0.35 + index * 0.055;
  const phase = index * 1.05;
  const baseY = pos[1];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    /* Gentle vertical bob */
    mesh.current.position.y = baseY + Math.sin(t * speed + phase) * 0.18;
    /* Slow Z-axis spin — feels alive, not distracting */
    mesh.current.rotation.z = Math.sin(t * 0.18 + phase) * 0.10;
    /* Soft opacity pulse */
    mesh.current.material.opacity = 0.78 + Math.sin(t * 0.45 + phase) * 0.12;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[0.58, 0.58]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
══════════════════════════════════════════════════════════════════════════ */
function Particles() {
  const pts = useRef();
  const N   = IS_TOUCH ? 30 : 65;

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
    pts.current.rotation.y = t * 0.009;
    pts.current.rotation.x = Math.sin(t * 0.005) * 0.035;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#a78bfa" transparent opacity={0.40} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCENE ROOT
══════════════════════════════════════════════════════════════════════════ */
function Scene() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#08051a', 0.028);
    return () => { scene.fog = null; };
  }, [scene]);

  const desktopIcons = ALL_ICONS;
  const mobileIcons  = ALL_ICONS.slice(0, 3);
  const iconsToShow  = IS_TOUCH ? mobileIcons : desktopIcons;

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.30} />

      {/* Key — warm violet from upper-right */}
      <directionalLight position={[5, 7, 4]}  intensity={1.0} color="#c0b0ff" castShadow
        shadow-mapSize-width={512} shadow-mapSize-height={512}
      />
      {/* Fill — cool cyan from left */}
      <directionalLight position={[-4, 2, -1]} intensity={0.40} color="#22d3ee" />
      {/* Rim — under-back, lifts edges */}
      <directionalLight position={[0, -4, -4]} intensity={0.22} color="#818cf8" />
      {/* Scene ambient glow point */}
      <pointLight position={[0, 4, 6]} color="#8a5cf6" intensity={0.55} distance={14} />

      {/* ── Tiltable group (computer + icons) ── */}
      <TiltRig>
        <Monitor />

        {iconsToShow.map((icon, i) => (
          <FloatingIcon
            key={i}
            index={i}
            label={icon.label}
            color={icon.color}
            pos={ICON_POSITIONS[i]}
          />
        ))}
      </TiltRig>

      {/* Particles are outside tilt for spatial depth independence */}
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
         * Camera: z=10.5, FOV 58°
         * Monitor is 4.9 wide → half = 2.45u. Icon ring RX=3.4.
         * At z=10.5 the frustum half-width ≈ 10.5*tan(29°) ≈ 5.82u
         * Gives ≥70% margin beyond icon edge at 3.4u — zero clipping.
         */
        camera={{ position: [0, 0.2, 10.5], fov: 58, near: 0.1, far: 80 }}
        gl={{
          antialias:       !IS_TOUCH,
          powerPreference: 'high-performance',
          alpha:           true,
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
