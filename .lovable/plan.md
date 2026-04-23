

# Website Refinement — Sequential Execution Plan

I'll execute all 5 batches in one continuous build cycle, in the order below. No pauses between batches.

---

## Batch 1 — Global Foundations
- Create `src/components/ScrollToTop.tsx` (useLocation + useEffect → window.scrollTo(0,0)); mount inside `<BrowserRouter>` in `App.tsx`.
- Add `html { scroll-behavior: smooth; }` and `section[id] { scroll-margin-top: 80px; }` to `src/index.css`.
- Install `react-helmet-async`; wrap `<App />` in `<HelmetProvider>`; add `<Helmet>` with unique title + meta description to all 7 pages.
- Add Organization JSON-LD `<script type="application/ld+json">` to `index.html`.

## Batch 2 — Responsive & Mobile
- Replace `px-16` → `px-6 md:px-12 lg:px-16` across all pages and shared components (CTABand, TrialCallout, Footer, Navbar).
- Hero H1s: `text-6xl` → `text-4xl md:text-5xl lg:text-6xl`; `text-5xl` → `text-3xl md:text-4xl lg:text-5xl`; `text-4xl` → `text-3xl md:text-4xl` across all pages.
- Rebuild `Navbar.tsx`: hamburger button + slide-down panel under `lg`; nav links + CTAs collapse into panel; useState for open/close.
- PricingPage tier grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.

## Batch 3 — Containers & Sticky Behaviors
- Wrap each section's inner content in `<div className="max-w-7xl mx-auto">` across all 7 pages (full-width backgrounds preserved).
- SolutionsPage role-tab bar: wrap in `sticky top-[72px] z-40 bg-white border-b border-slate-100` so it pins under navbar.

## Batch 4 — Visual Polish
- Add `hover:bg-emerald-600 transition-colors` (and navy/outline variants) to all CTA buttons across pages, Navbar, CTABand, TrialCallout.
- Hero accent: insert a faint SVG grid or radial emerald gradient (`absolute inset-0 opacity-10 pointer-events-none`) into hero sections of Index, Platform, WhyZDefense, Solutions, Pricing, Contact. Heroes get `relative overflow-hidden`.
- Audit Platform & Pricing for adjacent same-bg sections; insert `border-t border-slate-100` or alternate one to `bg-[var(--lgray)]`.
- Footer compliance pills: prefix each with a small `lucide-react` icon (Shield for SOC 2, Lock for ISO, FileCheck for HIPAA).

## Batch 5 — Forms & Accessibility
- ContactPage: add email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) to `requiredValid`; submit disabled until email passes.
- Add `aria-required="true"` on required inputs/selects, `aria-label` on inputs without visible labels, `aria-invalid` tied to validation, `focus-visible:ring-2 focus-visible:ring-[var(--emerald)]` on all interactive elements.
- Wrap success message in `<div role="status" aria-live="polite">`.

---

## Technical Details
- **New files:** `src/components/ScrollToTop.tsx`
- **Modified files:** `src/App.tsx`, `index.html`, `src/index.css`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/CTABand.tsx`, `src/components/TrialCallout.tsx`, all 7 pages
- **New dependency:** `react-helmet-async`
- **No backend changes.**

## Credit Efficiency
- One continuous build cycle (no pause/review round-trips).
- Batches ordered so later edits don't undo earlier ones (foundations → responsive primitives → containers that wrap them → cosmetic overlay → isolated form work).
- Project-wide find/replace edits (padding, type scale) grouped together in Batch 2 to avoid revisiting the same files.

