

# Sitemap, Analytics & Contact Form Backend

Three independent additions, batched into one build cycle.

---

## 1. Sitemap & Robots

- Create `public/sitemap.xml` listing all 7 routes (`/`, `/platform`, `/why-zdefense`, `/solutions`, `/pricing`, `/contact`, `/workflows`) with `https://zdefense.ai` as the base URL, `<lastmod>` set to today, and sensible `<priority>` values.
- Update `public/robots.txt` to append `Sitemap: https://zdefense.ai/sitemap.xml` so crawlers discover it automatically.
- Update all `<link rel="canonical">` Helmet tags across the 7 pages from the `lovable.app` preview URL to `https://zdefense.ai`.

## 2. Plausible Analytics + CTA Event Tracking

- Add the Plausible script tag to `index.html`:
  `<script defer data-domain="zdefense.ai" src="https://plausible.io/js/script.tagged-events.js"></script>`
  (the `tagged-events` variant lets us track CTA clicks via class names — no cookie banner needed).
- Create `src/lib/analytics.ts` with a typed `trackEvent(name, props?)` helper that calls `window.plausible?.(name, { props })` and no-ops if the script hasn't loaded.
- Add `className="plausible-event-name=..."` tags (or `onClick={() => trackEvent(...)}` for programmatic CTAs) to every primary CTA across the site:
  - Navbar: "Book a Demo", "Start 30-Day Evaluation"
  - Homepage hero + CTABand
  - Pricing tier "Talk to Sales" buttons (event includes tier name as a prop)
  - ContactPage "Book a Demo" / "Start Evaluation" cards
  - Form submission → `Form_Submit` event with `offerType` prop
- Plausible auto-tracks page views on route changes (SPA mode is built into the script).

> **Note on your domain:** You answered `zdefense.ai`. Plausible requires the script's `data-domain` to match the domain you register in your Plausible dashboard. If the live site is currently on `z-defense-website.lovable.app`, no events will register until DNS points `zdefense.ai` at the deployed app. I'll add a brief comment in `index.html` noting this.

## 3. Contact Form Backend (Email to Inbox)

- **Enable Lovable Cloud** on the project (required for Edge Functions + email infrastructure).
- **Set up Lovable email domain** for `zdefense.ai` (one-time DNS setup dialog) so submissions can send from a branded sender like `notify@zdefense.ai`.
- **Ask for the destination inbox** (e.g. `sales@zdefense.ai`) — I'll request this in chat once Cloud is enabled, then store it as a secret (`CONTACT_FORM_RECIPIENT`) so it's never hardcoded.
- Create Edge Function `send-contact-submission`:
  - Accepts the form payload, validates with Zod (firstName, lastName, email regex, organization, role, orgType, claimVolume, plus optional fields).
  - Renders a clean HTML email with all submitted fields grouped (Contact Info, Organization, Payer Mix, Message).
  - Sends via Lovable's transactional email queue (`enqueue_email`) to `CONTACT_FORM_RECIPIENT` with reply-to set to the submitter's email.
  - Returns `{ success: true }` or a 4xx/5xx with a clear error.
- Update `src/pages/ContactPage.tsx` `handleSubmit`:
  - Set a `submitting` state, call the function via `supabase.functions.invoke('send-contact-submission', { body: formData })`.
  - On success → show existing success screen + fire `trackEvent('Form_Submit', { offer: formData.offerType })`.
  - On failure → toast error via existing `sonner` toaster, keep form data intact so user can retry.

---

## Technical Details

**New files**
- `public/sitemap.xml`
- `src/lib/analytics.ts`
- `supabase/functions/send-contact-submission/index.ts`

**Modified files**
- `public/robots.txt`, `index.html`
- All 7 page files (canonical URL update + a few CTA event tags)
- `src/components/Navbar.tsx`, `src/components/CTABand.tsx`, `src/components/TrialCallout.tsx` (CTA event tags)
- `src/pages/PricingPage.tsx` (per-tier CTA events)
- `src/pages/ContactPage.tsx` (form submission wired to Edge Function)

**Infrastructure**
- Lovable Cloud enabled
- Lovable email domain configured for `zdefense.ai` (DNS dialog)
- Secret: `CONTACT_FORM_RECIPIENT`

**No breaking changes.** The existing form UI/validation stays exactly as-is; only the submit handler changes from a fake `setSubmitted(true)` to a real backend call.

## Execution order

1. Sitemap + robots + canonical URL fixes (zero-dependency, fastest).
2. Plausible script + analytics helper + CTA tags (zero-dependency).
3. Enable Cloud → set up email domain → ask for recipient inbox → build Edge Function → wire form. *(This step pauses for the email domain DNS dialog and the recipient-inbox question; the first two steps complete uninterrupted.)*

