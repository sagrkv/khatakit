import { Link } from 'react-router-dom';
import { ISSUES_URL } from '../../seo/site';
import type { Faq } from '../../seo/types';

/** Questions and answers under the guide. The same text is published as FAQPage schema. */
export default function CalculatorFaq({ items }: { items: Faq[] }) {
  return (
    <section className="calculator-guide calculator-faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="guide-title">
        Frequently asked questions
      </h2>
      <div className="guide-grid">
        <div className="guide-section">
          {items.map((item) => (
            <div className="faq-item" key={item.question}>
              <h3 className="section-title">{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
        <p className="guide-trust">
          These answers follow the sources listed in References.{' '}
          <Link to="/about#rules">How Khatakit checks its rules</Link>
          <span aria-hidden="true"> · </span>
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            Report an error on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
