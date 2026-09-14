import BreakdownTable from '../../components/calculator/BreakdownTable';
import CalculatorGuide, {
  Formula,
  GuideSection,
  ReferenceLinks,
} from '../../components/calculator/CalculatorGuide';
import RelatedTools from '../../components/calculator/RelatedTools';
import { ADVANCE_TAX_SCHEDULE } from '../../lib/constants/tax-slabs';
import { formatCurrency as rupees } from '../../lib/utils/format';
import { REBATE_EXAMPLE as relief, SALARY_EXAMPLE as salary, WORKED_EXAMPLE as ex } from './example';

const AMOUNT_COLUMNS = [
  { key: 'item', label: 'Particulars', align: 'left' as const },
  { key: 'amount', label: 'Amount', align: 'right' as const, mono: true },
];

export default function AdvanceTaxGuide() {
  const workings = [
    { item: 'Salary', amount: rupees(ex.input.salaryIncome) },
    { item: 'Other income', amount: rupees(ex.otherIncome) },
    { item: 'Less: Standard deduction (salary only)', amount: rupees(-ex.standardDeduction) },
    { item: 'Taxable income', amount: rupees(ex.taxableIncome) },
    ...ex.slabs.map((slab) => ({
      item: `${slab.rate}% on ${rupees(slab.from)} to ${rupees(slab.to)}`,
      amount: rupees(slab.tax),
    })),
    { item: 'Tax on income (no rebate above ₹12 lakh)', amount: rupees(ex.taxOnIncome) },
    { item: 'Health & Education Cess (4%)', amount: rupees(ex.cess) },
    { item: 'Total tax', amount: rupees(ex.totalTax) },
    { item: 'Less: TDS', amount: rupees(-ex.input.tdsDeducted) },
  ];

  return (
    <CalculatorGuide title="How advance tax is worked out">
      <GuideSection title="Formula">
        <Formula
          where={
            <>
              Standard deduction is ₹75,000 (new regime) or ₹50,000 (old regime), and never more
              than the salary or pension entered. Chapter VI-A deductions count only in the old
              regime.
            </>
          }
        >
          Taxable income = gross income − standard deduction − deductions
          <br />
          Tax = slab tax − rebate + surcharge + 4% cess
          <br />
          Net tax = tax − TDS
          <br />
          Instalment = net tax × cumulative % − earlier instalments
        </Formula>
      </GuideSection>

      <GuideSection title="Due dates for tax year 2026-27">
        <BreakdownTable
          columns={[
            { key: 'date', label: 'Pay by', align: 'left' },
            { key: 'percent', label: 'Cumulative share', align: 'right', mono: true },
          ]}
          rows={ADVANCE_TAX_SCHEDULE.map((q) => ({
            date: q.dueDate,
            percent: `${q.cumulativePercent}%`,
          }))}
          caption="Advance tax due dates, section 408(1)"
        />
        <p>
          If you declare presumptive income under section 58(2), pay the whole amount by 15 March
          2027 instead (section 408(2)).
        </p>
      </GuideSection>

      <GuideSection title="Worked example" wide>
        <p>
          A resident below 60 expects a salary of {rupees(ex.input.salaryIncome)} and{' '}
          {rupees(ex.otherIncome)} of other income, in the new regime. TDS for the year is{' '}
          {rupees(ex.input.tdsDeducted)}.
        </p>
        <BreakdownTable
          columns={AMOUNT_COLUMNS}
          rows={workings}
          footer={{ item: 'Net tax payable', amount: rupees(ex.netTaxPayable) }}
          caption="Worked example, new regime"
        />
        <p>
          Net tax of {rupees(ex.netTaxPayable)} is ₹10,000 or more, so advance tax is due in four
          instalments:{' '}
          {ADVANCE_TAX_SCHEDULE.map((q, index) => `${rupees(ex.instalments[index])} by ${q.dueDate}`).join(
            ', '
          )}
          . In the old regime with no deductions, total tax on the same income is{' '}
          {rupees(ex.oldRegimeTotalTax)}.
        </p>
      </GuideSection>

      <GuideSection title="Edge cases">
        <ul>
          <li>
            <strong>Rebate near ₹12 lakh.</strong> In the new regime, taxable income up to
            ₹12,00,000 pays no tax, because the rebate covers up to ₹60,000. Above that, tax cannot
            be more than the income above ₹12 lakh. At {rupees(relief.taxableIncome)}, slab tax is{' '}
            {rupees(relief.taxOnIncome)}, relief of {rupees(relief.relief)} brings it to ₹10,000,
            and with cess the total is {rupees(relief.totalTax)}. The relief ends at about ₹12.7
            lakh of taxable income.
          </li>
          <li>
            <strong>Standard deduction is for salary only.</strong> A salary of{' '}
            {rupees(salary.income)} leaves ₹12,00,000 taxable and {rupees(salary.salariedTax)} tax.
            The same amount of business or other income gets no standard deduction, so tax is{' '}
            {rupees(salary.nonSalaryTax)}.
          </li>
          <li>
            <strong>Old regime rebate.</strong> Up to ₹12,500 when taxable income is ₹5,00,000 or
            less. There is no marginal relief above ₹5 lakh.
          </li>
          <li>
            <strong>Seniors.</strong> A resident aged 60 or more with no business or professional
            income does not pay advance tax (section 403(3)). Tax due is paid as self-assessment
            tax before filing. With business or professional income, the instalments apply.
          </li>
          <li>
            <strong>The ₹10,000 threshold.</strong> Advance tax applies when net tax after TDS is
            ₹10,000 or more (section 404). At ₹9,999 no instalments are due.
          </li>
          <li>
            <strong>High incomes.</strong> Surcharge starts above ₹50 lakh, with marginal relief at
            each threshold. The new regime caps it at 25%.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Assumptions">
        <ul>
          <li>You are a resident individual. Non-residents do not get the rebate.</li>
          <li>
            All income is taxed at slab rates. Capital gains and other special-rate income are not
            supported.
          </li>
          <li>
            Interest for missed or short instalments under sections 424 and 425 is not calculated.
          </li>
          <li>Income and tax are not rounded to the nearest ₹10.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Supported period">
        <p>
          Tax year 2026-27, which runs from 1 April 2026 to 31 March 2027. The Income-tax Act,
          2025 applies from 1 April 2026 and replaces the Income-tax Act, 1961. The Finance Act,
          2026 kept the slab rates, rebate, standard deduction and due dates unchanged.
        </p>
        <p>Earlier years fall under the 1961 Act and are not supported.</p>
      </GuideSection>

      <GuideSection title="References">
        <ReferenceLinks
          items={[
            {
              title: 'Income-tax Act, 2025 (Gazette of India)',
              detail:
                'Sections 19(1) standard deduction, 156 rebate, 202(1) new regime rates, 403 seniors, 404 threshold, 408 instalments.',
              url: 'https://egazette.gov.in/WriteReadData/2025/265620.pdf',
            },
            {
              title: 'Finance Act, 2026 (Gazette of India)',
              detail:
                'First Schedule Part III old regime rates; section 3 surcharge, marginal relief and cess.',
              url: 'https://egazette.gov.in/WriteReadData/2026/271439.pdf',
            },
            {
              title: 'Memorandum explaining the Finance Bill, 2026',
              detail: 'Confirms rates for individuals were not changed.',
              url: 'https://www.indiabudget.gov.in/doc/memo.pdf',
            },
          ]}
        />
      </GuideSection>

      <GuideSection title="Related calculators">
        <RelatedTools
          slugs={['presumptive-tax', 'tds-interest']}
          reasons={{
            'presumptive-tax':
              'Presumptive income under section 58, with advance tax due by 15 March.',
          }}
        />
      </GuideSection>
    </CalculatorGuide>
  );
}
