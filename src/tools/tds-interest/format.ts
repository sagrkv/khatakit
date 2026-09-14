import { formatIndianNumber } from '../../lib/utils/format';

/** ₹ 1,125 or ₹ 1,124.50 */
export function formatPaise(paise: number): string {
  const rupees = Math.floor(paise / 100);
  const rest = paise % 100;
  return `₹ ${formatIndianNumber(rupees)}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`;
}

export const formatRupees = (rupees: number) => `₹ ${formatIndianNumber(rupees)}`;

export const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;
