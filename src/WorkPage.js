import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideArrowLeft, LucideGithub, LucideExternalLink,
  LucideStar, LucideGitFork, LucideX, LucideZap, LucideLoader,
} from 'lucide-react';
import ProjectDetails from './components/ProjectDetails';
import Navbar from './Navbar';

const GITHUB_USERNAME = 'arupdas0825';

const langColors = {
  JavaScript:'#f1e05a', Python:'#3572A5', Java:'#b07219',
  Kotlin:'#A97BFF', TypeScript:'#2b7489', CSS:'#563d7c',
  HTML:'#e34c26', Dart:'#00B4AB', default:'#8a5cf6',
};

const REPO_IMAGES = {
  'scientific-calculator': '/scientific-calculator.jpeg',
  'ai-code-translator': '/ai-code-translator.png',
  'arupdas0825': '/arupdas0825.jpeg',
  'client-portfolio': '/client-portfolio.png',
  'EverBond-Wealth': '/EverBond-Wealth.png',
  'portfolio-website': '/portfolio-website.jpeg',
  'sentiment-analysis-project': '/sentiment-analysis-project.png',
  'streamnest': '/streamnest.png',
  'algorithm-visualizer': '/algorithm-visualizer.png',
  'quiz-web': '/quiz-web.png',
  'studytra': '/studytra.png',
  'sahasrajit-foundation': '/sahasrajit-foundation.png',
  'Hiresight-ai': '/Hiresight-ai.png',
  'LocalCare-Finder-Android': '/LocalCare-Finder-Android.jpeg',
};

const REPO_HOMEPAGES = {
  'scientific-calculator': 'https://arupdas0825.github.io/scientific-calculator/scientific-complex-calculator.html',
  'sentiment-analysis-project': 'https://sentiment-analysis-project-zvtb4q6vncknfc5qvkb63w.streamlit.app/',
};

function getEmoji(lang) {
  return { JavaScript:'⚡', Python:'🐍', Java:'☕', Kotlin:'📱', TypeScript:'🔷', CSS:'🎨', HTML:'🌐', Dart:'🎯', 'C++':'⚙️' }[lang] || '💻';
}



/* ── FALLBACK REPOS (same list as Work.js) ── */
const FALLBACK_REPOS = [
  { id:1, name:'LocalCare-Finder-Android', language:'Kotlin', stargazers_count:1, forks_count:0, description:'Find nearby hospitals, pharmacies & blood banks. Built with Kotlin, Google Maps, Flask.', html_url:'https://github.com/arupdas0825/LocalCare-Finder-Android', homepage:'' },
  { id:2, name:'sahasrajit-foundation', language:'JavaScript', stargazers_count:2, forks_count:0, description:'Official website for Sahasrajit Foundation NGO. Firebase-powered admin panel.', html_url:'https://github.com/arupdas0825/sahasrajit-foundation', homepage:'' },
  { id:3, name:'quiz-web', language:'JavaScript', stargazers_count:3, forks_count:1, description:'Online Examination System with ReactJs, 10-min countdown, grade calculation.', html_url:'https://github.com/arupdas0825/quiz-web', homepage:'https://quiz-web-demo.vercel.app' },
  { id:4, name:'arupdas0825', language:'JavaScript', stargazers_count:4, forks_count:0, description:'B.Tech CSE (AIML) | React Developer | Exploring AI, Algorithms & Full-Stack.', html_url:'https://github.com/arupdas0825', homepage:'' },
  { id:5, name:'algorithm-visualizer', language:'JavaScript', stargazers_count:2, forks_count:0, description:'React-based Algorithm Visualizer animating sorting algorithms in real-time.', html_url:'https://github.com/arupdas0825/algorithm-visualizer', homepage:'' },
  { id:6, name:'portfolio-website', language:'JavaScript', stargazers_count:3, forks_count:0, description:'Premium interactive portfolio with AI, React, photography. Cinematic experience.', html_url:'https://github.com/arupdas0825/portfolio-website', homepage:'https://arup-portfolio08.netlify.app' },
  { id:7, name:'Online-Examination-System-Java', language:'Java', stargazers_count:1, forks_count:0, description:'Scalable Java web app for online assessment with secure auth and auto-evaluation.', html_url:'https://github.com/arupdas0825/Online-Examination-System-Java', homepage:'' },
  { id:8, name:'localcare-finder', language:'CSS', stargazers_count:1, forks_count:0, description:'Public utility web app to locate nearby healthcare services.', html_url:'https://github.com/arupdas0825/localcare-finder', homepage:'' },
  { id:9, name:'studytra', language:'JavaScript', stargazers_count:5, forks_count:1, description:'Study Abroad platform for Indian students. Powered by Gemini AI.', html_url:'https://github.com/arupdas0825/studytra', homepage:'' },
];

