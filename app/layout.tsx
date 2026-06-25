import type { Metadata } from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { PageTransition } from '@/components/ui/PageTransition';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';
import { ParticlesProvider } from '@/components/three/ParticlesProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PlayHub — Entertainment Center Management',
    template: '%s | PlayHub',
  },
  description:
    'The premium management platform for entertainment centers. POS, bookings, members, inventory, and live analytics — all in one place.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-[var(--color-base)] text-[var(--color-text-primary)] overflow-x-hidden">
        {/* Skip to content — keyboard accessibility */}
        <a href="#main-content" className="skip-to-content">Skip to main content</a>

        {/* Layer 0: Aurora mesh gradient */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-gold" />
        </div>

        {/* Layer 1: Grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Layer 1: Global floating 3D particles (lazy, SSR:false, pointer-events:none) */}
        <ParticlesProvider />

        {/* Layer 2: App content (z-index:2 — always above particles) */}
        <div className="page-content">
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <PageTransition>{children}</PageTransition>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
