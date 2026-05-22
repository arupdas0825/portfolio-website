import React, { useEffect, useRef, useState } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork, LucideZap, LucideArrowRight, LucideChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectDetails from './components/ProjectDetails';
import projectsConfig from './content/projects/projects-config.json';

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
  'Space-Combat-Game': '/Space-Combat-Game.png',
};

const REPO_VIDEOS = {
  'portfolio-website': '/videos/portfolio-website.mp4',
  'streamnest': '/videos/streamnest.mp4',
  'HireSight-AI': '/videos/HireSight-AI.mp4',
  'EverBond-Wealth': '/videos/everbond-wealth.mp4',
  'Space-Combat-Game': '/videos/Space-Combat-Game.mp4',
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

const getRepoImage = (repo) => {
  if (repo.image) return repo.image;
  if (!repo.name) return null;
  const name = repo.name.toLowerCase();
  const keys = Object.keys(REPO_IMAGES);
  const matchKey = keys.find(k => k.toLowerCase() === name);
  return matchKey ? REPO_IMAGES[matchKey] : null;
};

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
  {
    id: 10, name: 'Space-Combat-Game', fork: false,
    description: 'A 3D space flight combat simulation game built with HTML Canvas, WebGL, and custom particle engines.',
    language: 'JavaScript', stargazers_count: 5, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/Space-Combat-Game', homepage: '',
    languages_url: '',
  },
];

