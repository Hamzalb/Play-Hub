import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div
          className="mb-4 h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--color-violet-mid)' }}
        >
          {icon}
        </div>
      )}
      <p className="text-base font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      {description && (
        <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
