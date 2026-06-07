import React, { useEffect, useRef, useState } from 'react';

export default function Starfield() {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Generate particles: 120-150 on Desktop, 40-60 on Mobile
    const count = isMobile ? 50 : 135;
    const particles = [];
    const container = containerRef.current;
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      
      const layer = i < count * 0.5 ? 0 : i < count * 0.8 ? 1 : 2;
      
      const size = layer === 0 ? Math.random() * 1.5 + 0.5
                 : layer === 1 ? Math.random() * 2.0 + 1.5
                 : Math.random() * 3.0 + 3.0;

      const opacity = layer === 0 ? Math.random() * 0.15 + 0.1
                    : layer === 1 ? Math.random() * 0.25 + 0.15
                    : Math.random() * 0.35 + 0.2;

      // Vertical drift speed
      const speed = layer === 0 ? Math.random() * 0.4 + 0.2
                  : layer === 1 ? Math.random() * 0.8 + 0.5
                  : Math.random() * 1.5 + 1.0;

      const x = Math.random() * 100; // vw
      const startY = Math.random() * 100; // vh

      el.style.position = 'absolute';
      el.style.left = `${x}vw`;
      el.style.top = '0px';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundColor = 'var(--theme-primary)';
      el.style.borderRadius = '50%';
      el.style.opacity = opacity;
      el.style.willChange = 'transform';
      
      // Initial transform
      el.style.transform = `translate3d(0, ${startY}vh, 0)`;

      container.appendChild(el);

      particles.push({
        el,
        y: startY,
        speed,
      });
    }

    particlesRef.current = particles;

    let lastTime = performance.now();

    const animate = (time) => {
      // Calculate delta to maintain speed across different refresh rates
      const delta = (time - lastTime) / 16.66;
      lastTime = time;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed * 0.05 * delta; 
        
        // Wrap around when floating past top
        if (p.y < -10) {
          p.y = 110;
        }
        p.el.style.transform = `translate3d(0, ${p.y}vh, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: '-10vh -10vw',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} 
    />
  );
}
