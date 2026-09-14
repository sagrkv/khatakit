import type { ReactNode } from 'react';
import type { LegalCitation } from '../../lib/legal/types';
import PageShell from './PageShell';
import LegalBasis from '../calculator/LegalBasis';
import Disclaimer from '../ui/Disclaimer';
import { Panel } from '../ui/Surface';
interface Props {
  title: string;
  description: string;
  category: string;
  icon: string;
  period?: string;
  formTitle: string;
  form: ReactNode;
  children: ReactNode;
  citations: LegalCitation[];
  disclaimer: ReactNode;
  /** Formula, worked example and references, shown below the calculator. */
  guide?: ReactNode;
}
export default function CalculatorPage({
  title,
  description,
  category,
  icon,
  period,
  formTitle,
  form,
  children,
  citations,
  disclaimer,
  guide,
}: Props) {
  return (
    <PageShell
      title={title}
      description={description}
      eyebrow={category}
      icon={icon}
      period={period}
    >
      <div className="calculator-layout">
        <aside className="calculator-inputs">
          <Panel title={formTitle} icon={icon}>
            {form}
            <p className="local-note">Calculations stay in your browser.</p>
          </Panel>
        </aside>
        <div className="calculator-output">
          <section aria-label="Calculation results" className="result-stack">
            {children}
          </section>
          <LegalBasis citations={citations} />
          <Disclaimer>{disclaimer}</Disclaimer>
        </div>
      </div>
      {guide}
    </PageShell>
  );
}
