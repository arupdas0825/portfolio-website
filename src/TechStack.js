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
  python: { border: '#3776AB', glow: 'rgba(255, 212, 59, 0.35)', bg: 'rgba(255, 212, 59, 0.05)' }, // #FFD43B glow
  javascript: { border: '#F7DF1E', glow: 'rgba(247, 223, 30, 0.35)', bg: 'rgba(247, 223, 30, 0.05)' },
  typescript: { border: '#3178C6', glow: 'rgba(49, 120, 198, 0.35)', bg: 'rgba(49, 120, 198, 0.05)' },
  java: { border: '#ED8B00', glow: 'rgba(237, 139, 0, 0.35)', bg: 'rgba(237, 139, 0, 0.05)' },
  c: { border: '#A8B9CC', glow: 'rgba(168, 185, 204, 0.35)', bg: 'rgba(168, 185, 204, 0.05)' },
  'c++': { border: '#00599C', glow: 'rgba(0, 89, 156, 0.35)', bg: 'rgba(0, 89, 156, 0.05)' },
  html5: { border: '#E34F26', glow: 'rgba(227, 79, 38, 0.35)', bg: 'rgba(227, 79, 38, 0.05)' },
  css3: { border: '#1572B6', glow: 'rgba(21, 114, 182, 0.35)', bg: 'rgba(21, 114, 182, 0.05)' },
  kotlin: { border: '#7F52FF', glow: 'rgba(127, 82, 255, 0.35)', bg: 'rgba(127, 82, 255, 0.05)' },

  // Frameworks & Libraries
  react: { border: '#61DAFB', glow: 'rgba(97, 218, 251, 0.35)', bg: 'rgba(97, 218, 251, 0.05)' },
  'next.js': { border: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.15)', bg: 'rgba(255, 255, 255, 0.03)' },
  'node.js': { border: '#339933', glow: 'rgba(51, 153, 51, 0.35)', bg: 'rgba(51, 153, 51, 0.05)' },
  fastapi: { border: '#059989', glow: 'rgba(5, 153, 137, 0.35)', bg: 'rgba(5, 153, 137, 0.05)' },
  flutter: { border: '#54C5F8', glow: 'rgba(84, 197, 248, 0.35)', bg: 'rgba(84, 197, 248, 0.05)' },
  tailwind: { border: '#38BDF8', glow: 'rgba(56, 189, 248, 0.35)', bg: 'rgba(56, 189, 248, 0.05)' },
  vite: { border: '#646CFF', glow: 'rgba(100, 108, 255, 0.35)', bg: 'rgba(100, 108, 255, 0.05)' },

  // Databases & Cloud
  mongodb: { border: '#47A248', glow: 'rgba(71, 162, 72, 0.35)', bg: 'rgba(71, 162, 72, 0.05)' },
  mysql: { border: '#00758F', glow: 'rgba(242, 145, 17, 0.35)', bg: 'rgba(0, 117, 143, 0.05)' },
  sqlite: { border: '#0F80CC', glow: 'rgba(15, 128, 204, 0.35)', bg: 'rgba(15, 128, 204, 0.05)' },
  supabase: { border: '#3ECF8E', glow: 'rgba(62, 207, 142, 0.35)', bg: 'rgba(62, 207, 142, 0.05)' },
  aws: { border: '#FF9900', glow: 'rgba(255, 153, 0, 0.35)', bg: 'rgba(255, 153, 0, 0.05)' },
  'google cloud': { border: '#4285F4', glow: 'rgba(66, 133, 244, 0.35)', bg: 'rgba(66, 133, 244, 0.05)' },
  git: { border: '#F05032', glow: 'rgba(240, 80, 50, 0.35)', bg: 'rgba(240, 80, 50, 0.05)' },
  github: { border: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.15)', bg: 'rgba(255, 255, 255, 0.03)' },
  figma: { border: '#F24E1E', glow: 'rgba(242, 78, 30, 0.35)', bg: 'rgba(242, 78, 30, 0.05)' },
  blender: { border: '#E87600', glow: 'rgba(232, 118, 0, 0.35)', bg: 'rgba(232, 118, 0, 0.05)' },
  vercel: { border: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.15)', bg: 'rgba(255, 255, 255, 0.03)' },
  netlify: { border: '#00BEBB', glow: 'rgba(0, 190, 187, 0.35)', bg: 'rgba(0, 190, 187, 0.05)' }
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
    <div
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
        '--brand-hover-border': colors.border,
        '--brand-hover-glow': colors.glow,
      }}
    >
      <div className="tech-img-wrap" style={{ width: '100%', height: '100%', perspective: '1000px' }}>
        <img
          src={src}
          alt={name}
          title={name}
          className="tech-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: isDarkDevicon ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </div>
      
      {/* Legible dynamic floating Tooltip */}
      <div className="tech-tooltip">{name}</div>
    </div>
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
      { y: 16, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.35,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 98%',
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
        .tech-icon-box {
          will-change: transform;
          transform: translateZ(0); /* GPU Acceleration */
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1), 
                      background 600ms cubic-bezier(0.22, 1, 0.36, 1), 
                      border-color 600ms cubic-bezier(0.22, 1, 0.36, 1), 
                      box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tech-img {
          will-change: transform;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Desktop Hover state */
        @media (hover: hover) and (pointer: fine) {
          .tech-icon-box:hover {
            transform: translateY(-12px) scale(1.08) translateZ(0);
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: var(--brand-hover-border) !important;
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 0 20px var(--brand-hover-glow) !important;
          }
          .tech-icon-box:hover .tech-img {
            transform: rotateY(180deg);
          }
        }

        /* Mobile Tap state */
        @media (hover: none) and (pointer: coarse) {
          .tech-icon-box:active {
            transform: translateY(-12px) scale(1.08) translateZ(0);
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: var(--brand-hover-border) !important;
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 0 20px var(--brand-hover-glow) !important;
          }
          .tech-icon-box:active .tech-img {
            transform: rotateY(180deg);
          }
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