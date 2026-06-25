import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showRequired?: boolean;   // adds * indicator when true AND required is set
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, showRequired, className, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const isRequired = required ?? props['aria-required'];

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
            style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}
          >
            {label}
            {(showRequired || isRequired) && (
              <span style={{ color: 'var(--color-danger)' }} aria-hidden="true">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)]',
            'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)]',
            'border border-[var(--color-border)]',
            'placeholder:text-[var(--color-text-faint)]',
            'transition-all duration-150',
            'focus:outline-none focus:border-[var(--color-border-focus)]',
            'focus:bg-[rgba(255,255,255,0.06)]',
            'focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]',
            error && 'border-[rgba(248,113,113,0.4)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.1)]',
            className
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
