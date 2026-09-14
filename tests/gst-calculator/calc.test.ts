import { describe, expect, it } from 'vitest';
import { calculateBill } from '../../src/tools/gst-calculator/calc';
import type { BillInput, BillLineInput, PriceType, SupplyType } from '../../src/tools/gst-calculator/types';

let nextId = 1;
function line(amountPaise: number, ratePercent: number, priceType: PriceType = 'exclusive'): BillLineInput {
  return {
    id: nextId++,
    description: '',
    amountPaise,
    priceType,
    rateMilli: Math.round(ratePercent * 1000),
  };
}
function bill(supplyType: SupplyType, lines: BillLineInput[], roundToRupee = false): BillInput {
  return { supplyType, roundToRupee, lines };
}

describe('G1: 12,345.67 exclusive at 18%', () => {
  it('splits CGST and SGST within the state', () => {
    const result = calculateBill(bill('intra', [line(1234567, 18)]));
    expect(result.lines[0]).toMatchObject({
      taxablePaise: 1234567,
      cgstPaise: 111111,
      sgstPaise: 111111,
      igstPaise: 0,
      roundOffPaise: 0,
      totalPaise: 1456789,
    });
    expect(result.totalPaise).toBe(1456789);
  });

  it('charges IGST between states', () => {
    const result = calculateBill(bill('inter', [line(1234567, 18)]));
    expect(result.lines[0]).toMatchObject({ igstPaise: 222222, cgstPaise: 0, sgstPaise: 0 });
    expect(result.totalPaise).toBe(1456789);
  });
});

describe('G2: 999 inclusive at 5%', () => {
  it('finds the taxable value whose heads add back to the price within the state', () => {
    const result = calculateBill(bill('intra', [line(99900, 5, 'inclusive')]));
    expect(result.lines[0]).toMatchObject({
      taxablePaise: 95142,
      cgstPaise: 2379,
      sgstPaise: 2379,
      roundOffPaise: 0,
      totalPaise: 99900,
    });
  });

  it('uses a different taxable value between states', () => {
    const result = calculateBill(bill('inter', [line(99900, 5, 'inclusive')]));
    expect(result.lines[0]).toMatchObject({
      taxablePaise: 95143,
      igstPaise: 4757,
      roundOffPaise: 0,
      totalPaise: 99900,
    });
  });
});

describe('G3: one bill at 5%, 18% and 40%', () => {
  const lines = () => [line(123450, 5), line(259999, 18), line(84525, 40)];

  it('gives heads per rate and bill totals', () => {
    const result = calculateBill(bill('intra', lines()));
    expect(result.byRate.map((r) => [r.rateMilli, r.cgstPaise, r.sgstPaise])).toEqual([
      [5000, 3086, 3086],
      [18000, 23400, 23400],
      [40000, 16905, 16905],
    ]);
    expect(result).toMatchObject({
      taxablePaise: 467974,
      cgstPaise: 43391,
      sgstPaise: 43391,
      taxPaise: 86782,
      subtotalPaise: 554756,
      rupeeRoundOffPaise: 0,
      totalPaise: 554756,
    });
  });

  it('rounds the bill to the nearest rupee with a +0.44 round-off', () => {
    const result = calculateBill(bill('intra', lines(), true));
    expect(result.rupeeRoundOffPaise).toBe(44);
    expect(result.roundOffPaise).toBe(44);
    expect(result.totalPaise).toBe(554800);
  });
});

describe('G4: 100.10 inclusive at 18%, no exact paise answer', () => {
  it('keeps the largest taxable value that does not exceed the price and shows the round-off', () => {
    const result = calculateBill(bill('intra', [line(10010, 18, 'inclusive')]));
    expect(result.lines[0]).toMatchObject({
      taxablePaise: 8483,
      cgstPaise: 763,
      sgstPaise: 763,
      roundOffPaise: 1,
      totalPaise: 10010,
    });
    expect(result).toMatchObject({ lineRoundOffPaise: 1, roundOffPaise: 1, totalPaise: 10010 });
  });
});

