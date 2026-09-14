import { PRESUMPTIVE_BUSINESS, PRESUMPTIVE_PROFESSION } from '../../lib/constants/presumptive';
import { TAX_YEAR_LABEL } from '../../lib/constants/tax-slabs';
import { incomeTaxLines } from '../../lib/tax/slab-breakdown';
import type { TaxRegime } from '../../lib/tax/types';
import { toCsv } from '../../lib/utils/csv';
import { formatCurrency, formatPercent } from '../../lib/utils/format';
import type { PresumptiveResult } from './types';

export interface ComputationLine {
  item: string;
  /** A number in rupees, or a short status such as "Within limit". */
  amount: number | string;
}

const schemeName = (result: PresumptiveResult) =>
  result.scheme === '44AD' ? 'business (old 44AD)' : 'profession (old 44ADA)';

const regimeName = (regime: TaxRegime) =>
  regime === 'new' ? 'New regime' : 'Old regime, below-60 slabs';

/** The computation from receipts to cess, shared by the table, the copy text and the CSV. */
export function presumptiveLines(result: PresumptiveResult, regime: TaxRegime): ComputationLine[] {
  const business = result.scheme === '44AD';
  const incomeLines: ComputationLine[] = business
    ? [
        {
          item: `${PRESUMPTIVE_BUSINESS.cashRate}% of cash and other receipts (${formatCurrency(result.cashReceipts)})`,
          amount: result.cashIncome,
        },
        {
          item: `${PRESUMPTIVE_BUSINESS.digitalRate}% of bank and online receipts (${formatCurrency(result.digitalReceipts)})`,
          amount: result.digitalIncome,
        },
      ]
    : [{ item: `${PRESUMPTIVE_PROFESSION.rate}% of gross receipts`, amount: result.presumptiveIncome }];

  return [
    { item: business ? 'Gross turnover' : 'Gross receipts', amount: result.grossReceipts },
    {
      item: `Cash is ${formatPercent(result.cashSharePercent)} of receipts, so the limit is ${formatCurrency(result.applicableLimit)}`,
      amount: result.isWithinLimit ? 'Within limit' : 'Above limit',
    },
    ...incomeLines,
    { item: 'Presumptive income (taxable)', amount: result.presumptiveIncome },
    ...incomeTaxLines(result.taxableIncome, regime, 'below60', {
      ...result,
      taxAfterRebate: result.taxLiability,
    }),
  ];
}

export function presumptiveCsv(result: PresumptiveResult, regime: TaxRegime): string {
  return toCsv([
    ['Presumptive tax', TAX_YEAR_LABEL],
    ['Scheme', `Section 58(2), ${schemeName(result)}`],
    ['Regime', regimeName(regime)],
    [],
    ['Particulars', 'Amount'],
    ...presumptiveLines(result, regime).map((line) => [line.item, line.amount]),
    ['Total tax payable', result.totalTax],
    ['Effective tax rate on gross receipts (%)', result.effectiveRate],
  ]);
}

export function presumptiveFilename(result: PresumptiveResult, regime: TaxRegime): string {
  return `presumptive-tax-2026-27-${result.scheme.toLowerCase()}-${regime}-regime.csv`;
}

export function presumptiveText(result: PresumptiveResult, regime: TaxRegime): string {
  return [
    `Scheme: section 58(2), ${schemeName(result)}`,
    `Regime: ${regimeName(regime)}`,
    `Gross receipts: ${formatCurrency(result.grossReceipts)}`,
    `Cash receipts: ${formatCurrency(result.cashReceipts)} (${formatPercent(result.cashSharePercent)})`,
    `Limit: ${formatCurrency(result.applicableLimit)} (${result.isWithinLimit ? 'within' : 'above'})`,
    `Presumptive income: ${formatCurrency(result.presumptiveIncome)}`,
    `Total tax: ${formatCurrency(result.totalTax)}`,
    `Effective rate on receipts: ${formatPercent(result.effectiveRate)}`,
  ].join('\n');
}
