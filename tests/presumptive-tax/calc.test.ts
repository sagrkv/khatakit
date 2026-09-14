import { describe, it, expect } from 'vitest';
import { calculatePresumptive } from '../../src/tools/presumptive-tax/calc';
import type { PresumptiveInput } from '../../src/tools/presumptive-tax/types';

// Tax year 2026-27, section 58(2) of the Income-tax Act, 2025.
describe('calculatePresumptive - profession (section 58(2) Table serial 3, old 44ADA)', () => {
  const base: PresumptiveInput = {
    scheme: '44ADA',
    grossReceipts: 5000000,
    cashReceipts: 0,
    regime: 'new',
  };

  it('deems 50% of gross receipts as income', () => {
    const result = calculatePresumptive(base);
    expect(result.presumptiveIncome).toBe(2500000);
    expect(result.presumptiveRate).toBe(50);
  });

  it('does not subtract a salary standard deduction', () => {
    const result = calculatePresumptive(base);
    expect(result.taxableIncome).toBe(2500000);
    expect(result.taxOnIncome).toBe(330000);
    expect(result.cess).toBe(13200);
    expect(result.totalTax).toBe(343200);
  });

  it('allows Rs 75 lakh when cash receipts are 5% or less', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 7000000, cashReceipts: 300000 });
    expect(result.applicableLimit).toBe(7500000);
    expect(result.isWithinLimit).toBe(true);
  });

  it('falls back to Rs 50 lakh when cash receipts exceed 5%', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 7000000, cashReceipts: 400000 });
    expect(result.applicableLimit).toBe(5000000);
    expect(result.isWithinLimit).toBe(false);
  });

  it('keeps the Rs 50 lakh limit available even when all receipts are cash', () => {
    const result = calculatePresumptive({ ...base, cashReceipts: 5000000 });
    expect(result.isWithinLimit).toBe(true);
  });

  it('applies old regime slabs', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 2000000, regime: 'old' });
    expect(result.taxableIncome).toBe(1000000);
    expect(result.totalTax).toBe(117000);
  });

  it('returns zero for zero receipts', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 0 });
    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });
});

describe('calculatePresumptive - business (section 58(2) Table serial 1, old 44AD)', () => {
  const base: PresumptiveInput = {
    scheme: '44AD',
    grossReceipts: 10000000,
    cashReceipts: 2000000,
    regime: 'new',
  };

  it('deems 8% of cash and 6% of bank or online receipts', () => {
    const result = calculatePresumptive(base);
    expect(result.presumptiveIncome).toBe(640000);
    expect(result.presumptiveRate).toBe(6.4);
  });

  it('applies the full rebate at Rs 6.4 lakh income', () => {
    const result = calculatePresumptive(base);
    expect(result.rebate).toBe(12000);
    expect(result.totalTax).toBe(0);
  });

  it('applies rebate marginal relief just above Rs 12 lakh', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 21000000, cashReceipts: 0 });
    expect(result.presumptiveIncome).toBe(1260000);
    expect(result.rebate).toBe(9000);
    expect(result.taxLiability).toBe(60000);
    expect(result.totalTax).toBe(62400);
  });

  it('allows Rs 3 crore when cash is exactly 5%', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 30000000, cashReceipts: 1500000 });
    expect(result.applicableLimit).toBe(30000000);
    expect(result.isWithinLimit).toBe(true);
  });

  it('falls back to Rs 2 crore when cash exceeds 5%', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 25000000, cashReceipts: 5000000 });
    expect(result.applicableLimit).toBe(20000000);
    expect(result.isWithinLimit).toBe(false);
  });

  it('handles all-cash and all-digital receipts', () => {
    expect(
      calculatePresumptive({ ...base, grossReceipts: 1000000, cashReceipts: 1000000 }).presumptiveIncome
    ).toBe(80000);
    expect(
      calculatePresumptive({ ...base, grossReceipts: 1000000, cashReceipts: 0 }).presumptiveIncome
    ).toBe(60000);
  });

  it('never treats cash above gross receipts as extra income', () => {
    const result = calculatePresumptive({ ...base, grossReceipts: 1000000, cashReceipts: 2000000 });
    expect(result.presumptiveIncome).toBe(80000);
  });
});
