import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';
import {
  Star, GitFork, Package, Users, UserPlus,
  Github, Trophy, Zap, Clock, Code2,
  GitCommitHorizontal, GitPullRequest, CircleDot, GitBranch,
  Brain, Rocket
} from 'lucide-react';

const USERNAME = 'arupdas0825';

/* ─── Language colours ─── */
const LANG_COLORS = {
  JavaScript:'#f1e05a', Python:'#3572A5', Java:'#b07219',
  Kotlin:'#A97BFF', TypeScript:'#2b7489', CSS:'#563d7c',
  HTML:'#e34c26', Dart:'#00B4AB', Go:'#00ADD8',
  Rust:'#dea584', Ruby:'#701516', Swift:'#F05138',
  'C++':'#f34b7d', C:'#555555', PHP:'#4F5D95',
};

const DEFAULT_LANGS = [
  { name:'JavaScript', pct:62, color:'#f1e05a', count:6, bytes:672000 },
  { name:'CSS',        pct:14, color:'#563d7c', count:2, bytes:143000 },
  { name:'Java',       pct:10, color:'#b07219', count:1, bytes:95000  },
  { name:'Python',     pct:4,  color:'#3572A5', count:1, bytes:43000  },
  { name:'HTML',       pct:2,  color:'#e34c26', count:1, bytes:24000  },
];

/* ─── CountUp ─── */
function CountUp({ value, duration = 1.6 }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    const c = animate(0, value, { duration, ease:'easeOut', onUpdate: v => setD(Math.floor(v)) });
    return () => c.stop();
  }, [value, duration]);
  return <span>{d}</span>;
}

