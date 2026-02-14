export const GST_LATE_FEE_PER_DAY_NON_NIL = 50; // Rs. 25 CGST + Rs. 25 SGST
export const GST_LATE_FEE_PER_DAY_NIL = 20; // Rs. 10 CGST + Rs. 10 SGST

export const GST_INTEREST_RATE = 18; // 18% per annum

export const GST_LATE_FEE_CAPS: { maxTurnover: number; cap: number; label: string }[] = [
  { maxTurnover: 15000000, cap: 2000, label: 'Up to Rs. 1.5 Cr' },
  { maxTurnover: 50000000, cap: 5000, label: 'Rs. 1.5 Cr to Rs. 5 Cr' },
  { maxTurnover: Infinity, cap: 10000, label: 'Above Rs. 5 Cr' },
];

export const GST_NIL_RETURN_CAP = 500;

export const GST_RETURN_TYPES = [
  { value: 'GSTR-3B', label: 'GSTR-3B' },
  { value: 'GSTR-1', label: 'GSTR-1' },
  { value: 'GSTR-9', label: 'GSTR-9 (Annual)' },
];

export const TURNOVER_SLABS = [
  { value: 'upto_1_5cr', label: 'Up to Rs. 1.5 Crore' },
  { value: '1_5cr_to_5cr', label: 'Rs. 1.5 Cr to Rs. 5 Cr' },
  { value: 'above_5cr', label: 'Above Rs. 5 Crore' },
];
