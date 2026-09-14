import { toCsv } from '../../lib/utils/csv';
import { formatCurrency } from '../../lib/utils/format';
import { buildMonthlySchedule } from './calc';
import type { EmiInput, EmiResult } from './types';

export function emiScheduleCsv(input: EmiInput): string {
  const rows = buildMonthlySchedule(input.principal, input.annualRate, input.tenureMonths);
  return toCsv([
    ['Month', 'Opening balance', 'EMI', 'Principal', 'Interest', 'Closing balance'],
    ...rows.map((row) => [
      row.month,
      row.openingBalance,
      row.instalment,
      row.principal,
      row.interest,
      row.closingBalance,
    ]),
  ]);
}

export function emiScheduleFilename(input: EmiInput): string {
  return `emi-schedule-${input.principal}-at-${input.annualRate}pct-${input.tenureMonths}-months.csv`;
}

export function emiSummaryText(input: EmiInput, result: EmiResult): string {
  return [
    `Loan amount: ${formatCurrency(input.principal)}`,
    `Interest rate: ${input.annualRate}% a year`,
    `Tenure: ${input.tenureMonths} months`,
    `Monthly EMI: ${formatCurrency(result.emi)}`,
    `Total interest: ${formatCurrency(result.totalInterest)}`,
    `Total payable: ${formatCurrency(result.totalPayable)}`,
    '',
    ...result.schedule.map(
      (entry) =>
        `Year ${entry.year}: principal ${formatCurrency(entry.principalPaid)}, interest ${formatCurrency(entry.interestPaid)}, balance ${formatCurrency(entry.balance)}`
    ),
  ].join('\n');
}
