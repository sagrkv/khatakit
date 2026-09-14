import Button from '../../components/ui/Button';
import RadioGroup from '../../components/ui/RadioGroup';
import ToolIcon from '../../components/ui/ToolIcon';
import { PRICE_TYPE_LABELS } from './format';
import { lineFieldId } from './ids';
import { CUSTOM_RATE, RATE_OPTIONS } from './rates';
import { MAX_DESCRIPTION, type LineField, type LineForm } from './schema';
import type { PriceType } from './types';

interface Props {
  line: LineForm;
  index: number;
  canRemove: boolean;
  amountError?: string;
  rateError?: string;
  onChange: (patch: Partial<LineForm>) => void;
  onRemove: () => void;
  onBlurField: (field: LineField) => void;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="field-error" id={id}>
      {message}
    </p>
  ) : null;
}

const optionsIn = (group: (typeof RATE_OPTIONS)[number]['group']) =>
  RATE_OPTIONS.filter((option) => option.group === group).map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

export default function GstLineFields({
  line,
  index,
  canRemove,
  amountError,
  rateError,
  onChange,
  onRemove,
  onBlurField,
}: Props) {
  const number = index + 1;
  const ids = {
    description: lineFieldId(line.id, 'description'),
    amount: lineFieldId(line.id, 'amount'),
    rate: lineFieldId(line.id, 'rate'),
    customRate: lineFieldId(line.id, 'customRate'),
  };

  return (
    <fieldset className="bill-line">
      <legend className="sr-only">Line {number}</legend>
      <div className="bill-line-head">
        <span className="bill-line-title" aria-hidden="true">
          Line {number}
        </span>
        {canRemove && (
          <Button variant="ghost" onClick={onRemove} aria-label={`Remove line ${number}`}>
            <ToolIcon name="trash" /> Remove
          </Button>
        )}
      </div>

      <div className="field">
        <label className="field-label" htmlFor={ids.description}>
          Description <span className="field-optional">(optional)</span>
        </label>
        <input
          className="control"
          id={ids.description}
          type="text"
          autoComplete="off"
          maxLength={MAX_DESCRIPTION}
          value={line.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={ids.amount}>
          Amount
        </label>
        <div className="field-control">
          <span className="field-affix field-affix-start" aria-hidden="true">
            ₹
          </span>
          <input
            className="control control-number control-prefix"
            id={ids.amount}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={line.amount}
            onChange={(event) => onChange({ amount: event.target.value })}
            onBlur={() => onBlurField('amount')}
            aria-invalid={amountError ? true : undefined}
            aria-describedby={amountError ? `${ids.amount}-error` : undefined}
          />
        </div>
        <FieldError id={`${ids.amount}-error`} message={amountError} />
      </div>

      <RadioGroup
        label="Amount is"
        value={line.priceType}
        onChange={(value) => onChange({ priceType: value as PriceType })}
        options={[
          { label: PRICE_TYPE_LABELS.exclusive, value: 'exclusive' },
          { label: PRICE_TYPE_LABELS.inclusive, value: 'inclusive' },
        ]}
      />

      <div className="field">
        <label className="field-label" htmlFor={ids.rate}>
          GST rate
        </label>
        <select
          className="control"
          id={ids.rate}
          value={line.rate}
          onChange={(event) => onChange({ rate: event.target.value })}
        >
          <optgroup label="Standard rates">{optionsIn('standard')}</optgroup>
          <optgroup label="Precious metals and stones">{optionsIn('special')}</optgroup>
          {optionsIn('other')}
        </select>
      </div>

      {line.rate === CUSTOM_RATE && (
        <div className="field">
          <label className="field-label" htmlFor={ids.customRate}>
            Other GST rate
          </label>
          <div className="field-control">
            <input
              className="control control-number control-suffix"
              id={ids.customRate}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="12"
              value={line.customRate}
              onChange={(event) => onChange({ customRate: event.target.value })}
              onBlur={() => onBlurField('customRate')}
              aria-invalid={rateError ? true : undefined}
              aria-describedby={`${ids.customRate}-help${rateError ? ` ${ids.customRate}-error` : ''}`}
            />
            <span className="field-affix field-affix-end" aria-hidden="true">
              %
            </span>
          </div>
          <p className="field-help" id={`${ids.customRate}-help`}>
            Total GST rate, up to 3 decimal places. CGST and SGST are each half.
          </p>
          <FieldError id={`${ids.customRate}-error`} message={rateError} />
        </div>
      )}
    </fieldset>
  );
}
