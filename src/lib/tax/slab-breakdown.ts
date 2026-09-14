import { NEW_REGIME_BANDS, OLD_REGIME_BANDS, REBATE } from '../constants/tax-slabs';
import { formatCurrency } from '../utils/format';
import type { AgeCategory, IncomeTaxBreakdown, TaxRegime } from './types';

export interface SlabRow {
  /** Income above this amount falls in the slab. */
  from: number;
  /** Upper end of the income taxed in this slab. */
  to: number;
  rate: number;
  /** Unrounded tax on the income in this slab. */
  tax: number;
}

/** Slab-by-slab tax on total income, before rebate, surcharge and cess. */
export function slabBreakdown(income: number, regime: TaxRegime, age: AgeCategory): SlabRow[] {
  const bands = regime === 'new' ? NEW_REGIME_BANDS : OLD_REGIME_BANDS[age];
  const total = Math.max(0, income);
  const rows: SlabRow[] = [];
  let lower = 0;
  for (const band of bands) {
    if (total <= lower) break;
    const to = Math.min(total, band.upTo);
    rows.push({ from: lower, to, rate: band.rate, tax: ((to - lower) * band.rate) / 100 });
    lower = band.upTo;
  }
  return rows;
}

export type WorkingRow = Record<'item' | 'amount', string>;

/** Visible workings from taxable income to cess, for a breakdown table. */
export function incomeTaxRows(
  taxableIncome: number,
  regime: TaxRegime,
  age: AgeCategory,
  tax: IncomeTaxBreakdown
): WorkingRow[] {
  const slabs = slabBreakdown(taxableIncome, regime, age).map((row) => ({
    item: `${row.rate === 0 ? 'Nil' : `${row.rate}%`} on ${formatCurrency(row.from)} to ${formatCurrency(row.to)}`,
    amount: formatCurrency(row.tax),
  }));
  const marginalRelief = regime === 'new' && taxableIncome > REBATE.new.incomeLimit;
  return [
    ...slabs,
    { item: 'Tax on Income', amount: formatCurrency(tax.taxOnIncome) },
    ...(tax.rebate > 0
      ? [
          {
            item: marginalRelief
              ? 'Less: Marginal Relief (section 156(2)(b))'
              : 'Less: Rebate (section 156)',
            amount: formatCurrency(-tax.rebate),
          },
        ]
      : []),
    ...(tax.surcharge > 0 ? [{ item: 'Surcharge', amount: formatCurrency(tax.surcharge) }] : []),
    { item: 'Health & Education Cess (4%)', amount: formatCurrency(tax.cess) },
  ];
}
