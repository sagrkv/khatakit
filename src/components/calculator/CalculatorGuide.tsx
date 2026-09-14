import { useId, type ReactNode } from 'react';

/** Explanatory content shown under a calculator, readable without entering data. */
export default function CalculatorGuide({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className="calculator-guide" aria-labelledby={id}>
      <h2 id={id} className="guide-title">
        {title}
      </h2>
      <div className="guide-grid">{children}</div>
    </section>
  );
}

export function GuideSection({
  title,
  wide = false,
  children,
}: {
  title: string;
  /** Spans both columns on wide screens. */
  wide?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section
      className={`guide-section${wide ? ' guide-section-wide' : ''}`}
      aria-labelledby={id}
    >
      <h3 id={id} className="section-title">
        {title}
      </h3>
      <div className="prose guide-prose">{children}</div>
    </section>
  );
}

export interface Reference {
  title: string;
  /** What the page uses from this source. */
  detail: string;
  url: string;
}

/** Links to primary sources. */
export function ReferenceLinks({ items }: { items: Reference[] }) {
  return (
    <ul className="guide-references">
      {items.map((item) => (
        <li key={item.url}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title} <span aria-hidden="true">↗</span>
          </a>
          <span>{item.detail}</span>
        </li>
      ))}
    </ul>
  );
}

/** A formula set in the numeric face, with a plain-language key. */
export function Formula({ children, where }: { children: ReactNode; where?: ReactNode }) {
  return (
    <div className="guide-formula">
      <p className="guide-formula-expression">{children}</p>
      {where && <div className="guide-formula-key">{where}</div>}
    </div>
  );
}
