// src/admin/AdminPanel.js
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel({ onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      unsub();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  // ✅ FIXED tilt (translate always preserved)
  const handleMouseMove = (e) => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / rect.height) * -4;
    const rotY = (x / rect.width) * 4;

    panel.style.transform = `
      translate(-50%, -50%)
      perspective(1200px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
      scale(1)
    `;
  };

  const handleMouseLeave = () => {
    if (!panelRef.current) return;

    panelRef.current.style.transform = `
      translate(-50%, -50%)
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `
            translate(-50%, -50%)
            perspective(1200px)
            scale(${visible ? 1 : 0.9})
          `,
          zIndex: 1500,
          width: '92vw',
          maxWidth: 1000,
          height: '88vh',
          background: 'rgba(12,8,24,0.85)',
          border: '1px solid rgba(138,92,246,0.3)',
          borderRadius: 28,
          boxShadow: `
            0 40px 120px rgba(0,0,0,0.8),
            0 0 80px rgba(138,92,246,0.15)
          `,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ color: '#fff', fontWeight: 'bold' }}>
            Admin Panel
          </div>

          <button onClick={handleClose} style={{ cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              Loading...
            </div>
          ) : user ? (
            <AdminDashboard user={user} onClose={handleClose} />
          ) : (
            <AdminLogin />
          )}
        </div>
      </div>
    </>
  );
}