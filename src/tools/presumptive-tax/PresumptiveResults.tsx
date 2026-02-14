import type { PresumptiveResult } from './types';
import { formatCurrency, formatPercent } from '../../lib/utils/format';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';

interface PresumptiveResultsProps {
  result: PresumptiveResult;
}

export default function PresumptiveResults({ result }: PresumptiveResultsProps) {
  if (result.grossReceipts === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="text-neutral-600">Enter your receipts to see the calculation.</p>
      </div>
    );
  }

  const rows = [
    { item: 'Gross Receipts', amount: formatCurrency(result.grossReceipts) },
    {
      item: `Presumptive Income (${result.scheme === '44ADA' ? '50%' : 'weighted'})`,
      amount: formatCurrency(result.presumptiveIncome),
    },
    { item: 'Taxable Income (after std. deduction)', amount: formatCurrency(result.taxableIncome) },
    { item: 'Tax on Income', amount: formatCurrency(result.taxLiability) },
    ...(result.surcharge > 0
      ? [{ item: 'Surcharge', amount: formatCurrency(result.surcharge) }]
      : []),
    { item: 'Health & Education Cess (4%)', amount: formatCurrency(result.cess) },
  ];

  return (
    <div className="space-y-6">
      {!result.isWithinLimit && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">Turnover Limit Exceeded</p>
          <p className="mt-1 text-sm text-amber-600">
            Your gross receipts of {formatCurrency(result.grossReceipts)} exceed the{' '}
            {result.scheme} limit of {formatCurrency(result.applicableLimit)}. The presumptive
            scheme may not be applicable. Please consult a CA.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Presumptive Income"
          value={formatCurrency(result.presumptiveIncome)}
          variant="primary"
          subtext={`${formatPercent(result.presumptiveRate, 1)} of gross receipts`}
        />
        <ResultCard
          label="Total Tax"
          value={formatCurrency(result.totalTax)}
          variant={result.totalTax === 0 ? 'success' : 'neutral'}
        />
        <ResultCard
          label="Effective Tax Rate"
          value={formatPercent(result.effectiveRate)}
          variant="neutral"
          subtext="On gross receipts"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">Tax Computation</h3>
          <CopyButton
            text={`Presumptive Income: ${formatCurrency(result.presumptiveIncome)}, Tax: ${formatCurrency(result.totalTax)}, Effective Rate: ${formatPercent(result.effectiveRate)}`}
            label="Copy"
          />
        </div>
        <BreakdownTable
          columns={[
            { key: 'item', label: 'Particulars', align: 'left' },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          rows={rows}
          footer={{
            item: 'Total Tax Payable',
            amount: formatCurrency(result.totalTax),
          }}
          caption="Presumptive tax computation"
        />
      </div>
    </div>
  );
}
