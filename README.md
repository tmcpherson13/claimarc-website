# ClaimARC — Marketing Website

Premium marketing site for ClaimARC: AI-powered EOB conversion, ERA processing,
and claim payment acceleration for healthcare revenue cycle teams.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (brand tokens defined in `src/index.css`)
- React Router

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run lint
```

## Structure

- `src/config/site.ts` — navigation, services, company metadata (single source of truth)
- `src/components/marketing/` — reusable marketing primitives (Section, StepFlow, StatRow, etc.)
- `src/pages/` — Home, EOB Conversion, ERA Processing, Claims Accelerator, Why ClaimARC, Contact

## Deploy

### Vercel
`vercel.json` is already configured (Vite framework, SPA rewrites, asset caching).

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite.
2. The build picks up `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` from the
   committed `.env`; you can also set them in **Project → Settings → Environment Variables**.
3. Push to the connected branch (or merge the PR) → automatic deploy.
   Locally: `npx vercel` (preview) / `npx vercel --prod`.

### Supabase (contact form backend)
The contact form posts to the `contact` edge function and falls back to `mailto:` if it
isn't deployed yet. To enable it:

```bash
supabase link --project-ref <your-project-ref>   # ref is in .env
supabase db push                                  # creates contact_submissions
supabase functions deploy contact
```

Optional env on the function: `CONTACT_WEBHOOK_URL` (Slack/Teams incoming webhook) for
instant lead notifications. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided
automatically by the Supabase runtime.

## Notes

- Submissions land in `public.contact_submissions` (RLS-locked; only the edge function
  can write). Query them from the Supabase dashboard or wire up an export.
