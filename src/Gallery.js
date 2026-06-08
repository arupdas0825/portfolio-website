import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideX,
  LucideMapPin,
  LucideCamera
} from 'lucide-react';
import './Gallery.css'; // Minimalist styles

// Photo Data
const photosData = [
  { 
    id: 1, src: "/photos/1.jpg", 
    title: "Amber Awakening", 
    category: "Portrait Photography",
    location: "Kolkata, India"
  },
  { 
    id: 2, src: "/photos/2.jpg", 
    title: "Offerings of Devotion", 
    category: "Festival Photography",
    location: "Varanasi, India"
  },
  { 
    id: 4, src: "/photos/4.jpg", 
    title: "Geometric Dreams", 
    category: "Night Photography",
    location: "Mumbai, India"
  },
  { 
    id: 3, src: "/photos/3.jpg", 
    title: "Symphony of Light", 
    category: "Night Photography",
    location: "Kolkata, India"
  },
  { 
    id: 5, src: "/photos/5.jpg", 
    title: "Still Waiting for Tomorrow", 
    category: "Street Photography",
    location: "Delhi, India"
  },
  { 
    id: 6, src: "/photos/6.jpg", 
    title: "Golden Hour Commute", 
    category: "Street Photography",
    location: "Kolkata, India"
  },
  { 
    id: 7, src: "/photos/7.jpg", 
    title: "The Last Red of the Day", 
    category: "Urban Landscapes",
    location: "Bangalore, India"
  },
  { 
    id: 8, src: "/photos/8.jpg", 
    title: "Hooghly Serenity", 
    category: "Landscape Photography",
    location: "Kolkata, India"
  },
  { 
    id: 9, src: "/photos/9.jpg", 
    title: "Consuming Light", 
    category: "Light Trails",
    location: "Jaipur, India"
  },
  { 
    id: 10, src: "/photos/10.jpg", 
    title: "Solitary Path", 
    category: "Night Photography",
    location: "Kolkata, India"
  },
];

