import { toCsv, type Cell } from './csv';
import { compactMonths, formatSlashDate } from './dates';
import { DEDUCTOR_TYPES } from './rules';
import { formatPaise, formatRupees } from './format';
import type { DraftRow, Period, SheetOptions, SheetResult } from './types';

const HEADER = [
  'Row',
  'Label',
  'TDS amount',
  'Amount for interest',
  'Date deductible',
  'Date deducted',
  'Date deposited',
  'Interest worked out to',
  'Deductor',
  'Due date',
  'Due date basis',
  'Provision',
  'Rule for due date',
  'Late deduction months (calendar)',
  'Late deduction month count (calendar)',
  'Late deduction days',
  'Late deduction month count (30-day)',
  'Late deduction interest (calendar months)',
  'Late deduction interest (30-day months)',
  'Late deposit months (calendar)',
  'Late deposit month count (calendar)',
  'Late deposit days',
  'Late deposit month count (30-day)',
  'Late deposit interest (calendar months)',
  'Late deposit interest (30-day months)',
  'Total interest (calendar months)',
  'Total interest (30-day months)',
  'Estimate',
  'Notes',
  'Errors',
];

const rupees = (paise: number) => paise / 100;
const slash = (iso: string) => (iso ? formatSlashDate(iso) : '');

function periodCells(period: Period | null): Cell[] {
  if (!period) return ['', 0, 0, 0, 0, 0];
  return [
    period.months.join(', '),
    period.months.length,
    period.days,
    period.thirtyDayMonths,
    rupees(period.calendarPaise),
    rupees(period.thirtyDayPaise),
  ];
}

/** One row per case with every input and working, then totals. Blank rows are left out. */
export function workingsTable(
  drafts: DraftRow[],
  sheet: SheetResult,
  options: SheetOptions
): Cell[][] {
  const deductor = DEDUCTOR_TYPES.find((type) => type.value === options.deductorType)?.label ?? '';
  const body: Cell[][] = [];
  sheet.outcomes.forEach((outcome, index) => {
    const draft = drafts[index];
    if (outcome.status === 'blank') return;
    if (outcome.status === 'error') {
      const cells: Cell[] = HEADER.map(() => '');
      const set = (name: string, value: Cell) => (cells[HEADER.indexOf(name)] = value);
      set('Row', index + 1);
      set('Label', outcome.label);
      set('TDS amount', draft.amount);
      set('Date deductible', draft.deductible);
      set('Date deducted', draft.deducted);
      set('Date deposited', draft.deposited);
      set('Errors', outcome.errors.join(' '));
      body.push(cells);
      return;
    }
    const worksTo = outcome.estimate ? slash(options.asOf) : '';
    body.push([
      index + 1,
      outcome.label,
      outcome.amount,
      outcome.base,
      slash(draft.deductible ? toIso(draft.deductible) : ''),
      slash(outcome.dueDate ? toIso(draft.deducted) : ''),
      slash(toIso(draft.deposited)),
      worksTo,
      deductor,
      outcome.dueDate ? slash(outcome.dueDate) : '',
      outcome.dueDateBasis,
      `${outcome.provision.section}, ${outcome.provision.actName}`,
      outcome.provision.rule,
      ...periodCells(outcome.lateDeduction),
      ...periodCells(outcome.lateDeposit),
      rupees(outcome.totalCalendarPaise),
      rupees(outcome.totalThirtyDayPaise),
      outcome.estimate ? 'Yes' : 'No',
      outcome.notes.join(' '),
      '',
    ]);
  });

  const totals = (label: string, calendar: number, thirty: number): Cell[] => {
    const cells: Cell[] = HEADER.map(() => '');
    cells[HEADER.indexOf('Row')] = label;
    cells[HEADER.indexOf('Total interest (calendar months)')] = calendar;
    cells[HEADER.indexOf('Total interest (30-day months)')] = thirty;
    return cells;
  };
  return [
    HEADER,
    ...body,
    totals('Total', rupees(sheet.totalCalendarPaise), rupees(sheet.totalThirtyDayPaise)),
    totals(
      'Total rounded to nearest Rs 10 (section 288B, 1961 Act; section 516, 2025 Act)',
      sheet.roundedCalendarRupees,
      sheet.roundedThirtyDayRupees
    ),
  ];
}

/** Dates in drafts are raw text; outcomes only exist when they parsed, so normalise here. */
function toIso(text: string): string {
  const value = text.trim();
  const dayFirst = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(value);
  if (dayFirst)
    return `${dayFirst[3]}-${dayFirst[2].padStart(2, '0')}-${dayFirst[1].padStart(2, '0')}`;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  return iso ? `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}` : '';
}

/** CSV text. The download button adds the byte order mark that spreadsheet apps need. */
export function workingsCsv(drafts: DraftRow[], sheet: SheetResult, options: SheetOptions): string {
  return toCsv(workingsTable(drafts, sheet, options));
}

export const TEMPLATE_CSV = toCsv([
  ['Label', 'TDS amount', 'Date deductible', 'Date deducted', 'Date deposited'],
  ['Vendor A - 194C', '1,00,050', '28/04/2026', '28/04/2026', '08/05/2026'],
  ['Vendor B - 194J', '50,000', '15/06/2026', '10/08/2026', '12/09/2026'],
  ['Vendor C - not yet deposited', '25,000', '', '10/08/2026', ''],
]);

/** Plain-text summary for the clipboard. */
export function summaryText(sheet: SheetResult): string {
  const lines = ['TDS interest'];
  sheet.outcomes.forEach((outcome, index) => {
    const name = `Row ${index + 1}${outcome.label ? ` (${outcome.label})` : ''}`;
    if (outcome.status === 'error')
      lines.push(`${name}: not calculated - ${outcome.errors.join(' ')}`);
    if (outcome.status !== 'ok') return;
    const parts = [
      outcome.dueDate ? `due ${slash(outcome.dueDate)}` : 'not deducted yet',
      outcome.lateDeduction &&
        `late deduction ${compactMonths(outcome.lateDeduction.months)} = ${formatPaise(outcome.lateDeduction.calendarPaise)}`,
      outcome.lateDeposit &&
        `late deposit ${compactMonths(outcome.lateDeposit.months)} = ${formatPaise(outcome.lateDeposit.calendarPaise)}`,
      `total ${formatPaise(outcome.totalCalendarPaise)} (30-day months ${formatPaise(outcome.totalThirtyDayPaise)})`,
      outcome.provision.section,
    ].filter(Boolean);
    lines.push(`${name}: ${parts.join('; ')}${outcome.estimate ? ' (estimate)' : ''}`);
  });
  lines.push(
    `Total, calendar months: ${formatPaise(sheet.totalCalendarPaise)} (rounded to nearest ₹10: ${formatRupees(sheet.roundedCalendarRupees)})`,
    `Total, 30-day months: ${formatPaise(sheet.totalThirtyDayPaise)} (rounded to nearest ₹10: ${formatRupees(sheet.roundedThirtyDayRupees)})`
  );
  return lines.join('\n');
}
