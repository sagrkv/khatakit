import type { LegalCitation } from '../types';
import { cgstSection47, cgstSection50 } from '../sources/cgst-act';
import {
  gstnReturnTimeBarAdvisory,
  notification07_2023,
  notification13_2017,
  notification19_2021,
  notification20_2021,
  notification76_2018,
} from '../sources/gst-notifications';

export const gstLateFeeCitations: LegalCitation[] = [
  {
    source: cgstSection47,
    excerpt:
      'One hundred rupees for every day... subject to a maximum amount of five thousand rupees; for ' +
      'section 44, a maximum of a quarter per cent. of his turnover in the State or Union territory.',
    relevance:
      'The statutory fee, reduced by the notifications below. Each amount is charged under CGST ' +
      'and again under SGST, so totals are doubled.',
  },
  {
    source: notification76_2018,
    excerpt: 'Twenty-five rupees for every day... where central tax payable is nil, ten rupees for every day.',
    relevance: 'GSTR-3B fee of ₹50 a day, or ₹20 a day for a nil return, across CGST and SGST.',
  },
  {
    source: notification19_2021,
    excerpt: 'Nil - two hundred and fifty rupees; up to rupees 1.5 crores - one thousand rupees; up to rupees 5 crores - two thousand and five hundred rupees.',
    relevance:
      'GSTR-3B caps of ₹500 (nil), ₹2,000 and ₹5,000. Above ₹5 crore section 47(1) caps it at ₹10,000.',
  },
  {
    source: notification20_2021,
    excerpt: 'Nil outward supplies - two hundred and fifty rupees; the same turnover caps as GSTR-3B.',
    relevance: 'GSTR-1 uses the same daily fee and caps as GSTR-3B.',
  },
  {
    source: notification07_2023,
    excerpt: 'Twenty-five rupees per day (fifty above five crore), subject to a maximum of 0.02 per cent. of turnover in the State.',
    relevance:
      'GSTR-9 fee of ₹50 or ₹100 a day capped at 0.04% of State turnover. Above ₹20 crore ' +
      'section 47(2) applies: ₹200 a day capped at 0.5%.',
  },
  {
    source: cgstSection50,
    excerpt: 'Shall be levied on that portion of the tax that is paid by debiting the electronic cash ledger.',
    relevance:
      'Interest on a late GSTR-3B runs from the day after the due date and only on tax paid in ' +
      'cash. GSTR-1 and GSTR-9 carry no tax payment, so no interest.',
  },
  {
    source: notification13_2017,
    excerpt: 'Sub-section (1) of section 50 - 18.',
    relevance: 'Interest is 18% a year, counted per day on a 365-day year.',
  },
  {
    source: gstnReturnTimeBarAdvisory,
    excerpt: 'Returns shall not be allowed to be filed after the expiry of a period of three years from the due date.',
    relevance: 'The calculator warns when the filing date is past that limit.',
  },
];
