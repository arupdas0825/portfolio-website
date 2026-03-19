import React, { useEffect, useRef, useState } from 'react';
import { LucideExternalLink, LucideGithub, LucideStar, LucideGitFork } from 'lucide-react';

const GITHUB_USERNAME = 'arupdas0825';

const langColors = {
  JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  Kotlin: '#A97BFF', TypeScript: '#2b7489', CSS: '#563d7c',
  HTML: '#e34c26', Dart: '#00B4AB', default: '#8a5cf6',
};

const Work = () => {
  const fadeRefs = useRef([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [languages, setLanguages] = useState(['All']);

  useEffect(() => {
    // সব repos fetch করো (max 100 per page, multiple pages support)
    const fetchAllRepos = async () => {
      try {
        let allRepos = [];
        let page = 1;
        while (true) {
          const res = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&page=${page}`
          );
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          allRepos = [...allRepos, ...data];
          if (data.length < 100) break;
          page++;
        }

        // Fork গুলো বাদ দাও (optional — fork রাখতে চাইলে এই line মুছো)
        const ownRepos = allRepos.filter(r => !r.fork);

        setRepos(ownRepos);

        // Unique languages collect করো filter এর জন্য
        const langs = ['All', ...new Set(ownRepos.map(r => r.language).filter(Boolean))];
        setLanguages(langs);
        setLoading(false);
      } catch (err) {
        console.error('GitHub fetch error:', err);
        setLoading(false);
      }
    };

    fetchAllRepos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [repos]);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const filtered = filter === 'All' ? repos : repos.filter(r => r.language === filter);

  return (
    <section id="work" className="page-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={addRef}>Featured <span>Work</span></h2>
        <div className="section-line fade-in" ref={addRef}></div>
        <p className="section-sub fade-in" ref={addRef}>
          All my GitHub projects — live from the API. New repos appear here automatically.
        </p>

        {/* Language Filter Pills */}
        {!loading && (
          <div className="work-filters fade-in" ref={addRef}>
            {languages.map(lang => (
              <button
                key={lang}
                className={`work-filter-btn ${filter === lang ? 'active' : ''}`}
                onClick={() => setFilter(lang)}
              >
                {lang !== 'All' && (
                  <span
                    className="filter-lang-dot"
                    style={{ background: langColors[lang] || langColors.default }}
                  />
                )}
                {lang}
                {lang === 'All' && <span className="filter-count">{repos.length}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="work-loading">
            <div className="work-loading-spinner" />
            <span>Fetching repos from GitHub...</span>
          </div>
        )}

        {/* Repos Grid */}
        {!loading && (
          <>
            <div className="projects-grid">
              {filtered.map((repo, idx) => (
                <div
                  key={repo.id}
                  className="project-card fade-in"
                  ref={addRef}
                  style={{ animationDelay: `${(idx % 6) * 0.08}s` }}
                >
                  {/* Thumb */}
                  <div
                    className="project-thumb"
                    style={{
                      background: `linear-gradient(135deg, ${(langColors[repo.language] || langColors.default)}18, rgba(10,8,18,0.9))`
                    }}
                  >
                    <div className="project-thumb-icon" style={{ fontSize: '2rem' }}>
                      {getRepoEmoji(repo.language)}
                    </div>
                    {/* Star & Fork */}
                    <div className="repo-meta-overlay">
                      <span><LucideStar size={11} /> {repo.stargazers_count}</span>
                      <span><LucideGitFork size={11} /> {repo.forks_count}</span>
                    </div>
                  </div>

                  <div className="project-body">
                    <div className="project-name">{repo.name}</div>
                    <div className="project-desc">
                      {repo.description || 'No description provided.'}
                    </div>

                    {/* Language + Topics */}
                    <div className="project-tags">
                      {repo.language && (
                        <span className="project-tag" style={{ borderColor: `${langColors[repo.language] || langColors.default}55` }}>
                          <span
                            style={{
                              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                              background: langColors[repo.language] || langColors.default,
                              marginRight: 5, flexShrink: 0,
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                    </div>

                    <div className="project-links">
                      <a
                        href={repo.html_url}
                        target="_blank" rel="noreferrer"
                        className="project-link github"
                      >
                        <LucideGithub size={14} /> GitHub
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank" rel="noreferrer"
                          className="project-link demo"
                        >
                          <LucideExternalLink size={14} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 32 }}>
                No repos found for this language.
              </p>
            )}

            <div className="work-view-all fade-in" ref={addRef}>
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank" rel="noreferrer"
                className="btn-secondary"
              >
                <LucideGithub size={16} />
                View All on GitHub
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Language → emoji mapping
function getRepoEmoji(lang) {
  const map = {
    JavaScript: '⚡', Python: '🐍', Java: '☕', Kotlin: '📱',
    TypeScript: '🔷', CSS: '🎨', HTML: '🌐', Dart: '🎯',
    'C++': '⚙️', C: '🔧', Go: '🐹', Rust: '🦀',
    Ruby: '💎', PHP: '🐘', Swift: '🍎',
  };
  return map[lang] || '💻';
}

export default Work;