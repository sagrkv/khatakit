import BreakdownTable from '../../components/calculator/BreakdownTable';
import CalculatorGuide, {
  Formula,
  GuideSection,
  ReferenceLinks,
} from '../../components/calculator/CalculatorGuide';
import RelatedTools from '../../components/calculator/RelatedTools';
import { formatCurrency as rupees } from '../../lib/utils/format';
import { RBI_EXAMPLE as rbi, ZERO_RATE_EXAMPLE as zero } from './example';

export default function EmiGuide() {
  const row = (label: string, month: { openingBalance: number; interest: number; principal: number }) => ({
    month: label,
    opening: rupees(month.openingBalance),
    interest: rupees(month.interest),
    principal: rupees(month.principal),
    emi: rupees(month.interest + month.principal),
  });

  return (
    <CalculatorGuide title="How the EMI is calculated">
      <GuideSection title="Formula">
        <Formula
          where={
            <>
              P is the loan amount, r is the monthly rate (annual rate ÷ 12 ÷ 100) and n is the
              number of monthly instalments. At 0% interest, EMI = P ÷ n.
            </>
          }
        >
          EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)
        </Formula>
        <p>
          Each month, interest is the balance still owed × r. The rest of the EMI repays
          principal, so interest falls and principal rises over the loan. This is the reducing
          balance method.
        </p>
      </GuideSection>

      <GuideSection title="Rounding and the last instalment">
        <ul>
          <li>
            Amounts are rounded to the nearest rupee, with 50 paise or more rounded up, as in
            paragraph 457 of RBI&apos;s Directions.
          </li>
          <li>
            The schedule runs on the exact EMI, so the balance is zero after the last instalment.
            Only the amounts shown are rounded.
          </li>
          <li>
            Principal and interest in a row are rounded separately, so they can add up to ₹1 more
            or less than the EMI.
          </li>
          <li>
            At 0%, {rupees(zero.input.principal)} over {zero.input.tenureMonths} months gives an
            EMI of {rupees(zero.emi)}. Seven rounded EMIs add up to{' '}
            {rupees(zero.sumOfRoundedEmis)}, but the total payable is {rupees(zero.totalPayable)}.
          </li>
          <li>
            Lenders may round the EMI up and adjust the last instalment, so their figures can
            differ by a few rupees.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Worked example from RBI">
        <p>
          RBI&apos;s Key Facts Statement example is a loan of {rupees(rbi.input.principal)} at{' '}
          {rbi.input.annualRate}% a year for {rbi.input.tenureMonths} months. The monthly rate is{' '}
          {rbi.monthlyRatePercent}%, and the EMI is {rupees(rbi.emi)}.
        </p>
        <BreakdownTable
          columns={[
            { key: 'month', label: 'Month', align: 'left' },
            { key: 'opening', label: 'Opening Balance', align: 'right', mono: true },
            { key: 'interest', label: 'Interest', align: 'right', mono: true },
            { key: 'principal', label: 'Principal', align: 'right', mono: true },
            { key: 'emi', label: 'EMI', align: 'right', mono: true },
          ]}
          rows={[
            row('1', rbi.firstMonth),
            row('2', rbi.secondMonth),
            row(String(rbi.input.tenureMonths), rbi.lastMonth),
          ]}
          caption="RBI worked example, months 1, 2 and 24"
        />
        <p>
          Month 1 interest is {rupees(rbi.firstMonth.openingBalance)} × {rbi.monthlyRatePercent}% ={' '}
          {rupees(rbi.firstMonth.interest)}, so {rupees(rbi.firstMonth.principal)} of the EMI
          repays principal. Over the loan, interest totals {rupees(rbi.totalInterest)} and the total
          payable is {rupees(rbi.totalPayable)}. Enter these figures above to see the full
          schedule.
        </p>
      </GuideSection>

      <GuideSection title="Assumptions">
        <ul>
          <li>The interest rate stays the same for the whole loan.</li>
          <li>Instalments are monthly, and the first is due one month after the loan is paid out.</li>
          <li>
            Processing fees, broken-period interest, insurance, prepayments and rate changes are
            not included. They change the real cost of the loan.
          </li>
          <li>Loan years count from the first EMI, not financial years.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Supported period">
        <p>
          The EMI method does not change by year. The references are RBI (Commercial Banks -
          Responsible Business Conduct) Directions, 2025, as updated to 1 July 2026. RBI does not
          prescribe a formula; its worked example follows the reducing balance method used here.
        </p>
        <p>
          Banks give a Key Facts Statement with an amortisation schedule for retail and MSME term
          loans sanctioned from 1 October 2024. Directions for NBFCs and co-operative banks were
          not checked.
        </p>
      </GuideSection>

      <GuideSection title="References">
        <ReferenceLinks
          items={[
            {
              title: 'RBI (Commercial Banks - Responsible Business Conduct) Directions, 2025',
              detail:
                'Paragraph 4(11) defines the EMI, paragraph 348(3) has the worked example and paragraph 457 covers rounding.',
              url: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13140',
            },
            {
              title: 'RBI circular on the Key Facts Statement for loans and advances',
              detail:
                'DOR.STR.REC.13/13.03.00/2024-25, paragraph 11: applies from 1 October 2024.',
              url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0',
            },
          ]}
        />
      </GuideSection>

      <GuideSection title="Related calculators">
        <RelatedTools slugs={['advance-tax', 'gst-calculator']} />
      </GuideSection>
    </CalculatorGuide>
  );
}
