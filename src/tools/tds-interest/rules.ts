import type { DeductorType, Provision } from './types';

/**
 * Rules verified in docs/TDS-RULES.md.
 * Income-tax Act, 1961 s.201(1A) and Income-tax Act, 2025 s.398(3)(a): 1% for late
 * deduction and 1.5% for late deposit, for every month or part of a month.
 */
export const LATE_DEDUCTION_RATE = 1;
export const LATE_DEPOSIT_RATE = 1.5;

/** The Income-tax Act, 2025 applies where tax became deductible on or after this date. */
export const NEW_ACT_START = '2026-04-01';

/** Earliest date the calculator accepts. */
export const SUPPORTED_FROM = '2021-04-01';

export const DEDUCTOR_TYPES: { value: DeductorType; label: string }[] = [
  { value: 'non-government', label: 'Not a government office' },
  { value: 'government-challan', label: 'Government office, paying by challan' },
  {
    value: 'government-book-entry',
    label: 'Government office, paying without a challan (book entry)',
  },
];

export function actFor(deductibleOn: string): Provision['act'] {
  return deductibleOn < NEW_ACT_START ? '1961' : '2025';
}

/** Due date for depositing tax deducted on `deductedOn` (Rule 30, 1962 Rules; Rule 218, 2026 Rules). */
export function dueDateFor(
  deductedOn: string,
  type: DeductorType
): { date: string; basis: string } {
  const [year, month] = deductedOn.split('-').map(Number);
  if (type === 'government-book-entry') {
    return { date: deductedOn, basis: 'Same day as deduction (government office, no challan)' };
  }
  if (month === 3 && type === 'non-government') {
    return { date: `${year}-04-30`, basis: '30 April for tax deducted in March' };
  }
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  return {
    date: `${nextYear}-${String(nextMonth).padStart(2, '0')}-07`,
    basis: '7th of the month after deduction',
  };
}

export function provisionFor(
  act: Provision['act'],
  lateDeduction: boolean,
  lateDeposit: boolean
): Provision {
  const clause = lateDeduction === lateDeposit ? '' : lateDeduction ? '(i)' : '(ii)';
  return act === '1961'
    ? {
        act,
        section: `Section 201(1A)${clause}`,
        actName: 'Income-tax Act, 1961',
        rule: 'Rule 30, Income-tax Rules, 1962',
      }
    : {
        act,
        section: `Section 398(3)(a)${clause}`,
        actName: 'Income-tax Act, 2025',
        rule: 'Rule 218, Income-tax Rules, 2026',
      };
}
