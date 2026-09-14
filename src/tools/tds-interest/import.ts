import { parseDateText } from './validate';
import { DRAFT_FIELDS, MAX_ROWS } from './sheet';
import type { DraftField, DraftRow } from './types';

type DraftInput = Omit<DraftRow, 'id'>;

function headerField(cell: string): DraftField | null {
  const text = cell.toLowerCase();
  if (/deductible|credit/.test(text)) return 'deductible';
  if (/deposit|paid|challan/.test(text)) return 'deposited';
  if (/deducted|deduction/.test(text)) return 'deducted';
  if (/amount|tds/.test(text)) return 'amount';
  if (/label|deductee|name|section|party|vendor|description/.test(text)) return 'label';
  return null;
}

/** A header row names at least two columns and contains no dates. */
function isHeaderRow(cells: string[]): boolean {
  const named = cells.filter((cell) => headerField(cell) !== null).length;
  const hasDate = cells.some((cell) => cell.trim() !== '' && parseDateText(cell).ok);
  return named >= 2 && !hasDate;
}

const blankInput = (): DraftInput => ({
  label: '',
  amount: '',
  deductible: '',
  deducted: '',
  deposited: '',
});

/**
 * Maps a parsed CSV or pasted table to row drafts.
 * With a header row, columns are matched by name in any order. Without one, rows are read by
 * position: label, amount, deductible, deducted, deposited (or the same without the label).
 */
export function tableToDrafts(table: string[][]): { drafts: DraftInput[]; skipped: number } {
  const rows = table.filter((cells) => cells.some((cell) => cell.trim() !== ''));
  if (rows.length === 0) return { drafts: [], skipped: 0 };

  const header = isHeaderRow(rows[0]) ? rows[0].map(headerField) : null;
  const body = (header ? rows.slice(1) : rows).slice(0, MAX_ROWS);
  const overLimit = Math.max(0, (header ? rows.length - 1 : rows.length) - MAX_ROWS);
  const drafts: DraftInput[] = [];
  let skipped = overLimit;

  for (const cells of body) {
    const fields: (DraftField | null)[] | null = header
      ? header
      : cells.length >= 5
        ? DRAFT_FIELDS
        : cells.length === 4
          ? DRAFT_FIELDS.slice(1)
          : null;
    if (!fields) {
      skipped++;
      continue;
    }
    const draft = fields.reduce<DraftInput>((row, field, column) => {
      return field ? { ...row, [field]: (cells[column] ?? '').trim() } : row;
    }, blankInput());
    drafts.push(draft);
  }
  return { drafts, skipped };
}

/**
 * Pastes a block of cells into the rows starting at one cell, like a spreadsheet.
 * Rows are added as needed; a pasted header row is dropped.
 */
export function pasteIntoDrafts(
  drafts: DraftRow[],
  startRow: number,
  startColumn: number,
  grid: string[][],
  makeId: () => string
): DraftRow[] {
  const block = grid.length > 0 && isHeaderRow(grid[0]) ? grid.slice(1) : grid;
  const room = Math.max(0, MAX_ROWS - startRow);
  const next = [...drafts];
  block.slice(0, room).forEach((cells, offset) => {
    const index = startRow + offset;
    const current = next[index] ?? { id: makeId(), ...blankInput() };
    const updated = cells.reduce<DraftRow>((row, cell, column) => {
      const field = DRAFT_FIELDS[startColumn + column];
      return field ? { ...row, [field]: cell.trim() } : row;
    }, current);
    next[index] = updated;
  });
  return next;
}
