import type { GstInput } from './types';

/**
 * Figures printed on the page. Written out by hand, not computed, so the tests
 * catch the page and the calculator drifting apart.
 */
export const WORKED_EXAMPLE = {
  input: {
    returnType: 'GSTR-3B',
    dueDate: '2026-05-20',
    filingDate: '2026-06-19',
    taxLiability: 100000,
    turnoverSlab: 'upto_1_5cr',
    isNilReturn: false,
    stateTurnover: 0,
  } satisfies GstInput,
  daysLate: 30,
  feePerHead: 750,
  capPerHead: 1000,
  lateFee: 1500,
  interestExact: 1479.45,
  interest: 1479,
  total: 2979,
};

export const CAP_EXAMPLE = {
  input: {
    returnType: 'GSTR-3B',
    dueDate: '2026-01-20',
    filingDate: '2026-04-20',
    taxLiability: 0,
    turnoverSlab: 'upto_1_5cr',
    isNilReturn: true,
    stateTurnover: 0,
  } satisfies GstInput,
  daysLate: 90,
  feePerHead: 900,
  capPerHead: 250,
  lateFee: 500,
};
