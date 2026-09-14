import type { ReactNode } from 'react';
import PageShell from './PageShell';
import ResultJump from '../calculator/ResultJump';
import { Panel } from '../ui/Surface';

const RESULTS_ID = 'results';

interface Props {
  title: string;
  description: string;
  category: string;
  icon: string;
  period?: string;
  formTitle: string;
  form: ReactNode;
  children: ReactNode;
  /** True once the results area shows a calculated answer. */
  hasResult: boolean;
  /** One short line shown under a result. Full assumptions and sources live in the guide. */
  caveat: string;
  /** Split puts inputs beside the results. Stacked gives inputs the full width with results below. */
  layout?: 'split' | 'stacked';
  /** Formula, worked example, assumptions and references, shown below the calculator. */
  guide: ReactNode;
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
  hasResult,
  caveat,
  layout = 'split',
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
      <div className={`calculator-layout calculator-layout-${layout}`}>
        <aside className="calculator-inputs">
          <Panel title={formTitle} icon={icon}>
            {form}
            <p className="local-note">Calculations stay in your browser.</p>
          </Panel>
          {hasResult && <ResultJump target={RESULTS_ID} />}
        </aside>
        <div className="calculator-output">
          <section
            id={RESULTS_ID}
            tabIndex={-1}
            aria-label="Calculation results"
            className="result-stack"
          >
            {children}
          </section>
          {hasResult && (
            <p className="result-caveat">
              {caveat} <a href="#guide">Assumptions and sources</a>
            </p>
          )}
        </div>
      </div>
      <div id="guide" className="guide-anchor">
        {guide}
      </div>
    </PageShell>
  );
}
