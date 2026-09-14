// Section 58(2) of the Income-tax Act, 2025, for tax year 2026-27.

/** Table serial 1: any business other than goods carriages (old section 44AD). */
export const PRESUMPTIVE_BUSINESS = {
  baseLimit: 20000000, // Rs 2 crore
  higherLimit: 30000000, // Rs 3 crore when cash receipts are 5% or less
  cashSharePercent: 5,
  cashRate: 8, // on receipts other than bank or online mode
  digitalRate: 6, // on receipts by specified banking or online mode
} as const;

/** Table serial 3: specified professions under section 62(4) (old section 44ADA). */
export const PRESUMPTIVE_PROFESSION = {
  baseLimit: 5000000, // Rs 50 lakh
  higherLimit: 7500000, // Rs 75 lakh when cash receipts are 5% or less
  cashSharePercent: 5,
  rate: 50,
} as const;
