import { formatIndianNumber } from '../../lib/utils/format';
import { RATE_SCALE, roundHalfUp } from './calc';
import { formatHeadRate, formatPaise, formatRate, formatSignedPaise } from './format';
import type { BillResult, LineResult, SupplyType } from './types';

/** Exact n / 10^scale in rupees, trailing zeros trimmed but at least two decimals. */
function decimal(n: bigint, scale: number): string {
  const digits = n.toString().padStart(scale + 1, '0');
  const whole = digits.slice(0, -scale);
  const fraction = digits.slice(-scale).replace(/0+$/, '').padEnd(2, '0');
  return `${formatIndianNumber(Number(whole))}.${fraction}`;
}

/** Unrounded head in rupees: taxable paise x rate, as an exact decimal. */
function exactHead(taxablePaise: number, rateMilli: number, supplyType: SupplyType): string {
  const product = BigInt(taxablePaise) * BigInt(rateMilli);
  // paise / 100 x rateMilli / 100000, halved for CGST/SGST: product / 2e7 = product x 5 / 1e8.
  return supplyType === 'inter' ? decimal(product, 7) : decimal(product * 5n, 8);
}

function inclusiveStep(line: LineResult): string {
  const amount = formatPaise(line.amountPaise);
  if (line.rateMilli === 0) return `At 0% the taxable value is the amount itself: ${amount}.`;
  const numerator = BigInt(line.amountPaise) * 100n * RATE_SCALE;
  const denominator = RATE_SCALE + BigInt(line.rateMilli);
  const exact = numerator % denominator === 0n;
  const quotient = decimal(roundHalfUp(numerator, denominator), 4);
  return `Taxable value = ${amount} ÷ (1 + ${formatRate(line.rateMilli)}) ${exact ? '=' : '≈'} ${quotient}. The largest paise amount whose taxable value and tax fit within ${amount} is ${formatPaise(line.taxablePaise)}.`;
}

function headStep(line: LineResult, supplyType: SupplyType): string {
  const taxable = formatPaise(line.taxablePaise);
  if (supplyType === 'inter') {
    return `IGST = ${taxable} × ${formatRate(line.rateMilli)} = ${exactHead(line.taxablePaise, line.rateMilli, 'inter')}, rounded to ${formatPaise(line.igstPaise)}.`;
  }
  return `CGST = ${taxable} × ${formatHeadRate(line.rateMilli)} = ${exactHead(line.taxablePaise, line.rateMilli, 'intra')}, rounded to ${formatPaise(line.cgstPaise)}. SGST is the same: ${formatPaise(line.sgstPaise)}.`;
}

function totalStep(line: LineResult, supplyType: SupplyType): string {
  const heads =
    supplyType === 'inter' ? [line.igstPaise] : [line.cgstPaise, line.sgstPaise];
  const sum = [line.taxablePaise, ...heads].map(formatPaise).join(' + ');
  const gross = line.taxablePaise + line.taxPaise;
  if (line.roundOffPaise === 0) return `Line total = ${sum} = ${formatPaise(line.totalPaise)}.`;
  return `${sum} = ${formatPaise(gross)}. No paise taxable value adds up to exactly ${formatPaise(line.amountPaise)}, so a round-off of ${formatSignedPaise(line.roundOffPaise)} makes the line total ${formatPaise(line.totalPaise)}.`;
}

/** Plain-language steps for one line. */
export function lineWorkings(line: LineResult, supplyType: SupplyType): string[] {
  return [
    ...(line.priceType === 'inclusive' ? [inclusiveStep(line)] : []),
    headStep(line, supplyType),
    totalStep(line, supplyType),
  ];
}

/** The rupee rounding step, when the bill is rounded. */
export function billRoundingStep(result: BillResult, roundToRupee: boolean): string | null {
  if (!roundToRupee) return null;
  return `Bill total ${formatPaise(result.subtotalPaise)} rounded to the nearest rupee (50 paise or more rounds up) = ${formatPaise(result.totalPaise)}, a round-off of ${formatSignedPaise(result.rupeeRoundOffPaise)}.`;
}
