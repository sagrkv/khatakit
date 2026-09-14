import type { AdvanceTaxInput } from './types';

/**
 * Figures shown in the page guide. tests/advance-tax/example.test.ts checks
 * every one against the calculator, so the copy cannot drift from it.
 */

/** Salary plus other income, new regime, with TDS. */
export const WORKED_EXAMPLE = {
  input: {
    regime: 'new',
    grossIncome: 1800000,
    salaryIncome: 1200000,
    deductions: 0,
    tdsDeducted: 100000,
    ageCategory: 'below60',
    hasBusinessIncome: false,
  } satisfies AdvanceTaxInput,
  otherIncome: 600000,
  standardDeduction: 75000,
  taxableIncome: 1725000,
  slabs: [
    { from: 400000, to: 800000, rate: 5, tax: 20000 },
    { from: 800000, to: 1200000, rate: 10, tax: 40000 },
    { from: 1200000, to: 1600000, rate: 15, tax: 60000 },
    { from: 1600000, to: 1725000, rate: 20, tax: 25000 },
  ],
  taxOnIncome: 145000,
  cess: 5800,
  totalTax: 150800,
  netTaxPayable: 50800,
  instalments: [7620, 15240, 15240, 12700],
  cumulative: [7620, 22860, 38100, 50800],
  oldRegimeTotalTax: 351000,
} as const;

/** Just above ₹12 lakh taxable income in the new regime: marginal relief. */
export const REBATE_EXAMPLE = {
  input: { ...WORKED_EXAMPLE.input, grossIncome: 1285000, salaryIncome: 1285000, tdsDeducted: 0 },
  taxableIncome: 1210000,
  taxOnIncome: 61500,
  relief: 51500,
  totalTax: 10400,
} as const;

/** The same income with and without salary. */
export const SALARY_EXAMPLE = {
  income: 1275000,
  salariedTax: 0,
  nonSalaryTax: 74100,
} as const;
