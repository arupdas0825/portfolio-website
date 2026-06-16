import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideArrowLeft, LucideGithub } from 'lucide-react';
import Navbar from './Navbar';
import ProjectDetails from './components/ProjectDetails';
import { MajorProjectCard, SecondaryProjectCard, CollegeProjectCard } from './Work';
import { fetchAndMergeProjects } from './utils/projectsFetcher';

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

    const loadProjects = async () => {
      setLoading(true);
      try {
        const merged = await fetchAndMergeProjects();
        setRepos(merged);
      } catch (err) {
        console.error("Failed to fetch merged projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [category, navigate]);

  if (!category) return null;

  // Process and sort projects for the specific active category slug
  const getCategoryProjects = () => {
    const list = repos.filter(repo => repo.category === category.id);
    return list.sort((a, b) => {
      if (a.display_order !== undefined && b.display_order !== undefined && a.display_order !== 999 && b.display_order !== 999) {
        return a.display_order - b.display_order;
      }
      const timeA = new Date(a.pushed_at || a.updated_at || 0).getTime();
      const timeB = new Date(b.pushed_at || b.updated_at || 0).getTime();
      return timeB - timeA;
    });
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
