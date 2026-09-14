import { EmptyState, Notice } from '../../components/ui/Surface';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';
import ValidationSummary from '../../components/calculator/ValidationSummary';
import { ADVANCE_TAX_THRESHOLD } from '../../lib/constants/tax-slabs';
import { PRESUMPTIVE_PROFESSION } from '../../lib/constants/presumptive';
import { incomeTaxRows } from '../../lib/tax/slab-breakdown';
import { formatCurrency, formatPercent } from '../../lib/utils/format';
import type { PresumptiveField } from './schema';
import type { PresumptiveResult } from './types';
import type { TaxRegime } from '../../lib/tax/types';

interface PresumptiveResultsProps {
  result: PresumptiveResult | null;
  regime: TaxRegime;
  errors: Partial<Record<PresumptiveField, string>>;
}

function summaryText(result: PresumptiveResult): string {
  return [
    `Scheme: section 58(2), old ${result.scheme}`,
    `Gross receipts: ${formatCurrency(result.grossReceipts)}`,
    `Cash receipts: ${formatCurrency(result.cashReceipts)} (${formatPercent(result.cashSharePercent)})`,
    `Limit: ${formatCurrency(result.applicableLimit)} (${result.isWithinLimit ? 'within' : 'above'})`,
    `Presumptive income: ${formatCurrency(result.presumptiveIncome)}`,
    `Total tax: ${formatCurrency(result.totalTax)}`,
    `Effective rate on receipts: ${formatPercent(result.effectiveRate)}`,
  ].join('\n');
}

export default function PresumptiveResults({ result, regime, errors }: PresumptiveResultsProps) {
  if (Object.keys(errors).length > 0) return <ValidationSummary errors={errors} />;
  if (!result) return <EmptyState>Enter your receipts to see the calculation.</EmptyState>;

  const business = result.scheme === '44AD';
  const incomeRows = business
    ? [
        {
          item: `8% of cash and other receipts (${formatCurrency(result.cashReceipts)})`,
          amount: formatCurrency(result.cashIncome),
        },
        {
          item: `6% of bank and online receipts (${formatCurrency(result.digitalReceipts)})`,
          amount: formatCurrency(result.digitalIncome),
        },
      ]
    : [
        {
          item: `${PRESUMPTIVE_PROFESSION.rate}% of gross receipts`,
          amount: formatCurrency(result.presumptiveIncome),
        },
      ];

  const rows = [
    { item: business ? 'Gross Turnover' : 'Gross Receipts', amount: formatCurrency(result.grossReceipts) },
    {
      item: `Cash is ${formatPercent(result.cashSharePercent)} of receipts, so the limit is ${formatCurrency(result.applicableLimit)}`,
      amount: result.isWithinLimit ? 'Within limit' : 'Above limit',
    },
    ...incomeRows,
    { item: 'Presumptive Income (taxable)', amount: formatCurrency(result.presumptiveIncome) },
    ...incomeTaxRows(result.taxableIncome, regime, 'below60', {
      ...result,
      taxAfterRebate: result.taxLiability,
    }),
  ];

  return (
    <div className="result-stack">
      {!result.isWithinLimit && (
        <Notice title="Receipts Above the Limit" tone="warning">
          Gross receipts of {formatCurrency(result.grossReceipts)} are above the{' '}
          {formatCurrency(result.applicableLimit)} limit that applies when cash is{' '}
          {formatPercent(result.cashSharePercent)} of receipts. Presumptive taxation under section
          58(2) is not available at this level. Please consult a CA.
        </Notice>
      )}

      <div className="result-grid result-grid-three">
        <ResultCard
          label="Presumptive Income"
          value={formatCurrency(result.presumptiveIncome)}
          variant="primary"
          subtext={`${formatPercent(result.presumptiveRate, 2)} of gross receipts`}
        />
        <ResultCard
          label="Total Tax"
          value={formatCurrency(result.totalTax)}
          variant={result.totalTax === 0 ? 'success' : 'neutral'}
          subtext={regime === 'new' ? 'New regime' : 'Old regime, below-60 slabs'}
        />
        <ResultCard
          label="Effective Tax Rate"
          value={formatPercent(result.effectiveRate)}
          variant="neutral"
          subtext="On gross receipts"
        />
      </div>

      <div>
        <div className="section-heading">
          <h3 className="section-title">Tax Computation</h3>
          <CopyButton text={summaryText(result)} label="Copy" />
        </div>
        <BreakdownTable
          columns={[
            { key: 'item', label: 'Particulars', align: 'left' },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          rows={rows}
          footer={{ item: 'Total Tax Payable', amount: formatCurrency(result.totalTax) }}
          caption="Presumptive tax computation"
        />
      </div>

      {result.totalTax >= ADVANCE_TAX_THRESHOLD && (
        <Notice title="Advance Tax by 15 March 2027" tone="info">
          Presumptive filers pay the whole advance tax in one instalment by 15 March 2027 (section
          408(2)). On this estimate that is {formatCurrency(result.totalTax)}, less any TDS. It
          applies when tax after TDS is ₹10,000 or more.
        </Notice>
      )}
    </div>
  );
}
