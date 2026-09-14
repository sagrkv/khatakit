import type { LegalCitation } from '../types';
import { rbiResponsibleBusinessConduct2025 } from '../sources/rbi';

export const emiCitations: LegalCitation[] = [
  {
    source: rbiResponsibleBusinessConduct2025,
    excerpt:
      'An equated or fixed amount of repayments, consisting of both the principal and interest ' +
      'components... which result in complete amortisation of the loan.',
    relevance:
      'RBI does not prescribe a formula. The calculator uses the reducing-balance method with a ' +
      'monthly rate of annual rate divided by 12, rounds to the nearest rupee, and reproduces the ' +
      'RBI worked example (₹20,000 at 15% for 24 months gives ₹970). The last instalment clears ' +
      'any rounding difference.',
  },
];