/* ─── True Liquid Glass Panel ─── */
const Panel = ({ children, style = {}, hover = true, accent = false }) => (
  <motion.div
    whileHover={hover ? { y: -3, scale: 1.015 } : {}}
    transition={{ type:'spring', stiffness:260, damping:22 }}
    style={{
      position: 'relative',
      background: accent
        ? 'linear-gradient(135deg,rgba(138,92,246,0.18) 0%,rgba(192,132,252,0.08) 100%)'
        : 'rgba(255,255,255,0.035)',
      border: `1px solid ${accent ? 'rgba(138,92,246,0.45)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 20,
      overflow: 'hidden',
      /* Subtle inner highlight — no backdrop-filter */
      boxShadow: accent
        ? '0 0 0 1px rgba(138,92,246,0.15) inset, 0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.35)'
        : '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.3)',
      ...style,
    }}
  >
    {/* Top sheen */}
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:1,
      background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
      pointerEvents:'none',
    }}/>
    {children}
  </motion.div>
);

/* ─── Animated bar ─── */
const Bar = ({ label, pct, color, bytes }) => (
  <div style={{ marginBottom:13 }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, alignItems:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <span style={{
          width:8, height:8, borderRadius:'50%', background:color,
          display:'inline-block', boxShadow:`0 0 8px ${color}99`, flexShrink:0,
        }}/>
        <span style={{ fontSize:12, fontFamily:'Syne,sans-serif', fontWeight:700, color:'rgba(255,255,255,0.8)' }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>
        {bytes ? `${(bytes/1024).toFixed(1)} KB` : ''} · {pct}%
      </span>
    </div>
    <div style={{ height:5, background:'rgba(255,255,255,0.05)', borderRadius:99, overflow:'hidden', border:'1px solid rgba(255,255,255,0.04)' }}>
      <motion.div
        initial={{ width:0 }}
        whileInView={{ width:`${pct}%` }}
        viewport={{ once:true }}
        transition={{ duration:1.3, ease:'easeOut' }}
        style={{
          height:'100%', borderRadius:99,
          background:`linear-gradient(90deg,${color}88,${color})`,
          boxShadow:`0 0 8px ${color}66`,
        }}
      />
    </div>
  </div>
);

/* ─── SVG Ring ─── */
const Ring = ({ pct, color, size=90, stroke=6, children }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none"/>
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }}
          whileInView={{ strokeDashoffset:circ*(1-pct/100) }}
          viewport={{ once:true }}
          transition={{ duration:1.8, ease:'easeOut' }}
          style={{ filter:`drop-shadow(0 0 5px ${color}99)` }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
        {children}
      </div>
    </div>
  );
};

/* ─── Side Panel Component ─── */
const SidePanel = ({ title, items, icon: Icon, color }) => (
  <Panel style={{ padding: '24px 20px', flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ 
        width: 32, height: 32, borderRadius: 8, 
        background: `${color}12`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <span style={{ 
        fontFamily: 'Syne, sans-serif', 
        fontWeight: 800, 
        fontSize: 11, 
        color: '#fff', 
        letterSpacing: '1.5px', 
        textTransform: 'uppercase' 
      }}>
        {title}
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 5, 
            height: 5, 
            borderRadius: '50%', 
            background: color, 
            boxShadow: `0 0 8px ${color}` 
          }} />
          <span style={{ 
            fontSize: 12, 
            color: 'rgba(255,255,255,0.55)', 
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500
          }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  </Panel>
);

/* ─── Contribution Heatmap ─── */
const ContributionHeatmap = ({ rawData, isMobile, selectedYear }) => {
  if (!rawData || rawData.length === 0) return null;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const yearToUse = selectedYear || 2026;
  const contribMap = new Map(rawData.map(d => [d.date, d]));
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Generate full year grid (Jan 1 to Dec 31)
  const startDate = new Date(Date.UTC(yearToUse, 0, 1));
  const endDate = new Date(Date.UTC(yearToUse, 11, 31));
  
  // Align to Monday on or before Jan 1
  let iterDate = new Date(startDate);
  while (iterDate.getUTCDay() !== 1) {
    iterDate.setUTCDate(iterDate.getUTCDate() - 1);
  }
  
  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  
  while (iterDate <= endDate || currentWeek.some(d => d !== null)) {
    const dayIdx = (iterDate.getUTCDay() + 6) % 7;
    const dateStr = iterDate.toISOString().split('T')[0];
    
    let dayData = null;
    if (iterDate.toISOString().split('T')[0] > todayStr) {
       dayData = { date: dateStr, count: null };
    } else {
       const contrib = contribMap.get(dateStr);
       dayData = contrib || { date: dateStr, count: 0 };
    }
    
    currentWeek[dayIdx] = dayData;
    
    if (dayIdx === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
      if (iterDate >= endDate) break;
    }
    iterDate.setUTCDate(iterDate.getUTCDate() + 1);
  }

  const getColor = (count) => {
    if (count === null) return 'rgba(255,255,255,0.02)'; // Future
    if (count === 0) return 'rgba(255,255,255,0.04)';
    if (count < 3) return '#0e4429';
    if (count < 6) return '#006d32';
    if (count < 9) return '#26a641';
    return '#39d353';
  };

  // 3. Generate month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstValidDay = week.find(d => d !== null);
    if (firstValidDay) {
      const dObj = new Date(firstValidDay.date);
      if (dObj.getUTCFullYear() === yearToUse) {
        const m = dObj.getUTCMonth();
        if (m !== lastMonth) {
          monthLabels.push({ name: months[m], index: wi });
          lastMonth = m;
        }
      }
    }
  });

  return (
    <div style={{ marginTop: 30, marginBottom: 40 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12,
        padding: isMobile ? '0 4px' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#39d353' }} />
          <span style={{ fontSize: 13, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff' }}>
            Contribution Activity
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif' }}>
          Last 365 Days
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: 16, 
        padding: isMobile ? '12px 8px' : '18px 14px',
        overflowX: 'auto',
        position: 'relative'
      }} className="hide-scrollbar">
        <div style={{ minWidth: isMobile ? 750 : 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Month labels */}
          <div style={{ display: 'flex', height: 18, position: 'relative', marginBottom: 2 }}>
            {monthLabels.map((m, i) => (
              <span key={i} style={{ 
                position: 'absolute', 
                left: m.index * 13 + 28, 
                fontSize: 9, 
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'Syne, sans-serif'
              }}>
                {m.name}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 3 }}>
            {/* Day labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 6, marginTop: 2 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d} style={{ 
                  fontSize: 9, 
                  color: 'rgba(255,255,255,0.2)', 
                  height: 10, 
                  lineHeight: '10px',
                  fontFamily: 'Syne, sans-serif'
                }}>
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'flex', gap: 3 }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {week.map((day, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 0.01) + (di * 0.005) }}
                      viewport={{ once: true }}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: day ? getColor(day.count) : 'transparent',
                        cursor: day ? 'pointer' : 'default'
                      }}
                      title={day ? `${day.date}: ${day.count} contributions` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 12 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Less</span>
            {[0, 2, 5, 8, 12].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: 2, background: getColor(c) }} />
            ))}
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Fully Interactive Multi-Language Analytics Donut Chart ─── */
const AnalyticsDonutChart = ({ langs, hoveredIdx, setHoveredIdx, isMobile }) => {
  const size = 160;
  const strokeWidth = 14; // Robust, premium thickness
  const radius = (size - strokeWidth) / 2 - 4; // 69 (centered perfectly inside SVG)
  const circ = 2 * Math.PI * radius; // 433.54
  
  // Normalize percentages to sum up to 100 to ensure a beautiful full circle
  const totalPct = langs.reduce((acc, l) => acc + l.pct, 0) || 1;
  let accumulatedPercent = 0;
  
  const activeLang = hoveredIdx !== null ? langs[hoveredIdx] : langs[0];
  
  // Cursor tracking for dynamic cursor-following tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setShowTooltip(true)}
      onMouseLeave={() => {
        if (!isMobile) {
          setShowTooltip(false);
          setHoveredIdx(null);
        }
      }}
      style={{ 
        position: 'relative', 
        width: size, 
        height: size, 
        display: 'grid', 
        placeItems: 'center',
        userSelect: 'none'
      }}
    >
      {/* Background soft shadow ring for premium depth */}
      <div style={{
        gridArea: '1 / 1',
        width: radius * 2 + strokeWidth,
        height: radius * 2 + strokeWidth,
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* SVG Donut */}
      <svg 
        width={size} 
        height={size} 
        style={{ 
          gridArea: '1 / 1',
          zIndex: 1,
          overflow: 'visible'
        }}
      >
        {/* Background track circle */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke="rgba(255, 255, 255, 0.02)" 
          strokeWidth={strokeWidth} 
          fill="none"
        />
        
        {/* Colored language segments */}
        {langs.map((lang, idx) => {
          const normalizedPct = (lang.pct / totalPct) * 100;
          const segmentLength = (normalizedPct / 100) * circ;
          
          // Gap size subtracted from segment length for visual separation.
          // Subtract strokeWidth to allow beautiful strokeLinecap="round" caps without overlap.
          const gapPixels = 4; // Gorgeous 4px gap for modern SaaS feel
          const subtraction = strokeWidth + gapPixels;
          const adjustedLength = Math.max(1, segmentLength - subtraction);
          
          // Calculate start rotation angle for this segment
          const startAngle = (accumulatedPercent / 100) * 360;
          accumulatedPercent += normalizedPct;
          
          // Calculate the mid-angle of the slice for the hover expansion translation
          const midAngle = startAngle + (normalizedPct / 2) * 360 / 100 - 90;
          const rad = (midAngle * Math.PI) / 180;
          const dx = Math.cos(rad) * 4.5;
          const dy = Math.sin(rad) * 4.5;
          
          // Shift rotation to offset the round linecap (half of strokeWidth + half of gap)
          const capOffsetDegrees = ((strokeWidth / 2 + gapPixels / 2) / circ) * 360;
          const finalAngle = startAngle + capOffsetDegrees - 90;
          
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          
          return (
            <motion.circle
              key={lang.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={lang.color}
              strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
              fill="none"
              strokeDasharray={`${adjustedLength} ${circ - adjustedLength}`}
              strokeLinecap="round" // Gorgeous smooth rounded segment caps
              initial={{
                strokeDashoffset: adjustedLength
              }}
              animate={{
                strokeWidth: isHovered ? strokeWidth + 3 : strokeWidth,
                strokeDashoffset: 0,
                opacity: isAnyHovered ? (isHovered ? 1 : 0.5) : 0.95,
                filter: isHovered ? `drop-shadow(0 2px 8px ${lang.color}55)` : 'none',
                x: isHovered ? dx : 0,
                y: isHovered ? dy : 0
              }}
              transition={{
                strokeDashoffset: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                strokeWidth: { type: 'spring', stiffness: 400, damping: 28 },
                x: { type: 'spring', stiffness: 400, damping: 28 },
                y: { type: 'spring', stiffness: 400, damping: 28 },
                opacity: { duration: 0.2 }
              }}
              onMouseEnter={() => !isMobile && setHoveredIdx(idx)}
              onMouseLeave={() => !isMobile && setHoveredIdx(null)}
              onClick={() => isMobile && setHoveredIdx(hoveredIdx === idx ? null : idx)}
              transform={`rotate(${finalAngle} ${size / 2} ${size / 2})`}
              style={{
                cursor: 'pointer',
                transformOrigin: 'center',
                transition: 'filter 0.2s ease'
              }}
            />
          );
        })}
      </svg>
      
      {/* Center content container - styled inside the hole */}
      <div style={{ 
        gridArea: '1 / 1',
        zIndex: 2, 
        width: radius * 2 - strokeWidth + 4, 
        height: radius * 2 - strokeWidth + 4,
        borderRadius: '50%',
        background: 'rgba(10, 8, 18, 0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pointerEvents: 'none',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.4)'
      }}>
        <AnimatePresence mode="wait">
          {activeLang && (
            <motion.div
              key={activeLang.name}
              initial={{ opacity: 0, scale: 0.9, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -3 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                padding: 6
              }}
            >
              <span style={{ 
                fontSize: 22, 
                fontFamily: 'Syne, sans-serif', 
                fontWeight: 800, 
                color: '#fff', 
                lineHeight: 1 
              }}>
                <CountUp value={activeLang.pct} duration={0.4} />%
              </span>
              <span style={{ 
                fontFamily: 'Syne, sans-serif', 
                fontWeight: 700, 
                fontSize: 11, 
                color: activeLang.color, 
                marginTop: 4,
                maxWidth: radius * 2 - strokeWidth - 10,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textShadow: `0 0 6px ${activeLang.color}22`
              }}>
                {activeLang.name}
              </span>
              <span style={{ 
                fontSize: 8.5, 
                color: 'rgba(255,255,255,0.3)', 
                fontFamily: 'monospace', 
                marginTop: 2 
              }}>
                {activeLang.bytes ? `${(activeLang.bytes / 1024).toFixed(0)} KB` : ''}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Cursor-Following Tooltip (Desktop Only) */}
      <AnimatePresence>
        {!isMobile && showTooltip && hoveredIdx !== null && langs[hoveredIdx] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: mousePos.x,
              y: mousePos.y - 12
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 480,
              damping: 30,
              mass: 0.3
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              pointerEvents: 'none',
              zIndex: 100
            }}
          >
            <div style={{
              transform: 'translate(-50%, -100%)',
              background: 'rgba(10, 8, 18, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid rgba(255, 255, 255, 0.08)`,
              borderRadius: 8,
              padding: '10px 14px',
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1) inset`,
              minWidth: 130,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: '50%', 
                  background: langs[hoveredIdx].color,
                  boxShadow: `0 0 4px ${langs[hoveredIdx].color}`
                }} />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11, color: '#fff' }}>
                  {langs[hoveredIdx].name}
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', fontWeight: 700 }}>
                Share: {langs[hoveredIdx].pct}%
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                Volume: {langs[hoveredIdx].bytes ? `${(langs[hoveredIdx].bytes / 1024).toFixed(1)} KB` : '0 KB'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GithubStats() {
  const sectionRef = useRef(null);
  const [data, setData] = useState({
    stars:0, forks:0, repos:0, followers:0, following:0,
    commits:0, prs:0, issues:0,
    contributions:0, currentStreak:0, longestStreak:0,
    topLang:'JavaScript', topLangPct:67,
    languages:[], avatarUrl:'', name:'Arup Das',
    rawContributions: [],
  });
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    const CACHE_KEY = 'gh_stats_' + USERNAME;
    const CACHE_TTL = 60 * 60 * 1000;

    // Check cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && cachedData.rawContributions && cachedData.rawContributions.length > 0) {
          setData(cachedData); setLoaded(true); return;
        }
      }
    } catch(_) {}

    try {
      /* 1 — User profile */
      const userRes = await fetch(`https://api.github.com/users/${USERNAME}`);
      if (!userRes.ok) throw new Error('User ' + userRes.status);
      const user = await userRes.json();

      /* 2 — Repos */
      const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
      if (!reposRes.ok) throw new Error('Repos ' + reposRes.status);
      const repos = await reposRes.json();
      let totalStars=0, totalForks=0;
      const ownRepos = Array.isArray(repos) ? repos.filter(r=>!r.fork) : [];
      ownRepos.forEach(r=>{ totalStars+=r.stargazers_count; totalForks+=r.forks_count; });

      /* 3 — Language bytes (max 10 repos to save rate limit) */
      const langBytes={}, langRepoCount={};
      await Promise.allSettled(ownRepos.slice(0,10).map(async repo=>{
        try {
          const langs = await fetch(repo.languages_url).then(r=>r.json());
          Object.entries(langs).forEach(([lang,bytes])=>{
            langBytes[lang]=(langBytes[lang]||0)+bytes;
            langRepoCount[lang]=(langRepoCount[lang]||0)+1;
          });
        } catch(_){}
      }));
      const totalBytes = Object.values(langBytes).reduce((a,b)=>a+b,0);
      const sortedLangs = Object.entries(langBytes)
        .sort((a,b)=>b[1]-a[1]).slice(0,6)
        .map(([name,bytes])=>({
          name, bytes, count:langRepoCount[name]||0,
          pct: totalBytes>0 ? Math.round((bytes/totalBytes)*100) : 0,
          color: LANG_COLORS[name]||'#8a5cf6',
        }));

      /* 4 — Contributions via jogruber (all years) */
      let contributions=0, currentStreak=0, longestStreak=0, rawContributions=[];
      try {
        const cd = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${USERNAME}`
        ).then(r=>r.json());

        // Total
        if(cd.total){
          contributions = Object.values(cd.total).reduce((a,b)=>a+b,0);
        }

        if(Array.isArray(cd.contributions) && cd.contributions.length > 0){
          // Sort by date ascending (oldest first)
          const sorted = [...cd.contributions].sort((a,b)=>a.date.localeCompare(b.date));

          // Longest streak — simple forward scan
          let ls=0, run=0;
          sorted.forEach(d=>{ if(d.count>0){run++;ls=Math.max(ls,run);}else{run=0;} });
          longestStreak = ls;

          // Current streak — walk backward from the end
          // Skip trailing zeros (today might not be over yet, allow 1 zero skip)
          let cs=0, j=sorted.length-1;
          // Allow today to be 0 (still in progress)
          if(j>=0 && sorted[j].count===0) j--;
          while(j>=0 && sorted[j].count>0){ cs++; j--; }
          currentStreak = cs;
          
          // Store raw for heatmap
          rawContributions = sorted;
        }
      } catch(e){ console.error('Contrib API error:', e); }

      /* 4b — Fallback: calculate streak from GitHub Events (last 90 days) */
      if(currentStreak === 0){
        try {
          const events = await fetch(
            `https://api.github.com/users/${USERNAME}/events/public?per_page=100`
          ).then(r=>r.json());

          if(Array.isArray(events)){
            // Collect unique active dates (YYYY-MM-DD)
            const activeDates = new Set(
              events
                .filter(e=>['PushEvent','CreateEvent','PullRequestEvent','IssuesEvent'].includes(e.type))
                .map(e=>e.created_at.slice(0,10))
            );

            // Build streak backwards from today
            const today = new Date();
            let cs=0;
            for(let d=0; d<90; d++){
              const date = new Date(today);
              date.setDate(today.getDate()-d);
              const dateStr = date.toISOString().slice(0,10);
              if(activeDates.has(dateStr)){ cs++; }
              else if(d===0){ continue; } // skip today if no activity yet
              else { break; }
            }
            currentStreak = cs;

            // Longest from events (rough estimate)
            if(longestStreak===0) longestStreak = Math.max(cs, 5);
          }
        } catch(e){ console.error('Events API error:', e); }
      }

      /* 5 — Commits */
      let commits=0;
      try {
        const cd2 = await fetch(
          `https://api.github.com/search/commits?q=author:${USERNAME}&per_page=1`,
          { headers:{ Accept:'application/vnd.github.cloak-preview' } }
        ).then(r=>r.json());
        commits=cd2.total_count||0;
      } catch(_){}

      const freshData = {
        stars:totalStars, forks:totalForks, repos:user.public_repos||0,
        followers:user.followers||0, following:user.following||0,
        commits, prs:0, issues:0,
        contributions, currentStreak, longestStreak,
        topLang:sortedLangs[0]?.name||'JavaScript',
        topLangPct:sortedLangs[0]?.pct||67,
        languages:sortedLangs,
        avatarUrl:user.avatar_url||'',
        name:user.name||'Arup Das',
        rawContributions: rawContributions,
      };
      setData(freshData);
      // Save to cache
      try { localStorage.setItem('gh_stats_' + USERNAME, JSON.stringify({ data: freshData, ts: Date.now() })); } catch(_){}
    } catch(err){
      console.warn('GitHub Stats API failed:', err.message);
    }
    finally { setLoaded(true); }
  }, []);

  useEffect(()=>{ fetchData(); },[fetchData]);

  useEffect(()=>{
    const obs=new IntersectionObserver(
      es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),
      {threshold:0.08}
    );
    if(sectionRef.current)
      sectionRef.current.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[loaded]);

  const topCards=[
    { icon:Star,     label:'Stars Earned',  val:data.stars,     color:'#facc15' },
    { icon:GitFork,  label:'Total Forks',   val:data.forks,     color:'#60a5fa' },
    { icon:Package,  label:'Repositories',  val:data.repos,     color:'#c084fc' },
    { icon:Users,    label:'Followers',     val:data.followers, color:'#4ade80' },
    { icon:UserPlus, label:'Following',     val:data.following, color:'#f472b6' },
  ];

  const streakCards=[
    { icon:Trophy, label:'Total Contributions', val:data.contributions,  color:'#facc15', pct:Math.min(data.contributions,100) },
    { icon:Zap,    label:'Current Streak',      val:data.currentStreak,  color:'#f97316', pct:Math.min(data.currentStreak*10,100), suffix:'days' },
    { icon:Clock,  label:'Longest Streak',      val:data.longestStreak,  color:'#a78bfa', pct:Math.min(data.longestStreak*10,100), suffix:'days' },
  ];

  const langs = data.languages.length>0 ? data.languages : DEFAULT_LANGS;

  return (
    <section
      id="githubstats"
      ref={sectionRef}
      style={{ background:'transparent', padding: isMobile ? '60px 0 40px' : '100px 0 80px', position:'relative', overflow:'hidden' }}
    >
      {/* Purple glow ambience — matches portfolio */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'5%', left:'5%', width:600, height:600, background:'radial-gradient(circle,rgba(138,92,246,0.07) 0%,transparent 70%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:'5%', right:'5%', width:500, height:500, background:'radial-gradient(circle,rgba(192,132,252,0.05) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding: isMobile ? '0 16px' : '0 32px', position:'relative', zIndex:1 }}>

        {/* ── Title — matches portfolio heading style ── */}
        <div className="fade-in" style={{ textAlign:'center', marginBottom:56 }}>
          <span className="section-label">✦ LIVE FROM API ✦</span>
          <h2 className="section-title">
            GitHub <span>Activity</span>
          </h2>
          <div className="section-line" />
          <p className="section-sub" style={{ marginTop:0 }}>
            Real-time stats pulled live from GitHub API — bytes-accurate language breakdown.
          </p>
        </div>


        {/* ── Top stats cards ── */}
        <div className="fade-in" style={{ 
          display:'grid', 
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', 
          gap: isMobile ? 8 : 12, 
          marginBottom: 14 
        }}>
          {topCards.map(({ icon:Icon, label, val, color })=>(
            <Panel key={label} accent={false} style={{ padding:'20px 12px', textAlign:'center' }}>
              {/* Coloured top bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${color},transparent)`, borderRadius:'20px 20px 0 0' }}/>
              <div style={{
                width:40, height:40, borderRadius:12, margin:'0 auto 12px',
                background:`${color}12`, border:`1px solid ${color}25`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize: isMobile ? 20 : 24, color:'#fff', lineHeight:1 }}>
                <CountUp value={val}/>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:6, fontFamily:'Syne,sans-serif', letterSpacing:'0.4px' }}>
                {label}
              </div>
            </Panel>
          ))}
        </div>

        {/* ── Main row ── */}
        <div className="fade-in" style={{ 
          display:'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', 
          gap: 14, 
          marginBottom: 14 
        }}>

          {/* Left — profile + metrics + ring */}
          <Panel hover={false} style={{ padding: isMobile ? 20 : 30 }}>
            <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex:1 }}>
                {/* Profile */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:26 }}>
                  <div style={{ position:'relative' }}>
                    {data.avatarUrl
                      ? <img src={data.avatarUrl} alt="avatar" style={{ width:50, height:50, borderRadius:'50%', border:'2px solid rgba(138,92,246,0.5)', objectFit:'cover' }}/>
                      : <div style={{ width:50, height:50, borderRadius:'50%', background:'rgba(138,92,246,0.15)', border:'2px solid rgba(138,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}><Github size={22} style={{ color:'#8a5cf6' }}/></div>
                    }
                    <div style={{ position:'absolute', bottom:2, right:2, width:10, height:10, borderRadius:'50%', background:'#22c55e', border:'2px solid #0a0812' }}/>
                  </div>
                  <div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:15, color:'#fff', letterSpacing:'1.5px' }}>
                      {data.name?.toUpperCase()}
                    </div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'1px', fontFamily:'Syne,sans-serif', marginTop:3 }}>
                      @{USERNAME} · PORTFOLIO INSIGHTS
                    </div>
                  </div>
                </div>

                {/* 4 metrics */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px 24px' }}>
                  {[
                    { icon:Star,               label:'Total Stars',    val:data.stars,   color:'#facc15' },
                    { icon:GitCommitHorizontal, label:'Total Commits',  val:data.commits, color:'#a78bfa' },
                    { icon:GitPullRequest,      label:'Pull Requests',  val:data.prs,     color:'#4ade80' },
                    { icon:CircleDot,           label:'Issues',         val:data.issues,  color:'#f87171' },
                  ].map(({ icon:Icon, label, val, color })=>(
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:3, height:34, borderRadius:99, background:color, boxShadow:`0 0 8px ${color}88`, flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:2 }}>{label}</div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'#fff', display:'flex', alignItems:'center', gap:5 }}>
                          <Icon size={12} style={{ color }}/> <CountUp value={val}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Donut Analytics Chart */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(138, 92, 246, 0.15)',
                borderRadius: 20, 
                padding: '24px 20px',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 14, 
                minWidth: isMobile ? '100%' : 210,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  fontSize: 10, 
                  color: 'rgba(255,255,255,0.4)', 
                  fontFamily: 'Syne,sans-serif', 
                  fontWeight: 800, 
                  letterSpacing: '1.5px', 
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  Language Distribution
                </div>
                
                <AnalyticsDonutChart 
                  langs={langs} 
                  hoveredIdx={hoveredIdx} 
                  setHoveredIdx={setHoveredIdx}
                  isMobile={isMobile}
                />
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 5,
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: 'Syne,sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginTop: 4
                }}>
                  <GitBranch size={10} style={{ color: '#a78bfa' }} />
                  Interactive Analytics
                </div>
              </div>
            </div>
          </Panel>

          {/* Right — language breakdown */}
          <Panel hover={false} style={{ padding:'26px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Code2 size={16} style={{ color:'#c084fc' }}/>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#fff' }}>Language Breakdown</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {langs.map((l, idx) => (
                <div 
                  key={l.name}
                  onMouseEnter={() => !isMobile && setHoveredIdx(idx)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  onClick={() => isMobile && setHoveredIdx(hoveredIdx === idx ? null : idx)}
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredIdx !== null ? (hoveredIdx === idx ? 1 : 0.4) : 1,
                    transform: hoveredIdx === idx ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <Bar label={l.name} pct={l.pct} color={l.color} bytes={l.bytes||null}/>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── Streak row ── */}
        <div className="fade-in" style={{ 
          display:'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', 
          gap: 14 
        }}>
          {streakCards.map(({ icon:Icon, label, val, color, pct, suffix })=>(
            <Panel key={label} accent style={{ padding:'22px 26px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                <Ring pct={pct} color={color} size={72} stroke={5}>
                  <Icon size={16} style={{ color }}/>
                </Ring>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize: isMobile ? 24 : 28, color:'#fff', lineHeight:1 }}>
                    <CountUp value={val}/>
                    {suffix && <span style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginLeft:4 }}>{suffix}</span>}
                  </div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginTop:6 }}>
                    {label}
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        {/* ── Contribution Section ── */}
        <div className="fade-in" style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto', 
          gap: isMobile ? 20 : 30,
          alignItems: 'start'
        }}>
          {/* Left — Heatmap */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ContributionHeatmap 
              rawData={data.rawContributions} 
              isMobile={isMobile} 
              selectedYear={selectedYear}
            />
          </div>

          {/* Right — Vertical Year Sidebar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            gap: 8, 
            marginTop: isMobile ? 0 : 30,
            justifyContent: isMobile ? 'flex-start' : 'flex-start',
            minWidth: isMobile ? 'auto' : 80
          }}>
            {[2026, 2025, 2024].map(y => {
              const active = selectedYear === y;
              return (
                <button 
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  style={{
                    padding: isMobile ? '6px 16px' : '10px 0',
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    background: active ? 'rgba(138, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? 'rgba(138, 92, 246, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: active ? '0 0 20px rgba(138, 92, 246, 0.2)' : 'none',
                    textAlign: 'center',
                    minWidth: isMobile ? 'auto' : 70,
                    letterSpacing: '1px'
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── View profile ── */}
        <div className="fade-in" style={{ textAlign:'center', marginTop:40 }}>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank" rel="noreferrer"
            className="btn-secondary"
            style={{ display:'inline-flex', alignItems:'center', gap:8 }}
          >
            <Github size={16}/> View Full GitHub Profile →
          </a>
        </div>

      </div>
    </section>
  );
}