export default function Gallery() {
  
  // States
  const [activeCategory, setActiveCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Derived Data
  const categories = ["All", ...Array.from(new Set(photosData.map(p => p.category)))];
  
  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photosData;
    return photosData.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const featuredPhoto = filteredPhotos[0] || photosData[0];
  const carouselPhotos = filteredPhotos;
  const totalCarousel = carouselPhotos.length;

  // Reset carousel index when category changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [activeCategory]);

  // Carousel Autoplay
  useEffect(() => {
    if (isCarouselHovered || lightboxPhoto || totalCarousel <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % totalCarousel);
    }, 4000);
    return () => clearInterval(timer);
  }, [isCarouselHovered, lightboxPhoto, totalCarousel]);

  // Carousel Navigation
  const wrap = useCallback((idx) => ((idx % totalCarousel) + totalCarousel) % totalCarousel, [totalCarousel]);
  const handleCarouselNext = useCallback((e) => {
    e?.stopPropagation();
    if (totalCarousel > 1) setCarouselIndex(prev => wrap(prev + 1));
  }, [totalCarousel, wrap]);
  const handleCarouselPrev = useCallback((e) => {
    e?.stopPropagation();
    if (totalCarousel > 1) setCarouselIndex(prev => wrap(prev - 1));
  }, [totalCarousel, wrap]);

  // Lightbox Navigation
  const handleLightboxNext = useCallback((e) => {
    e?.stopPropagation();
    setLightboxPhoto(prev => {
      if (!prev) return null;
      const idx = filteredPhotos.findIndex(p => p.id === prev.id);
      return filteredPhotos[(idx + 1) % filteredPhotos.length];
    });
  }, [filteredPhotos]);

  const handleLightboxPrev = useCallback((e) => {
    e?.stopPropagation();
    setLightboxPhoto(prev => {
      if (!prev) return null;
      const idx = filteredPhotos.findIndex(p => p.id === prev.id);
      return filteredPhotos[(idx - 1 + filteredPhotos.length) % filteredPhotos.length];
    });
  }, [filteredPhotos]);

  // Global Keyboard listener for Lightbox
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (lightboxPhoto) {
        if (e.key === 'ArrowRight') handleLightboxNext();
        if (e.key === 'ArrowLeft') handleLightboxPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxPhoto, handleLightboxNext, handleLightboxPrev]);

  // Swipe Helpers
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  // Current Lightbox Index for counter
  const lightboxCurrentIndex = lightboxPhoto ? filteredPhotos.findIndex(p => p.id === lightboxPhoto.id) + 1 : 0;

  return (
    <section id="photography" className="page-section hm-gallery-root">
      
      {/* ── SECTION 1: Featured Photo Hero ── */}
      <div className="hm-hero-wrapper">
        <div className="section-header" style={{ marginBottom: '30px' }}>
          <h2 className="section-title fade-in">
            Visual <span>Stories</span>
          </h2>
          <div className="section-line fade-in" />
          <p className="section-sub fade-in">
            A curated selection of moments frozen in time.
          </p>
        </div>

        <motion.div 
          className="hm-hero"
          onClick={() => setLightboxPhoto(featuredPhoto)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={featuredPhoto.src} 
            alt={featuredPhoto.title} 
            className="hm-hero-bg" 
            loading="lazy"
          />
          <div className="hm-hero-gradient" />
          <div className="hm-hero-content">
            <div className="hm-hero-badge">Featured Capture</div>
            <h3 className="hm-hero-title">{featuredPhoto.title}</h3>
            <div className="hm-hero-meta">
              <span><LucideMapPin size={18}/> {featuredPhoto.location}</span>
              <span>•</span>
              <span><LucideCamera size={18}/> {featuredPhoto.category}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── SECTION 2: Category Chips ── */}
      <div className="hm-categories">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`hm-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── SECTION 3: Premium Film Strip Carousel ── */}
      {totalCarousel > 0 && (
        <div 
          className="hm-carousel-section"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          {totalCarousel > 1 && (
            <button className="hm-carousel-nav prev" onClick={handleCarouselPrev}>
              <LucideChevronLeft />
            </button>
          )}

          <AnimatePresence initial={false}>
            {carouselPhotos.map((photo, i) => {
              let pos = "hidden";
              if (totalCarousel === 1) pos = "center";
              else if (totalCarousel === 2) {
                if (i === carouselIndex) pos = "center";
                else pos = "left";
              } else {
                if (i === carouselIndex) pos = "center";
                else if (i === wrap(carouselIndex - 1)) pos = "left";
                else if (i === wrap(carouselIndex + 1)) pos = "right";
                else if (i === wrap(carouselIndex - 2)) pos = "far-left";
                else if (i === wrap(carouselIndex + 2)) pos = "far-right";
              }

              if (pos === "hidden") return null;

              return (
                <motion.div
                  key={`${photo.id}-${activeCategory}`}
                  className={`hm-carousel-slide ${pos}`}
                  onClick={() => {
                    if (pos === "center") setLightboxPhoto(photo);
                    else if (pos === "left" || pos === "far-left") handleCarouselPrev();
                    else if (pos === "right" || pos === "far-right") handleCarouselNext();
                  }}
                  drag={pos === "center" ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) handleCarouselNext();
                    else if (swipe > swipeConfidenceThreshold) handleCarouselPrev();
                  }}
                >
                  <img src={photo.src} alt={photo.title} loading="lazy" />
                  
                  {/* Overlay added directly on slider image */}
                  <div className="hm-slide-overlay">
                    <h4 className="hm-slide-title">{photo.title}</h4>
                    <div className="hm-slide-meta">
                      <span>{photo.category}</span>
                      <span>•</span>
                      <span>{photo.location}</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>

          {totalCarousel > 1 && (
            <button className="hm-carousel-nav next" onClick={handleCarouselNext}>
              <LucideChevronRight />
            </button>
          )}
        </div>
      )}

      {/* ── SECTION 4: Premium Photo Lightbox ── */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div 
            className="hm-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header: Back Button, Counter, Close */}
            <div className="hm-lightbox-header">
              <button className="hm-lightbox-back" onClick={() => setLightboxPhoto(null)}>
                <LucideChevronLeft size={20} />
                <span>Back to Gallery</span>
              </button>
              
              <div className="hm-lightbox-count">
                {lightboxCurrentIndex} / {filteredPhotos.length}
              </div>

              <button className="hm-lightbox-close" onClick={() => setLightboxPhoto(null)}>
                <LucideX size={24} />
              </button>
            </div>

            {/* Viewer Area */}
            <div className="hm-lightbox-viewer" onClick={() => setLightboxPhoto(null)}>
              {filteredPhotos.length > 1 && (
                <button className="hm-lightbox-nav prev" onClick={handleLightboxPrev}>
                  <LucideChevronLeft size={44} />
                </button>
              )}

              <motion.img 
                src={lightboxPhoto.src} 
                alt={lightboxPhoto.title}
                className="hm-lightbox-img"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) handleLightboxNext();
                  else if (swipe > swipeConfidenceThreshold) handleLightboxPrev();
                }}
              />

              {filteredPhotos.length > 1 && (
                <button className="hm-lightbox-nav next" onClick={handleLightboxNext}>
                  <LucideChevronRight size={44} />
                </button>
              )}
            </div>

            {/* Footer: Meta Info */}
            <div className="hm-lightbox-footer">
              <h2 className="hm-lightbox-title">{lightboxPhoto.title}</h2>
              <div className="hm-lightbox-meta">
                <span>{lightboxPhoto.category}</span>
                <span>•</span>
                <span>{lightboxPhoto.location}</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}