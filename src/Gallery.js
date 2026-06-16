import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideX,
  LucideMapPin,
  LucideCamera
} from 'lucide-react';
import { supabase } from './supabase';
import { ZoomParallax } from './components/ui/zoom-parallax';
import './Gallery.css'; // Minimalist styles

// Extended Fallback Data Model (same as PhotographyGallery fallback)
const fallbackPhotos = [
  { 
    id: 1, src: "/photos/1.jpg", 
    title: "Amber Awakening", 
    desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset.", 
    category: "Portrait Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 85mm F1.4 GM", iso: "100", shutterSpeed: "1/200s", aperture: "f/1.8"
  },
  { 
    id: 2, src: "/photos/2.jpg", 
    title: "Offerings of Devotion", 
    desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India.", 
    category: "Festival Photography",
    location: "Varanasi, India",
    camera: "Fujifilm X-T4", lens: "XF 23mm F1.4 R", iso: "400", shutterSpeed: "1/500s", aperture: "f/2.8"
  },
  { 
    id: 4, src: "/photos/4.jpg", 
    title: "Geometric Dreams", 
    desc: "A ferris wheel transformed into a kaleidoscope of neon geometry.", 
    category: "Night Photography",
    location: "Mumbai, India",
    camera: "Sony A7R IV", lens: "FE 24-70mm F2.8 GM", iso: "1600", shutterSpeed: "1/30s", aperture: "f/4.0"
  },
  { 
    id: 3, src: "/photos/3.jpg", 
    title: "Symphony of Light", 
    desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Canon EOS R5", lens: "RF 15-35mm F2.8 L", iso: "100", shutterSpeed: "4s", aperture: "f/8.0"
  },
  { 
    id: 5, src: "/photos/5.jpg", 
    title: "Still Waiting for Tomorrow", 
    desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them.", 
    category: "Street Photography",
    location: "Delhi, India",
    camera: "Fujifilm X-Pro3", lens: "XF 35mm F2 R WR", iso: "800", shutterSpeed: "1/250s", aperture: "f/2.0"
  },
  { 
    id: 6, src: "/photos/6.jpg", 
    title: "Golden Hour Commute", 
    desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape.", 
    category: "Street Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 35mm F1.4 GM", iso: "100", shutterSpeed: "1/1000s", aperture: "f/1.4"
  },
  { 
    id: 7, src: "/photos/7.jpg", 
    title: "The Last Red of the Day", 
    desc: "The sun sinks behind wires and concrete, yet still finds space to glow.", 
    category: "Urban Landscapes",
    location: "Bangalore, India",
    camera: "Nikon Z7 II", lens: "NIKKOR Z 24-120mm f/4 S", iso: "200", shutterSpeed: "1/60s", aperture: "f/5.6"
  },
  { 
    id: 8, src: "/photos/8.jpg", 
    title: "Hooghly Serenity", 
    desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice.", 
    category: "Landscape Photography",
    location: "Kolkata, India",
    camera: "Sony A7R IV", lens: "FE 16-35mm F2.8 GM", iso: "100", shutterSpeed: "1/125s", aperture: "f/8.0"
  },
  { 
    id: 9, src: "/photos/9.jpg", 
    title: "Consuming Light", 
    desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring.", 
    category: "Light Trails",
    location: "Jaipur, India",
    camera: "Canon EOS R6", lens: "RF 50mm F1.2 L", iso: "400", shutterSpeed: "1/50s", aperture: "f/1.2"
  },
  { 
    id: 10, src: "/photos/10.jpg", 
    title: "Solitary Path", 
    desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Fujifilm X-T4", lens: "XF 18-55mm F2.8-4", iso: "3200", shutterSpeed: "1/15s", aperture: "f/2.8"
  },
  { 
    id: 11, src: "/photos/11.jpg", 
    title: "Last Light Over the Ganges", 
    desc: "A mesmerizing view of the sacred Ganges river bathed in the fading light of dusk.", 
    category: "Landscape Photography",
    location: "Varanasi, India",
    camera: "Unknown", lens: "Unknown", iso: "Auto", shutterSpeed: "Auto", aperture: "Auto"
  },
];

