'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ─── Column definitions ────────────────────────────────────────────────────────
const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Dashboard',  href: '/dashboard' },
      { label: 'POS',        href: '/pos'        },
      { label: 'Bookings',   href: '/bookings'   },
      { label: 'Members',    href: '/members'    },
      { label: 'Inventory',  href: '/inventory'  },
      { label: 'Staff',      href: '/staff'      },
      { label: 'Reports',    href: '/reports'    },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Home',     href: '/home'  },
      { label: 'About',    href: '/about' },
      { label: 'Pricing',  href: '/home#pricing' },
      { label: 'Blog',     href: '#'      },
      { label: 'Careers',  href: '#'      },
      { label: 'Contact',  href: '#'      },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference',  href: '#' },
      { label: 'Changelog',      href: '#' },
      { label: 'Status',         href: '#' },
      { label: 'Support',        href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy',   href: '#' },
      { label: 'GDPR',            href: '#' },
    ],
  },
] as const;

// ─── Social icon paths (inline SVG, no emoji) ─────────────────────────────────
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'GitHub',   Icon: GithubIcon,   href: '#' },
  { label: 'Twitter',  Icon: TwitterIcon,  href: '#' },
  { label: 'LinkedIn', Icon: LinkedInIcon, href: '#' },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export function MarketingFooter() {
  return (
    <footer aria-label="Site footer">
      {/* ── Main grid ── */}
      <div className="px-6 pt-20 pb-12 sm:px-10 lg:px-16 max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column — spans 1 (or 2 on md) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1"
          >
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2.5 mb-5" aria-label="PlayHub home">
              <Image src="/images/logo.png" alt="PlayHub logo" width={36} height={36} className="object-contain" />
              <span
                className="font-semibold text-base tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                PlayHub
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)', maxWidth: '22ch' }}>
              The operating system for entertainment centers.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3" aria-label="Social links">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 rounded-[var(--radius-md)] flex items-center justify-center transition-all duration-150"
                  style={{
                    background:   'rgba(255,255,255,0.04)',
                    border:       '1px solid var(--color-border)',
                    color:        'var(--color-text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background  = 'rgba(139,92,246,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)';
                    (e.currentTarget as HTMLElement).style.color       = 'var(--color-violet-light)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.color       = 'var(--color-text-muted)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns — each spans 1 on lg */}
          {COLUMNS.map(({ heading, links }, colIdx) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (colIdx + 1) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="px-6 sm:px-10 lg:px-16"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-sm order-2 sm:order-1" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} PlayHub. All rights reserved.
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2" aria-label="Status indicators">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}
              aria-label="All systems operational"
            />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>All systems operational</p>
          </div>

          <p className="text-xs order-3" style={{ color: 'var(--color-text-faint)' }}>
            Built with Next.js · Express · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
