import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, rows = 4, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={cn(
          'w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] resize-y',
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
        <p id={`${textareaId}-error`} role="alert" className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
      )}
    </div>
  );
}
