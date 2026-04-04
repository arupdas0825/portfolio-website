/**
 * useAnimationFrame.js
 * Provides a clean RAF loop with delta-time for frame-rate-independent animation.
 */
import { useEffect, useRef } from 'react';

/**
 * @param {function} callback - Called each frame with (deltaTime, elapsed)
 * @param {boolean} [active=true] - Pause/resume the loop
 */
export function useAnimationFrame(callback, active = true) {
  const rafRef     = useRef(null);
  const prevTimeRef = useRef(null);
  const callbackRef = useRef(callback);

  // Keep callback ref fresh without restarting the loop
  useEffect(() => { callbackRef.current = callback; }, [callback]);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevTimeRef.current = null;
      return;
    }

    const loop = (timestamp) => {
      if (prevTimeRef.current === null) prevTimeRef.current = timestamp;
      const deltaTime = Math.min((timestamp - prevTimeRef.current) / 1000, 0.1); // cap at 100ms
      prevTimeRef.current = timestamp;
      callbackRef.current(deltaTime, timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevTimeRef.current = null;
    };
  }, [active]);
}
