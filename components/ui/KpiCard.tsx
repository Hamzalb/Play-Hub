'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { BentoCard } from '@/components/bento/BentoCard';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;        // % change, positive = up
  trendLabel?: string;
  accent?: 'violet' | 'cyan' | 'lime';
  col?: 1 | 2 | 3 | 4;
  className?: string;
}

const accentMap = {
  violet: 'text-[var(--color-violet-light)]',
  cyan:   'text-[var(--color-cyan-light)]',
  lime:   'text-[var(--color-lime-light)]',
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 100 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
      }
    });
  }, [spring, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function KpiCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  accent = 'violet',
  col = 3,
  className,
}: KpiCardProps) {
  const trendColor =
    trend === undefined ? '' :
    trend > 0 ? 'text-[var(--color-success)]' :
    trend < 0 ? 'text-[var(--color-danger)]' :
    'text-[var(--color-text-muted)]';

  return (
    <BentoCard col={col as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12} className={className}>
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
        {label}
      </p>
      <p className={cn('text-4xl font-bold tabular-nums', accentMap[accent])}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </p>
      {trend !== undefined && (
        <p className={cn('mt-2 text-xs font-medium', trendColor)}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '●'}{' '}
          {Math.abs(trend)}%{trendLabel ? ` ${trendLabel}` : ''}
        </p>
      )}
    </BentoCard>
  );
}
