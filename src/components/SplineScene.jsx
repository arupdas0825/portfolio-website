/**
 * SplineScene.jsx
 * Lazy-loads a Spline 3D scene with a themed loading spinner.
 * No TypeScript / Next.js — pure React CRA compatible.
 */

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

function SplineLoader() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Themed spinner matching violet palette */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '3px solid rgba(139,92,246,0.15)',
        borderTopColor: '#8B5CF6',
        animation: 'spline-spin 0.8s linear infinite',
      }} />
      <span style={{
        fontSize: '0.78rem',
        color: 'rgba(139,92,246,0.6)',
        letterSpacing: '2px',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
      }}>Loading 3D Scene</span>
      <style>{`
        @keyframes spline-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function SplineScene({ scene, className, style }) {
  return (
    <Suspense fallback={<SplineLoader />}>
      <Spline
        scene={scene}
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
      />
    </Suspense>
  );
}
