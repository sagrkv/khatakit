import { Link } from 'react-router-dom';
import { SEO } from '../lib/utils/seo';
import { tools } from '../data/tools';

const iconMap: Record<string, React.ReactNode> = {
  receipt: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  calendar: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  banknotes: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  briefcase: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
};

export default function Home() {
  return (
    <>
      <SEO
        title="Khatakit - Free Financial Calculators for India"
        description="Free, privacy-first financial calculators for India. GST late fee, advance tax, EMI, and presumptive tax calculators. 100% browser-based, no data collection."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Khatakit',
          url: 'https://khatakit.in',
          description:
            'Free, privacy-first financial calculators for India.',
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50/60 to-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 md:text-5xl">
            Free Financial Calculators
            <br />
            <span className="text-primary-600">for India</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            GST penalties, advance tax, EMI, and presumptive income &mdash; calculated instantly in
            your browser. No signup, no data collection, no cookies.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            100% Private &mdash; Your data never leaves your browser
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-2xl font-semibold text-neutral-800">
            Choose a Calculator
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                to={tool.path}
                className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    {iconMap[tool.icon]}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800">{tool.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">{tool.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-neutral-200 bg-neutral-100 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-2xl font-semibold text-neutral-800">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Enter Details',
                desc: 'Fill in your financial details using simple, guided forms.',
              },
              {
                step: '2',
                title: 'Get Results Instantly',
                desc: 'See calculations update in real-time as you type. No submit button needed.',
              },
              {
                step: '3',
                title: 'Copy or Export',
                desc: 'Copy individual values or export the full breakdown as a PDF.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-1 font-semibold text-neutral-800">{item.title}</h3>
                <p className="text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
