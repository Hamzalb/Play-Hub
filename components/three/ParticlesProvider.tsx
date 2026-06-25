'use client';

import dynamic from 'next/dynamic';

// Dynamic import must live in a Client Component (not a Server Component layout)
const ParticlesCanvas = dynamic(
  () => import('./ParticlesCanvas').then((m) => m.ParticlesCanvas),
  { ssr: false, loading: () => null }
);

export function ParticlesProvider() {
  return <ParticlesCanvas />;
}
