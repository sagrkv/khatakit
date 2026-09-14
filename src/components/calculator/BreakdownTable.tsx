interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right';
  mono?: boolean;
}

interface BreakdownTableProps {
  columns: Column[];
  rows: Record<string, string | number>[];
  footer?: Record<string, string | number>;
  caption?: string;
}

export default function BreakdownTable({ columns, rows, footer, caption }: BreakdownTableProps) {
  return (
    <div
      className="breakdown-scroll"
      role="region"
      aria-label={caption || 'Calculation breakdown'}
      tabIndex={0}
    >
      <table className="breakdown-table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.align === 'right' ? 'cell-right' : 'cell-left'}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`${col.align === 'right' ? 'cell-right' : 'cell-left'} ${col.mono ? 'cell-number' : ''}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`${col.align === 'right' ? 'cell-right' : 'cell-left'} ${col.mono ? 'cell-number' : ''}`}
                >
                  {footer[col.key] ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
