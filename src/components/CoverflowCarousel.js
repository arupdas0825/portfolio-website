import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork, LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import './CoverflowCarousel.css';

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

/* ── Single Coverflow Card ── */
const CoverflowCard = React.memo(({ repo, position, onClick, isMobile }) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const isCenter = position === 'center';

  const videoUrl = REPO_VIDEOS[repo.name] || (repo.name ? REPO_VIDEOS[repo.name.toLowerCase()] : null);
  const imageUrl = getRepoImage(repo);
  const hasVideo = !!videoUrl;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isCenter) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isCenter]);

  return (
    <div
      className={`cf-card cf-card--${position}`}
      onClick={onClick}
      role="button"
      tabIndex={isCenter ? 0 : -1}
      aria-label={`Project: ${repo.name}`}
    >
      {/* Media Section */}
      <div className="cf-card__media">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              className={`cf-card__video ${videoLoaded ? 'cf-card__video--loaded' : ''}`}
              autoPlay={isCenter}
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
                className={`cf-card__poster ${videoLoaded ? 'cf-card__poster--hidden' : ''}`}
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}
          </>
        ) : imageUrl ? (
          <div className="cf-card__image" style={{ backgroundImage: `url(${imageUrl})` }} />
        ) : (
          <div className="cf-card__fallback" style={{ background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}22, rgba(10,8,18,0.95))` }}>
            <span className="cf-card__fallback-emoji">{getRepoEmoji(repo.language)}</span>
          </div>
        )}
        <div className="cf-card__media-gradient" />

        {/* Floating Badges */}
        <div className="cf-card__badges-top">
          {repo.language && (
            <span className="cf-card__lang-pill">
              <span className="cf-card__lang-dot" style={{ background: langColors[repo.language] || langColors.default }} />
              {repo.language}
            </span>
          )}
        </div>
        <div className="cf-card__badges-stats">
          <span className="cf-card__stat-pill"><LucideStar size={11} /> {repo.stargazers_count}</span>
          <span className="cf-card__stat-pill"><LucideGitFork size={11} /> {repo.forks_count}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="cf-card__divider"><div className="cf-card__divider-glow" /></div>

      {/* Info Section */}
      <div className="cf-card__info">
        <h3 className="cf-card__title">{repo.name}</h3>
        <p className="cf-card__desc">{repo.description || 'No description provided.'}</p>
        <div className="cf-card__actions" onClick={e => e.stopPropagation()}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="cf-card__action cf-card__action--github">
            <LucideGithub size={13} /> Code
          </a>
          {(repo.homepage || REPO_HOMEPAGES[repo.name]) && (
            <a href={repo.homepage || REPO_HOMEPAGES[repo.name]} target="_blank" rel="noreferrer" className="cf-card__action cf-card__action--demo">
              <LucideExternalLink size={13} /> Demo
            </a>
          )}
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="cf-card__ambient" />
    </div>
  );
});

/* ── Coverflow Carousel ── */
const CoverflowCarousel = ({ repos, onCardClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });

  const total = repos.length;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Wrapping index helper
  const wrap = useCallback((idx) => ((idx % total) + total) % total, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex(prev => wrap(prev + 1));
  }, [total, wrap]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex(prev => wrap(prev - 1));
  }, [total, wrap]);

  // Autoplay
  useEffect(() => {
    if (isPaused || total <= 1) {
      clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(goNext, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, goNext, total]);

  // Touch Swipe
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchMoveRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const dx = touchMoveRef.current.x - touchStartRef.current.x;
    const dy = Math.abs(touchMoveRef.current.y - touchStartRef.current.y);
    // Only trigger if horizontal swipe is dominant and significant
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Build the visible card slots
  const visibleCards = useMemo(() => {
    if (total === 0) return [];
    if (total === 1) return [{ repo: repos[0], position: 'center', idx: 0 }];
    if (total === 2) return [
      { repo: repos[wrap(activeIndex - 1)], position: 'left', idx: wrap(activeIndex - 1) },
      { repo: repos[activeIndex], position: 'center', idx: activeIndex },
    ];

    // Show 5 cards for depth: far-left, left, center, right, far-right
    return [
      { repo: repos[wrap(activeIndex - 2)], position: 'far-left', idx: wrap(activeIndex - 2) },
      { repo: repos[wrap(activeIndex - 1)], position: 'left', idx: wrap(activeIndex - 1) },
      { repo: repos[activeIndex], position: 'center', idx: activeIndex },
      { repo: repos[wrap(activeIndex + 1)], position: 'right', idx: wrap(activeIndex + 1) },
      { repo: repos[wrap(activeIndex + 2)], position: 'far-right', idx: wrap(activeIndex + 2) },
    ];
  }, [repos, activeIndex, total, wrap]);

  // Pagination dots (max 7 visible for cleanliness)
  const dots = useMemo(() => {
    const maxDots = Math.min(total, 7);
    const arr = [];
    let start = Math.max(0, activeIndex - Math.floor(maxDots / 2));
    if (start + maxDots > total) start = Math.max(0, total - maxDots);
    for (let i = start; i < start + maxDots; i++) {
      arr.push(i);
    }
    return arr;
  }, [total, activeIndex]);

  if (total === 0) return null;

  return (
    <div
      className="cf-carousel"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stage */}
      <div className="cf-stage">
        {visibleCards.map(({ repo, position, idx }) => (
          <CoverflowCard
            key={`${repo.id}-${position}`}
            repo={repo}
            position={position}
            isMobile={isMobile}
            onClick={() => {
              if (position === 'center') {
                onCardClick && onCardClick(repo);
              } else if (position === 'left' || position === 'far-left') {
                goPrev();
              } else {
                goNext();
              }
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button className="cf-nav cf-nav--prev" onClick={goPrev} aria-label="Previous project">
            <LucideChevronLeft size={22} />
          </button>
          <button className="cf-nav cf-nav--next" onClick={goNext} aria-label="Next project">
            <LucideChevronRight size={22} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {total > 1 && (
        <div className="cf-dots">
          {dots.map(i => (
            <button
              key={i}
              className={`cf-dot ${i === activeIndex ? 'cf-dot--active' : ''}`}
              onClick={() => {
                setActiveIndex(i);
              }}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="cf-counter">
        <span className="cf-counter__current">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="cf-counter__sep">/</span>
        <span className="cf-counter__total">{String(total).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default CoverflowCarousel;
