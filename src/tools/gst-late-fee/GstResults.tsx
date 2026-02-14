import type { GstResult } from './types';
import { formatCurrency } from '../../lib/utils/format';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';

interface GstResultsProps {
  result: GstResult;
}

export default function GstResults({ result }: GstResultsProps) {
  if (result.daysLate === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">No Late Fee Applicable</p>
        <p className="mt-1 text-sm text-green-600">The return was filed on or before the due date.</p>
      </div>
    );
  }

  const breakdownRows = [
    {
      item: 'Late Fee (CGST)',
      amount: formatCurrency(result.cgstLateFee),
    },
    {
      item: 'Late Fee (SGST)',
      amount: formatCurrency(result.sgstLateFee),
    },
    {
      item: 'Total Late Fee',
      amount: formatCurrency(result.cappedLateFee),
    },
    {
      item: `Interest (18% p.a. for ${result.daysLate} days)`,
      amount: formatCurrency(result.interest),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard label="Total Penalty" value={formatCurrency(result.totalPenalty)} variant="error" />
        <ResultCard label="Days Late" value={String(result.daysLate)} variant="neutral" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          label="Late Fee"
          value={formatCurrency(result.cappedLateFee)}
          variant="neutral"
          subtext={
            result.rawLateFee > result.cappedLateFee
              ? `Capped at ${formatCurrency(result.lateFeeCapApplied)} (uncapped: ${formatCurrency(result.rawLateFee)})`
              : `${formatCurrency(result.lateFeePerDay)}/day`
          }
        />
        <ResultCard
          label="Interest"
          value={formatCurrency(result.interest)}
          variant="neutral"
          subtext="18% p.a. on net tax liability"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">Breakdown</h3>
          <CopyButton
            text={`GST Late Fee: ${formatCurrency(result.cappedLateFee)}, Interest: ${formatCurrency(result.interest)}, Total: ${formatCurrency(result.totalPenalty)}`}
            label="Copy"
          />
        </div>
        <BreakdownTable
          columns={[
            { key: 'item', label: 'Component', align: 'left' },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          rows={breakdownRows}
          footer={{
            item: 'Total Penalty',
            amount: formatCurrency(result.totalPenalty),
          }}
        />
      </div>
    </div>
  );
}
