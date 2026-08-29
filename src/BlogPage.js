import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Calendar, Search, Tag, User,
  ArrowRight, Share2, Check, BookOpen, Sparkles,
  ChevronRight, Bookmark
} from 'lucide-react';
import Navbar from './Navbar';
import { ScrollAnimatedSection } from './components/ScrollAnimatedSection';
import { BLOG_POSTS, BLOG_CATEGORIES } from './data/blogData';

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)')?.matches ||
   'ontouchstart' in window ||
   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

// Markdown-like content renderer for rich article typography
function ArticleBody({ content }) {
  if (!content) return null;

  const paragraphs = content.split('\n\n');

  return (
    <div className="blog-article-content">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();

        // H3 Header
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={pIdx} className="blog-content-h3">
              <span className="blog-content-h3-bar" />
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // H2 Header
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={pIdx} className="blog-content-h2">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Bullet lists
        if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').filter(l => l.trim().startsWith('- '));
          return (
            <ul key={pIdx} className="blog-content-list">
              {items.map((item, iIdx) => {
                const itemText = item.replace(/^- /, '');
                // Handle bold inside bullet
                const parts = itemText.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={iIdx} className="blog-content-list-item">
                    <span className="blog-list-bullet" />
                    <span>
                      {parts.map((part, pPartIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pPartIdx} className="blog-content-strong">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph with bold and inline code parsing
        const parts = trimmed.split(/(\*\*.*?\*\*|`.*?`)/g);
        return (
          <p key={pIdx} className="blog-content-p">
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx} className="blog-content-strong">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={partIdx} className="blog-content-code">{part.slice(1, -1)}</code>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { postSlug } = useParams();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Scroll to top whenever slug or route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [postSlug]);

  // Find active article if postSlug is in URL
  const activePost = useMemo(() => {
    if (!postSlug) return null;
    return BLOG_POSTS.find(p => p.slug === postSlug || p.id === postSlug) || null;
  }, [postSlug]);

  // Filtered posts for listing page
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Related articles for single post view
  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return BLOG_POSTS.filter(p => p.id !== activePost.id).slice(0, 2);
  }, [activePost]);

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

  // ══════════════════════════════════════════════════════════════════════
  // VIEW 1: DEDICATED INDIVIDUAL BLOG POST VIEW
  // ══════════════════════════════════════════════════════════════════════
  if (activePost) {
    return (
      <div className="pubpage-root" style={{ minHeight: '100vh', paddingBottom: IS_TOUCH ? '120px' : '80px' }}>
        <Navbar />

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumb Navigation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '28px',
            paddingTop: '20px'
          }}>
            <button
              className="pubpage-back"
              onClick={() => navigate('/blogs')}
              style={{ margin: 0 }}
            >
              <ArrowLeft size={16} />
              Back to All Articles
            </button>

            <button
              onClick={() => handleShare(activePost)}
              className="blog-share-btn"
              title="Share this article"
            >
              {copied ? (
                <>
                  <Check size={15} color="#4ade80" />
                  <span style={{ color: '#4ade80' }}>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Article Header & Meta */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '32px' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <span style={{
                padding: '5px 14px',
                borderRadius: '20px',
                background: 'rgba(138, 92, 246, 0.15)',
                border: `1px solid ${activePost.color || '#8a5cf6'}80`,
                color: activePost.color || '#c084fc',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                {activePost.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                <Calendar size={14} /> {activePost.date}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                <Clock size={14} /> {activePost.readTime}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              {activePost.title}
            </h1>

            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.1rem',
              color: 'rgba(226, 217, 243, 0.85)',
              lineHeight: 1.7,
              borderLeft: `3px solid ${activePost.color || '#8a5cf6'}`,
              paddingLeft: '16px',
              margin: '0 0 28px 0',
              fontStyle: 'italic'
            }}>
              {activePost.excerpt}
            </p>

            {/* Author Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: 'fit-content'
            }}>
              <img
                src="/ad-logo.jpeg"
                alt="Arup Das"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Arup Das</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Developer, AI/ML Researcher & Creator</div>
              </div>
            </div>
          </motion.header>

          {/* Hero Cover Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              width: '100%',
              height: 'clamp(220px, 42vw, 420px)',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '40px',
              border: '1px solid rgba(138, 92, 246, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            <img
              src={activePost.coverImage}
              alt={activePost.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10, 8, 20, 0.7) 0%, transparent 60%)'
            }} />
          </motion.div>

          {/* Full Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              border: '1px solid rgba(138, 92, 246, 0.18)',
              padding: 'clamp(24px, 5vw, 44px)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
              marginBottom: '48px'
            }}
          >
            <ArticleBody content={activePost.content} />

            {/* Article Tags */}
            <div style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={13} /> Tags:
              </span>
              {activePost.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: 'rgba(138, 92, 246, 0.12)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(138, 92, 246, 0.2)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '56px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <BookOpen size={20} color="#a78bfa" />
                <h3 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0
                }}>
                  Related <span>Articles</span>
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {relatedPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blogs/${post.slug}`)}
                    className="blog-related-card"
                  >
                    <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(10, 8, 20, 0.9) 0%, transparent 60%)'
                      }} />
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: 'rgba(10, 8, 20, 0.8)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: post.color || '#c084fc',
                        border: `1px solid ${post.color || '#8a5cf6'}60`
                      }}>
                        {post.category}
                      </span>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <h4 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.4,
                        marginBottom: '8px'
                      }}>
                        {post.title}
                      </h4>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#a78bfa',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Read Next <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Back Button */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button
              className="pubpage-back"
              onClick={() => navigate('/blogs')}
              style={{ margin: '0 auto' }}
            >
              <ArrowLeft size={16} />
              Return to All Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // VIEW 2: FULL DEDICATED BLOGS DIRECTORY VIEW (/blogs)
  // ══════════════════════════════════════════════════════════════════════
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
        <div style={{ position: 'relative', marginBottom: '20px' }}>
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

      {/* Grid of All Blog Cards */}
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
              onClick={() => navigate(`/blogs/${post.slug || post.id}`)}
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
                      Read Full Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </ScrollAnimatedSection>

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(138, 92, 246, 0.12);
          border: 1px solid rgba(138, 92, 246, 0.3);
          border-radius: 12px;
          color: #ddd6fe;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .blog-share-btn:hover {
          background: rgba(138, 92, 246, 0.25);
          border-color: #a78bfa;
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── Rich Article Content Typography ── */
        .blog-article-content {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          line-height: 1.9;
          color: rgba(240, 235, 255, 0.92);
        }

        .blog-content-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.65rem;
          font-weight: 800;
          color: #ffffff;
          margin: 36px 0 16px 0;
          letter-spacing: -0.01em;
        }

        .blog-content-h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 32px 0 14px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .blog-content-h3-bar {
          display: inline-block;
          width: 4px;
          height: 18px;
          border-radius: 4px;
          background: #a78bfa;
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);
        }

        .blog-content-p {
          margin-bottom: 20px;
        }

        .blog-content-strong {
          color: #ffffff;
          font-weight: 700;
        }

        .blog-content-code {
          padding: 2px 6px;
          border-radius: 6px;
          background: rgba(138, 92, 246, 0.15);
          border: 1px solid rgba(138, 92, 246, 0.25);
          color: #c4b5fd;
          font-family: monospace;
          font-size: 0.92em;
        }

        .blog-content-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .blog-content-list-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.7;
        }

        .blog-list-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00f2fe;
          box-shadow: 0 0 8px #00f2fe;
          margin-top: 10px;
          flex-shrink: 0;
        }

        /* ── Related Card ── */
        .blog-related-card {
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(138, 92, 246, 0.2);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .blog-related-card:hover {
          transform: translateY(-4px);
          border-color: rgba(167, 139, 250, 0.5);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4), 0 0 15px rgba(138, 92, 246, 0.2);
        }
      `}} />
    </div>
  );
}
