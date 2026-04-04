/**
 * mathHelpers.js
 * Pure math utilities for the infinity vortex animations.
 */

// ─────────────────────────────────────────────────────────────────────────────
// LEMNISCATE OF BERNOULLI — the mathematical infinity curve
// x(t) = a·cos(t) / (1 + sin²(t))
// y(t) = a·sin(t)·cos(t) / (1 + sin²(t))
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a point on the lemniscate at parameter t, scaled by a.
 * @param {number} t - Angle parameter [0, 2π]
 * @param {number} a - Scale (half-width of the loop)
 * @returns {{ x: number, y: number }}
 */
export function lemniscate(t, a) {
  const sin = Math.sin(t);
  const cos = Math.cos(t);
  const denom = 1 + sin * sin;
  return { x: (a * cos) / denom, y: (a * sin * cos) / denom };
}

/**
 * Builds an arc-length lookup table for uniform-speed motion along the lemniscate.
 * @param {number} a - Scale
 * @param {number} steps - Sample count (higher = more accurate)
 * @returns {{ pts: Array, totalLen: number }}
 */
export function buildLemniscateTable(a, steps = 800) {
  const pts = [];
  let totalLen = 0;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const p = lemniscate(t, a);

    if (i > 0) {
      const prev = pts[pts.length - 1];
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      totalLen += Math.sqrt(dx * dx + dy * dy);
    }

    pts.push({ x: p.x, y: p.y, arc: totalLen });
  }

  return { pts, totalLen };
}

/**
 * Get a position on the lemniscate at normalized arc-length u ∈ [0, 1].
 * Uses binary search for O(log n) lookup.
 * @param {{ pts: Array, totalLen: number }} table
 * @param {number} u - Normalized position [0, 1]
 * @returns {{ x: number, y: number }}
 */
export function posAtArcLength(table, u) {
  const target = ((u % 1) + 1) % 1 * table.totalLen;
  let lo = 0;
  let hi = table.pts.length - 1;

  // Binary search
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    table.pts[mid].arc < target ? (lo = mid) : (hi = mid);
  }

  const a = table.pts[lo];
  const b = table.pts[hi];
  const span = b.arc - a.arc;
  if (span < 1e-9) return { x: a.x, y: a.y };

  const frac = (target - a.arc) / span;
  return {
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR ORBIT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evenly distribute n points on a circle of given radius.
 * @param {number} n - Number of points
 * @param {number} radius - Circle radius
 * @param {number} [phase=0] - Starting angle offset (radians)
 * @returns {Array<{ angle: number, x: number, y: number }>}
 */
export function distributeOnCircle(n, radius, phase = 0) {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + phase;
    return {
      angle,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

/**
 * Get x, y, z-depth for a logo at a given angle on the orbit.
 * Gives an elliptical orbit with depth perception.
 * @param {number} angle - Current orbit angle (radians)
 * @param {number} rx - Horizontal radius
 * @param {number} ry - Vertical radius (smaller → tighter ellipse)
 * @returns {{ x: number, y: number, depth: number, scale: number }}
 */
export function orbitPosition(angle, rx, ry) {
  const x = Math.cos(angle) * rx;
  const y = Math.sin(angle) * ry;
  // depth: 0 = farthest back, 1 = closest front
  const depth = (Math.sin(angle) + 1) / 2;
  // scale logos based on depth for 3D feel
  const scale = 0.65 + depth * 0.5;
  return { x, y, depth, scale };
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERAL MATH
// ─────────────────────────────────────────────────────────────────────────────

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/** Map a value from one range to another */
export const mapRange = (val, inMin, inMax, outMin, outMax) =>
  outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Distance between two 2D points */
export const dist2D = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/** Non-uniform eased interpolation for smooth transitions */
export const easeInOutQuart = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
