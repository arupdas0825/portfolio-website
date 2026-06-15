import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideX, LucideLock, LucideAlertTriangle } from 'lucide-react';
import { loginAdmin } from '../utils/auth';
import './PasswordModal.css';

export default function PasswordModal({ isOpen, onClose, onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setShaking(false);
      setLoading(false);
      // Delay focus slightly to let entry animation finish
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');
    setShaking(false);

    try {
      // Small artificial delay to mimic server-side roundtrip
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const success = await loginAdmin(password);
      if (success) {
        onAuthSuccess();
      } else {
        setError('Invalid Password');
        setShaking(true);
        setPassword('');
        // Stop shaking after animation finishes
        setTimeout(() => setShaking(false), 500);
        if (inputRef.current) inputRef.current.focus();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setShaking(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="pwd-modal-overlay">
          {/* Backdrop Blur/Fade */}
          <motion.div
            className="pwd-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="pwd-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Holographic Border Highlights */}
            <div className="pwd-cyber-corner tl" />
            <div className="pwd-cyber-corner tr" />
            <div className="pwd-cyber-corner bl" />
            <div className="pwd-cyber-corner br" />

            {/* Close Button */}
            <button className="pwd-modal-close" onClick={onClose} aria-label="Close modal">
              <LucideX size={18} />
            </button>

            {/* Header / Lock Icon */}
            <div className="pwd-modal-header">
              <div className="pwd-lock-orb">
                <LucideLock className="pwd-lock-icon" size={24} />
              </div>
              <h2 className="pwd-modal-title">Enter Admin Password</h2>
              <p className="pwd-modal-subtitle">Authorized personnel verification required</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="pwd-modal-form">
              <motion.div 
                className={`pwd-input-wrapper ${shaking ? 'pwd-shake' : ''}`}
                style={{ position: 'relative' }}
              >
                <input
                  ref={inputRef}
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`pwd-input-field ${error ? 'pwd-input-error' : ''}`}
                />
                
                {/* Visual Glow Layer */}
                <div className="pwd-input-glow" />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    className="pwd-error-message"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <LucideAlertTriangle size={14} style={{ marginRight: 6 }} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="pwd-submit-btn"
              >
                {loading ? (
                  <div className="pwd-btn-spinner" />
                ) : (
                  <span>Verify Access</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
