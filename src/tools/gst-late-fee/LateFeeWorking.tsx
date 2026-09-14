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
  const head = (name: string, fee: number) => ({
    head: name,
    perDay: formatCurrency(result.lateFeePerDayPerHead),
    days: String(result.daysLate),
    before: formatCurrency(result.rawLateFeePerHead),
    cap: formatCurrency(result.capPerHead),
    payable: formatCurrency(fee),
  });

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
            { key: 'head', label: 'Head', align: 'left' },
            { key: 'perDay', label: 'Per day', align: 'right', mono: true },
            { key: 'days', label: 'Days late', align: 'right', mono: true },
            { key: 'before', label: 'Before cap', align: 'right', mono: true },
            { key: 'cap', label: 'Cap', align: 'right', mono: true },
            { key: 'payable', label: 'Payable', align: 'right', mono: true },
          ]}
          rows={[head('CGST', result.cgstLateFee), head('SGST/UTGST', result.sgstLateFee)]}
          footer={{
            head: 'Total',
            perDay: formatCurrency(result.lateFeePerDay),
            days: String(result.daysLate),
            before: formatCurrency(result.rawLateFee),
            cap: formatCurrency(result.lateFeeCapApplied),
            payable: formatCurrency(result.cappedLateFee),
          }}
        />
      </div>

      <Notice title={cap.title}>{cap.detail}</Notice>
    </>
  );
}
