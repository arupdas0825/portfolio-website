// src/BlackholeVortex.js — Blackhole with floating tech icons
import React, { useEffect, useRef } from 'react';

const ICONS = [
  { label:'React',      color:'#61DAFB', svg:'⚛️' },
  { label:'Python',     color:'#3572A5', svg:'🐍' },
  { label:'JavaScript', color:'#f1e05a', svg:'JS' },
  { label:'Firebase',   color:'#FFCA28', svg:'🔥' },
  { label:'Kotlin',     color:'#A97BFF', svg:'📱' },
  { label:'GitHub',     color:'#ffffff', svg:'🐙' },
  { label:'Java',       color:'#b07219', svg:'☕' },
  { label:'AWS',        color:'#FF9900', svg:'☁️' },
  { label:'Node',       color:'#339933', svg:'🟩' },
  { label:'TypeScript', color:'#2b7489', svg:'TS' },
  { label:'HTML',       color:'#e34c26', svg:'🌐' },
  { label:'CSS',        color:'#563d7c', svg:'🎨' },
];

export default function BlackholeVortex() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const cx = W / 2, cy = H / 2;

    // Particle state
    const particles = ICONS.map((icon, i) => {
      const angle  = (i / ICONS.length) * Math.PI * 2;
      const radius = 120 + Math.random() * 180;
      return {
        ...icon,
        angle,
        radius,
        baseRadius: radius,
        speed:      0.003 + Math.random() * 0.004,
        size:       28 + Math.random() * 14,
        // Blackhole pull phase
        phase: 'orbit',   // 'orbit' | 'suck' | 'emerge'
        sucked: false,
        emergeTimer: 0,
        opacity: 1,
        scale: 1,
        suckTimer: 0,
      };
    });

    // Stagger suck/emerge cycles
    particles.forEach((p, i) => {
      p.suckDelay = i * 90 + Math.random() * 200; // frames
      p.suckCountdown = p.suckDelay;
      p.suckDuration  = 60 + Math.random() * 40;
      p.emergeDuration = 80 + Math.random() * 40;
    });

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Blackhole ──
      const bhRadius = 38;

      // Outer glow rings
      for (let r = bhRadius * 4; r > bhRadius; r -= 8) {
        const alpha = 0.03 * ((bhRadius * 4 - r) / (bhRadius * 3));
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(138,92,246,${alpha * 3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Accretion disk
      const diskGrad = ctx.createRadialGradient(cx, cy, bhRadius, cx, cy, bhRadius * 3.5);
      diskGrad.addColorStop(0,   'rgba(192,132,252,0.25)');
      diskGrad.addColorStop(0.4, 'rgba(138,92,246,0.12)');
      diskGrad.addColorStop(1,   'rgba(138,92,246,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();

      // Spinning swirl lines
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(frame * 0.015 + (i * Math.PI * 2) / 3);
        const swirlGrad = ctx.createLinearGradient(0, 0, bhRadius * 2.5, 0);
        swirlGrad.addColorStop(0,   'rgba(192,132,252,0.5)');
        swirlGrad.addColorStop(1,   'rgba(138,92,246,0)');
        ctx.beginPath();
        ctx.moveTo(bhRadius, 0);
        ctx.quadraticCurveTo(bhRadius * 1.5, bhRadius * 0.5, bhRadius * 2.5, 0);
        ctx.strokeStyle = swirlGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Black hole core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bhRadius);
      coreGrad.addColorStop(0,   'rgba(0,0,0,1)');
      coreGrad.addColorStop(0.7, 'rgba(10,5,25,0.95)');
      coreGrad.addColorStop(1,   'rgba(138,92,246,0.3)');
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Event horizon ring
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(192,132,252,0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Icons ──
      particles.forEach(p => {
        p.angle += p.speed;

        if (p.phase === 'orbit') {
          p.suckCountdown--;
          if (p.suckCountdown <= 0) { p.phase = 'suck'; p.suckTimer = 0; }
          p.opacity = 1; p.scale = 1; p.radius = p.baseRadius;
        }

        if (p.phase === 'suck') {
          p.suckTimer++;
          const t = p.suckTimer / p.suckDuration;
          p.radius  = p.baseRadius * (1 - t * 0.95);
          p.opacity = 1 - t;
          p.scale   = 1 - t * 0.6;
          if (p.suckTimer >= p.suckDuration) {
            p.phase = 'emerge';
            p.emergeTimer = 0;
            p.radius = bhRadius;
            const newAngle = Math.random() * Math.PI * 2;
            p.angle = newAngle;
            p.baseRadius = 120 + Math.random() * 180;
          }
        }

        if (p.phase === 'emerge') {
          p.emergeTimer++;
          const t = p.emergeTimer / p.emergeDuration;
          p.radius  = bhRadius + (p.baseRadius - bhRadius) * t;
          p.opacity = t;
          p.scale   = 0.4 + t * 0.6;
          if (p.emergeTimer >= p.emergeDuration) {
            p.phase = 'orbit';
            p.suckCountdown = 200 + Math.random() * 300;
            p.radius = p.baseRadius;
            p.opacity = 1; p.scale = 1;
          }
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(p.scale, p.scale);
        ctx.globalAlpha = Math.max(0, p.opacity);

        // Icon background pill
        const boxW = p.size * 2.2;
        const boxH = p.size * 1.3;
        ctx.beginPath();
        const rr = boxH / 2;
        ctx.roundRect(-boxW/2, -boxH/2, boxW, boxH, rr);
        ctx.fillStyle = `rgba(15,10,30,0.85)`;
        ctx.fill();
        ctx.strokeStyle = p.color + '60';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon text/emoji
        ctx.fillStyle = p.color;
        ctx.font = `bold ${p.size * 0.62}px 'Syne', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.svg, 0, 0);

        ctx.restore();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width:'100%', height:'100%', display:'block' }}
    />
  );
}