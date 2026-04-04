/**
 * LogoItem.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single orbiting tech logo.
 *
 * Uses a react-icons Icon component (passed as prop) inside a glassmorphic
 * circular container. No CDN, no network — renders instantly and reliably.
 *
 * Features:
 *  - Glassmorphism circular card with brand-coloured border + glow
 *  - 3D perspective tilt on hover (rotateX / rotateY)
 *  - Scale pop + glow burst on hover
 *  - Depth-based opacity, scale, and blur for 3D orbital feel
 *  - Cursor-proximity magnetic offset (passed via props)
 *  - Floating sine-wave animation per logo
 *  - Tooltip label on hover
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';

function LogoItem({
  Icon,           // react-icons component
  label,          // e.g. "React"
  color,          // brand hex e.g. "#61DAFB"
  // Position from container center
  x,
  y,
  depth,          // [0=back, 1=front]
  baseScale,
  // Hover state
  isAnyHovered,
  isHovered,
  onHoverIn,
  onHoverOut,
  // Magnetic pull
  magnetX,
  magnetY,
  // Container size
  containerW,
  containerH,
}) {
  const divRef  = useRef(null);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 });
  const [floatY, setFloatY]   = useState(0);
  const floatRef              = useRef(Math.random() * Math.PI * 2); // random phase

  /* ── Floating sine animation (independent per logo) ──────────────────── */
  useEffect(() => {
    let rafId;
    const amp   = 5 + Math.random() * 4;        // 5–9 px
    const speed = 0.6 + Math.random() * 0.5;    // 0.6–1.1 Hz

    const animate = () => {
      floatRef.current += 0.016 * speed;         // ~60 fps
      setFloatY(Math.sin(floatRef.current) * amp);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* ── Mouse-move tilt ─────────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const relY = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    setTilt({ rx: -relY * 28, ry: relX * 28 });
  }, []);

  const handleLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    onHoverOut();
  }, [onHoverOut]);

  /* ── Sizing ──────────────────────────────────────────────────────────── */
  const BOX   = containerW < 320 ? 42 : containerW < 480 ? 50 : 58;
  const ICON  = Math.round(BOX * 0.50);

  /* ── Derived values ──────────────────────────────────────────────────── */
  const scale   = isHovered ? 1.55 : baseScale;
  const blur    = isHovered ? 0    : (1 - depth) * 1.5;
  const zIdx    = isHovered ? 100  : Math.round(depth * 40);
  const opacity = isHovered ? 1    : 0.55 + depth * 0.45;
  const dimmed  = isAnyHovered && !isHovered;

  // Final screen position
  const finalX  = containerW / 2 + x + (magnetX || 0);
  const finalY  = containerH / 2 + y + (magnetY || 0) + floatY;

  /* ── Color aliases ───────────────────────────────────────────────────── */
  const colFaint  = color + '30';
  const colMid    = color + '66';
  const colStrong = color + 'bb';

  return (
    <div
      ref={divRef}
      onMouseEnter={onHoverIn}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
      style={{
        position:   'absolute',
        left:        finalX,
        top:         finalY,
        width:       BOX,
        height:      BOX,
        transform: [
          'translate(-50%, -50%)',
          `scale(${scale})`,
          'perspective(800px)',
          `rotateX(${tilt.rx}deg)`,
          `rotateY(${tilt.ry}deg)`,
        ].join(' '),
        filter:    `blur(${blur}px)`,
        opacity:    dimmed ? opacity * 0.3 : opacity,
        zIndex:     zIdx,
        cursor:    'pointer',
        willChange:'transform, opacity, filter',
        transition: isHovered
          ? 'transform 0.22s cubic-bezier(.17,.67,.3,1.4), opacity 0.15s, filter 0.15s'
          : 'opacity 0.4s ease, filter 0.4s ease',
      }}
    >
      {/* ── Outer glow halo ─────────────────────────────────────────── */}
      <div style={{
        position:        'absolute',
        inset:           -BOX * 0.25,
        borderRadius:    '50%',
        background:      `radial-gradient(circle, ${isHovered ? color + '40' : color + '14'} 0%, transparent 70%)`,
        pointerEvents:   'none',
        transition:      'background 0.25s',
      }}/>

      {/* ── Glass circle ────────────────────────────────────────────── */}
      <div style={{
        width:           '100%',
        height:          '100%',
        borderRadius:    '50%',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        position:        'relative',
        overflow:        'hidden',
        // Glassmorphism
        background:      isHovered
          ? `radial-gradient(circle at 35% 35%, ${color}20, rgba(8,4,22,0.93))`
          : 'rgba(10,6,24,0.82)',
        backdropFilter:  'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:          `1.5px solid ${isHovered ? colMid : colFaint}`,
        boxShadow:       isHovered ? [
          `0 0 0 2px ${colFaint}`,
          `0 0 20px 5px ${color}44`,
          `0 0 50px 10px ${color}22`,
          `0 14px 40px rgba(0,0,0,0.65)`,
          `inset 0 1px 0 rgba(255,255,255,0.15)`,
        ].join(',') : [
          `0 0 10px 2px ${color}18`,
          `0 4px 18px rgba(0,0,0,0.45)`,
          `inset 0 1px 0 rgba(255,255,255,0.08)`,
        ].join(','),
        transition:      'all 0.25s ease',
      }}>
        {/* Top-left glass sheen */}
        <div style={{
          position:     'absolute',
          top: '-20%', left: '-20%',
          width: '55%', height: '55%',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(255,255,255,0.13), transparent 70%)',
          pointerEvents:'none',
        }}/>

        {/* React-icon — always renders, no network needed */}
        <Icon
          size={ICON}
          color={color}
          style={{
            display:    'block',
            flexShrink:  0,
            filter:      isHovered
              ? `drop-shadow(0 0 7px ${color})`
              : `drop-shadow(0 0 2px ${color}55)`,
            transition: 'filter 0.2s',
          }}
        />
      </div>

      {/* ── Tooltip (hover only) ─────────────────────────────────────── */}
      {isHovered && (
        <div style={{
          position:       'absolute',
          bottom:         `calc(100% + 10px)`,
          left:           '50%',
          transform:      'translateX(-50%)',
          background:     'rgba(8,4,22,0.95)',
          border:         `1px solid ${colMid}`,
          borderRadius:    8,
          padding:        '5px 11px',
          whiteSpace:     'nowrap',
          fontSize:        11,
          fontFamily:     'Syne, sans-serif',
          fontWeight:      700,
          letterSpacing:  '0.6px',
          color,
          boxShadow:      `0 4px 20px rgba(0,0,0,0.55), 0 0 12px ${color}22`,
          backdropFilter: 'blur(8px)',
          pointerEvents:  'none',
          zIndex:          200,
          animation:      'fadeUpIn 0.16s ease both',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

export default memo(LogoItem);
