'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { Check, ArrowRight, ShoppingCart, Calendar, Users, Package, UserCog, Percent, BarChart2, Bell } from '@/components/ui/icons';

// ─── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

// ─── Page hero ─────────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-end pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Ambient gradient — no 3D on interior pages */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139,92,246,0.12) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 75% 60%, rgba(34,211,238,0.08) 0%, transparent 65%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1320px] mx-auto w-full">
        <motion.div {...fadeUp(0.1)}>
          <Badge variant="violet" className="mb-6">About PlayHub</Badge>
        </motion.div>
        <motion.h1
          {...fadeUp(0.2)}
          className="text-gradient-hero mb-6 leading-[1.06] tracking-[-0.03em]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize:   'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            maxWidth:   '14ch',
          }}
        >
          The operating system for modern entertainment.
        </motion.h1>
        <motion.p
          {...fadeUp(0.3)}
          className="text-lg leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', maxWidth: '52ch' }}
        >
          PlayHub was created to give entertainment centers the professional management tools
          they deserve — tools that are as powerful as enterprise software and as intuitive
          as a consumer app.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Story section ─────────────────────────────────────────────────────────────
function Story() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 max-w-[1320px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — copy */}
        <motion.div {...fadeUp(0)}>
          <Badge variant="cyan" className="mb-5">Our story</Badge>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Born from a simple frustration.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              Entertainment center owners were spending more time wrestling with spreadsheets,
              disconnected POS systems, and manual booking logs than actually running their
              business. The tools existed — just not for them.
            </p>
            <p>
              PlayHub started with one question: <em style={{ color: 'var(--color-text-primary)' }}>
              "What if an entertainment center ran on the same quality of software as a
              Fortune 500 company?"</em>
            </p>
            <p>
              The answer is what you&apos;re looking at — a unified platform that handles every
              operational touchpoint, in real time, across every location you own.
            </p>
          </div>
        </motion.div>

        {/* Right — stat card */}
        <motion.div {...fadeUp(0.15)} className="flex flex-col gap-4">
          <div className="glass-card glass-card-violet">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Before PlayHub
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Separate POS terminal software',
                'Manual booking spreadsheets',
                'No real-time inventory visibility',
                'Paper loyalty punch cards',
                'Monthly revenue tallied by hand',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)' }}
                    aria-hidden="true"
                  >
                    ✕
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card glass-card-cyan">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
              With PlayHub
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Unified POS — sessions + products + loyalty',
                'Online + walk-in bookings, live availability',
                'Real-time stock with auto low-stock alerts',
                'Points earned & redeemed at checkout',
                'Nightly revenue reports, auto-generated',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.12)' }}
                    aria-hidden="true"
                  >
                    <Check size={11} strokeWidth={2.5} style={{ color: 'var(--color-cyan)' }} />
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Mission ───────────────────────────────────────────────────────────────────
function Mission() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <motion.div
        {...fadeUp()}
        className="max-w-[1320px] mx-auto glass-card glass-card-violet text-center"
        style={{ padding: '4rem 2.5rem' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Our mission
        </p>
        <blockquote
          className="text-gradient-hero text-3xl lg:text-4xl font-bold tracking-tight leading-[1.18] max-w-3xl mx-auto"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          &ldquo;Make running an entertainment center as enjoyable as visiting one.&rdquo;
        </blockquote>
        <p className="mt-6 text-base max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Every feature in PlayHub is measured against one question: does this make the
          operator&apos;s day easier?
        </p>
      </motion.div>
    </section>
  );
}

