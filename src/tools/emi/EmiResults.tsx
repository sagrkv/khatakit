import type { EmiResult } from './types';
import { formatCurrency } from '../../lib/utils/format';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';

interface EmiResultsProps {
  result: EmiResult;
  principal: number;
}

function PieChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  if (total === 0) return null;

  const principalPct = (principal / total) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const principalDash = (principalPct / 100) * circumference;

  return (
    <div className="flex items-center justify-center gap-6">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="16" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1976B8"
          strokeWidth="16"
          strokeDasharray={`${principalDash} ${circumference - principalDash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary-600" />
          <span className="text-neutral-600">Principal ({principalPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-neutral-200" />
          <span className="text-neutral-600">Interest ({(100 - principalPct).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}

export default function EmiResults({ result, principal }: EmiResultsProps) {
  if (result.emi === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="text-neutral-600">Enter loan details to see EMI calculation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Monthly EMI" value={formatCurrency(result.emi)} variant="primary" />
        <ResultCard label="Total Interest" value={formatCurrency(result.totalInterest)} variant="error" />
        <ResultCard label="Total Payable" value={formatCurrency(result.totalPayable)} variant="neutral" />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 text-center text-base font-semibold text-neutral-800">
          Principal vs Interest
        </h3>
        <PieChart principal={principal} interest={result.totalInterest} />
      </div>

      {result.schedule.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800">Year-wise Amortization</h3>
            <CopyButton
              text={result.schedule
                .map(
                  (e) =>
                    `Year ${e.year}: Principal ${formatCurrency(e.principalPaid)}, Interest ${formatCurrency(e.interestPaid)}, Balance ${formatCurrency(e.balance)}`
                )
                .join('\n')}
              label="Copy"
            />
          </div>
          <BreakdownTable
            columns={[
              { key: 'year', label: 'Year', align: 'left' },
              { key: 'principal', label: 'Principal', align: 'right', mono: true },
              { key: 'interest', label: 'Interest', align: 'right', mono: true },
              { key: 'balance', label: 'Balance', align: 'right', mono: true },
            ]}
            rows={result.schedule.map((e) => ({
              year: `Year ${e.year}`,
              principal: formatCurrency(e.principalPaid),
              interest: formatCurrency(e.interestPaid),
              balance: formatCurrency(e.balance),
            }))}
            footer={{
              year: 'Total',
              principal: formatCurrency(principal),
              interest: formatCurrency(result.totalInterest),
              balance: formatCurrency(0),
            }}
            caption="Year-wise amortization schedule"
          />
        </div>
      )}
    </div>
  );
}
