'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { ArrowRight, TrendingUp, Bell, ShoppingCart, Calendar, Users, Package, BarChart2 } from '@/components/ui/icons';

// Lazy-load the 3D canvas — avoids SSR WebGL errors + defers heavy Three.js bundle
const HeroCanvas = dynamic(
  () => import('@/components/three/HeroCanvas').then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      // Static CSS fallback while 3D loads (matches approximate visual)
      <div
        className="h-full w-full flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-72 w-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.1) 60%, transparent 100%)',
            filter: 'blur(32px)',
          }}
        />
      </div>
    ),
  }
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-12"
      style={{
        background: 'linear-gradient(180deg, rgba(3,5,12,0.92) 0%, transparent 100%)',
        backdropFilter: 'blur(12px)',
      }}
      aria-label="Main navigation"
    >
      <Link href="/" className="flex items-center gap-2.5" aria-label="PlayHub home">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--color-violet-mid)', boxShadow: '0 0 16px rgba(139,92,246,0.6)' }}
          aria-hidden="true"
        >
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span
          className="font-semibold text-lg tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          PlayHub
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8" role="list">
        {['Features', 'Pricing', 'Docs'].map((item) => (
          <a
            key={item}
            href="#"
            role="listitem"
            className="text-sm transition-colors duration-150"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">Get started</Button>
        </Link>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <section
      className="relative min-h-dvh flex flex-col lg:flex-row items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Left: text content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-8 pt-24 pb-16 lg:py-0 max-w-2xl mx-auto lg:mx-0">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Chip */}
          <motion.div variants={item} className="mb-7">
            <span className="stat-pill">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}
                aria-hidden="true"
              />
              Real-time POS · Bookings · Analytics
            </span>
          </motion.div>

          {/* Display headline */}
          <motion.h1
            variants={item}
            className="text-gradient-hero mb-6 leading-[1.06] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700,
            }}
          >
            Run your
            <br />
            entertainment
            <br />
            empire.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            className="text-lg leading-relaxed mb-9"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '38ch' }}
          >
            PlayHub unifies POS, bookings, members, loyalty, and live analytics —
            across every branch, in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex gap-4 flex-wrap mb-12">
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

          {/* Stats row */}
          <motion.div
            variants={item}
            className="flex items-center gap-6 flex-wrap"
          >
            {[
              { value: '2,400+', label: 'Bookings/day' },
              { value: '$1.2M',  label: 'Revenue tracked' },
              { value: '99.9%',  label: 'Uptime SLA' },
            ].map(({ value, label }) => (
              <div key={label} className="text-left">
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
            <hr
              aria-hidden="true"
              className="hidden sm:block w-px h-8 border-none"
              style={{ background: 'var(--color-border)' }}
            />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', maxWidth: '18ch' }}>
              Trusted by arcades &amp; entertainment centers worldwide
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right: Morphing blob 3D canvas ── */}
      <div
        className="
          absolute inset-0 z-0 pointer-events-none
          lg:relative lg:inset-auto lg:flex-1 lg:self-stretch lg:z-0 lg:pointer-events-auto
        "
        aria-hidden="true"
      >
        {/* Ambient CSS glow behind the canvas — warms up the dark bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 60% 50%, rgba(109,40,217,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 30% 30%, rgba(6,182,212,0.10) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 75% 70%, rgba(245,158,11,0.08) 0%, transparent 65%)
            `,
          }}
        />

        {/* Left-edge vignette so blobs fade into the text side */}
        <div
          className="hidden lg:block absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, var(--color-base) 0%, transparent 100%)',
          }}
        />

        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
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
    <section className="px-6 pb-32 max-w-[1320px] mx-auto" aria-labelledby="features-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
    <section className="px-6 pb-24 max-w-[900px] mx-auto text-center" aria-label="Call to action">
      <div className="glass-card glass-card-violet" style={{ padding: '3.5rem 2.5rem' }}>
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
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 pb-10 max-w-[1320px] mx-auto">
      <hr className="divider mb-8" />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          © 2025 PlayHub. All rights reserved.
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-faint)' }}>
          Built with Next.js · Express · MongoDB
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Nav />
      <main id="home-main">
        <Hero />
        <Features />
        <FooterCta />
        <Footer />
      </main>
    </>
  );
}
