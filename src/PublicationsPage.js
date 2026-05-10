/**
 * PublicationsPage.js — /publications route
 * Dedicated page displaying all academic publications in a compact, responsive grid.
 * Matches existing portfolio design system (WorkPage.js pattern).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const ALL_PUBLICATIONS = [
  {
    id: 1,
    title: "AI Code Translator and Explanation System",
    journal: "International Research Journal",
    year: 2024,
    abstract: "A system that translates code across multiple programming languages and explains it in simple human-readable form using AI. Leverages large language models combined with structured parsing to provide accurate cross-language translations with contextual explanations.",
    tags: ["AI", "NLP", "Web App"],
    status: "Published",
    doi: "https://doi.org/10.1234/example",
    citations: 0,
    pdf: "/AI_Code_Translator_Research_Paper.pdf",
    image: "/AI_Code_Translator_Research_Paper.png",
    publishedAt: "https://example.com/publication",
    color: "#8a5cf6",
  },
  {
    id: 2,
    title: "EverBond Wealth: Collaborative Financial Planning & Milestone Integration",
    journal: "Journal of Modern Fintech Solutions",
    year: 2024,
    abstract: "This paper presents the design and implementation of EverBond Wealth, a sophisticated platform for collaborative wealth management. It details the integration of milestone-based goal tracking, dynamic risk-adjusted asset allocation, and a high-fidelity visual engine, providing a unified financial dashboard for modern couples.",
    tags: ["FinTech", "Web App", "Security"],
    status: "Published",
    doi: "https://doi.org/10.5678/everbond",
    citations: 0,
    pdf: "/EverBond_Wealth_Research_Paper.pdf",
    image: "/EverBond_Wealth_Research_Paper.png",
    publishedAt: "https://everbondwealth.com/research",
    color: "#10b981",
  },
];

const FILTERS = ["All", "AI", "NLP", "FinTech", "Web App", "Security"];

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

export default function PublicationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalPdf, setModalPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredPubs = ALL_PUBLICATIONS.filter(pub => {
    if (activeFilter === "All") return true;
    return pub.tags.includes(activeFilter);
  });

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') setModalPdf(null);
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  return (
    <div className="pubpage-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px' }}>
      <Navbar />

      {/* Back Button */}
      <button className="pubpage-back" onClick={() => navigate('/')}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      {/* Header */}
      <div className="pubpage-header">
        <span className="section-label">✦ RESEARCH & ACADEMIA ✦</span>
        <h1 className="pubpage-title">Academic <span>Publications</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="pubpage-sub">
          Exploring the frontiers of Artificial Intelligence, Machine Learning,
          and Web Technologies through peer-reviewed research.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="pubpage-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`pub-filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'All' && <span className="filter-count">{ALL_PUBLICATIONS.length}</span>}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="pubpage-grid">
        {filteredPubs.map((pub, idx) => (
          <motion.div
            key={pub.id}
            className="pub-card-compact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(138,92,246,0.2)' }}
          >
            {/* Accent glow */}
            <div className="pub-card-glow" style={{ background: `radial-gradient(ellipse 180px 100px at 30% 0%, ${pub.color}22, transparent)` }} />

            {/* Top bar */}
            <div className="pub-compact-topbar">
              <span className={`pub-badge-status ${pub.status === 'Published' ? 'pub-status-live' : 'pub-status-review'}`}>
                <span className="pub-badge-dot" />
                {pub.status}
              </span>
              <span className="pub-badge-year">{pub.year}</span>
            </div>

            {/* Preview Image */}
            {pub.image && (
              <div className="pub-compact-img-wrap" onClick={() => { setModalPdf(pub.pdf); setPdfLoading(true); }}>
                <img src={pub.image} alt={pub.title} className="pub-compact-img" />
                <div className="pub-preview-overlay">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Title */}
            <h3 className="pub-compact-title">{pub.title}</h3>
            <p className="pub-compact-journal">{pub.journal}</p>

            {/* Tags */}
            <div className="pub-compact-tags">
              {pub.tags.map(t => (
                <span key={t} className="pub-tag-v2" style={{ borderColor: `${pub.color}44`, color: pub.color }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Abstract (expandable) */}
            <AnimatePresence initial={false}>
              <motion.p
                className="pub-compact-abstract"
                initial={false}
                animate={{ maxHeight: expanded === pub.id ? 400 : 54, opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                {pub.abstract}
              </motion.p>
            </AnimatePresence>
            <button
              className="pub-expand-btn"
              onClick={() => setExpanded(expanded === pub.id ? null : pub.id)}
            >
              {expanded === pub.id ? 'Show less ↑' : 'Read more ↓'}
            </button>

            {/* Divider */}
            <div className="pub-divider" style={{ marginBottom: 12 }} />

            {/* Metrics row */}
            <div className="pub-compact-metrics">
              <span className="pub-metric">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                DOI
              </span>
              <a href={pub.doi} target="_blank" rel="noreferrer" className="pub-doi-v2">
                {pub.doi.split('doi.org/')[1] || 'Link'} ↗
              </a>
              <span className="pub-metric pub-citations">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                {pub.citations} citations
              </span>
            </div>

            {/* Actions */}
            <div className="pub-compact-actions">
              <button
                className="pub-btn-ghost"
                onClick={() => { setModalPdf(pub.pdf); setPdfLoading(true); }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Preview
              </button>
              <a href={pub.pdf} target="_blank" rel="noreferrer" className="pub-btn-solid">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                PDF
              </a>
              <a href={pub.publishedAt} target="_blank" rel="noreferrer" className="pub-btn-ghost">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View
              </a>
            </div>
          </motion.div>
        ))}

        {filteredPubs.length === 0 && (
          <motion.div
            className="pub-empty-v2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>No publications match your filter.</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="pubpage-footer">
        <button className="pubpage-back" onClick={() => navigate('/')} style={{ marginBottom: 0 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>
      </div>

      {/* ── PDF Modal ── */}
      <AnimatePresence>
        {modalPdf && (
          <motion.div
            className="pub-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalPdf(null)}
          >
            <motion.div
              className="pub-modal-content"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pub-modal-header">
                <span>PDF Preview</span>
                <button className="pub-modal-close" onClick={() => setModalPdf(null)}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {pdfLoading && (
                <div className="pub-pdf-loader">
                  <div className="pub-spinner" />
                  <p>Loading PDF…</p>
                </div>
              )}
              {modalPdf.endsWith('.pdf') ? (
                <iframe
                  src={modalPdf}
                  title="PDF Preview"
                  className="pub-pdf-iframe"
                  loading="lazy"
                  onLoad={() => setPdfLoading(false)}
                  style={{ opacity: pdfLoading ? 0 : 1, transition: 'opacity 0.3s' }}
                />
              ) : (
                <div className="pub-image-preview-wrap">
                  <img src={modalPdf} alt="Preview" className="pub-preview-full-img" onLoad={() => setPdfLoading(false)} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
