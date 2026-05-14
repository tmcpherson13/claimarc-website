# ClaimARC site — design & conversion review

**Reviewer's stance:** ruthless founder/designer on a conversion mission.
**Scope:** code on branch `claude/acceleration-lead-content` (PR #8). The proxy from this environment blocks `claimarc-website.vercel.app`, so the read is from source rather than rendered DOM. Pixel-perfect visual nits are deferred until I can see it; everything below is structural and architectural.

This is a sales-led B2B healthcare SaaS, not a self-serve product. The conversion goal is "qualified prospect books a 30-min call" — not "user starts free trial." That changes the bar for what "convert" means, but it does not change the bar for visual polish, signal density, or trust.

---

## 1. Critical issues — fix before any paid traffic

### 1.1 The hero never lands the value prop in one breath
The headline is three lines: *"Precision valuation."* / *"Lightning acceleration."* / *"Get paid in 1 business day."* The first two are brand poetry; only the third is the value prop, and it's set in the smallest type. A first-time visitor has to read three paragraphs of body copy to figure out what *precision valuation* and *lightning acceleration* mean.

**Fix:** flip it. Lead with **"Get paid in 1 business day."** as the dominant headline, and let the slogan sit beneath as supporting type. The tagline is the brand promise; the headline is the sales weapon. They aren't the same thing.

Files: `src/pages/Index.tsx` (hero `<h1>`).

### 1.2 The HeroDataViz is obviously fabricated
The Funding Ledger mock has rows like *CL-7821 · Payer 47 · $18,420* and a *"+18.4%"* badge. For a patent-pending money-movement product, a faked dashboard is a credibility tax. Sophisticated buyers will notice and discount everything around it.

**Fix paths, in order of impact:**
1. Replace with a **real screenshot** of the actual ClaimARC portal (RevARC), blurred where data is sensitive — same pattern Stripe and Modern Treasury use.
2. If no portal yet: replace with a **single decisive number animation** (45 → 1 over 1.6s, set huge) plus a credibility line ("Funded $X today across N claims" once a real number exists).
3. Don't keep the fake ledger. It hurts more than it helps.

Files: `src/components/marketing/HeroDataViz.tsx`.

### 1.3 Zero customer logos, named clients, or quotes
This is the single biggest credibility deficit. For B2B healthcare, "who else uses this" is the #1 decision input — and there is currently nothing. SOC 2 / HIPAA / Patent Pending are table stakes; they don't substitute for proof.

**Fix:** add a **client logo band** between the hero and the StatCallouts (or under ComplianceStrip). Even three logos with the line *"Selected partners"* changes the temperature of the entire page. If no logos can be named publicly: name the **categories** ("Top-25 EHR partner · regional hospital systems · multi-specialty groups") — directional but better than silence.

### 1.4 Every CTA leads to one place — and that place is heavy
Every section, every card, every band funnels to `/contact`. That form requires name, work email, organization, role, claim volume, interest, and an open question. For a curious visitor who isn't ready to talk yet, there's no lighter touch — no calculator, no downloadable, no embedded video, no "see how the math works" interaction. The funnel has no middle.

**Fix — add at least one soft conversion above the contact form:**
- A 2-minute **DSO calculator**: visitor enters monthly claim volume + average days outstanding → page returns "your acceleration value: $X/month." Inline, no email gate (or email-gated after the calc shows a number).
- A gated **download**: the Insights page already supports PDFs — feature one paper as a hero CTA secondary action ("See the model in detail · 12pp PDF").
- An **embedded scheduler** (Cal.com, Calendly) so qualified visitors can book directly rather than fill a contact form.

Without one of these, the site loses every visitor who needs to think before they talk. That's most of them.

### 1.5 The hero has four animation systems running at once
Stack as deployed: `HeroDataStream` canvas + `hero-precision-accent` triple-radial wash + `hero-infinity-watermark` (CSS-breathing ∞) + `HeroDataViz` animated row flip + the eyebrow `animate-ping` dot. On a low-end device this is real CPU. On a high-end one it reads as **trying too hard** — the precision aesthetic gets undercut by ambient noise.

**Fix:** keep two. Recommend `HeroDataStream` canvas (the spatial metaphor) + the `HeroDataViz` (the proof). Drop the watermark and the precision-accent wash. Test the difference and you'll feel it.

### 1.6 45+ and 1 are visual peers when they should be a duel
The three stat tiles render *1*, *99.7%*, *45+* as equal-weight siblings. But `45+` is the **problem** and `1` is the **solution** — they're the entire pitch in two numbers. Setting them as peers throws away the punch.

**Fix:** combine them into a **before/after pairing**:
```
45+ DAYS  →  1 DAY
Industry average DSO    ClaimARC funding target
```
Strikethrough the 45+, set the 1 in lime, with an arrow between. One unit, dominant on the page. Move 99.7% into a smaller secondary tile or omit from the hero entirely.

Files: `src/pages/Index.tsx` stat-tile block.

### 1.7 "Bi-directional true-up" is used three times and explained zero times
The phrase appears in the Accelerator card, the Compare table, and in flywheel copy. To a CFO it's a key differentiator. To everyone else it's vendor jargon. The site never defines it.

**Fix:** on first mention (hero or services), inline-define: *"bi-directional true-up — if the claim pays more than ClaimARC priced, the upside is returned to you."* Or add a small tooltip/popover on hover. Same goes for "propensity to pay" — define once, then use.

---

## 2. High-impact improvements

### 2.1 Numbered eyebrows 01–07 are too much
I added 01–07 across the home page sections to give it an institutional/document feel. In practice it makes the page feel like a *manual*, not a story. Premium sales pages let structure carry rhythm.

**Fix:** keep numbered eyebrows on **two or three** key sections (Services, Implementation, Leadership). Use plain eyebrows on the rest. Let numbering signal the spine, not every joint.

Files: `src/pages/Index.tsx` (`numberedIndex` props on `<SectionHeading>`).

### 2.2 Add a logo trust band
The previous snapshot had a centered glowing-logo trust band between Services and Flywheel that's gone in the current build. Even if the logo is just the ClaimARC mark itself, that pause/breath in the page rhythm gave the eye a place to rest before the next dense section.

**Fix:** add it back — or upgrade to a *client* logo band per 1.3.

### 2.3 The compare table needs visual teeth
`CompareTable` lists five rows of "them vs us." Right now the wins read as text rows. Premium versions of this trope visually mark the wins — a red X / lime check column, the entire "us" column tinted with a brand accent.

### 2.4 The Implementation section is the only light section and it doesn't earn its real estate
Tonal break is good — but the content (three pillars) doesn't reward the visual change. After a dark hero + dark services + dark flywheel, the visitor arrives at the paper section expecting payoff. Instead they get three more cards that look like the dark ones.

**Fix:** make the paper section the **product moment**. Show a real screenshot of the onboarding playbook, a fragment of an 835 sample, or an actual integration diagram. Earn the spotlight.

### 2.5 Stat counts attribute to nothing
StatCallouts says **$2.5B+ recovered**, **98% accuracy**, **<24hr processing**, **500K+ claims annually**. There's no source line, no time window, no scope. A sharp CFO will read this and ask "by whom? since when? across how many clients?" If the numbers are placeholders, mark them as such until they're verified. If they're real, attribute them ("Parent company aggregate · last 24 months").

Files: `src/components/marketing/StatCallouts.tsx`.

### 2.6 Footer logo uses `variant="light"`, header uses `variant="color"` — they now disagree
Header is white background with full color logo (great). Footer is dark with the white wordmark logo. The asymmetry is fine, but the **header transitioning into a dark page** while the **footer transitions out of a dark page** creates a mirrored sandwich — and the color/white logo mismatch makes the brand feel like two products.

**Fix:** either keep the footer dark and use the white wordmark (current state — fine), or pull the brand identity through with the same color logo on a slightly lifted dark surface. Pick one and commit.

### 2.7 Mobile experience needs a real pass
- HeroDataViz is `hidden md:block` — on mobile the hero loses its right column entirely. The headline + stat tiles + CTAs need to feel complete on their own.
- PipelineStrip drops to a vertical stack with rotated arrows at <900px — works but feels long.
- StatCallouts is a 4-column grid that becomes 1 col on mobile — 4 tall stat cards in a row is a long mobile scroll for relatively low information density.

**Fix:** open the site on a phone before launch and prune mobile-only.

### 2.8 No keyboard / accessibility audit
At minimum: confirm all interactive elements are tab-reachable, the `<details>` for dropdowns has proper aria, the eyebrow ping dot doesn't trip screen readers (it should be `aria-hidden`), and the hero canvas has the right `aria-hidden`. The product is healthcare-adjacent; ADA compliance is a real risk, not a checkbox.

---

## 3. Nice-to-have tweaks

### 3.1 Sticky CTA on scroll
After ~600px of scroll, a small floating "Get a quote" or "Talk to us" pill anchors to the bottom-right. Conversion-rate uplift on long pages is well documented.

### 3.2 Insights PDF previews
Insights index already auto-generates from PDFs. Generate a **first-page thumbnail** at build time (a 200px PNG from page 1 of each PDF using `pdfjs-dist` — already in dependencies) and surface in the journal list. Strong visual lift.

### 3.3 Real photos of the leadership team
`LeadershipGrid` placeholder bios + initials → swap in real headshots on a uniform background. Even three real faces > eight placeholder circles.

### 3.4 Inline define-on-hover for jargon
Implement once, apply to "bi-directional true-up", "propensity to pay", "ANSI X12 835", "DSO". Hover shows a one-sentence definition. Educational, retains craft, doesn't break copy flow.

### 3.5 Scroll-linked numbered progress indicator
If you keep the 01–07 numbered eyebrows: a vertical rail on the left edge highlighting the current section as you scroll. Reads as "we know where you are in our argument."

### 3.6 Better empty state on `/insights`
Right now it's one sentence. Add a list of "topics in the queue" (3–5 upcoming paper titles) — turns dead air into anticipation.

### 3.7 OG image: ship a real one
SeoHead defaults the OG image to `claimarc-stacked-color.png` — that's the logo on a white background. Open Graph cards reward **scenes**, not marks. Commission or build one image per top-level page that shows headline + accent — pinned to the OG dimensions (1200×630).

### 3.8 Faster perceived load
HeroDataViz mounts immediately and the row-flip animation fires at 900ms. The data-stream canvas spins up before paint. Both delay LCP. Defer non-critical animations to first interaction or to after the LCP element renders.

---

## Pass 2 — first-time user log

**0–3 seconds:** I land. White header with a clean color logo, dark hero below. *Precision valuation. Lightning acceleration.* Pretty, but what does the product do? I scan down — *Get paid in 1 business day.* OK, that's the pitch. Why did that sit below the slogan?

**3–10 seconds:** I see a glass card on the right with claim IDs, scores, "$84,200 Funded today +18.4%." I assume this is a dashboard preview. I notice the rows say "Payer 47", "Payer 12." Wait — are those real payer codes? Or anonymized placeholders? I'm not sure if I'm looking at a product capture or a demo render. *Trust dings.*

**10–20 seconds:** Three stat tiles. *1 day, 99.7%, 45+*. I get that 1 is good. I'm not immediately sure why 45+ is on the page — it's their problem, not their offer. Three SOC 2 / HIPAA / Patent Pending pills below. Standard.

**20–30 seconds:** I scroll past the hero. Pipeline strip: 01 Conversion → 02 Scoring → 03 Accelerator. Useful. I click "02 AI Scoring" — wait, it goes to `/why-claimarc`, not a scoring service page. Slight disorientation.

**30–60 seconds:** StatCallouts. *$2.5B+ recovered.* By whom? Across what time period? No attribution. I scroll past it. ComplianceStrip — fine. Problem framing — I get it, AR is stuck. Three service cards — they look good, each with a color bar, but they're all the same shape and weight, so my eye doesn't know what to prioritize.

**60–120 seconds:** Flywheel. Implementation section in a lighter tone — pleasant visual break, but the content is more cards. Compare table — wins are obvious but visually flat. CFO value — three cards again. Leadership preview — names of people I don't recognize.

**Where I want to leave:** every CTA is *Contact Us*. I don't want to fill a six-field form for a 30-min call yet. I want to take a calculator for a spin, or read one paper to validate the thinking. The Insights link in the nav helps — but the index is empty (or near-empty). I bounce.

---

## Priority order if you do nothing else

1. **Move "Get paid in 1 business day." to the dominant headline.** Five minutes. Biggest single conversion gain.
2. **Add a client logo band** (or named-categories band). One commit. Largest credibility delta.
3. **Add a DSO calculator** or one gated whitepaper download as a soft conversion. Half a day. Unlocks the middle of the funnel.
4. **Replace the fake Funding Ledger with either a real screenshot or a single 45→1 number animation.** Half a day. Removes a trust tax.
5. **Inline-define bi-directional true-up.** One sentence. Removes jargon friction.

Everything else can wait.
