import BreakdownTable from '../../components/calculator/BreakdownTable';
import CalculatorGuide, {
  Formula,
  GuideSection,
  ReferenceLinks,
} from '../../components/calculator/CalculatorGuide';
import RelatedTools from '../../components/calculator/RelatedTools';
import { gstCalculatorCitations } from '../../lib/legal/citations/gst-calculator';
import { calculateBill } from './calc';
import { formatPaise, formatRate, formatSignedPaise } from './format';

// Worked examples are calculated with the same code as the calculator, so the page cannot drift from it.
const mixedBill = calculateBill({
  supplyType: 'intra',
  roundToRupee: true,
  lines: [
    { id: 1, description: '', amountPaise: 123450, priceType: 'exclusive', rateMilli: 5000 },
    { id: 2, description: '', amountPaise: 259999, priceType: 'exclusive', rateMilli: 18000 },
    { id: 3, description: '', amountPaise: 84525, priceType: 'exclusive', rateMilli: 40000 },
  ],
});

const inclusiveLine = (supplyType: 'intra' | 'inter', amountPaise: number, rateMilli: number) =>
  calculateBill({
    supplyType,
    roundToRupee: false,
    lines: [{ id: 1, description: '', amountPaise, priceType: 'inclusive', rateMilli }],
  }).lines[0];

const reverseIntra = inclusiveLine('intra', 99900, 5000);
const reverseInter = inclusiveLine('inter', 99900, 5000);
const noExactAnswer = inclusiveLine('intra', 10010, 18000);

const p = formatPaise;

function source(id: string) {
  const citation = gstCalculatorCitations.find((item) => item.source.id === id);
  if (!citation) throw new Error(`Missing GST calculator source: ${id}`);
  return citation.source;
}

const references = [
  {
    title: source('gst-calculator-cgst-s15').reference,
    detail: 'Value of a taxable supply. GST is charged on the taxable value, which does not include the GST.',
    url: source('gst-calculator-cgst-s15').url,
  },
  {
    title: source('gst-calculator-it-rate-9-2025').reference,
    detail: 'Integrated tax rates on goods from 22 September 2025, the total rates in the rate list.',
    url: source('gst-calculator-it-rate-9-2025').url,
  },
  {
    title: 'Notifications No. 9/2025 and 19/2025-Central Tax (Rate)',
    detail:
      'Central tax rates on goods, and the removal of the 28% rate from 1 February 2026. Search for the notification number on the CBIC tax information portal.',
    url: source('gst-calculator-ct-rate-9-2025').url,
  },
  {
    title: source('gst-calculator-cgst-s170').reference,
    detail: 'Rounding of tax and other amounts payable to the nearest rupee, used for the optional bill round-off.',
    url: source('gst-calculator-cgst-s170').url,
  },
];

