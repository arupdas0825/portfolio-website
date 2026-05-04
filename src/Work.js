import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork, LucideX, LucideFileText, LucideLoader, LucideArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MOBILE_LIMIT = 4;
const isMobileDevice = () => typeof window !== 'undefined' && window.innerWidth < 768;
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = 'arupdas0825';

const langColors = {
  JavaScript:'#f1e05a', Python:'#3572A5', Java:'#b07219',
  Kotlin:'#A97BFF', TypeScript:'#2b7489', CSS:'#563d7c',
  HTML:'#e34c26', Dart:'#00B4AB', default:'#8a5cf6',
};

const REPO_IMAGES = {
  'scientific-calculator': '/scientific-calculator.png',
  'ai-code-translator': '/ai-code-translator.png',
  'arupdas0825': '/arupdas0825.jpeg',
  'client-portfolio': '/client-portfolio.png',
  'EverBond-Wealth': '/EverBond-Wealth.png',
  'portfolio-website': '/portfolio-website.png',
  'sentiment-analysis-project': '/sentiment-analysis-project.png',
  'streamnest': '/streamnest.png',
  'algorithm-visualizer': '/algorithm-visualizer.png',
  'quiz-web': '/quiz-web.png',
  'studytra': '/studytra.png',
  'sahasrajit-foundation': '/sahasrajit-foundation.png',
  'Hiresight-ai': '/Hiresight-ai.png',
};

const REPO_HOMEPAGES = {
  'scientific-calculator': 'https://arupdas0825.github.io/scientific-calculator/scientific-complex-calculator.html',
  'sentiment-analysis-project': 'https://sentiment-analysis-project-zvtb4q6vncknfc5qvkb63w.streamlit.app/',
};

function getRepoEmoji(lang) {
  const map = {
    JavaScript:'⚡', Python:'🐍', Java:'☕', Kotlin:'📱',
    TypeScript:'🔷', CSS:'🎨', HTML:'🌐', Dart:'🎯',
    'C++':'⚙️', C:'🔧', Go:'🐹', Rust:'🦀',
  };
  return map[lang] || '💻';
}

/* ── Markdown → HTML renderer (handles HTML in README) ── */
function renderMarkdown(md) {
  if (!md) return '';

  // 1. Extract & protect code blocks first
  const codeBlocks = [];
  md = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="rm-pre"><code class="rm-code">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`);
    return `%%CODEBLOCK_${idx}%%`;
  });

  // 2. Protect inline code
  const inlineCodes = [];
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code class="rm-inline">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code>`);
    return `%%INLINE_${idx}%%`;
  });

  // 3. Strip HTML tags that README might have (div, img, br, etc.)
  //    Keep content inside, remove the tags themselves
  md = md
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<img[^>]*\/>/gi, '') // remove images (badges etc. dont render in modal)
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '<a href="$1" target="_blank" rel="noreferrer" class="rm-link">$2</a>')
    .replace(/<[^>]+>/g, ''); // strip any remaining tags

  // 4. Headings
  md = md
    .replace(/^#{4,} (.+)$/gm, '<h4 class="rm-h4">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="rm-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="rm-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="rm-h1">$1</h1>');

  // 5. Bold / italic
  md = md
    .replace(/\*\*(.+?)\*\*/g, '<strong class="rm-bold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="rm-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="rm-em">$1</em>');

  // 6. Links
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="rm-link">$1</a>');

  // 7. Images — skip badges, show alt text
  md = md.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // 8. Horizontal rule
  md = md.replace(/^---+$/gm, '<hr class="rm-hr"/>');

  // 9. Tables
  md = md.replace(/^\|(.+)\|$/gm, (line) => {
    const cells = line.split('|').slice(1,-1).map(c => c.trim());
    if(cells.every(c => /^[-: ]+$/.test(c))) return '%%TABLE_SEP%%';
    return '<tr>' + cells.map(c => `<td class="rm-td">${c}</td>`).join('') + '</tr>';
  });
  md = md.replace(/(<tr>.*?<\/tr>\n?)+/gs, (table) => {
    const rows = table.trim().split('\n').filter(r => !r.includes('%%TABLE_SEP%%'));
    if(rows.length === 0) return '';
    const [header, ...body] = rows;
    const thead = header.replace(/td/g,'th class="rm-th"').replace(/class="rm-td"/g,'class="rm-th"');
    return `<table class="rm-table"><thead>${thead}</thead><tbody>${body.join('')}</tbody></table>`;
  });
  md = md.replace(/%%TABLE_SEP%%\n?/g, '');

  // 10. Lists
  md = md
    .replace(/^\s*[-*] (.+)$/gm, '<li class="rm-li">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="rm-li rm-oli">$1</li>');

  // 11. Paragraphs
  md = md.replace(/\n{2,}/g, '</p><p class="rm-p">');
  md = `<p class="rm-p">${md}</p>`;

  // 12. Restore code blocks & inline codes
  codeBlocks.forEach((block, i) => { md = md.replace(`%%CODEBLOCK_${i}%%`, block); });
  inlineCodes.forEach((code, i) => { md = md.replace(`%%INLINE_${i}%%`, code); });

  return md;
}

