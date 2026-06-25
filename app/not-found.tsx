'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.10) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-lg"
      >
        {/* 404 display */}
        <p
          className="text-[9rem] font-bold leading-none tracking-tighter mb-4 select-none text-gradient-violet"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-hidden="true"
        >
          404
        </p>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          This page doesn&apos;t exist
        </h1>
        <p className="text-base mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          The page you&apos;re looking for may have been moved, deleted, or never existed.
          Double-check the URL or head back to a safe place.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/home">
            <Button variant="primary" size="lg">
              Go home <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">Open dashboard</Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
