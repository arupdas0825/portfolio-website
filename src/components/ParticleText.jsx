import React, { useRef, useEffect } from 'react';

const ParticleText = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, radius: 130 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let particlesArray = [];
    let animationFrameId;

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 1.25;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 25 + 8;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        let dx = mouse.current.x - this.x;
        let dy = mouse.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / (distance || 1);
        let forceDirectionY = dy / (distance || 1);
        let maxDistance = mouse.current.radius;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;

        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    function init() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const width = rect.width || 700;
      const height = rect.height || 170;
      const isSmall = width < 540;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      particlesArray = [];

      // 2-line layout matching original large Hero typography
      const lines = ["Hi, I'm Arup", "Das"];
      
      let fontSize = isSmall ? Math.min(width * 0.12, 42) : Math.min(width * 0.11, 64);
      fontSize = Math.max(fontSize, 30);

      ctx.font = `800 ${fontSize}px "Syne", "Outfit", "Inter", sans-serif`;

      while (ctx.measureText("Hi, I'm Arup").width > width - 20 && fontSize > 24) {
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

      const textCoordinates = ctx.getImageData(0, 0, width * dpr, height * dpr);
      ctx.clearRect(0, 0, width, height);

      // Sub-pixel step for 100% solid, pixel-free, butter-smooth text
      const step = isSmall ? 1.4 : 1.1;
      for (let y = 0; y < height * dpr; y += step * dpr) {
        for (let x = 0; x < width * dpr; x += step * dpr) {
          const alphaIndex = (Math.floor(y) * Math.floor(width * dpr) + Math.floor(x)) * 4 + 3;
          if (textCoordinates.data[alphaIndex] > 90) {
            const r = textCoordinates.data[alphaIndex - 3];
            const g = textCoordinates.data[alphaIndex - 2];
            const b = textCoordinates.data[alphaIndex - 1];
            const color = `rgb(${r},${g},${b})`;
            particlesArray.push(new Particle(x / dpr, y / dpr, color));
          }
        }
      }
    }

    function animate() {
      const rect = container.getBoundingClientRect();
      const width = rect.width || 700;
      const height = rect.height || 170;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => init());
    } else {
      init();
    }

    animate();

    return () => {
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
