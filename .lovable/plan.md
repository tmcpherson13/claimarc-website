

# Wire the Contact Form to Email `krista.mcpherson@zaparetech.com`

The contact form currently fakes its submission (`setSubmitted(true)` only). I'll wire it to actually deliver each submission to your inbox.

## What needs to happen

The workspace doesn't yet have a verified sender domain — that's the only blocker. Once a sender domain exists, I can scaffold the email infrastructure and send to any inbox (including `krista.mcpherson@zaparetech.com`, which is on a different domain — that's totally fine; the recipient address is independent of the sender domain).

You have two options for the sender domain:

1. **Use `zaparetech.com`** (recommended) — emails arrive from something like `notify@zaparetech.com`, matching the parent company. One-time DNS dialog at your registrar.
2. **Use `zdefense.ai`** — emails arrive from `notify@zdefense.ai`, matching the product. One-time DNS dialog at your registrar.

Either way, the destination inbox stays `krista.mcpherson@zaparetech.com`.

## Implementation steps (after you pick a sender domain and complete the DNS dialog)

1. **Provision email infrastructure** — sets up the send queue, suppression list, unsubscribe handling, and the `send-transactional-email` Edge Function. No code from you.
2. **Create one email template** — `contact-form-submission.tsx` — a clean, branded HTML email (ZDefense navy + emerald) showing all submitted fields grouped:
   - Contact info (name, email, organization, role)
   - Organization profile (org type, claim volume, primary challenge)
   - Offer requested (demo / trial / interested-in-trial flag)
   - Payer mix (selected payers + any "Other" specified)
   - Additional message
   - Reply-to set to the submitter's email so you can reply directly from your inbox.
3. **Update `ContactPage.tsx` `handleSubmit`**:
   - Add `submitting` state, disable button + show "Sending…" while in flight.
   - Call `supabase.functions.invoke('send-transactional-email', { body: { templateName: 'contact-form-submission', recipientEmail: 'krista.mcpherson@zaparetech.com', idempotencyKey: <uuid>, templateData: { ...formData } } })`.
   - On success → existing success screen + fire `trackEvent('Form_Submit', { offer: formData.offerType })`.
   - On failure → toast error via existing sonner toaster, keep form data so user can retry.
4. **Test end-to-end** — submit a test from the live preview, confirm the email lands at `krista.mcpherson@zaparetech.com`, verify formatting.

## Technical notes

- **Recipient inbox is hardcoded** in the client call (not a secret). It's a non-sensitive routing constant; no value in storing it elsewhere. If you'd rather have it as a secret you can rotate without a code change, say the word.
- **No new database tables, no auth changes** — purely additive.
- **No template props are sensitive** — all values are user-submitted form data, auto-escaped by React Email.

## What I need from you to proceed

Just two things in your next message:

1. **Which sender domain?** `zaparetech.com` or `zdefense.ai`
2. After I show the DNS setup button, complete the dialog at your registrar.

Then I'll build everything in one pass and run a live test submission.

