import { formatRate, PRICE_TYPE_PHRASES } from './format';
import type { BillResult } from './types';
import { billRoundingStep, lineWorkings } from './workings';

interface Props {
  result: BillResult;
  roundToRupee: boolean;
}

export default function GstWorkings({ result, roundToRupee }: Props) {
  const rounding = billRoundingStep(result, roundToRupee);
  return (
    <div>
      <h3 className="section-title">Workings</h3>
      <ol className="workings">
        {result.lines.map((line, index) => (
          <li key={line.id}>
            <p className="workings-title">
              Line {index + 1}
              {line.description ? `: ${line.description}` : ''} - {formatRate(line.rateMilli)},{' '}
              {PRICE_TYPE_PHRASES[line.priceType]}
            </p>
            {lineWorkings(line, result.supplyType).map((step) => (
              <p className="formula" key={step}>
                {step}
              </p>
            ))}
          </li>
        ))}
        {rounding && (
          <li>
            <p className="workings-title">Bill</p>
            <p className="formula">{rounding}</p>
          </li>
        )}
      </ol>
    </div>
  );
}
