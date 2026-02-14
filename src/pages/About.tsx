import { SEO } from '../lib/utils/seo';

export default function About() {
  return (
    <>
      <SEO
        title="About Khatakit - Privacy Policy"
        description="Learn about Khatakit and our privacy-first approach. No data collection, no cookies, no tracking. All calculations happen in your browser."
        path="/about"
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <h1 className="text-3xl font-bold text-neutral-800">About Khatakit</h1>

        <section className="mt-8 space-y-4 text-neutral-600">
          <p>
            <strong className="text-neutral-800">Khatakit</strong> (Khata = ledger in Hindi, Kit =
            toolkit) is a collection of free financial calculators built specifically for India.
          </p>
          <p>
            We created Khatakit because most online calculators are cluttered with ads, require
            signups, or send your financial data to servers. We believe simple tax and financial
            calculations should be free, fast, and private.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-neutral-800">Privacy Policy</h2>
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold text-green-800">Our privacy promise is simple:</h3>
            <ul className="mt-3 space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span><strong>No data collection.</strong> We don&apos;t collect any personal or financial data.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span><strong>No cookies.</strong> We don&apos;t use cookies or any browser storage.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span><strong>No tracking.</strong> No analytics, no pixels, no third-party scripts.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span><strong>No server processing.</strong> All calculations happen 100% in your browser using JavaScript.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span><strong>Open source.</strong> You can verify our code on GitHub.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-neutral-800">Disclaimer</h2>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-100 p-5 text-sm text-neutral-600">
            <p>
              Khatakit is provided for informational and educational purposes only. The calculators
              are based on publicly available tax rules for FY 2025-26 and are intended as a quick
              reference tool.
            </p>
            <p className="mt-3">
              This is <strong>not</strong> legal, financial, or tax advice. Always consult a
              qualified Chartered Accountant or tax professional for decisions regarding your tax
              obligations. We are not liable for any errors in calculations or any actions taken
              based on the results.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-neutral-800">Open Source</h2>
          <p className="mt-4 text-neutral-600">
            Khatakit is open source and available on{' '}
            <a
              href="https://github.com/sagrkv/khatakit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 underline decoration-primary-200 underline-offset-2 hover:text-primary-700"
            >
              GitHub
            </a>
            . Contributions, bug reports, and feature requests are welcome.
          </p>
        </section>
      </div>
    </>
  );
}
