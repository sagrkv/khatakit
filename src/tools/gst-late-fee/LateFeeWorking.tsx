import BreakdownTable from '../../components/calculator/BreakdownTable';
import { Notice } from '../../components/ui/Surface';
import { formatCurrency } from '../../lib/utils/format';
import { displayDate } from './dates';
import type { GstInput, GstResult } from './types';
import { capExplanation } from './workings';

interface Props {
  input: GstInput;
  result: GstResult;
}

export default function LateFeeWorking({ input, result }: Props) {
  const cap = capExplanation(input, result);

  return (
    <>
      <div>
        <h4 className="section-title">Dates used</h4>
        <BreakdownTable
          caption="Dates used"
          columns={[
            { key: 'item', label: 'Item', align: 'left' },
            { key: 'value', label: 'Date', align: 'right', mono: true },
          ]}
          rows={[
            { item: 'Due date', value: displayDate(result.dueDate) },
            { item: 'Filing date', value: displayDate(result.filingDate) },
            {
              item: 'Days late, from the day after the due date to the filing date',
              value: `${result.daysLate} days`,
            },
            {
              item: 'Last date to file, three years from the due date',
              value: displayDate(result.lastFilingDate),
            },
          ]}
        />
      </div>

      <div>
        <h4 className="section-title">Late fee per head</h4>
        <BreakdownTable
          caption="Late fee per head"
          columns={[
            { key: 'item', label: 'Item', align: 'left' },
            { key: 'value', label: 'Amount', align: 'right', mono: true },
          ]}
          rows={[
            { item: 'Fee per day, per head', value: formatCurrency(result.lateFeePerDayPerHead) },
            { item: 'Days late', value: `${result.daysLate} days` },
            { item: 'Fee before the cap, per head', value: formatCurrency(result.rawLateFeePerHead) },
            { item: 'Cap, per head', value: formatCurrency(result.capPerHead) },
            { item: 'CGST late fee', value: formatCurrency(result.cgstLateFee) },
            { item: 'SGST/UTGST late fee', value: formatCurrency(result.sgstLateFee) },
          ]}
          footer={{ item: 'Late fee', value: formatCurrency(result.cappedLateFee) }}
        />
      </div>

      <Notice title={cap.title}>{cap.detail}</Notice>
    </>
  );
}
