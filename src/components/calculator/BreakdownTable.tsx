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
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-neutral-600 ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'} ${
                    col.mono ? 'font-mono' : ''
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr className="bg-neutral-50 font-semibold">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'} ${
                    col.mono ? 'font-mono' : ''
                  }`}
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
