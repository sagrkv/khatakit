interface ResultCardProps {
  label: string;
  value: string;
  variant?: 'primary' | 'success' | 'error' | 'neutral';
  subtext?: string;
}
export default function ResultCard({
  label,
  value,
  variant = 'primary',
  subtext,
}: ResultCardProps) {
  return (
    <div className="result-card" data-tone={variant}>
      <p className="result-label">{label}</p>
      <p className="result-value" aria-live="polite">
        {value}
      </p>
      {subtext && <p className="result-subtext">{subtext}</p>}
    </div>
  );
}
