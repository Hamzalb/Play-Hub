'use client';

import { useReducedMotion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ParticlesScene } from './ParticlesBackground';

export function ParticlesCanvas() {
  const prefersReduced = useReducedMotion();

  // If user prefers reduced motion, render nothing — saves CPU/GPU completely
  if (prefersReduced) return null;

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,          // above aurora (z:0) + grain (z:1), below page-content (z:2)
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 18], fov: 55 }}
        dpr={1}                           // never scale up — particles don't need it
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <ParticlesScene reduced={prefersReduced ?? false} />
      </Canvas>
    </div>
  );
}
