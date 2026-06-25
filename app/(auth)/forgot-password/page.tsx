'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle } from '@/components/ui/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      // Show success even on error to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-16">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(139,92,246,0.10) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <Image src="/images/logo.png" alt="PlayHub logo" width={40} height={40} className="object-contain" />
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              PlayHub
            </span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  Forgot your password?
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <div className="glass-card glass-card-violet">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    showRequired
                  />
                  {error && (
                    <p role="alert" className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
                  )}
                  <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
                    Send reset link
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card text-center"
              style={{ padding: '2.5rem' }}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}
                aria-hidden="true"
              >
                <CheckCircle size={26} style={{ color: 'var(--color-success)' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Check your inbox
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                If an account exists for <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>,
                you&apos;ll receive a password reset link within a few minutes.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSent(false)}>
                Try a different email
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Remember it?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--color-violet-light)' }}>
            Sign in →
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
