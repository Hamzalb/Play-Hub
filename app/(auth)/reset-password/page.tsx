'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, CheckCircle } from '@/components/ui/icons';

function ResetForm() {
  const router       = useRouter();
  const params       = useSearchParams();
  const token        = params.get('token') ?? '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [done, setDone]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm)  { setError('Passwords do not match'); return; }
    if (!token)                { setError('Reset token missing — request a new link'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset link expired or invalid');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="glass-card text-center" style={{ padding: '2.5rem' }}>
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}
          aria-hidden="true"
        >
          <CheckCircle size={26} style={{ color: 'var(--color-success)' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Password updated!
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card-violet">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-pw" className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
            style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
            New password <span style={{ color: 'var(--color-danger)' }} aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required minLength={8}
              className="w-full px-4 py-2.5 pr-11 text-sm rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border border-[var(--color-border)] placeholder:text-[var(--color-text-faint)] transition-all duration-150 focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
              aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff size={16} style={{ color: 'var(--color-text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--color-text-muted)' }} />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-pw" className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
            Confirm password
          </label>
          <input
            id="confirm-pw"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            required
            className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border border-[var(--color-border)] placeholder:text-[var(--color-text-faint)] transition-all focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-[rgba(255,255,255,0.06)]"
          />
        </div>

        {error && (
          <p role="alert" className="text-xs rounded-[var(--radius-md)] px-3 py-2.5 border"
            style={{ color: 'var(--color-danger)', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}>
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
          Reset password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <div className="mb-8 text-center">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <Image src="/images/logo.png" alt="PlayHub logo" width={40} height={40} className="object-contain" />
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>PlayHub</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Set new password
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Choose a strong password for your account.
          </p>
        </div>

        <Suspense fallback={<div className="glass-card"><p style={{ color: 'var(--color-text-muted)' }}>Loading…</p></div>}>
          <ResetForm />
        </Suspense>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--color-violet-light)' }}>
            ← Back to sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
