import { useCallback, useState, useRef } from 'react';
import { formatIndianNumber } from '../../lib/utils/format';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  id?: string;
  /** Validation message. Marks the field invalid and is announced with it. */
  error?: string;
  /**
   * Send NaN for text that is not a number instead of ignoring it, so the page
   * can explain the problem. Use with `error`.
   */
  reportInvalid?: boolean;
}

/** Indian grouping that keeps decimals: 8.5 stays 8.5 and 125000.75 becomes 1,25,000.75. */
function formatForDisplay(value: number): string {
  if (Number.isInteger(value)) return formatIndianNumber(value);
  const sign = value < 0 ? '-' : '';
  const [whole, fraction] = String(Math.abs(value)).split('.');
  return `${sign}${formatIndianNumber(Number(whole))}.${fraction}`;
}

export default function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  placeholder = '0',
  helpText,
  id,
  error,
  reportInvalid = false,
}: NumberInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [rawValue, setRawValue] = useState(value === 0 ? '' : String(value));
  const invalidNumber = Number.isNaN(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(reportInvalid ? /[,\s]/g : /,/g, '');
      setRawValue(e.target.value);

      if (input === '' || input === '-') {
        onChange(0);
        return;
      }

      const num = Number(input);
      if (Number.isNaN(num)) {
        if (reportInvalid) onChange(Number.NaN);
        return;
      }
      const clamped =
        min !== undefined && max !== undefined
          ? Math.min(max, Math.max(min, num))
          : min !== undefined
            ? Math.max(min, num)
            : max !== undefined
              ? Math.min(max, num)
              : num;
      onChange(clamped);
    },
    [onChange, min, max, reportInvalid]
  );

  const displayValue =
    isFocused || invalidNumber ? rawValue : value === 0 ? '' : formatForDisplay(value);
  const describedBy =
    [helpText ? `${inputId}-help` : '', error ? `${inputId}-error` : ''].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="field">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <div className="field-control">
        {prefix && <span className="field-affix field-affix-start">{prefix}</span>}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => {
            if (!invalidNumber) setRawValue(value === 0 ? '' : String(value));
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          placeholder={placeholder}
          step={step}
          className={`control control-number ${prefix ? 'control-prefix' : ''} ${suffix ? 'control-suffix' : ''}`}
        />
        {suffix && <span className="field-affix field-affix-end">{suffix}</span>}
      </div>
      {helpText && (
        <p id={`${inputId}-help`} className="field-help">
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
