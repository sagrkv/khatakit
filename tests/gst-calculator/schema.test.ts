import { describe, expect, it } from 'vitest';
import { fieldKey, validateBill, type BillForm, type LineForm } from '../../src/tools/gst-calculator/schema';

const line = (overrides: Partial<LineForm> = {}): LineForm => ({
  id: 1,
  description: '',
  amount: '',
  priceType: 'exclusive',
  rate: '18',
  customRate: '',
  ...overrides,
});
const form = (lines: LineForm[]): BillForm => ({ supplyType: 'intra', roundToRupee: false, lines });

describe('bill validation', () => {
  it('reads amounts with commas and a rupee sign into paise', () => {
    const { input, errors } = validateBill(form([line({ amount: '₹ 12,345.67' })]));
    expect(errors).toEqual({});
    expect(input?.lines[0]).toMatchObject({ amountPaise: 1234567, rateMilli: 18000 });
  });

  it('accepts whole rupees, a trailing point and zero', () => {
    const amounts = ['999', '1.', '.5', '0'].map(
      (amount) => validateBill(form([line({ amount })])).input?.lines[0].amountPaise
    );
    expect(amounts).toEqual([99900, 100, 50, 0]);
  });

  it('treats an empty amount as missing, not as an error', () => {
    const result = validateBill(form([line()]));
    expect(result.input).toBeNull();
    expect(result.errors).toEqual({});
    expect(result.missing).toEqual({ [fieldKey(1, 'amount')]: 'Enter the amount.' });
  });

  it.each([
    ['abc', 'Enter an amount as a number, for example 1250.50.'],
    ['-5', 'Enter an amount of zero or more.'],
    ['10.555', 'Enter an amount with at most 2 decimal places.'],
    ['1e5', 'Enter an amount as a number, for example 1250.50.'],
    ['10000000001', 'Enter an amount up to ₹1,000 crore per line.'],
  ])('rejects the amount %s', (amount, message) => {
    const result = validateBill(form([line({ amount })]));
    expect(result.input).toBeNull();
    expect(result.errors).toEqual({ [fieldKey(1, 'amount')]: message });
  });

  it('reads a custom rate with up to three decimals', () => {
    const { input } = validateBill(form([line({ amount: '100', rate: 'custom', customRate: '12.5%' })]));
    expect(input?.lines[0].rateMilli).toBe(12500);
  });

  it('rejects custom rates over 100% or with too many decimals', () => {
    expect(validateBill(form([line({ amount: '1', rate: 'custom', customRate: '101' })])).errors).toEqual({
      [fieldKey(1, 'customRate')]: 'Enter a rate of 100% or less.',
    });
    expect(
      validateBill(form([line({ amount: '1', rate: 'custom', customRate: '1.2345' })])).errors[
        fieldKey(1, 'customRate')
      ]
    ).toBe('Enter a rate with at most 3 decimal places.');
  });

  it('reports errors on several lines at once and keeps the bill incomplete', () => {
    const result = validateBill(
      form([line({ id: 1, amount: 'x' }), line({ id: 2, amount: '10', rate: 'custom' }), line({ id: 3, amount: '5' })])
    );
    expect(Object.keys(result.errors)).toEqual([fieldKey(1, 'amount')]);
    expect(Object.keys(result.missing)).toEqual([fieldKey(2, 'customRate')]);
    expect(result.input).toBeNull();
  });

  it('rejects an unknown preset rate and an empty bill', () => {
    expect(validateBill(form([line({ amount: '1', rate: '28' })])).input).toBeNull();
    expect(validateBill(form([])).input).toBeNull();
  });

  it('trims descriptions', () => {
    const { input } = validateBill(form([line({ amount: '1', description: '  Tiles  ' })]));
    expect(input?.lines[0].description).toBe('Tiles');
  });
});
