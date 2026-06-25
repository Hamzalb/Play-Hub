import { Button } from './Button';
import { ChevronRight } from './icons';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pages, total, onPageChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className={`flex items-center justify-between pt-4 ${className ?? ''}`}>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Page {page} of {pages} &middot; {total} results
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronRight size={14} className="rotate-180" />
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
