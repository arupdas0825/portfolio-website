/**
 * CustomCursor.js — Optimized Particle Trail
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ Native OS cursor fully RESTORED
 * ✅ Particle trail emitted ONLY on mouse movement
 * ✅ Idle RAF loop when inactive (0% idle CPU overhead)
 * ✅ Max 35 particles in object pool
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef } from 'react';
import './customCursor.css';

const MAX_PARTICLES = 35;
const SPAWN_INTERVAL_MS = 25;
const PARTICLE_LIFETIME_MS = 650;

const CursorParticles = () => {
  const containerRef  = useRef(null);
  const pool          = useRef([]);
  const active        = useRef([]);
  const mousePos      = useRef({ x: -999, y: -999 });
  const lastMousePos  = useRef({ x: -999, y: -999 });
  const lastSpawnTime = useRef(0);
  const animId        = useRef(null);
  const isRunning     = useRef(false);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* Build DOM particle pool */
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-particle';
      dot.style.cssText = 'opacity:0;width:0;height:0;';
      el.appendChild(dot);
      pool.current.push({ el: dot, alive: false });
    }

    const startLoop = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        lastFrameTime.current = performance.now();
        animId.current = requestAnimationFrame(tick);
      }
    };

    /* Mouse move listener */
    const onMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      startLoop();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    /* RAF render loop */
    const tick = (now) => {
      if (document.hidden) {
        animId.current = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(now - lastFrameTime.current, 100);
      lastFrameTime.current = now;

      // Check mouse movement delta
      const mdx = mousePos.current.x - lastMousePos.current.x;
      const mdy = mousePos.current.y - lastMousePos.current.y;
      const moved = (mdx * mdx + mdy * mdy) > 9;

      /* Spawn only if mouse is actively moving */
      if (moved && (now - lastSpawnTime.current > SPAWN_INTERVAL_MS) && mousePos.current.x !== -999) {
        lastSpawnTime.current = now;
        lastMousePos.current.x = mousePos.current.x;
        lastMousePos.current.y = mousePos.current.y;
        spawnParticle(mousePos.current.x, mousePos.current.y);
      }

      /* Update active particles */
      for (let i = active.current.length - 1; i >= 0; i--) {
        const p = active.current[i];
        p.elapsed += dt;

        if (p.elapsed >= PARTICLE_LIFETIME_MS) {
          p.alive = false;
          p.el.style.opacity = '0';
          active.current.splice(i, 1);
          continue;
        }

        const t = p.elapsed / PARTICLE_LIFETIME_MS;
        const ease = 1 - t * t;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        const scale = (1 - t) * p.sizeScale;

        p.el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) scale(${scale.toFixed(2)})`;
        p.el.style.opacity = (ease * 0.75).toFixed(2);
      }

      // Idle loop when no active particles and mouse is not moving
      if (active.current.length === 0 && !moved) {
        isRunning.current = false;
        animId.current = null;
        return;
      }

      animId.current = requestAnimationFrame(tick);
    };

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (animId.current) cancelAnimationFrame(animId.current);
    };
  }, []);

  const spawnParticle = (x, y) => {
    const slot = pool.current.find(p => !p.alive);
    if (!slot) return;

    slot.alive   = true;
    slot.elapsed = 0;

    const angle   = Math.random() * Math.PI * 2;
    const speed   = 0.6 + Math.random() * 1.0;
    slot.vx       = Math.cos(angle) * speed;
    slot.vy       = Math.sin(angle) * speed + 0.3;

    const size    = 3 + Math.random() * 3;
    slot.sizeScale = 1;

    slot.x = x;
    slot.y = y;

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