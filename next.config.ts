import type { NextConfig } from 'next';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:5000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Browser calls /api/* → Next.js proxies to Express (no CORS needed)
        source: '/api/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },

  // Transpile @react-three packages so Next.js can tree-shake them correctly
  transpilePackages: ['@react-three/fiber', '@react-three/drei', 'three'],
};

export default nextConfig;
