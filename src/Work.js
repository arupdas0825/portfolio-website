import React, { useEffect, useRef, useState } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork, LucideZap, LucideArrowRight, LucideChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectDetails from './components/ProjectDetails';
import CoverflowCarousel from './components/CoverflowCarousel';
import { fetchAndMergeProjects, REPO_VIDEOS, getRepoImage, langColors } from './utils/projectsFetcher';

const isMobileDevice = () => typeof window !== 'undefined' && window.innerWidth < 768;

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = 'arupdas0825';

function getRepoEmoji(lang) {
  const map = {
    JavaScript: '⚡', Python: '🐍', Java: '☕', Kotlin: '📱',
    TypeScript: '🔷', CSS: '🎨', HTML: '🌐', Dart: '🎯',
    'C++': '⚙️', C: '🔧', Go: '🐹', Rust: '🦀',
  };
  return map[lang] || '💻';
}

/* ── 1. MAJOR PROJECT CARD (Largest Premium Grid Layout) ── */
export const MajorProjectCard = React.memo(({ repo, idx, isMobile, onClick }) => {
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
export const SecondaryProjectCard = React.memo(({ repo, idx, onClick }) => {
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

/* ── 3. COLLEGE PROJECT CARD (Premium Cinematic Layout) ── */
export const CollegeProjectCard = React.memo(({ repo, idx, onClick }) => {
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="college-project-card"
      style={{ animationDelay: `${(idx % 6) * 0.04}s` }}
      onClick={onClick}
    >
      <div className="academic-media-section">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              className={`academic-video ${videoLoaded ? 'loaded' : ''}`}
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
                className={`academic-image placeholder ${videoLoaded ? 'fade-out' : ''}`}
                style={{ background: `url(${imageUrl}) center/cover no-repeat`, position: 'absolute', inset: 0 }}
              />
            )}
          </>
        ) : imageUrl ? (
          <div className="academic-image" style={{ background: `url(${imageUrl}) center/cover no-repeat`, width: '100%', height: '100%' }} />
        ) : (
          <div className="academic-fallback" style={{ background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}15, rgba(10,8,18,0.95))` }}>
            <div className="fallback-emoji">{getRepoEmoji(repo.language)}</div>
          </div>
        )}
        <div className="academic-media-gradient-overlay" />
        
        {/* Floating Academic tag badge */}
        <div className="academic-tag-indicator-floating">ACADEMIC</div>
        
        {/* Star Badge */}
        <div className="academic-meta-badges">
          <div className="academic-meta-badge"><LucideStar size={10} /> {repo.stargazers_count}</div>
        </div>
      </div>

      <div className="college-info-section">
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

  const [activeCategory, setActiveCategory] = useState('Major');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const loadProjects = async () => {
      setLoading(true);
      try {
        const merged = await fetchAndMergeProjects();
        setRepos(merged);
        setLanguages(['All', ...new Set(merged.map(r => r.language).filter(Boolean))]);
      } catch (err) {
        console.error("Failed to fetch merged projects:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Match repos against custom categories
  const categorizeRepos = () => {
    const major = [];
    const secondary = [];
    const college = [];

    repos.forEach(repo => {
      if (repo.category === 'Major') major.push(repo);
      else if (repo.category === 'Academic') college.push(repo);
      else secondary.push(repo); // 'Secondary' fallback
    });

    // Filter categories by selected language filter & sort dynamically
    const processList = (list) => {
      const filtered = filter === 'All' ? list : list.filter(r => r.language === filter);
      return [...filtered].sort((a, b) => {
        if (a.display_order !== undefined && b.display_order !== undefined && a.display_order !== 999 && b.display_order !== 999) {
          return a.display_order - b.display_order;
        }
        const timeA = new Date(a.pushed_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.pushed_at || b.updated_at || 0).getTime();
        return timeB - timeA;
      });
    };

    return {
      major: processList(major),
      secondary: processList(secondary),
      college: processList(college),
    };
  };

  const categorized = categorizeRepos();
  const hasContent = categorized.major.length > 0 || categorized.secondary.length > 0 || categorized.college.length > 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [repos, filter, activeCategory]);

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

        {/* Category Filters */}
        {!loading && (
          <div className="work-category-tabs-container fade-in" ref={addRef}>
            <div className="work-category-tabs">
              {[
                { id: 'Major', label: 'Major Projects', count: categorized.major.length },
                { id: 'Secondary', label: 'Secondary Projects', count: categorized.secondary.length },
                { id: 'Academic', label: 'Academic Projects', count: categorized.college.length }
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`work-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label} <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.6 }}>({cat.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="work-loading">
            <div className="work-loading-spinner" />
            <span>Curating projects...</span>
          </div>
        )}

        {/* Grid Categories with framer-motion transitions */}
        {!loading && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ width: '100%' }}
              >
                {/* Category 1: Major Projects — Coverflow Carousel */}
                {activeCategory === 'Major' && (
                  <div className="work-category-section">
                    {categorized.major.length > 0 ? (
                      <CoverflowCarousel
                        repos={categorized.major}
                        onCardClick={(repo) => setSelected(repo)}
                      />
                    ) : (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0' }}>
                        No Major projects found for the selected language.
                      </p>
                    )}
                  </div>
                )}

                {/* Category 2: Secondary Projects — Coverflow Carousel */}
                {activeCategory === 'Secondary' && (
                  <div className="work-category-section">
                    {categorized.secondary.length > 0 ? (
                      <CoverflowCarousel
                        repos={categorized.secondary}
                        onCardClick={(repo) => setSelected(repo)}
                      />
                    ) : (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0' }}>
                        No Secondary projects found for the selected language.
                      </p>
                    )}
                  </div>
                )}

                {/* Category 3: Academic Projects — Coverflow Carousel */}
                {activeCategory === 'Academic' && (
                  <div className="work-category-section">
                    {categorized.college.length > 0 ? (
                      <CoverflowCarousel
                        repos={categorized.college}
                        onCardClick={(repo) => setSelected(repo)}
                      />
                    ) : (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0' }}>
                        No Academic projects found for the selected language.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {!hasContent && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48 }}>
                No projects found for the selected language filter.
              </p>
            )}

            {/* ── Visual Footer Centered GitHub Button ── */}
            <div className="work-see-more fade-in" ref={addRef} style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
              <motion.a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center' }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <LucideGithub size={16} style={{ marginRight: 8 }} /> View All on GitHub
              </motion.a>
            </div>
          </>
        )}
      </div>

      {/* Project Details Modal */}
      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default React.memo(Work);

