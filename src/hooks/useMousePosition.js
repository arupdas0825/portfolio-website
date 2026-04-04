/**
 * useMousePosition.js
 * Tracks mouse / pointer position relative to a target element (or window).
 */
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @param {React.RefObject} [targetRef] - Track relative to element; null = window
 * @returns {{ x: number, y: number, nx: number, ny: number }}
 *   x, y  = raw client pixels
 *   nx, ny = normalized [-1, 1] relative to target center
 */
export function useMousePosition(targetRef = null) {
  const [pos, setPos] = useState({ x: 0, y: 0, nx: 0, ny: 0 });

  const handleMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (targetRef && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      setPos({
        x:  relX,
        y:  relY,
        nx: (relX / rect.width)  * 2 - 1,
        ny: (relY / rect.height) * 2 - 1,
      });
    } else {
      setPos({
        x:  clientX,
        y:  clientY,
        nx: (clientX / window.innerWidth)  * 2 - 1,
        ny: (clientY / window.innerHeight) * 2 - 1,
      });
    }
  }, [targetRef]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [handleMove]);

  return pos;
}
