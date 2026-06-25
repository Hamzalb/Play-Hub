'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from '@/components/ui/icons';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const { error: toastError } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setFieldError(msg);
      toastError(msg, 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-16">
      {/* Spotlight */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
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
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-violet-mid)', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}
              aria-hidden="true"
            >
              <span className="text-white font-bold">P</span>
            </div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              PlayHub
            </span>
          </Link>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card glass-card-violet">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-label="Sign in form">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />

            {/* Password with toggle */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}
                >
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--color-violet-light)' }}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-11 text-sm rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border border-[var(--color-border)] placeholder:text-[var(--color-text-faint)] transition-all duration-150 focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw
                    ? <EyeOff size={16} style={{ color: 'var(--color-text-muted)' }} />
                    : <Eye size={16} style={{ color: 'var(--color-text-muted)' }} />
                  }
                </button>
              </div>
            </div>

            {fieldError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                role="alert"
                className="text-xs rounded-[var(--radius-md)] px-3 py-2.5 border"
                style={{ color: 'var(--color-danger)', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}
              >
                {fieldError}
              </motion.p>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          New to PlayHub?{' '}
          <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--color-violet-light)' }}>
            Create an account →
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
