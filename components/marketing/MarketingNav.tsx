'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X } from '@/components/ui/icons';

const NAV_LINKS = [
  { label: 'Features', href: '/home#features' },
  { label: 'About',    href: '/about'          },
  { label: 'Plans',    href: '/plans'           },
];

export function MarketingNav() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === pathname ||
    (href === '/about' && pathname === '/about') ||
    (href.startsWith('/home') && pathname === '/home');

  return (
    <>
      {/* ── Floating pill ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,   scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        style={{ width: 'min(92vw, 700px)' }}
      >
        <nav
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-full"
          style={{
            background:          'rgba(7,9,15,0.75)',
            backdropFilter:      'blur(24px) saturate(150%)',
            WebkitBackdropFilter:'blur(24px) saturate(150%)',
            border:              '1px solid rgba(255,255,255,0.10)',
            boxShadow:           '0 4px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset',
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center gap-2 flex-shrink-0 pl-1"
            aria-label="PlayHub home"
          >
            <Image src="/images/logo.png" alt="PlayHub logo" width={28} height={28} className="object-contain" />
            <span
              className="font-semibold text-sm tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              PlayHub
            </span>
          </Link>

          {/* Centre links — desktop */}
          <div className="hidden md:flex items-center gap-0.5" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={label}
                  href={href}
                  role="listitem"
                  aria-current={active ? 'page' : undefined}
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                  style={{
                    color:      active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0 pr-0.5">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.09)] cursor-pointer"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open
                ? <X    size={16} style={{ color: 'var(--color-text-primary)' }} />
                : <Menu size={16} style={{ color: 'var(--color-text-primary)' }} />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown card */}
            <motion.div
              id="mobile-menu"
              role="menu"
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,   scale: 1 }}
              exit={{    opacity: 0, y: -10,  scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[74px] left-1/2 -translate-x-1/2 z-50 md:hidden"
              style={{ width: 'min(88vw, 300px)' }}
            >
              <div
                className="rounded-2xl p-2 flex flex-col"
                style={{
                  background:     'rgba(7,9,15,0.94)',
                  backdropFilter: 'blur(24px)',
                  border:         '1px solid rgba(255,255,255,0.10)',
                  boxShadow:      '0 12px 40px rgba(0,0,0,0.7)',
                }}
              >
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {label}
                  </Link>
                ))}

                <div
                  className="h-px my-1.5 mx-2"
                  style={{ background: 'var(--color-border)' }}
                  role="separator"
                />

                <Link
                  href="/login"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color:      'var(--color-violet-light)',
                    background: 'var(--color-violet-dim)',
                  }}
                >
                  Create account →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
