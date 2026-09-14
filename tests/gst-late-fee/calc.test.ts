import { describe, it, expect } from 'vitest';
import { calculateGstPenalty } from '../../src/tools/gst-late-fee/calc';
import type { GstInput } from '../../src/tools/gst-late-fee/types';

const base: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '2026-05-20',
  filingDate: '2026-06-19',
  taxLiability: 100000,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
};

const run = (input: Partial<GstInput>) => calculateGstPenalty({ ...base, ...input })!;

describe('calculateGstPenalty - days late', () => {
  it('returns zero when filed on or before the due date', () => {
    expect(run({ filingDate: '2026-05-20' }).totalPenalty).toBe(0);
    expect(run({ filingDate: '2026-05-15' }).daysLate).toBe(0);
  });

  it('counts days from the day after the due date to the filing date', () => {
    expect(run({}).daysLate).toBe(30);
  });

  it('returns null for invalid dates', () => {
    expect(calculateGstPenalty({ ...base, dueDate: '' })).toBeNull();
    expect(calculateGstPenalty({ ...base, filingDate: '2026-13-40' })).toBeNull();
  });
});

describe('calculateGstPenalty - GSTR-3B (Notifications 76/2018 and 19/2021)', () => {
  it('charges Rs 50 per day, split equally between CGST and SGST', () => {
    const result = run({ filingDate: '2026-05-30' });
    expect(result.lateFeePerDay).toBe(50);
    expect(result.cappedLateFee).toBe(500);
    expect(result.cgstLateFee).toBe(250);
    expect(result.sgstLateFee).toBe(250);
  });

  it('caps at Rs 2,000 for turnover up to Rs 1.5 crore', () => {
    const result = run({ dueDate: '2025-01-20', filingDate: '2025-04-20' });
    expect(result.rawLateFee).toBe(4500);
    expect(result.cappedLateFee).toBe(2000);
  });

  it('caps at Rs 5,000 for turnover Rs 1.5 crore to Rs 5 crore', () => {
    const result = run({ dueDate: '2025-01-20', filingDate: '2025-06-19', turnoverSlab: '1_5cr_to_5cr' });
    expect(result.cappedLateFee).toBe(5000);
  });

  it('caps at Rs 10,000 above Rs 5 crore (section 47(1))', () => {
    const result = run({ dueDate: '2025-01-20', filingDate: '2025-11-16', turnoverSlab: 'above_5cr' });
    expect(result.rawLateFee).toBe(15000);
    expect(result.cappedLateFee).toBe(10000);
  });

  it('charges Rs 20 per day capped at Rs 500 for nil returns', () => {
    expect(run({ isNilReturn: true, filingDate: '2026-05-30' }).cappedLateFee).toBe(200);
    const capped = run({ isNilReturn: true, dueDate: '2025-01-20', filingDate: '2025-04-20' });
    expect(capped.rawLateFee).toBe(1800);
    expect(capped.cappedLateFee).toBe(500);
  });

  it('charges 18% interest on tax paid in cash (section 50(1) proviso)', () => {
    const result = run({});
    expect(result.interestApplies).toBe(true);
    expect(result.interest).toBe(1479);
    expect(result.totalPenalty).toBe(1500 + 1479);
  });

  it('charges no interest on nil returns', () => {
    expect(run({ isNilReturn: true }).interest).toBe(0);
  });
});

describe('calculateGstPenalty - GSTR-1 (Notification 20/2021)', () => {
  it('uses the same fee and caps as GSTR-3B', () => {
    const result = run({ returnType: 'GSTR-1', dueDate: '2025-01-11', filingDate: '2025-04-11' });
    expect(result.cappedLateFee).toBe(2000);
  });

  it('charges no interest because no tax is paid with GSTR-1', () => {
    const result = run({ returnType: 'GSTR-1' });
    expect(result.interestApplies).toBe(false);
    expect(result.interest).toBe(0);
    expect(result.totalPenalty).toBe(1500);
  });
});

describe('calculateGstPenalty - GSTR-9 (Notification 07/2023 and section 47(2))', () => {
  const annual: Partial<GstInput> = {
    returnType: 'GSTR-9',
    dueDate: '2025-12-31',
    filingDate: '2026-03-01',
    turnoverSlab: 'upto_5cr',
    stateTurnover: 20000000,
  };

  it('charges Rs 50 per day up to Rs 5 crore turnover', () => {
    const result = run(annual);
    expect(result.daysLate).toBe(60);
    expect(result.lateFeePerDay).toBe(50);
    expect(result.cappedLateFee).toBe(3000);
    expect(result.interest).toBe(0);
  });

  it('caps at 0.04% of turnover in the State', () => {
    const result = run({ ...annual, stateTurnover: 4000000 });
    expect(result.lateFeeCapApplied).toBe(1600);
    expect(result.cappedLateFee).toBe(1600);
    expect(result.cgstLateFee).toBe(800);
  });

  it('charges Rs 100 per day for Rs 5 crore to Rs 20 crore', () => {
    const result = run({ ...annual, turnoverSlab: '5cr_to_20cr', stateTurnover: 100000000 });
    expect(result.cappedLateFee).toBe(6000);
  });

  it('charges Rs 200 per day capped at 0.5% above Rs 20 crore', () => {
    const big = run({ ...annual, turnoverSlab: 'above_20cr', stateTurnover: 250000000 });
    expect(big.cappedLateFee).toBe(12000);
    const smallState = run({ ...annual, turnoverSlab: 'above_20cr', stateTurnover: 2000000 });
    expect(smallState.cappedLateFee).toBe(10000);
  });

  it('ignores the nil return option', () => {
    expect(run({ ...annual, isNilReturn: true }).cappedLateFee).toBe(3000);
  });
});

describe('calculateGstPenalty - three-year filing bar (sections 37(5), 39(11), 44(2))', () => {
  it('flags a return filed more than three years after the due date', () => {
    const result = run({ dueDate: '2023-01-20', filingDate: '2026-01-21' });
    expect(result.isTimeBarred).toBe(true);
    expect(result.lastFilingDate).toBe('2026-01-20');
  });

  it('allows filing on the last day of the three years', () => {
    expect(run({ dueDate: '2023-01-20', filingDate: '2026-01-20' }).isTimeBarred).toBe(false);
  });
});
