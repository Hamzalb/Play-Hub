'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { Plus, Check } from '@/components/ui/icons';
import Link from 'next/link';

interface Plan {
  _id: string; name: string; price: number;
  billingPeriodDays: number; features: string[];
  loyaltyMultiplier: number; isActive: boolean;
}

export default function PlansPage() {
  return (
    <ProtectedRoute roles={['super_admin']}>
      <PlansContent />
    </ProtectedRoute>
  );
}

function PlansContent() {
  const [plans, setPlans]     = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [featInput, setFeatInput] = useState('');
  const [form, setForm] = useState({ name: '', price: '', billingPeriodDays: '30', loyaltyMultiplier: '1', features: [] as string[] });
  const { success, error: toastErr } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await api.get<Plan[]>('/members/plans');
    if (res.status === 'success') setPlans((res as ApiSuccess<Plan[]>).data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  function addFeature() {
    const f = featInput.trim();
    if (f && !form.features.includes(f)) {
      setForm((x) => ({ ...x, features: [...x.features, f] }));
      setFeatInput('');
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await api.post('/members/plans', {
      name: form.name,
      price: parseFloat(form.price),
      billingPeriodDays: parseInt(form.billingPeriodDays),
      loyaltyMultiplier: parseFloat(form.loyaltyMultiplier),
      features: form.features,
    });
    if (res.status === 'success') {
      success('Plan created');
      setShowForm(false);
      setForm({ name: '', price: '', billingPeriodDays: '30', loyaltyMultiplier: '1', features: [] });
      load();
    } else {
      toastErr((res as { message: string }).message);
    }
    setSaving(false);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/members"><Button variant="ghost" size="sm">← Members</Button></Link>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Subscription Plans
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{plans.length} plan{plans.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'New plan'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="gold">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>Create subscription plan</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Plan name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required showRequired placeholder="e.g. Pro Member" />
              <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required showRequired />
              <Input label="Billing period (days)" type="number" value={form.billingPeriodDays} onChange={(e) => setForm((f) => ({ ...f, billingPeriodDays: e.target.value }))} />
              <Input label="Loyalty multiplier" type="number" step="0.1" value={form.loyaltyMultiplier} onChange={(e) => setForm((f) => ({ ...f, loyaltyMultiplier: e.target.value }))} hint="1 = normal, 2 = double points" />

              {/* Features */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={featInput}
                    onChange={(e) => setFeatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature, press Enter"
                    className="flex-1 px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-border-focus)]"
                  />
                  <Button type="button" variant="secondary" size="md" onClick={addFeature}>Add</Button>
                </div>
                {form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.features.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border"
                        style={{ background: 'var(--color-violet-dim)', borderColor: 'rgba(139,92,246,0.25)', color: 'var(--color-violet-light)' }}>
                        {f}
                        <button type="button" onClick={() => setForm((x) => ({ ...x, features: x.features.filter((i) => i !== f) }))}
                          className="hover:text-[var(--color-danger)] transition-colors cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}>Create plan</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {loading
          ? [1,2,3].map((i) => <div key={i} className="col-span-12 md:col-span-4 glass-card animate-pulse h-48" />)
          : plans.length === 0
            ? (
              <BentoCard col={12}>
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No plans yet. Create one to offer memberships.</p>
                </div>
              </BentoCard>
            )
            : plans.map((plan) => (
              <motion.div key={plan._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 md:col-span-4">
                <div className="glass-card glass-card-gold h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="gold">{plan.name}</Badge>
                    <Badge variant={plan.isActive ? 'success' : 'muted'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                    ${plan.price.toFixed(2)}
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    / {plan.billingPeriodDays} days · ×{plan.loyaltyMultiplier} loyalty
                  </p>
                  <ul className="flex flex-col gap-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Check size={12} strokeWidth={2.5} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
      </BentoGrid>
    </div>
  );
}
