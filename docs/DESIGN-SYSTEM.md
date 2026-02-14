# Design System

## Colors

### Primary — Teal Blue
| Token | Hex | Usage |
|---|---|---|
| primary-50 | #EFF6FF | Result card backgrounds |
| primary-100 | #DBEAFE | Hover states, light fills |
| primary-200 | #BFDBFE | Borders, dividers |
| primary-500 | #2196D3 | Secondary text, icons |
| primary-600 | #1976B8 | Primary buttons, links, "kit" in wordmark |
| primary-700 | #1565A0 | Button hover |
| primary-900 | #0D3B66 | Dark headings |

### Accent — Warm Amber
| Token | Hex | Usage |
|---|---|---|
| accent-400 | #FBBF24 | Highlights, badges |
| accent-500 | #F59E0B | CTA accents, star ratings |
| accent-600 | #D97706 | Accent hover |

### Neutrals — Warm Gray
| Token | Hex | Usage |
|---|---|---|
| neutral-50 | #FAFAFA | Page background |
| neutral-100 | #F6F7FA | Card backgrounds |
| neutral-200 | #E5E7EB | Borders |
| neutral-400 | #9CA3AF | Placeholder text |
| neutral-600 | #4B5563 | Body text |
| neutral-800 | #1F2937 | Headings |
| neutral-950 | #0A0A0A | "Khata" in wordmark |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| success | #16A34A | Positive results, savings |
| error | #DC2626 | Errors, penalties, warnings |
| info | #2563EB | Informational callouts |

---

## Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale
| Element | Font | Size | Weight | Features |
|---|---|---|---|---|
| Page title (h1) | Inter | 2rem (32px) | 700 | — |
| Section heading (h2) | Inter | 1.5rem (24px) | 600 | — |
| Card heading (h3) | Inter | 1.125rem (18px) | 600 | — |
| Body text | Inter | 1rem (16px) | 400 | — |
| Small / caption | Inter | 0.875rem (14px) | 400 | — |
| Result numbers | JetBrains Mono | 1.5-2rem | 600 | `tabular-nums` |
| Input values | JetBrains Mono | 1rem | 400 | `tabular-nums` |
| Table numbers | JetBrains Mono | 0.875rem | 400 | `tabular-nums` |

### Loading
- Inter: weights 400, 500, 600, 700 via Google Fonts
- JetBrains Mono: weights 400, 600 via Google Fonts
- `font-display: swap` for both

---

## Logo

### Icon Concept
An open ledger book that subtly forms a "K" shape:
- Two pages angled open at ~120 degrees
- Spine runs down the center
- Three horizontal ledger lines on the right page
- The left page edge + spine form the vertical and diagonal strokes of "K"

### SVG Specifications
- Viewbox: `0 0 40 40`
- Stroke-based, 2px stroke width
- Primary-600 (#1976B8) color
- Minimal, geometric style
- Works at 24px minimum

### Wordmark
- "Khata" in neutral-950, Inter 600
- "kit" in primary-600, Inter 600
- No period or dot
- Kerning: default, no extra letter-spacing

### Usage
- Header: Icon (32px) + Wordmark, gap-2
- Favicon: Icon only, filled variant for small sizes
- OG Image: Icon + Wordmark centered

---

## Components

### Cards
```
rounded-xl
bg-white
shadow-sm
hover:shadow-md
border border-neutral-200
p-5 md:p-6
transition-shadow duration-200
```

### Inputs
```
w-full
rounded-lg
border border-neutral-200
px-4 py-3
text-neutral-800
placeholder:text-neutral-400
focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
font-mono (for number inputs)
```

### Buttons
**Primary:**
```
bg-primary-600 hover:bg-primary-700
text-white
rounded-lg
px-6 py-3
font-medium
transition-colors duration-150
```

**Secondary:**
```
bg-white hover:bg-neutral-50
text-neutral-800
border border-neutral-200
rounded-lg
px-6 py-3
```

**Ghost:**
```
bg-transparent hover:bg-neutral-100
text-neutral-600
rounded-lg
px-4 py-2
```

### Result Cards
```
bg-primary-50
border border-primary-200
rounded-xl
p-5
```
- Large number: `text-2xl md:text-3xl font-mono font-semibold text-primary-900`
- Label: `text-sm text-neutral-600 uppercase tracking-wide`

### Tables
```
w-full
text-sm
[th] text-left text-neutral-600 font-medium border-b border-neutral-200 py-3 px-4
[td] py-3 px-4 border-b border-neutral-100 font-mono (for numbers)
[tfoot] font-semibold bg-neutral-50
```

---

## Layout

### Desktop (md+)
- Max width: `max-w-6xl` (1152px)
- 2-column grid: `grid grid-cols-5 gap-8`
  - Form: `col-span-2` (sticky, `top-24`)
  - Results: `col-span-3`

### Mobile
- Single column, full width with `px-4`
- Form stacked above results
- Inputs full width
- Breakpoint: `md` (768px)

### Spacing
- Section gaps: `space-y-8`
- Form field gaps: `space-y-4`
- Card padding: `p-5 md:p-6`
- Page padding: `px-4 md:px-8`

---

## Shadows
| Level | Class | Usage |
|---|---|---|
| Resting | `shadow-sm` | Cards default |
| Hover | `shadow-md` | Cards on hover |
| Elevated | `shadow-lg` | Modals, dropdowns (if any) |

---

## Transitions
- Default: `duration-200 ease-in-out`
- Buttons: `duration-150`
- No animations on page load
- Reduced motion: Respect `prefers-reduced-motion`

---

## Accessibility
- All interactive elements must have visible focus indicators
- Color contrast: WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- All form inputs must have associated labels
- Result numbers must be in `aria-live` regions for screen readers
- Keyboard navigable throughout
