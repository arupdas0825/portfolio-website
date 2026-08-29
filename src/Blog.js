import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ArrowRight, Clock, Calendar, Tag, X, User } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from './data/blogData';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)')?.matches ||
   'ontouchstart' in window ||
   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

export default function Blog({ featuredOnly = true }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  /* GSAP scroll trigger heading */
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 98%',
          once: true,
        },
      }
    );
  }, []);

  const filteredPosts = BLOG_POSTS.filter(post => {
    if (activeCategory === "All") return true;
    return post.category === activeCategory;
  });

  const previewLimit = IS_TOUCH ? 2 : 3;
  const displayPosts = featuredOnly ? filteredPosts.slice(0, previewLimit) : filteredPosts;
  const hasMore = filteredPosts.length > previewLimit || BLOG_POSTS.length > previewLimit;

  return (
    <section id="blog" className="page-section blog-section" style={{ position: 'relative', zIndex: 5 }}>
      <div className="section-inner">
        {/* ── Section Header ── */}
        <span className="section-label">✦ THOUGHTS, RESEARCH &amp; INSIGHTS ✦</span>
        <h2 className="section-title" ref={titleRef}>
          Featured <span>Articles</span>
        </h2>
        <div className="section-line" />
        <p className="section-sub">
          Exploring the frontiers of Artificial Intelligence, scalable web engineering, on-device systems, and the intersection of visual creativity with technology.
        </p>

        {/* ── Category Filter Pills ── */}
        <div className="work-filters" style={{ marginBottom: '32px' }}>
          {BLOG_CATEGORIES.map(category => (
            <button
              key={category}
              className={`work-filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ── Blog Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          width: '100%',
          marginTop: '12px'
        }}>
          {displayPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: '1px solid rgba(138, 92, 246, 0.2)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onClick={() => setSelectedPost(post)}
            >
              {/* Cover Image Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.5)'
              }}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  className="blog-card-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 8, 18, 0.9) 0%, rgba(10, 8, 18, 0.1) 60%, transparent 100%)'
                }} />
                
                {/* Category Pill Over Image */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(10, 8, 20, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${post.color || '#8a5cf6'}80`,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: post.color || '#c084fc',
                  letterSpacing: '0.03em'
                }}>
                  {post.category}
                </div>

                {/* Read Time & Date Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}>
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '10px'
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
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.4,
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    {post.title}
                  </h3>

                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.88rem',
                    color: 'rgba(226, 217, 243, 0.75)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags & Action Link */}
                <div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '18px'
                  }}>
                    {post.tags.slice(0, 3).map(tag => (
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
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--purple-light, #a78bfa)',
                      transition: 'gap 0.2s ease',
                    }}>
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── See More / Full Blog Button ── */}
        {hasMore && (
          <motion.div
            className="pub-see-more-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ marginTop: '40px', textAlign: 'center' }}
          >
            <button
              className="pub-see-more-btn"
              onClick={() => navigate('/blog')}
            >
              <BookOpen size={16} />
              Explore All Articles
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Full Article Reading Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="pub-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 4, 12, 0.85)',
              backdropFilter: 'blur(12px)',
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
                maxWidth: '750px',
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
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
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
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(10, 8, 20, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
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

              {/* Modal Body */}
              <div style={{ padding: '28px 36px 40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    padding: '3px 10px',
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
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
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

                {/* Markdown-style content paragraphs */}
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.96rem',
                  lineHeight: 1.8,
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
    </section>
  );
}
