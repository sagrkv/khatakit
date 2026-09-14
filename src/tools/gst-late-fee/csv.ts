import { formatCurrency } from '../../lib/utils/format';
import { displayDate } from './dates';
import type { GstInput, GstResult } from './types';
import { capExplanation, filedAsLabel, noInterestReason, turnoverLabel } from './workings';

type Row = (string | number)[];

function escapeCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Workings as CSV with plain numbers, for spreadsheets. */
export function resultToCsv(input: GstInput, result: GstResult): string {
  const annual = input.returnType === 'GSTR-9';
  const cap = capExplanation(input, result);
  const reason = noInterestReason(input, result);
  const head = (name: string, fee: number): Row => [
    name,
    result.lateFeePerDayPerHead,
    result.daysLate,
    result.rawLateFeePerHead,
    result.capPerHead,
    fee,
  ];

  const rows: Row[] = [
    ['GST late fee and interest workings'],
    ['Return type', input.returnType],
    ['Filed as', filedAsLabel(input)],
    ...(input.isNilReturn && !annual
      ? []
      : [[`Aggregate turnover (${annual ? 'financial year' : 'previous year'})`, turnoverLabel(input)]]),
    ...(annual ? [['Turnover in this State', input.stateTurnover ?? 0]] : []),
    ['Due date', result.dueDate],
    ['Filing date', result.filingDate],
    ['Days late', result.daysLate],
    ['Last date to file (three years from the due date)', result.lastFilingDate],
    ['Past the three-year limit', result.isTimeBarred ? 'Yes' : 'No'],
    [],
    ['Late fee'],
    ['Head', 'Per day', 'Days late', 'Before cap', 'Cap', 'Payable'],
    head('CGST', result.cgstLateFee),
    head('SGST/UTGST', result.sgstLateFee),
    [
      'Total',
      result.lateFeePerDay,
      result.daysLate,
      result.rawLateFee,
      result.lateFeeCapApplied,
      result.cappedLateFee,
    ],
    ['Cap', `${cap.title}. ${cap.detail}`],
    [],
    ...(reason
      ? [['Interest', reason.replace(/^No interest\./, 'Not charged.')]]
      : [
          ['Interest'],
          ['Tax paid in cash', result.cashTax],
          ['Rate (% a year)', result.interestRate],
          ['Interest from', result.interestFrom],
          ['Interest to', result.interestTo],
          ['Interest days', result.interestDays],
          ['Calculation', `${result.cashTax} x ${result.interestRate}% x ${result.interestDays} / 365`],
          ['Interest (exact)', result.interestExact.toFixed(2)],
          ['Interest (rounded to the rupee)', result.interest],
        ]),
    [],
    ['Total late fee and interest', result.totalPenalty],
  ];
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';
}

/** Plain-text summary for the clipboard. */
export function resultToText(input: GstInput, result: GstResult): string {
  const reason = noInterestReason(input, result);
  return [
    `${input.returnType} due ${displayDate(result.dueDate)}, filed ${displayDate(result.filingDate)}: ${result.daysLate} days late`,
    `Late fee: ${formatCurrency(result.cappedLateFee)} (CGST ${formatCurrency(result.cgstLateFee)} + SGST/UTGST ${formatCurrency(result.sgstLateFee)})`,
    `${capExplanation(input, result).title}. ${capExplanation(input, result).detail}`,
    reason
      ? `Interest: ${reason}`
      : `Interest: ${formatCurrency(result.cashTax)} x ${result.interestRate}% x ${result.interestDays} / 365 = ${formatCurrency(result.interest)}`,
    `Total: ${formatCurrency(result.totalPenalty)}`,
    ...(result.isTimeBarred
      ? [`The last date to file was ${displayDate(result.lastFilingDate)}.`]
      : []),
  ].join('\n');
}
