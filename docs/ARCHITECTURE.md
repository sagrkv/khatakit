# Architecture

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Vite + React 19 + TypeScript | Fast builds, modern DX, type safety |
| Styling | Tailwind CSS | Utility-first, tiny production CSS, mobile-first |
| Routing | React Router v7 (createBrowserRouter) | Clean URLs for SEO, lazy loading, layout routes |
| SEO | react-helmet-async + vite-plugin-prerender | Full HTML for crawlers, per-page meta |
| State | Local useState per tool | No shared state needed, zero overhead |
| Testing | Vitest + Testing Library | Same Vite ecosystem, fast unit tests |
| PDF | jspdf (lazy-loaded) | Client-side only, no server dependency |
| Deployment | Netlify | Free tier, global CDN, SPA support via _redirects |
| Fonts | Inter + JetBrains Mono | Tabular figures for number-heavy UI |

## Project Structure

```
khatakit/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── _redirects              # Netlify SPA redirect
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN-SYSTEM.md
│   └── SITEMAP.md
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky header, logo, nav, privacy badge
│   │   │   ├── Footer.tsx       # Links, privacy text, GitHub
│   │   │   └── RootLayout.tsx   # Header + <Outlet /> + Footer
│   │   ├── ui/
│   │   │   ├── NumberInput.tsx   # Indian formatting, prefix/suffix
│   │   │   ├── DateInput.tsx     # Native date, month/year picker
│   │   │   ├── Select.tsx       # Styled native select
│   │   │   ├── RadioGroup.tsx   # Binary switch, multi-option pills
│   │   │   ├── Button.tsx       # Primary/secondary/ghost, loading
│   │   │   ├── PrivacyBadge.tsx # Inline and banner variants
│   │   │   └── Disclaimer.tsx   # Collapsible info box
│   │   └── calculator/
│   │       ├── ResultCard.tsx   # Large number display, variants
│   │       ├── BreakdownTable.tsx # Responsive table, totals row
│   │       ├── CopyButton.tsx   # Clipboard API, visual feedback
│   │       ├── PdfExportButton.tsx # Lazy-loaded jspdf export
│   │       └── ToolCard.tsx     # Homepage tool card with hover
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   ├── tools/
│   │   ├── gst-late-fee/
│   │   │   ├── GstLateFee.tsx   # Page component
│   │   │   ├── GstForm.tsx      # Form inputs
│   │   │   ├── GstResults.tsx   # Results display
│   │   │   ├── calc.ts          # Pure calculation logic
│   │   │   └── types.ts         # TypeScript types
│   │   ├── advance-tax/
│   │   │   ├── AdvanceTax.tsx
│   │   │   ├── AdvanceTaxForm.tsx
│   │   │   ├── AdvanceTaxResults.tsx
│   │   │   ├── calc.ts
│   │   │   └── types.ts
│   │   ├── emi/
│   │   │   ├── EmiCalculator.tsx
│   │   │   ├── EmiForm.tsx
│   │   │   ├── EmiResults.tsx
│   │   │   ├── calc.ts
│   │   │   └── types.ts
│   │   └── presumptive-tax/
│   │       ├── PresumptiveTax.tsx
│   │       ├── PresumptiveForm.tsx
│   │       ├── PresumptiveResults.tsx
│   │       ├── calc.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── constants/
│   │   │   ├── tax-slabs.ts     # Income tax slab data
│   │   │   ├── gst-rates.ts    # GST late fee rates, caps
│   │   │   └── presumptive.ts  # 44AD/44ADA rates, limits
│   │   └── utils/
│   │       ├── format.ts        # formatCurrency, formatIndianNumber
│   │       ├── date.ts          # daysBetween, parseDate
│   │       └── seo.ts           # useSEO hook
│   ├── data/
│   │   └── tools.ts             # Tool metadata (name, slug, desc, icon)
│   ├── App.tsx                  # Router setup
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind directives, custom styles
├── tests/
│   ├── gst-late-fee/
│   │   └── calc.test.ts
│   ├── advance-tax/
│   │   └── calc.test.ts
│   ├── emi/
│   │   └── calc.test.ts
│   └── presumptive-tax/
│       └── calc.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── .prettierrc
├── .gitignore
└── README.md
```

## Key Patterns

### Calculation Logic Separation

Each calculator tool follows this pattern:
- `calc.ts` — Pure functions, zero React imports, fully testable
- `types.ts` — Input/output TypeScript interfaces
- `Form.tsx` — Controlled inputs, calls calc on submit/change
- `Results.tsx` — Renders calc output, handles copy/export

```typescript
// Example: calc.ts
export function calculateEmi(input: EmiInput): EmiResult {
  const r = input.annualRate / 12 / 100;
  const n = input.tenureMonths;
  const emi = (input.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { emi, totalInterest: emi * n - input.principal, totalPayable: emi * n };
}
```

### Routing

```typescript
// React Router v7 with lazy loading
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gst-late-fee-interest-calculator", lazy: () => import("./tools/gst-late-fee/GstLateFee") },
      { path: "/advance-tax-calculator", lazy: () => import("./tools/advance-tax/AdvanceTax") },
      { path: "/emi-calculator", lazy: () => import("./tools/emi/EmiCalculator") },
      { path: "/presumptive-income-calculator", lazy: () => import("./tools/presumptive-tax/PresumptiveTax") },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

### SEO Strategy

1. `react-helmet-async` for dynamic `<title>`, `<meta>`, and JSON-LD per page
2. `vite-plugin-prerender` to generate static HTML for all 6 routes at build time
3. Canonical URLs on every page
4. Open Graph images (1200x630)

### Indian Number Formatting

```typescript
// 100000 → "1,00,000"
export function formatIndianNumber(num: number): string {
  const str = Math.round(num).toString();
  if (str.length <= 3) return str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return formatted + "," + last3;
}
```

## Performance Budget

| Metric | Target |
|---|---|
| Initial JS bundle | < 100KB gzipped |
| First Contentful Paint | < 1.5s |
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |

Each calculator is lazy-loaded so the homepage stays fast. jspdf is only loaded when user clicks "Export PDF".
