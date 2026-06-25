'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Clock } from '@/components/ui/icons';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

interface Plan { _id: string; name: string; price: number; billingPeriodDays: number; features: string[]; loyaltyMultiplier: number; }
interface Sub  { _id: string; status: string; startDate: string; endDate: string; planId: Plan; }

export default function MemberSubscriptionPage() {
  const [sub, setSub]     = useState<Sub | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Plan[]>('/members/plans'),
    ]).then(([plansRes]) => {
      if (plansRes.status === 'success') setPlans((plansRes as ApiSuccess<Plan[]>).data);
    }).finally(() => setLoading(false));
  }, []);

  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86_400_000)) : 0;

  return (
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/member"><Button variant="ghost" size="sm">← Portal</Button></Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          My Subscription
        </h1>
      </div>

      {loading ? (
        <div className="glass-card animate-pulse h-40" />
      ) : sub ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card glass-card-gold mb-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <Badge variant="gold" className="mb-2">{sub.planId?.name}</Badge>
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                ${sub.planId?.price.toFixed(2)}<span className="text-base font-normal" style={{ color: 'var(--color-text-muted)' }}> / {sub.planId?.billingPeriodDays} days</span>
              </p>
            </div>
            <Badge variant={sub.status === 'active' ? 'success' : 'danger'}>{sub.status}</Badge>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)]"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Clock size={16} style={{ color: 'var(--color-gold)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Renews {new Date(sub.endDate).toLocaleDateString()} · <strong style={{ color: 'var(--color-text-primary)' }}>{daysLeft} days left</strong>
            </p>
          </div>
          <div className="mt-5">
            <Button variant="danger" size="sm">Cancel subscription</Button>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card mb-8 text-center py-8">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No active subscription</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Choose a plan below to unlock member benefits.</p>
        </div>
      )}

      {/* Available plans */}
      <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Available plans
      </h2>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="glass-card flex items-center gap-5 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{plan.name}</p>
                <Badge variant="gold">${plan.price}/mo</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.features.slice(0, 3).map((f) => (
                  <span key={f} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Check size={11} strokeWidth={2.5} style={{ color: 'var(--color-success)' }} />{f}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => {/* subscribe */}}>
              {sub?.planId?._id === plan._id ? 'Current plan' : 'Subscribe'}
            </Button>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="glass-card text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No plans available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