/* ── Main WorkPage Component ── */
export default function WorkPage() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [languages, setLanguages] = useState(['All']);
  const [selected, setSelected] = useState(null);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const CACHE_KEY = `gh_repos_${GITHUB_USERNAME}`;
    const CACHE_TTL = 60 * 60 * 1000;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(data) && data.length > 0) {
          setRepos(data); setLanguages(['All', ...new Set(data.map(r => r.language).filter(Boolean))]); setLoading(false); return;
        }
      }
    } catch (_) {}

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers: { Accept: 'application/vnd.github.v3+json' } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const own = data.filter(r => !r.fork);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: own, ts: Date.now() })); } catch (_) {}
        setRepos(own); setLanguages(['All', ...new Set(own.map(r => r.language).filter(Boolean))]);
      })
      .catch(() => { setRepos(FALLBACK_REPOS); setLanguages(['All', ...new Set(FALLBACK_REPOS.map(r => r.language).filter(Boolean))]); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? repos : repos.filter(r => r.language === filter);

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

  return (
    <div className="workpage-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px' }}>
      <Navbar />
      <button className="workpage-back" onClick={() => navigate('/')}>
        <LucideArrowLeft size={16} /> Back to Home
      </button>

      {/* ── Header ── */}
      <div className="workpage-header">
        <span className="section-label">✦ OPEN SOURCE WORK ✦</span>
        <h1 className="workpage-title">My <span>Work</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="workpage-sub">
          A premium collection of projects showcasing my expertise in AI, full-stack development, and system design. Click for a deep dive.
        </p>
      </div>

      {/* ── Filter tabs ── */}
      {!loading && (
        <div className="work-filters workpage-filters">
          {languages.map(lang => (
            <button key={lang} className={`work-filter-btn ${filter === lang ? 'active' : ''}`} onClick={() => setFilter(lang)}>
              {lang !== 'All' && <span className="filter-lang-dot" style={{ background: langColors[lang] || langColors.default }} />}
              {lang}
              {lang === 'All' && <span className="filter-count">{repos.length}</span>}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="work-loading">
          <div className="work-loading-spinner" />
          <span>Fetching repos from GitHub...</span>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <>
          <div className="projects-grid workpage-grid">
            {filtered.map((repo, idx) => (
              <motion.div
                key={repo.id}
                className="project-card"
                style={{ cursor: 'pointer', animationDelay: `${(idx % 6) * 0.06}s` }}
                onClick={() => setSelected(repo)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 12) * 0.05, type: 'spring', stiffness: 240, damping: 22 }}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(138,92,246,0.25)' }}
              >
                <div className="project-thumb" style={{ 
                  background: REPO_IMAGES[repo.name] 
                    ? `url(${REPO_IMAGES[repo.name]}) center/cover no-repeat`
                    : `linear-gradient(135deg,${(langColors[repo.language] || langColors.default)}18,rgba(10,8,18,0.9))` 
                }}>
                  {!REPO_IMAGES[repo.name] && (
                    <div className="project-thumb-icon" style={{ fontSize: '2rem' }}>{getEmoji(repo.language)}</div>
                  )}
                  <div className="repo-meta-overlay">
                    <span><LucideStar size={11} /> {repo.stargazers_count}</span>
                    <span><LucideGitFork size={11} /> {repo.forks_count}</span>
                  </div>
                  <div style={{ position:'absolute', bottom:10, left:12, display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,0.6)', fontFamily:'Syne,sans-serif', fontWeight: 700 }}>
                    <LucideZap size={10} style={{ color: 'var(--purple-light)' }} /> View Case Study
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-name">{repo.name}</div>
                  <div className="project-desc">{repo.description || 'No description provided.'}</div>
                  <div className="project-tags">
                    {repo.language && (
                      <span className="project-tag" style={{ borderColor: `${langColors[repo.language] || langColors.default}55` }}>
                        <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background: langColors[repo.language] || langColors.default, marginRight:5 }} />
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="project-links" onClick={e => e.stopPropagation()}>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="project-link github"><LucideGithub size={14} /> GitHub</a>
                    {(repo.homepage || REPO_HOMEPAGES[repo.name]) && <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="project-link demo"><LucideExternalLink size={14} /> Live Demo</a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 32 }}>No projects found.</p>}

          <div className="workpage-footer">
            <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary">
              <LucideGithub size={16} /> View All on GitHub
            </a>
          </div>
        </>
      )}

      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
