

# Tighten the Home Page for Conversion

The Home page already has all 9 sections in roughly the right order. It needs trimming, sharper copy, brand-aligned numbers, and a more visible no-BAA pathway — not a rebuild. All shared components (Navbar, Footer, CTABand, TrialCallout, AI3) stay untouched.

## Edits, section by section

**Hero**
- Keep headline "Predict payer risk. Protect revenue. Recover cash."
- Keep the approved positioning paragraph as-is.
- Tighten the supporting line to the approved version (drop the appended "We also catch compliance landmines before they explode." — it dilutes the punch and isn't part of the approved language).
- Replace fine print under CTAs with the approved text exactly: "ContractIntel, Shield, and Prevent available immediately. No BAA required. No IT involvement. Available for qualifying provider organizations."
- Keep CTA buttons and trust-badge row as-is.

**AI³ band** — keep as-is. It's concise and on-brand.

**Market problem**
- Keep header and intro paragraph (already tight).
- Update stat #2 label to approved wording: "of denials are preventable" (drop "with earlier detection").
- Other two stats already match approved values.

**Predict / Protect / Recover** — keep as-is. Already structured as 3 cluster cards with correct module lists and links.

**Why ZDefense preview**
- Trim from 4 cards to 2 to keep Home concise (the dedicated `/why-zdefense` page covers the rest). Keep **No-BAA Entry Path** (most important differentiator, per brief) and **Eight Years of EOB Heritage** (proof). Drop Payer Weaponization Index and Compliance-First Architecture cards on Home only — they remain on the Why page.
- Add a "See all differentiators →" link to `/why-zdefense` under the grid.

**Platform demo signals (Outcomes)**
- Update active-appeals stat from "$847K" to **"$1.146M"** to match the approved demo signal ("1.146M active appeals recovery pipeline").
- Other 3 stats already match.
- Keep the existing disclaimer line.

**Role preview**
- Trim from 6 role cards to 4 to keep Home concise: CFO/Executive, RC Director, Billing Specialist, Compliance Officer. (Full set lives on `/who-its-for` / Solutions.)
- Add a "See all roles →" link below the grid pointing to `/solutions` (the existing role page).

**30-day evaluation callout** — keep as-is (uses shared `TrialCallout`).

**Final CTA band** — keep as-is.

## Files touched

- `src/pages/Index.tsx` — only file modified.

## Files NOT touched

- All shared components (`Navbar`, `Footer`, `CTABand`, `TrialCallout`, `AI3`, `HeroAccent`, `Layout`).
- All other pages.
- Routes, design tokens, Tailwind config.

## Out of scope (carries forward)

The pending contact-form email wiring still needs your sender-domain decision (`zaparetech.com` recommended). That work is unaffected by these Home edits and will resume after you confirm.

