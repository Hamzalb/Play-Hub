'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from '@/components/ui/icons';

function SuccessContent() {
  const params     = useSearchParams();
  const bookingId  = params.get('id');

  return (
    <main className="min-h-dvh flex items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 300, damping: 22 }}
            className="h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}
            aria-hidden="true"
          >
            <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
          </motion.div>

          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            You&apos;re booked!
          </h1>
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Your session has been confirmed. Show this confirmation at the counter when you arrive.
          </p>
          {bookingId && (
            <p className="text-xs mt-3 mb-8 font-mono px-3 py-1.5 rounded-lg inline-block"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              Ref: #{bookingId.slice(-8).toUpperCase()}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <Link href="/book">
              <Button variant="primary" size="lg" className="w-full">Book another session</Button>
            </Link>
            <Link href="/home">
              <Button variant="ghost" size="md" className="w-full">Back to home</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function BookSuccessPage() {
  return (
    <>
      <MarketingNav />
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </>
  );
}
