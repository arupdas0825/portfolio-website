import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Will use generic app classes if needed or we can define some custom ones

const DUMMY_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const ALL_PUBLICATIONS = [
  {
    id: 1,
    title: "AI Code Translator and Explanation System",
    abstract: "A system that translates code across multiple programming languages and explains it in simple human-readable form using AI.",
    tags: ["AI", "NLP", "Web App"],
    status: "Published",
    doi: "https://doi.org/10.1234/example",
    citations: 0,
    pdf: "/AI_Code_Translator_Research_Paper.pdf",
    publishedAt: "https://example.com/publication"
  },
];

const FILTERS = ["All", "AI", "ML", "Web", "NLP"];

export default function Publications({ featuredOnly = false }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalPdf, setModalPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const fadeRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [activeFilter, searchQuery]);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const filteredPubs = ALL_PUBLICATIONS.filter(pub => {
    const matchesFilter = activeFilter === "All" || pub.tags.includes(activeFilter);
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const displayPubs = featuredOnly ? filteredPubs.slice(0, 2) : filteredPubs;

  const scrollToPublications = (e) => {
    e.preventDefault();
    document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`publications-section ${featuredOnly ? 'featured-pubs' : ''}`}>
      <div className="pub-container fade-in" ref={addRef}>

        <div className="pub-header">
          <h2 className="section-title">
            {featuredOnly ? 'Featured Publications' : 'Academic Publications'}
          </h2>
          {!featuredOnly && (
            <p className="section-subtitle">
              Exploring the frontiers of Artificial Intelligence, Machine Learning, and Web Technologies.
            </p>
          )}
        </div>

        {!featuredOnly && (
          <div className="pub-controls">
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
            <div className="pub-search">
              <input
                type="text"
                placeholder="Search by title or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>
        )}

        <div className="pub-grid">
          {displayPubs.map((pub, idx) => (
            <div className="pub-card fade-in" ref={addRef} key={pub.id} style={{ animationDelay: `${idx * 0.1}s` }}>

              <div className="pub-card-top">
                <div className="pub-status-badges">
                  <span className={`pub-status ${pub.status === 'Published' ? 'status-published' : 'status-review'}`}>
                    <span className="status-dot"></span>
                    {pub.status}
                  </span>
                  <a href={pub.doi} target="_blank" rel="noreferrer" className="pub-doi">
                    DOI: {pub.doi.split('doi.org/')[1] || 'Link'}
                  </a>
                </div>
                <h3 className="pub-title">{pub.title}</h3>
                <p className="pub-abstract">{pub.abstract}</p>
              </div>

              <div className="pub-card-bottom">
                <div className="pub-tags">
                  {pub.tags.map(t => <span key={t} className="pub-tag">{t}</span>)}
                </div>

                <div className="pub-metrics-actions">
                  <div className="pub-metrics">
                    <span className="pub-citations" title="Citations">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                      Citations: {pub.citations}
                    </span>
                    <span className="pub-impact">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>
                    </span>
                  </div>

                  <div className="pub-actions">
                    <button className="pub-btn pub-btn-outline" onClick={() => { setModalPdf(pub.pdf); setPdfLoading(true); }}>
                      Preview PDF
                    </button>
                    <a href={pub.pdf} target="_blank" rel="noreferrer" className="pub-btn pub-btn-primary">
                      View PDF
                    </a>
                  </div>
                </div>

                <a href={pub.publishedAt} target="_blank" rel="noreferrer" className="pub-external-link">
                  Published at external venue ↗
                </a>
              </div>
            </div>
          ))}
          {displayPubs.length === 0 && (
            <div className="pub-empty">No publications found.</div>
          )}
        </div>

        {featuredOnly && (
          <div className="pub-view-all">
            <button className="btn-secondary" onClick={scrollToPublications}>
              View All Publications
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '8px' }}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>
            </button>
          </div>
        )}
      </div>

      {modalPdf && (
        <div className="pub-modal-overlay" onClick={() => setModalPdf(null)}>
          <div className="pub-modal-content" onClick={e => e.stopPropagation()}>
            <button className="pub-modal-close" onClick={() => setModalPdf(null)}>✕</button>
            {pdfLoading && (
              <div className="pub-pdf-loader">
                <div className="spinner"></div>
                <p>Loading PDF...</p>
              </div>
            )}
            <iframe
              src={modalPdf}
              title="PDF Preview"
              className="pub-pdf-iframe"
              loading="lazy"
              onLoad={() => setPdfLoading(false)}
              style={{ opacity: pdfLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
