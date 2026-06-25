'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// ─── rAF loop — mirrors the user's useAnimFrame(callback, active) signature ──
function useAnimFrame(callback: () => void, active: boolean) {
  const rafId  = useRef<number | null>(null);
  const fnRef  = useRef(callback);
  fnRef.current = callback;

  useEffect(() => {
    if (!active) {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      return;
    }
    const loop = () => {
      fnRef.current();
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => { if (rafId.current !== null) cancelAnimationFrame(rafId.current); };
  }, [active]);
}

// ─── Goo SVG noise blob background ──────────────────────────────────────────
// Uses feGaussianBlur + feColorMatrix (the "goo filter" technique).
// All fill colours are strict design-system accents:
//   #8b5cf6 = --color-violet-mid
//   #7c3aed = --color-violet
//   #22d3ee = --color-cyan
//   #f59e0b = --color-gold
export function NoiseBlobBg() {
  const prefersReduced = useReducedMotion();
  const [t, setT] = useState(0);

  useAnimFrame(
    useCallback(() => setT(prev => prev + 0.022), []),
    !prefersReduced
  );

  // 4 blobs — violet(×2), cyan, gold
  const blobs = [
    {
      cx:   50 + Math.sin(t) * 20,
      cy:   48 + Math.cos(t * 0.7) * 16,
      rx:   31 + Math.sin(t * 1.3) * 5,
      ry:   27 + Math.cos(t * 0.9) * 3,
      fill: '#8b5cf6',          // --color-violet-mid — dominant, largest blob
    },
    {
      cx:   34 + Math.cos(t * 0.8) * 22,
      cy:   38 + Math.sin(t * 1.1) * 17,
      rx:   24 + Math.sin(t * 0.7) * 3,
      ry:   22,
      fill: '#7c3aed',          // --color-violet — second violet, darker hue
    },
    {
      cx:   66 + Math.sin(t * 1.2) * 16,
      cy:   60 + Math.cos(t * 0.6) * 19,
      rx:   21,
      ry:   21 + Math.sin(t * 1.4) * 3,
      fill: '#22d3ee',          // --color-cyan
    },
    {
      cx:   50 + Math.cos(t * 0.5) * 17,
      cy:   66 + Math.sin(t * 0.9) * 13,
      rx:   18 + Math.cos(t * 1.1) * 2,
      ry:   16,
      fill: '#f59e0b',          // --color-gold — warm accent
    },
  ];

  return (
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* stdDeviation in 100-unit space ≈ large soft blur → goo merge effect */}
          <filter id="goo-hero-f" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            />
          </filter>
        </defs>

        <g filter="url(#goo-hero-f)">
          {blobs.map((b, i) => (
            <ellipse
              key={i}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={b.fill}
              opacity="0.65"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
