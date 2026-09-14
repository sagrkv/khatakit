import { describe, it, expect } from 'vitest';
import { calculateAdvanceTax } from '../../src/tools/advance-tax/calc';
import type { AdvanceTaxInput } from '../../src/tools/advance-tax/types';

// Tax year 2026-27 (Income-tax Act, 2025 and Finance Act, 2026).
const base: AdvanceTaxInput = {
  regime: 'new',
  grossIncome: 1500000,
  salaryIncome: 1500000,
  deductions: 0,
  tdsDeducted: 0,
  ageCategory: 'below60',
  hasBusinessIncome: false,
};

const salaried = (grossIncome: number, extra: Partial<AdvanceTaxInput> = {}) =>
  calculateAdvanceTax({ ...base, grossIncome, salaryIncome: grossIncome, ...extra });

describe('calculateAdvanceTax - slab rates (section 202 and Finance Act 2026 Part III)', () => {
  it('computes both regimes for a salaried Rs 15 lakh income', () => {
    const result = calculateAdvanceTax(base);
    expect(result.newRegime.taxableIncome).toBe(1425000);
    expect(result.newRegime.taxOnIncome).toBe(93750);
    expect(result.newRegime.totalTax).toBe(97500);
    expect(result.oldRegime.taxableIncome).toBe(1450000);
    expect(result.oldRegime.totalTax).toBe(257400);
  });

  it('uses age-based old regime slabs', () => {
    expect(salaried(1050000, { ageCategory: 'below60' }).oldRegime.totalTax).toBe(117000);
    expect(salaried(1050000, { ageCategory: '60to80' }).oldRegime.totalTax).toBe(114400);
    expect(salaried(1050000, { ageCategory: 'above80' }).oldRegime.totalTax).toBe(104000);
  });
});

describe('calculateAdvanceTax - standard deduction (section 19)', () => {
  it('allows Rs 75,000 new and Rs 50,000 old against salary', () => {
    const result = calculateAdvanceTax(base);
    expect(result.newRegime.standardDeduction).toBe(75000);
    expect(result.oldRegime.standardDeduction).toBe(50000);
  });

  it('gives no standard deduction without salary income', () => {
    const result = calculateAdvanceTax({ ...base, grossIncome: 1275000, salaryIncome: 0 });
    expect(result.newRegime.standardDeduction).toBe(0);
    expect(result.newRegime.taxableIncome).toBe(1275000);
    expect(result.newRegime.totalTax).toBe(74100);
  });

  it('limits the deduction to the salary amount', () => {
    const result = calculateAdvanceTax({ ...base, salaryIncome: 30000 });
    expect(result.newRegime.standardDeduction).toBe(30000);
    expect(result.oldRegime.standardDeduction).toBe(30000);
  });

  it('allows other deductions only in the old regime', () => {
    const result = calculateAdvanceTax({ ...base, regime: 'old', deductions: 150000 });
    expect(result.oldRegime.otherDeductions).toBe(150000);
    expect(result.oldRegime.taxableIncome).toBe(1300000);
    expect(result.newRegime.otherDeductions).toBe(0);
  });
});

describe('calculateAdvanceTax - rebate (section 156)', () => {
  it('new regime: full rebate up to Rs 12 lakh taxable income', () => {
    const result = salaried(1275000);
    expect(result.newRegime.taxableIncome).toBe(1200000);
    expect(result.newRegime.rebate).toBe(60000);
    expect(result.newRegime.totalTax).toBe(0);
  });

  it('new regime: tax never exceeds the income above Rs 12 lakh', () => {
    const at1250 = salaried(1325000).newRegime;
    expect(at1250.taxOnIncome).toBe(67500);
    expect(at1250.rebate).toBe(17500);
    expect(at1250.taxAfterRebate).toBe(50000);
    expect(at1250.totalTax).toBe(52000);

    const at1270 = salaried(1345000).newRegime;
    expect(at1270.rebate).toBe(500);
    expect(at1270.taxAfterRebate).toBe(70000);
  });

  it('new regime: no rebate once slab tax is below the excess income', () => {
    const at1280 = salaried(1355000).newRegime;
    expect(at1280.rebate).toBe(0);
    expect(at1280.totalTax).toBe(74880);
  });

  it('old regime: Rs 12,500 rebate up to Rs 5 lakh, none above', () => {
    expect(salaried(550000).oldRegime.totalTax).toBe(0);
    const above = salaried(550001).oldRegime;
    expect(above.rebate).toBe(0);
    expect(above.totalTax).toBe(13000);
  });
});

