import { Fragment } from 'react';
import BreakdownTable from '../../components/calculator/BreakdownTable';
import { Notice } from '../../components/ui/Surface';
import { formatCurrency } from '../../lib/utils/format';
import { displayDate } from './dates';
import type { GstInput, GstResult } from './types';
import { formatWithPaise, noInterestReason } from './workings';

interface Props {
  input: GstInput;
  result: GstResult;
}

export default function InterestWorking({ input, result }: Props) {
  const reason = noInterestReason(input, result);

  if (reason) {
    return <Notice title="No interest">{reason.replace(/^No interest\. /, '')}</Notice>;
  }
  if (result.cashTax === 0) {
    return (
      <Notice title="Interest is nil">
        No tax paid in cash was entered. Enter it to work out interest. Tax paid from input tax
        credit carries no interest.
      </Notice>
    );
  }

  // Each term keeps its figure and operator together, so the line wraps between terms.
  const terms = [
    `${formatCurrency(result.cashTax)} ×`,
    `${result.interestRate}% ×`,
    `${result.interestDays} ÷ 365`,
    `= ${formatWithPaise(result.interestExact)},`,
    `rounded to ${formatCurrency(result.interest)}`,
  ];

  return (
    <div>
      <h4 className="section-title">Interest</h4>
      <BreakdownTable
        caption="Interest working"
        columns={[
          { key: 'item', label: 'Item', align: 'left' },
          { key: 'value', label: 'Value', align: 'right', mono: true },
        ]}
        rows={[
          { item: 'Tax paid in cash', value: formatCurrency(result.cashTax) },
          { item: 'Rate', value: `${result.interestRate}% a year` },
          { item: 'Interest from, the day after the due date', value: displayDate(result.interestFrom) },
          {
            item: 'Interest to, the filing date taken as the payment date',
            value: displayDate(result.interestTo),
          },
          { item: 'Days', value: `${result.interestDays} days` },
        ]}
      />
      <p className="formula formula-follow">
        {terms.map((term, index) => (
          <Fragment key={index}>
            {index > 0 && ' '}
            <span className="formula-term">{term}</span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}
