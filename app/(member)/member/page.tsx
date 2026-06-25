'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, DollarSign, TrendingUp, Clock } from '@/components/ui/icons';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { MemberNav } from '@/components/member/MemberNav';

const PORTAL_LINKS = [
  { href: '/member/bookings',     label: 'My Bookings',       Icon: Calendar,    desc: 'View upcoming & past sessions',     color: 'violet' },
  { href: '/member/loyalty',      label: 'Loyalty Points',    Icon: TrendingUp,  desc: 'Balance, history and redemption',   color: 'cyan'   },
  { href: '/member/subscription', label: 'My Subscription',   Icon: Clock,       desc: 'Plan status and renewal',           color: 'gold'   },
  { href: '/member/payments',     label: 'Payment History',   Icon: DollarSign,  desc: 'Past orders and receipts',          color: 'violet' },
] as const;

export default function MemberPortalPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Sign in to access your portal</p>
        <Link href="/login"><Button variant="primary">Sign in</Button></Link>
      </main>
    );
  }

  return (
    <>
    <MemberNav />
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[900px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 mb-10 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Hey, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick links */}
      <BentoGrid>
        {PORTAL_LINKS.map(({ href, label, Icon, desc, color }, idx) => (
          <motion.div key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 sm:col-span-6">
            <Link href={href} className="block h-full">
              <div className="glass-card h-full flex flex-col gap-3 group hover:border-[var(--color-violet)] transition-all cursor-pointer"
                style={{ border: '1px solid var(--color-border)' }}>
                <div className="h-10 w-10 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ background: `var(--color-${color}-dim)` }} aria-hidden="true">
                  <Icon size={18} style={{ color: `var(--color-${color}-light)` }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
                </div>
                <p className="text-xs mt-auto" style={{ color: `var(--color-${color}-light)` }}>View →</p>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Book a session CTA */}
        <BentoCard col={12} glow="violet">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Badge variant="violet" className="mb-2">Ready to play?</Badge>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                Book your next session
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Browse available zones and reserve your spot online.
              </p>
            </div>
            <Link href="/book"><Button variant="primary" size="lg">Book now →</Button></Link>
          </div>
        </BentoCard>
      </BentoGrid>
    </main>
    </>
  );
}
