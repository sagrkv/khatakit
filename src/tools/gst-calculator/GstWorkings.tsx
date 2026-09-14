import { formatRate, PRICE_TYPE_PHRASES } from './format';
import type { BillResult, LineResult } from './types';
import { billRoundingStep, lineWorkings } from './workings';

interface Props {
  result: BillResult;
  roundToRupee: boolean;
}

export default function GstWorkings({ result, roundToRupee }: Props) {
  const rounding = billRoundingStep(result, roundToRupee);
  const [first] = result.lines;
  const describe = (line: LineResult) =>
    `${formatRate(line.rateMilli)}, ${PRICE_TYPE_PHRASES[line.priceType]}`;
  const steps = (line: LineResult) =>
    lineWorkings(line, result.supplyType).map((step) => (
      <p className="formula" key={step}>
        {step}
      </p>
    ));

  return (
    <div>
      <h3 className="section-title">Workings</h3>
      {result.lines.length === 1 ? (
        <div>
          <p className="workings-title">
            {first.description ? `${first.description}: ` : ''}
            {describe(first)}
          </p>
          {steps(first)}
        </div>
      ) : (
        <ul className="workings-list">
          {result.lines.map((line, index) => (
            <li key={line.id}>
              <details className="workings-details">
                <summary>
                  <span className="workings-details-title">
                    Line {index + 1}
                    {line.description ? `: ${line.description}` : ''}
                  </span>
                  <span className="workings-details-meta">{describe(line)}</span>
                </summary>
                <div className="workings-details-body">{steps(line)}</div>
              </details>
            </li>
          ))}
        </ul>
      )}
      {rounding && <p className="formula formula-follow">{rounding}</p>}
    </div>
  );
}
