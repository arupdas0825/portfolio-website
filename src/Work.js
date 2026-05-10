import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork, LucideX, LucideZap, LucideArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectDetails from './components/ProjectDetails';

const MOBILE_LIMIT = 4;
const isMobileDevice = () => typeof window !== 'undefined' && window.innerWidth < 768;

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = 'arupdas0825';

const langColors = {
  JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  Kotlin: '#A97BFF', TypeScript: '#2b7489', CSS: '#563d7c',
  HTML: '#e34c26', Dart: '#00B4AB', default: '#8a5cf6',
};

const REPO_IMAGES = {
  'scientific-calculator': '/scientific-calculator.png',
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
  'NEURAL-RIFT': '/NEURAL-RIFT.png',
  'HyperLane': '/HyperLane.jpeg',
};

const REPO_HOMEPAGES = {
  'scientific-calculator': 'https://arupdas0825.github.io/scientific-calculator/scientific-complex-calculator.html',
  'sentiment-analysis-project': 'https://sentiment-analysis-project-zvtb4q6vncknfc5qvkb63w.streamlit.app/',
};

function getRepoEmoji(lang) {
  const map = {
    JavaScript: '⚡', Python: '🐍', Java: '☕', Kotlin: '📱',
    TypeScript: '🔷', CSS: '🎨', HTML: '🌐', Dart: '🎯',
    'C++': '⚙️', C: '🔧', Go: '🐹', Rust: '🦀',
  };
  return map[lang] || '💻';
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
  const [isExpanded, setIsExpanded] = useState(false);
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
      } catch (_) { }

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
        } catch (_) { }

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

  const filtered = filter === 'All' ? repos : repos.filter(r => r.language === filter);

  const DESKTOP_LIMIT = 6;
  // On mobile: cap at MOBILE_LIMIT cards in the homepage section
  // On desktop: cap at DESKTOP_LIMIT cards initially
  const visibleRepos = isMobile
    ? filtered.slice(0, MOBILE_LIMIT)
    : (isExpanded ? filtered : filtered.slice(0, DESKTOP_LIMIT));

  const hasMoreMobile = isMobile && filtered.length > MOBILE_LIMIT;
  const hasMoreDesktop = !isMobile && filtered.length > DESKTOP_LIMIT;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [visibleRepos]);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section id="work" className="page-section">
      <div className="section-inner">
        <span className="section-label fade-in" ref={addRef}>✦ OPEN SOURCE WORK ✦</span>
        <h2 className="section-title fade-in" ref={r => { addRef(r); titleRef.current = r; }}>My <span>Works</span></h2>
        <div className="section-line fade-in" ref={addRef} />
        <p className="section-sub fade-in" ref={addRef}>
          All my GitHub projects — live from the API. Click any card for a deep dive into the case study.
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
              <AnimatePresence mode="popLayout">
                {visibleRepos.map((repo, idx) => (
                  <motion.div
                    key={repo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="project-card fade-in"
                    ref={addRef}
                    style={{ animationDelay: `${(idx % 6) * 0.08}s`, cursor: 'pointer' }}
                    onClick={() => setSelected(repo)}
                    whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(138,92,246,0.25)' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  >
                    <div className="project-thumb" style={{
                      background: REPO_IMAGES[repo.name]
                        ? `url(${REPO_IMAGES[repo.name]}) center/cover no-repeat`
                        : `linear-gradient(135deg,${(langColors[repo.language] || langColors.default)}18,rgba(10,8,18,0.9))`
                    }}>
                      {!REPO_IMAGES[repo.name] && (
                        <div className="project-thumb-icon" style={{ fontSize: '2rem' }}>{getRepoEmoji(repo.language)}</div>
                      )}
                      <div className="repo-meta-overlay">
                        <span><LucideStar size={11} /> {repo.stargazers_count}</span>
                        <span><LucideGitFork size={11} /> {repo.forks_count}</span>
                      </div>
                      <div style={{
                        position: 'absolute', bottom: 10, left: 12,
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 10, color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'Syne,sans-serif',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        <LucideZap size={10} style={{ color: 'var(--purple-light)' }} /> View Case Study
                      </div>
                    </div>
                    <div className="project-body">
                      <div className="project-name">{repo.name}</div>
                      <div className="project-desc">{repo.description || 'No description provided.'}</div>
                      <div className="project-tags">
                        {repo.language && (
                          <span className="project-tag" style={{ borderColor: `${langColors[repo.language] || langColors.default}55` }}>
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: langColors[repo.language] || langColors.default, marginRight: 5, flexShrink: 0 }} />
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <div className="project-links" onClick={e => e.stopPropagation()}>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" className="project-link github">
                          <LucideGithub size={14} /> GitHub
                        </a>
                        {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
                          <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="project-link demo">
                            <LucideExternalLink size={14} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 32 }}>No repos found for this language.</p>
            )}

            {/* ── Mobile CTA: See More Work ── */}
            {hasMoreMobile && (
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

            {/* ── Desktop CTA: Toggle Expand / View All ── */}
            {!isMobile && (
              <div className="work-see-more fade-in" ref={addRef} style={{ marginTop: '48px' }}>
                {hasMoreDesktop && (
                  <motion.button
                    className="work-see-more-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ marginBottom: isExpanded ? '24px' : '0' }}
                  >
                    {isExpanded ? 'Show Less' : '✨ See More Work'}
                  </motion.button>
                )}

                <div className="work-view-all" style={{ marginTop: isExpanded ? '0' : (hasMoreDesktop ? '20px' : '0') }}>
                  <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary">
                    <LucideGithub size={16} /> View All on GitHub
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Details Modal */}
      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default Work;
