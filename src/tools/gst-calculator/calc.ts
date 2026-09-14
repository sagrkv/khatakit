import type {
  BillInput,
  BillLineInput,
  BillResult,
  LineResult,
  RateSummary,
  SupplyType,
  TaxHeads,
} from './types';

/**
 * GST on a bill, in integer paise.
 *
 * Method used by Khatakit (a stated method, not a legal requirement):
 * - Each tax head (CGST, SGST or IGST) is taxable value x head rate, rounded
 *   to the paisa, half a paisa upwards. Tax is worked out per line.
 * - For an inclusive price, the taxable value is the largest paise amount
 *   whose taxable value plus rounded heads does not exceed the price. Any
 *   paise left over are shown as the line's round-off.
 * - Optionally the bill is rounded to the nearest rupee, 50 paise upwards,
 *   as CGST Act section 170 does for amounts payable.
 */

/** rateMilli is thousandths of a percent, so the fraction is rateMilli / 100000. */
export const RATE_SCALE = 100000n;

/** n / d rounded to the nearest integer, halves upwards. n and d must not be negative. */
export function roundHalfUp(n: bigint, d: bigint): bigint {
  return (2n * n + d) / (2n * d);
}

function headsFor(taxablePaise: number, rateMilli: number, supplyType: SupplyType) {
  const product = BigInt(taxablePaise) * BigInt(rateMilli);
  if (supplyType === 'inter') {
    return { cgstPaise: 0, sgstPaise: 0, igstPaise: Number(roundHalfUp(product, RATE_SCALE)) };
  }
  const head = Number(roundHalfUp(product, 2n * RATE_SCALE));
  return { cgstPaise: head, sgstPaise: head, igstPaise: 0 };
}

function grossFor(taxablePaise: number, rateMilli: number, supplyType: SupplyType): number {
  const heads = headsFor(taxablePaise, rateMilli, supplyType);
  return taxablePaise + heads.cgstPaise + heads.sgstPaise + heads.igstPaise;
}

/**
 * Largest taxable value whose gross does not exceed the price. Head rounding
 * moves the gross by at most one paisa from taxable x (1 + rate), so the answer
 * lies within two paise of price / (1 + rate).
 */
function taxableFromInclusive(pricePaise: number, rateMilli: number, supplyType: SupplyType): number {
  const guess = Number(
    roundHalfUp(BigInt(pricePaise) * RATE_SCALE, RATE_SCALE + BigInt(rateMilli))
  );
  for (let taxable = guess + 2; taxable > 0; taxable--) {
    if (grossFor(taxable, rateMilli, supplyType) <= pricePaise) return taxable;
  }
  return 0;
}

function calculateLine(line: BillLineInput, supplyType: SupplyType): LineResult {
  const taxablePaise =
    line.priceType === 'inclusive'
      ? taxableFromInclusive(line.amountPaise, line.rateMilli, supplyType)
      : line.amountPaise;
  const heads = headsFor(taxablePaise, line.rateMilli, supplyType);
  const taxPaise = heads.cgstPaise + heads.sgstPaise + heads.igstPaise;
  const grossPaise = taxablePaise + taxPaise;
  const roundOffPaise = line.priceType === 'inclusive' ? line.amountPaise - grossPaise : 0;
  return {
    id: line.id,
    description: line.description,
    priceType: line.priceType,
    rateMilli: line.rateMilli,
    amountPaise: line.amountPaise,
    taxablePaise,
    ...heads,
    taxPaise,
    roundOffPaise,
    totalPaise: grossPaise + roundOffPaise,
  };
}

const EMPTY_HEADS: TaxHeads = {
  taxablePaise: 0,
  cgstPaise: 0,
  sgstPaise: 0,
  igstPaise: 0,
  taxPaise: 0,
  roundOffPaise: 0,
  totalPaise: 0,
};

function addHeads<T extends TaxHeads>(sum: T, line: TaxHeads): T {
  return {
    ...sum,
    taxablePaise: sum.taxablePaise + line.taxablePaise,
    cgstPaise: sum.cgstPaise + line.cgstPaise,
    sgstPaise: sum.sgstPaise + line.sgstPaise,
    igstPaise: sum.igstPaise + line.igstPaise,
    taxPaise: sum.taxPaise + line.taxPaise,
    roundOffPaise: sum.roundOffPaise + line.roundOffPaise,
    totalPaise: sum.totalPaise + line.totalPaise,
  };
}

function summariseByRate(lines: LineResult[]): RateSummary[] {
  const rates = [...new Set(lines.map((line) => line.rateMilli))].sort((a, b) => a - b);
  return rates.map((rateMilli) =>
    lines
      .filter((line) => line.rateMilli === rateMilli)
      .reduce<RateSummary>(addHeads, { ...EMPTY_HEADS, rateMilli })
  );
}

/** Nearest rupee, 50 paise or more rounding up (CGST Act section 170). */
function roundToNearestRupee(paise: number): number {
  return Math.floor((paise + 50) / 100) * 100;
}

export function calculateBill(input: BillInput): BillResult {
  const lines = input.lines.map((line) => calculateLine(line, input.supplyType));
  const totals = lines.reduce<TaxHeads>(addHeads, EMPTY_HEADS);
  const subtotalPaise = totals.totalPaise;
  const totalPaise = input.roundToRupee ? roundToNearestRupee(subtotalPaise) : subtotalPaise;
  const rupeeRoundOffPaise = totalPaise - subtotalPaise;

  return {
    ...totals,
    supplyType: input.supplyType,
    lines,
    byRate: summariseByRate(lines),
    lineRoundOffPaise: totals.roundOffPaise,
    subtotalPaise,
    rupeeRoundOffPaise,
    roundOffPaise: totals.roundOffPaise + rupeeRoundOffPaise,
    totalPaise,
    effectiveRatePercent:
      totals.taxablePaise === 0 ? null : (totals.taxPaise / totals.taxablePaise) * 100,
  };
}
