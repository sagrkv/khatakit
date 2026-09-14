import { describe, expect, it } from 'vitest';
import { calculateBill } from '../../src/tools/gst-calculator/calc';
import { billToCsv, billToText } from '../../src/tools/gst-calculator/csv';
import { formatPaise, formatRate, formatHeadRate, formatSignedPaise } from '../../src/tools/gst-calculator/format';

const g3 = calculateBill({
  supplyType: 'intra',
  roundToRupee: true,
  lines: [
    { id: 1, description: 'Tiles, glazed', amountPaise: 123450, priceType: 'exclusive', rateMilli: 5000 },
    { id: 2, description: '=HYPERLINK("x")', amountPaise: 259999, priceType: 'exclusive', rateMilli: 18000 },
    { id: 3, description: '', amountPaise: 84525, priceType: 'exclusive', rateMilli: 40000 },
  ],
});

describe('formatting', () => {
  it('formats paise with Indian grouping and signs', () => {
    expect(formatPaise(1234567)).toBe('12,345.67');
    expect(formatPaise(100000000000)).toBe('1,00,00,00,000.00');
    expect(formatPaise(5)).toBe('0.05');
    expect(formatSignedPaise(44)).toBe('+0.44');
    expect(formatSignedPaise(-30)).toBe('-0.30');
    expect(formatSignedPaise(0)).toBe('0.00');
    expect(formatRate(250)).toBe('0.25%');
    expect(formatHeadRate(250)).toBe('0.125%');
    expect(formatHeadRate(18000)).toBe('9%');
  });
});

describe('CSV download', () => {
  const csv = billToCsv(g3);
  const rows = csv.trim().split('\r\n');

  it('lists every line with plain numbers', () => {
    expect(rows).toContain('1,"Tiles, glazed",1234.50,Excluding GST,5%,1234.50,30.86,30.86,0.00,1296.22');
    expect(rows).toContain('3,,845.25,Excluding GST,40%,845.25,169.05,169.05,0.00,1183.35');
  });

  it('includes the rate summary and bill totals that add up', () => {
    expect(rows).toContain('18%,2599.99,234.00,234.00,468.00,0.00,3067.99');
    expect(rows).toContain('Taxable value,4679.74');
    expect(rows).toContain('Round-off to nearest rupee,0.44');
    expect(rows).toContain('Bill total,5548.00');
  });

  it('neutralises formulas typed into descriptions', () => {
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
  });

  it('uses only the IGST column between states', () => {
    const inter = billToCsv(calculateBill({ ...g3, supplyType: 'inter', lines: g3.lines }));
    expect(inter).toContain('Taxable value,IGST,Round-off');
    expect(inter).not.toContain('CGST');
  });
});

describe('copied text', () => {
  it('summarises lines, rates and totals', () => {
    const text = billToText(g3);
    expect(text).toContain('Line 1 Tiles, glazed: ₹ 1,234.50 excluding GST at 5%.');
    expect(text).toContain('CGST ₹ 30.86 (2.5%), SGST ₹ 30.86');
    expect(text).toContain('Round-off: +0.44');
    expect(text).toContain('Bill total: ₹ 5,548.00');
  });
});
