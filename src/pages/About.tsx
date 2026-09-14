import PageShell from '../components/layout/PageShell';
import { Panel } from '../components/ui/Surface';
import Disclaimer from '../components/ui/Disclaimer';
import ToolIcon from '../components/ui/ToolIcon';
export default function About() {
  return (
    <>
      <PageShell
        title="About Khatakit"
        description="A collection of free accounting, tax and financial calculators for India."
        eyebrow="The project"
        icon="briefcase"
        reading
      >
        <div className="content-stack">
          <Panel title="What is Khatakit?" icon="grid">
            <div className="prose">
              <p>
                <strong>Khata means ledger. Kit means toolkit.</strong> Khatakit brings together
                free calculators for taxes, loans and everyday accounting in India.
              </p>
              <p>
                The current tools cover GST late fees and interest, advance tax, presumptive income
                and loan EMI. Each calculator includes its assumptions and calculation breakdown.
              </p>
              <p>The calculators are free to use and do not require an account.</p>
            </div>
          </Panel>
          <Panel title="Privacy" icon="shield">
            <div className="prose">
              <ul className="principles">
                {[
                  [
                    'Local calculations',
                    'Your financial inputs are processed in your browser, without sending them to a calculation server.',
                  ],
                  [
                    'No accounts or tracking',
                    'The tools do not use analytics, tracking pixels or cookies.',
                  ],
                  [
                    'No saved financial inputs',
                    'Working values stay in page memory. Reloading the page clears them; copying results is your choice.',
                  ],
                  [
                    'Locally served assets',
                    'The website serves its own scripts and icons. Opening the site still makes normal requests to the static host.',
                  ],
                ].map(([title, body]) => (
                  <li key={title}>
                    <ToolIcon name="check" />
                    <span>
                      <strong>{title}.</strong> {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
          <Panel title="Source code and contributions" icon="info">
            <div className="prose">
              <p>
                We’re building Khatakit as an open-source project. You can inspect the source,
                suggest useful tools and help improve the calculations, explanations or
                accessibility.
              </p>
              <p>
                When reporting a calculation issue, include the tool name, relevant period and a
                made-up example. Keep personal financial records out of public issues.
              </p>
            </div>
            <div className="page-actions">
              <a
                className="button button-primary"
                href="https://github.com/sagrkv/khatakit"
                target="_blank"
                rel="noopener noreferrer"
              >
                View the project <ToolIcon name="arrow" />
              </a>
              <a
                className="button button-secondary"
                href="https://github.com/sagrkv/khatakit/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue
              </a>
            </div>
          </Panel>
          <Disclaimer title="Scope and limitations">
            The tools provide estimates and educational information. Check each calculator’s
            supported period, assumptions and source references. Tax rules and individual
            circumstances can differ; consult a qualified professional for decisions about your
            obligations.
          </Disclaimer>
        </div>
      </PageShell>
    </>
  );
}
