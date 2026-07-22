import React, { useEffect, useRef } from 'react';

const Starfield = React.memo(function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let particles = [];

    const isMobile = window.innerWidth < 768;
    const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isMobile;
    const count = isLowEnd ? 40 : 110;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    // Create particle array
    for (let i = 0; i < count; i++) {
      const layer = i < count * 0.5 ? 0 : i < count * 0.8 ? 1 : 2;
      const size = layer === 0 ? Math.random() * 1.2 + 0.5
                 : layer === 1 ? Math.random() * 1.8 + 1.2
                 : Math.random() * 2.5 + 2.0;

      const alpha = layer === 0 ? Math.random() * 0.12 + 0.08
                  : layer === 1 ? Math.random() * 0.22 + 0.12
                  : Math.random() * 0.32 + 0.18;

      const speed = layer === 0 ? Math.random() * 0.3 + 0.15
                  : layer === 1 ? Math.random() * 0.6 + 0.35
                  : Math.random() * 1.1 + 0.7;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        alpha,
        speed,
      });
    }

    window.addEventListener('resize', resize, { passive: true });

    let lastTime = performance.now();

    const render = (time) => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 16.66, 3);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Primary color: rgba(139, 92, 246)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed * 0.45 * dt;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
});

export default Starfield;
