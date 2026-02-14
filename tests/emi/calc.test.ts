import { describe, it, expect } from 'vitest';
import { calculateEmi } from '../../src/tools/emi/calc';

describe('calculateEmi', () => {
  it('returns zero for zero principal', () => {
    const result = calculateEmi({ principal: 0, annualRate: 10, tenureMonths: 12 });
    expect(result.emi).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it('returns zero for zero tenure', () => {
    const result = calculateEmi({ principal: 100000, annualRate: 10, tenureMonths: 0 });
    expect(result.emi).toBe(0);
  });

  it('handles zero interest rate', () => {
    const result = calculateEmi({ principal: 120000, annualRate: 0, tenureMonths: 12 });
    expect(result.emi).toBe(10000);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(120000);
  });

  it('calculates correct EMI for standard case', () => {
    // 10 lakh, 8.5%, 20 years (240 months)
    const result = calculateEmi({
      principal: 1000000,
      annualRate: 8.5,
      tenureMonths: 240,
    });
    // Expected EMI ~8678
    expect(result.emi).toBeGreaterThan(8600);
    expect(result.emi).toBeLessThan(8800);
  });

  it('total payable equals EMI * tenure', () => {
    const result = calculateEmi({
      principal: 500000,
      annualRate: 10,
      tenureMonths: 60,
    });
    expect(result.totalPayable).toBe(result.emi * 60);
  });

  it('total interest is positive for non-zero rate', () => {
    const result = calculateEmi({
      principal: 500000,
      annualRate: 10,
      tenureMonths: 60,
    });
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('generates correct number of amortization entries', () => {
    // 36 months = 3 years
    const result = calculateEmi({
      principal: 300000,
      annualRate: 12,
      tenureMonths: 36,
    });
    expect(result.schedule).toHaveLength(3);
    expect(result.schedule[0].year).toBe(1);
    expect(result.schedule[2].year).toBe(3);
  });

  it('amortization balance reaches zero', () => {
    const result = calculateEmi({
      principal: 300000,
      annualRate: 12,
      tenureMonths: 36,
    });
    const lastEntry = result.schedule[result.schedule.length - 1];
    // Allow small rounding difference (< Rs. 100)
    expect(lastEntry.balance).toBeLessThanOrEqual(100);
  });

  it('handles partial year in amortization', () => {
    // 18 months = 1 full year + 6 months
    const result = calculateEmi({
      principal: 100000,
      annualRate: 10,
      tenureMonths: 18,
    });
    expect(result.schedule).toHaveLength(2);
    expect(result.schedule[1].year).toBe(2);
  });
});