describe('calculateAdvanceTax - surcharge (Finance Act 2026 section 3(4), 3(5))', () => {
  it('old regime: 10% above Rs 50 lakh with marginal relief', () => {
    const old = salaried(5060000).oldRegime;
    expect(old.taxableIncome).toBe(5010000);
    expect(old.taxAfterRebate).toBe(1315500);
    expect(old.surcharge).toBe(7000);
    expect(old.totalTax).toBe(1375400);
  });

  it('new regime: marginal relief at Rs 50 lakh', () => {
    const next = salaried(5085000).newRegime;
    expect(next.taxableIncome).toBe(5010000);
    expect(next.surcharge).toBe(7000);
  });

  it('caps the new regime surcharge at 25% above Rs 5 crore, old regime pays 37%', () => {
    const result = salaried(60075000);
    expect(result.newRegime.taxAfterRebate).toBe(17580000);
    expect(result.newRegime.surcharge).toBe(4395000);
    expect(result.oldRegime.taxAfterRebate).toBe(17820000);
    expect(result.oldRegime.surcharge).toBe(6593400);
  });

  it('adds 4% cess on tax plus surcharge', () => {
    const old = salaried(5060000).oldRegime;
    expect(old.cess).toBe(52900);
  });
});

describe('calculateAdvanceTax - liability and instalments (sections 403, 404, 408)', () => {
  it('is payable when net tax is exactly Rs 10,000', () => {
    const result = calculateAdvanceTax({ ...base, tdsDeducted: 87500 });
    expect(result.newRegime.netTaxPayable).toBe(10000);
    expect(result.newRegime.isAdvanceTaxApplicable).toBe(true);
    expect(result.schedule.map((q) => q.installmentAmount)).toEqual([1500, 3000, 3000, 2500]);
    expect(result.schedule.map((q) => q.cumulativeAmount)).toEqual([1500, 4500, 7500, 10000]);
  });

  it('is not payable below Rs 10,000', () => {
    const result = calculateAdvanceTax({ ...base, tdsDeducted: 87501 });
    expect(result.newRegime.isAdvanceTaxApplicable).toBe(false);
    expect(result.schedule).toHaveLength(0);
  });

  it('uses the tax year 2026-27 due dates and cumulative percentages', () => {
    const result = calculateAdvanceTax(base);
    expect(result.schedule.map((q) => q.dueDate)).toEqual([
      '15 June 2026',
      '15 September 2026',
      '15 December 2026',
      '15 March 2027',
    ]);
    expect(result.schedule.map((q) => q.cumulativePercent)).toEqual([15, 45, 75, 100]);
  });

  it('exempts resident seniors with no business income', () => {
    const result = calculateAdvanceTax({ ...base, ageCategory: '60to80' });
    expect(result.newRegime.seniorCitizenExempt).toBe(true);
    expect(result.newRegime.isAdvanceTaxApplicable).toBe(false);
    expect(result.schedule).toHaveLength(0);
  });

  it('does not exempt seniors who have business income', () => {
    const result = calculateAdvanceTax({ ...base, ageCategory: 'above80', hasBusinessIncome: true });
    expect(result.newRegime.seniorCitizenExempt).toBe(false);
    expect(result.schedule).toHaveLength(4);
  });

  it('reduces net tax by TDS and never goes negative', () => {
    expect(calculateAdvanceTax({ ...base, tdsDeducted: 50000 }).newRegime.netTaxPayable).toBe(47500);
    expect(calculateAdvanceTax({ ...base, tdsDeducted: 9999999 }).newRegime.netTaxPayable).toBe(0);
  });
});
