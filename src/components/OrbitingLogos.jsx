/**
 * OrbitingLogos.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Circular orbital system — uses react-icons (already installed) for 100%
 * reliable logo rendering with zero network dependency.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useRef, useCallback, useMemo, useEffect,
} from 'react';
import {
  FaReact, FaJsSquare, FaNodeJs, FaAws, FaGitAlt,
  FaHtml5, FaCss3Alt, FaJava, FaPython,
} from 'react-icons/fa';
import {
  SiFirebase, SiTypescript, SiMongodb,
} from 'react-icons/si';
import LogoItem from './LogoItem';
import { orbitPosition, lerp, dist2D, clamp } from '../utils/mathHelpers';

/* ── Tech manifest — react-icons, brand colors ───────────────────────────── */
const TECHS = [
  { Icon: FaReact,      label: 'React',      color: '#61DAFB' },
  { Icon: FaJsSquare,   label: 'JavaScript', color: '#F7DF1E' },
  { Icon: FaHtml5,      label: 'HTML5',      color: '#E34F26' },
  { Icon: FaCss3Alt,    label: 'CSS3',       color: '#1572B6' },
  { Icon: FaPython,     label: 'Python',     color: '#4B8BBE' },
  { Icon: FaNodeJs,     label: 'Node.js',    color: '#6DA55F' },
  { Icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
  { Icon: SiFirebase,   label: 'Firebase',   color: '#FFCA28' },
  { Icon: FaAws,        label: 'AWS',        color: '#FF9900' },
  { Icon: FaGitAlt,     label: 'Git',        color: '#F05032' },
  { Icon: SiMongodb,    label: 'MongoDB',    color: '#47A248' },
  { Icon: FaJava,       label: 'Java',       color: '#ED8B00' },
];

const ORBIT_SPEED_NORMAL = 0.30;
const ORBIT_SPEED_HOVER  = 0.03;
const MAGNET_RADIUS      = 110;
const MAGNET_STRENGTH    = 14;

export default function OrbitingLogos({
  containerW,
  containerH,
  mouseX,
  mouseY,
  isMobile,
}) {
  const RX = containerW * 0.44;
  const RY = containerH * 0.38;

  const techs = isMobile ? TECHS.slice(0, 8) : TECHS;
  const N     = techs.length;

  const angleRef        = useRef(0);
  const targetSpeedRef  = useRef(ORBIT_SPEED_NORMAL);
  const currentSpeedRef = useRef(ORBIT_SPEED_NORMAL);
  const prevTimeRef     = useRef(null);
  const rafRef          = useRef(null);

  const baseAngles = useMemo(
    () => techs.map((_, i) => (i / N) * Math.PI * 2),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [N]
  );

  const [positions, setPositions] = useState(() =>
    techs.map((_, i) => orbitPosition(baseAngles[i], RX, RY))
  );

  // ── FIX: when isMobile flips, techs.length changes (12 ↔ 8).
  // Reset positions immediately so sortedIndices never exceeds techs.length.
  const prevTechsLenRef = useRef(N);
  if (prevTechsLenRef.current !== N) {
    prevTechsLenRef.current = N;
    // Synchronous state reset during render — safe in React when guarded by ref
    setPositions(techs.map((_, i) => orbitPosition(baseAngles[i], RX, RY)));
  }

  const [hoveredIdx, setHoveredIdx] = useState(null);

  /* ── RAF loop ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const step = (timestamp) => {
      if (prevTimeRef.current === null) prevTimeRef.current = timestamp;
      const dt = Math.min((timestamp - prevTimeRef.current) / 1000, 0.1);
      prevTimeRef.current = timestamp;

      // Smooth speed transition
      currentSpeedRef.current = lerp(
        currentSpeedRef.current,
        targetSpeedRef.current,
        0.06
      );
      angleRef.current += currentSpeedRef.current * dt;

      setPositions(baseAngles.map((base) =>
        orbitPosition(base + angleRef.current, RX, RY)
      ));

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [baseAngles, RX, RY]);

  /* ── Hover → slow orbit ─────────────────────────────────────────────── */
  useEffect(() => {
    targetSpeedRef.current = hoveredIdx !== null
      ? ORBIT_SPEED_HOVER
      : ORBIT_SPEED_NORMAL;
  }, [hoveredIdx]);

  /* ── Magnetic pull ──────────────────────────────────────────────────── */
  const magnetOffsets = useMemo(() => {
    if (mouseX === null || mouseY === null) {
      return techs.map(() => ({ mx: 0, my: 0 }));
    }
    return positions.map((pos) => {
      const logoX = containerW / 2 + pos.x;
      const logoY = containerH / 2 + pos.y;
      const d     = dist2D(logoX, logoY, mouseX, mouseY);
      if (d > MAGNET_RADIUS || d < 1) return { mx: 0, my: 0 };
      const strength = clamp(1 - d / MAGNET_RADIUS, 0, 1) * MAGNET_STRENGTH;
      const dx = mouseX - logoX;
      const dy = mouseY - logoY;
      const len = Math.sqrt(dx * dx + dy * dy);
      return { mx: (dx / len) * strength, my: (dy / len) * strength };
    });
  }, [positions, mouseX, mouseY, containerW, containerH, techs]);

  const handleHoverIn  = useCallback((i) => setHoveredIdx(i), []);
  const handleHoverOut = useCallback(() => setHoveredIdx(null), []);

  // Sort by depth: back logos render first (under front logos)
  // SAFETY: bound to techs.length — positions may briefly be stale when isMobile flips
  const safeLen = Math.min(positions.length, N);
  const sortedIndices = useMemo(
    () =>
      Array.from({ length: safeLen }, (_, i) => i)
        .sort((a, b) => (positions[a]?.depth ?? 0) - (positions[b]?.depth ?? 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positions, safeLen]
  );

  return (
    <>
      {sortedIndices.map((i) => {
        // Guard: skip if either array is transiently out of sync
        const tech = techs[i];
        const pos  = positions[i];
        const mag  = magnetOffsets[i];
        if (!tech || !pos || !mag) return null;

        return (
          <LogoItem
            key={tech.label}
            Icon={tech.Icon}
            label={tech.label}
            color={tech.color}
            x={pos.x}
            y={pos.y}
            depth={pos.depth}
            baseScale={pos.scale}
            isAnyHovered={hoveredIdx !== null}
            isHovered={hoveredIdx === i}
            onHoverIn={() => handleHoverIn(i)}
            onHoverOut={handleHoverOut}
            magnetX={mag.mx}
            magnetY={mag.my}
            containerW={containerW}
            containerH={containerH}
          />
        );
      })}
    </>
  );
}
