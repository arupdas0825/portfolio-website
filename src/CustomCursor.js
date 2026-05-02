import React, { useEffect, useRef } from 'react';
import './customCursor.css';

const CustomCursor = () => {
  const mainCursor = useRef(null);
  const particlesContainer = useRef(null);

  // Safe initial values — don't read window at module/component init
  const mouse  = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  const isBlackhole = useRef(false);
  const hoverTarget = useRef(null);

  const PARTICLE_COUNT = 25;
  const particles = useRef([]);
  const activeParticles = useRef([]);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    // Safe: now inside useEffect (browser env guaranteed)
    mouse.current  = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    cursor.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (particlesContainer.current && particles.current.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'cursor-particle';
        p.style.opacity = '0';
        particlesContainer.current.appendChild(p);
        particles.current.push({
          element: p, active: false,
          x: 0, y: 0, vx: 0, vy: 0,
          life: 0,
          maxLife: 400 + Math.random() * 200,
        });
      }
    }

    const onMouseMove = e => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const now = performance.now();
      if (now - lastParticleTime.current > 30) {
        spawnParticle(e.clientX, e.clientY);
        lastParticleTime.current = now;
      }
    };

    const handleMouseOver = e => {
      const el = e.target.closest('.bh-anchor, .project-card');
      if (el) { isBlackhole.current = true; hoverTarget.current = el; }
    };

    const handleMouseOut = e => {
      const el = e.target.closest('.bh-anchor, .project-card');
      if (el) { isBlackhole.current = false; hoverTarget.current = null; }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout',  handleMouseOut,  { passive: true });

    let animId, lastTime = performance.now();

    const render = time => {
      const dt = time - lastTime;
      lastTime = time;

      let tx = mouse.current.x;
      let ty = mouse.current.y;

      const dx = tx - cursor.current.x;
      const dy = ty - cursor.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      if (isBlackhole.current && hoverTarget.current) {
        const rect = hoverTarget.current.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        tx = tx + (cx - tx) * 0.4;
        ty = ty + (cy - ty) * 0.4;
      }

      cursor.current.x += (tx - cursor.current.x) * 0.15;
      cursor.current.y += (ty - cursor.current.y) * 0.15;

      if (mainCursor.current) {
        const scale = 1 - Math.min(velocity * 0.002, 0.3);
        mainCursor.current.style.transform =
          `translate3d(${cursor.current.x}px,${cursor.current.y}px,0) scale(${scale})`;
        mainCursor.current.classList.toggle('cursor-blackhole', isBlackhole.current);
      }

      updateParticles(dt);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout',  handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  const spawnParticle = x => {
    const idx = particles.current.findIndex(p => !p.active);
    if (idx === -1) return;
    const p = particles.current[idx];
    p.active = true; p.x = x; p.y = mouse.current.y;
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = (Math.random() - 0.5) * 1.5;
    p.life = p.maxLife;
    p.element.style.transform = `translate3d(${x}px,${mouse.current.y}px,0) scale(1)`;
    p.element.style.opacity = '0.7';
    activeParticles.current.push(p);
  };

  const updateParticles = dt => {
    for (let i = activeParticles.current.length - 1; i >= 0; i--) {
      const p = activeParticles.current[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.element.style.opacity = '0';
        activeParticles.current.splice(i, 1);
        continue;
      }
      p.x += p.vx; p.y += p.vy;
      if (isBlackhole.current && hoverTarget.current) {
        const rect = hoverTarget.current.getBoundingClientRect();
        p.x += (rect.left + rect.width  / 2 - p.x) * 0.05;
        p.y += (rect.top  + rect.height / 2 - p.y) * 0.05;
      }
      const prog = 1 - p.life / p.maxLife;
      p.element.style.transform = `translate3d(${p.x}px,${p.y}px,0) scale(${1 - prog * 0.5})`;
      p.element.style.opacity = ((1 - prog) * 0.7).toString();
    }
  };

  return (
    <>
      <div id="cursor-particles" ref={particlesContainer} />
      <div id="main-cursor" ref={mainCursor} />
    </>
  );
};

export default CustomCursor;