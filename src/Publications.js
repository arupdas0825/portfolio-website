import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    publishedAt: "https://example.com/publication",
    color: "#8a5cf6",
  },
];

const FILTERS = ["All", "AI", "ML", "Web", "NLP"];

export default function Publications({ featuredOnly = false }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [modalPdf, setModalPdf]         = useState(null);
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [expanded, setExpanded]         = useState(null);
  const titleRef = useRef(null);

  /* GSAP heading */
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
    );
  }, []);

  const filteredPubs = ALL_PUBLICATIONS.filter(pub => {
    const matchesFilter = activeFilter === "All" || pub.tags.includes(activeFilter);
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const displayPubs = featuredOnly ? filteredPubs.slice(0, 2) : filteredPubs;

  return (
    <section id="publications" className="page-section pub-section">
      <div className="section-inner">

        {/* ── Header ─────────────────────────────────────────────── */}
        <span className="section-label">✦ RESEARCH &amp; ACADEMIA ✦</span>
        <h2 className="section-title" ref={titleRef}>
          Academic <span>Publications</span>
        </h2>
        <div className="section-line" />
        <p className="section-sub">
          Exploring the frontiers of Artificial Intelligence, Machine Learning,
          and Web Technologies through peer-reviewed research.
        </p>

        {/* ── Controls ────────────────────────────────────────────── */}
        {!featuredOnly && (
          <motion.div
            className="pub-controls"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="pub-filters">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`pub-filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="pub-search-wrap">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search title or tag…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {/* ── Cards ───────────────────────────────────────────────── */}
        <div className="pub-grid-v2">
          {displayPubs.map((pub, idx) => (
            <motion.div
              key={pub.id}
              className="pub-card-v2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Accent glow */}
              <div className="pub-card-glow" style={{ background: `radial-gradient(ellipse 200px 120px at 30% 0%, ${pub.color}22, transparent)` }} />

              {/* Top bar */}
              <div className="pub-card-topbar">
                <span className={`pub-badge-status ${pub.status === 'Published' ? 'pub-status-live' : 'pub-status-review'}`}>
                  <span className="pub-badge-dot" />
                  {pub.status}
                </span>
                <span className="pub-badge-year">{pub.year}</span>
              </div>

              {/* Title */}
              <h3 className="pub-title-v2">{pub.title}</h3>
              <p className="pub-journal">{pub.journal}</p>

              {/* Tags */}
              <div className="pub-tags-v2">
                {pub.tags.map(t => (
                  <span key={t} className="pub-tag-v2" style={{ borderColor: `${pub.color}44`, color: pub.color }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Abstract (expandable) */}
              <AnimatePresence initial={false}>
                <motion.p
                  className="pub-abstract-v2"
                  initial={false}
                  animate={{ maxHeight: expanded === pub.id ? 500 : 80, opacity: 1 }}
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
              <div className="pub-divider" />

              {/* Metrics row */}
              <div className="pub-metrics-row">
                <span className="pub-metric">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  DOI
                </span>
                <a href={pub.doi} target="_blank" rel="noreferrer" className="pub-doi-v2">
                  {pub.doi.split('doi.org/')[1] || 'Link'} ↗
                </a>
                <span className="pub-metric pub-citations">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  {pub.citations} citations
                </span>
              </div>

              {/* Actions */}
              <div className="pub-actions-v2">
                <button
                  className="pub-btn-ghost"
                  onClick={() => { setModalPdf(pub.pdf); setPdfLoading(true); }}
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview
                </button>
                <a href={pub.pdf} target="_blank" rel="noreferrer" className="pub-btn-solid">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </a>
                <a href={pub.publishedAt} target="_blank" rel="noreferrer" className="pub-btn-ghost">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View Online
                </a>
              </div>
            </motion.div>
          ))}

          {displayPubs.length === 0 && (
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
      </div>

      {/* ── PDF Modal ────────────────────────────────────────────── */}
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
              <iframe
                src={modalPdf}
                title="PDF Preview"
                className="pub-pdf-iframe"
                loading="lazy"
                onLoad={() => setPdfLoading(false)}
                style={{ opacity: pdfLoading ? 0 : 1, transition: 'opacity 0.3s' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
