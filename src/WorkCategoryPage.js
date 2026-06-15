import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideArrowLeft, LucideGithub } from 'lucide-react';
import Navbar from './Navbar';
import ProjectDetails from './components/ProjectDetails';
import { MajorProjectCard, SecondaryProjectCard, CollegeProjectCard } from './Work';
import projectsConfig from './content/projects/projects-config.json';
import { supabase } from './supabase';

const GITHUB_USERNAME = 'arupdas0825';

// Category slug mapping
const CATEGORY_MAP = {
  'major-projects': {
    id: 'Major',
    title: 'Major Projects',
    subtitle: 'High-performance software architectures, distributed backends, and full-stack systems.',
    key: 'major',
    cardType: 'major'
  },
  'secondary-projects': {
    id: 'Secondary',
    title: 'Secondary Projects',
    subtitle: 'AI pipelines, machine learning experiments, and utility integrations.',
    key: 'secondary',
    cardType: 'secondary'
  },
  'academic-projects': {
    id: 'Academic',
    title: 'Academic Projects',
    subtitle: 'University research experiments, algorithmic visualizers, and educational tools.',
    key: 'college',
    cardType: 'college'
  }
};

const FALLBACK_REPOS = [
  { id: 1, name: 'LocalCare-Finder-Android', language: 'Kotlin', stargazers_count: 1, forks_count: 0, description: 'Find nearby hospitals, pharmacies & blood banks. Built with Kotlin, Google Maps, Flask.', html_url: 'https://github.com/arupdas0825/LocalCare-Finder-Android', homepage: '' },
  { id: 2, name: 'sahasrajit-foundation', language: 'JavaScript', stargazers_count: 2, forks_count: 0, description: 'Official website for Sahasrajit Foundation NGO. Integrated database dashboard.', html_url: 'https://github.com/arupdas0825/sahasrajit-foundation', homepage: '' },
  { id: 3, name: 'quiz-web', language: 'JavaScript', stargazers_count: 3, forks_count: 1, description: 'Online Examination System with ReactJs, 10-min countdown, grade calculation.', html_url: 'https://github.com/arupdas0825/quiz-web', homepage: 'https://quiz-web-demo.vercel.app' },
  { id: 4, name: 'arupdas0825', language: 'JavaScript', stargazers_count: 4, forks_count: 0, description: 'B.Tech CSE (AIML) | React Developer | Exploring AI, Algorithms & Full-Stack.', html_url: 'https://github.com/arupdas0825', homepage: '' },
  { id: 5, name: 'algorithm-visualizer', language: 'JavaScript', stargazers_count: 2, forks_count: 0, description: 'React-based Algorithm Visualizer animating sorting algorithms in real-time.', html_url: 'https://github.com/arupdas0825/algorithm-visualizer', homepage: '' },
  { id: 6, name: 'portfolio-website', language: 'JavaScript', stargazers_count: 3, forks_count: 0, description: 'Premium interactive portfolio with AI, React, photography. Cinematic experience.', html_url: 'https://github.com/arupdas0825/portfolio-website', homepage: 'https://arup-portfolio08.netlify.app' },
  { id: 7, name: 'Online-Examination-System-Java', language: 'Java', stargazers_count: 1, forks_count: 0, description: 'Scalable Java web app for online assessment with secure auth and auto-evaluation.', html_url: 'https://github.com/arupdas0825/Online-Examination-System-Java', homepage: '' },
  { id: 8, name: 'localcare-finder', language: 'CSS', stargazers_count: 1, forks_count: 0, description: 'Public utility web app to locate nearby healthcare services.', html_url: 'https://github.com/arupdas0825/localcare-finder', homepage: '' },
  { id: 9, name: 'studytra', language: 'JavaScript', stargazers_count: 5, forks_count: 1, description: 'Study Abroad platform for Indian students. Powered by Gemini AI.', html_url: 'https://github.com/arupdas0825/studytra', homepage: '' },
  { id: 10, name: 'Space-Combat-Game', language: 'JavaScript', stargazers_count: 5, forks_count: 0, description: 'A 3D space flight combat simulation game built with HTML Canvas, WebGL, and custom particle engines.', html_url: 'https://github.com/arupdas0825/Space-Combat-Game', homepage: '' },
];

