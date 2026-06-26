'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle } from '@/components/ui/icons';
import { NoiseBlobBg } from '@/components/three/NoiseBlobBg';
import { ApiSuccess } from '@/types';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({ companyName: '', name: '', email: '', password: '' });
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError('');

    if (form.password.length < 8) {
      setFieldError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string }>('/auth/register', form);
      if (res.status !== 'success') {
        const msg = (res as { message: string }).message || 'Registration failed';
        setFieldError(msg);
        toastError(msg, 'Registration failed');
        return;
      }
      const { api: apiClient } = await import('@/lib/api');
      apiClient.setToken((res as ApiSuccess<{ accessToken: string }>).data.accessToken);
      success('Account created successfully!', 'Welcome to PlayHub');
      router.push('/dashboard');
    } catch {
      const msg = 'Something went wrong — please try again';
      setFieldError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center px-4 py-16">
      {/* Goo blob background — same as marketing hero */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <NoiseBlobBg />
      </div>

      {/* Vignette — keeps card readable over the 3D */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 0%, rgba(3,5,12,0.78) 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <Image src="/images/logo.png" alt="PlayHub logo" width={40} height={40} className="object-contain" />
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
            Create your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Set up your entertainment center on PlayHub
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card glass-card-violet">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-label="Create account form">
            <Input
              label="Company name"
              type="text"
              autoComplete="organization"
              value={form.companyName}
              onChange={update('companyName')}
              placeholder="Galaxy Arcade"
              required
              showRequired
            />
            <Input
              label="Your name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              placeholder="Alex Johnson"
              required
              showRequired
            />
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="alex@yourcompany.com"
              required
              showRequired
            />

            <Input
              label="Password"
              type="password"
              id="reg-password"
              autoComplete="new-password"
              value={form.password}
              onChange={update('password')}
              placeholder="Min. 8 characters"
              required
              showRequired
              minLength={8}
              hint="At least 8 characters"
            />

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
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--color-violet-light)' }}>
            Sign in →
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
