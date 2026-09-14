import type { PresumptiveInput } from './types';

/**
 * Figures shown in the page guide. tests/presumptive-tax/example.test.ts
 * checks every one against the calculator.
 */

/** Business with 4% cash receipts, so the ₹3 crore limit applies. */
export const BUSINESS_EXAMPLE = {
  input: {
    scheme: '44AD',
    grossReceipts: 25000000,
    cashReceipts: 1000000,
    regime: 'new',
  } satisfies PresumptiveInput,
  digitalReceipts: 24000000,
  cashSharePercent: 4,
  applicableLimit: 30000000,
  cashIncome: 80000,
  digitalIncome: 1440000,
  presumptiveIncome: 1520000,
  taxOnIncome: 108000,
  cess: 4320,
  totalTax: 112320,
  /** Cash of ₹15 lakh is 6%, so the limit falls to ₹2 crore. */
  higherCash: 1500000,
  higherCashLimit: 20000000,
} as const;

/** Professional paid entirely through the bank. */
export const PROFESSION_EXAMPLE = {
  input: {
    scheme: '44ADA',
    grossReceipts: 4000000,
    cashReceipts: 0,
    regime: 'new',
  } satisfies PresumptiveInput,
  presumptiveIncome: 2000000,
  taxOnIncome: 200000,
  cess: 8000,
  totalTax: 208000,
} as const;
