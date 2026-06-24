'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiSuccess } from '@/types';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string }>('/auth/register', form);
      if (res.status !== 'success') {
        setError((res as { message: string }).message || 'Registration failed');
        return;
      }
      const data = (res as ApiSuccess<{ accessToken: string }>).data;
      // Store access token and redirect
      const { api: apiClient } = await import('@/lib/api');
      apiClient.setToken(data.accessToken);
      router.push('/dashboard');
    } catch {
      setError('Registration failed — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Create an account
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Set up your entertainment center on PlayHub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Company Name"
            type="text"
            autoComplete="organization"
            value={form.companyName}
            onChange={update('companyName')}
            placeholder="e.g. Arcade Galaxy"
            required
          />
          <Input
            label="Your Name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            required
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            hint="At least 8 characters"
            required
          />

          {error && (
            <p className="text-sm rounded-lg px-3 py-2 bg-[var(--color-danger)]/10 border border-[var(--color-danger)] text-[var(--color-danger)]">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium hover:underline"
            style={{ color: 'var(--color-violet-light)' }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
