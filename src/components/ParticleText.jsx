import React, { useRef, useEffect } from 'react';

const ParticleText = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let particlesArray = [];
    let particlesByColor = {};
    let animationFrameId;
    let isVisible = true;

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 1.3;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 22 + 8;
      }

      update() {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = mouse.current.radius;
        const maxDistSq = maxDist * maxDist;

        if (distSq < maxDistSq) {
          const distance = Math.sqrt(distSq) || 1;
          const force = (maxDist - distance) / maxDist;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (Math.abs(this.x - this.baseX) > 0.05) {
            this.x -= (this.x - this.baseX) * 0.12;
          } else {
            this.x = this.baseX;
          }
          if (Math.abs(this.y - this.baseY) > 0.05) {
            this.y -= (this.y - this.baseY) * 0.12;
          } else {
            this.y = this.baseY;
          }
        }
      }
    }

    function init() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width) || 700;
      const height = Math.floor(rect.height) || 170;
      if (width <= 0 || height <= 0) return;

      const isSmall = width < 540;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      particlesArray = [];
      particlesByColor = {};

      const lines = ["Hi, I'm Arup", "Das"];
      let fontSize = isSmall ? Math.min(width * 0.12, 42) : Math.min(width * 0.11, 64);
      fontSize = Math.max(fontSize, 28);

      ctx.font = `800 ${fontSize}px "Syne", "Outfit", "Inter", sans-serif`;

      while (ctx.measureText("Hi, I'm Arup").width > width - 20 && fontSize > 22) {
        fontSize -= 2;
        ctx.font = `800 ${fontSize}px "Syne", "Outfit", "Inter", sans-serif`;
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0.0, "#ffffff");
      gradient.addColorStop(0.25, "#e0f2fe");
      gradient.addColorStop(0.65, "#38bdf8");
      gradient.addColorStop(1.0, "#c084fc");
      ctx.fillStyle = gradient;

      const lineHeight = fontSize * 1.12;
      const totalHeight = lines.length * lineHeight;
      const startY = Math.max(4, (height - totalHeight) / 2);

      lines.forEach((line, index) => {
        ctx.fillText(line, 0, startY + index * lineHeight);
      });

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, width, height);

      const imgW = textCoordinates.width;
      const imgH = textCoordinates.height;
      const imgData = textCoordinates.data;
      const step = isSmall ? 1.5 : 1.3;
      const stepPx = Math.max(1, Math.round(step * dpr));

      for (let y = 0; y < imgH; y += stepPx) {
        for (let x = 0; x < imgW; x += stepPx) {
          const alphaIndex = (y * imgW + x) * 4 + 3;
          if (imgData[alphaIndex] > 60) {
            const r = imgData[alphaIndex - 3];
            const g = imgData[alphaIndex - 2];
            const b = imgData[alphaIndex - 1];
            const color = `rgb(${r},${g},${b})`;
            const p = new Particle(x / dpr, y / dpr, color);
            particlesArray.push(p);
            if (!particlesByColor[color]) {
              particlesByColor[color] = [];
            }
            particlesByColor[color].push(p);
          }
        }
      }
    }

    function animate() {
      if (!ctx || !isVisible || document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width || 700;
      const height = rect.height || 170;

      ctx.clearRect(0, 0, width, height);

      for (const color in particlesByColor) {
        const group = particlesByColor[color];
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < group.length; i++) {
          const p = group[i];
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          p.update();
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Observer to re-run init when container resizes or becomes visible
    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && particlesArray.length === 0) {
        init();
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    const updateMousePos = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = clientX - rect.left;
      mouse.current.y = clientY - rect.top;
    };

    const handleMouseMove = (e) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', init, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => init());
    } else {
      init();
    }

    // Retry init after 400ms to guarantee layout post intro screen
    const timer = setTimeout(() => {
      if (particlesArray.length === 0) {
        init();
      }
    }, 400);

    animate();

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-name-particle-container">
      <h1 className="sr-only">Hi, I'm Arup Das</h1>
      <canvas ref={canvasRef} className="hero-name-particle-canvas" />
    </div>
  );
};

export default ParticleText;
