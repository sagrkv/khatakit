import type { Faq } from '../../seo/types';

// Direct answer and FAQ for the page. Figures are exact, so no rounding is involved.

export const ANSWER =
  'Add GST by multiplying the amount by the rate: ₹10,000 at 18% has ₹1,800 GST, a total of ₹11,800. To remove GST, divide the amount including GST by 1 plus the rate: ₹11,800 ÷ 1.18 is ₹10,000.';

export const FAQ: Faq[] = [
  {
    question: 'How do I calculate GST on an amount?',
    answer: 'Multiply the amount before tax by the GST rate, then add it on. ₹10,000 at 18% has GST of ₹1,800, so the total including GST is ₹11,800.',
  },
  {
    question: 'How do I remove GST from an amount that includes GST?',
    answer: 'Divide the amount by 1 plus the rate to get the taxable value. The GST is the difference. ₹11,800 including 18% GST has a taxable value of ₹10,000 and GST of ₹1,800.',
  },
  {
    question: 'When do I charge CGST and SGST, and when IGST?',
    answer: 'A supply within a state carries CGST and SGST, each at half the rate. A supply between states carries IGST at the full rate. On ₹10,000 at 18%, that is ₹900 CGST and ₹900 SGST, or ₹1,800 IGST. Within a union territory, UTGST takes the place of SGST.',
  },
  {
    question: 'What are the GST rates on goods?',
    answer: 'The rate list in force from 22 September 2025 has 5%, 18% and 40%, plus 3% for gold, silver, platinum, pearls, jewellery and coins, 1.5% for diamonds other than rough diamonds, and 0.25% for rough diamonds and precious and semi-precious stones. The 28% rate for pan masala and tobacco products was removed from 1 February 2026.',
  },
  {
    question: 'How is GST rounded?',
    answer: 'The CGST Act does not say how to round paise on each invoice line, so Khatakit rounds each tax to the paisa, and half a paisa rounds up. If you round the bill, the total goes to the nearest rupee with 50 paise or more rounding up, the same rule as section 170 of the CGST Act.',
  },
];
