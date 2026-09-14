import type { LegalCitation, LegalSource } from '../types';

const CGST_ACT =
  'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active';

const section15: LegalSource = {
  id: 'gst-calculator-cgst-s15',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 15(1), Central Goods and Services Tax Act, 2017',
  title: 'Value of taxable supply',
  text:
    'The value of a supply of goods or services or both shall be the transaction value, which is ' +
    'the price actually paid or payable for the said supply of goods or services or both where the ' +
    'supplier and the recipient of the supply are not related and the price is the sole ' +
    'consideration for the supply.',
  url: `${CGST_ACT}/chapter4/section15_v1.00.html`,
  effectiveDate: '2017-07-01',
};

const section170: LegalSource = {
  id: 'gst-calculator-cgst-s170',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 170, Central Goods and Services Tax Act, 2017',
  title: 'Rounding off of tax, etc.',
  text:
    'The amount of tax, interest, penalty, fine or any other sum payable, and the amount of refund ' +
    'or any other sum due, under the provisions of this Act shall be rounded off to the nearest ' +
    'rupee and, for this purpose, where such amount contains a part of a rupee consisting of paise, ' +
    'then, if such part is fifty paise or more, it shall be increased to one rupee and if such part ' +
    'is less than fifty paise it shall be ignored.',
  url: `${CGST_ACT}/chapter21/section170_v1.00.html`,
  effectiveDate: '2017-07-01',
};

const centralRate: LegalSource = {
  id: 'gst-calculator-ct-rate-9-2025',
  type: 'notification',
  authority: 'Ministry of Finance, Department of Revenue',
  reference: 'Notification No. 9/2025-Central Tax (Rate), 17 September 2025',
  title: 'Central tax rates on goods',
  text:
    '2.5 per cent. in respect of goods specified in Schedule I; 9 per cent. in respect of goods ' +
    'specified in Schedule II; 20 per cent. in respect of goods specified in Schedule III; 1.5 per ' +
    'cent. in respect of goods specified in Schedule IV; 0.125 per cent. in respect of goods ' +
    'specified in Schedule V; 0.75 per cent. in respect of goods specified in Schedule VI',
  url: 'https://taxinformation.cbic.gov.in/',
  effectiveDate: '2025-09-22',
};

const integratedRate: LegalSource = {
  id: 'gst-calculator-it-rate-9-2025',
  type: 'notification',
  authority: 'Ministry of Finance, Department of Revenue',
  reference: 'Notification No. 9/2025-Integrated Tax (Rate), 17 September 2025',
  title: 'Integrated tax rates on goods',
  text:
    '5 per cent. in respect of goods specified in Schedule I, 18 per cent. in respect of goods ' +
    'specified in Schedule II, 40 per cent. in respect of goods specified in Schedule III, 3 per ' +
    'cent. in respect of goods specified in Schedule IV, 0.25 per cent. in respect of goods ' +
    'specified in Schedule V, 1.50 per cent. in respect of goods specified in Schedule VI',
  url: 'https://courier.cbic.gov.in/ECCS/advisory/2025/NOTIFICATION%20NO.%209_2025-INTEGRATED%20TAX%20(RATE)%20-1759486719.pdf',
  effectiveDate: '2025-09-22',
};

const tobaccoAmendment: LegalSource = {
  id: 'gst-calculator-ct-rate-19-2025',
  type: 'notification',
  authority: 'Ministry of Finance, Department of Revenue',
  reference: 'Notification No. 19/2025-Central Tax (Rate), 31 December 2025',
  title: 'Omission of the 28% schedule',
  text:
    'Amends Notification No. 9/2025-Central Tax (Rate): Schedule VII (14% central tax, 28% in ' +
    'total) is omitted; pan masala and tobacco products move to Schedule III and biris to ' +
    'Schedule II, from 1 February 2026.',
  url: 'https://taxinformation.cbic.gov.in/',
  effectiveDate: '2026-02-01',
};

export const gstCalculatorCitations: LegalCitation[] = [
  {
    source: section15,
    excerpt: section15.text,
    relevance:
      'GST is charged on the taxable value, which does not include the GST itself. For a price that includes GST, the calculator works the taxable value back out of the price.',
  },
  {
    source: centralRate,
    excerpt: centralRate.text,
    relevance:
      'Central tax rates for intra-state supplies. State tax (SGST or UTGST) is charged at the same rate under the matching state and union territory notifications, so each head is half the total rate. Search for the notification number on the CBIC tax information portal.',
  },
  {
    source: integratedRate,
    excerpt: integratedRate.text,
    relevance: 'Integrated tax rates for inter-state supplies: the total rates offered in the rate list.',
  },
  {
    source: tobaccoAmendment,
    excerpt: tobaccoAmendment.text,
    relevance:
      'The 28% rate no longer applies to goods from 1 February 2026, so it is not in the rate list. Search for the notification number on the CBIC tax information portal.',
  },
  {
    source: section170,
    excerpt: section170.text,
    relevance:
      'Used for the optional round-off of the bill total to the nearest rupee. The Act does not fix how paise are rounded on each invoice line; the per-line method on this page is the method Khatakit uses.',
  },
];
