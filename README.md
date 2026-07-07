# ClaimARC — Marketing Website

Standalone marketing site for ClaimARC: AI-powered EOB conversion, ERA processing,
and claim payment acceleration for healthcare revenue cycle teams.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (brand tokens in `src/index.css`)
- React Router
- Supabase (contact-form edge function only)

## Develop

```bash
cp .env.example .env       # then fill in your Supabase project values
npm install
npm run dev                # local dev server (http://localhost:8080)
npm run build              # production build → dist/
npm run lint
```

The site builds and runs without Supabase configured — the contact form just falls
back to a `mailto:` link until the backend is wired up.

## Structure

- `src/config/site.ts` — navigation, services, company metadata (single source of truth)
- `src/components/marketing/` — reusable marketing primitives (Section, StepFlow, StatRow, …)
- `src/pages/` — Home, EOB Conversion, ERA Processing, Claims Accelerator, Why ClaimARC, Contact
- `public/brand/` — official logo assets (rendered via `src/components/Logo.tsx`)
- `supabase/functions/contact/` — contact-form handler
- `supabase/migrations/` — `contact_submissions` table

## Deploy

### Vercel
`vercel.json` is already configured (Vite framework, SPA rewrites, immutable asset caching).

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite.
2. Add Environment Variables in **Project → Settings → Environment Variables**:
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (from your Supabase project,
   Settings → API). They're not committed to the repo.
3. Push to the connected branch → automatic deploy.
   Locally: `npx vercel` (preview) / `npx vercel --prod`.

### Supabase (contact-form backend)
The contact form posts to the `contact` edge function; without it, it falls back to `mailto:`.
To enable it against your own Supabase project:

```bash
supabase link --project-ref <your-project-ref>   # updates supabase/config.toml
supabase db push                                  # creates contact_submissions
supabase functions deploy contact
```

Optional function env:
- `RESEND_API_KEY` — emails the team via [Resend](https://resend.com) on every submission.
  `CONTACT_NOTIFY_EMAIL` overrides the recipient (defaults to `info@claimarc.com`). The
  `from` address (`notifications@claimarc.com`) must be on a domain verified in Resend.
- `CONTACT_WEBHOOK_URL` — Slack/Teams incoming webhook for instant lead notifications.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided by the Supabase runtime
automatically.

Submissions land in `public.contact_submissions` (RLS-locked; only the edge function can
write). Read them from the Supabase dashboard or build an export.
