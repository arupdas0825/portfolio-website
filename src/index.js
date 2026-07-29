import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Filter third-party runtime warnings (e.g. @splinetool/runtime bundled Three.js core)
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Multiple instances of Three.js') ||
       args[0].includes('THREE.Clock: This module has been deprecated'))
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);