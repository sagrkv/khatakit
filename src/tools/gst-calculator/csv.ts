import {
  formatHeadRate,
  formatRate,
  formatRupees,
  formatSignedPaise,
  plainPaise,
  PRICE_TYPE_LABELS,
  PRICE_TYPE_PHRASES,
  SUPPLY_LABELS,
} from './format';
import type { BillResult, TaxHeads } from './types';

type Cell = string;

/** Quotes a CSV field when needed. */
function escapeCell(value: Cell): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Stops spreadsheet apps treating typed text as a formula. */
function safeText(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function headColumns(result: BillResult): { label: string; pick: (heads: TaxHeads) => number }[] {
  return result.supplyType === 'intra'
    ? [
        { label: 'CGST', pick: (heads) => heads.cgstPaise },
        { label: 'SGST/UTGST', pick: (heads) => heads.sgstPaise },
      ]
    : [{ label: 'IGST', pick: (heads) => heads.igstPaise }];
}

export function billToCsv(result: BillResult): string {
  const heads = headColumns(result);
  const rows: Cell[][] = [
    ['Supply type', SUPPLY_LABELS[result.supplyType]],
    [],
    [
      'Line',
      'Description',
      'Amount entered',
      'Price',
      'Rate',
      'Taxable value',
      ...heads.map((head) => head.label),
      'Round-off',
      'Line total',
    ],
    ...result.lines.map((line, index) => [
      String(index + 1),
      safeText(line.description),
      plainPaise(line.amountPaise),
      PRICE_TYPE_LABELS[line.priceType],
      formatRate(line.rateMilli),
      plainPaise(line.taxablePaise),
      ...heads.map((head) => plainPaise(head.pick(line))),
      plainPaise(line.roundOffPaise),
      plainPaise(line.totalPaise),
    ]),
    [],
    ['Rate', 'Taxable value', ...heads.map((head) => head.label), 'Total tax', 'Round-off', 'Total'],
    ...result.byRate.map((rate) => [
      formatRate(rate.rateMilli),
      plainPaise(rate.taxablePaise),
      ...heads.map((head) => plainPaise(head.pick(rate))),
      plainPaise(rate.taxPaise),
      plainPaise(rate.roundOffPaise),
      plainPaise(rate.totalPaise),
    ]),
    [],
    ['Bill totals'],
    ['Taxable value', plainPaise(result.taxablePaise)],
    ...heads.map((head) => [head.label, plainPaise(head.pick(result))]),
    ['Total tax', plainPaise(result.taxPaise)],
    ['Round-off on GST-included lines', plainPaise(result.lineRoundOffPaise)],
    ['Round-off to nearest rupee', plainPaise(result.rupeeRoundOffPaise)],
    ['Bill total', plainPaise(result.totalPaise)],
  ];
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';
}

/** Plain-text summary for the clipboard. */
export function billToText(result: BillResult): string {
  const intra = result.supplyType === 'intra';
  const headText = (heads: TaxHeads, rateMilli?: number) =>
    intra
      ? `CGST ${formatRupees(heads.cgstPaise)}${rateMilli === undefined ? '' : ` (${formatHeadRate(rateMilli)})`}, SGST ${formatRupees(heads.sgstPaise)}`
      : `IGST ${formatRupees(heads.igstPaise)}`;

  return [
    `GST bill - ${SUPPLY_LABELS[result.supplyType]}`,
    ...result.lines.map((line, index) => {
      const name = line.description ? ` ${line.description}` : '';
      const roundOff = line.roundOffPaise ? `, round-off ${formatSignedPaise(line.roundOffPaise)}` : '';
      return `Line ${index + 1}${name}: ${formatRupees(line.amountPaise)} ${PRICE_TYPE_PHRASES[line.priceType]} at ${formatRate(line.rateMilli)}. Taxable ${formatRupees(line.taxablePaise)}, ${headText(line, line.rateMilli)}${roundOff}, total ${formatRupees(line.totalPaise)}`;
    }),
    ...result.byRate.map(
      (rate) => `At ${formatRate(rate.rateMilli)}: taxable ${formatRupees(rate.taxablePaise)}, ${headText(rate)}`
    ),
    `Taxable value: ${formatRupees(result.taxablePaise)}`,
    `${headText(result)}`,
    `Total tax: ${formatRupees(result.taxPaise)}`,
    `Round-off: ${formatSignedPaise(result.roundOffPaise)}`,
    `Bill total: ${formatRupees(result.totalPaise)}`,
  ].join('\n');
}
