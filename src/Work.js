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
  'HireSight-AI': '/HireSight-AI.png',
  'LocalCare-Finder-Android': '/LocalCare-Finder-Android.jpeg',
  'NEURAL-RIFT': '/NEURAL-RIFT.png',
  'HyperLane': '/HyperLane.jpeg',
};

const REPO_VIDEOS = {
  'portfolio-website': '/videos/portfolio-website.mp4',
  'streamnest': '/videos/streamnest.mp4',
  'HireSight-AI': '/videos/hiresight-ai.mp4',
  'EverBond-Wealth': '/videos/everbond-wealth.mp4',
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

// ── Premium Cinematic Project Card Component ────────────────────────────────
const ProjectCard = React.memo(({ repo, idx, isMobile, onClick }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isIntersecting) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent catch for autoplay restrictions
        });
      }
    } else {
      video.pause();
    }
  }, [isIntersecting]);

  const videoUrl = REPO_VIDEOS[repo.name];
  const imageUrl = REPO_IMAGES[repo.name];
  const hasVideo = !!videoUrl;
  const description = repo.description || 'No description provided.';
  const isLongDesc = description.length > 80;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={`premium-project-card ${isExpanded ? 'expanded' : ''} fade-in ${isMobile ? 'mobile-card' : ''}`}
      style={{ animationDelay: `${(idx % 6) * 0.08}s` }}
      onClick={onClick}
    >
      {/* 1. TOP SECTION: Media Preview Area (takes 65-75% height) */}
      <div className="premium-media-section">
        <div className="premium-media-container">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                className={`premium-video ${videoLoaded ? 'loaded' : ''}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setVideoLoaded(true)}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              {imageUrl && (
                <div
                  className={`premium-image placeholder ${videoLoaded ? 'fade-out' : ''}`}
                  style={{ background: `url(${imageUrl}) center/cover no-repeat` }}
                />
              )}
            </>
          ) : imageUrl ? (
            <div
              className="premium-image"
              style={{ background: `url(${imageUrl}) center/cover no-repeat` }}
            />
          ) : (
            <div
              className="premium-fallback"
              style={{
                background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}15, rgba(10,8,18,0.95))`
              }}
            >
              <div className="fallback-emoji">{getRepoEmoji(repo.language)}</div>
            </div>
          )}
        </div>

        {/* Ambient Dark Gradient Separation Overlay */}
        <div className="premium-media-gradient-overlay" />

        {/* Floating Stars and Forks on Media Overlays */}
        <div className="premium-meta-badges">
          <div className="premium-meta-badge">
            <LucideStar size={11} /> {repo.stargazers_count}
          </div>
          <div className="premium-meta-badge">
            <LucideGitFork size={11} /> {repo.forks_count}
          </div>
        </div>

        {/* Floating Language Badge */}
        {repo.language && (
          <div className="premium-lang-badge">
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: langColors[repo.language] || langColors.default,
                marginRight: 6
              }}
            />
            {repo.language}
          </div>
        )}
      </div>

      {/* 2. VISUAL SEPARATION: Premium Divider Line & Glow */}
      <div className="premium-section-divider">
        <div className="divider-glow-line" />
      </div>

      {/* 3. BOTTOM SECTION: Compact Project Info Area */}
      <div className="premium-info-section">
        {/* Title */}
        <div className="premium-info-header">
          <h3 className="premium-title">{repo.name}</h3>
          <span className="premium-hint-zap">
            <LucideZap size={11} />
          </span>
        </div>

        {/* Description & Expandable Toggle */}
        <div className="premium-desc-wrapper">
          <motion.div
            layout="position"
            animate={{ height: isExpanded ? 'auto' : '38px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="premium-desc-anim-container"
          >
            <p className={`premium-desc-text ${isExpanded ? 'expanded' : 'collapsed'}`}>
              {description}
            </p>
          </motion.div>

          {isLongDesc && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="premium-showmore-btn"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="premium-actions-footer" onClick={e => e.stopPropagation()}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="premium-action-link github">
            <LucideGithub size={13} /> Code
          </a>
          {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
            <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="premium-action-link demo">
              <LucideExternalLink size={13} /> Demo
            </a>
          )}
        </div>
      </div>

      {/* Ambient Outer Hover Glow Layer */}
      <div className="premium-card-ambient-glow" />
    </motion.div>
  );
});

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
                  <ProjectCard
                    key={repo.id}
                    repo={repo}
                    idx={idx}
                    isMobile={isMobile}
                    onClick={() => setSelected(repo)}
                  />
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
