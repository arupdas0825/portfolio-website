import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Accretion Disk ─── */
function AccretionDisk() {
  const meshRef = useRef();
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(1.2, 3.5, 128, 1);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI * 0.45, 0.1, 0]} geometry={geometry}>
      <meshBasicMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
        color="#8a5cf6"
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Inner Glow Ring ─── */
function InnerGlow() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = -clock.getElapsedTime() * 0.3;
      const s = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.08;
      ref.current.scale.set(s, s, 1);
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI * 0.45, 0.1, 0]}>
      <ringGeometry args={[0.8, 1.3, 64]} />
      <meshBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Black Core ─── */
function BlackCore() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 0.6) * 0.05;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.85, 64, 64]} />
      <meshBasicMaterial color="#030108" />
    </mesh>
  );
}

/* ─── Event Horizon Glow ─── */
function EventHorizon() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.12;
      ref.current.scale.set(s, s, s);
      ref.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 0.7) * 0.15;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.0, 64, 64]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Swirling Dust Particles ─── */
function DustParticles({ count = 500 }) {
  const pointsRef = useRef();

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4;
      const height = (Math.random() - 0.5) * 1.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities.push({
        angle,
        radius,
        speed: 0.15 + Math.random() * 0.35,
        yOsc: Math.random() * 0.3,
        ySpeed: 0.5 + Math.random() * 1,
      });

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    return { positions, velocities, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      const currentAngle = v.angle + t * v.speed;
      // Slowly spiral inward
      const r = v.radius - ((t * 0.02) % v.radius) * 0.1;
      const actualR = Math.max(1.2, r);

      posArr[i * 3] = Math.cos(currentAngle) * actualR;
      posArr[i * 3 + 1] = Math.sin(t * v.ySpeed) * v.yOsc;
      posArr[i * 3 + 2] = Math.sin(currentAngle) * actualR;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} rotation={[Math.PI * 0.45, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c4b5fd"
        size={0.04}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Background Stars ─── */
function BackgroundStars({ count = 300 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e2d9f3"
        size={0.03}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Outer Glow Rings ─── */
function OuterRings() {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref1.current) {
      ref1.current.rotation.z = t * 0.05;
      ref1.current.material.opacity = 0.12 + Math.sin(t * 0.3) * 0.05;
    }
    if (ref2.current) {
      ref2.current.rotation.z = -t * 0.08;
      ref2.current.material.opacity = 0.08 + Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <>
      <mesh ref={ref1} rotation={[Math.PI * 0.45, 0.1, 0]}>
        <ringGeometry args={[3.4, 3.6, 128]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.12} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ref2} rotation={[Math.PI * 0.42, 0.15, 0]}>
        <ringGeometry args={[4.0, 4.15, 128]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

/* ─── Scene with mouse parallax ─── */
function BlackholeScene({ mousePos }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current && mousePos.current) {
      const targetX = mousePos.current.x * 0.3;
      const targetY = mousePos.current.y * 0.2;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <BackgroundStars />
      <OuterRings />
      <AccretionDisk />
      <InnerGlow />
      <EventHorizon />
      <BlackCore />
      <DustParticles />
    </group>
  );
}

/* ─── Main Export ─── */
export default function Blackhole3D() {
  const mousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div
      ref={containerRef}
      className="blackhole-3d-container"
    >
      <Canvas
        camera={{ position: [0, 0, isMobile ? 8 : 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <BlackholeScene mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
