import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideX,
  LucideMapPin,
  LucideCamera,
  LucideChevronLeft,
  LucideChevronRight,
  LucideAperture,
  LucideFocus,
  LucideSparkles
} from 'lucide-react';
import { PHOTOGRAPHY_DUMP } from './data/photographyDump';
import { MultiFolderGallery } from './components/ui/interactive-folder-gallery';
import './Gallery.css';

// Fallback Data Model (11 photos)
const fallbackPhotos = [
  { 
    id: 1, 
    image: "/photos/1.jpg", 
    src: "/photos/1.jpg", 
    title: "Amber Awakening", 
    desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset.", 
    category: "Portrait Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 85mm F1.4 GM", iso: "100", shutterSpeed: "1/200s", aperture: "f/1.8"
  },
  { 
    id: 2, 
    image: "/photos/2.jpg", 
    src: "/photos/2.jpg", 
    title: "Offerings of Devotion", 
    desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India.", 
    category: "Festival Photography",
    location: "Varanasi, India",
    camera: "Fujifilm X-T4", lens: "XF 23mm F1.4 R", iso: "400", shutterSpeed: "1/500s", aperture: "f/2.8"
  },
  { 
    id: 4, 
    image: "/photos/4.jpg", 
    src: "/photos/4.jpg", 
    title: "Geometric Dreams", 
    desc: "A ferris wheel transformed into a kaleidoscope of neon geometry.", 
    category: "Night Photography",
    location: "Mumbai, India",
    camera: "Sony A7R IV", lens: "FE 24-70mm F2.8 GM", iso: "1600", shutterSpeed: "1/30s", aperture: "f/4.0"
  },
  { 
    id: 3, 
    image: "/photos/3.jpg", 
    src: "/photos/3.jpg", 
    title: "Symphony of Light", 
    desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Canon EOS R5", lens: "RF 15-35mm F2.8 L", iso: "100", shutterSpeed: "4s", aperture: "f/8.0"
  },
  { 
    id: 5, 
    image: "/photos/5.jpg", 
    src: "/photos/5.jpg", 
    title: "Still Waiting for Tomorrow", 
    desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them.", 
    category: "Street Photography",
    location: "Delhi, India",
    camera: "Fujifilm X-Pro3", lens: "XF 35mm F2 R WR", iso: "800", shutterSpeed: "1/250s", aperture: "f/2.0"
  },
  { 
    id: 6, 
    image: "/photos/6.jpg", 
    src: "/photos/6.jpg", 
    title: "Golden Hour Commute", 
    desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape.", 
    category: "Street Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 35mm F1.4 GM", iso: "100", shutterSpeed: "1/1000s", aperture: "f/1.4"
  },
  { 
    id: 7, 
    image: "/photos/7.jpg", 
    src: "/photos/7.jpg", 
    title: "The Last Red of the Day", 
    desc: "The sun sinks behind wires and concrete, yet still finds space to glow.", 
    category: "Urban Landscapes",
    location: "Bangalore, India",
    camera: "Nikon Z7 II", lens: "NIKKOR Z 24-120mm f/4 S", iso: "200", shutterSpeed: "1/60s", aperture: "f/5.6"
  },
  { 
    id: 8, 
    image: "/photos/8.jpg", 
    src: "/photos/8.jpg", 
    title: "Hooghly Serenity", 
    desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice.", 
    category: "Landscape Photography",
    location: "Kolkata, India",
    camera: "Sony A7R IV", lens: "FE 16-35mm F2.8 GM", iso: "100", shutterSpeed: "1/125s", aperture: "f/8.0"
  },
  { 
    id: 9, 
    image: "/photos/9.jpg", 
    src: "/photos/9.jpg", 
    title: "Consuming Light", 
    desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring.", 
    category: "Light Trails",
    location: "Jaipur, India",
    camera: "Canon EOS R6", lens: "RF 50mm F1.2 L", iso: "400", shutterSpeed: "1/50s", aperture: "f/1.2"
  },
  { 
    id: 10, 
    image: "/photos/10.jpg", 
    src: "/photos/10.jpg", 
    title: "Solitary Path", 
    desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Fujifilm X-T4", lens: "XF 18-55mm F2.8-4", iso: "3200", shutterSpeed: "1/15s", aperture: "f/2.8"
  },
  { 
    id: 11, 
    image: "/photos/11.jpg", 
    src: "/photos/11.jpg", 
    title: "Last Light Over the Ganges", 
    desc: "A mesmerizing view of the sacred Ganges river bathed in the fading light of dusk.", 
    category: "Landscape Photography",
    location: "Varanasi, India",
    camera: "Unknown", lens: "Unknown", iso: "Auto", shutterSpeed: "Auto", aperture: "Auto"
  },
];

