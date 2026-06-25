'use client';

import { motion } from 'framer-motion';

interface BarItem {
  label: string;
  value: number;
  color?: 'violet' | 'gold' | 'cyan';
}

interface BarChartProps {
  items: BarItem[];
  prefix?: string;
  suffix?: string;
  className?: string;
}

const colorMap = {
  violet: 'var(--color-violet-mid)',
  gold:   'var(--color-gold)',
  cyan:   'var(--color-cyan)',
};

export function BarChart({ items, prefix = '', suffix = '', className }: BarChartProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div
      className={className}
      role="list"
      aria-label="Bar chart"
    >
      {/* Screen-reader summary */}
      <p className="sr-only">
        {items.map((i) => `${i.label}: ${prefix}${i.value.toLocaleString()}${suffix}`).join('. ')}
      </p>

      <div className="flex flex-col gap-3" aria-hidden="true">
        {items.map((item, idx) => {
          const pct = (item.value / max) * 100;
          const color = colorMap[item.color ?? 'violet'];

          return (
            <div key={`${item.label}-${idx}`} role="listitem" className="flex items-center gap-3">
              <p
                className="text-xs w-28 flex-shrink-0 truncate"
                style={{ color: 'var(--color-text-secondary)' }}
                title={item.label}
              >
                {item.label}
              </p>

              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <p
                className="text-xs font-semibold tabular-nums w-16 text-right flex-shrink-0"
                style={{ color, fontFamily: 'var(--font-mono)' }}
              >
                {prefix}{item.value.toLocaleString()}{suffix}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