export default function WorkCategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const category = CATEGORY_MAP[categorySlug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  useEffect(() => {
    if (!category) {
      navigate('/work');
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data: dbProjects, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (dbProjects && dbProjects.length > 0) {
          const mapped = dbProjects.map(p => {
            const techs = p.technologies ? p.technologies.split(',').map(t => t.trim()) : [];
            return {
              id: p.id,
              name: p.title,
              description: p.description || '',
              language: techs[0] || 'JavaScript',
              stargazers_count: p.featured ? 10 : 2,
              forks_count: 0,
              html_url: p.github_url || '',
              homepage: p.live_url || '',
              image: p.image_url || null,
              category: p.category || 'Major',
              featured: !!p.featured,
              display_order: p.display_order || 0
            };
          });
          setRepos(mapped);
        } else {
          await fetchGitHubRepos();
        }
      } catch (err) {
        console.error("Failed to load category projects from Supabase:", err);
        await fetchGitHubRepos();
      } finally {
        setLoading(false);
      }
    };

    const fetchGitHubRepos = async () => {
      const CACHE_KEY = `gh_repos_${GITHUB_USERNAME}`;
      const CACHE_TTL = 60 * 60 * 1000;

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL && Array.isArray(data) && data.length > 0) {
            setRepos(data);
            return;
          }
        }
      } catch (_) {}

      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers: { Accept: 'application/vnd.github.v3+json' } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const own = data.filter(r => !r.fork);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: own, ts: Date.now() }));
        } catch (_) {}
        setRepos(own);
      } catch (err) {
        setRepos(FALLBACK_REPOS);
      }
    };

    fetchProjects();
  }, [category, navigate]);

  if (!category) return null;

  // Process and sort projects for the specific active category slug
  const getCategoryProjects = () => {
    const list = [];
    const isDbDriven = repos.length > 0 && repos[0].category !== undefined;

    if (isDbDriven) {
      repos.forEach(repo => {
        if (repo.category === category.id) {
          list.push(repo);
        }
      });

      return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } else {
      const repoMap = {};
      repos.forEach(repo => {
        repoMap[repo.name.toLowerCase()] = repo;
      });

      const matchedNames = new Set();

      const configKeys = {
        'major': projectsConfig.major,
        'secondary': projectsConfig.secondary,
        'college': projectsConfig.college
      };

      const targetList = configKeys[category.key] || [];
      targetList.forEach(name => {
        const repo = repoMap[name.toLowerCase()];
        if (repo) {
          list.push(repo);
          matchedNames.add(name.toLowerCase());
        }
      });

      // Auto-append unmatched repos to Secondary
      if (category.key === 'secondary') {
        const allCurated = new Set([
          ...projectsConfig.major.map(n => n.toLowerCase()),
          ...projectsConfig.secondary.map(n => n.toLowerCase()),
          ...projectsConfig.college.map(n => n.toLowerCase())
        ]);

        repos.forEach(repo => {
          const lowerName = repo.name.toLowerCase();
          if (!allCurated.has(lowerName) && lowerName !== GITHUB_USERNAME.toLowerCase()) {
            list.push(repo);
          }
        });
      }

      // Sort dynamically by latest update activity
      return list.sort((a, b) => {
        const timeA = new Date(a.pushed_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.pushed_at || b.updated_at || 0).getTime();
        return timeB - timeA;
      });
    }
  };

  const filteredProjects = getCategoryProjects();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="workpage-root" 
      style={{ minHeight: '100vh', background: '#04020a', position: 'relative' }}
    >
      <Navbar />
      <button className="workpage-back" onClick={() => navigate('/#work')}>
        <LucideArrowLeft size={16} /> Back to Home
      </button>

      {/* Hero Header */}
      <div className="workpage-header" style={{ padding: '40px 16px 20px' }}>
        <span className="section-label">✦ CATEGORY ARCHIVE ✦</span>
        <h1 className="workpage-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          {category.title.split(' ')[0]} <span>{category.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="workpage-sub" style={{ maxWidth: '600px', margin: '16px auto 0', fontSize: '0.92rem' }}>
          {category.subtitle}
        </p>
      </div>

      {/* Grid Collections */}
      <div className="section-inner" style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div className="work-loading">
            <div className="work-loading-spinner" />
            <span>Assembling core matrix...</span>
          </div>
        ) : (
          <>
            {filteredProjects.length > 0 ? (
              <div 
                className={
                  category.cardType === 'major' 
                    ? 'projects-grid' 
                    : category.cardType === 'secondary'
                    ? 'secondary-projects-grid'
                    : 'college-projects-grid'
                }
                style={{ marginTop: '40px' }}
              >
                {filteredProjects.map((repo, idx) => {
                  if (category.cardType === 'major') {
                    return (
                      <MajorProjectCard
                        key={repo.id}
                        repo={repo}
                        idx={idx}
                        isMobile={true}
                        onClick={() => setSelected(repo)}
                      />
                    );
                  } else if (category.cardType === 'secondary') {
                    return (
                      <SecondaryProjectCard
                        key={repo.id}
                        repo={repo}
                        idx={idx}
                        onClick={() => setSelected(repo)}
                      />
                    );
                  } else {
                    return (
                      <CollegeProjectCard
                        key={repo.id}
                        repo={repo}
                        idx={idx}
                        onClick={() => setSelected(repo)}
                      />
                    );
                  }
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 80 }}>
                No projects found in this category.
              </p>
            )}

            <div className="workpage-footer" style={{ marginTop: '80px', display: 'flex', justifyContent: 'center' }}>
              <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <LucideGithub size={16} style={{ marginRight: '8px' }} /> View All on GitHub
              </a>
            </div>
          </>
        )}
      </div>

      {/* Project Details Modal */}
      {selected && <ProjectDetails repo={selected} onClose={() => setSelected(null)} />}
    </motion.div>
  );
}
