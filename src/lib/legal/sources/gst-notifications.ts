import type { LegalSource } from '../types';

const CBIC = 'Central Board of Indirect Taxes and Customs (CBIC)';

const notification = (
  id: string,
  reference: string,
  title: string,
  text: string,
  url: string,
  effectiveDate: string
): LegalSource => ({ id, type: 'notification', authority: CBIC, reference, title, text, url, effectiveDate });

export const notification76_2018 = notification(
  'notif-76-2018-ct',
  'Notification No. 76/2018-Central Tax, dated 31-12-2018',
  'Daily late fee for GSTR-3B',
  'Waives late fee for GSTR-3B in excess of twenty-five rupees for every day during which such ' +
    'failure continues; where the total amount of central tax payable in the said return is nil, ' +
    'in excess of ten rupees for every day.',
  'https://gstcouncil.gov.in/sites/default/files/2024-05/notfctn-76-central-tax-english-2018.pdf',
  '2018-12-31'
);

export const notification19_2021 = notification(
  'notif-19-2021-ct',
  'Notification No. 19/2021-Central Tax, dated 01-06-2021',
  'Maximum late fee for GSTR-3B',
  'For the tax period June, 2021 onwards or quarter ending June, 2021 onwards, late fee is ' +
    'waived in excess of: two hundred and fifty rupees where central tax payable is nil; one ' +
    'thousand rupees for aggregate turnover up to rupees 1.5 crores in the preceding financial ' +
    'year; two thousand and five hundred rupees for more than rupees 1.5 crores and up to rupees ' +
    '5 crores.',
  'https://cbic-gst.gov.in/pdf/central-tax/notfctn-19-central-tax-english-2021.pdf',
  '2021-06-01'
);

export const notification20_2021 = notification(
  'notif-20-2021-ct',
  'Notification No. 20/2021-Central Tax, dated 01-06-2021',
  'Maximum late fee for GSTR-1',
  'For the tax period June, 2021 onwards, late fee for GSTR-1 is waived in excess of: two ' +
    'hundred and fifty rupees for registered persons who have nil outward supplies in the tax ' +
    'period; one thousand rupees for aggregate turnover up to rupees 1.5 crores in the preceding ' +
    'financial year; two thousand and five hundred rupees for more than rupees 1.5 crores and up ' +
    'to rupees 5 crores.',
  'https://cbic-gst.gov.in/pdf/central-tax/notfctn-20-central-tax-english-2021.pdf',
  '2021-06-01'
);

export const notification07_2023 = notification(
  'notif-07-2023-ct',
  'Notification No. 07/2023-Central Tax, dated 31-03-2023',
  'Late fee for GSTR-9 annual return',
  'For the return under section 44 for the financial year 2022-23 onwards, late fee is waived in ' +
    'excess of: twenty-five rupees per day, subject to a maximum of 0.02 per cent. of turnover in ' +
    'the State or Union territory, for aggregate turnover up to five crore rupees in the relevant ' +
    'financial year; fifty rupees per day, subject to the same 0.02 per cent. maximum, for more ' +
    'than five crore and up to twenty crore rupees.',
  'https://gstcouncil.gov.in/sites/default/files/2024-05/07_eng.pdf',
  '2023-03-31'
);

export const notification13_2017 = notification(
  'notif-13-2017-ct',
  'Notification No. 13/2017-Central Tax, dated 28-06-2017',
  'Rate of interest under section 50',
  'Rate of interest per annum: sub-section (1) of section 50 - 18.',
  'https://gstcouncil.gov.in/sites/default/files/2024-04/notfctn-13-central-tax-english.pdf',
  '2017-07-01'
);

export const gstnReturnTimeBarAdvisory: LegalSource = {
  id: 'gstn-advisory-2025-06-07-time-bar',
  type: 'guideline',
  authority: 'Goods and Services Tax Network (GSTN)',
  reference: 'GSTN advisory dated 07-06-2025 on barring of returns after three years',
  title: 'Barring of GST returns on expiry of three years',
  text:
    'Returns shall not be allowed to be filed after the expiry of a period of three years from ' +
    'the due date (GSTR-1, 3B, 4, 5, 5A, 6, 7, 8 and 9). The said restriction will be ' +
    'implemented on the GST portal from July 2025 Tax period.',
  url: 'https://www.mahagst.gov.in/public/uploads/gstnadvisory/1760596541_353%20Barring%20of%20GST%20Return%20on%20expiry%20of%20three%20years.pdf',
  effectiveDate: '2025-07-01',
};
