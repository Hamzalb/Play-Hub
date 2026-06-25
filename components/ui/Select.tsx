import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] cursor-pointer',
            'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)]',
            'border border-[var(--color-border)]',
            'transition-all duration-150',
            'focus:outline-none focus:border-[var(--color-border-focus)]',
            'focus:bg-[rgba(255,255,255,0.06)]',
            'focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]',
            error && 'border-[rgba(248,113,113,0.4)] focus:border-[var(--color-danger)]',
            className
          )}
          style={{ colorScheme: 'dark' }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ background: '#0d1321' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#0d1321' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p role="alert" className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
