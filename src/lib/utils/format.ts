/**
 * Indian number formatting utilities.
 * Formats numbers in the Indian numbering system (1,00,000 style).
 */

export function formatIndianNumber(num: number): string {
  const rounded = Math.round(num);
  const str = Math.abs(rounded).toString();
  const sign = rounded < 0 ? '-' : '';

  if (str.length <= 3) return sign + str;

  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return sign + formatted + ',' + last3;
}

export function formatCurrency(amount: number): string {
  return '\u20B9 ' + formatIndianNumber(amount);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return value.toFixed(decimals) + '%';
}

export function parseIndianNumber(str: string): number {
  const cleaned = str.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