/* ── 1. MAJOR PROJECT CARD (Largest Premium Grid Layout) ── */
const MajorProjectCard = React.memo(({ repo, idx, isMobile, onClick }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setIsIntersecting(e.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isIntersecting]);

  const videoUrl = REPO_VIDEOS[repo.name] || (repo.name ? REPO_VIDEOS[repo.name.toLowerCase()] : null);
  const imageUrl = getRepoImage(repo);
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
            <div className="premium-image" style={{ background: `url(${imageUrl}) center/cover no-repeat` }} />
          ) : (
            <div className="premium-fallback" style={{ background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}15, rgba(10,8,18,0.95))` }}>
              <div className="fallback-emoji">{getRepoEmoji(repo.language)}</div>
            </div>
          )}
        </div>
        <div className="premium-media-gradient-overlay" />
        <div className="premium-meta-badges">
          <div className="premium-meta-badge"><LucideStar size={11} /> {repo.stargazers_count}</div>
          <div className="premium-meta-badge"><LucideGitFork size={11} /> {repo.forks_count}</div>
        </div>
        {repo.language && (
          <div className="premium-lang-badge">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: langColors[repo.language] || langColors.default, marginRight: 6 }} />
            {repo.language}
          </div>
        )}
      </div>
      <div className="premium-section-divider"><div className="divider-glow-line" /></div>
      <div className="premium-info-section">
        <div className="premium-info-header">
          <h3 className="premium-title">{repo.name}</h3>
          <span className="premium-hint-zap"><LucideZap size={11} /></span>
        </div>
        <div className="premium-desc-wrapper">
          <motion.div layout="position" animate={{ height: isExpanded ? 'auto' : '38px' }} className="premium-desc-anim-container">
            <p className={`premium-desc-text ${isExpanded ? 'expanded' : 'collapsed'}`}>{description}</p>
          </motion.div>
          {isLongDesc && (
            <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="premium-showmore-btn">
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div className="premium-actions-footer" onClick={e => e.stopPropagation()}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="premium-action-link github"><LucideGithub size={13} /> Code</a>
          {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
            <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="premium-action-link demo"><LucideExternalLink size={13} /> Demo</a>
          )}
        </div>
      </div>
      <div className="premium-card-ambient-glow" />
    </motion.div>
  );
});

/* ── 2. SECONDARY PROJECT CARD (Medium Visual Grid Layout) ── */
const SecondaryProjectCard = React.memo(({ repo, idx, onClick }) => {
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setIsIntersecting(e.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isIntersecting]);

  const videoUrl = REPO_VIDEOS[repo.name] || (repo.name ? REPO_VIDEOS[repo.name.toLowerCase()] : null);
  const imageUrl = getRepoImage(repo);
  const hasVideo = !!videoUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="secondary-project-card"
      style={{ animationDelay: `${(idx % 6) * 0.05}s` }}
      onClick={onClick}
    >
      <div className="secondary-media-section">
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            {imageUrl && (
              <div
                className={`premium-image placeholder ${videoLoaded ? 'fade-out' : ''}`}
                style={{ background: `url(${imageUrl}) center/cover no-repeat`, position: 'absolute', inset: 0 }}
              />
            )}
          </>
        ) : imageUrl ? (
          <div className="premium-image" style={{ background: `url(${imageUrl}) center/cover no-repeat`, width: '100%', height: '100%' }} />
        ) : (
          <div className="premium-fallback" style={{ background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}15, rgba(10,8,18,0.95))` }}>
            <div className="fallback-emoji">{getRepoEmoji(repo.language)}</div>
          </div>
        )}
        <div className="premium-meta-badges">
          <div className="premium-meta-badge"><LucideStar size={10} /> {repo.stargazers_count}</div>
        </div>
      </div>
      <div className="secondary-info-section">
        <h4 className="secondary-title">{repo.name}</h4>
        <p className="secondary-desc">{repo.description || 'No description provided.'}</p>
        <div className="premium-actions-footer" onClick={e => e.stopPropagation()} style={{ marginTop: 'auto', paddingTop: 8 }}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="premium-action-link github" style={{ padding: '6px 14px', fontSize: '0.75rem' }}><LucideGithub size={12} /> Code</a>
          {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
            <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="premium-action-link demo" style={{ padding: '6px 14px', fontSize: '0.75rem' }}><LucideExternalLink size={12} /> Demo</a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ── 3. COLLEGE PROJECT CARD (Compact Premium Glassmorphic Layout) ── */
const CollegeProjectCard = React.memo(({ repo, idx, onClick }) => {
  const imageUrl = getRepoImage(repo);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="college-project-card"
      style={{ animationDelay: `${(idx % 6) * 0.04}s` }}
      onClick={onClick}
    >
      <div className="academic-tag-indicator">ACADEMIC PROJECT</div>
      
      {imageUrl ? (
        <div className="academic-media-section">
          <div className="academic-image" style={{ background: `url(${imageUrl}) center/cover no-repeat` }} />
          <div className="academic-media-gradient-overlay" />
        </div>
      ) : (
        <div className="academic-media-section">
          <div className="academic-fallback" style={{ background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}15, rgba(10,8,18,0.95))` }}>
            <div className="fallback-emoji">{getRepoEmoji(repo.language)}</div>
          </div>
        </div>
      )}

      <div className="college-header">
        <div className="college-title-group">
          <h4 className="college-title">{repo.name}</h4>
        </div>
        <span className="college-icon-emoji">{getRepoEmoji(repo.language)}</span>
      </div>
      <p className="college-desc">{repo.description || 'No description provided.'}</p>
      <div className="college-footer">
        {repo.language && (
          <span className="college-lang">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: langColors[repo.language] || langColors.default, marginRight: 6 }} />
            {repo.language}
          </span>
        )}
        <div className="college-links" onClick={e => e.stopPropagation()}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="premium-action-link github" style={{ padding: '6px 12px', fontSize: '0.72rem', gap: '5px' }} title="Code"><LucideGithub size={11} /> Code</a>
          {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
            <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="premium-action-link demo" style={{ padding: '6px 12px', fontSize: '0.72rem', gap: '5px' }} title="Live Demo"><LucideExternalLink size={11} /> Demo</a>
          )}
        </div>
      </div>
      <div className="academic-card-ambient-glow" />
    </motion.div>
  );
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14,
    },
  },
};

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInitialLimit = () => {
    if (windowWidth < 640) return 3;
    if (windowWidth < 992) return 4;
    return 6;
  };

  const initialLimit = getInitialLimit();

  const handleToggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      setTimeout(() => {
        window.scrollBy({
          top: 280,
          behavior: 'smooth'
        });
      }, 150);
    } else {
      setTimeout(() => {
        const el = document.getElementById('work');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    const CACHE_TTL = 60 * 60 * 1000;

    const fetchAllRepos = async () => {
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

      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
          { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
        const ownRepos = data.filter(r => !r.fork);

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

  // Match repos against custom categories in projects-config.json
  const categorizeRepos = () => {
    const repoMap = {};
    repos.forEach(repo => {
      repoMap[repo.name.toLowerCase()] = repo;
    });

    const major = [];
    const secondary = [];
    const college = [];
    const matchedNames = new Set();

    // 1. Curated Major
    projectsConfig.major.forEach(name => {
      const repo = repoMap[name.toLowerCase()];
      if (repo) {
        major.push(repo);
        matchedNames.add(name.toLowerCase());
      }
    });

    // 2. Curated Secondary
    projectsConfig.secondary.forEach(name => {
      const repo = repoMap[name.toLowerCase()];
      if (repo) {
        secondary.push(repo);
        matchedNames.add(name.toLowerCase());
      }
    });

    // 3. Curated College
    projectsConfig.college.forEach(name => {
      const repo = repoMap[name.toLowerCase()];
      if (repo) {
        college.push(repo);
        matchedNames.add(name.toLowerCase());
      }
    });

    // 4. Unmatched GitHub repos: auto append at the end of Secondary
    repos.forEach(repo => {
      const lowerName = repo.name.toLowerCase();
      if (!matchedNames.has(lowerName) && lowerName !== GITHUB_USERNAME.toLowerCase()) {
        secondary.push(repo);
      }
    });

    // Filter categories by selected language filter
    const applyFilter = (list) => {
      return filter === 'All' ? list : list.filter(r => r.language === filter);
    };

    return {
      major: applyFilter(major),
      secondary: applyFilter(secondary),
      college: applyFilter(college),
    };
  };

  const categorized = categorizeRepos();
  const hasContent = categorized.major.length > 0 || categorized.secondary.length > 0 || categorized.college.length > 0;
  
  const totalMajorProjects = categorized.major.length;
  const visibleMajor = isExpanded ? categorized.major : categorized.major.slice(0, initialLimit);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [repos, filter]);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section id="work" className="page-section">
      <div className="section-inner">
        <span className="section-label fade-in" ref={addRef}>✦ CURATED PORTFOLIO SHOWCASE ✦</span>
        <h2 className="section-title fade-in" ref={r => { addRef(r); titleRef.current = r; }}>Featured <span>Work</span></h2>
        <div className="section-line fade-in" ref={addRef} />
        <p className="section-sub fade-in" ref={addRef}>
          A hand-picked selection of major software architectures, secondary AI projects, and college experiments.
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
            <span>Curating projects...</span>
          </div>
        )}

        {/* Grid Categories */}
        {!loading && (
          <>
            <AnimatePresence mode="popLayout">
              {/* Category 1: Major Projects */}
              {categorized.major.length > 0 && (
                <div className="work-category-section fade-in" ref={addRef}>
                  <div className="work-category-header">
                    <h3 className="work-category-title">
                      ✦ Major <span>Projects</span>
                      <span className="work-category-count">{categorized.major.length}</span>
                    </h3>
                    <div className="work-category-line" />
                  </div>
                  <motion.div layout="position" className="projects-grid">
                    <AnimatePresence mode="popLayout">
                      {visibleMajor.map((repo, idx) => (
                        <MajorProjectCard
                          key={repo.id}
                          repo={repo}
                          idx={idx}
                          isMobile={isMobile}
                          onClick={() => setSelected(repo)}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Centralized Premium Show More Button (Shown only when collapsed) */}
                  {!isExpanded && (
                    <div className="major-expand-btn-container">
                      <motion.button
                        className="major-expand-btn"
                        onClick={handleToggleExpand}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        layoutId="expand-toggle-btn"
                      >
                        <span className="major-expand-btn-shimmer" />
                        <span>Explore More Work</span>
                        <span className="major-expand-btn-icon">
                          <LucideChevronDown size={16} />
                        </span>
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Secondary & College Categories — Staggered and sequentially revealed when expanded */}
              {isExpanded && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ width: '100%' }}
                >
                  {/* Category 2: Secondary Projects */}
                  {categorized.secondary.length > 0 && (
                    <motion.div variants={sectionVariants} className="work-category-section fade-in" ref={addRef}>
                       <div className="work-category-header">
                        <h3 className="work-category-title">
                          ✦ Secondary <span>Architectures</span>
                          <span className="work-category-count">{categorized.secondary.length}</span>
                        </h3>
                        <div className="work-category-line" />
                      </div>
                      <div className="secondary-projects-grid">
                        {categorized.secondary.map((repo, idx) => (
                          <SecondaryProjectCard
                            key={repo.id}
                            repo={repo}
                            idx={idx}
                            onClick={() => setSelected(repo)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Category 3: College Projects */}
                  {categorized.college.length > 0 && (
                    <motion.div variants={sectionVariants} className="work-category-section fade-in" ref={addRef}>
                      <div className="work-category-header">
                        <h3 className="work-category-title">
                          ✦ Academic <span>Projects</span>
                          <span className="work-category-count">{categorized.college.length}</span>
                        </h3>
                        <div className="work-category-line" />
                      </div>
                      <div className="college-projects-grid">
                        {categorized.college.map((repo, idx) => (
                          <CollegeProjectCard
                            key={repo.id}
                            repo={repo}
                            idx={idx}
                            onClick={() => setSelected(repo)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Centralized Premium Show Less Button (Shown at the very bottom when expanded) */}
                  <motion.div 
                    variants={sectionVariants} 
                    className="major-expand-btn-container" 
                    style={{ marginTop: '48px', marginBottom: '16px' }}
                  >
                    <motion.button
                      className="major-expand-btn expanded"
                      onClick={handleToggleExpand}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      layoutId="expand-toggle-btn"
                    >
                      <span className="major-expand-btn-shimmer" />
                      <span>Show Less</span>
                      <span className="major-expand-btn-icon" style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
                        <LucideChevronDown size={16} />
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {!hasContent && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48 }}>
                No projects found for the selected language filter.
              </p>
            )}

            {/* ── Visual Footer Buttons ── */}
            <div className="work-see-more fade-in" ref={addRef} style={{ marginTop: '56px' }}>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  className="work-see-more-btn"
                  onClick={() => navigate('/work')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  Explore Interactive Work Hub
                  <LucideArrowRight size={16} />
                </motion.button>

                <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <LucideGithub size={16} style={{ marginRight: 8 }} /> View All on GitHub
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project Details Modal */}
      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default Work;
