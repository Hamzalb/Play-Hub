'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { HeroScene } from './HeroScene';

export function HeroCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced ?? false;

  useEffect(() => {
    function handler(e: MouseEvent) {
      setMouse({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    }
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9.5], fov: 58 }}  // wider FOV so blobs fill the full-width hero
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <HeroScene mouseX={mouse.x} mouseY={mouse.y} reduced={reduced} />
    </Canvas>
  );
}
