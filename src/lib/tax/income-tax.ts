import {
  CESS_RATE,
  NEW_REGIME_BANDS,
  NEW_REGIME_SURCHARGE_CAP,
  OLD_REGIME_BANDS,
  REBATE,
  SURCHARGE_BANDS,
  type TaxBand,
} from '../constants/tax-slabs';
import type { AgeCategory, IncomeTaxBreakdown, TaxRegime } from './types';

interface RawTax {
  taxOnIncome: number;
  rebate: number;
  taxAfterRebate: number;
  surcharge: number;
}

function slabTax(income: number, bands: readonly TaxBand[]): number {
  let lower = 0;
  let tax = 0;
  for (const band of bands) {
    if (income <= lower) break;
    tax += ((Math.min(income, band.upTo) - lower) * band.rate) / 100;
    lower = band.upTo;
  }
  return tax;
}

// Section 156: new regime tax on income above Rs 12 lakh never exceeds that excess.
function rebateFor(regime: TaxRegime, income: number, tax: number): number {
  const { incomeLimit, maxRebate } = REBATE[regime];
  if (income <= incomeLimit) return Math.min(tax, maxRebate);
  if (regime === 'new') return Math.max(0, tax - (income - incomeLimit));
  return 0;
}

function surchargeBand(regime: TaxRegime, income: number) {
  for (let i = SURCHARGE_BANDS.length - 1; i >= 0; i--) {
    const band = SURCHARGE_BANDS[i];
    if (income > band.above) {
      const rate = regime === 'new' ? Math.min(band.rate, NEW_REGIME_SURCHARGE_CAP) : band.rate;
      return { above: band.above, rate };
    }
  }
  return null;
}

// Finance Act, 2026, section 3(5): Tn = Rn + Sn caps tax plus surcharge above each threshold.
function taxWithSurcharge(income: number, regime: TaxRegime, age: AgeCategory): RawTax {
  const bands = regime === 'new' ? NEW_REGIME_BANDS : OLD_REGIME_BANDS[age];
  const taxOnIncome = slabTax(income, bands);
  const rebate = rebateFor(regime, income, taxOnIncome);
  const taxAfterRebate = taxOnIncome - rebate;
  const band = surchargeBand(regime, income);
  if (!band) return { taxOnIncome, rebate, taxAfterRebate, surcharge: 0 };

  const atThreshold = taxWithSurcharge(band.above, regime, age);
  const ceiling = atThreshold.taxAfterRebate + atThreshold.surcharge + (income - band.above);
  const surcharge = Math.max(
    0,
    Math.min((taxAfterRebate * band.rate) / 100, ceiling - taxAfterRebate)
  );
  return { taxOnIncome, rebate, taxAfterRebate, surcharge };
}

/** Income-tax for a resident individual in tax year 2026-27, on normal-rate income only. */
export function computeIncomeTax(
  totalIncome: number,
  regime: TaxRegime,
  age: AgeCategory
): IncomeTaxBreakdown {
  const raw = taxWithSurcharge(Math.max(0, totalIncome), regime, age);
  const taxOnIncome = Math.round(raw.taxOnIncome);
  const taxAfterRebate = Math.round(raw.taxAfterRebate);
  const surcharge = Math.round(raw.surcharge);
  const cess = Math.round(((taxAfterRebate + surcharge) * CESS_RATE) / 100);
  return {
    taxOnIncome,
    rebate: taxOnIncome - taxAfterRebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax: taxAfterRebate + surcharge + cess,
  };
}
