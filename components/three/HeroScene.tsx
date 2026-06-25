'use client';

/**
 * Morphing Noise Blobs — 3-colour system only
 * Violet family : #8b5cf6 / #a78bfa (--color-violet-mid / --color-violet-light)
 * Cyan family   : #22d3ee / #67e8f9 (--color-cyan / --color-cyan-light)
 * Gold family   : #f59e0b / #fcd34d (--color-gold / --color-gold-light)
 *
 * Deep surface colours (lit by coloured point lights → appear as the accent):
 *   Violet deep : #4c1d95 · #3b0764
 *   Cyan deep   : #0c4a6e · #164e63
 *   Gold deep   : #78350f · #451a03
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Single morphing blob ─────────────────────────────────────────────────────
interface BlobProps {
  position:   [number, number, number];
  radius:     number;
  color:      string;
  emissive:   string;
  emissiveIntensity?: number;
  distort:    number;
  speed:      number;
  opacity:    number;
  metalness?: number;
  roughness?: number;
  floatSpeed?:        number;
  floatIntensity?:    number;
  rotationIntensity?: number;
  reduced: boolean;
}

function Blob({
  position, radius, color, emissive,
  emissiveIntensity = 0.35,
  distort, speed, opacity,
  metalness = 0.82, roughness = 0.08,
  floatSpeed = 2, floatIntensity = 0.5,
  rotationIntensity = 0.18,
  reduced,
}: BlobProps) {
  return (
    <Float
      speed={reduced ? 0 : floatSpeed}
      rotationIntensity={reduced ? 0 : rotationIntensity}
      floatIntensity={reduced ? 0 : floatIntensity}
    >
      <mesh position={position}>
        <sphereGeometry args={[radius, 128, 128]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          distort={reduced ? 0 : distort}
          speed={reduced ? 0 : speed}
          roughness={roughness}
          metalness={metalness}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

// ─── Orbiting coloured light ──────────────────────────────────────────────────
function OrbitLight({
  radius, speed, startAngle, yOffset, color, intensity, reduced,
}: {
  radius: number; speed: number; startAngle: number;
  yOffset: number; color: string; intensity: number; reduced: boolean;
}) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    const t = clock.elapsedTime * speed + startAngle;
    ref.current.position.x = Math.sin(t) * radius;
    ref.current.position.z = Math.cos(t) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 0.5) * 0.6;
  });

  return <pointLight ref={ref} color={color} intensity={intensity} distance={9} decay={2} />;
}

// ─── Hero scene ───────────────────────────────────────────────────────────────
interface HeroSceneProps {
  mouseX:  number;
  mouseY:  number;
  reduced: boolean;
}

export function HeroScene({ mouseX, mouseY, reduced }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current || reduced) return;
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, mouseX *  0.22, 0.032);
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, mouseY * -0.12, 0.032);
  });

  return (
    <>
      <ambientLight intensity={0.08} />

      {/* Static lights for reduced-motion fallback */}
      {reduced && (
        <>
          <pointLight position={[4, 3, 4]}   color="#8b5cf6" intensity={4} />
          <pointLight position={[-3, -2, -3]} color="#22d3ee" intensity={2.5} />
          <pointLight position={[2, -3, 2]}   color="#f59e0b" intensity={2} />
        </>
      )}

      {/*
        Orbiting lights — ONLY the 3 design-system accent colours:
          #8b5cf6 = --color-violet-mid
          #22d3ee = --color-cyan
          #f59e0b = --color-gold
          #a78bfa = --color-violet-light (4th, a lighter violet tint — stays in family)
      */}
      {!reduced && (
        <>
          <OrbitLight radius={4}   speed={0.38} startAngle={0}             yOffset={1}   color="#8b5cf6" intensity={5}   reduced={reduced} />
          <OrbitLight radius={3.5} speed={0.25} startAngle={Math.PI}       yOffset={-1}  color="#22d3ee" intensity={3.5} reduced={reduced} />
          <OrbitLight radius={5}   speed={0.17} startAngle={Math.PI / 2}   yOffset={0.5} color="#f59e0b" intensity={2.5} reduced={reduced} />
          <OrbitLight radius={3}   speed={0.45} startAngle={Math.PI * 1.5} yOffset={0}   color="#a78bfa" intensity={2}   reduced={reduced} />
        </>
      )}

      <group ref={groupRef}>
        {/*
          Blob colour families (deep surface + emissive):
            Violet  deep → lit by violet light  → reads as #8b5cf6
            Cyan    deep → lit by cyan light    → reads as #22d3ee
            Gold    deep → lit by gold light    → reads as #f59e0b
        */}

        {/* ── 1. Main — large violet ──────────────────────────────────────── */}
        <Blob
          position={[0, 0, 0]}
          radius={2.4}
          color="#4c1d95"
          emissive="#2e1065"
          emissiveIntensity={0.4}
          distort={0.48}
          speed={1.6}
          opacity={0.88}
          metalness={0.88}
          roughness={0.06}
          floatSpeed={1.4}
          floatIntensity={0.38}
          rotationIntensity={0.1}
          reduced={reduced}
        />

        {/* ── 2. Medium — cyan (upper-left) ──────────────────────────────── */}
        <Blob
          position={[-2.2, 1.6, -0.8]}
          radius={1.65}
          color="#0c4a6e"
          emissive="#082f49"
          emissiveIntensity={0.35}
          distort={0.58}
          speed={2.2}
          opacity={0.72}
          metalness={0.75}
          roughness={0.11}
          floatSpeed={2.2}
          floatIntensity={0.62}
          rotationIntensity={0.22}
          reduced={reduced}
        />

        {/* ── 3. Smaller — gold (lower-right) ────────────────────────────── */}
        <Blob
          position={[2.1, -1.7, -0.4]}
          radius={1.35}
          color="#78350f"
          emissive="#451a03"
          emissiveIntensity={0.3}
          distort={0.52}
          speed={2.8}
          opacity={0.68}
          metalness={0.92}
          roughness={0.04}
          floatSpeed={2.8}
          floatIntensity={0.55}
          rotationIntensity={0.25}
          reduced={reduced}
        />

        {/* ── 4. Small — violet lighter shade (upper-right) ──────────────── */}
        <Blob
          position={[2, 2.1, 0.3]}
          radius={0.9}
          color="#5b21b6"
          emissive="#3b0764"
          emissiveIntensity={0.45}
          distort={0.65}
          speed={3.4}
          opacity={0.62}
          metalness={0.78}
          roughness={0.09}
          floatSpeed={3.4}
          floatIntensity={0.82}
          rotationIntensity={0.3}
          reduced={reduced}
        />

        {/* ── 5. Micro — cyan darker shade (lower-left) ──────────────────── */}
        <Blob
          position={[-1.6, -2, 0.8]}
          radius={0.72}
          color="#164e63"
          emissive="#0a2536"
          emissiveIntensity={0.5}
          distort={0.72}
          speed={4}
          opacity={0.55}
          metalness={0.8}
          roughness={0.07}
          floatSpeed={4}
          floatIntensity={0.9}
          rotationIntensity={0.35}
          reduced={reduced}
        />
      </group>
    </>
  );
}
