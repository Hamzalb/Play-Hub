'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { BentoCard } from '@/components/bento/BentoCard';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  accent?: 'violet' | 'gold' | 'cyan';
  col?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const accentColor: Record<'violet' | 'gold' | 'cyan', string> = {
  violet: 'var(--color-violet-light)',
  gold:   'var(--color-gold-light)',
  cyan:   'var(--color-cyan-light)',
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 28, stiffness: 90 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
    } else {
      motionValue.set(value);
    }
  }, [inView, motionValue, value, prefersReduced, prefix, suffix]);

  useEffect(() =>
    spring.on('change', (v) => {
      if (!prefersReduced && ref.current)
        ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    }),
    [spring, prefix, suffix, prefersReduced]
  );

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function KpiCard({
  label, value, prefix = '', suffix = '',
  trend, trendLabel, accent = 'violet', col = 3, className,
}: KpiCardProps) {
  const color = accentColor[accent];
  const trendUp   = trend !== undefined && trend > 0;
  const trendDown = trend !== undefined && trend < 0;

  return (
    <BentoCard col={col as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12} className={className}>
      <p
        className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}
      >
        {label}
      </p>

      <p
        className="text-4xl font-bold tabular-nums mb-1 leading-none"
        style={{ fontFamily: 'var(--font-display)', color }}
      >
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </p>

      {trend !== undefined && (
        <p
          className={cn(
            'text-xs font-medium mt-2',
            trendUp   && 'text-[var(--color-success)]',
            trendDown && 'text-[var(--color-danger)]',
            !trendUp && !trendDown && 'text-[var(--color-text-muted)]'
          )}
        >
          {trendUp ? '↑' : trendDown ? '↓' : '•'}{' '}
          {Math.abs(trend)}%{trendLabel ? ` ${trendLabel}` : ''}
        </p>
      )}
    </BentoCard>
  );
}
