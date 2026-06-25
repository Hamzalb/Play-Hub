'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, ArrowRight } from '@/components/ui/icons';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

interface Plan {
  _id: string;
  name: string;
  price: number;
  billingPeriodDays: number;
  features: string[];
  loyaltyMultiplier: number;
}

const FALLBACK_PLANS: Plan[] = [
  {
    _id: 'free',
    name: 'Starter',
    price: 0,
    billingPeriodDays: 30,
    features: ['Access to all zones', 'Booking via counter', 'Basic loyalty points', 'Email receipts'],
    loyaltyMultiplier: 1,
  },
  {
    _id: 'pro',
    name: 'Pro Member',
    price: 29.99,
    billingPeriodDays: 30,
    features: ['Online booking portal', '2× loyalty points', 'Priority zone access', '10% session discount', 'Subscription auto-renew'],
    loyaltyMultiplier: 2,
  },
  {
    _id: 'vip',
    name: 'VIP',
    price: 59.99,
    billingPeriodDays: 30,
    features: ['All Pro features', '3× loyalty points', 'Exclusive VIP lounge', 'Free monthly session', 'Dedicated support line'],
    loyaltyMultiplier: 3,
  },
];

const FREE_INCLUDES = [
  'Access to any PlayHub entertainment center',
  'POS checkout at the counter',
  'Basic loyalty points (1 pt per $1)',
  'Booking via staff',
];

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Plan[]>('/members/plans').then((res) => {
      if (res.status === 'success' && (res as ApiSuccess<Plan[]>).data.length > 0) {
        setPlans((res as ApiSuccess<Plan[]>).data);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const accentForIdx = (i: number) =>
    (['muted', 'violet', 'gold'] as const)[i % 3] ?? 'muted';

  const glowForIdx = (i: number) =>
    (['', 'glass-card-violet', 'glass-card-gold'] as const)[i % 3] ?? '';

  return (
    <>
      <MarketingNav />
      <main id="main-content" className="pt-28">
        {/* Hero */}
        <section className="px-6 pb-16 max-w-[900px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}>
            <Badge variant="violet" className="mb-5">Membership plans</Badge>
            <h1
              className="text-4xl lg:text-5xl font-bold tracking-tight mb-5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Simple, transparent pricing.
            </h1>
            <p className="text-lg max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Start free. Upgrade to earn more points, unlock online booking, and access member-only perks.
            </p>
          </motion.div>
        </section>

        {/* Plan cards */}
        <section className="px-6 pb-20 max-w-[1100px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card animate-pulse h-96">
                  <div className="h-4 rounded bg-[rgba(255,255,255,0.06)] w-1/3 mb-4" />
                  <div className="h-10 rounded bg-[rgba(255,255,255,0.05)] w-1/2 mb-6" />
                  <div className="flex flex-col gap-3">
                    {[1,2,3,4].map(j => <div key={j} className="h-3 rounded bg-[rgba(255,255,255,0.04)] w-full" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => {
                const isPopular = idx === 1;
                return (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                    className={`glass-card ${glowForIdx(idx)} flex flex-col relative`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="violet">Most popular</Badge>
                      </div>
                    )}

                    <Badge variant={accentForIdx(idx)} className="mb-4 self-start">{plan.name}</Badge>

                    <div className="mb-6">
                      <span className="text-4xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                        {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm ml-1" style={{ color: 'var(--color-text-muted)' }}>
                          / {plan.billingPeriodDays} days
                        </span>
                      )}
                    </div>

                    <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
                      {plan.loyaltyMultiplier}× loyalty points multiplier
                    </p>

                    <ul className="flex flex-col gap-3 mb-8 flex-1" role="list">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span
                            className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(139,92,246,0.15)' }}
                            aria-hidden="true"
                          >
                            <Check size={11} strokeWidth={2.5} style={{ color: 'var(--color-violet-light)' }} />
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/register">
                      <Button
                        variant={isPopular ? 'primary' : 'secondary'}
                        size="md"
                        className="w-full"
                      >
                        {plan.price === 0 ? 'Get started free' : 'Choose this plan'}
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Free tier explanation */}
        <section className="px-6 pb-24 max-w-[900px] mx-auto">
          <div className="glass-card text-center" style={{ padding: '2.5rem' }}>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Everything included at every tier
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              No hidden fees. Every PlayHub member — paid or free — gets:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
              {FREE_INCLUDES.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.12)' }} aria-hidden="true">
                    <Check size={11} strokeWidth={2.5} style={{ color: 'var(--color-cyan)' }} />
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