// ─── Platform modules overview ─────────────────────────────────────────────────
const MODULES = [
  { Icon: ShoppingCart, label: 'Point of Sale',    desc: 'Sessions, snacks, and drinks — priced, discounted, and paid in one flow.',    col: 4 as const },
  { Icon: Calendar,     label: 'Bookings',          desc: 'Online reservations and walk-in management with live zone availability.',       col: 4 as const },
  { Icon: Users,        label: 'Members & Loyalty', desc: 'Profiles, subscription plans, loyalty points, and redemption at checkout.',   col: 4 as const },
  { Icon: Package,      label: 'Inventory',         desc: 'Product stock, auto-reorder alerts, and full movement history.',               col: 3 as const },
  { Icon: UserCog,      label: 'Staff & Shifts',    desc: 'Scheduling, clock-in/out, and role-based access across every branch.',         col: 3 as const },
  { Icon: Percent,      label: 'Pricing Engine',    desc: 'Peak, off-peak, holiday rules applied automatically at the point of sale.',    col: 3 as const },
  { Icon: BarChart2,    label: 'Reports',            desc: 'Daily revenue snapshots generated automatically every night for every branch.', col: 3 as const },
  { Icon: Bell,         label: 'Alerts',             desc: 'Real-time push notifications for low stock, maintenance, and expiring subs.',  col: 4 as const },
] as const;

function Platform() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 max-w-[1320px] mx-auto" aria-labelledby="platform-heading">
      <motion.div {...fadeUp()} className="mb-12">
        <Badge variant="gold" className="mb-4">The platform</Badge>
        <h2
          id="platform-heading"
          className="text-3xl lg:text-4xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Eight modules. One dashboard.
        </h2>
      </motion.div>

      <BentoGrid>
        {MODULES.map(({ Icon, label, desc, col }, idx) => (
          <motion.div key={label} {...fadeUp(idx * 0.05)} className={`col-span-12 md:col-span-${col}`}>
            <BentoCard col={12}>
              <div
                className="h-10 w-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
                style={{ background: 'var(--color-violet-dim)', border: '1px solid rgba(139,92,246,0.25)' }}
                aria-hidden="true"
              >
                <Icon size={18} style={{ color: 'var(--color-violet-light)' }} />
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {desc}
              </p>
            </BentoCard>
          </motion.div>
        ))}
      </BentoGrid>
    </section>
  );
}

// ─── Values ────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    title: 'Real-time first',
    body:  'Every number you see reflects what&apos;s happening right now — not an hour ago, not this morning. Socket.io events update every connected dashboard the moment a transaction occurs.',
    accent: 'violet',
  },
  {
    title: 'Simple for staff',
    body:  'The POS screen is designed to be understood in five minutes. Staff shouldn&apos;t need a manual. Complexity lives in the engine, not the interface.',
    accent: 'cyan',
  },
  {
    title: 'Scalable by design',
    body:  'Every model, every route, and every query is branch-scoped from day one. Going from one location to twenty doesn&apos;t require a redesign — just add a branch.',
    accent: 'gold',
  },
  {
    title: 'Secure by default',
    body:  'JWT access tokens, httpOnly refresh cookies, bcrypt hashing, role-based middleware, and branch-scoped data isolation — security is structural, not an afterthought.',
    accent: 'violet',
  },
] as const;

function Values() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 max-w-[1320px] mx-auto" aria-labelledby="values-heading">
      <motion.div {...fadeUp()} className="mb-12">
        <Badge variant="cyan" className="mb-4">Our principles</Badge>
        <h2
          id="values-heading"
          className="text-3xl lg:text-4xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Built on four commitments.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VALUES.map(({ title, body, accent }, idx) => (
          <motion.div key={title} {...fadeUp(idx * 0.08)}>
            <div
              className="glass-card h-full"
              style={{
                borderColor: `rgba(${accent === 'violet' ? '139,92,246' : accent === 'cyan' ? '34,211,238' : '245,158,11'},0.18)`,
              }}
            >
              <div
                className="h-0.5 w-10 rounded-full mb-5"
                style={{ background: `var(--color-${accent})` }}
                aria-hidden="true"
              />
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function Cta() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 max-w-[900px] mx-auto text-center">
      <motion.div {...fadeUp()}>
        <h2
          className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Ready to see it in action?
        </h2>
        <p className="mb-8 text-base" style={{ color: 'var(--color-text-secondary)' }}>
          Create a free account and have your first branch running in under 10 minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Start for free <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/home">
            <Button variant="secondary" size="lg">Back to home</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content">
        <AboutHero />
        <Story />
        <Mission />
        <Platform />
        <Values />
        <Cta />
      </main>
      <MarketingFooter />
    </>
  );
}
