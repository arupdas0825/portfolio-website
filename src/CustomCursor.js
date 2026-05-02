/**
 * CustomCursor.js — Particle Trail Only
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ Native OS cursor fully RESTORED (no cursor:none anywhere)
 * ✅ Subtle purple/cyan particle trail emitted on mouse movement
 * ✅ Single RAF loop — properly cleaned up on unmount
 * ✅ Max 45 particles on screen at any time
 * ✅ Only rendered on desktop (IS_TOUCH guard in App.js)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef } from 'react';
import './customCursor.css';

const MAX_PARTICLES = 45;
const SPAWN_INTERVAL_MS = 28;   // emit one particle every 28ms of movement
const PARTICLE_LIFETIME_MS = 700; // ms before fully faded

const CursorParticles = () => {
  const containerRef      = useRef(null);
  const pool              = useRef([]);        // all DOM particle elements
  const active            = useRef([]);        // currently animating particles
  const mousePos          = useRef({ x: -999, y: -999 });
  const lastSpawnTime     = useRef(0);
  const animId            = useRef(null);
  const lastFrameTime     = useRef(performance.now());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* ── Build DOM particle pool ── */
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-particle';
      dot.style.cssText = 'opacity:0;width:0;height:0;';
      el.appendChild(dot);
      pool.current.push({ el: dot, alive: false });
    }

    /* ── Mouse listener ── */
    const onMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    /* ── RAF render loop ── */
    const tick = (now) => {
      const dt = now - lastFrameTime.current;
      lastFrameTime.current = now;

      /* Spawn */
      if (now - lastSpawnTime.current > SPAWN_INTERVAL_MS && mousePos.current.x !== -999) {
        lastSpawnTime.current = now;
        spawnParticle(mousePos.current.x, mousePos.current.y);
      }

      /* Update active particles */
      for (let i = active.current.length - 1; i >= 0; i--) {
        const p = active.current[i];
        p.elapsed += dt;

        if (p.elapsed >= PARTICLE_LIFETIME_MS) {
          /* Retire */
          p.alive = false;
          p.el.style.opacity = '0';
          active.current.splice(i, 1);
          continue;
        }

        /* Progress 0→1 */
        const t    = p.elapsed / PARTICLE_LIFETIME_MS;
        const ease = 1 - Math.pow(t, 2);   // quadratic ease-out opacity

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;   // friction
        p.vy *= 0.96;

        const scale = (1 - t) * p.sizeScale;

        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) scale(${scale.toFixed(3)})`;
        p.el.style.opacity   = (ease * 0.75).toFixed(3);
      }

      animId.current = requestAnimationFrame(tick);
    };

    animId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  /* ── Spawn helper ── */
  const spawnParticle = (x, y) => {
    const slot = pool.current.find(p => !p.alive);
    if (!slot) return;  // pool full — skip

    slot.alive   = true;
    slot.elapsed = 0;

    /* Random ejection direction — slight bias downward for trail feel */
    const angle   = Math.random() * Math.PI * 2;
    const speed   = 0.6 + Math.random() * 1.0;
    slot.vx        = Math.cos(angle) * speed;
    slot.vy        = Math.sin(angle) * speed + 0.3; // gentle gravity drift

    /* Random size 3–6 px */
    const size    = 3 + Math.random() * 3;
    slot.sizeScale = 1;

    slot.x = x;
    slot.y = y;

    /* Position relative to fixed container (top-left origin) */
    slot.el.style.width     = `${size}px`;
    slot.el.style.height    = `${size}px`;
    slot.el.style.marginLeft = `-${size / 2}px`;
    slot.el.style.marginTop  = `-${size / 2}px`;
    slot.el.style.transform  = `translate3d(${x}px,${y}px,0) scale(1)`;
    slot.el.style.opacity    = '0.75';

    active.current.push(slot);
  };

  return <div id="cursor-particles" ref={containerRef} aria-hidden="true" />;
};

export default CursorParticles;