export default function GstGuide() {
  return (
    <CalculatorGuide title="How GST is worked out">
      <GuideSection title="Formula">
        <p>For an amount excluding GST (add GST):</p>
        <Formula where={<>Each tax is rounded to the paisa.</>}>
          Taxable value = amount
          <br />
          Within the state: CGST = SGST = taxable value × (rate ÷ 2)
          <br />
          Between states: IGST = taxable value × rate
          <br />
          Line total = taxable value + tax
        </Formula>
        <p>For an amount including GST (remove GST, reverse GST):</p>
        <Formula
          where={
            <>
              The calculator takes the largest paise amount whose taxable value plus rounded tax
              does not go over the amount. If that total is a paisa or two short of the amount, the
              difference is shown as a round-off on the line.
            </>
          }
        >
          Taxable value ≈ amount ÷ (1 + rate)
        </Formula>
        <p>
          Lines are added together and grouped by rate. If you choose to round the bill, the total
          goes to the nearest rupee: 50 paise or more rounds up, and the difference is shown as a
          round-off.
        </p>
      </GuideSection>

      <GuideSection title="Rounding method">
        <p>
          This is the method Khatakit uses. The CGST Act does not say how to round paise on each
          invoice line.
        </p>
        <ul>
          <li>
            Tax is worked out on each line, then added up. Each tax is rounded to the paisa, and
            half a paisa rounds up.
          </li>
          <li>
            CGST and SGST are each rounded, so they are always equal and always add up to the tax
            shown.
          </li>
          <li>
            Section 170 of the CGST Act rounds tax and other amounts payable to the nearest rupee,
            with 50 paise or more rounding up. The optional bill round-off uses the same rule.
          </li>
          <li>
            Billing software that works out tax on the total for each rate, instead of on each
            line, can differ by a paisa.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Worked example">
        <p>
          A bill within the state with three lines, all excluding GST: 1,234.50 at 5%, 2,599.99 at
          18% and 845.25 at 40%.
        </p>
        <BreakdownTable
          caption="Worked example by rate, in rupees"
          columns={[
            { key: 'rate', label: 'Rate', align: 'left' },
            { key: 'taxable', label: 'Taxable value', align: 'right', mono: true },
            { key: 'cgst', label: 'CGST', align: 'right', mono: true },
            { key: 'sgst', label: 'SGST', align: 'right', mono: true },
            { key: 'total', label: 'Total', align: 'right', mono: true },
          ]}
          rows={mixedBill.byRate.map((rate) => ({
            rate: formatRate(rate.rateMilli),
            taxable: p(rate.taxablePaise),
            cgst: p(rate.cgstPaise),
            sgst: p(rate.sgstPaise),
            total: p(rate.totalPaise),
          }))}
          footer={{
            rate: 'Bill',
            taxable: p(mixedBill.taxablePaise),
            cgst: p(mixedBill.cgstPaise),
            sgst: p(mixedBill.sgstPaise),
            total: p(mixedBill.subtotalPaise),
          }}
        />
        <p>
          On the 5% line, CGST is 1,234.50 × 2.5% = 30.8625, which rounds to 30.86. Rounded to the
          nearest rupee, the bill total of {p(mixedBill.subtotalPaise)} becomes{' '}
          {p(mixedBill.totalPaise)}, with a round-off of{' '}
          {formatSignedPaise(mixedBill.rupeeRoundOffPaise)}.
        </p>
        <p>
          Removing GST: 999.00 including GST at 5% within the state gives a taxable value of{' '}
          {p(reverseIntra.taxablePaise)}, CGST {p(reverseIntra.cgstPaise)} and SGST{' '}
          {p(reverseIntra.sgstPaise)}, which add back to {p(reverseIntra.totalPaise)}. Between
          states the same amount gives a taxable value of {p(reverseInter.taxablePaise)} and IGST{' '}
          {p(reverseInter.igstPaise)}.
        </p>
      </GuideSection>

      <GuideSection title="Edge cases">
        <ul>
          <li>
            <strong>No exact paise answer.</strong> {p(noExactAnswer.amountPaise)} including 18%
            within the state: a taxable value of 84.83 gives 7.63 + 7.63 = 100.09, and 84.84 gives
            7.64 + 7.64 = 100.12. The calculator shows {p(noExactAnswer.taxablePaise)} with a
            round-off of {formatSignedPaise(noExactAnswer.roundOffPaise)}.
          </li>
          <li>
            <strong>Mixed rates.</strong> Add a line for each rate or each item. The results group
            lines by rate.
          </li>
          <li>Lines including GST and lines excluding GST can be mixed in the same bill.</li>
          <li>A 0% line has no tax. Its taxable value is the amount entered.</li>
          <li>On very small amounts a tax can round to 0.00, for example 0.05 at 5%.</li>
          <li>
            <strong>Within the state and between states</strong> can differ by a paisa on the same
            amount, because CGST and SGST are rounded separately. 0.20 at 5% gives CGST 0.01 and
            SGST 0.01, but IGST 0.01.
          </li>
          <li>Changing the supply type recalculates every line.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Assumptions">
        <ul>
          <li>The rate you choose is the correct rate for the goods or service.</li>
          <li>Within a union territory, SGST stands for UTGST. The amount is the same.</li>
          <li>
            Compensation cess and other cesses, reverse charge, discounts, the composition scheme
            and special valuation rules are not covered.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Supported period">
        <p>
          The rate list covers GST on goods under Notification 9/2025-Central Tax (Rate) and
          9/2025-Integrated Tax (Rate), in force from 22 September 2025: 5%, 18% and 40%, plus 3%
          for gold, silver, platinum, pearls, jewellery and coins, 1.5% for diamonds other than
          rough diamonds, and 0.25% for rough diamonds and precious and semi-precious stones.
        </p>
        <p>
          The 28% rate for pan masala and tobacco products was removed from 1 February 2026, so the
          list matches supplies from that date. For an earlier supply at 28%, a service, or any
          other rate, choose Other rate and type it in. Rates were checked on 14 September 2026.
        </p>
      </GuideSection>

      <GuideSection title="References">
        <ReferenceLinks items={references} />
      </GuideSection>

      <GuideSection title="Related calculators">
        <RelatedTools
          slugs={['gst-late-fee', 'tds-interest', 'advance-tax']}
          reasons={{
            'gst-late-fee': 'Late fee and interest on a GST return filed after its due date.',
          }}
        />
      </GuideSection>
    </CalculatorGuide>
  );
}
