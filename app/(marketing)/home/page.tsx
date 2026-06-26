'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { ArrowRight, TrendingUp, Bell, ShoppingCart, Calendar, Users, Package, BarChart2, Check } from '@/components/ui/icons';
import { NoiseBlobBg } from '@/components/three/NoiseBlobBg';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

// ─── Shared animation primitives ─────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const SECTION_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0 } },
};
const SECTION_ITEM = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } },
};
const CARD_ANIM = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE, staggerChildren: 0.12, delayChildren: 0.1 } },
};
const WORD_VARIANT = {
  hidden: { opacity: 0, scale: 0.82, y: 10 },
  show:   { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24, scale: 0.9 },
    show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.72, ease: EASE } },
  };
  const headline = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.075, delayChildren: 0 } },
  };

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── SVG noise blob background ── */}
      <NoiseBlobBg />

      {/* ── Radial vignette overlay for text readability ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 85% 75% at 50% 50%,
              rgba(3,5,12,0.05) 0%,
              rgba(3,5,12,0.40) 55%,
              rgba(3,5,12,0.80) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Text content — centered, above blobs ── */}
      <div className="relative z-10 w-full text-center px-4 sm:px-10 pt-20 sm:pt-24 pb-12 sm:pb-16 max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Chip */}
          <motion.div variants={item} className="mb-7 flex justify-center">
            <span className="stat-pill">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}
                aria-hidden="true"
              />
              Real-time POS · Bookings · Analytics
            </span>
          </motion.div>

          {/* Display headline — word-by-word zoom+blur reveal */}
          <motion.h1
            variants={headline}
            className="text-gradient-hero mb-6 leading-[1.06] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 5.5rem)',
              fontWeight: 700,
            }}
          >
            {'Run your entertainment'.split(' ').map((word, i) => (
              <motion.span key={`l0-${i}`} variants={WORD_VARIANT} style={{ display: 'inline-block', marginRight: '0.28em' }}>
                {word}
              </motion.span>
            ))}
            <br />
            {'empire from one screen.'.split(' ').map((word, i, arr) => (
              <motion.span key={`l1-${i}`} variants={WORD_VARIANT} style={{ display: 'inline-block', marginRight: i < arr.length - 1 ? '0.28em' : undefined }}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            className="text-lg leading-relaxed mb-9 mx-auto"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '42ch' }}
          >
            PlayHub unifies POS, bookings, members, loyalty, and live analytics —
            across every branch, in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/register">
              <Button variant="primary" size="xl">
                Start for free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="xl">
                See live demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats row — centered */}
          <motion.div
            variants={item}
            className="flex items-center justify-center gap-8 flex-wrap"
          >
            {[
              { value: '2,400+', label: 'Bookings/day' },
              { value: '$1.2M',  label: 'Revenue tracked' },
              { value: '99.9%',  label: 'Uptime SLA' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-xl font-bold tabular-nums tracking-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  {value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(0deg, var(--color-base) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}

// ─── What is PlayHub ──────────────────────────────────────────────────────────
const PILLARS = [
  {
    title:  'Unified operations',
    body:   'POS, bookings, inventory, staff, and loyalty — all connected in one place. No more switching between 5 different apps.',
    color:  'violet',
    checks: ['Point of sale', 'Online bookings', 'Inventory tracking', 'Staff scheduling'],
  },
  {
    title:  'Built for scale',
    body:   'One account covers every branch you own. Super admins see the full picture; managers and staff see only what they need.',
    color:  'cyan',
    checks: ['Multi-location ready', 'Role-based access', 'Branch-scoped data', 'Company-wide reports'],
  },
  {
    title:  'Always real-time',
    body:   'Revenue, occupancy, alerts, and inventory update the moment a transaction happens — not the morning after.',
    color:  'gold',
    checks: ['Live revenue feed', 'Socket.io updates', 'Instant alerts', 'Nightly auto-reports'],
  },
] as const;

function WhatIsPlayHub() {
  return (
    <section
      id="what-is-playhub"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1320px] mx-auto"
      aria-labelledby="whatis-heading"
    >
      {/* ── Intro copy ── */}
      <motion.div
        variants={SECTION_STAGGER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-2xl mb-16"
      >
        <motion.div variants={SECTION_ITEM} className="mb-4">
          <Badge variant="violet">What is PlayHub?</Badge>
        </motion.div>
        <motion.h2
          id="whatis-heading"
          variants={SECTION_ITEM}
          className="text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-[1.08]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          The operating system
          <br />
          for entertainment centers.
        </motion.h2>
        <motion.p variants={SECTION_ITEM} className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          PlayHub is a purpose-built management platform for arcades, gaming lounges, VR venues,
          bowling alleys, and anywhere people come to play. It replaces a drawer full of
          disconnected tools with a single, elegant dashboard — accessible from any device,
          updated in real time, and built to grow with you.
        </motion.p>
      </motion.div>

      {/* ── Three pillars ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PILLARS.map(({ title, body, color, checks }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24, scale: 0.95, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="glass-card h-full flex flex-col"
              style={{
                borderColor: `rgba(${color === 'violet' ? '139,92,246' : color === 'cyan' ? '34,211,238' : '245,158,11'},0.2)`,
              }}
            >
              {/* Accent bar */}
              <div
                className="h-1 w-12 rounded-full mb-5"
                style={{ background: `var(--color-${color})` }}
                aria-hidden="true"
              />

              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                {body}
              </p>

              {/* Check list */}
              <ul className="flex flex-col gap-2" aria-label={`${title} features`}>
                {checks.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span
                      className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${color === 'violet' ? '139,92,246' : color === 'cyan' ? '34,211,238' : '245,158,11'},0.15)` }}
                      aria-hidden="true"
                    >
                      <Check
                        size={11}
                        strokeWidth={2.5}
                        style={{ color: `var(--color-${color}${color === 'violet' ? '-light' : color === 'cyan' ? '-light' : '-light'})` }}
                      />
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Divider into Features ── */}
      <div className="mt-24 flex items-center gap-6">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        <p className="text-xs uppercase tracking-widest flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          Explore the full platform
        </p>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      </div>
    </section>
  );
}

// ─── Venue showcase ───────────────────────────────────────────────────────────
function VenueShowcase() {
  return (
    <section className="px-4 sm:px-6 pb-12 sm:pb-20 max-w-[1320px] mx-auto" aria-label="Venue showcase">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
        style={{
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Image
          src="/images/venue-hero.png"
          alt="Modern entertainment center interior — the kind PlayHub manages"
          fill
          className="object-cover"
          sizes="(max-width: 1320px) 100vw, 1320px"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(90deg, rgba(3,5,12,0.82) 0%, rgba(3,5,12,0.35) 55%, rgba(3,5,12,0.15) 100%),
              linear-gradient(0deg, rgba(3,5,12,0.6) 0%, transparent 40%)
            `,
          }}
          aria-hidden="true"
        />
        {/* text overlay */}
        <motion.div
          variants={SECTION_STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 lg:px-16 max-w-xl"
        >
          <motion.p
            variants={SECTION_ITEM}
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-violet-light)' }}
          >
            Built for venues like this
          </motion.p>
          <motion.h2
            variants={SECTION_ITEM}
            className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Arcades. VR lounges.
            <br />
            Bowling alleys. All of it.
          </motion.h2>
          <motion.p variants={SECTION_ITEM} className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            PlayHub runs the full operation — from the moment a guest walks in to the
            nightly revenue report sent automatically at close.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Features bento ───────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: ShoppingCart, label: 'POS',        color: 'violet', desc: 'Touch-first counter sales with live pricing and loyalty.' },
  { Icon: Calendar,     label: 'Bookings',   color: 'cyan',   desc: 'Online + walk-in, availability-aware, live socket updates.' },
  { Icon: Users,        label: 'Members',    color: 'gold',   desc: 'Profiles, subscriptions, loyalty history and redemption.' },
  { Icon: Package,      label: 'Inventory',  color: 'violet', desc: 'Products, stock levels, auto-alert on low reorder threshold.' },
  { Icon: BarChart2,    label: 'Reports',    color: 'cyan',   desc: 'Nightly revenue snapshots + on-demand daily generation.' },
  { Icon: Bell,         label: 'Alerts',     color: 'gold',   desc: 'Real-time push: low stock, maintenance, expiring subs.' },
] as const;

function Features() {
  return (
    <section className="px-4 sm:px-6 pb-16 sm:pb-32 max-w-[1320px] mx-auto" aria-labelledby="features-heading">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 text-center"
      >
        <Badge variant="violet" className="mb-4">Platform</Badge>
        <h2
          id="features-heading"
          className="text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Everything in one place
        </h2>
        <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          No spreadsheets. No app-switching. One platform, all locations.
        </p>
      </motion.div>

      <BentoGrid>
        {/* Live revenue KPIs */}
        <BentoCard col={8} row={2} glow="violet" className="overflow-visible">
          <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div>
              <Badge variant="violet" className="mb-2">
                <TrendingUp size={11} />
                Live
              </Badge>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Real-time dashboard
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                KPIs refresh as transactions happen across all branches.
              </p>
            </div>
          </div>
          <BentoGrid>
            <KpiCard label="Revenue"  value={4820} prefix="$" accent="gold"   col={4} />
            <KpiCard label="Sessions" value={14}               accent="violet" col={4} />
            <KpiCard label="Members"  value={384}              accent="cyan"   col={4} />
          </BentoGrid>
        </BentoCard>

        {/* Multi-location pill */}
        <BentoCard col={4} row={2}>
          <Badge variant="outline" className="mb-4">Multi-location</Badge>
          <h3
            className="text-xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            One account. Every branch.
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Super admins see company-wide. Managers see their branch. Staff see what they need.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Super Admin', 'Branch Manager', 'Staff', 'Member'].map((r) => (
              <span key={r} className="stat-pill">{r}</span>
            ))}
          </div>
        </BentoCard>

        {/* Feature grid */}
        {FEATURES.map(({ Icon, label, color, desc }) => (
          <BentoCard key={label} col={4}>
            <div
              className="h-10 w-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
              style={{
                background: `var(--color-${color}-dim)`,
                border: `1px solid rgba(${color === 'violet' ? '139,92,246' : color === 'cyan' ? '34,211,238' : '245,158,11'},0.25)`,
              }}
              aria-hidden="true"
            >
              <Icon size={18} style={{ color: `var(--color-${color}-light)` }} />
            </div>
            <h3
              className="font-semibold mb-1.5"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {label}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {desc}
            </p>
          </BentoCard>
        ))}
      </BentoGrid>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCta() {
  return (
    <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[900px] mx-auto text-center" aria-label="Call to action">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card glass-card-violet"
      >
        <h2
          className="text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Ready to run smarter?
        </h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Set up in minutes. No credit card required. Cancel any time.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button variant="primary" size="lg">Create your account</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">Sign in</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main id="home-main">
        <Hero />
        <WhatIsPlayHub />
        <VenueShowcase />
        <Features />
        <FooterCta />
      </main>
      <MarketingFooter />
    </>
  );
}
