import type { LegalSource } from '../types';

const BASE =
  'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active';

export const cgstSection47: LegalSource = {
  id: 'cgst-act-s47',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 47, Central Goods and Services Tax Act, 2017',
  title: 'Levy of late fee',
  text:
    '(1) Any registered person who fails to furnish the details of outward supplies required ' +
    'under section 37 or returns required under section 39 or section 45 or section 52 by the ' +
    'due date shall pay a late fee of one hundred rupees for every day during which such failure ' +
    'continues subject to a maximum amount of five thousand rupees. (2) Any registered person ' +
    'who fails to furnish the return required under section 44 by the due date shall be liable ' +
    'to pay a late fee of one hundred rupees for every day during which such failure continues ' +
    'subject to a maximum of an amount calculated at a quarter per cent. of his turnover in the ' +
    'State or Union territory.',
  url: `${BASE}/chapter9/section47_v1.00.html`,
  effectiveDate: '2022-10-01',
};

export const cgstSection50: LegalSource = {
  id: 'cgst-act-s50',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 50(1) and (2), Central Goods and Services Tax Act, 2017',
  title: 'Interest on delayed payment of tax',
  text:
    '(1) ...interest at such rate, not exceeding eighteen per cent., as may be notified... ' +
    'Provided that the interest on tax payable in respect of supplies made during a tax period ' +
    'and declared in the return for the said period furnished after the due date in accordance ' +
    'with the provisions of section 39, except where such return is furnished after commencement ' +
    'of any proceedings under section 73 or section 74 or section 74A in respect of the said ' +
    'period, shall be levied on that portion of the tax that is paid by debiting the electronic ' +
    'cash ledger. (2) The interest under sub-section (1) shall be calculated... from the day ' +
    'succeeding the day on which such tax was due to be paid.',
  url: `${BASE}/chapter10/section50_v1.00.html`,
  effectiveDate: '2017-07-01',
};
