import { formatDisplayDate } from './dates';
import { formatPaise, formatRupees, plural } from './format';
import type { Period } from './types';

interface Props {
  title: string;
  period: Period;
  base: number;
}

/** One interest period: dates, each calendar month counted, and both month methods. */
export default function PeriodCard({ title, period, base }: Props) {
  const rate = `${period.ratePercent}%`;
  return (
    <section className="period-card" aria-label={title}>
      <div className="period-head">
        <h4>{title}</h4>
        <span className="period-rate">{rate} a month</span>
      </div>
      <p className="period-range">
        {formatDisplayDate(period.from)} to {formatDisplayDate(period.to)},{' '}
        {plural(period.days, 'day', 'days')}
      </p>
      <ol className="month-list" aria-label={`Calendar months counted, ${title.toLowerCase()}`}>
        {period.months.map((month) => (
          <li key={month}>{month}</li>
        ))}
      </ol>
      <dl className="period-figures">
        <div>
          <dt>Calendar months</dt>
          <dd>
            {period.months.length} × {rate} × {formatRupees(base)} ={' '}
            {formatPaise(period.calendarPaise)}
          </dd>
        </div>
        <div>
          <dt>30-day months ({plural(period.days, 'day', 'days')})</dt>
          <dd>
            {period.thirtyDayMonths} × {rate} × {formatRupees(base)} ={' '}
            {formatPaise(period.thirtyDayPaise)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
