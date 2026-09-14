import type { EmiInput } from './types';

/**
 * Figures shown in the page guide. tests/emi/example.test.ts checks every one
 * against the calculator, so the copy cannot drift from the calculation.
 */

/** RBI Key Facts Statement example: ₹20,000 at 15% for 24 months. */
export const RBI_EXAMPLE = {
  input: { principal: 20000, annualRate: 15, tenureMonths: 24 } satisfies EmiInput,
  monthlyRatePercent: 1.25,
  emi: 970,
  firstMonth: { openingBalance: 20000, interest: 250, principal: 720 },
  secondMonth: { openingBalance: 19280, interest: 241, principal: 729 },
  lastMonth: { openingBalance: 958, interest: 12, principal: 958 },
  totalInterest: 3274,
  totalPayable: 23274,
} as const;

/** Zero interest: the EMI is the loan divided by the months, which does not divide evenly. */
export const ZERO_RATE_EXAMPLE = {
  input: { principal: 100000, annualRate: 0, tenureMonths: 7 } satisfies EmiInput,
  emi: 14286,
  sumOfRoundedEmis: 100002,
  totalPayable: 100000,
} as const;
