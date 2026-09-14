import { describe, expect, it } from 'vitest';
import { calculatePresumptive } from '../../src/tools/presumptive-tax/calc';
import { BUSINESS_EXAMPLE, PROFESSION_EXAMPLE } from '../../src/tools/presumptive-tax/example';

describe('presumptive guide figures match the calculator', () => {
  it('business example', () => {
    const result = calculatePresumptive(BUSINESS_EXAMPLE.input);
    expect(result.cashSharePercent).toBe(BUSINESS_EXAMPLE.cashSharePercent);
    expect(result.digitalReceipts).toBe(BUSINESS_EXAMPLE.digitalReceipts);
    expect(result.applicableLimit).toBe(BUSINESS_EXAMPLE.applicableLimit);
    expect(result.isWithinLimit).toBe(true);
    expect(result.cashIncome).toBe(BUSINESS_EXAMPLE.cashIncome);
    expect(result.digitalIncome).toBe(BUSINESS_EXAMPLE.digitalIncome);
    expect(result.presumptiveIncome).toBe(BUSINESS_EXAMPLE.presumptiveIncome);
    expect(result.taxOnIncome).toBe(BUSINESS_EXAMPLE.taxOnIncome);
    expect(result.rebate).toBe(0);
    expect(result.cess).toBe(BUSINESS_EXAMPLE.cess);
    expect(result.totalTax).toBe(BUSINESS_EXAMPLE.totalTax);
  });

  it('business example with more than 5% cash', () => {
    const result = calculatePresumptive({
      ...BUSINESS_EXAMPLE.input,
      cashReceipts: BUSINESS_EXAMPLE.higherCash,
    });
    expect(result.applicableLimit).toBe(BUSINESS_EXAMPLE.higherCashLimit);
    expect(result.isWithinLimit).toBe(false);
  });

  it('profession example', () => {
    const result = calculatePresumptive(PROFESSION_EXAMPLE.input);
    expect(result.presumptiveIncome).toBe(PROFESSION_EXAMPLE.presumptiveIncome);
    expect(result.taxOnIncome).toBe(PROFESSION_EXAMPLE.taxOnIncome);
    expect(result.cess).toBe(PROFESSION_EXAMPLE.cess);
    expect(result.totalTax).toBe(PROFESSION_EXAMPLE.totalTax);
  });
});
