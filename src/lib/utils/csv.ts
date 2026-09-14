export type CsvCell = string | number;

/** Stops spreadsheet apps treating text as a formula. Numbers are left alone. */
function safeText(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function escapeCell(cell: CsvCell): string {
  const text = typeof cell === 'number' ? String(cell) : safeText(cell);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** RFC 4180 CSV with CRLF line endings. */
export function toCsv(rows: CsvCell[][]): string {
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';
}
