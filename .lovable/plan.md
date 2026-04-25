## Goal

Expand each of the three compliance cards in the "Built to Pass Any Security Review" section on `/why-zdefense` so the body content matches the depth of the new pill tooltips. Each card gets a labeled "What it means" paragraph plus a "Why it matters" bullet list.

## Changes

**File: `src/pages/WhyZDefensePage.tsx`**

In the compliance card array (the SOC 2 / ISO 27001 / HIPAA cards with anchor IDs), replace the single `body` string field with two new fields:

- `whatItMeans` — a 1–2 sentence plain-English explanation (mirrors the tooltip).
- `whyItMatters` — an array of 3 short bullet points framed as buyer benefits.

Then update the card JSX to render:

1. Existing icon + badge + sub-label (unchanged).
2. **What it means** — small uppercase label, then the paragraph.
3. **Why it matters** — small uppercase label, then a left-aligned bulleted list with emerald check marks.

The cards stay center-aligned at the top (icon/badge), but the explanation blocks switch to left-aligned text so bullets read naturally. Card layout, hover effects, gradient halo, and anchor scroll behavior are preserved.

### Proposed copy

**SOC 2 Type II**
- *What it means:* Independent auditors observed our security controls operating in production over an extended period — not a snapshot, a sustained track record. Renewed annually.
- *Why it matters:*
  - Hardest of the three certifications to earn and keep
  - Proves controls actually work day after day, not just on paper
  - Accepted by enterprise security teams without additional testing

**ISO/IEC 27001:2022**
- *What it means:* Our information security management system is aligned to the global standard for protecting sensitive data, including the 2022 update covering modern cloud and supply-chain risks.
- *Why it matters:*
  - Required baseline for most enterprise health-system reviews
  - Recognized internationally — clears procurement in any region
  - Demonstrates a managed program, not ad-hoc security

**HIPAA Compliant**
- *What it means:* Administrative, technical, and physical safeguards for all ePHI handling are aligned to the HIPAA Security and Privacy Rules. BAA available for all full-platform engagements.
- *Why it matters:*
  - Table-stakes requirement for any healthcare vendor
  - Covers ePHI at rest, in transit, and in workflow
  - BAA-ready when you move beyond the no-BAA entry path

## Out of scope

- The pill tooltips and click-to-scroll behavior already shipped — no changes there.
- The homepage compliance strip — unchanged.
- The `<ComplianceStrip />` component itself — unchanged.