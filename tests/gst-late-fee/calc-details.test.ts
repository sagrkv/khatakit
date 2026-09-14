import { describe, expect, it } from 'vitest';
import { calculateGstPenalty } from '../../src/tools/gst-late-fee/calc';
import type { GstInput } from '../../src/tools/gst-late-fee/types';

const base: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '2026-05-20',
  filingDate: '2026-06-19',
  taxLiability: 100000,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
  stateTurnover: 0,
};

const run = (input: Partial<GstInput>) => calculateGstPenalty({ ...base, ...input })!;

describe('late fee workings', () => {
  it('shows the fee per head, before and after the cap', () => {
    const result = run({});
    expect(result.lateFeePerDayPerHead).toBe(25);
    expect(result.rawLateFeePerHead).toBe(750);
    expect(result.capPerHead).toBe(1000);
    expect(result.capBasis).toBe('turnover');
    expect(result.capReached).toBe(false);
  });

  it('marks a nil return capped at Rs 250 per head', () => {
    const result = run({ isNilReturn: true, dueDate: '2026-01-20', filingDate: '2026-04-20' });
    expect(result.daysLate).toBe(90);
    expect(result.rawLateFeePerHead).toBe(900);
    expect(result.capPerHead).toBe(250);
    expect(result.capBasis).toBe('nil');
    expect(result.capReached).toBe(true);
    expect(result.cappedLateFee).toBe(500);
  });

  it('uses the section 47(1) cap above Rs 5 crore', () => {
    const result = run({ turnoverSlab: 'above_5cr' });
    expect(result.capBasis).toBe('section47');
    expect(result.capPerHead).toBe(5000);
  });

  it('uses the State turnover cap for GSTR-9', () => {
    const result = run({
      returnType: 'GSTR-9',
      dueDate: '2025-12-31',
      filingDate: '2026-03-01',
      turnoverSlab: 'upto_5cr',
      stateTurnover: 4000000,
    });
    expect(result.capBasis).toBe('stateTurnover');
    expect(result.capPerHead).toBe(800);
    expect(result.capReached).toBe(true);
  });
});

describe('interest workings', () => {
  it('records the dates, days and unrounded interest', () => {
    const result = run({});
    expect(result.cashTax).toBe(100000);
    expect(result.interestRate).toBe(18);
    expect(result.interestFrom).toBe('2026-05-21');
    expect(result.interestTo).toBe('2026-06-19');
    expect(result.interestDays).toBe(30);
    expect(result.interestExact).toBe(1479.45);
    expect(result.interest).toBe(1479);
  });

  it('counts the leap day and still divides by 365', () => {
    const result = run({ dueDate: '2028-02-20', filingDate: '2028-03-20' });
    expect(result.interestDays).toBe(29);
    expect(result.interest).toBe(1430);
  });

  it('has no interest days when no interest applies', () => {
    const result = run({ returnType: 'GSTR-1' });
    expect(result.cashTax).toBe(0);
    expect(result.interestDays).toBe(0);
  });
});

describe('filing on or before the due date', () => {
  it('tells filing on the due date apart from filing early', () => {
    const onTime = run({ filingDate: '2026-05-20' });
    expect(onTime.filedOnDueDate).toBe(true);
    expect(onTime.totalPenalty).toBe(0);
    expect(onTime.interestDays).toBe(0);
    const early = run({ filingDate: '2026-05-10' });
    expect(early.filedOnDueDate).toBe(false);
    expect(early.daysLate).toBe(0);
  });

  it('gives the last date to file, three years from the due date', () => {
    expect(run({}).lastFilingDate).toBe('2029-05-20');
  });
});
