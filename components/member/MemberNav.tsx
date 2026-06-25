'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/member',              label: 'Home' },
  { href: '/member/subscription', label: 'Subscription' },
  { href: '/member/bookings',     label: 'Bookings' },
  { href: '/member/loyalty',      label: 'Loyalty' },
  { href: '/member/payments',     label: 'Payments' },
];

export function MemberNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(3,5,12,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 flex items-center gap-4 h-14">
        {/* Logo */}
        <Link href="/member" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/images/logo.png" alt="PlayHub" width={26} height={26} className="object-contain" />
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            PlayHub
          </span>
        </Link>

        {/* Nav links */}
        <nav
          className="flex-1 flex items-center gap-0.5 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
          aria-label="Member portal navigation"
        >
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap transition-colors duration-150',
                  active
                    ? 'text-[var(--color-violet-light)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
                )}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: 'var(--color-violet-mid)' }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        {user && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs hidden sm:block truncate max-w-[120px]" style={{ color: 'var(--color-text-muted)' }}>
              {user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
