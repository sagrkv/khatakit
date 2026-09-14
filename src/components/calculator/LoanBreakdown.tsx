import { formatCurrency } from '../../lib/utils/format';

export default function LoanBreakdown({
  principal,
  interest,
}: {
  principal: number;
  interest: number;
}) {
  const total = principal + interest;
  if (!Number.isFinite(total) || total <= 0) return null;
  const principalPct = Math.max(0, Math.min(100, (principal / total) * 100));
  return (
    <figure className="loan-breakdown" aria-label="Loan repayment breakdown">
      <div className="loan-ring">
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <circle
            cx="80"
            cy="80"
            r="64"
            fill="none"
            stroke="var(--chart-interest)"
            strokeWidth="15"
          />
          <circle
            className="loan-ring-segment"
            cx="80"
            cy="80"
            r="64"
            pathLength="100"
            fill="none"
            stroke="var(--chart-principal)"
            strokeWidth="15"
            strokeDasharray={`${principalPct} ${100 - principalPct}`}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="loan-ring-centre">
          <strong>{(100 - principalPct).toFixed(1)}%</strong>
          <span>
            of repayments
            <br />
            goes to interest
          </span>
        </div>
      </div>
      <figcaption>
        <dl className="loan-legend">
          <div>
            <dt>
              <span className="legend-dot principal-dot" />
              Amount borrowed <small>{principalPct.toFixed(1)}%</small>
            </dt>
            <dd>{formatCurrency(principal)}</dd>
          </div>
          <div>
            <dt>
              <span className="legend-dot interest-dot" />
              Interest over the loan <small>{(100 - principalPct).toFixed(1)}%</small>
            </dt>
            <dd>{formatCurrency(interest)}</dd>
          </div>
        </dl>
        <p className="loan-total">
          Total repayment <strong>{formatCurrency(total)}</strong>
        </p>
      </figcaption>
    </figure>
  );
}
