import { EmptyState, Panel } from '../../components/ui/Surface';
import LoanBreakdown from '../../components/calculator/LoanBreakdown';
import ResultCard from '../../components/calculator/ResultCard';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';
import DownloadButton from '../../components/calculator/DownloadButton';
import ValidationSummary from '../../components/calculator/ValidationSummary';
import { formatCurrency } from '../../lib/utils/format';
import EmiYearChart from './EmiYearChart';
import { emiScheduleCsv, emiScheduleFilename, emiSummaryText } from './csv';
import type { EmiField } from './schema';
import type { EmiInput, EmiResult } from './types';

interface EmiResultsProps {
  input: EmiInput | null;
  result: EmiResult | null;
  errors: Partial<Record<EmiField, string>>;
}

export default function EmiResults({ input, result, errors }: EmiResultsProps) {
  if (Object.keys(errors).length > 0) return <ValidationSummary errors={errors} />;
  if (!input || !result) {
    return <EmptyState>Enter the loan amount to see the EMI and repayment schedule.</EmptyState>;
  }

  return (
    <div className="result-stack">
      <div className="result-grid result-grid-three">
        <ResultCard label="Monthly EMI" value={formatCurrency(result.emi)} variant="primary" />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(result.totalInterest)}
          variant="neutral"
        />
        <ResultCard
          label="Total Payable"
          value={formatCurrency(result.totalPayable)}
          variant="neutral"
          subtext={`Over ${input.tenureMonths} ${input.tenureMonths === 1 ? 'month' : 'months'}`}
        />
      </div>

      <Panel title="Principal and interest breakdown">
        <LoanBreakdown principal={input.principal} interest={result.totalInterest} />
      </Panel>

      <Panel title="Principal and interest by loan year">
        <EmiYearChart schedule={result.schedule} />
      </Panel>

      <div>
        <div className="section-heading">
          <h3 className="section-title">Year-wise Amortisation</h3>
          <div className="result-actions">
            <CopyButton text={emiSummaryText(input, result)} label="Copy" />
            <DownloadButton
              label="Download CSV"
              filename={emiScheduleFilename(input)}
              getContent={() => emiScheduleCsv(input)}
            />
          </div>
        </div>
        <BreakdownTable
          columns={[
            { key: 'year', label: 'Loan Year', align: 'left' },
            { key: 'principal', label: 'Principal', align: 'right', mono: true },
            { key: 'interest', label: 'Interest', align: 'right', mono: true },
            { key: 'balance', label: 'Balance', align: 'right', mono: true },
          ]}
          rows={result.schedule.map((entry) => ({
            year: `Year ${entry.year}`,
            principal: formatCurrency(entry.principalPaid),
            interest: formatCurrency(entry.interestPaid),
            balance: formatCurrency(entry.balance),
          }))}
          footer={{
            year: 'Total',
            principal: formatCurrency(input.principal),
            interest: formatCurrency(result.totalInterest),
            balance: formatCurrency(0),
          }}
          caption="Year-wise amortisation schedule"
        />
        <p className="field-help">
          Loan years count from the first EMI, not financial years. The CSV lists every month.
        </p>
      </div>
    </div>
  );
}
