import { useCallback, useState, useRef, useEffect } from 'react';
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
}: NumberInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [rawValue, setRawValue] = useState(value === 0 ? '' : String(value));

  useEffect(() => {
    if (!isFocused) {
      setRawValue(value === 0 ? '' : String(value));
    }
  }, [value, isFocused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/,/g, '');
      setRawValue(input);

      if (input === '' || input === '-') {
        onChange(0);
        return;
      }

      const num = Number(input);
      if (!Number.isNaN(num)) {
        const clamped =
          min !== undefined && max !== undefined
            ? Math.min(max, Math.max(min, num))
            : min !== undefined
              ? Math.max(min, num)
              : max !== undefined
                ? Math.min(max, num)
                : num;
        onChange(clamped);
      }
    },
    [onChange, min, max]
  );

  const displayValue = isFocused ? rawValue : value === 0 ? '' : formatIndianNumber(value);

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          step={step}
          className={`w-full rounded-lg border border-neutral-200 py-3 font-mono text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
            prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-8' : 'px-4'
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="mt-1 text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
