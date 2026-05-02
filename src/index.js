import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Lenis from '@studio-freight/lenis';

/* ── Lenis smooth scroll ────────────────────────────────────────────────────
 * smoothTouch: false  → keeps native momentum scrolling on iOS/Android
 * The RAF loop is the ONLY place we call lenis.raf() — no extra loops added
 * ─────────────────────────────────────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false, // disable on touch devices — keep native scroll
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);