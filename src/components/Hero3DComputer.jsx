/**
 * Hero3DComputer.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium 3D desktop computer scene:
 *   - Smooth cursor-tracking tilt (lerp-damped)
 *   - Floating glassmorphism code chat bubbles
 *   - Language icon SVGs orbiting in 3D space
 *   - Single RAF loop — 60 FPS target
 *   - Mobile: simplified canvas-only fallback
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, memo, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Device detection ─────────────────────────────────────────────────────────
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

// ─── Colour palette ───────────────────────────────────────────────────────────
const PURPLE     = new THREE.Color('#8a5cf6');
const CYAN       = new THREE.Color('#22d3ee');
const SCREEN_BG  = new THREE.Color('#0d0a1e');
const BODY_COL   = new THREE.Color('#1a1030');
const TRIM_COL   = new THREE.Color('#2d1f4e');
const STAND_COL  = new THREE.Color('#160c2c');

// ─── Monitor mesh ─────────────────────────────────────────────────────────────
function Monitor() {
  const screenGlow = useRef();

  useFrame(({ clock }) => {
    if (screenGlow.current) {
      screenGlow.current.intensity =
        1.4 + Math.sin(clock.getElapsedTime() * 0.8) * 0.3;
    }
  });

  return (
    <group position={[0, 0.3, 0]}>
      {/* --- Screen bezel --- */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 2.4, 0.12]} />
        <meshStandardMaterial
          color={BODY_COL}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* --- Inner screen glow border --- */}
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[3.55, 2.18, 0.01]} />
        <meshStandardMaterial color={TRIM_COL} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* --- Screen surface --- */}
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[3.4, 2.05, 0.01]} />
        <meshStandardMaterial
          color={SCREEN_BG}
          roughness={0.05}
          metalness={0.1}
          emissive={SCREEN_BG}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* --- Screen code lines --- */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
        <mesh key={i} position={[-0.6 + (i % 2) * 0.2, y * 0.55, 0.085]}>
          <boxGeometry args={[1.2 + (i % 3) * 0.4, 0.04, 0.001]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#a78bfa' : '#22d3ee'}
            emissive={i % 2 === 0 ? '#a78bfa' : '#22d3ee'}
            emissiveIntensity={0.9}
            roughness={0}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* --- Power indicator dot --- */}
      <mesh position={[0, -1.1, 0.065]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color='#22c55e'
          emissive='#22c55e'
          emissiveIntensity={2}
        />
      </mesh>

      {/* --- Stand neck --- */}
      <mesh position={[0, -1.45, -0.12]}>
        <boxGeometry args={[0.22, 0.7, 0.18]} />
        <meshStandardMaterial color={STAND_COL} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* --- Stand base --- */}
      <mesh position={[0, -1.82, -0.28]} receiveShadow>
        <boxGeometry args={[1.4, 0.08, 0.72]} />
        <meshStandardMaterial color={STAND_COL} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* --- Keyboard --- */}
      <mesh position={[0, -1.86, 0.6]} receiveShadow>
        <boxGeometry args={[2.8, 0.06, 0.88]} />
        <meshStandardMaterial color={BODY_COL} roughness={0.35} metalness={0.5} />
      </mesh>

      {/* --- Keyboard key rows --- */}
      {[-0.28, -0.08, 0.12, 0.28].map((z, ri) =>
        Array.from({ length: 10 }).map((_, ci) => (
          <mesh
            key={`k-${ri}-${ci}`}
            position={[-1.1 + ci * 0.244, -1.83, 0.62 + z]}
          >
            <boxGeometry args={[0.2, 0.04, 0.18]} />
            <meshStandardMaterial
              color={TRIM_COL}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))
      )}

      {/* --- Screen point light --- */}
      <pointLight
        ref={screenGlow}
        position={[0, 0, 0.5]}
        color={PURPLE}
        intensity={1.4}
        distance={4}
        decay={2}
      />
    </group>
  );
}

// ─── Cursor-tilt rig ──────────────────────────────────────────────────────────
const mouseTarget = { x: 0, y: 0 };
const mouseCurrent = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

function TiltRig({ children }) {
  const group = useRef();

  useFrame(() => {
    const LERP = 0.06;
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * LERP;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * LERP;

    if (group.current) {
      group.current.rotation.y =  mouseCurrent.x * 0.18;
      group.current.rotation.x = -mouseCurrent.y * 0.12;
    }
  });

  return <group ref={group}>{children}</group>;
}

// ─── Floating icon plane (SVG-as-texture via canvas) ─────────────────────────
const ICON_DEFS = [
  // JS
  { emoji: 'JS', color: '#f7df1e', pos: [-2.8,  1.1, -0.6] },
  // Python
  { emoji: 'PY', color: '#3572A5', pos: [ 2.6,  1.2, -0.4] },
  // React
  { emoji: '⚛',  color: '#61dafb', pos: [-2.4, -0.5,  0.2] },
  // Node
  { emoji: 'ND', color: '#6da55f', pos: [ 2.2, -0.6,  0.0] },
  // C++
  { emoji: 'C+', color: '#9c4cce', pos: [-2.0,  0.4,  1.0] },
  // Firebase
  { emoji: '🔥', color: '#ff6d00', pos: [ 2.8,  0.2,  0.6] },
  // TypeScript
  { emoji: 'TS', color: '#3178c6', pos: [ 0.0,  2.1, -1.2] },
  // Docker
  { emoji: '🐳', color: '#2496ed', pos: [-0.4, -2.0,  0.4] },
];

