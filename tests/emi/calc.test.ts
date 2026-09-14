import { describe, it, expect } from 'vitest';
import { buildMonthlySchedule, calculateEmi } from '../../src/tools/emi/calc';

describe('calculateEmi - RBI Key Facts Statement worked example', () => {
  // RBI (Commercial Banks - Responsible Business Conduct) Directions, 2025, para 348(3):
  // Rs 20,000 at 15% for 24 monthly instalments, EMI Rs 970.
  const rows = buildMonthlySchedule(20000, 15, 24);

  it('rounds the EMI to the nearest rupee and matches the RBI totals', () => {
    const result = calculateEmi({ principal: 20000, annualRate: 15, tenureMonths: 24 });
    expect(result.emi).toBe(970);
    expect(result.totalInterest).toBe(3274);
    expect(result.totalPayable).toBe(23274);
  });

  it('matches the first two rows of the RBI amortisation schedule', () => {
    expect(rows[0]).toMatchObject({ openingBalance: 20000, principal: 720, interest: 250, instalment: 970 });
    expect(rows[1]).toMatchObject({ openingBalance: 19280, principal: 729, interest: 241, instalment: 970 });
  });

  it('matches the last row of the RBI amortisation schedule and closes at zero', () => {
    expect(rows).toHaveLength(24);
    expect(rows[23]).toMatchObject({ openingBalance: 958, principal: 958, interest: 12, instalment: 970 });
    expect(rows[23].closingBalance).toBe(0);
  });
});

describe('calculateEmi', () => {
  it('returns zero for zero principal or tenure', () => {
    expect(calculateEmi({ principal: 0, annualRate: 10, tenureMonths: 12 })).toEqual({
      emi: 0,
      totalInterest: 0,
      totalPayable: 0,
      schedule: [],
    });
    expect(calculateEmi({ principal: 100000, annualRate: 10, tenureMonths: 0 }).emi).toBe(0);
  });

  it('computes Rs 8,678 for Rs 10 lakh at 8.5% over 20 years', () => {
    expect(calculateEmi({ principal: 1000000, annualRate: 8.5, tenureMonths: 240 }).emi).toBe(8678);
  });

  it('splits a zero-rate loan evenly with no interest', () => {
    const rows = buildMonthlySchedule(100000, 0, 7);
    expect(rows[0].instalment).toBe(14286);
    expect(rows[6].closingBalance).toBe(0);
    const result = calculateEmi({ principal: 100000, annualRate: 0, tenureMonths: 7 });
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(100000);
  });

  it('keeps yearly totals within rounding of the loan totals', () => {
    const result = calculateEmi({ principal: 500000, annualRate: 10, tenureMonths: 60 });
    const principal = result.schedule.reduce((sum, e) => sum + e.principalPaid, 0);
    const interest = result.schedule.reduce((sum, e) => sum + e.interestPaid, 0);
    expect(Math.abs(principal - 500000)).toBeLessThanOrEqual(result.schedule.length);
    expect(Math.abs(interest - result.totalInterest)).toBeLessThanOrEqual(result.schedule.length);
    expect(result.totalPayable).toBe(500000 + result.totalInterest);
    expect(result.schedule[result.schedule.length - 1].balance).toBe(0);
  });

  it('groups the schedule by loan year, including a partial final year', () => {
    const result = calculateEmi({ principal: 100000, annualRate: 10, tenureMonths: 18 });
    expect(result.schedule.map((e) => e.year)).toEqual([1, 2]);
  });
});
