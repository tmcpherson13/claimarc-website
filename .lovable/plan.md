
## ZDefense AI³ — Foundation Setup

Build the marketing site scaffolding: design tokens, shared components, routing, and empty page shells. No page content yet — that comes in follow-up prompts.

### Design tokens (index.css)
Add CSS variables on `:root`:
- `--navy: #0F172A`, `--navy-dk: #1E3A5F`, `--emerald: #10B981`, `--slate: #64748B`, `--amber: #F59E0B`, `--lgray: #F1F5F9`
- Body font set to system Arial only (no Google Fonts)

### Reusable components (`src/components/`)
1. **`AI3.tsx`** — renders `AI<sup>3</sup>`. Used everywhere "AI³" appears; never typed as plain text.
2. **`Navbar.tsx`** — sticky navy bar. Brand left ("ZDefense AI³"), centered nav links (Home / Platform / Why ZDefense / Solutions / Pricing / Contact) with active state via `useLocation` (emerald + semibold), three right-side CTAs: emerald "Book a Demo" → `/contact`, outlined "Start 30-Day Evaluation" → `/contact?offer=trial`, faint "See Live Demo ↗" → `https://zdefense.lovable.app/?demo=true` (new tab).
3. **`Footer.tsx`** — navy 4-column grid: Brand block (with tagline "Predict. Protect. Recover." and copyright), Platform links, Company links, Compliance badge pills (SOC 2 Type II, ISO 27001:2022, HIPAA Compliant). Bottom bar with "ZDefense is a product of ZTech" and "Privacy Policy · Terms of Service".
4. **`Layout.tsx`** — wraps `<Navbar />` + children + `<Footer />`.
5. **`CTABand.tsx`** — emerald full-width band, props: `headline`, `subhead`, `primaryText/Href`, `secondaryText/Href`. Navy primary button, outlined navy secondary.
6. **`TrialCallout.tsx`** — emerald left-border card on light gray with eyebrow, headline, body copy, fine print, and emerald CTA button to `/contact?offer=trial`. Exact copy per spec.
7. **`BADBadge.tsx`** — `required` boolean prop. Amber pill = "BAA Required", emerald pill = "No BAA Required".

### Routing (`src/App.tsx`)
React Router with 7 routes, each rendering `<Layout><div>Page coming soon</div></Layout>`:
- `/` → HomePage
- `/platform` → PlatformPage
- `/why-zdefense` → WhyZDefensePage
- `/solutions` → SolutionsPage
- `/pricing` → PricingPage
- `/contact` → ContactPage
- `/workflows` → WorkflowsPage

NotFound route preserved as catch-all.

### Notes
- Mobile-first responsive (nav collapses cleanly on small viewports).
- Tailwind arbitrary values consume CSS vars (e.g. `bg-[var(--navy)]`) — no hardcoded hex in JSX.
- No page content built in this pass — follow-up prompts will fill each page.
