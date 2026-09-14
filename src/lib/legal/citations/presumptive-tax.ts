import type { LegalCitation } from '../types';
import { section156, section202, section58 } from '../sources/income-tax-act-2025';
import { financeAct2026OldRegimeRates, financeAct2026Surcharge } from '../sources/finance-act-2026';

export const presumptiveTaxCitations: LegalCitation[] = [
  {
    source: section58,
    excerpt:
      'Business: 6% of turnover received by specified banking or online mode and 8% of the rest, ' +
      'turnover up to two crore rupees (three crore where cash does not exceed 5%). Profession: ' +
      '50% of gross receipts, up to fifty lakh rupees (seventy-five lakh where cash does not exceed 5%).',
    relevance:
      'Old sections 44AD and 44ADA are now serial 1 and 3 of this table. The calculator applies ' +
      'these rates and limits using the cash receipts you enter.',
  },
  {
    source: section202,
    excerpt: 'Upto ₹400000 - Nil ... Above ₹2400000 - 30%.',
    relevance: 'New regime slab rates applied to the presumptive income.',
  },
  {
    source: financeAct2026OldRegimeRates,
    excerpt: 'Nil up to ₹ 250000; 5% to ₹ 500000; 20% to ₹ 1000000; 30% above.',
    relevance: 'Old regime slab rates, using the below-60 table.',
  },
  {
    source: section156,
    excerpt: '100% of the income-tax payable or ₹ 60000, whichever is less, up to twelve lakh rupees.',
    relevance: 'Rebate and new regime marginal relief.',
  },
  {
    source: financeAct2026Surcharge,
    excerpt: 'Surcharge from 10% above ₹ 5000000; Health and Education Cess at 4%.',
    relevance: 'Surcharge with marginal relief, then 4% cess.',
  },
];
