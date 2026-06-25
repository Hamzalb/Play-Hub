'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 90;

// Brand palette — violet, cyan, gold, mixed
const PALETTE = [
  new THREE.Color('#8b5cf6'),
  new THREE.Color('#a78bfa'),
  new THREE.Color('#c4b5fd'),
  new THREE.Color('#22d3ee'),
  new THREE.Color('#67e8f9'),
  new THREE.Color('#fbbf24'),
];

// Glow particle texture — bright core fading into a wide soft halo
function createParticleTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx  = size / 2;
  const g   = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0,    'rgba(255,255,255,1.0)');   // solid bright core
  g.addColorStop(0.12, 'rgba(255,255,255,0.95)');  // tight inner bloom
  g.addColorStop(0.3,  'rgba(255,255,255,0.55)');  // mid glow
  g.addColorStop(0.6,  'rgba(255,255,255,0.15)');  // outer halo
  g.addColorStop(1,    'rgba(255,255,255,0)');      // fade to transparent
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface ParticleData {
  geometry:   THREE.BufferGeometry;
  phases:     Float32Array;   // per-particle time phase offset for twinkle
  baseY:      Float32Array;   // initial Y for reset detection
  speedY:     Float32Array;   // per-particle rise speed
  speedX:     Float32Array;   // per-particle x-drift speed
}

export function ParticlesScene({ reduced }: { reduced: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, phases, speedY, speedX } = useMemo<ParticleData>(() => {
    // Positions spread wide to fill any viewport at camera z=18
    const pos      = new Float32Array(COUNT * 3);
    const colors   = new Float32Array(COUNT * 3);
    const sizes    = new Float32Array(COUNT);
    const phases   = new Float32Array(COUNT);
    const baseY    = new Float32Array(COUNT);
    const speedY   = new Float32Array(COUNT);
    const speedX   = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 12 - 6;
      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      baseY[i] = y;

      // Random color from palette
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Random particle size — larger for a glowing feel
      sizes[i]  = Math.random() * 1.0 + 0.45;
      phases[i] = Math.random() * Math.PI * 2;
      speedY[i] = Math.random() * 0.007 + 0.002;   // slow upward drift
      speedX[i] = (Math.random() - 0.5) * 0.002;   // gentle side drift
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,    3));
    geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.Float32BufferAttribute(sizes,  1));

    return { geometry: geo, phases, baseY, speedY, speedX };
  }, []);

  const texture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createParticleTexture();
  }, []);

  useFrame(({ clock }) => {
    if (reduced || !pointsRef.current) return;

    const t     = clock.elapsedTime;
    const posAttr  = pointsRef.current.geometry.attributes['position'] as THREE.BufferAttribute;
    const sizeAttr = pointsRef.current.geometry.attributes['size']     as THREE.BufferAttribute;
    const pos   = posAttr.array  as Float32Array;
    const sizes = sizeAttr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      // Rise upward
      pos[i * 3 + 1] += speedY[i]!;
      // Gentle horizontal oscillation
      pos[i * 3]     += Math.sin(t * 0.3 + phases[i]!) * 0.002 + speedX[i]!;

      // Reset particle to bottom when it exits top
      if (pos[i * 3 + 1] > 16) {
        pos[i * 3]     = (Math.random() - 0.5) * 50;
        pos[i * 3 + 1] = -16;
      }

      // Twinkle: pulse size with a slow sine wave
      const base = (Math.random() * 1.0 + 0.45);
      sizes[i] = base + Math.sin(t * 1.2 + phases[i]!) * 0.2;
    }

    posAttr.needsUpdate  = true;
    sizeAttr.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        map={texture}
        alphaMap={texture}
        vertexColors
        transparent
        opacity={0.82}
        size={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        alphaTest={0.002}
      />
    </points>
  );
}
