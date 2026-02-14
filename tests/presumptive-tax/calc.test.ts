import { describe, it, expect } from 'vitest';
import { calculatePresumptive } from '../../src/tools/presumptive-tax/calc';
import type { PresumptiveInput } from '../../src/tools/presumptive-tax/types';

describe('calculatePresumptive', () => {
  describe('44ADA (Professional)', () => {
    const base: PresumptiveInput = {
      scheme: '44ADA',
      grossReceipts: 5000000,
      cashReceipts: 0,
      regime: 'new',
    };

    it('calculates 50% presumptive income', () => {
      const result = calculatePresumptive(base);
      expect(result.presumptiveIncome).toBe(2500000);
      expect(result.presumptiveRate).toBe(50);
    });

    it('marks within limit for receipts up to 50L', () => {
      const result = calculatePresumptive(base);
      expect(result.isWithinLimit).toBe(true);
    });

    it('marks over limit for receipts above 50L (with >5% cash)', () => {
      // With cash > 5%, standard limit of 50L applies
      const input = { ...base, grossReceipts: 5100000, cashReceipts: 510000 };
      const result = calculatePresumptive(input);
      expect(result.isWithinLimit).toBe(false);
    });

    it('returns zero tax for zero receipts', () => {
      const input = { ...base, grossReceipts: 0 };
      const result = calculatePresumptive(input);
      expect(result.totalTax).toBe(0);
      expect(result.effectiveRate).toBe(0);
    });

    it('calculates effective tax rate', () => {
      const result = calculatePresumptive(base);
      expect(result.effectiveRate).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeLessThan(30);
    });
  });

  describe('44AD (Business)', () => {
    const base: PresumptiveInput = {
      scheme: '44AD',
      grossReceipts: 10000000,
      cashReceipts: 2000000,
      regime: 'new',
    };

    it('calculates weighted presumptive income (8% cash + 6% digital)', () => {
      const result = calculatePresumptive(base);
      // Cash: 2000000 * 8% = 160000
      // Digital: 8000000 * 6% = 480000
      // Total: 640000
      expect(result.presumptiveIncome).toBe(640000);
    });

    it('marks within limit for turnover up to 2 Cr', () => {
      const result = calculatePresumptive(base);
      expect(result.isWithinLimit).toBe(true);
    });

    it('uses extended limit of 3 Cr when cash is <= 5%', () => {
      const input = {
        ...base,
        grossReceipts: 25000000,
        cashReceipts: 1000000, // 4% cash
      };
      const result = calculatePresumptive(input);
      expect(result.isWithinLimit).toBe(true);
      expect(result.applicableLimit).toBe(30000000);
    });

    it('uses standard limit of 2 Cr when cash > 5%', () => {
      const input = {
        ...base,
        grossReceipts: 25000000,
        cashReceipts: 5000000, // 20% cash
      };
      const result = calculatePresumptive(input);
      expect(result.isWithinLimit).toBe(false);
      expect(result.applicableLimit).toBe(20000000);
    });

    it('handles all-cash receipts', () => {
      const input = {
        ...base,
        grossReceipts: 1000000,
        cashReceipts: 1000000,
      };
      const result = calculatePresumptive(input);
      // All cash at 8%
      expect(result.presumptiveIncome).toBe(80000);
    });

    it('handles all-digital receipts', () => {
      const input = {
        ...base,
        grossReceipts: 1000000,
        cashReceipts: 0,
      };
      const result = calculatePresumptive(input);
      // All digital at 6%
      expect(result.presumptiveIncome).toBe(60000);
    });
  });

  describe('Tax computation', () => {
    it('applies surcharge and cess', () => {
      const input: PresumptiveInput = {
        scheme: '44ADA',
        grossReceipts: 5000000,
        cashReceipts: 0,
        regime: 'new',
      };
      const result = calculatePresumptive(input);
      expect(result.totalTax).toBe(result.taxLiability + result.surcharge + result.cess);
    });

    it('old regime calculation works', () => {
      const input: PresumptiveInput = {
        scheme: '44ADA',
        grossReceipts: 2000000,
        cashReceipts: 0,
        regime: 'old',
      };
      const result = calculatePresumptive(input);
      expect(result.totalTax).toBeGreaterThanOrEqual(0);
    });
  });
});
