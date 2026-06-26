import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-gold" />
      </div>
      <div className="grain-overlay" aria-hidden="true" />
      {children}
    </>
  );
}
