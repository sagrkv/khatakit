import { describe, it, expect } from 'vitest';
import { calculateGstPenalty } from '../../src/tools/gst-late-fee/calc';
import type { GstInput } from '../../src/tools/gst-late-fee/types';

const base: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '2025-01-20',
  filingDate: '2025-02-19',
  taxLiability: 100000,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
};

describe('calculateGstPenalty', () => {
  it('returns zero penalty when filed on time', () => {
    const input = { ...base, filingDate: '2025-01-20' };
    const result = calculateGstPenalty(input);
    expect(result.daysLate).toBe(0);
    expect(result.totalPenalty).toBe(0);
  });

  it('returns zero penalty when filed before due date', () => {
    const input = { ...base, filingDate: '2025-01-15' };
    const result = calculateGstPenalty(input);
    expect(result.daysLate).toBe(0);
    expect(result.totalPenalty).toBe(0);
  });

  it('calculates correct days late', () => {
    const result = calculateGstPenalty(base);
    expect(result.daysLate).toBe(30);
  });

  it('applies Rs. 50/day for non-nil return', () => {
    const input = { ...base, filingDate: '2025-01-30' }; // 10 days late
    const result = calculateGstPenalty(input);
    expect(result.lateFeePerDay).toBe(50);
    expect(result.rawLateFee).toBe(500);
  });

  it('applies Rs. 20/day for nil return', () => {
    const input = { ...base, isNilReturn: true, filingDate: '2025-01-30' }; // 10 days late
    const result = calculateGstPenalty(input);
    expect(result.lateFeePerDay).toBe(20);
    expect(result.rawLateFee).toBe(200);
  });

  it('caps late fee at Rs. 2000 for turnover up to 1.5 Cr', () => {
    const input = { ...base, filingDate: '2025-04-20' }; // 90 days = 4500 raw
    const result = calculateGstPenalty(input);
    expect(result.rawLateFee).toBe(4500);
    expect(result.cappedLateFee).toBe(2000);
  });

  it('caps late fee at Rs. 5000 for turnover 1.5-5 Cr', () => {
    const input = { ...base, turnoverSlab: '1_5cr_to_5cr' as const, filingDate: '2025-06-19' }; // 150 days = 7500
    const result = calculateGstPenalty(input);
    expect(result.cappedLateFee).toBe(5000);
  });

  it('caps nil return late fee at Rs. 500', () => {
    const input = { ...base, isNilReturn: true, filingDate: '2025-04-20' }; // 90 days = 1800
    const result = calculateGstPenalty(input);
    expect(result.rawLateFee).toBe(1800);
    expect(result.cappedLateFee).toBe(500);
  });

  it('splits late fee equally between CGST and SGST', () => {
    const input = { ...base, filingDate: '2025-01-30' }; // 10 days = 500
    const result = calculateGstPenalty(input);
    expect(result.cgstLateFee).toBe(250);
    expect(result.sgstLateFee).toBe(250);
  });

  it('calculates interest at 18% p.a.', () => {
    const result = calculateGstPenalty(base); // 30 days, 1 lakh liability
    // 100000 * 18 * 30 / (100 * 365) = 1479.45 -> rounded to 1479
    expect(result.interest).toBe(1479);
  });

  it('returns zero interest for nil returns', () => {
    const input = { ...base, isNilReturn: true };
    const result = calculateGstPenalty(input);
    expect(result.interest).toBe(0);
  });

  it('total penalty is late fee + interest', () => {
    const result = calculateGstPenalty(base);
    expect(result.totalPenalty).toBe(result.cappedLateFee + result.interest);
  });
});
