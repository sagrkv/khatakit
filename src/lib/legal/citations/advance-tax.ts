import type { LegalCitation } from '../types';
import {
  section19,
  section156,
  section202,
  section403,
  section404,
  section408,
} from '../sources/income-tax-act-2025';
import { financeAct2026OldRegimeRates, financeAct2026Surcharge } from '../sources/finance-act-2026';

export const advanceTaxCitations: LegalCitation[] = [
  {
    source: section404,
    excerpt: 'Advance tax shall be payable... where the amount of such tax payable... is ₹10000 or more.',
    relevance: 'The schedule appears when net tax after TDS is ₹10,000 or more.',
  },
  {
    source: section403,
    excerpt:
      'Shall not apply to an individual resident in India who does not have any income chargeable ' +
      'under the head "Profits and gains of business or profession" and is of the age of sixty years or more.',
    relevance: 'Resident seniors with no business or professional income are shown as not liable.',
  },
  {
    source: section408,
    excerpt: '15th June - 15%; 15th September - 45%; 15th December - 75%; 15th March - the whole amount.',
    relevance: 'The four instalments use these cumulative percentages for tax year 2026-27.',
  },
  {
    source: section202,
    excerpt: 'Upto ₹400000 - Nil ... From ₹2000001 to ₹2400000 - 25%; Above ₹2400000 - 30%.',
    relevance: 'New regime slab rates.',
  },
  {
    source: financeAct2026OldRegimeRates,
    excerpt: 'Nil up to ₹ 250000 (₹ 300000 at 60, ₹ 500000 at 80); 5%, 20% and 30% above.',
    relevance: 'Old regime slab rates by age for computing advance tax.',
  },
  {
    source: section156,
    excerpt:
      'If the income does not exceed twelve lakh rupees, 100% of the income-tax payable or ₹ 60000, ' +
      'whichever is less; above that, tax cannot exceed the income above twelve lakh rupees.',
    relevance: 'Rebate of up to ₹60,000 (new) or ₹12,500 (old), with new regime marginal relief.',
  },
  {
    source: section19,
    excerpt: '₹ 75000 or the salary, whichever is less, under section 202(1); ₹ 50000 or the salary in any other case.',
    relevance: 'The standard deduction is taken only from the salary or pension you enter.',
  },
  {
    source: financeAct2026Surcharge,
    excerpt: '10% above ₹ 5000000, 15% above ₹ 10000000, 25% above ₹ 20000000, 37% above ₹ 50000000; cess at 4%.',
    relevance:
      'Surcharge with marginal relief (capped at 25% in the new regime), then 4% cess on tax and surcharge.',
  },
];
