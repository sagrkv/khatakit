import type { AdvanceTaxResult, TaxComputation } from './types';
import { formatCurrency } from '../../lib/utils/format';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';

interface AdvanceTaxResultsProps {
  result: AdvanceTaxResult;
}

function TaxSheet({ label, comp }: { label: string; comp: TaxComputation }) {
  const rows = [
    { item: 'Gross Total Income', amount: formatCurrency(comp.grossIncome) },
    { item: 'Standard Deduction', amount: formatCurrency(-comp.standardDeduction) },
    ...(comp.otherDeductions > 0
      ? [{ item: 'Other Deductions (Ch. VI-A)', amount: formatCurrency(-comp.otherDeductions) }]
      : []),
    { item: 'Taxable Income', amount: formatCurrency(comp.taxableIncome) },
    { item: 'Tax on Income', amount: formatCurrency(comp.taxOnIncome) },
    ...(comp.rebate87A > 0
      ? [{ item: 'Less: Section 87A Rebate', amount: formatCurrency(-comp.rebate87A) }]
      : []),
    ...(comp.surcharge > 0
      ? [{ item: 'Surcharge', amount: formatCurrency(comp.surcharge) }]
      : []),
    { item: 'Health & Education Cess (4%)', amount: formatCurrency(comp.cess) },
    { item: 'Total Tax', amount: formatCurrency(comp.totalTax) },
    { item: 'Less: TDS Deducted', amount: formatCurrency(-comp.tdsDeducted) },
  ];

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold text-neutral-800">{label}</h3>
      <BreakdownTable
        columns={[
          { key: 'item', label: 'Particulars', align: 'left' },
          { key: 'amount', label: 'Amount', align: 'right', mono: true },
        ]}
        rows={rows}
        footer={{
          item: 'Net Tax Payable',
          amount: formatCurrency(comp.netTaxPayable),
        }}
        caption={`Tax computation - ${label}`}
      />
    </div>
  );
}

export default function AdvanceTaxResults({ result }: AdvanceTaxResultsProps) {
  const selected = result.selectedRegime === 'old' ? result.oldRegime : result.newRegime;
  const other = result.selectedRegime === 'old' ? result.newRegime : result.oldRegime;
  const savings = other.netTaxPayable - selected.netTaxPayable;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          label="Net Tax Payable"
          value={formatCurrency(selected.netTaxPayable)}
          variant={selected.netTaxPayable === 0 ? 'success' : 'primary'}
        />
        <ResultCard
          label={savings > 0 ? 'You Save (vs other regime)' : 'Comparison'}
          value={savings > 0 ? formatCurrency(savings) : formatCurrency(Math.abs(savings))}
          variant={savings > 0 ? 'success' : 'neutral'}
          subtext={
            savings > 0
              ? `${result.selectedRegime === 'old' ? 'Old' : 'New'} regime is better for you`
              : savings < 0
                ? `${result.selectedRegime === 'old' ? 'New' : 'Old'} regime saves ${formatCurrency(Math.abs(savings))}`
                : 'Both regimes result in the same tax'
          }
        />
      </div>

      {/* Regime comparison side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        <TaxSheet label="New Regime" comp={result.newRegime} />
        <TaxSheet label="Old Regime" comp={result.oldRegime} />
      </div>

      {/* Advance Tax Schedule */}
      {result.schedule.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800">Advance Tax Schedule</h3>
            <CopyButton
              text={result.schedule
                .map((q) => `${q.dueDate}: ${formatCurrency(q.installmentAmount)}`)
                .join('\n')}
              label="Copy"
            />
          </div>
          <BreakdownTable
            columns={[
              { key: 'quarter', label: 'Quarter', align: 'left' },
              { key: 'dueDate', label: 'Due Date', align: 'left' },
              { key: 'percent', label: 'Cumulative %', align: 'right', mono: true },
              { key: 'installment', label: 'Installment', align: 'right', mono: true },
              { key: 'cumulative', label: 'Cumulative', align: 'right', mono: true },
            ]}
            rows={result.schedule.map((q) => ({
              quarter: q.quarter,
              dueDate: q.dueDate,
              percent: `${q.cumulativePercent}%`,
              installment: formatCurrency(q.installmentAmount),
              cumulative: formatCurrency(q.cumulativeAmount),
            }))}
            caption="Quarterly advance tax schedule"
          />
        </div>
      )}

      {!selected.isAdvanceTaxApplicable && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-800">Advance Tax Not Applicable</p>
          <p className="mt-1 text-sm text-green-600">
            Your net tax liability of {formatCurrency(selected.netTaxPayable)} is below the Rs.
            10,000 threshold.
          </p>
        </div>
      )}
    </div>
  );
}
