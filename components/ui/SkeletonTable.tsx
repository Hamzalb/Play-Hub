interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

const COL_WIDTHS = ['60%', '80%', '50%', '70%', '40%'];

export function SkeletonTable({ rows = 5, cols = 4 }: SkeletonTableProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
          {/* First column: avatar circle + text bar */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div
                className="h-7 w-7 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
              <div
                className="h-3 rounded animate-pulse"
                style={{ width: '55%', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
          </td>
          {/* Remaining columns */}
          {Array.from({ length: cols - 1 }).map((_, ci) => (
            <td key={ci} className="py-3 px-4">
              <div
                className="h-3 rounded animate-pulse mx-auto"
                style={{
                  width: COL_WIDTHS[ci % COL_WIDTHS.length],
                  background: 'rgba(255,255,255,0.05)',
                  animationDelay: `${(ri * cols + ci) * 40}ms`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
