/** RFC 4180 CSV reader. Tab-separated text (spreadsheet paste) is detected. */

export type { CsvCell as Cell } from '../../lib/utils/csv';

export function parseDelimited(input: string, delimiter?: string): string[][] {
  const text = input.replace(/^\uFEFF/, '');
  const separator = delimiter ?? (text.includes('\t') ? '\t' : ',');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let index = 0;

  while (index < text.length) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 2;
        continue;
      }
      if (char === '"') quoted = false;
      else field += char;
      index++;
      continue;
    }
    if (char === '"' && field === '') {
      quoted = true;
    } else if (char === separator) {
      row.push(field);
      field = '';
    } else if (char === '\r' || char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      if (char === '\r' && text[index + 1] === '\n') index++;
    } else {
      field += char;
    }
    index++;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

/** Text starting with these characters can run as a formula in a spreadsheet. */
export function guardText(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

export { toCsv } from '../../lib/utils/csv';
