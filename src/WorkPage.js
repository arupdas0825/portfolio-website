import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideArrowLeft, LucideGithub, LucideExternalLink,
  LucideStar, LucideGitFork, LucideZap
} from 'lucide-react';
import ProjectDetails from './components/ProjectDetails';
import Navbar from './Navbar';
import { ScrollAnimatedSection } from './components/ScrollAnimatedSection';
import { fetchAndMergeProjects, REPO_VIDEOS, REPO_HOMEPAGES, getRepoImage, langColors } from './utils/projectsFetcher';

const GITHUB_USERNAME = 'arupdas0825';

function getRepoEmoji(lang) {
  const map = {
    JavaScript: '⚡', Python: '🐍', Java: '☕', Kotlin: '📱',
    TypeScript: '🔷', CSS: '🎨', HTML: '🌐', Dart: '🎯',
    'C++': '⚙️', C: '🔧', Go: '🐹', Rust: '🦀',
  };
  return map[lang] || '💻';
}

/* ── 1. MAJOR PROJECT CARD FOR SUBPAGE ── */
const MajorProjectCard = React.memo(({ repo, idx, onClick }) => {
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
  const description = repo.description || 'No description provided.';
  const isLongDesc = description.length > 80;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: (idx % 12) * 0.04, type: 'spring', stiffness: 240, damping: 22 }}
      className={`premium-project-card ${isExpanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${(idx % 6) * 0.05}s` }}
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
          <div className="premium-desc-anim-container" style={{ height: isExpanded ? 'auto' : '38px', overflow: 'hidden' }}>
            <p className={`premium-desc-text ${isExpanded ? 'expanded' : 'collapsed'}`}>{description}</p>
          </div>
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

/* ── 2. SECONDARY PROJECT CARD FOR SUBPAGE ── */
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

/* ── 3. COLLEGE PROJECT CARD FOR SUBPAGE (Premium Cinematic Layout) ── */
const CollegeProjectCard = React.memo(({ repo, idx, onClick }) => {
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

/* ── Main WorkPage Component ── */
export default function WorkPage() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [languages, setLanguages] = useState(['All']);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const IS_TOUCH = typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
     'ontouchstart' in window ||
     navigator.maxTouchPoints > 0);

  return (
    <div className="workpage-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px', minHeight: '100vh', background: '#04020a' }}>
      <Navbar />
      <button className="workpage-back" onClick={() => navigate('/')}>
        <LucideArrowLeft size={16} /> Back to Home
      </button>

      {/* ── Header ── */}
      <div className="workpage-header">
        <span className="section-label">✦ INTERACTIVE WORK HUB ✦</span>
        <h1 className="workpage-title">Curated <span>Showcase</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="workpage-sub">
          Explore my manually categorized digital productions, structural ML engines, and university experiments.
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
          <span>Assembling curation matrix...</span>
        </div>
      )}

      {/* ── Curated Showcase Categories ── */}
      {!loading && (
        <div className="section-inner" style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto 80px' }}>
          <AnimatePresence mode="wait">
            {/* Category 1: Major Projects */}
            {categorized.major.length > 0 && (
              <ScrollAnimatedSection intensity="medium">
                <div className="work-category-section" style={{ marginTop: '32px' }}>
                  <div className="work-category-header">
                    <h3 className="work-category-title">
                      ✦ Major <span>Projects</span>
                      <span className="work-category-count">{categorized.major.length}</span>
                    </h3>
                    <div className="work-category-line" />
                  </div>
                  <div className="projects-grid">
                    {categorized.major.map((repo, idx) => (
                      <MajorProjectCard
                        key={repo.id}
                        repo={repo}
                        idx={idx}
                        onClick={() => setSelected(repo)}
                      />
                    ))}
                  </div>
                </div>
              </ScrollAnimatedSection>
            )}

            {/* Category 2: Secondary Projects */}
            {categorized.secondary.length > 0 && (
              <ScrollAnimatedSection intensity="medium">
                <div className="work-category-section">
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
                </div>
              </ScrollAnimatedSection>
            )}

            {/* Category 3: College Projects */}
            {categorized.college.length > 0 && (
              <ScrollAnimatedSection intensity="subtle">
                <div className="work-category-section">
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
                </div>
              </ScrollAnimatedSection>
            )}
          </AnimatePresence>

          {!hasContent && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48 }}>
              No projects found for the selected language filter.
            </p>
          )}

          <div className="workpage-footer" style={{ marginTop: '64px' }}>
            <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary">
              <LucideGithub size={16} style={{ marginRight: '8px' }} /> View All on GitHub
            </a>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
