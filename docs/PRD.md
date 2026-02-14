# Khatakit - Product Requirements Document

## Overview

Khatakit (khatakit.in) is a privacy-first, 100% browser-based financial utility website targeting Indian freelancers, small business owners, and accountants. All computations happen in JavaScript on the client side. There is no backend, no login, no data storage, and no cookies.

## Target Users

- Freelancers and consultants needing quick tax estimates
- Small business owners calculating GST obligations
- Chartered accountants and tax professionals as a quick reference
- Anyone searching Google for "GST late fee calculator", "advance tax calculator", "EMI calculator", etc.

## Core Principles

1. **Privacy-first** - Zero data leaves the browser. No analytics, no tracking, no cookies.
2. **Accuracy** - Calculations follow current Indian tax laws (FY 2025-26) with proper citations.
3. **Simplicity** - Clean UI, minimal inputs, instant results. No clutter.
4. **Free & Open Source** - MIT licensed, publicly available on GitHub.

---

## V1 Tools

### 1. GST Late Fee & Interest Calculator

**Purpose:** Calculate penalties for late filing of GST returns.

**Inputs:**
- Return type (GSTR-1, GSTR-3B, GSTR-9)
- Tax period (month/year)
- Due date (auto-populated based on return type)
- Actual filing date
- Net tax liability (Rs.)
- Annual aggregate turnover slab
- Whether it's a nil return

**Calculation Logic:**

**Late Fee (Section 47 CGST Act):**
- GSTR-3B non-nil: Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)
- GSTR-3B nil return: Rs. 20/day (Rs. 10 CGST + Rs. 10 SGST)
- Late fee caps based on turnover:
  - Turnover up to Rs. 1.5 Cr: Max Rs. 2,000
  - Turnover Rs. 1.5 Cr to Rs. 5 Cr: Max Rs. 5,000
  - Turnover above Rs. 5 Cr: Max Rs. 10,000
- Nil return cap: Rs. 500

**Interest (Section 50 CGST Act):**
- Rate: 18% per annum
- Formula: `Tax Liability * 18/100 * (Days Late / 365)`
- Applied on net tax liability after ITC

**Output:**
- Late fee breakdown (CGST + SGST)
- Interest amount
- Total penalty
- Day-by-day breakdown option

---

### 2. Advance Tax Calculator

**Purpose:** Calculate quarterly advance tax installments.

**Inputs:**
- Assessment Year
- Tax regime (Old / New)
- Gross total income
- Deductions (Old regime: 80C, 80D, 80E, 80G, HRA, etc.)
- TDS already deducted
- Income from capital gains (short-term / long-term)
- Age category (below 60 / 60-80 / above 80)

**Calculation Logic:**

**New Regime Slabs (FY 2025-26):**
| Income Slab | Rate |
|---|---|
| Up to Rs. 4,00,000 | Nil |
| Rs. 4,00,001 - 8,00,000 | 5% |
| Rs. 8,00,001 - 12,00,000 | 10% |
| Rs. 12,00,001 - 16,00,000 | 15% |
| Rs. 16,00,001 - 20,00,000 | 20% |
| Rs. 20,00,001 - 24,00,000 | 25% |
| Above Rs. 24,00,000 | 30% |

Standard deduction: Rs. 75,000 (salaried/pension)

Section 87A rebate: Up to Rs. 60,000 (income up to Rs. 12,00,000; marginal relief up to Rs. 12,75,000)

**Old Regime Slabs (FY 2025-26):**
| Income Slab | Rate (Below 60) |
|---|---|
| Up to Rs. 2,50,000 | Nil |
| Rs. 2,50,001 - 5,00,000 | 5% |
| Rs. 5,00,001 - 10,00,000 | 20% |
| Above Rs. 10,00,000 | 30% |

Standard deduction: Rs. 50,000

Section 87A rebate: Up to Rs. 12,500 (income up to Rs. 5,00,000)