/* ── README Modal ── */
function ReadmeModal({ repo, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const fetchReadme = async () => {
      setLoading(true); setNotFound(false);
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`,
          { headers: { Accept: 'application/vnd.github.v3.raw' } }
        );
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const text = await res.text();
        setContent(text);
      } catch (_) { setNotFound(true); }
      finally { setLoading(false); }
    };
    fetchReadme();
  }, [repo.name]);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.82)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 20px 20px 20px', // top padding clears navbar
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 820,
            maxHeight: '88vh',
            background: 'rgba(18,12,36,0.97)',
            border: '1px solid rgba(138,92,246,0.3)',
            borderRadius: 24,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(138,92,246,0.12)',
          }}
        >
          {/* Top sheen */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(138,92,246,0.6),transparent)',
          }}/>

          {/* Header */}
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(138,92,246,0.06)',
            flexShrink: 0,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${langColors[repo.language] || langColors.default}18`,
              border: `1px solid ${langColors[repo.language] || langColors.default}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {getRepoEmoji(repo.language)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'#fff', marginBottom:3 }}>
                {repo.name}
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {repo.description || 'No description'}
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              {/* Language */}
              {repo.language && (
                <span style={{
                  display:'flex', alignItems:'center', gap:5,
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:20, padding:'4px 12px',
                  fontSize:11, fontFamily:'Syne,sans-serif', fontWeight:700,
                  color:'rgba(255,255,255,0.6)',
                }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:langColors[repo.language]||langColors.default, display:'inline-block' }}/>
                  {repo.language}
                </span>
              )}
              {/* Stars */}
              <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(255,255,255,0.4)' }}>
                <LucideStar size={12}/> {repo.stargazers_count}
              </span>
              {/* GitHub link */}
              <a
                href={repo.html_url} target="_blank" rel="noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  background:'var(--purple)', color:'#fff',
                  padding:'7px 14px', borderRadius:20,
                  fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:12,
                  textDecoration:'none',
                }}
              >
                <LucideGithub size={13}/> GitHub
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage} target="_blank" rel="noreferrer"
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    background:'transparent', color:'var(--purple-light)',
                    border:'1px solid var(--purple)',
                    padding:'7px 14px', borderRadius:20,
                    fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:12,
                    textDecoration:'none',
                  }}
                >
                  <LucideExternalLink size={13}/> Live Demo
                </a>
              )}
              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  width:34, height:34, borderRadius:'50%',
                  background:'rgba(255,255,255,0.06)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(255,255,255,0.7)', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(138,92,246,0.3)'; e.currentTarget.style.color='#fff'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; }}
              >
                <LucideX size={15}/>
              </button>
            </div>
          </div>

          {/* README body */}
          <div style={{ flex:1, overflowY:'auto', padding:'28px 36px' }}>
            {loading && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:200, gap:16, color:'rgba(255,255,255,0.35)' }}>
                <LucideLoader size={28} style={{ animation:'spin 1s linear infinite', color:'var(--purple)' }}/>
                <span style={{ fontFamily:'Syne,sans-serif', fontSize:13 }}>Fetching README...</span>
              </div>
            )}

            {!loading && notFound && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:200, gap:12, color:'rgba(255,255,255,0.3)' }}>
                <LucideFileText size={40} style={{ color:'rgba(138,92,246,0.4)' }}/>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'rgba(255,255,255,0.5)' }}>No README found</div>
                <p style={{ fontSize:13, textAlign:'center', maxWidth:300, lineHeight:1.6 }}>
                  This repository doesn't have a README yet.
                </p>
                <a href={repo.html_url} target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:6, background:'var(--purple)', color:'#fff', padding:'8px 18px', borderRadius:20, fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  <LucideGithub size={14}/> View on GitHub
                </a>
              </div>
            )}

            {!loading && !notFound && content && (
              <>
                <style>{`
                  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                  .rm-h1{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;color:#fff;margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.08);}
                  .rm-h2{font-family:'Syne',sans-serif;font-weight:700;font-size:1.15rem;color:#e2d9f3;margin:22px 0 10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);}
                  .rm-h3{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;color:#a78bfa;margin:16px 0 8px;}
                  .rm-h4{font-family:'Syne',sans-serif;font-weight:600;font-size:0.9rem;color:#c084fc;margin:12px 0 6px;}
                  .rm-p{font-family:'DM Sans',sans-serif;font-size:13.5px;color:rgba(255,255,255,0.62);line-height:1.8;margin:0 0 10px;}
                  .rm-link{color:#a78bfa;text-decoration:underline;word-break:break-all;}
                  .rm-inline{background:rgba(138,92,246,0.15);border:1px solid rgba(138,92,246,0.2);border-radius:5px;padding:1px 7px;font-family:monospace;font-size:12px;color:#c084fc;}
                  .rm-pre{background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;overflow-x:auto;margin:12px 0;}
                  .rm-code{font-family:monospace;font-size:12.5px;color:rgba(255,255,255,0.82);white-space:pre;}
                  .rm-li{font-family:'DM Sans',sans-serif;font-size:13.5px;color:rgba(255,255,255,0.62);line-height:1.8;margin:3px 0;padding-left:16px;position:relative;list-style:none;}
                  .rm-li::before{content:'›';position:absolute;left:0;color:#8a5cf6;font-weight:700;}
                  .rm-hr{border:none;border-top:1px solid rgba(255,255,255,0.07);margin:18px 0;}
                  .rm-bold{color:rgba(255,255,255,0.88);font-weight:700;}
                  .rm-em{color:rgba(255,255,255,0.58);font-style:italic;}
                  .rm-table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px;}
                  .rm-th{padding:8px 12px;background:rgba(138,92,246,0.15);border:1px solid rgba(255,255,255,0.07);color:#a78bfa;font-family:'Syne',sans-serif;font-weight:700;text-align:left;}
                  .rm-td{padding:7px 12px;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.62);font-family:'DM Sans',sans-serif;vertical-align:top;}
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


/* ── Fallback repos (shown when API rate-limited) ── */
const FALLBACK_REPOS = [
  {
    id: 1, name: 'LocalCare-Finder-Android', fork: false,
    description: 'LocalCare Finder — Find nearby hospitals, pharmacies & blood banks across India instantly. Built with Kotlin, Google Maps, Flask & OpenStreetMap API.',
    language: 'Kotlin', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/LocalCare-Finder-Android', homepage: '',
    languages_url: '',
  },
  {
    id: 2, name: 'sahasrajit-foundation', fork: false,
    description: 'Built the official website for Sahasrajit Foundation, a grassroots NGO. Firebase-powered admin panel.',
    language: 'JavaScript', stargazers_count: 2, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/sahasrajit-foundation', homepage: '',
    languages_url: '',
  },
  {
    id: 3, name: 'quiz-web', fork: false,
    description: 'A modern Online Examination System built with ReactJs. Features DBMS, OOPS, Python, C, DSA, 10-min countdown timer, grade calculation.',
    language: 'JavaScript', stargazers_count: 3, forks_count: 1,
    html_url: 'https://github.com/arupdas0825/quiz-web', homepage: 'https://quiz-web-demo.vercel.app',
    languages_url: '',
  },
  {
    id: 4, name: 'arupdas0825', fork: false,
    description: 'B.Tech CSE (AIML) | React Developer | Exploring AI, Algorithms & Full-Stack Development',
    language: 'JavaScript', stargazers_count: 4, forks_count: 0,
    html_url: 'https://github.com/arupdas0825', homepage: '',
    languages_url: '',
  },
  {
    id: 5, name: 'algorithm-visualizer', fork: false,
    description: 'A React-based Algorithm Visualizer that animates sorting algorithms like Bubble Sort for real-time visualization.',
    language: 'JavaScript', stargazers_count: 2, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/algorithm-visualizer', homepage: '',
    languages_url: '',
  },
  {
    id: 6, name: 'portfolio-website', fork: false,
    description: 'A premium interactive portfolio blending Artificial Intelligence, software engineering, and cinematic photography. Built with React, Tailwind CSS.',
    language: 'JavaScript', stargazers_count: 3, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/portfolio-website', homepage: 'https://arup-portfolio08.netlify.app',
    languages_url: '',
  },
  {
    id: 7, name: 'Online-Examination-System-Java', fork: false,
    description: 'A robust, scalable Java web application for seamless online assessment management with secure user authentication and automated evaluation.',
    language: 'Java', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/Online-Examination-System-Java', homepage: '',
    languages_url: '',
  },
  {
    id: 8, name: 'localcare-finder', fork: false,
    description: 'LocalCare Finder is a public utility web app to help users quickly locate nearby healthcare services using location-based search.',
    language: 'CSS', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/localcare-finder', homepage: '',
    languages_url: '',
  },
  {
    id: 9, name: 'studytra', fork: false,
    description: 'Study Abroad Execution Platform for Indian students wanting to study in Germany, USA or Canada. Powered by Gemini AI.',
    language: 'JavaScript', stargazers_count: 5, forks_count: 1,
    html_url: 'https://github.com/arupdas0825/studytra', homepage: '',
    languages_url: '',
  },
];

/* ── Main Work Component ── */
const Work = () => {
  const fadeRefs = useRef([]);
  const titleRef = useRef(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [languages, setLanguages] = useState(['All']);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileDevice);
  const navigate = useNavigate();

  // Track viewport changes
  useEffect(() => {
    const onResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // GSAP ScrollTrigger on heading
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    const CACHE_KEY = `gh_repos_${GITHUB_USERNAME}`;
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    const fetchAllRepos = async () => {
      // ── 1. Try localStorage cache first ──
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL && Array.isArray(data) && data.length > 0) {
            setRepos(data);
            setLanguages(['All', ...new Set(data.map(r => r.language).filter(Boolean))]);
            setLoading(false);
            return;
          }
        }
      } catch (_) {}

      // ── 2. Fetch from API ──
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
          { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );

        if (!res.ok) throw new Error(`API ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');

        const ownRepos = data.filter(r => !r.fork);

        // Cache in localStorage
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: ownRepos, ts: Date.now() }));
        } catch (_) {}

        setRepos(ownRepos);
        setLanguages(['All', ...new Set(ownRepos.map(r => r.language).filter(Boolean))]);
      } catch (err) {
        console.warn('GitHub API failed, using fallback:', err.message);
        setRepos(FALLBACK_REPOS);
        setLanguages(['All', ...new Set(FALLBACK_REPOS.map(r => r.language).filter(Boolean))]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRepos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [repos]);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };
  const filtered = filter === 'All' ? repos : repos.filter(r => r.language === filter);
  // On mobile: cap at MOBILE_LIMIT cards in the homepage section
  const visibleRepos = isMobile ? filtered.slice(0, MOBILE_LIMIT) : filtered;
  const hasMore = isMobile && filtered.length > MOBILE_LIMIT;

  return (
    <section id="work" className="page-section">
      <div className="section-inner">
        <span className="section-label fade-in" ref={addRef}>✦ OPEN SOURCE WORK ✦</span>
        <h2 className="section-title fade-in" ref={r => { addRef(r); titleRef.current = r; }}>My <span>Works</span></h2>
        <div className="section-line fade-in" ref={addRef} />
        <p className="section-sub fade-in" ref={addRef}>
          All my GitHub projects — live from the API. Click any card to read the README.
        </p>

        {/* Filter pills — hidden on mobile to keep it clean */}
        {!loading && !isMobile && (
          <div className="work-filters fade-in" ref={addRef}>
            {languages.map(lang => (
              <button key={lang} className={`work-filter-btn ${filter === lang ? 'active' : ''}`} onClick={() => setFilter(lang)}>
                {lang !== 'All' && <span className="filter-lang-dot" style={{ background: langColors[lang] || langColors.default }} />}
                {lang}
                {lang === 'All' && <span className="filter-count">{repos.length}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="work-loading">
            <div className="work-loading-spinner" />
            <span>Fetching repos from GitHub...</span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            <div className="projects-grid">
              {visibleRepos.map((repo, idx) => (
                <motion.div
                  key={repo.id}
                  className="project-card fade-in"
                  ref={addRef}
                  style={{ animationDelay:`${(idx%6)*0.08}s`, cursor:'pointer' }}
                  onClick={() => setSelected(repo)}
                  whileHover={{ y:-6, boxShadow:'0 20px 50px rgba(138,92,246,0.25)' }}
                  transition={{ type:'spring', stiffness:260, damping:22 }}
                >
                  <div className="project-thumb" style={{ 
                    background: REPO_IMAGES[repo.name] 
                      ? `url(${REPO_IMAGES[repo.name]}) center/cover no-repeat`
                      : `linear-gradient(135deg,${(langColors[repo.language]||langColors.default)}18,rgba(10,8,18,0.9))` 
                  }}>
                    {!REPO_IMAGES[repo.name] && (
                      <div className="project-thumb-icon" style={{ fontSize:'2rem' }}>{getRepoEmoji(repo.language)}</div>
                    )}
                    <div className="repo-meta-overlay">
                      <span><LucideStar size={11}/> {repo.stargazers_count}</span>
                      <span><LucideGitFork size={11}/> {repo.forks_count}</span>
                    </div>
                    <div style={{
                      position:'absolute', bottom:10, left:12,
                      display:'flex', alignItems:'center', gap:5,
                      fontSize:10, color:'rgba(255,255,255,0.4)',
                      fontFamily:'Syne,sans-serif',
                    }}>
                      <LucideFileText size={10}/> Click to read README
                    </div>
                  </div>
                  <div className="project-body">
                    <div className="project-name">{repo.name}</div>
                    <div className="project-desc">{repo.description || 'No description provided.'}</div>
                    <div className="project-tags">
                      {repo.language && (
                        <span className="project-tag" style={{ borderColor:`${langColors[repo.language]||langColors.default}55` }}>
                          <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:langColors[repo.language]||langColors.default, marginRight:5, flexShrink:0 }}/>
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <div className="project-links" onClick={e => e.stopPropagation()}>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="project-link github">
                        <LucideGithub size={14}/> GitHub
                      </a>
                      {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
                        <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="project-link demo">
                          <LucideExternalLink size={14}/> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p style={{ textAlign:'center', color:'var(--text-muted)', marginTop:32 }}>No repos found for this language.</p>
            )}

            {/* ── Mobile CTA: See More Work ── */}
            {hasMore && (
              <div className="work-see-more fade-in" ref={addRef}>
                <motion.button
                  className="work-see-more-btn"
                  onClick={() => navigate('/work')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  See More Work
                  <LucideArrowRight size={16} />
                </motion.button>
                <p className="work-see-more-hint">
                  {filtered.length - MOBILE_LIMIT} more projects available
                </p>
              </div>
            )}

            {/* Desktop: View All on GitHub */}
            {!isMobile && (
              <div className="work-view-all fade-in" ref={addRef}>
                <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary">
                  <LucideGithub size={16}/> View All on GitHub
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* README Modal */}
      {selected && <ReadmeModal repo={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default Work;
