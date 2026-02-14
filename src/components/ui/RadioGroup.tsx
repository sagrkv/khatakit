interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  helpText?: string;
}

export default function RadioGroup({ label, value, onChange, options, helpText }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-neutral-700">{label}</legend>
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
              value === opt.value
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {helpText && <p className="mt-1 text-xs text-neutral-500">{helpText}</p>}
    </fieldset>
  );
}
