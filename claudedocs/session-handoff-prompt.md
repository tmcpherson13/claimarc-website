# ClaimARC Website — Context Handoff

You're picking up work on the ClaimARC marketing website (`tmcpherson13/claimarc-website`), a React/TypeScript/Vite/Tailwind site for a healthcare claim-payment-acceleration platform, deployed on Vercel. This is a standalone session — the repo has zero remaining code connection to any other product.

## Repo essentials

- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui primitives, React Router, Supabase (contact form edge function)
- **Deploy:** Vercel, auto-deploys `main` on merge
- **Working branch convention:** feature branches off `main`, PR + squash-merge
- **Build:** `npm run build` runs `scripts/build-insights.mjs` (generates the Insights/whitepaper manifest + sitemap) before `vite build`
- **Accessibility gate:** `.pa11yci.json` is committed — run `npx pa11y-ci --config .pa11yci.json` against a local `vite preview` server before shipping visual/color changes. Site currently passes with **0 WCAG2AA errors across all 8 routes**.

## Product positioning

ClaimARC (a Retrieve Remit, LLC company) helps healthcare providers get paid faster on insurance claims. Three services, one differentiator:
1. **Claims Accelerator** (the differentiator, patent-pending) — AI scores every claim's "propensity to pay," advances cash in **1 business day (target)**, with **bi-directional true-up** (if a claim pays more than predicted, the overage returns to the provider)
2. **Claim to Cash Conversion** — paper EOBs/checks/correspondence → structured, auto-postable 835 files (99.7% accuracy)
3. **ERA Processing** — electronic remittance normalized, reconciled, posted across payers, with a 7–10yr audit-ready archive

Positioning: NOT a loan, NOT factoring — AI-priced payment acceleration with upside returned to the provider. Compliance: SOC 2 Type II, HIPAA, Patent Pending.

## Site structure (8 routes)

- `/` — Home: Hero → DenialCrisis (problem framing) → Service trio (solution) → StatRow + ComplianceStrip (proof) → DSO calculator (interactive) → CtaBand (convert). Deliberately slimmed to 6 sections — deeper content lives on dedicated pages.
- `/why-claimarc` — "How it works" depth page: pipeline diagram, advantages, comparison table, trust/compliance grid
- `/accelerator`, `/eob-conversion`, `/era-processing` — per-service pages, each chained to the next via a `NextPage` "continue reading" tile (Accelerator → Conversion → ERA → Why ClaimARC → Contact)
- `/leadership` — About/origin story + leadership grid
- `/insights` + `/insights/:slug` — file-based CMS: drop a PDF + optional JSON sidecar in `/public/insights/`, `scripts/build-insights.mjs` auto-generates the manifest, sitemap, and SEO
- `/contact` — contact form (Supabase edge function)

## Design system

