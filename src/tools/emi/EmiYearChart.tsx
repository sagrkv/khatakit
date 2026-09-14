import { useState } from 'react';
import { formatCurrency } from '../../lib/utils/format';
import type { AmortizationEntry } from './types';

const interestShare = (entry: AmortizationEntry) => {
  const total = entry.principalPaid + entry.interestPaid;
  return total > 0 ? `${((entry.interestPaid / total) * 100).toFixed(1)}%` : '0.0%';
};

/**
 * Principal and interest paid in each loan year. The year-wise table is the
 * accessible view, so the plot is hidden from assistive technology and the
 * caption states what it shows.
 */
export default function EmiYearChart({ schedule }: { schedule: AmortizationEntry[] }) {
  const [active, setActive] = useState<number | null>(null);
  if (schedule.length === 0) return null;

  const largest = Math.max(...schedule.map((entry) => entry.principalPaid + entry.interestPaid), 1);
  const shown = schedule[active ?? 0];
  const first = schedule[0];
  const last = schedule[schedule.length - 1];

  return (
    <figure className="year-chart">
      <div className="year-chart-readout" aria-hidden="true">
        <strong>Year {shown.year}</strong>
        <span className="year-chart-key">
          <span className="legend-dot principal-dot" />
          Principal {formatCurrency(shown.principalPaid)}
        </span>
        <span className="year-chart-key">
          <span className="legend-dot interest-dot" />
          Interest {formatCurrency(shown.interestPaid)}
        </span>
      </div>
      <div className="year-chart-plot" aria-hidden="true" onMouseLeave={() => setActive(null)}>
        {schedule.map((entry, index) => (
          <div
            key={entry.year}
            className="year-chart-column"
            data-active={active === index}
            onMouseEnter={() => setActive(index)}
          >
            <div
              className="year-chart-stack"
              style={{ height: `${((entry.principalPaid + entry.interestPaid) / largest) * 100}%` }}
            >
              <span
                className="year-chart-principal"
                style={{ flex: `${entry.principalPaid} 1 0` }}
              />
              {entry.interestPaid > 0 && (
                <span
                  className="year-chart-interest"
                  style={{ flex: `${entry.interestPaid} 1 0` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="year-chart-axis" aria-hidden="true">
        <span>Year {first.year}</span>
        {schedule.length > 1 && <span>Year {last.year}</span>}
      </div>
      <figcaption>
        {schedule.length > 1
          ? `Interest is ${interestShare(first)} of the payments in year ${first.year} and ${interestShare(last)} in year ${last.year}, because interest is charged on the balance still owed.`
          : `Interest is ${interestShare(first)} of the payments.`}{' '}
        The table below lists every amount.
      </figcaption>
    </figure>
  );
}
