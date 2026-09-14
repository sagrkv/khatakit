import type { PresumptiveInput, PresumptiveResult } from './types';
import { PRESUMPTIVE_BUSINESS, PRESUMPTIVE_PROFESSION } from '../../lib/constants/presumptive';
import { computeIncomeTax } from '../../lib/tax/income-tax';

const toTwoDecimals = (value: number) => Math.round(value * 100) / 100;

export function calculatePresumptive(input: PresumptiveInput): PresumptiveResult {
  const { scheme, regime } = input;
  const grossReceipts = Math.max(0, input.grossReceipts);
  const cashReceipts = Math.min(Math.max(0, input.cashReceipts), grossReceipts);
  const digitalReceipts = grossReceipts - cashReceipts;
  const cashShare = grossReceipts > 0 ? (cashReceipts / grossReceipts) * 100 : 0;

  const rules = scheme === '44AD' ? PRESUMPTIVE_BUSINESS : PRESUMPTIVE_PROFESSION;
  const applicableLimit =
    cashShare <= rules.cashSharePercent ? rules.higherLimit : rules.baseLimit;

  const cashIncome =
    scheme === '44AD' ? Math.round((cashReceipts * PRESUMPTIVE_BUSINESS.cashRate) / 100) : 0;
  const digitalIncome =
    scheme === '44AD' ? Math.round((digitalReceipts * PRESUMPTIVE_BUSINESS.digitalRate) / 100) : 0;
  const presumptiveIncome = Math.round(
    scheme === '44AD'
      ? (cashReceipts * PRESUMPTIVE_BUSINESS.cashRate) / 100 +
          (digitalReceipts * PRESUMPTIVE_BUSINESS.digitalRate) / 100
      : (grossReceipts * PRESUMPTIVE_PROFESSION.rate) / 100
  );
  const presumptiveRate =
    grossReceipts > 0 ? toTwoDecimals((presumptiveIncome / grossReceipts) * 100) : 0;

  // Presumptive income is business income, so no salary standard deduction applies.
  // Old regime uses the below-60 slabs; the form does not ask for age.
  const tax = computeIncomeTax(presumptiveIncome, regime, 'below60');

  return {
    scheme,
    grossReceipts,
    cashReceipts,
    digitalReceipts,
    cashSharePercent: toTwoDecimals(cashShare),
    cashIncome,
    digitalIncome,
    presumptiveIncome,
    presumptiveRate,
    taxableIncome: presumptiveIncome,
    taxOnIncome: tax.taxOnIncome,
    rebate: tax.rebate,
    taxLiability: tax.taxAfterRebate,
    surcharge: tax.surcharge,
    cess: tax.cess,
    totalTax: tax.totalTax,
    effectiveRate: grossReceipts > 0 ? toTwoDecimals((tax.totalTax / grossReceipts) * 100) : 0,
    isWithinLimit: grossReceipts <= applicableLimit,
    applicableLimit,
  };
}
