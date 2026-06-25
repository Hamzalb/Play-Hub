'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from '@/components/ui/icons';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Error boundary]', error);
  }, [error]);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(248,113,113,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md"
      >
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}
          aria-hidden="true"
        >
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Something went wrong
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          An unexpected error occurred. The team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs mb-8 font-mono" style={{ color: 'var(--color-text-muted)' }}>
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="primary" onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/home')}>
            Go home
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
