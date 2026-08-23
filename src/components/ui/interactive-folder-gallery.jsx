"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideFolder, LucideMaximize2, LucideX, LucideSparkles } from "lucide-react";

// Continuous Typewriter Typing Effect Component
function TypewriterText({ 
  text = "Arup Explores", 
  typingSpeed = 110, 
  deletingSpeed = 55, 
  pauseDuration = 2400,
  initialDelay = 0
}) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(initialDelay === 0);

  useEffect(() => {
    if (!hasStarted) {
      const startTimer = setTimeout(() => setHasStarted(true), initialDelay);
      return () => clearTimeout(startTimer);
    }

    let timer;
    if (!isDeleting && displayText === text) {
      // Pause when full text is typed
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === "") {
      // Pause when text is deleted before typing again
      timer = setTimeout(() => setIsDeleting(false), 500);
    } else {
      const nextIndex = isDeleting
        ? displayText.length - 1
        : displayText.length + 1;

      timer = setTimeout(() => {
        setDisplayText(text.slice(0, nextIndex));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, typingSpeed, deletingSpeed, pauseDuration, hasStarted, initialDelay]);

  return (
    <span className="inline-flex items-center min-w-[92px] sm:min-w-[100px] text-white/95 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap">
      <span>{displayText || "\u00A0"}</span>
      <span className="text-[#00f2fe] font-mono animate-pulse ml-[2px] text-xs">|</span>
    </span>
  );
}

export function MultiFolderGallery({
  folders = [],
  dragHintText = "Drag any photo down to close • Click to inspect",
  onPhotoClick,
  className = ""
}) {
  const [openFolderId, setOpenFolderId] = useState(null);
  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  const activeFolder = folders.find(f => f.id === openFolderId) || null;
  const activePhotos = activeFolder ? activeFolder.photos || [] : [];
  const activeCount = activePhotos.length;
  const midIndex = (activeCount - 1) / 2;

  // Fan-out spread width & card sizes for the active opened folder
  const spreadWidth = isMobile 
    ? Math.min(60, (screenWidth - 60) / Math.max(activeCount, 1)) 
    : (isTablet ? 105 : 130);
  const cardWidth = isMobile ? 175 : 220;
  const cardHeight = isMobile ? 235 : 290;

  return (
    <div className={`w-full pt-2 pb-6 relative select-none ${className}`}>
      
      {/* ── Close Button when any folder is open ── */}
      <AnimatePresence>
        {openFolderId && (
          <motion.div 
            className="w-full flex justify-center mb-6 z-50 relative"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <button
              onClick={() => {
                setOpenFolderId(null);
                setHoveredFolderId(null);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#161224]/90 hover:bg-[#221c38] border border-[#00f2fe]/40 text-white/90 text-xs font-semibold uppercase tracking-wider backdrop-blur-xl shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all cursor-pointer hover:shadow-[0_0_35px_rgba(0,242,254,0.5)]"
            >
              <LucideX size={14} className="text-[#00f2fe]" />
              <span>Close {activeFolder?.name || "Folder"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          STATE 1: ALL 3 FOLDERS SIDE-BY-SIDE (When closed)
          ══════════════════════════════════════════════════ */}
      {!openFolderId ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1140px] mx-auto px-4">
          {folders.map((folder, fIndex) => {
            const isHovered = hoveredFolderId === folder.id;
            const photos = folder.photos || [];
            const count = photos.length;
            const folderMid = (count - 1) / 2;

            return (
              <div 
                key={folder.id}
                className="relative flex flex-col items-center justify-center min-h-[320px] md:min-h-[350px] group"
              >
                {/* ── Folder Stage Container ── */}
                <div className="relative w-[280px] sm:w-[300px] h-[280px] sm:h-[300px] flex justify-center pointer-events-none">
                  
                  {/* ── AMBIENT GRADIENT GLOW BEHIND EACH FOLDER ── */}
                  <motion.div 
                    className="absolute bottom-2 w-64 sm:w-72 h-44 sm:h-48 rounded-3xl pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 50% 60%, rgba(0, 242, 254, 0.35) 0%, rgba(138, 92, 246, 0.3) 45%, rgba(236, 72, 153, 0.15) 75%, transparent 100%)",
                      filter: "blur(26px)",
                      transformOrigin: "center center"
                    }}
                    animate={{
                      opacity: isHovered ? 0.95 : 0.45,
                      scale: isHovered ? 1.18 : 0.95,
                    }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* ── Folder Back Layer ── */}
                  <motion.div 
                    className="absolute bottom-4 w-64 sm:w-72 h-44 sm:h-48 drop-shadow-2xl"
                    animate={{ 
                      scale: isHovered ? 1.02 : 1,
                      y: isHovered ? -6 : 0
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Folder Tab */}
                    <div 
                      className="absolute top-0 left-0 w-24 sm:w-28 h-8 rounded-t-xl border-t border-l border-r border-[#00f2fe]/30"
                      style={{
                        background: "linear-gradient(to top, #1c1533, #312656)"
                      }}
                    />
                    {/* Folder Body Back */}
                    <div 
                      className="absolute top-6 left-0 right-0 bottom-0 rounded-b-2xl rounded-tr-2xl border border-[#00f2fe]/20 shadow-[inset_0_0_35px_rgba(0,0,0,0.85),0_0_20px_rgba(138,92,246,0.2)]"
                      style={{
                        background: "linear-gradient(to bottom, #21193d, #0c0a17)"
                      }}
                    />
                    {/* Inner cavity */}
                    <div 
                      className="absolute top-8 left-2 right-2 bottom-2 rounded-xl shadow-inner pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse at center, #130d26 0%, #06050b 100%)"
                      }}
                    />
                  </motion.div>

                  {/* ── Photo Preview Stack in Closed Folder ── */}
                  <div className="absolute bottom-8 z-10 flex justify-center items-center pointer-events-none">
                    {count > 0 ? (
                      photos.map((photo, i) => {
                        const offset = i - folderMid;
                        const stackY = isHovered ? offset * -6 - 32 : offset * -3;
                        const stackX = isHovered ? offset * 22 : offset * 2;
                        const stackRotate = isHovered ? offset * 6 : offset * 2;
                        const stackScale = 1 - Math.abs(offset) * 0.035;

                        return (
                          <motion.div
                            key={photo.id || `thumb-${folder.id}-${i}`}
                            className="absolute bottom-0 w-36 sm:w-40 h-48 sm:h-52 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_15px_rgba(0,242,254,0.15)] overflow-hidden border border-white/20 origin-bottom"
                            style={{
                              background: "rgba(18, 14, 34, 0.9)",
                            }}
                            animate={{
                              y: stackY,
                              x: stackX,
                              rotate: stackRotate,
                              scale: stackScale,
                              zIndex: i + 10
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          >
                            <img 
                              src={photo.image || photo.src} 
                              alt="thumbnail" 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                            />
                          </motion.div>
                        );
                      })
                    ) : (
                      /* Empty Folder Placeholder inside */
                      <motion.div 
                        animate={{ opacity: isHovered ? 0.9 : 0.45, y: isHovered ? -15 : 0 }}
                        className="text-white/50 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 pb-10"
                      >
                        <LucideSparkles size={12} className="text-[#00f2fe]" />
                        <span>Empty Slot</span>
                      </motion.div>
                    )}
                  </div>

                  {/* ── Folder Front Lid (Clickable with Radiant Gradient Glow) ── */}
                  <motion.div 
                    className="absolute bottom-0 w-[260px] sm:w-[280px] h-32 sm:h-36 cursor-pointer z-30 pointer-events-auto"
                    style={{ transformOrigin: "bottom center", perspective: 1000 }}
                    animate={{ 
                      rotateX: isHovered ? -24 : 0, 
                      y: isHovered ? 8 : 0,
                    }}
                    onMouseEnter={() => setHoveredFolderId(folder.id)}
                    onMouseLeave={() => setHoveredFolderId(null)}
                    onClick={() => setOpenFolderId(folder.id)}
                  >
                    <div 
                      className="w-full h-full rounded-2xl relative overflow-hidden flex items-end justify-center pb-5 sm:pb-6 transition-all duration-300"
                      style={{
                        background: "linear-gradient(145deg, #2d2252 0%, #17112e 60%, #0c091a 100%)",
                        border: isHovered 
                          ? "1.5px solid #00f2fe" 
                          : "1.5px solid rgba(0, 242, 254, 0.35)",
                        boxShadow: isHovered
                          ? "0 0 35px rgba(0, 242, 254, 0.45), 0 0 70px rgba(138, 92, 246, 0.35), inset 0 2px 14px rgba(255, 255, 255, 0.25)"
                          : "0 0 25px rgba(0, 242, 254, 0.2), 0 0 45px rgba(138, 92, 246, 0.15), inset 0 2px 10px rgba(255, 255, 255, 0.15)"
                      }}
                    >
                      {/* Highlight Laser Gradient Top Bevel */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{
                          background: "linear-gradient(90deg, transparent 0%, #00f2fe 30%, #8a5cf6 70%, #ec4899 90%, transparent 100%)",
                          boxShadow: "0 0 10px #00f2fe, 0 0 18px #8a5cf6"
                        }}
                      />

                      {/* Folder Badge / Title with Continuous Typewriter Loop */}
                      <div 
                        className="px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md transition-all duration-300"
                        style={{
                          background: "rgba(10, 7, 22, 0.92)",
                          border: isHovered 
                            ? "1px solid #00f2fe" 
                            : "1px solid rgba(0, 242, 254, 0.35)",
                          boxShadow: isHovered
                            ? "0 0 25px rgba(0, 242, 254, 0.5), 0 0 40px rgba(138, 92, 246, 0.3)"
                            : "0 0 15px rgba(0, 242, 254, 0.25), inset 0 0 8px rgba(138, 92, 246, 0.15)"
                        }}
                      >
                        <LucideFolder 
                          size={14} 
                          className="text-[#00f2fe] flex-shrink-0" 
                          style={{ filter: "drop-shadow(0 0 6px #00f2fe)" }}
                        />
                        <TypewriterText 
                          text={folder.name || "Arup Explores"} 
                          initialDelay={fIndex * 350}
                        />
                        <span 
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0 ${
                            count > 0 
                              ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 shadow-[0_0_8px_rgba(0,242,254,0.3)]' 
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════
            STATE 2: SINGLE ACTIVE OPENED FOLDER (Fanned out)
            ══════════════════════════════════════════════════ */
        <div className="relative w-full min-h-[380px] md:min-h-[420px] flex flex-col items-center justify-center">

          <div className="relative w-[340px] md:w-[400px] h-[340px] md:h-[380px] flex justify-center pointer-events-none z-0">
            
            {/* Ambient Glow for Opened Stage */}
            <div 
              className="absolute bottom-2 w-72 md:w-80 h-48 md:h-52 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(0, 242, 254, 0.4) 0%, rgba(138, 92, 246, 0.35) 50%, transparent 100%)",
                filter: "blur(32px)"
              }}
            />

            {/* ── Fanned Out Photo Cards ── */}
            <div className="absolute bottom-8 z-10 flex justify-center items-center">
              {activeCount > 0 ? (
                activePhotos.map((photo, i) => {
                  const offset = i - midIndex;
                  const openY = isMobile ? -90 : -110;
                  const openX = offset * spreadWidth;
                  const openRotate = isMobile ? offset * 4 : offset * 3;
                  const openScale = isMobile ? 0.95 : 1.05;

                  return (
                    <motion.div
                      key={photo.id || `open-photo-${i}`}
                      drag={true}
                      dragSnapToOrigin={true}
                      onDragEnd={(e, info) => {
                        if (info.offset.y > 80) {
                          setOpenFolderId(null);
                          setHoveredFolderId(null);
                        }
                      }}
                      onClick={() => {
                        if (onPhotoClick) onPhotoClick(photo);
                      }}
                      className="absolute bottom-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(0,242,254,0.25)] overflow-hidden border border-white/25 origin-bottom transition-all group cursor-grab active:cursor-grabbing pointer-events-auto hover:border-[#00f2fe] hover:shadow-[0_25px_60px_rgba(0,242,254,0.4),0_0_40px_rgba(138,92,246,0.3)]"
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        background: "rgba(18, 14, 34, 0.9)",
                      }}
                      initial={{
                        y: 0,
                        x: 0,
                        rotate: 0,
                        scale: 0.8,
                        opacity: 0
                      }}
                      animate={{
                        y: openY,
                        x: openX,
                        rotate: openRotate,
                        scale: openScale,
                        opacity: 1,
                        zIndex: 50 + i
                      }}
                      whileHover={{ scale: openScale + 0.08, zIndex: 120, y: openY - 15 }}
                      whileDrag={{ scale: openScale + 0.12, rotate: 6, zIndex: 150 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    >
                      <img 
                        src={photo.image || photo.src} 
                        alt={photo.title || "Gallery item"} 
                        className="w-full h-full object-cover pointer-events-none" 
                        loading="lazy"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080612]/95 via-[#080612]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                        {photo.category && (
                          <span className="text-[10px] uppercase font-bold text-[#00f2fe] tracking-wider mb-1">
                            {photo.category}
                          </span>
                        )}
                        <h4 className="text-white text-sm font-bold truncate">
                          {photo.title || "Untitled"}
                        </h4>
                        {photo.location && (
                          <span className="text-white/60 text-[11px] truncate">
                            {photo.location}
                          </span>
                        )}
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#00f2fe]">
                          <LucideMaximize2 size={12} />
                          <span>Inspect photo</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                /* Empty State Message inside opened empty folder */
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -40 }}
                  className="px-6 py-4 rounded-2xl bg-[#140f26]/90 border border-[#00f2fe]/30 backdrop-blur-xl text-center shadow-[0_0_30px_rgba(0,242,254,0.2)] z-50 pointer-events-auto"
                >
                  <p className="text-white/90 font-semibold text-sm mb-1">Folder is currently empty</p>
                  <p className="text-white/50 text-xs">New captures will be uploaded here soon.</p>
                </motion.div>
              )}
            </div>

          </div>

          {/* Drag Hint at Bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-1 md:bottom-2 px-6 py-2 rounded-full bg-[#120e24]/80 border border-[#00f2fe]/30 backdrop-blur-xl text-white/80 text-xs font-medium uppercase tracking-widest pointer-events-none shadow-[0_0_20px_rgba(0,242,254,0.2)]"
          >
            {activeCount > 0 ? dragHintText : "Click Close Folder above to return"}
          </motion.div>

        </div>
      )}

    </div>
  );
}

export { MultiFolderGallery as InteractiveFolderGallery };
