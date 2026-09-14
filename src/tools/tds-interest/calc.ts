import { addDays, daysBetween, formatDisplayDate, monthsSpanned } from './dates';
import {
  LATE_DEDUCTION_RATE,
  LATE_DEPOSIT_RATE,
  NEW_ACT_START,
  SUPPORTED_FROM,
  actFor,
  dueDateFor,
  provisionFor,
} from './rules';
import type { CaseOutcome, CaseResult, Period, SheetOptions, SheetResult, TdsCase } from './types';

export { dueDateFor };

/**
 * Counts an interest period two ways.
 * Calendar months: every month from the day after `from` to `to` (TRACES FAQ).
 * 30-day months: days between the dates divided by 30, rounded up (tribunal rulings).
 */
export function countPeriod(from: string, to: string) {
  const days = daysBetween(from, to);
  if (days <= 0) return { from, to, days: 0, months: [] as string[], thirtyDayMonths: 0 };
  return {
    from,
    to,
    days,
    months: monthsSpanned(addDays(from, 1), to),
    thirtyDayMonths: Math.ceil(days / 30),
  };
}

function interestPeriod(
  from: string,
  to: string,
  ratePercent: number,
  base: number
): Period | null {
  const counted = countPeriod(from, to);
  if (counted.days === 0) return null;
  // base is a multiple of Rs 100, so each Rs 100 earns `ratePercent` rupees a month.
  const paisePerMonth = (base / 100) * Math.round(ratePercent * 100);
  return {
    ...counted,
    ratePercent,
    calendarPaise: paisePerMonth * counted.months.length,
    thirtyDayPaise: paisePerMonth * counted.thirtyDayMonths,
  };
}

/** Section 288B (1961 Act) and section 516 (2025 Act): ignore paise, then nearest Rs 10. */
export function roundToTen(paise: number): number {
  const rupees = Math.floor(paise / 100);
  const last = rupees % 10;
  return last >= 5 ? rupees - last + 10 : rupees - last;
}

function validate(input: TdsCase, { asOf, today }: SheetOptions): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(input.amount) || input.amount <= 0)
    errors.push('TDS amount must be more than 0.');
  const deductible = input.deductibleOn || input.deductedOn;
  if (!deductible) {
    errors.push(
      'Enter the date tax was deducted, or the date it was deductible if not yet deducted.'
    );
  }
  if (input.depositedOn && !input.deductedOn) {
    errors.push('Enter the date tax was deducted. A deposit date needs a deduction date.');
  }
  const dated: [string, string][] = [
    ['Date deductible', input.deductibleOn],
    ['Date deducted', input.deductedOn],
    ['Date deposited', input.depositedOn],
  ];
  for (const [name, value] of dated) {
    if (!value) continue;
    if (value > today) errors.push(`${name} is in the future.`);
    if (value < SUPPORTED_FROM)
      errors.push(`${name} is before 1 April 2021. Earlier dates are not supported.`);
  }
  if (input.deductedOn && input.depositedOn && input.depositedOn < input.deductedOn) {
    errors.push('Date deposited is before the date deducted.');
  }
  if (deductible && !input.depositedOn) {
    if (!asOf) errors.push('Enter the as-of date to work out interest on tax not yet deposited.');
    else if (asOf > today) errors.push('The as-of date is in the future.');
    else if (input.deductedOn && asOf < input.deductedOn)
      errors.push('The as-of date is before the date deducted.');
    else if (!input.deductedOn && asOf < deductible) {
      errors.push('The as-of date is before the date tax was deductible.');
    }
  }
  return errors;
}

export function calculateCase(input: TdsCase, options: SheetOptions): CaseOutcome {
  const errors = validate(input, options);
  if (errors.length > 0) return { status: 'error', label: input.label, errors };

  const { asOf, deductorType } = options;
  const deductible = input.deductibleOn || input.deductedOn;
  const act = actFor(deductible);
  const base = Math.floor(input.amount / 100) * 100;
  const notes: string[] = [];

  const deductionEnd = input.deductedOn || asOf;
  const lateDeduction =
    deductionEnd > deductible
      ? interestPeriod(deductible, deductionEnd, LATE_DEDUCTION_RATE, base)
      : null;

  const due = input.deductedOn ? dueDateFor(input.deductedOn, deductorType) : null;
  const depositEnd = input.depositedOn || asOf;
  const lateDeposit =
    input.deductedOn && due && depositEnd > due.date
      ? interestPeriod(input.deductedOn, depositEnd, LATE_DEPOSIT_RATE, base)
      : null;

  if (!input.deductedOn) {
    notes.push(
      `Not yet deducted. Late-deduction interest is worked out to ${formatDisplayDate(asOf)} and grows each month until the tax is deducted. Late-deposit interest will also apply if the tax is then deposited after its due date.`
    );
  } else if (!input.depositedOn) {
    notes.push(
      lateDeposit
        ? `Not yet deposited. Interest is worked out to ${formatDisplayDate(asOf)} and grows each month until the tax is deposited.`
        : `Not yet deposited, and the deposit is not yet due on ${formatDisplayDate(asOf)}.`
    );
  }
  if (base === 0) {
    notes.push(
      'The amount is below ₹100. Interest is worked out on the amount rounded down to a multiple of ₹100, so it is 0.'
    );
  }
  const straddles =
    act === '1961' &&
    [lateDeduction?.to, lateDeposit?.to].some((end) => end !== undefined && end >= NEW_ACT_START);
  if (straddles) {
    notes.push(
      'This default began under the Income-tax Act, 1961 and runs past 1 April 2026. The months are counted as one period. No official text says whether section 201(1A) or section 398(3)(a) covers the months from April 2026; the rates are the same, so the amount is the same.'
    );
  }

  const result: CaseResult = {
    status: 'ok',
    label: input.label,
    amount: input.amount,
    base,
    dueDate: due?.date ?? null,
    dueDateBasis: due?.basis ?? 'Not deducted yet',
    provision: provisionFor(act, lateDeduction !== null, lateDeposit !== null),
    lateDeduction,
    lateDeposit,
    totalCalendarPaise: (lateDeduction?.calendarPaise ?? 0) + (lateDeposit?.calendarPaise ?? 0),
    totalThirtyDayPaise: (lateDeduction?.thirtyDayPaise ?? 0) + (lateDeposit?.thirtyDayPaise ?? 0),
    estimate: !input.deductedOn || !input.depositedOn,
    straddles,
    notes,
  };
  return result;
}

export function summarise(outcomes: CaseOutcome[]): SheetResult {
  const calculated = outcomes.filter((outcome): outcome is CaseResult => outcome.status === 'ok');
  const totalCalendarPaise = calculated.reduce((sum, row) => sum + row.totalCalendarPaise, 0);
  const totalThirtyDayPaise = calculated.reduce((sum, row) => sum + row.totalThirtyDayPaise, 0);
  return {
    outcomes,
    totalCalendarPaise,
    totalThirtyDayPaise,
    roundedCalendarRupees: roundToTen(totalCalendarPaise),
    roundedThirtyDayRupees: roundToTen(totalThirtyDayPaise),
    calculatedCount: calculated.length,
    errorCount: outcomes.filter((outcome) => outcome.status === 'error').length,
    estimateCount: calculated.filter((row) => row.estimate).length,
  };
}

export function calculateSheet(cases: TdsCase[], options: SheetOptions): SheetResult {
  return summarise(cases.map((input) => calculateCase(input, options)));
}