export default function Gallery() {
  const [photosList, setPhotosList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Load photos from Supabase
  useEffect(() => {
    async function loadPhotos() {
      try {
        const { data, error } = await supabase
          .from('photography')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mapped = data.map(p => {
            let exif = {};
            let desc = p.description || '';
            if (p.description) {
              try {
                exif = JSON.parse(p.description);
                desc = exif.desc || '';
              } catch (e) {
                desc = p.description;
              }
            }
            return {
              id: p.id,
              src: p.image || p.image_url,
              title: p.title,
              desc: desc || `Captured in ${exif.location || p.location || 'India'} using ${exif.camera || p.camera || 'professional camera'}.`,
              category: p.category || 'Landscape Photography',
              location: exif.location || p.location || 'Kolkata, India',
              camera: exif.camera || p.camera || 'Unknown',
              lens: exif.lens || p.lens || 'Unknown',
              iso: exif.iso || p.iso || 'Auto',
              shutterSpeed: exif.shutterSpeed || exif.shutter_speed || p.shutter_speed || 'Auto',
              aperture: exif.aperture || p.aperture || 'Auto'
            };
          });
          setPhotosList(mapped);
        } else {
          setPhotosList(fallbackPhotos);
        }
      } catch (err) {
        console.error("Failed to fetch photography from Supabase:", err);
        setPhotosList(fallbackPhotos);
      }
    }
    loadPhotos();
  }, []);

  // Dynamically generate categories from photos list
  const categories = useMemo(() => {
    const list = Array.from(new Set(photosList.map(p => p.category))).filter(Boolean);
    return ["All", ...list];
  }, [photosList]);
  
  // Filter photos based on selection
  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photosList;
    return photosList.filter(p => p.category === activeCategory);
  }, [activeCategory, photosList]);

  // Map to ZoomParallax required format
  const zoomImages = useMemo(() => {
    return filteredPhotos.map(photo => ({
      id: photo.id,
      src: photo.src,
      alt: photo.title,
      title: photo.title,
      category: photo.category,
      camera: photo.camera,
      lens: photo.lens,
      location: photo.location,
      desc: photo.desc,
      iso: photo.iso,
      shutterSpeed: photo.shutterSpeed,
      aperture: photo.aperture
    }));
  }, [filteredPhotos]);

  // Lightbox navigation handlers
  const handleLightboxNext = useCallback((e) => {
    e?.stopPropagation();
    setLightboxPhoto(prev => {
      if (!prev) return null;
      const idx = filteredPhotos.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
      return filteredPhotos[(idx + 1) % filteredPhotos.length];
    });
  }, [filteredPhotos]);

  const handleLightboxPrev = useCallback((e) => {
    e?.stopPropagation();
    setLightboxPhoto(prev => {
      if (!prev) return null;
      const idx = filteredPhotos.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
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

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const lightboxCurrentIndex = lightboxPhoto ? filteredPhotos.findIndex(p => p.id === lightboxPhoto.id) + 1 : 0;

  return (
    <section id="photography" className="page-section hm-gallery-root">
      
      {/* ── SECTION HEADER ── */}
      <div className="hm-hero-wrapper">
        <motion.div 
          className="section-header" 
          style={{ marginBottom: '30px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Cinematic <span>Photography</span>
          </h2>
          <div className="section-line" />
          <p className="section-sub">
            A curated selection of moments frozen in time.
          </p>
        </motion.div>
      </div>

      {/* ── CATEGORY FILTER CHIPS ── */}
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

      {/* ── RESPONSIVE ZOOM PARALLAX SHOWCASE ── */}
      {zoomImages.length > 0 ? (
        <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <ZoomParallax 
            images={zoomImages} 
            onImageClick={(photo) => setLightboxPhoto(photo)} 
          />
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>No captures found for this category.</p>
        </div>
      )}

      {/* ── PREMIUM LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div 
            className="hm-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
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

            {/* Footer */}
            <div className="hm-lightbox-footer" style={{ pointerEvents: 'auto' }}>
              <h2 className="hm-lightbox-title">{lightboxPhoto.title}</h2>
              <div className="hm-lightbox-meta flex flex-col gap-2">
                <span className="text-[#a78bfa] tracking-wider uppercase font-semibold text-xs">
                  {lightboxPhoto.category}
                </span>
                {lightboxPhoto.desc && (
                  <p className="max-w-xl mx-auto text-xs text-gray-300 font-normal leading-relaxed mb-1 mt-0.5">
                    {lightboxPhoto.desc}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
                  {lightboxPhoto.camera && (
                    <span className="flex items-center gap-1">
                      <LucideCamera size={12} className="text-[#a78bfa]" /> {lightboxPhoto.camera}
                    </span>
                  )}
                  {lightboxPhoto.lens && (
                    <span className="flex items-center gap-1">
                      🔍 {lightboxPhoto.lens}
                    </span>
                  )}
                  {lightboxPhoto.location && (
                    <span className="flex items-center gap-1">
                      <LucideMapPin size={12} className="text-[#a78bfa]" /> {lightboxPhoto.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}