**Surcharge:**
| Total Income | Rate |
|---|---|
| Rs. 50L - 1 Cr | 10% |
| Rs. 1 Cr - 2 Cr | 15% |
| Rs. 2 Cr - 5 Cr | 25% |
| Above Rs. 5 Cr | 37% (old) / 25% (new, capped) |

Health & Education Cess: 4% on tax + surcharge

**Advance Tax Schedule:**
| Due Date | Cumulative % |
|---|---|
| 15 June | 15% |
| 15 September | 45% |
| 15 December | 75% |
| 15 March | 100% |

Threshold: Advance tax applies only if total tax liability exceeds Rs. 10,000.

**Output:**
- Tax computation sheet (income, deductions, taxable income, tax, surcharge, cess)
- Quarterly installment schedule with amounts and due dates
- Comparison: Old vs New regime (side by side)

---

### 3. EMI Calculator

**Purpose:** Calculate monthly EMI for loans.

**Inputs:**
- Loan amount (Rs.)
- Annual interest rate (%)
- Loan tenure (months or years)

**Calculation Logic:**

Formula (reducing balance): `EMI = [P * R * (1+R)^N] / [(1+R)^N - 1]`

Where:
- P = Principal loan amount
- R = Monthly interest rate (annual rate / 12 / 100)
- N = Total number of months

**Output:**
- Monthly EMI amount
- Total interest payable
- Total amount payable (principal + interest)
- Pie chart: Principal vs Interest split
- Year-wise amortization schedule (principal, interest, balance for each year)

---

### 4. Presumptive Tax Calculator (44ADA / 44AD)

**Purpose:** Calculate presumptive income for small businesses and professionals.

**Inputs:**
- Scheme: 44AD (Business) or 44ADA (Professional)
- Gross receipts / turnover
- For 44AD: Split between cash and digital receipts
- Assessment year
- Tax regime (Old / New)

**Calculation Logic:**

**Section 44AD (Business):**
- Turnover limit: Rs. 2 Cr (Rs. 3 Cr if cash receipts <= 5% of total)
- Presumptive rate: 8% of cash receipts + 6% of digital receipts
- If actual income is higher, taxpayer can declare higher amount

**Section 44ADA (Professional):**
- Eligible professions: Legal, Medical, Engineering, Architecture, Accountancy, Technical Consultancy, Interior Decoration, Film/Arts, Company Secretary, Information Technology
- Gross receipts limit: Rs. 50 Lakh (Rs. 75 Lakh if cash receipts <= 5%)
- Presumptive rate: 50% of gross receipts
- Can declare higher income if actual income exceeds 50%

**Output:**
- Presumptive income
- Tax liability (using selected regime slabs)
- Effective tax rate
- Comparison with actual income scenarios

---

## Design Requirements

### Brand Identity
- **Name:** Khatakit (Khata = ledger in Hindi, Kit = toolkit)
- **Domain:** khatakit.in
- **Colors:** Teal-blue primary (#1976B8), warm amber accent (#F59E0B), warm gray neutrals
- **Fonts:** Inter (UI), JetBrains Mono (numbers)
- **Logo:** Open ledger book forming a subtle "K" shape

### Layout
- Desktop: 2-column layout (sticky form left, scrollable results right)
- Mobile: Single-column stacked (form first, then results)
- Max content width: 1200px

### UI Components
- Clean card-based design with subtle shadows
- Indian number formatting throughout (e.g., 1,00,000 instead of 100,000)
- Copy-to-clipboard on all result values
- PDF export for detailed breakdowns
- Privacy badge visible on every page

---

## Technical Requirements

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **SEO:** react-helmet-async + vite-plugin-prerender for static HTML
- **Testing:** Vitest + Testing Library
- **Deployment:** Netlify
- **Bundle size:** Target < 100KB initial load (excluding lazy-loaded PDF)
- **Performance:** Lighthouse 95+ performance, 100 accessibility, 100 SEO

---

## Non-Goals (V1)

- User accounts or authentication
- Backend API or database
- Saving/loading calculations
- Mobile app
- Multi-language support
- Historical tax year support (only current FY)
