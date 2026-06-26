'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { NoiseBlobBg } from '@/components/three/NoiseBlobBg';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShoppingCart, Calendar, Users, BarChart2, Check, AlertCircle,
} from '@/components/ui/icons';

// ─── Brand panel (left, desktop only) ────────────────────────────────────────
const FEATURES = [
  { Icon: ShoppingCart, label: 'Point of sale',       desc: 'Fast checkout with loyalty redemption' },
  { Icon: Calendar,     label: 'Zone booking',        desc: 'Real-time availability across all zones' },
  { Icon: Users,        label: 'Member management',   desc: 'Profiles, subscriptions & loyalty points' },
  { Icon: BarChart2,    label: 'Live analytics',       desc: 'Revenue, sessions and alerts at a glance' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between relative overflow-hidden min-h-dvh px-12 py-14"
      aria-hidden="true"
      style={{ background: 'linear-gradient(155deg, #0a0514 0%, #060d1f 50%, #030812 100%)' }}
    >
      {/* Goo blob background — same as marketing hero */}
      <NoiseBlobBg />

      {/* Vignette — keeps text readable over the 3D */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 10%, rgba(6,9,21,0.72) 100%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 flex items-center gap-3"
      >
        <Image src="/images/logo.png" alt="PlayHub" width={36} height={36} className="object-contain" />
        <span
          className="text-lg font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          PlayHub
        </span>
      </motion.div>

      {/* Headline + features */}
      <div className="relative z-10 flex flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: 'var(--color-violet-light)' }}
          >
            Entertainment center OS
          </p>
          <h2
            className="text-4xl font-bold leading-[1.15] tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Run smarter.<br />
            <span className="text-gradient-hero">Play harder.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
            One platform for bookings, POS, loyalty, and analytics — across every branch, in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="flex flex-col gap-3"
        >
          {FEATURES.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
              className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)]"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="h-9 w-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-violet-dim)', border: '1px solid rgba(139,92,246,0.25)' }}
              >
                <Icon size={16} style={{ color: 'var(--color-violet-light)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
        className="relative z-10 flex items-center gap-2"
      >
        <div className="flex -space-x-2">
          {['#7c3aed','#06b6d4','#f59e0b'].map((c, i) => (
            <div
              key={i}
              className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
              style={{ background: c, borderColor: '#060d1f', color: '#fff' }}
            >
              {['GA','PH','CB'][i]}
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Trusted by <span style={{ color: 'var(--color-text-secondary)' }}>gaming centers</span> worldwide
        </p>
      </motion.div>
    </div>
  );
}

// ─── Login form (right panel) ─────────────────────────────────────────────────
export default function LoginPage() {
  const { login }   = useAuth();
  const { error: toastError } = useToast();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const redirectTo  = searchParams.get('redirect') ?? '/dashboard';

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setFieldError(msg);
      toastError(msg, 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-dvh">
      <BrandPanel />

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center px-6 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="PlayHub logo" width={36} height={36} className="object-contain" />
              <span
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                PlayHub
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Sign in to your PlayHub workspace
            </p>
          </div>

          {/* Card */}
          <div className="glass-card glass-card-violet mb-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate aria-label="Sign in form">
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

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-colors hover:opacity-75"
                    style={{ color: 'var(--color-violet-light)' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {fieldError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  role="alert"
                  className="flex items-start gap-2.5 rounded-[var(--radius-md)] px-3.5 py-3 text-xs"
                  style={{
                    color: 'var(--color-danger)',
                    background: 'rgba(248,113,113,0.07)',
                    border: '1px solid rgba(248,113,113,0.18)',
                  }}
                >
                  <AlertCircle size={13} className="mt-px flex-shrink-0" />
                  {fieldError}
                </motion.div>
              )}

              <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
                Sign in →
              </Button>
            </form>
          </div>

          {/* Divider with trust signal */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-text-faint)' }}>
              <Check size={10} style={{ color: 'var(--color-success)' }} />
              Secured with JWT
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            New to PlayHub?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-violet-light)' }}
            >
              Create an account →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
