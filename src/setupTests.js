import '@testing-library/jest-dom';
jest.setTimeout(15000);
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Canvas 2D context for JSDOM
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  setTransform: jest.fn(),
  scale: jest.fn(),
  font: '',
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  measureText: jest.fn(() => ({ width: 100 })),
  createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
  fillText: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(400), width: 100, height: 100 })),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
}));

// Polyfill ResizeObserver for JSDOM / Three.js Canvas tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill IntersectionObserver for JSDOM
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill matchMedia for JSDOM
window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

jest.mock('@splinetool/react-spline', () => {
  return function DummySpline() {
    return null;
  };
}, { virtual: true });