function makeLabelTexture(text, color) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Circle bg
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 10, 30, 0.85)';
  ctx.fill();

  // Glow ring
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.75;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Text
  ctx.font = text.length > 2 ? 'bold 48px serif' : 'bold 42px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillText(text, size / 2, size / 2);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function FloatingIcon({ emoji, color, pos, index }) {
  const mesh = useRef();
  const texture = useMemo(() => makeLabelTexture(emoji, color), [emoji, color]);

  const speed  = 0.4 + index * 0.07;
  const phase  = index * 1.1;
  const baseY  = pos[1];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y       = baseY + Math.sin(t * speed + phase) * 0.22;
    mesh.current.rotation.y       = t * 0.3 + phase;
    mesh.current.material.opacity = 0.7 + Math.sin(t * 0.6 + phase) * 0.15;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[0.52, 0.52]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Code bubble in 3D ────────────────────────────────────────────────────────
const SNIPPETS = [
  'const ai = new Model()',
  'train(data, epochs=50)',
  'npm run deploy',
  'git push origin main',
  'useState(null) ✓',
];

function makeCodeTexture(text) {
  const w = 320, h = 72;
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Glass background
  const rnd = Math.round;
  ctx.roundRect = ctx.roundRect || function(x, y, w2, h2, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w2 - r, y);
    ctx.quadraticCurveTo(x + w2, y, x + w2, y + r);
    ctx.lineTo(x + w2, y + h2 - r);
    ctx.quadraticCurveTo(x + w2, y + h2, x + w2 - r, y + h2);
    ctx.lineTo(x + r, y + h2);
    ctx.quadraticCurveTo(x, y + h2, x, y + h2 - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Background pill
  ctx.beginPath();
  ctx.roundRect(4, 4, w - 8, h - 8, 16);
  ctx.fillStyle = 'rgba(20, 12, 42, 0.88)';
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(4, 4, w - 8, h - 8, 16);
  ctx.strokeStyle = 'rgba(138, 92, 246, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Terminal dot row
  [16, 28, 40].forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, 20, 5, 0, Math.PI * 2);
    ctx.fillStyle = ['#ff5f57', '#febc2e', '#28c840'][i];
    ctx.fill();
  });

  // Code text
  ctx.font = '16px "Courier New", monospace';
  ctx.fillStyle = '#c4b5fd';
  ctx.shadowColor = '#8a5cf6';
  ctx.shadowBlur = 6;
  ctx.fillText(text, 14, 50);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

const BUBBLE_CONFIGS = [
  { text: SNIPPETS[0], pos: [-2.2,  1.8, 0.6], speed: 0.35, phase: 0   },
  { text: SNIPPETS[1], pos: [ 1.9,  1.5, 0.4], speed: 0.42, phase: 1.4 },
  { text: SNIPPETS[2], pos: [-1.8, -1.2, 0.8], speed: 0.38, phase: 2.8 },
  { text: SNIPPETS[3], pos: [ 2.0, -1.0, 0.2], speed: 0.45, phase: 4.2 },
];

function CodeBubble({ text, pos, speed, phase }) {
  const mesh = useRef();
  const texture = useMemo(() => makeCodeTexture(text), [text]);
  const baseY = pos[1];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = baseY + Math.sin(t * speed + phase) * 0.3;
    // Always face camera (billboard)
    mesh.current.rotation.y = Math.sin(t * 0.1 + phase) * 0.15;
  });

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[2.4, 0.54]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Ambient particle drift ───────────────────────────────────────────────────
function ParticleDrift() {
  const points = useRef();
  const count  = IS_TOUCH ? 40 : 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * 0.012;
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.007) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color='#a78bfa'
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene root ───────────────────────────────────────────────────────────────
function Scene() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0a0812', 0.06);
  }, [scene]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.9}
        color='#d4b8ff'
        castShadow
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.4}
        color='#22d3ee'
      />
      <pointLight position={[0, 5, 5]} color='#8a5cf6' intensity={0.7} distance={10} />

      {/* Tiltable computer */}
      <TiltRig>
        <Monitor />

        {/* Language icons — only on non-mobile */}
        {!IS_TOUCH && ICON_DEFS.map((icon, i) => (
          <FloatingIcon key={i} index={i} {...icon} />
        ))}

        {/* Code bubbles */}
        {!IS_TOUCH
          ? BUBBLE_CONFIGS.map((b, i) => <CodeBubble key={i} {...b} />)
          : BUBBLE_CONFIGS.slice(0, 2).map((b, i) => <CodeBubble key={i} {...b} />)
        }
      </TiltRig>

      {/* Ambient particles */}
      <ParticleDrift />
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default memo(function Hero3DComputer() {
  return (
    <div className='hero3d-wrap'>
      <Canvas
        camera={{ position: [0, 0.5, 6.5], fov: 45 }}
        gl={{
          antialias: !IS_TOUCH,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={[1, IS_TOUCH ? 1 : 1.5]}
        shadows={!IS_TOUCH}
        style={{ background: 'transparent' }}
        aria-label='3D computer illustration'
      >
        <Scene />
      </Canvas>
    </div>
  );
});
