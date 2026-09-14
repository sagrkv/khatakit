import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToolIcon from '../components/ui/ToolIcon';
import { matchesTool, toolCategories, tools } from '../data/tools';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchRef = useRef<HTMLInputElement>(null);
  const matching = tools.filter((tool) => matchesTool(tool, query));
  const visible = matching.filter((tool) => category === 'all' || tool.category === category);
  const filtered = query.trim() !== '' || category !== 'all';

  function reset() {
    setQuery('');
    setCategory('all');
    searchRef.current?.focus();
  }

  return (
    <>
      <div className="workbench">
        <div className="workbench-main">
          <section className="workbench-intro" aria-labelledby="catalogue-title">
            <div className="hero-copy">
              <p className="workbench-kicker">KHATAKIT</p>
              <h1 id="catalogue-title">
                Accounting &
                <br />
                <span>tax tools</span>
              </h1>
              <p className="workbench-subtitle">Free calculators for GST, income tax and loans.</p>
              <p className="workbench-description">
                Each tool includes a calculation breakdown.
                <br />
                Calculations run in your browser.
              </p>
              <a
                className="hero-action"
                href="#tools"
                onClick={() => searchRef.current?.focus({ preventScroll: true })}
              >
                Browse tools <ToolIcon name="arrow" />
              </a>
              <div className="intro-points">
                <span>No signup</span>
                <span>No uploads</span>
                <span>Free to use</span>
              </div>
            </div>
            <div
              className="hero-art"
              aria-label="Illustrative GST calculation at an example rate of 18 percent"
            >
              <span className="art-caption">EXAMPLE CALCULATION</span>
              <div className="ledger-sheet">
                <div className="ledger-heading">
                  <ToolIcon name="receipt" />
                  <span>GST WORKSHEET</span>
                  <span className="ledger-dots" aria-hidden="true">
                    •••
                  </span>
                </div>
                <div className="ledger-subheading">
                  GST breakdown <span>Example</span>
                </div>
                <dl>
                  <div>
                    <dt>Amount before tax</dt>
                    <dd>₹10,000</dd>
                  </div>
                  <div>
                    <dt>Example GST rate</dt>
                    <dd>18%</dd>
                  </div>
                  <div>
                    <dt>GST amount</dt>
                    <dd>₹1,800</dd>
                  </div>
                </dl>
                <div className="ledger-total">
                  <span>Total, including GST</span>
                  <strong>
                    ₹11,800<span>.00</span>
                  </strong>
                </div>
                <p>₹10,000 + (₹10,000 × 18%)</p>
              </div>
              <span className="art-sticker">
                <span aria-hidden="true">✓</span> Calculation shown
              </span>
              <svg className="art-scribble" viewBox="0 0 100 80" fill="none" aria-hidden="true">
                <path
                  d="M8 14c60-20 80 20 43 24C16 40 50 4 80 60m-18-6 19 9 3-22"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>
          <section id="tools" className="tool-directory" aria-labelledby="directory-title">
            <div className="directory-intro">
              <p>TOOL CATALOGUE</p>
              <h2>Available calculators</h2>
            </div>
            <div className="tool-search">
              <ToolIcon name="search" />
              <label className="sr-only" htmlFor="tool-search">
                Search tools
              </label>
              <input
                ref={searchRef}
                id="tool-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setQuery('');
                  }
                }}
                placeholder="Find a tool: GST, income tax, EMI…"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="category-nav" role="group" aria-label="Filter tools by category">
              {[{ id: 'all', label: 'All tools' }, ...toolCategories].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  <ToolIcon
                    name={
                      item.id === 'all'
                        ? 'grid'
                        : item.id === 'gst'
                          ? 'receipt'
                          : item.id === 'loans'
                            ? 'banknotes'
                            : 'briefcase'
                    }
                  />
                  <span>{item.label}</span>
                  <small>
                    {item.id === 'all'
                      ? tools.length
                      : tools.filter((tool) => tool.category === item.id).length}
                  </small>
                </button>
              ))}
            </div>
            <div className="directory-toolbar">
              <h2 id="directory-title">
                {query
                  ? 'Search results'
                  : category === 'all'
                    ? 'All tools'
                    : toolCategories.find((item) => item.id === category)?.label}
                <span role="status">
                  {visible.length} {visible.length === 1 ? 'tool' : 'tools'}
                  {filtered ? ' found' : ' available'}
                </span>
              </h2>
              {filtered && (
                <button type="button" onClick={reset}>
                  <ToolIcon name="reset" /> Reset filters
                </button>
              )}
            </div>
            {visible.length === 0 ? (
              <div className="tools-empty">
                <ToolIcon name="search" />
                <h3>No tools match this search</h3>
                <p>
                  Try GST, 44ADA or loan repayment. You can also reset the category to see every
                  tool.
                </p>
                <button type="button" onClick={reset}>
                  Show all tools <ToolIcon name="arrow" />
                </button>
              </div>
            ) : (
              <div className="tool-grid">
                {visible.map((tool) => (
                  <Link
                    className={`tool-tile tile-${tool.category}`}
                    to={tool.path}
                    key={tool.slug}
                  >
                    <div className="tile-top">
                      <span className="tile-icon">
                        <ToolIcon name={tool.icon} />
                      </span>
                      <span className="tile-category">
                        {toolCategories.find((item) => item.id === tool.category)?.label}
                      </span>
                    </div>
                    <h3>{tool.name.replace(' Calculator', '')}</h3>
                    <p>
                      {tool.slug === 'gst-late-fee'
                        ? 'Work out late filing fees and interest for your GST returns.'
                        : tool.slug === 'gst-calculator'
                        ? 'Add or remove GST on a bill with lines at different rates.'
                        : tool.slug === 'advance-tax'
                          ? 'Plan quarterly tax payments and compare old and new regimes.'
                          : tool.slug === 'emi'
                            ? 'Calculate monthly EMI, total interest and the repayment schedule.'
                            : 'Estimate income and tax under section 58 (old 44AD and 44ADA).'}
                    </p>
                    <div className="tile-bottom">
                      <span>
                        {tool.slug === 'advance-tax' || tool.slug === 'presumptive-tax'
                          ? 'Tax year 2026-27'
                          : tool.slug === 'gst-calculator'
                          ? 'CGST, SGST & IGST split'
                          : tool.slug === 'emi'
                            ? 'Repayment schedule'
                            : 'Fee & interest breakdown'}
                      </span>
                      <span className="tile-open">
                        Open tool
                        <ToolIcon name="arrow" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
          <section className="workbench-about" aria-labelledby="about-title">
            <div>
              <h2 id="about-title">About Khatakit</h2>
              <p>
                Khatakit is a collection of free accounting and financial tools.
                <br className="desktop-break" /> Suggestions, corrections and contributions are
                welcome.
              </p>
            </div>
            <Link to="/about">
              About the project <ToolIcon name="arrow" />
            </Link>
          </section>
          <div className="workbench-footnote">
            <span>Accounting and tax calculators for India.</span>
            <span>No signup · No uploads · Free tools</span>
          </div>
        </div>
      </div>
    </>
  );
}
