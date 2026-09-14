import type { ReactNode } from 'react';
import { toolCategories, tools } from '../../data/tools';
import CalculatorFaq from '../calculator/CalculatorFaq';
import ResultJump from '../calculator/ResultJump';
import { Panel } from '../ui/Surface';
import PageShell from './PageShell';

const RESULTS_ID = 'results';

interface Props {
  /** Catalogue slug. Name, direct answer, category, icon, review date and FAQ come from src/data/tools.ts. */
  slug: string;
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
  slug,
  period,
  formTitle,
  form,
  children,
  hasResult,
  caveat,
  layout = 'split',
  guide,
}: Props) {
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) throw new Error(`No catalogue entry for calculator "${slug}"`);
  const category = toolCategories.find((item) => item.id === tool.category)?.label;

  return (
    <PageShell
      title={tool.name}
      description={tool.answer}
      eyebrow={category}
      icon={tool.icon}
      period={period}
      reviewed={tool.rulesReviewed}
    >
      <div className={`calculator-layout calculator-layout-${layout}`}>
        <aside className="calculator-inputs">
          <Panel title={formTitle} icon={tool.icon}>
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
      <CalculatorFaq items={tool.faq} />
    </PageShell>
  );
}
