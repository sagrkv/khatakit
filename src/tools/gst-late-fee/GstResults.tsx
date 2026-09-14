import { Notice } from '../../components/ui/Surface';
import type { GstInput, GstResult } from './types';
import { formatCurrency } from '../../lib/utils/format';
import ResultCard from '../../components/calculator/ResultCard';
import CopyButton from '../../components/calculator/CopyButton';
import DownloadButton from '../../components/calculator/DownloadButton';
import LateFeeWorking from './LateFeeWorking';
import InterestWorking from './InterestWorking';
import { resultToCsv, resultToText } from './csv';
import { displayDate } from './dates';

interface GstResultsProps {
  input: GstInput;
  result: GstResult;
}

export default function GstResults({ input, result }: GstResultsProps) {
  if (result.daysLate === 0) {
    return result.filedOnDueDate ? (
      <Notice title="Filed on the due date" tone="success">
        Late fee and interest count from the day after the due date, so nothing is payable.
      </Notice>
    ) : (
      <Notice title="Filed before the due date" tone="success">
        No late fee or interest is payable.
      </Notice>
    );
  }

  return (
    <div className="result-stack">
      {result.isTimeBarred && (
        <Notice title="Return can no longer be filed" tone="warning">
          The GST portal does not accept a return more than three years after its due date. The last
          date to file this return was {displayDate(result.lastFilingDate)}. The figures below run
          to the filing date entered.
        </Notice>
      )}

      <div className="result-grid result-grid-three">
        <ResultCard
          label="Late Fee and Interest"
          value={formatCurrency(result.totalPenalty)}
          variant="error"
          subtext={`${result.daysLate} days late`}
        />
        <ResultCard
          label="Late Fee"
          value={formatCurrency(result.cappedLateFee)}
          variant="neutral"
          subtext={`CGST ${formatCurrency(result.cgstLateFee)} + SGST/UTGST ${formatCurrency(result.sgstLateFee)}`}
        />
        <ResultCard
          label="Interest"
          value={formatCurrency(result.interest)}
          variant="neutral"
          subtext={
            result.interestApplies
              ? `${result.interestRate}% a year for ${result.interestDays} days`
              : 'Not charged on this return'
          }
        />
      </div>

      <div className="section-heading">
        <h3 className="section-title">Workings</h3>
        <div className="result-actions">
          <CopyButton text={resultToText(input, result)} />
          <DownloadButton
            getContent={() => resultToCsv(input, result)}
            filename={`gst-late-fee-${input.returnType.toLowerCase()}-${result.dueDate}.csv`}
            label="Download CSV"
          />
        </div>
      </div>

      <LateFeeWorking input={input} result={result} />
      <InterestWorking input={input} result={result} />
    </div>
  );
}
