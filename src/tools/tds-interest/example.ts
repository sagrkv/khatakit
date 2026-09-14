import { calculateCase } from './calc';
import type { CaseResult, SheetOptions, TdsCase } from './types';

/**
 * Figures shown in the page guide, calculated by the calculator itself.
 * tests/tds-interest/example.test.ts checks them against independently worked answers.
 */
const EXAMPLE_OPTIONS: SheetOptions = {
  asOf: '2026-09-14',
  today: '2026-09-14',
  deductorType: 'non-government',
};

function example(input: Omit<TdsCase, 'label'>): { input: TdsCase; result: CaseResult } {
  const full = { label: '', ...input };
  const result = calculateCase(full, EXAMPLE_OPTIONS);
  if (result.status !== 'ok') throw new Error('Guide example does not calculate');
  return { input: full, result };
}

/** Late deduction and late deposit on one amount. */
export const WORKED = example({
  amount: 50000,
  deductibleOn: '2026-06-15',
  deductedOn: '2026-08-10',
  depositedOn: '2026-09-12',
});

/** One day late: calendar and 30-day months differ. */
export const ONE_DAY_LATE = example({
  amount: 100050,
  deductibleOn: '',
  deductedOn: '2026-04-28',
  depositedOn: '2026-05-08',
});

/** March deduction deposited in May 2026, straddling 1 April 2026. */
export const MARCH = example({
  amount: 25000,
  deductibleOn: '',
  deductedOn: '2026-03-20',
  depositedOn: '2026-05-05',
});
