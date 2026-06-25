'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

interface LoyaltyBalance { points: number; totalSpend: number; }

export default function MemberPortalPage() {
  const { user, logout } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltyBalance | null>(null);

  useEffect(() => {
    if (!user) return;
    // In real flow, member ID would come from member-specific JWT claim
    // For now, display placeholder until member auth is wired in Phase 13
    setLoyalty({ points: 250, totalSpend: 125.00 });
  }, [user]);

  if (!user) return (
    <main className="flex min-h-dvh items-center justify-center">
      <p style={{ color: 'var(--color-text-muted)' }}>Please log in to view your portal.</p>
    </main>
  );

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{user.name}</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
      </div>

      <BentoGrid>
        <BentoCard col={6} glow="violet">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Loyalty Points
          </p>
          <p className="text-5xl font-bold" style={{ color: 'var(--color-violet-light)' }}>
            {loyalty?.points ?? '–'}
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            ≈ ${((loyalty?.points ?? 0) * 0.01).toFixed(2)} value · Total spent: ${loyalty?.totalSpend.toFixed(2)}
          </p>
        </BentoCard>

        <BentoCard col={6}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Membership
          </p>
          <Badge variant="violet" className="mb-3">Active Member</Badge>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Subscription management available in a future release.
          </p>
        </BentoCard>

        <BentoCard col={12}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Recent Bookings
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Booking history display coming in Phase 13 polish.
          </p>
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
