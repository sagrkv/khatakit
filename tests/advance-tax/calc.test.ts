import { describe, it, expect } from 'vitest';
import { calculateAdvanceTax } from '../../src/tools/advance-tax/calc';
import type { AdvanceTaxInput } from '../../src/tools/advance-tax/types';

const base: AdvanceTaxInput = {
  regime: 'new',
  grossIncome: 1500000,
  deductions: 0,
  tdsDeducted: 0,
  ageCategory: 'below60',
};

describe('calculateAdvanceTax', () => {
  it('returns both regimes computed', () => {
    const result = calculateAdvanceTax(base);
    expect(result.oldRegime).toBeDefined();
    expect(result.newRegime).toBeDefined();
    expect(result.selectedRegime).toBe('new');
  });

  it('new regime: zero tax for income up to 12.75L with rebate', () => {
    const input = { ...base, grossIncome: 1275000 };
    const result = calculateAdvanceTax(input);
    // 12,75,000 - 75,000 std deduction = 12,00,000 taxable
    // Which is exactly at 87A limit, so full rebate
    expect(result.newRegime.taxableIncome).toBe(1200000);
    expect(result.newRegime.taxAfterRebate).toBe(0);
    expect(result.newRegime.netTaxPayable).toBe(0);
  });

  it('new regime: applies standard deduction of 75000', () => {
    const result = calculateAdvanceTax(base);
    expect(result.newRegime.standardDeduction).toBe(75000);
    expect(result.newRegime.taxableIncome).toBe(1425000);
  });

  it('old regime: applies standard deduction of 50000', () => {
    const input = { ...base, regime: 'old' as const, deductions: 150000 };
    const result = calculateAdvanceTax(input);
    expect(result.oldRegime.standardDeduction).toBe(50000);
    expect(result.oldRegime.otherDeductions).toBe(150000);
    expect(result.oldRegime.taxableIncome).toBe(1300000);
  });

  it('old regime: zero deductions in new regime', () => {
    const input = { ...base, regime: 'old' as const, deductions: 200000 };
    const result = calculateAdvanceTax(input);
    expect(result.newRegime.otherDeductions).toBe(0);
  });

  it('calculates 4% cess', () => {
    const result = calculateAdvanceTax(base);
    expect(result.newRegime.cess).toBe(
      Math.round(
        ((result.newRegime.taxAfterRebate + result.newRegime.surcharge) * 4) / 100
      )
    );
  });

  it('advance tax not applicable below 10000 threshold', () => {
    const input = { ...base, grossIncome: 500000 };
    const result = calculateAdvanceTax(input);
    expect(result.newRegime.isAdvanceTaxApplicable).toBe(false);
    expect(result.schedule).toHaveLength(0);
  });

  it('generates 4 quarterly installments when applicable', () => {
    const result = calculateAdvanceTax(base);
    if (result.newRegime.isAdvanceTaxApplicable) {
      expect(result.schedule).toHaveLength(4);
      expect(result.schedule[0].cumulativePercent).toBe(15);
      expect(result.schedule[1].cumulativePercent).toBe(45);
      expect(result.schedule[2].cumulativePercent).toBe(75);
      expect(result.schedule[3].cumulativePercent).toBe(100);
    }
  });

  it('TDS reduces net tax payable', () => {
    const input = { ...base, tdsDeducted: 50000 };
    const result = calculateAdvanceTax(input);
    const withoutTds = calculateAdvanceTax(base);
    expect(result.newRegime.netTaxPayable).toBe(
      Math.max(0, withoutTds.newRegime.totalTax - 50000)
    );
  });

  it('net tax payable is never negative', () => {
    const input = { ...base, tdsDeducted: 9999999 };
    const result = calculateAdvanceTax(input);
    expect(result.newRegime.netTaxPayable).toBe(0);
  });
});
