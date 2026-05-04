import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  Star, GitFork, Package, Users, UserPlus,
  Github, Trophy, Zap, Clock, Code2,
  GitCommitHorizontal, GitPullRequest, CircleDot, GitBranch
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

export default function GithubStats() {
  const sectionRef = useRef(null);
  const [data, setData] = useState({
    stars:0, forks:0, repos:0, followers:0, following:0,
    commits:0, prs:0, issues:0,
    contributions:0, currentStreak:0, longestStreak:0,
    topLang:'JavaScript', topLangPct:67,
    languages:[], avatarUrl:'', name:'Arup Das',
  });
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setData(data); setLoaded(true); return;
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
      let contributions=0, currentStreak=0, longestStreak=0;
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

              {/* Top language ring */}
              <div style={{
                background:'rgba(138,92,246,0.06)',
                border:'1px solid rgba(138,92,246,0.18)',
                 borderRadius:18, padding:'22px 18px',
                display:'flex', flexDirection:'column', alignItems:'center', gap:10, minWidth: isMobile ? '100%' : 150,
              }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>Top Language</div>
                <Ring pct={data.topLangPct} color={LANG_COLORS[data.topLang]||'#8a5cf6'} size={110} stroke={8}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'#fff' }}>{data.topLangPct}%</div>
                </Ring>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, color:LANG_COLORS[data.topLang]||'#a78bfa', letterSpacing:'0.5px' }}>
                  {data.topLang}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <GitBranch size={11} style={{ color:'rgba(255,255,255,0.25)' }}/>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'Syne,sans-serif' }}>Primary</span>
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
            {langs.map(l=>(
              <Bar key={l.name} label={l.name} pct={l.pct} color={l.color} bytes={l.bytes||null}/>
            ))}
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