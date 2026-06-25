'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Member, ApiSuccess } from '@/types';
import { DollarSign, Clock, Check, TrendingUp } from '@/components/ui/icons';

interface Subscription {
  _id: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  planId: { name: string; price: number };
}

interface LoyaltyTx {
  _id: string;
  type: 'earn' | 'redeem' | 'adjustment';
  points: number;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProtectedRoute><MemberDetail id={id} /></ProtectedRoute>;
}

function MemberDetail({ id }: { id: string }) {
  const [member, setMember]   = useState<Member | null>(null);
  const [sub, setSub]         = useState<Subscription | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyTx[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: toastErr } = useToast();

  useEffect(() => {
    async function load() {
      const [memberRes, subRes, loyaltyRes] = await Promise.all([
        api.get<Member>(`/members/${id}`),
        api.get<Subscription>(`/members/${id}/subscription`),
        api.get<LoyaltyTx[]>(`/members/${id}/loyalty/history`),
      ]);

      if (memberRes.status === 'success') setMember((memberRes as ApiSuccess<Member>).data);
      else toastErr('Member not found');
      if (subRes.status === 'success') setSub((subRes as ApiSuccess<Subscription>).data);
      if (loyaltyRes.status === 'success') setLoyalty((loyaltyRes as ApiSuccess<LoyaltyTx[]>).data);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6">
      <Link href="/members" style={{ color: 'var(--color-text-muted)' }} className="hover:text-[var(--color-text-primary)] transition-colors">
        Members
      </Link>
      <span style={{ color: 'var(--color-text-faint)' }}>/</span>
      <span style={{ color: 'var(--color-text-primary)' }}>{member ? member.name : '…'}</span>
    </nav>
  );

  if (loading) {
    return (
      <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[900px] mx-auto">
        {breadcrumb}
        <div className="animate-pulse space-y-4">
          <div className="h-40 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[900px] mx-auto">
        {breadcrumb}
        <p style={{ color: 'var(--color-danger)' }}>Member not found.</p>
        <Link href="/members"><Button variant="secondary" size="sm" className="mt-4">Back</Button></Link>
      </main>
    );
  }

  const daysLeft = sub?.status === 'active'
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86_400_000))
    : 0;

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[900px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {breadcrumb}
      </motion.div>

      <BentoGrid>
        {/* Profile card */}
        <BentoCard col={12} glow="violet">
          <div className="flex items-center gap-5 flex-wrap">
            <Avatar name={member.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{member.name}</h2>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{member.email}</p>
              {member.phone && (
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{member.phone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Member since</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {new Date(member.memberSince).toLocaleDateString()}
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Stats */}
        <BentoCard col={4}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} style={{ color: 'var(--color-gold)' }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Total Spend</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
            ${member.totalSpend.toFixed(2)}
          </p>
        </BentoCard>

        <BentoCard col={4}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} style={{ color: 'var(--color-violet-light)' }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Loyalty Points</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-violet-light)', fontFamily: 'var(--font-display)' }}>
            {member.loyaltyPoints.toLocaleString()}
          </p>
        </BentoCard>

        <BentoCard col={4}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: 'var(--color-cyan-light)' }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Subscription</p>
          </div>
          {sub ? (
            <>
              <p className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{sub.planId?.name}</p>
              <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'pending' ? 'gold' : 'muted'}>
                {sub.status === 'active' ? `${daysLeft}d left` : sub.status}
              </Badge>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No subscription</p>
          )}
        </BentoCard>

        {/* Loyalty history */}
        <BentoCard col={12}>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Loyalty History
          </h3>
          {loyalty.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No transactions yet.</p>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {loyalty.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: tx.type === 'earn' ? 'rgba(52,211,153,0.1)' : tx.type === 'redeem' ? 'rgba(248,113,113,0.1)' : 'rgba(139,92,246,0.1)',
                      }}
                    >
                      <Check size={12} style={{ color: tx.type === 'earn' ? 'var(--color-success)' : tx.type === 'redeem' ? 'var(--color-danger)' : 'var(--color-violet-light)' }} />
                    </div>
                    <div>
                      <p className="text-sm capitalize" style={{ color: 'var(--color-text-primary)' }}>{tx.type}</p>
                      {tx.note && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{tx.note}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: tx.type === 'earn' ? 'var(--color-success)' : tx.type === 'redeem' ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
                    >
                      {tx.type === 'earn' ? '+' : tx.type === 'redeem' ? '-' : ''}{Math.abs(tx.points)} pts
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
