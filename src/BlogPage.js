/**
 * BlogPage.js — /blog & /blog/:postSlug route
 * Dedicated page displaying all articles, research notes, and creative engineering thoughts.
 * Matches existing personal website design system (PublicationsPage.js & WorkPage.js pattern).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Search, Tag, X, User, ArrowRight, Share2, Check } from 'lucide-react';
import Navbar from './Navbar';
import { ScrollAnimatedSection } from './components/ScrollAnimatedSection';
import { BLOG_POSTS, BLOG_CATEGORIES } from './data/blogData';

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)')?.matches ||
   'ontouchstart' in window ||
   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

export default function BlogPage() {
  const navigate = useNavigate();
  const { postSlug } = useParams();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle postSlug param if navigated directly to /blog/:postSlug
  useEffect(() => {
    if (postSlug) {
      const found = BLOG_POSTS.find(p => p.slug === postSlug || p.id === postSlug);
      if (found) {
        setSelectedPost(found);
      }
    }
  }, [postSlug]);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') {
      setSelectedPost(null);
      if (postSlug) navigate('/blog');
    }
  }, [postSlug, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    if (postSlug) navigate('/blog');
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pubpage-root" style={{ minHeight: '100vh', paddingBottom: IS_TOUCH ? '120px' : '80px' }}>
      <Navbar />

      {/* Back Button */}
      <button className="pubpage-back" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to Home
      </button>

      {/* Header */}
      <div className="pubpage-header">
        <span className="section-label">✦ THOUGHTS, RESEARCH &amp; INSIGHTS ✦</span>
        <h1 className="pubpage-title">Articles &amp; <span>Writings</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="pubpage-sub">
          Engineering deep dives, machine learning architectures, frontend craft, and visual storytelling essays by Arup Das.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ maxWidth: '900px', margin: '0 auto 32px', padding: '0 20px' }}>
        <div style={{
          position: 'relative',
          marginBottom: '20px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search articles by title, keyword, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 46px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(138, 92, 246, 0.25)',
              borderRadius: '16px',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="pubpage-filters" style={{ justifyContent: 'center' }}>
          {BLOG_CATEGORIES.map(category => (
            <button
              key={category}
              className={`pub-filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              {category === 'All' && <span className="filter-count">{BLOG_POSTS.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <ScrollAnimatedSection intensity="subtle">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px',
        }}>
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              whileHover={{ y: -6 }}
              onClick={() => handleSelectPost(post)}
              style={{
                background: 'rgba(255, 255, 255, 0.028)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: '1px solid rgba(138, 92, 246, 0.22)',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Cover Image */}
              <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 8, 20, 0.9) 0%, rgba(10, 8, 20, 0.1) 60%, transparent 100%)'
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(10, 8, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${post.color || '#8a5cf6'}80`,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: post.color || '#c084fc',
                }}>
                  {post.category}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(0,0,0,0.65)',
                  padding: '3px 9px',
                  borderRadius: '12px',
                }}>
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '12px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {post.author}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.4,
                    marginBottom: '12px'
                  }}>
                    {post.title}
                  </h3>

                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: 'rgba(226, 217, 243, 0.75)',
                    lineHeight: 1.6,
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(138, 92, 246, 0.1)',
                          color: '#c4b5fd',
                          border: '1px solid rgba(138, 92, 246, 0.15)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: 'var(--purple-light, #a78bfa)',
                    }}>
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </ScrollAnimatedSection>

      {/* ── Full Article Reading Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="pub-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 4, 12, 0.88)',
              backdropFilter: 'blur(14px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              className="pub-modal-content"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                background: '#0e0b1c',
                border: '1px solid rgba(138, 92, 246, 0.35)',
                borderRadius: '24px',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(138,92,246,0.2)',
                position: 'relative',
                padding: '0'
              }}
            >
              {/* Modal Banner */}
              <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #0e0b1c 0%, rgba(14, 11, 28, 0.4) 60%, rgba(14, 11, 28, 0.8) 100%)'
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handleShare(selectedPost)}
                    title="Share Article"
                    style={{
                      background: 'rgba(10, 8, 20, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={16} color="#4ade80" /> : <Share2 size={16} />}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    title="Close"
                    style={{
                      background: 'rgba(10, 8, 20, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content Body */}
              <div style={{ padding: '32px 36px 48px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '14px'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'rgba(138, 92, 246, 0.2)',
                    color: '#c084fc',
                    fontWeight: 600
                  }}>
                    {selectedPost.category}
                  </span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>

                <h1 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.3,
                  marginBottom: '20px'
                }}>
                  {selectedPost.title}
                </h1>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '28px'
                }}>
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ddd6fe',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.98rem',
                  lineHeight: 1.85,
                  color: '#e2d9f3',
                  whiteSpace: 'pre-line'
                }}>
                  {selectedPost.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
