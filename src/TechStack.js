import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STACKS = [
  {
    category: 'Languages',
    icon: '🗣️',
    color: '#3b82f6',
    items: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    icon: '⚒️',
    color: '#8b5cf6',
    items: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/white' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
      { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/white' },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    ],

    badges: [
      { name: 'PANDAS', color: '#150458' },
      { name: 'NUMPY', color: '#013243' },
      { name: 'MATPLOTLIB', color: '#11557c' },
      { name: 'SCIKIT-LEARN', color: '#f7931e' },
      { name: 'PLOTLY', color: '#3f4f75' },
    ]
  },
  {
    category: 'Databases',
    icon: '💾',
    color: '#10b981',
    items: [
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
      { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/white' },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    icon: '🚀',
    color: '#f43f5e',
    items: [
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'Google Cloud', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Blender', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
      { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/white' },
      { name: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify/white' },
    ],
  },
  {
    category: 'AI TOOLS USE',
    icon: '✨',
    color: '#0ea5e9',
    items: [
      { name: 'Codex', icon: '/icons/ai/codex.png' },
      { name: 'Emergent', icon: '/icons/ai/emergent.png' },
      { name: 'Antigravity', icon: '/icons/ai/antigravity.png' },
      { name: 'Claude', icon: '/icons/ai/claude.jpg' },
      { name: 'Manus', icon: '/icons/ai/manus.png' },
      { name: 'GitHub Copilot', icon: '/icons/ai/copilot.png' },
      { name: 'Cursor', icon: '/icons/ai/cursor.jpg' },
      { name: 'DeepSeek', icon: '/icons/ai/deepseek.jpeg' },
    ],
  },

];


const BRAND_COLORS = {
  // Languages
  python: { border: 'rgba(255, 224, 82, 0.45)', glow: 'rgba(59, 130, 246, 0.25)', bg: 'rgba(59, 130, 246, 0.05)' },
  javascript: { border: 'rgba(247, 223, 30, 0.5)', glow: 'rgba(247, 223, 30, 0.25)', bg: 'rgba(247, 223, 30, 0.05)' },
  typescript: { border: 'rgba(49, 120, 198, 0.5)', glow: 'rgba(49, 120, 198, 0.3)', bg: 'rgba(49, 120, 198, 0.06)' },
  java: { border: 'rgba(224, 111, 36, 0.5)', glow: 'rgba(224, 111, 36, 0.25)', bg: 'rgba(224, 111, 36, 0.05)' },
  c: { border: 'rgba(168, 191, 224, 0.5)', glow: 'rgba(168, 191, 224, 0.25)', bg: 'rgba(168, 191, 224, 0.05)' },
  'c++': { border: 'rgba(0, 134, 212, 0.5)', glow: 'rgba(0, 89, 156, 0.3)', bg: 'rgba(0, 89, 156, 0.06)' },
  html5: { border: 'rgba(227, 79, 38, 0.5)', glow: 'rgba(227, 79, 38, 0.25)', bg: 'rgba(227, 79, 38, 0.05)' },
  css3: { border: 'rgba(21, 114, 182, 0.5)', glow: 'rgba(21, 114, 182, 0.3)', bg: 'rgba(21, 114, 182, 0.06)' },
  kotlin: { border: 'rgba(127, 82, 255, 0.5)', glow: 'rgba(241, 142, 60, 0.25)', bg: 'rgba(127, 82, 255, 0.05)' },

  // Frameworks & Libraries
  react: { border: 'rgba(97, 218, 251, 0.5)', glow: 'rgba(97, 218, 251, 0.3)', bg: 'rgba(97, 218, 251, 0.06)' },
  'next.js': { border: 'rgba(255, 255, 255, 0.4)', glow: 'rgba(255, 255, 255, 0.2)', bg: 'rgba(255, 255, 255, 0.05)' },
  'node.js': { border: 'rgba(67, 133, 61, 0.5)', glow: 'rgba(67, 133, 61, 0.25)', bg: 'rgba(67, 133, 61, 0.05)' },
  fastapi: { border: 'rgba(5, 153, 137, 0.5)', glow: 'rgba(5, 153, 137, 0.25)', bg: 'rgba(5, 153, 137, 0.05)' },
  flutter: { border: 'rgba(2, 86, 155, 0.5)', glow: 'rgba(64, 196, 255, 0.25)', bg: 'rgba(64, 196, 255, 0.05)' },
  tailwind: { border: 'rgba(56, 189, 248, 0.5)', glow: 'rgba(56, 189, 248, 0.3)', bg: 'rgba(56, 189, 248, 0.06)' },
  vite: { border: 'rgba(189, 52, 254, 0.5)', glow: 'rgba(255, 217, 36, 0.25)', bg: 'rgba(189, 52, 254, 0.05)' },
  firebase: { border: 'rgba(255, 202, 40, 0.5)', glow: 'rgba(245, 127, 23, 0.3)', bg: 'rgba(245, 127, 23, 0.06)' },

  // Databases
  mongodb: { border: 'rgba(71, 162, 72, 0.5)', glow: 'rgba(71, 162, 72, 0.25)', bg: 'rgba(71, 162, 72, 0.05)' },
  mysql: { border: 'rgba(0, 117, 143, 0.5)', glow: 'rgba(242, 145, 17, 0.25)', bg: 'rgba(0, 117, 143, 0.05)' },
  sqlite: { border: 'rgba(15, 128, 204, 0.5)', glow: 'rgba(15, 128, 204, 0.25)', bg: 'rgba(15, 128, 204, 0.05)' },
  supabase: { border: 'rgba(62, 207, 142, 0.5)', glow: 'rgba(62, 207, 142, 0.25)', bg: 'rgba(62, 207, 142, 0.05)' },

  // Cloud & DevOps
  aws: { border: 'rgba(255, 153, 0, 0.5)', glow: 'rgba(255, 153, 0, 0.25)', bg: 'rgba(255, 153, 0, 0.05)' },
  'google cloud': { border: 'rgba(66, 133, 244, 0.5)', glow: 'rgba(234, 67, 53, 0.25)', bg: 'rgba(66, 133, 244, 0.05)' },
  git: { border: 'rgba(240, 80, 50, 0.5)', glow: 'rgba(240, 80, 50, 0.25)', bg: 'rgba(240, 80, 50, 0.05)' },
  github: { border: 'rgba(255, 255, 255, 0.4)', glow: 'rgba(255, 255, 255, 0.2)', bg: 'rgba(255, 255, 255, 0.05)' },
  figma: { border: 'rgba(242, 78, 30, 0.5)', glow: 'rgba(162, 89, 255, 0.25)', bg: 'rgba(242, 78, 30, 0.05)' },
  blender: { border: 'rgba(232, 118, 0, 0.5)', glow: 'rgba(232, 118, 0, 0.25)', bg: 'rgba(232, 118, 0, 0.05)' },
  vercel: { border: 'rgba(255, 255, 255, 0.4)', glow: 'rgba(255, 255, 255, 0.2)', bg: 'rgba(255, 255, 255, 0.05)' },
  netlify: { border: 'rgba(0, 190, 187, 0.5)', glow: 'rgba(0, 190, 187, 0.25)', bg: 'rgba(0, 190, 187, 0.05)' },

  // AI Tools
  codex: { border: 'rgba(16, 163, 127, 0.5)', glow: 'rgba(16, 163, 127, 0.25)', bg: 'rgba(16, 163, 127, 0.05)' },
  emergent: { border: 'rgba(139, 92, 246, 0.5)', glow: 'rgba(236, 72, 153, 0.25)', bg: 'rgba(139, 92, 246, 0.05)' },
  antigravity: { border: 'rgba(0, 242, 254, 0.5)', glow: 'rgba(138, 92, 246, 0.25)', bg: 'rgba(0, 242, 254, 0.05)' },
  claude: { border: 'rgba(217, 119, 6, 0.5)', glow: 'rgba(217, 119, 6, 0.25)', bg: 'rgba(217, 119, 6, 0.05)' },
  manus: { border: 'rgba(59, 130, 246, 0.5)', glow: 'rgba(16, 185, 129, 0.25)', bg: 'rgba(59, 130, 246, 0.05)' },
  'github copilot': { border: 'rgba(138, 92, 246, 0.5)', glow: 'rgba(0, 242, 254, 0.25)', bg: 'rgba(138, 92, 246, 0.05)' },
  cursor: { border: 'rgba(255, 255, 255, 0.4)', glow: 'rgba(138, 92, 246, 0.25)', bg: 'rgba(255, 255, 255, 0.05)' },
  deepseek: { border: 'rgba(59, 130, 246, 0.5)', glow: 'rgba(59, 130, 246, 0.25)', bg: 'rgba(59, 130, 246, 0.05)' }
};

const TechIcon = ({ src, name }) => {
  // Only invert icons that are known to be dark by default (Devicon originals)
  // SimpleIcons are already requested as /white
  const isSimpleIcon = src.includes('simpleicons.org');
  const isDarkDevicon = !isSimpleIcon && (name.toLowerCase() === 'next.js' || name.toLowerCase() === 'vercel' || name.toLowerCase() === 'github');

  const key = name.toLowerCase();
  const colors = BRAND_COLORS[key] || {
    border: 'rgba(138, 92, 246, 0.4)',
    glow: 'rgba(138, 92, 246, 0.15)',
    bg: 'rgba(138, 92, 246, 0.03)'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      className="tech-icon-box"
      style={{
        width: 64, height: 64,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 14,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        '--brand-hover-border': colors.border,
        '--brand-hover-glow': colors.glow,
        '--brand-hover-bg': colors.bg
      }}
    >
      <img
        src={src}
        alt={name}
        title={name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: isDarkDevicon ? 'brightness(0) invert(1)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
      {/* Specular premium glass reflection light catch */}
      <div className="tech-icon-shimmer" />

      {/* Floating dynamic particles shimmer */}
      <div className="tech-particles">
        <span className="tech-p tech-p1" />
        <span className="tech-p tech-p2" />
        <span className="tech-p tech-p3" />
      </div>

      <div className="tech-tooltip">{name}</div>
    </motion.div>
  );
};



const TechBadge = ({ name, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    style={{
      background: color,
      color: '#fff',
      padding: '6px 12px',
      borderRadius: 4,
      fontSize: '0.65rem',
      fontWeight: 800,
      letterSpacing: '1px',
      display: 'flex', alignItems: 'center', gap: 6,
      cursor: 'default'
    }}
  >
    <span style={{ opacity: 0.7 }}>||</span> {name}
  </motion.div>
);

export default function TechStack() {
  const titleRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section id="techstack" style={{ padding: '100px 0', background: 'transparent' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Standard Portfolio Header ── */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-label" style={{ textAlign: 'left' }}>✦ WHAT I WORK WITH ✦</span>
          <h2 className="section-title" ref={titleRef} style={{ textAlign: 'left', marginBottom: 12 }}>
            Technology <span>Stack</span>
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '1rem',
            color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.7,
            maxWidth: '600px'
          }}>
            A curated list of languages, frameworks, and tools I use to build scalable, high-performance digital solutions.
          </p>
          <div className="section-line" style={{ marginLeft: 0, marginTop: 24, width: '80px' }} />
        </div>

        {/* Categories */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
          {STACKS.map((category) => (
            <div key={category.category}>
              {/* Category Header — Portfolio Style */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 3, height: 24,
                  background: category.color,
                  borderRadius: 4,
                  boxShadow: `0 0 10px ${category.color}88`
                }} />
                <span style={{ fontSize: '1.6rem' }}>{category.icon}</span>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  margin: 0
                }}>
                  {category.category}
                </h3>
              </div>


              {/* Icons Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 10 : 16, paddingLeft: isMobile ? 0 : 40 }}>
                {category.items.map((item) => (
                  <TechIcon key={item.name} src={item.icon} name={item.name} />
                ))}
              </div>

              {/* Badges Row (for DS/ML) */}
              {category.badges && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: isMobile ? 0 : 40, marginTop: 20 }}>
                  {category.badges.map((badge) => (
                    <TechBadge key={badge.name} name={badge.name} color={badge.color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .tech-icon-box:hover {
          background: var(--brand-hover-bg, rgba(255, 255, 255, 0.08)) !important;
          border-color: var(--brand-hover-border, rgba(138, 92, 246, 0.4)) !important;
          box-shadow: 
            0 0 22px var(--brand-hover-glow, rgba(138, 92, 246, 0.15)),
            0 8px 30px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* 3D Acrylic Specular glass shimmers */
        .tech-icon-shimmer {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 60%, rgba(255, 255, 255, 0.01) 100%);
          pointer-events: none;
          z-index: 1;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .tech-icon-box:hover .tech-icon-shimmer {
          opacity: 1;
        }

        /* Expanding Liquid Brand Aura backing glows */
        .tech-icon-box::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          background: radial-gradient(circle, var(--brand-hover-glow) 0%, transparent 70%);
          transform: translate(-50%, -50%) scale(0.8);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tech-icon-box:hover::after {
          opacity: 0.45;
          transform: translate(-50%, -50%) scale(1.4);
        }

        /* Hardware-Accelerated Floating Particles Container */
        .tech-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: 12px;
          z-index: 1;
        }

        .tech-p {
          position: absolute;
          width: 3px;
          height: 3px;
          background: var(--brand-hover-border, #fff);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }

        .tech-p1 { bottom: 10%; left: 20%; }
        .tech-p2 { bottom: 12%; left: 50%; }
        .tech-p3 { bottom: 8%; left: 80%; }

        .tech-icon-box:hover .tech-p1 {
          opacity: 0.8;
          transform: translateY(-24px) scale(1.4);
          transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tech-icon-box:hover .tech-p2 {
          opacity: 0.8;
          transform: translateY(-32px) scale(1.2);
          transition: opacity 0.4s ease 0.08s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.08s;
        }

        .tech-icon-box:hover .tech-p3 {
          opacity: 0.8;
          transform: translateY(-20px) scale(1.4);
          transition: opacity 0.4s ease 0.04s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.04s;
        }

        /* Legible dynamic floating Tooltip */
        .tech-tooltip {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 12, 30, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--brand-hover-border, rgba(255, 255, 255, 0.1));
          color: #fff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .tech-icon-box:hover .tech-tooltip {
          opacity: 1;
          bottom: -25px;
        }
      `}} />
    </section>
  );
}