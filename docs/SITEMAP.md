# Sitemap

## URL Structure

| URL | Page | SEO Title | Meta Description |
|---|---|---|---|
| `/` | Homepage | Khatakit - Free Financial Calculators for India | Free, privacy-first financial calculators for India. GST late fee, advance tax, EMI, and presumptive tax calculators. 100% browser-based, no data collection. |
| `/gst-late-fee-interest-calculator` | GST Calculator | GST Late Fee & Interest Calculator 2025-26 - Khatakit | Calculate GST late filing fees (Section 47) and interest (Section 50) with turnover-based caps. Free, instant, no signup required. |
| `/advance-tax-calculator` | Advance Tax | Advance Tax Calculator FY 2025-26 - Old & New Regime - Khatakit | Calculate advance tax installments for FY 2025-26. Compare old vs new regime. Quarterly schedule with due dates. Free and private. |
| `/emi-calculator` | EMI Calculator | EMI Calculator - Loan EMI Calculator with Amortization - Khatakit | Calculate loan EMI with reducing balance method. View full amortization schedule, interest breakdown, and monthly payment details. |
| `/presumptive-income-calculator` | 44ADA/44AD | Presumptive Tax Calculator - Section 44ADA & 44AD - Khatakit | Calculate presumptive income under Section 44ADA (professionals) and 44AD (businesses). Free presumptive tax calculator for India. |
| `/about` | About & Privacy | About Khatakit - Privacy Policy | Learn about Khatakit and our privacy-first approach. No data collection, no cookies, no tracking. All calculations happen in your browser. |

## SEO Keywords by Page

### Homepage
- financial calculators india
- free tax calculator india
- gst calculator
- emi calculator

### GST Late Fee & Interest Calculator
- gst late fee calculator
- gst interest calculator
- gst late filing penalty
- section 50 gst interest
- gst return late fee

### Advance Tax Calculator
- advance tax calculator
- advance tax calculator fy 2025-26
- income tax calculator india
- old vs new regime calculator
- quarterly advance tax

### EMI Calculator
- emi calculator
- loan emi calculator
- home loan emi calculator
- emi calculator with amortization
- monthly emi calculator

### Presumptive Tax (44ADA/44AD)
- 44ada calculator
- 44ad calculator
- presumptive income calculator
- presumptive taxation scheme
- section 44ada

## Structured Data (JSON-LD)

Each page includes:
- `WebApplication` schema on calculator pages
- `WebSite` schema on homepage
- `BreadcrumbList` on all pages
- `FAQPage` schema where applicable

## Prerendered Routes

All 6 routes are prerendered at build time using `vite-plugin-prerender`:
```
/
/gst-late-fee-interest-calculator
/advance-tax-calculator
/emi-calculator
/presumptive-income-calculator
/about
```

## Canonical URLs

All pages use `https://khatakit.in` as the canonical base:
```html
<link rel="canonical" href="https://khatakit.in/emi-calculator" />
```
