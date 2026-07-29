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
    const layers = [[], [], []];

    const isMobile = window.innerWidth < 768;
    const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isMobile;
    const count = isLowEnd ? 40 : 110;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();

    // Create particle layers with fixed alpha per layer for 0 fillStyle mutations in render loop
    for (let i = 0; i < count; i++) {
      const layerIdx = i < count * 0.5 ? 0 : i < count * 0.8 ? 1 : 2;
      const size = layerIdx === 0 ? Math.random() * 1.2 + 0.5
                 : layerIdx === 1 ? Math.random() * 1.8 + 1.2
                 : Math.random() * 2.5 + 2.0;

      const speed = layerIdx === 0 ? Math.random() * 0.3 + 0.15
                  : layerIdx === 1 ? Math.random() * 0.6 + 0.35
                  : Math.random() * 1.1 + 0.7;

      layers[layerIdx].push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speed,
      });
    }

    const layerStyles = [
      'rgba(139, 92, 246, 0.14)',
      'rgba(139, 92, 246, 0.22)',
      'rgba(139, 92, 246, 0.32)'
    ];

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

      // Render 3 batched draw calls per frame
      for (let l = 0; l < 3; l++) {
        const group = layers[l];
        ctx.fillStyle = layerStyles[l];
        ctx.beginPath();
        for (let i = 0; i < group.length; i++) {
          const p = group[i];
          p.y -= p.speed * 0.45 * dt;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
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
