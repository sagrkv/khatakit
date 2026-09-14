import type { LegalSource } from '../types';

// Finance Act, 2026 (No. 4 of 2026), assented 30 March 2026, Gazette of India.
const URL = 'https://egazette.gov.in/WriteReadData/2026/271439.pdf';
const AUTHORITY = 'Parliament of India';
const EFFECTIVE = '2026-04-01';

export const financeAct2026OldRegimeRates: LegalSource = {
  id: 'fa-2026-part-iii-para-a',
  type: 'act',
  authority: AUTHORITY,
  reference: 'Finance Act, 2026, First Schedule, Part III, Paragraph A',
  title: 'Rates for computing advance tax for tax year 2026-27 (old regime)',
  text:
    'Individuals below 60: nil up to ₹ 250000; 5% to ₹ 500000; ₹ 12500 plus 20% to ₹ 1000000; ' +
    '₹ 112500 plus 30% above. Residents aged 60 to below 80: nil up to ₹ 300000; 5% to ₹ 500000; ' +
    '₹ 10000 plus 20% to ₹ 1000000; ₹ 110000 plus 30% above. Residents aged 80 or more: nil up ' +
    'to ₹ 500000; 20% to ₹ 1000000; ₹ 100000 plus 30% above.',
  url: URL,
  effectiveDate: EFFECTIVE,
};

export const financeAct2026Surcharge: LegalSource = {
  id: 'fa-2026-s3-surcharge',
  type: 'act',
  authority: AUTHORITY,
  reference: 'Finance Act, 2026, section 3(4) and 3(5)',
  title: 'Surcharge, marginal relief and cess for tax year 2026-27',
  text:
    'Individuals: 10% where total income exceeds ₹ 5000000, 15% above ₹ 10000000, 25% above ' +
    '₹ 20000000 and 37% above ₹ 50000000 (Table serial 1). Under section 202 the rate above ' +
    '₹ 20000000 is 25% (Table serial 10). Marginal relief: Tn = Rn + Sn, so tax and surcharge ' +
    'cannot exceed the amount on the threshold plus the income above it. Health and Education ' +
    'Cess is calculated at the rate of 4% of such income-tax and surcharge.',
  url: URL,
  effectiveDate: EFFECTIVE,
};
