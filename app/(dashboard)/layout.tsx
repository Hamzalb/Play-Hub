'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingCart, Calendar, Users, Package,
  UserCog, Percent, BarChart2, Bell, LogOut, Menu, X,
} from '@/components/ui/icons';

const NAV_ITEMS: Array<{ href: string; label: string; Icon: IconComponent }> = [
  { href: '/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/pos',       label: 'POS',        Icon: ShoppingCart },
  { href: '/bookings',  label: 'Bookings',   Icon: Calendar },
  { href: '/members',   label: 'Members',    Icon: Users },
  { href: '/inventory', label: 'Inventory',  Icon: Package },
  { href: '/staff',     label: 'Staff',      Icon: UserCog },
  { href: '/pricing',   label: 'Pricing',    Icon: Percent },
  { href: '/reports',   label: 'Reports',    Icon: BarChart2 },
  { href: '/alerts',    label: 'Alerts',     Icon: Bell },
];

type IconComponent = React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>;

function NavItem({
  href, label, Icon, active, onClick,
}: { href: string; label: string; Icon: IconComponent; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium',
        'transition-all duration-150 cursor-pointer select-none',
        active
          ? 'bg-[var(--color-violet-dim)] text-[var(--color-violet-light)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
      )}
    >
      <Icon
        size={18}
        className={cn('flex-shrink-0 transition-colors', active && 'text-[var(--color-violet-light)]')}
      />
      {label}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-violet-mid)]" aria-hidden="true" />
      )}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    onClose?.();
    await logout();
    router.push('/login');
  }

  const roleVariant = user?.role === 'super_admin' ? 'violet' : user?.role === 'branch_manager' ? 'gold' : 'cyan';

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 pt-6 pb-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-violet-mid)', boxShadow: '0 0 16px rgba(139,92,246,0.5)' }}
          >
            <span className="text-white font-bold text-sm" aria-hidden="true">P</span>
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            PlayHub
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={18} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul role="list" className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <li key={href}>
              <NavItem
                href={href}
                label={label}
                Icon={Icon}
                active={pathname === href}
                onClick={onClose}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-[var(--color-border)]">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-[var(--radius-md)]"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
              <Badge variant={roleVariant} className="mt-0.5">{user.role?.replace('_', ' ')}</Badge>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-danger)'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; (e.currentTarget as HTMLElement).style.background = ''; }}
          aria-label="Sign out of PlayHub"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const currentNav = NAV_ITEMS.find((n) => n.href === pathname);

  return (
    <ProtectedRoute>
      <div className="flex min-h-dvh">
        {/* ── Desktop sidebar ───────────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-0 h-dvh border-r"
          style={{ borderColor: 'var(--color-border)', background: 'rgba(3,5,12,0.6)', backdropFilter: 'blur(20px)' }}
          aria-label="Sidebar navigation"
        >
          <Sidebar />
        </aside>

        {/* ── Mobile drawer backdrop ────────────────────────────────────── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 lg:hidden"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                onClick={() => setDrawerOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col lg:hidden border-r"
                style={{ borderColor: 'var(--color-border)', background: 'rgba(5,7,14,0.98)', backdropFilter: 'blur(24px)' }}
                aria-label="Mobile navigation"
              >
                <Sidebar onClose={() => setDrawerOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content area ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header
            className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-4 py-3 border-b"
            style={{ borderColor: 'var(--color-border)', background: 'rgba(3,5,12,0.9)', backdropFilter: 'blur(16px)' }}
          >
            <button
              onClick={() => setDrawerOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={20} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              {currentNav?.label ?? 'PlayHub'}
            </p>
          </header>

          {/* Page content */}
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
