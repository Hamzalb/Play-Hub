'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Orbiting colored point light ────────────────────────────────────────────
function OrbitLight({
  radius, speed, yOffset, startAngle, color, intensity,
}: {
  radius: number; speed: number; yOffset: number;
  startAngle: number; color: string; intensity: number;
}) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + startAngle;
    if (ref.current) {
      ref.current.position.x = Math.sin(t) * radius;
      ref.current.position.z = Math.cos(t) * radius;
      ref.current.position.y = yOffset + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <pointLight
      ref={ref}
      color={color}
      intensity={intensity}
      distance={8}
      decay={2}
    />
  );
}

// ─── The crystal core ─────────────────────────────────────────────────────────
function Crystal({ reduced }: { reduced: boolean }) {
  const innerRef  = useRef<THREE.Mesh>(null);
  const outerRef  = useRef<THREE.Mesh>(null);
  const ring1Ref  = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);
  const ring3Ref  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;

    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.07;
      outerRef.current.rotation.y = t * 0.11;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.18;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.13;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = -t * 0.09;
    }
  });

  return (
    <group>
      {/* Outer wireframe shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.15, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Inner glowing distorted sphere */}
      <Float
        speed={reduced ? 0 : 1.8}
        rotationIntensity={0.25}
        floatIntensity={0.5}
      >
        <mesh ref={innerRef}>
          <sphereGeometry args={[1.35, 64, 64]} />
          <MeshDistortMaterial
            color="#6d28d9"
            distort={reduced ? 0 : 0.38}
            speed={reduced ? 0 : 1.8}
            roughness={0.05}
            metalness={0.85}
            emissive="#4c1d95"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Orbital ring 1 — violet, tilted */}
      <mesh
        ref={ring1Ref}
        rotation={[Math.PI * 0.12, 0, Math.PI * 0.18]}
      >
        <torusGeometry args={[3.1, 0.014, 16, 100]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} />
      </mesh>

      {/* Orbital ring 2 — cyan, steeper tilt */}
      <mesh
        ref={ring2Ref}
        rotation={[Math.PI * 0.42, Math.PI * 0.08, 0]}
      >
        <torusGeometry args={[2.6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
      </mesh>

      {/* Orbital ring 3 — gold, near equator */}
      <mesh
        ref={ring3Ref}
        rotation={[Math.PI * 0.05, Math.PI * 0.3, Math.PI * 0.05]}
      >
        <torusGeometry args={[3.5, 0.008, 16, 100]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.28} />
      </mesh>

      {/* Sparkle particles */}
      <Sparkles
        count={reduced ? 0 : 55}
        scale={7}
        size={2.2}
        speed={0.35}
        opacity={0.55}
        color="#a78bfa"
        noise={0.15}
      />
    </group>
  );
}

// ─── Root scene — exported ────────────────────────────────────────────────────
interface HeroSceneProps {
  mouseX: number;
  mouseY: number;
  reduced: boolean;
}

export function HeroScene({ mouseX, mouseY, reduced }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth parallax follow toward mouse position
  useFrame(() => {
    if (!groupRef.current || reduced) return;
    groupRef.current.rotation.y = lerp(
      groupRef.current.rotation.y,
      mouseX * 0.28,
      0.035
    );
    groupRef.current.rotation.x = lerp(
      groupRef.current.rotation.x,
      mouseY * -0.14,
      0.035
    );
  });

  return (
    <>
      {/* Static ambient */}
      <ambientLight intensity={0.12} />

      {/* Two orbiting colored lights that paint the crystal as they move */}
      {!reduced && (
        <>
          <OrbitLight radius={3.5} speed={0.4}  yOffset={1}   startAngle={0}           color="#8b5cf6" intensity={3.5} />
          <OrbitLight radius={3}   speed={0.28} yOffset={-1}  startAngle={Math.PI}     color="#22d3ee" intensity={2.5} />
          <OrbitLight radius={4}   speed={0.18} yOffset={0.5} startAngle={Math.PI / 2} color="#fbbf24" intensity={1.5} />
        </>
      )}
      {reduced && (
        <>
          <pointLight position={[3, 2, 3]}   color="#8b5cf6" intensity={3} />
          <pointLight position={[-3, -2, -3]} color="#22d3ee" intensity={2} />
        </>
      )}

      <group ref={groupRef}>
        <Crystal reduced={reduced} />
      </group>
    </>
  );
}
