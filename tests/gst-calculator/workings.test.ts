import { describe, expect, it } from 'vitest';
import { calculateBill } from '../../src/tools/gst-calculator/calc';
import { billRoundingStep, lineWorkings } from '../../src/tools/gst-calculator/workings';
import type { PriceType, SupplyType } from '../../src/tools/gst-calculator/types';

function single(amountPaise: number, ratePercent: number, priceType: PriceType, supplyType: SupplyType) {
  return calculateBill({
    supplyType,
    roundToRupee: false,
    lines: [{ id: 1, description: '', amountPaise, priceType, rateMilli: ratePercent * 1000 }],
  });
}

describe('workings', () => {
  it('shows the unrounded head and the rounding for an exclusive line', () => {
    const result = single(1234567, 18, 'exclusive', 'intra');
    expect(lineWorkings(result.lines[0], 'intra')).toEqual([
      'CGST = 12,345.67 × 9% = 1,111.1103, rounded to 1,111.11. SGST is the same: 1,111.11.',
      'Line total = 12,345.67 + 1,111.11 + 1,111.11 = 14,567.89.',
    ]);
  });

  it('shows IGST between states', () => {
    const result = single(1234567, 18, 'exclusive', 'inter');
    expect(lineWorkings(result.lines[0], 'inter')[0]).toBe(
      'IGST = 12,345.67 × 18% = 2,222.2206, rounded to 2,222.22.'
    );
  });

  it('works an inclusive price back to the taxable value', () => {
    const result = single(99900, 5, 'inclusive', 'intra');
    const steps = lineWorkings(result.lines[0], 'intra');
    expect(steps[0]).toBe(
      'Taxable value = 999.00 ÷ (1 + 5%) ≈ 951.4286. The largest paise amount whose taxable value and tax fit within 999.00 is 951.42.'
    );
    expect(steps[1]).toBe('CGST = 951.42 × 2.5% = 23.7855, rounded to 23.79. SGST is the same: 23.79.');
    expect(steps[2]).toBe('Line total = 951.42 + 23.79 + 23.79 = 999.00.');
  });

  it('explains the round-off when no paise taxable value is exact', () => {
    const result = single(10010, 18, 'inclusive', 'intra');
    expect(lineWorkings(result.lines[0], 'intra')[2]).toBe(
      '84.83 + 7.63 + 7.63 = 100.09. No paise taxable value adds up to exactly 100.10, so a round-off of +0.01 makes the line total 100.10.'
    );
  });

  it('describes rupee rounding only when chosen', () => {
    const result = calculateBill({
      supplyType: 'intra',
      roundToRupee: true,
      lines: [
        { id: 1, description: '', amountPaise: 123450, priceType: 'exclusive', rateMilli: 5000 },
        { id: 2, description: '', amountPaise: 259999, priceType: 'exclusive', rateMilli: 18000 },
        { id: 3, description: '', amountPaise: 84525, priceType: 'exclusive', rateMilli: 40000 },
      ],
    });
    expect(billRoundingStep(result, true)).toBe(
      'Bill total 5,547.56 rounded to the nearest rupee (50 paise or more rounds up) = 5,548.00, a round-off of +0.44.'
    );
    expect(billRoundingStep(result, false)).toBeNull();
  });
});
