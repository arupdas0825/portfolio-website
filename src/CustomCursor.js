import React, { useEffect, useRef } from 'react';
import './customCursor.css';

const CustomCursor = () => {
  const mainCursor = useRef(null);
  const particlesContainer = useRef(null);

  // Mutable state for high performance
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursor = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const isBlackhole = useRef(false);
  const hoverTarget = useRef(null);

  // Particle System Optimization
  const PARTICLE_COUNT = 25; // max 25 particles
  const particles = useRef([]);
  const activeParticles = useRef([]);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    // 1. Initialize DOM nodes for Particle Pool
    if (particlesContainer.current && particles.current.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'cursor-particle';
        p.style.opacity = '0'; // hide
        particlesContainer.current.appendChild(p);
        
        particles.current.push({
          element: p,
          active: false,
          x: 0, 
          y: 0, 
          vx: 0, 
          vy: 0,
          life: 0,
          maxLife: 400 + Math.random() * 200 // 400ms to 600ms lifetime
        });
      }
    }

    // 2. Event Listeners
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Throttle particle spawning
      const now = performance.now();
      if (now - lastParticleTime.current > 30) {
        spawnParticle(e.clientX, e.clientY);
        lastParticleTime.current = now;
      }
    };

    const handleMouseOver = (e) => {
      const blackhole = e.target.closest('.bh-anchor, .project-card');
      if (blackhole) {
        isBlackhole.current = true;
        hoverTarget.current = blackhole;
      }
    };

    const handleMouseOut = (e) => {
      const blackhole = e.target.closest('.bh-anchor, .project-card');
      if (blackhole) {
        isBlackhole.current = false;
        hoverTarget.current = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // 3. Render Loop (requestAnimationFrame)
    let animationFrameId;
    let lastTime = performance.now();

    const render = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      // Calculate smooth velocity for scaling
      const dx = targetX - cursor.current.x;
      const dy = targetY - cursor.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      // Blackhole Gravity pull logic
      if (isBlackhole.current && hoverTarget.current) {
        const rect = hoverTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const strength = 0.4;
        targetX = targetX + (centerX - targetX) * strength;
        targetY = targetY + (centerY - targetY) * strength;
      }

      // Cursor LERP
      cursor.current.x += (targetX - cursor.current.x) * 0.15;
      cursor.current.y += (targetY - cursor.current.y) * 0.15;

      if (mainCursor.current) {
        // Subtle scale elongation based on velocity
        const scale = 1 - Math.min(velocity * 0.002, 0.3);

        mainCursor.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) scale(${scale})`;

        if (isBlackhole.current) {
          mainCursor.current.classList.add('cursor-blackhole');
        } else {
          mainCursor.current.classList.remove('cursor-blackhole');
        }
      }

      updateParticles(dt);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // 4. Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const spawnParticle = (x, y) => {
    const pIndex = particles.current.findIndex((p) => !p.active);
    if (pIndex === -1) return; 

    const p = particles.current[pIndex];
    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = (Math.random() - 0.5) * 1.5; 
    p.vy = (Math.random() - 0.5) * 1.5; 
    p.life = p.maxLife;

    p.element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
    p.element.style.opacity = '0.7';

    activeParticles.current.push(p);
  };

  const updateParticles = (dt) => {
    for (let i = activeParticles.current.length - 1; i >= 0; i--) {
      const p = activeParticles.current[i];
      p.life -= dt;

      if (p.life <= 0) {
        p.active = false;
        p.element.style.opacity = '0';
        activeParticles.current.splice(i, 1);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (isBlackhole.current && hoverTarget.current) {
        const rect = hoverTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        p.x += (centerX - p.x) * 0.05;
        p.y += (centerY - p.y) * 0.05;
      }

      const progress = 1 - (p.life / p.maxLife);
      const opacity = (1 - progress) * 0.7;
      const scale = 1 - (progress * 0.5); 

      p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${scale})`;
      p.element.style.opacity = opacity.toString();
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
