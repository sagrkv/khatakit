# Khatakit theme and component system

The site uses one light theme: warm paper, peach page headers, blue actions and restrained sage/sand supporting surfaces. The homepage, all six calculators, About and the missing-page screen share it. There is no separate colour scheme or stylesheet inside a page component.

## Where to change the design

| File | Responsibility |
|---|---|
| `src/styles/tokens.css` | The source of truth for colours, typography, spacing, radii, widths and motion durations. Tailwind's legacy utility names map back to these roles. |
| `src/styles/components.css` | Reusable page layouts, forms, panels, notices, source disclosures, results, tables and brand styling. |
| `src/styles/catalogue.css` | Catalogue composition and shared header/footer layout. Uses the same tokens. |
| `src/styles/interactions.css` | Focus/action feedback, copy status, reduced-motion behaviour and loan-chart presentation. |
| `src/index.css` | Imports only; establishes the cascade order. |

Change `--peach` to update the homepage hero and every page masthead. Change `--action` for the shared action colour. Change `--radius-panel`, `--space-6`, `--page-width`, `--font-body` or `--motion-fast` to adjust the system at its source. Preserve sufficient contrast when editing the palette.

All raw UI colours belong in `tokens.css`. Components must use semantic variables or the shared classes; new pages must not introduce their own hex colours, input styles or copies of calculator layout markup. Page-specific geometry, such as the homepage's illustrative worksheet, can live in the catalogue stylesheet and still consumes theme tokens.

## Page composition

`PageShell` provides the container, breadcrumb, icon, heading, description and optional supported-period badge. Its `reading` variant provides a narrower layout for About and the missing-page screen.

`CalculatorPage` composes `PageShell` with the shared input panel, results area, source disclosure and limitations notice. A tool page supplies content and calculation state:

```tsx
<CalculatorPage
  title="Example calculator"
  description="A short explanation of the task."
  category="Accounting"
  icon="briefcase"
  formTitle="Your details"
  form={<ExampleForm input={input} onChange={setInput} />}
  citations={citations}
  disclaimer="The assumptions for this tool."
>
  <ExampleResults result={result} />
</CalculatorPage>
```

Add a `period` only when the calculator supports that period. Styling changes must not silently advance tax years or imply rule verification.

## Shared components

- `Panel`, `EmptyState` and `Notice`: common surfaces. Notices support info, success and warning tones.
- `NumberInput`, `DateInput`, `Select` and `RadioGroup`: shared field labels, help, focus treatment and sizing. Dates use native date inputs with ISO values and min/max constraints. Segmented choices are native grouped radio inputs with normal keyboard behaviour.
- `Button`: primary, secondary and ghost variants, explicit busy/disabled states. Links use the corresponding `button button-*` classes.
- `ResultCard`: primary, neutral, success and error tones, numeric typography and wrapping constraints.
- `BreakdownTable`: consistent headers/totals, right-aligned figures, keyboard-focusable horizontal scrolling.
- `LegalBasis`: keyboard-operable source disclosure. Detailed references can be expanded without overwhelming the working area; limitations remain visible outside it.
- `CopyButton`: confirmed success, honest failure guidance, restored focus after clipboard fallback and cleaned-up feedback timers.
- `LoanBreakdown`: amounts and percentages alongside the donut chart; no information available only on hover or through colour.

Tool forms use `form-stack`; result compositions use `result-stack`, `result-grid`, `result-grid-three`, `comparison-grid`, `section-heading` and `section-title`. These are shared classes, not page-local styling.

## Brand

The new logo is a pair of offset ledger sheets beside a readable serif Khatakit wordmark. It replaces the stylised K/equals lockup. `src/components/brand/Logo.tsx` is the shared header/footer implementation; its colours and type come from theme tokens. The same ledger geometry is supplied in `public/logo-mark.svg` and `public/favicon.svg` for standalone use. Keep those standalone assets in sync if the mark changes.

Headline: **Accounting & tax tools**
Subtitle: **Free calculators for GST, income tax and loans.**

Do not create new logo variations in page components. Use `Logo` and the existing compact footer treatment.

## Icons and motion

`ToolIcon` maps named roles to Lucide React icons, bundled locally. The upstream license is included at `public/icons/LUCIDE-LICENSE.txt`. Decorative icons are hidden from assistive technology and controls retain text labels.

Motion communicates changes rather than decorating the page: short press/focus/selection feedback, confirmed copy state and chart proportion transitions. Financial numbers update immediately without counting through invented intermediate values. Reduced motion disables these transitions and spinner rotation while preserving textual busy/status feedback.

## Responsive and accessibility checks

Calculator forms/results stack below 900px. Three-result rows become a single column on narrow phones; schedules scroll inside their own labelled region. Sources, long totals and disclosure content must not widen the page. Inputs use readable text sizes, visible labels and associated help. The root layout provides a skip link.

Validate new tools in both empty and populated states, with keyboard navigation and at mobile/desktop widths. Automated tests render every registry page and the 404 page (`tests/seo/prerender.test.ts`) and check shared form behaviour (`tests/interactions/`). No test checks theme tokens, so check a token change on each page by eye.

## Writing style

Khatakit is a collection of free tools, not a product sales page. Use factual descriptions, task names and plain instructions. Describe what a tool calculates, its supported scope and where processing happens. Avoid benefit slogans, emotional promises, sales language and puns in headings or errors. Prefer “About Khatakit”, “Available calculators” and “Page not found” to promotional alternatives.