describe('edge cases', () => {
  it('charges nothing on a 0% line, inclusive or exclusive', () => {
    const result = calculateBill(bill('intra', [line(50000, 0), line(25050, 0, 'inclusive')]));
    expect(result.taxPaise).toBe(0);
    expect(result.taxablePaise).toBe(75050);
    expect(result.totalPaise).toBe(75050);
    expect(result.effectiveRatePercent).toBe(0);
  });

  it('lets a head round to 0.00 on a very small amount', () => {
    const result = calculateBill(bill('intra', [line(5, 5)]));
    expect(result.lines[0]).toMatchObject({ cgstPaise: 0, sgstPaise: 0, totalPaise: 5 });
  });

  it('rounds half a paisa up, so intra-state and inter-state tax can differ by a paisa', () => {
    expect(calculateBill(bill('intra', [line(20, 5)])).taxPaise).toBe(2);
    expect(calculateBill(bill('inter', [line(20, 5)])).taxPaise).toBe(1);
  });

  it('rounds the bill down when the paise are under 50', () => {
    const result = calculateBill(bill('intra', [line(10030, 0)], true));
    expect(result.rupeeRoundOffPaise).toBe(-30);
    expect(result.totalPaise).toBe(10000);
  });

  it('rounds 50 paise up to the next rupee', () => {
    const result = calculateBill(bill('intra', [line(10050, 0)], true));
    expect(result.rupeeRoundOffPaise).toBe(50);
    expect(result.totalPaise).toBe(10100);
  });

  it('supports special rates such as 3% and 0.25%', () => {
    const gold = calculateBill(bill('intra', [line(10000000, 3)]));
    expect(gold.lines[0]).toMatchObject({ cgstPaise: 150000, sgstPaise: 150000 });
    const stones = calculateBill(bill('inter', [line(10000000, 0.25)]));
    expect(stones.lines[0].igstPaise).toBe(25000);
  });

  it('handles an inclusive amount of zero', () => {
    const result = calculateBill(bill('intra', [line(0, 18, 'inclusive')]));
    expect(result.lines[0]).toMatchObject({ taxablePaise: 0, taxPaise: 0, totalPaise: 0 });
    expect(result.effectiveRatePercent).toBeNull();
  });

  it('computes large amounts exactly', () => {
    const result = calculateBill(bill('intra', [line(100000000000, 18)]));
    expect(result.lines[0].cgstPaise).toBe(9000000000);
    expect(result.totalPaise).toBe(118000000000);
  });

  it('groups lines with the same rate and orders the summary by rate', () => {
    const result = calculateBill(bill('intra', [line(10000, 18), line(5000, 5), line(20000, 18, 'inclusive')]));
    expect(result.byRate.map((r) => r.rateMilli)).toEqual([5000, 18000]);
    expect(result.byRate[1].taxablePaise).toBe(10000 + result.lines[2].taxablePaise);
  });

  it('reports the effective tax rate on the bill', () => {
    const result = calculateBill(bill('intra', [line(10000, 18), line(10000, 5)]));
    expect(result.effectiveRatePercent).toBeCloseTo(11.5, 10);
  });

  it('does not change the input', () => {
    const input = bill('intra', [line(99900, 5, 'inclusive')], true);
    const copy = structuredClone(input);
    calculateBill(input);
    expect(input).toEqual(copy);
  });
});

describe('every figure adds up', () => {
  it('holds across many mixed bills', () => {
    const rates = [0, 0.25, 1.5, 3, 5, 18, 40, 12.5];
    let seed = 7;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return seed;
    };
    for (let run = 0; run < 400; run++) {
      const lines = Array.from({ length: 1 + (random() % 5) }, () =>
        line(random() % 2000000, rates[random() % rates.length], random() % 2 ? 'inclusive' : 'exclusive')
      );
      const supply: SupplyType = random() % 2 ? 'intra' : 'inter';
      const roundToRupee = random() % 2 === 0;
      const result = calculateBill(bill(supply, lines, roundToRupee));
      const sum = (pick: (l: (typeof result.lines)[number]) => number) =>
        result.lines.reduce((total, l) => total + pick(l), 0);

      for (const l of result.lines) {
        expect(l.taxablePaise + l.cgstPaise + l.sgstPaise + l.igstPaise + l.roundOffPaise).toBe(l.totalPaise);
        expect(l.taxPaise).toBe(l.cgstPaise + l.sgstPaise + l.igstPaise);
        if (supply === 'intra') {
          expect(l.cgstPaise).toBe(l.sgstPaise);
          expect(l.igstPaise).toBe(0);
        } else {
          expect(l.cgstPaise + l.sgstPaise).toBe(0);
        }
        if (l.priceType === 'inclusive') {
          expect(l.totalPaise).toBe(l.amountPaise);
          expect(l.roundOffPaise).toBeGreaterThanOrEqual(0);
          expect(l.roundOffPaise).toBeLessThanOrEqual(2);
        } else {
          expect(l.taxablePaise).toBe(l.amountPaise);
          expect(l.roundOffPaise).toBe(0);
        }
      }
      expect(result.taxablePaise).toBe(sum((l) => l.taxablePaise));
      expect(result.cgstPaise).toBe(sum((l) => l.cgstPaise));
      expect(result.sgstPaise).toBe(sum((l) => l.sgstPaise));
      expect(result.igstPaise).toBe(sum((l) => l.igstPaise));
      expect(result.lineRoundOffPaise).toBe(sum((l) => l.roundOffPaise));
      expect(result.subtotalPaise).toBe(sum((l) => l.totalPaise));
      expect(result.byRate.reduce((t, r) => t + r.totalPaise, 0)).toBe(result.subtotalPaise);
      expect(result.taxablePaise + result.taxPaise + result.roundOffPaise).toBe(result.totalPaise);
      expect(result.subtotalPaise + result.rupeeRoundOffPaise).toBe(result.totalPaise);
      if (roundToRupee) {
        expect(result.totalPaise % 100).toBe(0);
        expect(result.rupeeRoundOffPaise).toBeGreaterThanOrEqual(-49);
        expect(result.rupeeRoundOffPaise).toBeLessThanOrEqual(50);
      } else {
        expect(result.rupeeRoundOffPaise).toBe(0);
      }
    }
  });
});