export default function Gallery() {
  const [photosList, setPhotosList] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Load photos database
  useEffect(() => {
    const data = PHOTOGRAPHY_DUMP ? PHOTOGRAPHY_DUMP.filter(p => p.image) : [];
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
          image: p.image || p.image_url,
          src: p.image || p.image_url,
          title: p.title || 'Untitled Capture',
          desc: desc || `Captured in ${exif.location || p.location || 'India'} using ${exif.camera || p.camera || 'professional camera'}.`,
          category: p.category || 'Landscape Photography',
          location: exif.location || p.location || 'Kolkata, India',
          camera: exif.camera || p.camera || 'Sony A7IV',
          lens: exif.lens || p.lens || 'Prime Lens',
          iso: exif.iso || p.iso || '100',
          shutterSpeed: exif.shutterSpeed || exif.shutter_speed || p.shutter_speed || '1/250s',
          aperture: exif.aperture || p.aperture || 'f/2.8'
        };
      });
      setPhotosList(mapped);
    } else {
      setPhotosList(fallbackPhotos);
    }
  }, []);

  // 3 folders: Folder 1 (6 photos), Folder 2 (next 5 photos), Folder 3 (0 photos)
  const folders = useMemo(() => {
    const all = photosList.length > 0 ? photosList : fallbackPhotos;
    return [
      {
        id: 'vol-1',
        name: 'Arup Explores',
        photos: all.slice(0, 6), // 1st folder: 6 photos
      },
      {
        id: 'vol-2',
        name: 'Arup Explores',
        photos: all.slice(6, 11), // 2nd folder: next 5 photos
      },
      {
        id: 'vol-3',
        name: 'Arup Explores',
        photos: [], // 3rd folder: completely empty
      }
    ];
  }, [photosList]);

  // Lightbox navigation across all available photos
  const handleLightboxNext = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const all = photosList.length > 0 ? photosList : fallbackPhotos;
      const idx = all.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
      return all[(idx + 1) % all.length];
    });
  }, [photosList]);

  const handleLightboxPrev = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const all = photosList.length > 0 ? photosList : fallbackPhotos;
      const idx = all.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
      return all[(idx - 1 + all.length) % all.length];
    });
  }, [photosList]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (selectedPhoto) {
        if (e.key === 'ArrowRight') handleLightboxNext();
        if (e.key === 'ArrowLeft') handleLightboxPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedPhoto, handleLightboxNext, handleLightboxPrev]);

  return (
    <section id="photography" className="folder-gallery-section">
      <div className="gallery-container">
        
        {/* ── SECTION HEADER ── */}
        <motion.div 
          className="section-header text-center" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gallery-badge-pill">
            <LucideSparkles size={13} className="text-[#00f2fe]" />
            <span>Interactive Gallery</span>
          </div>
          <h2 className="section-title">
            Cinematic <span>Photography</span>
          </h2>
          <div className="section-line" />
          <p className="section-sub">
            Browse through the photography volumes below. Click any folder to expand and inspect full captures.
          </p>
        </motion.div>

        {/* ── 3 SIDE-BY-SIDE INTERACTIVE FOLDERS ── */}
        <MultiFolderGallery 
          folders={folders}
          dragHintText="Drag any photo down to close"
          onPhotoClick={(photo) => setSelectedPhoto(photo)}
        />

      </div>

      {/* ── FULL DETAILS LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="premium-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)} />

            <motion.div 
              className="lightbox-box"
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Close Button */}
              <button 
                className="lightbox-close-btn" 
                onClick={() => setSelectedPhoto(null)} 
                aria-label="Close lightbox"
              >
                <LucideX size={20} />
              </button>

              {/* Navigation Buttons */}
              <button 
                className="lightbox-nav-btn prev" 
                onClick={handleLightboxPrev} 
                aria-label="Previous image"
              >
                <LucideChevronLeft size={28} />
              </button>
              <button 
                className="lightbox-nav-btn next" 
                onClick={handleLightboxNext} 
                aria-label="Next image"
              >
                <LucideChevronRight size={28} />
              </button>

              {/* Layout Content */}
              <div className="lightbox-body">
                {/* Image Section */}
                <div className="lightbox-image-section">
                  <img src={selectedPhoto.src || selectedPhoto.image} alt={selectedPhoto.title} />
                </div>

                {/* Details Section */}
                <div className="lightbox-details-section">
                  <div className="details-header">
                    <span className="details-category-badge">{selectedPhoto.category}</span>
                    <h2 className="details-title">{selectedPhoto.title}</h2>
                  </div>

                  <p className="details-description">{selectedPhoto.desc}</p>

                  {/* EXIF Information Grid */}
                  <div className="exif-grid-layout">
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideMapPin size={13} /> Location</div>
                      <div className="exif-cell-value">{selectedPhoto.location}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideCamera size={13} /> Camera</div>
                      <div className="exif-cell-value">{selectedPhoto.camera}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideFocus size={13} /> Lens</div>
                      <div className="exif-cell-value">{selectedPhoto.lens}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideAperture size={13} /> Settings</div>
                      <div className="exif-cell-value">
                        {selectedPhoto.aperture} • {selectedPhoto.shutterSpeed} • ISO {selectedPhoto.iso}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}