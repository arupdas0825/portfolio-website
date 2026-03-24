import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  FaReact, FaJsSquare, FaAws, FaGithub, FaHtml5, FaCss3Alt,
  FaJava, FaPython, FaNodeJs,
} from 'react-icons/fa';
import {
  SiTypescript, SiFirebase, SiVite,
} from 'react-icons/si';

const ICONS = [
  { Icon: FaReact, label: 'React', color: '#61DAFB' },
  { Icon: FaJsSquare, label: 'JavaScript', color: '#F7DF1E' },
  { Icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
  { Icon: SiFirebase, label: 'Firebase', color: '#FFCA28' },
  { Icon: FaAws, label: 'AWS', color: '#FF9900' },
  { Icon: FaGithub, label: 'GitHub', color: '#E6EDF3' },
  { Icon: FaJava, label: 'Java', color: '#ED8B00' },
  { Icon: FaPython, label: 'Python', color: '#3776AB' },
  { Icon: FaNodeJs, label: 'Node.js', color: '#339933' },
  { Icon: SiVite, label: 'Vite', color: '#646CFF' },
  { Icon: FaHtml5, label: 'HTML', color: '#E34F26' },
  { Icon: FaCss3Alt, label: 'CSS', color: '#1572B6' },
];

// Orbital configs — staggered radii, speeds, and start angles for natural motion
const ORBIT_CONFIG = ICONS.map((_, i) => {
  const count = ICONS.length;
  const angle = (360 / count) * i;
  const radiusBase = 130 + (i % 3) * 30;
  return {
    rx: radiusBase + Math.sin(i * 1.3) * 20,
    ry: radiusBase * 0.75 + Math.cos(i * 0.9) * 15,
    speed: 18 + (i % 4) * 4 + Math.random() * 3,
    startAngle: angle,
    floatAmp: 4 + Math.random() * 6, // vertical float amplitude
    floatSpeed: 0.8 + Math.random() * 0.6,
    depthPhase: (i / count) * Math.PI * 2,
    zLayer: i % 3, // 0=near, 1=mid, 2=far
  };
});

function generateKeyframes(cfg) {
  const steps = 12;
  const kf = { x: [], y: [], scale: [], filter: [] };
  for (let i = 0; i <= steps; i++) {
    const angle = ((cfg.startAngle + (360 * i) / steps) * Math.PI) / 180;
    kf.x.push(Math.cos(angle) * cfg.rx);
    kf.y.push(Math.sin(angle) * cfg.ry);

    // Depth simulation based on angle position
    const depth = Math.sin(angle + cfg.depthPhase);
    const baseScale = cfg.zLayer === 0 ? 1.1 : cfg.zLayer === 1 ? 0.9 : 0.72;
    const s = baseScale + depth * 0.15;
    kf.scale.push(s);
    const blur = depth < -0.4 ? `blur(${Math.abs(depth) * 1.8}px)` : 'blur(0px)';
    kf.filter.push(blur);
  }
  return kf;
}

function FloatingIcon({ Icon, label, color, config, index }) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef(null);

  // Spring-based magnetic values
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 200, damping: 20 });
  const springY = useSpring(magnetY, { stiffness: 200, damping: 20 });

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const kf = generateKeyframes(config);

  const handleMouseMove = useCallback((e) => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    // 3D tilt
    setTilt({ rotateX: -dy * 28, rotateY: dx * 28 });

    // Magnetic pull toward cursor
    magnetX.set(dx * 12);
    magnetY.set(dy * 12);
  }, [magnetX, magnetY]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    magnetX.set(0);
    magnetY.set(0);
  }, [magnetX, magnetY]);

  const floatY = {
    y: [0, -config.floatAmp, 0, config.floatAmp, 0],
  };

  return (
    <motion.div
      ref={iconRef}
      className="floating-icon"
      animate={{
        x: kf.x,
        y: kf.y,
        scale: hovered ? 1.4 : kf.scale,
        filter: hovered ? 'blur(0px)' : kf.filter,
      }}
      transition={{
        x: { duration: config.speed, repeat: Infinity, ease: 'linear' },
        y: { duration: config.speed, repeat: Infinity, ease: 'linear' },
        scale: hovered
          ? { duration: 0.35, ease: 'easeOut' }
          : { duration: config.speed, repeat: Infinity, ease: 'linear' },
        filter: hovered
          ? { duration: 0.2 }
          : { duration: config.speed, repeat: Infinity, ease: 'linear' },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: hovered ? 30 : 20 - config.zLayer * 5,
        x: springX,
        y: springY,
      }}
    >
      {/* Float overlay animation */}
      <motion.div
        animate={floatY}
        transition={{
          y: { duration: config.floatSpeed * 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div
          className="floating-icon-inner"
          style={{
            transform: `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            boxShadow: hovered
              ? `0 0 30px ${color}88, 0 0 60px ${color}44, 0 0 90px ${color}22, 0 10px 40px rgba(0,0,0,0.5)`
              : `0 0 12px ${color}22, 0 4px 16px rgba(0,0,0,0.3)`,
            borderColor: hovered ? color : `${color}44`,
            background: hovered
              ? `rgba(20, 14, 38, 0.95)`
              : `rgba(20, 14, 38, 0.75)`,
          }}
        >
          <Icon size={hovered ? 30 : 26} color={color} style={{ transition: 'all 0.3s ease' }} />
          {hovered && (
            <motion.span
              className="floating-icon-label"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color }}
            >
              {label}
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingTechIcons() {
  const [isMobile, setIsMobile] = useState(false);
  const blackholeRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mouse parallax for the blackhole
  useEffect(() => {
    const handleMouse = (e) => {
      if (!blackholeRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy;
      blackholeRef.current.style.transform =
        `translate(-50%, -50%) translate(${dx * 6}px, ${dy * 4}px)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Show fewer icons on mobile
  const visibleIcons = isMobile ? ICONS.slice(0, 8) : ICONS;

  return (
    <div className="floating-tech-container">
      {/* ── Realistic Blackhole at orbit center ── */}
      <div className="bh-anchor" ref={blackholeRef}>
        {/* Gravitational lensing ring — faint distortion halo */}
        <div className="bh-lensing" />
        {/* Accretion disk — thin glowing ring */}
        <div className="bh-accretion" />
        <div className="bh-accretion bh-accretion-inner" />
        {/* Event horizon — dark core */}
        <div className="bh-core" />
        {/* Soft bloom halo */}
        <div className="bh-bloom" />
      </div>

      {/* Icons — UNCHANGED */}
      {visibleIcons.map((icon, i) => (
        <FloatingIcon
          key={icon.label}
          Icon={icon.Icon}
          label={icon.label}
          color={icon.color}
          config={ORBIT_CONFIG[i]}
          index={i}
        />
      ))}
    </div>
  );
}
