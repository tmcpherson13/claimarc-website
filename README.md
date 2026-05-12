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

## Notes

- The contact form currently hands off to the visitor's email client (`mailto:`).
  Wire it to a backend endpoint (e.g. a Supabase Edge Function) when one is available.
