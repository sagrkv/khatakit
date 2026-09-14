import type { AmortizationEntry, EmiInput, EmiResult, MonthlyInstalment } from './types';

/** Nearest rupee, 50 paise and above rounded up (RBI Responsible Business Conduct Directions, 2025, para 457). */
const toRupee = (value: number) => Math.floor(value + 0.5);

type ExactRow = Omit<MonthlyInstalment, never>;

/**
 * Reducing-balance schedule on the unrounded EMI, with monthly rate = annual rate / 12.
 * Figures are rounded only for display, as in the RBI Key Facts Statement worked example.
 */
function amortise(principal: number, annualRate: number, tenureMonths: number): ExactRow[] {
  const months = Math.round(tenureMonths);
  if (!(principal > 0) || !(months > 0) || !(annualRate >= 0)) return [];

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi =
    monthlyRate === 0 ? principal / months : (principal * monthlyRate * factor) / (factor - 1);

  const rows: ExactRow[] = [];
  let balance = principal;
  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    const principalPart = month === months ? balance : emi - interest;
    const closingBalance = month === months ? 0 : balance - principalPart;
    rows.push({
      month,
      openingBalance: balance,
      principal: principalPart,
      interest,
      instalment: principalPart + interest,
      closingBalance,
    });
    balance = closingBalance;
  }
  return rows;
}

export function buildMonthlySchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): MonthlyInstalment[] {
  return amortise(principal, annualRate, tenureMonths).map((row) => ({
    month: row.month,
    openingBalance: toRupee(row.openingBalance),
    principal: toRupee(row.principal),
    interest: toRupee(row.interest),
    instalment: toRupee(row.instalment),
    closingBalance: toRupee(row.closingBalance),
  }));
}

function groupByYear(rows: ExactRow[]): AmortizationEntry[] {
  const years = new Map<number, ExactRow[]>();
  for (const row of rows) {
    const year = Math.ceil(row.month / 12);
    years.set(year, [...(years.get(year) ?? []), row]);
  }
  return [...years.entries()].map(([year, yearRows]) => ({
    year,
    principalPaid: toRupee(yearRows.reduce((sum, row) => sum + row.principal, 0)),
    interestPaid: toRupee(yearRows.reduce((sum, row) => sum + row.interest, 0)),
    balance: toRupee(yearRows[yearRows.length - 1].closingBalance),
  }));
}

export function calculateEmi(input: EmiInput): EmiResult {
  const rows = amortise(input.principal, input.annualRate, input.tenureMonths);
  if (rows.length === 0) return { emi: 0, totalInterest: 0, totalPayable: 0, schedule: [] };

  const exactInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  return {
    emi: toRupee(rows[0].instalment),
    totalInterest: toRupee(exactInterest),
    totalPayable: toRupee(input.principal + exactInterest),
    schedule: groupByYear(rows),
  };
}
