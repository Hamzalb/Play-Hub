'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Clock } from '@/components/ui/icons';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

interface Plan { _id: string; name: string; price: number; billingPeriodDays: number; features: string[]; loyaltyMultiplier: number; }
interface Sub  { _id: string; status: 'active' | 'pending' | 'expired' | 'cancelled'; startDate: string; endDate: string; planId: Plan; }

export default function MemberSubscriptionPage() {
  const searchParams = useSearchParams();
  const preselectedPlanId = searchParams.get('plan');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [sub, setSub]       = useState<Sub | null>(null);
  const [plans, setPlans]   = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const { success: toastOk, error: toastErr } = useToast();
  const didAutoSubscribe = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      const redirect = preselectedPlanId
        ? `/member/subscription?plan=${preselectedPlanId}`
        : '/member/subscription';
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [authLoading, user, preselectedPlanId, router]);

  async function load() {
    const [plansRes, subRes] = await Promise.all([
      api.get<Plan[]>('/members/plans'),
      api.get<Sub>('/members/me/subscription'),
    ]);
    if (plansRes.status === 'success') setPlans((plansRes as ApiSuccess<Plan[]>).data);
    if (subRes.status === 'success')   setSub((subRes as ApiSuccess<Sub>).data);
    setLoading(false);
  }

  // Wait for auth to finish initialising before fetching — avoids 401 on first render
  useEffect(() => {
    if (!authLoading && user) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Auto-subscribe when arriving from the plans page with ?plan=xxx
  useEffect(() => {
    if (loading || didAutoSubscribe.current || !preselectedPlanId || sub) return;
    const plan = plans.find((p) => p._id === preselectedPlanId);
    if (!plan) return;
    didAutoSubscribe.current = true;
    handleSubscribe(preselectedPlanId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, plans, sub]);

  async function handleSubscribe(planId: string) {
    setSubscribing(planId);
    const res = await api.post('/members/me/subscribe', { planId });
    if (res.status === 'success') {
      toastOk('Subscription requested — pay cash at the counter, then staff will activate your plan.');
      setSub((res as ApiSuccess<Sub>).data);
    } else {
      toastErr((res as { message: string }).message);
    }
    setSubscribing(null);
  }

  const daysLeft = sub?.status === 'active'
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86_400_000))
    : 0;

  const currentPlanId = sub?.planId?._id;

  return (
    <>
    <MemberNav />
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[800px] mx-auto">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
        My Subscription
      </h1>

      {loading ? (
        <div className="glass-card animate-pulse h-40 mb-8" />
      ) : sub ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card glass-card-gold mb-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <Badge variant="gold" className="mb-2">{sub.planId?.name}</Badge>
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                ${sub.planId?.price.toFixed(2)}<span className="text-base font-normal" style={{ color: 'var(--color-text-muted)' }}> / {sub.planId?.billingPeriodDays} days</span>
              </p>
            </div>
            <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'pending' ? 'gold' : 'danger'}>
              {sub.status === 'pending' ? 'Awaiting approval' : sub.status}
            </Badge>
          </div>

          {sub.status === 'pending' ? (
            <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)]"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Clock size={16} style={{ color: 'var(--color-gold)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Pay cash at the counter — a staff member will activate your plan.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)]"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Clock size={16} style={{ color: 'var(--color-gold)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Renews {new Date(sub.endDate).toLocaleDateString()} · <strong style={{ color: 'var(--color-text-primary)' }}>{daysLeft} days left</strong>
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="glass-card mb-8 text-center py-8">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No active subscription</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Choose a plan below to unlock member benefits.</p>
        </div>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Available plans
      </h2>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const isCurrent = currentPlanId === plan._id;
          const hasPendingOrActive = sub?.status === 'active' || sub?.status === 'pending';
          const isPreselected = plan._id === preselectedPlanId;
          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card flex items-center gap-5 flex-wrap"
              style={isPreselected && !hasPendingOrActive ? { border: '1px solid rgba(139,92,246,0.5)', boxShadow: '0 0 16px rgba(139,92,246,0.15)' } : undefined}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{plan.name}</p>
                  <Badge variant="gold">${plan.price}/{plan.billingPeriodDays}d</Badge>
                  {isPreselected && !hasPendingOrActive && <Badge variant="violet">Selected</Badge>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.features.slice(0, 3).map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <Check size={11} strokeWidth={2.5} style={{ color: 'var(--color-success)' }} />{f}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant={isCurrent ? 'secondary' : 'primary'}
                size="sm"
                disabled={isCurrent || hasPendingOrActive}
                loading={subscribing === plan._id}
                onClick={() => !isCurrent && !hasPendingOrActive && handleSubscribe(plan._id)}
              >
                {isCurrent && sub?.status === 'pending'
                  ? 'Pending approval'
                  : isCurrent
                  ? 'Current plan'
                  : hasPendingOrActive
                  ? 'Unavailable'
                  : 'Subscribe'}
              </Button>
            </motion.div>
          );
        })}
        {plans.length === 0 && (
          <div className="glass-card text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No plans available yet.</p>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