- **Palette:** dark canvas (`--ink-0` through `--ink-4`), brand gradient arc (`--arc-1` cyan → `--arc-2` blue → `--arc-3` lime), `--lime` and `--cyan-dk` as accent/CTA colors
- **Two-tone rhythm:** sections alternate `.surface-flat` (pure ink) and `.surface-elev` (ink + soft cyan-tinted gradient) instead of jarring dark/light slabs — gives visual rhythm while staying in the "confident dark fintech" aesthetic
- **Typography:** Space Grotesk (display/headlines), Inter (body), JetBrains Mono (data/mono — `.mono` class) — three-tier system
- **`paper` tone:** rare true-light-background break for documentation-style sections (e.g. Accelerator's "Frictionless Implementation" pillars). Scope-overrides `--arc-1/2/3` to darker AA-safe shades so brand-color text stays readable on light backgrounds.
- **Primitives:** `Section` (tone-based wrapper), `SectionHeading`, `CtaLink` (primary/secondary/ghost/onDark variants), `Eyebrow`, `Card` — all in `src/components/marketing/primitives.tsx`

## What's shipped (chronological, most recent last)

1. Dark redesign + layered visual system (canvas data-stream hero, pipeline strip, paper section breaks)
2. Header rebuilt: full-color logo, light bg, 1-day funding messaging, contact page rewrite, info@claimarc.com
3. File-based Insights CMS (PDF + JSON sidecar → auto SEO/sitemap)
4. Leadership page About section (origin story, three "how it works" pillars)
5. **Big conversion pass:** HeroDataViz rebuilt as "the duel" (45→1 animated countdown), hero copy flipped to lead with value prop, DSO calculator, jargon `Define` tooltips, CompareTable (legacy financing vs ClaimARC), service-card hierarchy (Accelerator featured)
6. Homepage/Leadership copy polish, scroll-cue components, nav cleanup
7. DenialCrisis section added (problem-framing: "does this feel familiar?" + cited stats), DSO calculator upgraded (presets, animated count-up, comparison bars)
8. Header scroll-to-top on every nav link, scroll cue repositioned above the fold, StatCallouts swapped to non-duplicate stats
9. **Major restructure:** home cut from 16 sections to 6 (Problem → Solution → Proof → Convert story arc), depth content redistributed to `/why-claimarc` and the three service pages, `NextPage` cross-page chain component added
10. Footer "Last Word" slab removed (was competing with page CtaBands), Services nav upgraded to a mega-menu with icon + one-line blurb per service
11. WhyClaimARC closers rewritten (fixed a "one or the other" vs "three services" copy contradiction), merged two duplicate "how it works" sections into one, "cheaper"→"less expensive" sitewide, section numbering (01/02/03 badges) removed as unnecessary scaffolding
12. Two-tone dark rhythm system (FLAT vs ELEV surfaces) replacing ad-hoc section tone choices
13. Mobile polish pass (responsive hero type scale, larger slider touch targets, CompareTable horizontal scroll), hero countdown animation slowed 50%, duplicate DSO calculator heading removed
14. **UX audit punch list** (5-lens critic review — hierarchy/clarity/consistency/contrast/alignment): inlined jargon on the featured card, removed redundant CtaBands where a NextPage chain already existed, compressed hero (dropped duplicate compliance pills), deleted dead code, hid the hero data-viz below `lg` breakpoint, bumped `--text-lo` for AAA contrast, rewrote the hero subtagline
15. Hero headline polish: quieter/smaller disclosure asterisk (was competing with the "1 business day" headline), fixed a descender-clipping line-height bug
16. **Full WCAG2AA remediation via pa11y-ci:** ran automated audit across all 8 routes, found 24 errors clustering into 5 root causes (dark cyan/lime tokens failing contrast on light/bright backgrounds, pipeline-diagram white-on-color labels, missing slider focus rings, stale `<head>` meta tags, hardcoded low-opacity text). Fixed all — **0 errors, 8/8 pages pass.** Also synced `index.html` title/OG/Twitter/JSON-LD meta with the current hero copy (was still saying the old "Precision Valuation. Lightning Acceleration." tagline).
17. Removed ZDefense legacy redirect routes (`/platform`, `/why-zdefense`, `/solutions`, `/workflows`) — leftover from the shared Lovable scaffold ClaimARC was originally rebranded from. Zero references to Z-Defense/ZDefense remain anywhere in the codebase.

## Known open items / not yet done

- **DSO inconsistency flagged but not fixed:** the homepage currently shows two different "days you're waiting" numbers in adjacent sections — `45+` (HeroDataViz, hero subtagline, StatRow, final CTA — sourced HFMA) and `55+` (DenialCrisis card — sourced Kodiak 2026). Both are real citations for slightly different metrics (classic DSO vs. total time-to-payment), but sitting side-by-side on one page reads as a contradiction. **Recommended fix (not yet applied):** standardize on `45+` everywhere, and swap the DenialCrisis `55+` card for a different stat that complements rather than competes — e.g. "5.2% YoY A/R aging" (the trend is worsening, not just the static number) or "11.81% highest-ever initial denial rate."
- Consistency-lens debt from the audit (documented but low-priority, ~2hr fix): section vertical padding uses 7 distinct values where 2 rhythms would suffice; eyebrow letter-spacing has 6 variants; white-opacity borders/backgrounds have 9+7 variants respectively; 2-column grid ratios drift across 5 different fr values. None of this is visitor-facing — it's internal design-system maintenance debt.
- Real product screenshots/dashboard visuals have not been added — the hero still uses an abstract data-visualization (the 45→1 "duel") rather than an actual product screenshot. This was flagged as the single biggest "this is a real, live product" credibility lift still available.
- Leadership bios in `LeadershipGrid` are placeholders — real exec names/titles/photos pending from the client.
- Real business metrics (claims processed, $ recovered, etc.) throughout the site are estimates/placeholders pending real client data.

## Working style established this project

- Ship via PR + squash-merge, not direct-to-main
- Always run `npm run build` locally before committing to catch TS/build errors
- Run pa11y-ci before merging anything that touches color tokens or text/background pairs
- When doing a "critic" or "audit" pass, verify claims with actual tool output (grep counts, contrast math, pa11y JSON) rather than eyeballing — prior audit rounds over-claimed fixes that turned out to be partial
- Commit messages: detailed multi-paragraph body explaining *why*, not just *what*
