/**
 * SplineScene.jsx
 * High-performance, non-blocking 3D scene loader with:
 * - Deferred asynchronous initialization (prioritizes critical UI/text/About)
 * - Viewport-aware rendering loop (pauses when off-screen to save GPU/CPU)
 * - WebGL resource disposal on unmount (prevents memory leaks)
 * - Smooth transition from lightweight placeholder
 */

import React, { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

function SplineLoader() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
      }}
    >
      {/* Soft pulse glow background */}
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          animation: 'spline-pulse 2s ease-in-out infinite',
        }}
      />
      {/* Themed spinner matching violet palette */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '2.5px solid rgba(139,92,246,0.15)',
          borderTopColor: '#8B5CF6',
          animation: 'spline-spin 0.8s linear infinite',
          zIndex: 1,
        }}
      />
      <span
        style={{
          fontSize: '0.75rem',
          color: 'rgba(139,92,246,0.6)',
          letterSpacing: '2px',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          zIndex: 1,
        }}
      >
        Initializing 3D
      </span>
      <style>{`
        @keyframes spline-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spline-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default function SplineScene({ scene, className, style }) {
  const containerRef = useRef(null);
  const splineAppRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Defer mounting until after critical UI has rendered
  useEffect(() => {
    let idleId = null;
    let timerId = null;

    const startMounting = () => {
      setShouldMount(true);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startMounting, { timeout: 250 });
    } else {
      timerId = setTimeout(startMounting, 50);
    }

    return () => {
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // 2. Preload the .splinecode binary in the background
  useEffect(() => {
    if (!scene) return;
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = scene;
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    } catch (_) {}
  }, [scene]);

  // 3. Pause Spline animation/rendering loop when off-screen, resume when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const app = splineAppRef.current;
        if (!app) return;

        if (entry.isIntersecting) {
          try {
            if (typeof app.play === 'function') {
              app.play();
            }
          } catch (_) {}
        } else {
          try {
            if (typeof app.stop === 'function') {
              app.stop();
            }
          } catch (_) {}
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (splineAppRef.current) {
        try {
          if (typeof splineAppRef.current.dispose === 'function') {
            splineAppRef.current.dispose();
          }
        } catch (_) {}
        splineAppRef.current = null;
      }
    };
  }, []);

  const handleSplineLoad = useCallback((app) => {
    splineAppRef.current = app;
    setIsLoaded(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* Lightweight fallback while 3D is preparing or loading */}
      {(!shouldMount || !isLoaded) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          <SplineLoader />
        </div>
      )}

      {/* Asynchronously loaded Spline 3D Scene */}
      {shouldMount && (
        <div
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        >
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={handleSplineLoad}
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
