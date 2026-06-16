import React from 'react';
import { render } from '@testing-library/react';
import Gallery from './Gallery';

// Mock IntersectionObserver for Framer Motion viewport triggers in Jest
class MockIntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

test('renders Gallery without crashing', () => {
  render(<Gallery />);
});
