# Publishing whitepapers / insights

Drop a PDF here. On the next site build the paper gets:

- An indexed entry on `/insights`
- A dedicated page at `/insights/<slug>` with its own SEO title, description, and Open Graph image
- A sitemap entry
- An auto-generated "X-page PDF · 1.4 MB" footer line

## File-naming pattern

```
YYYY-MM-DD_slug.pdf
```

Examples:

```
2026-04-15_payer-denial-trends.pdf
2026-03-02_revenue-cycle-benchmarks-q1.pdf
```

The date and slug are parsed from the filename. Slugs use lowercase with
hyphens — no spaces, no underscores inside the slug.

## Optional metadata sidecar

For a better SEO result, drop a JSON file with the same basename next to
the PDF:

```
2026-04-15_payer-denial-trends.pdf
2026-04-15_payer-denial-trends.json
```

```json
{
  "title": "Payer Denial Trends — Q1 2026",
  "summary": "A 12-page review of denial patterns across the top 25 commercial payers, with a quantitative read on which CARC codes are accelerating.",
  "tags": ["denials", "research", "q1-2026"],
  "author": "ClaimARC Research",
  "ogImage": "/insights/og/payer-denial-trends.png"
}
```

All fields are optional. If a field is missing, sensible fallbacks are
used:

- `title` → title-cased slug
- `summary` → generic "ClaimARC research paper" placeholder
- `author` → "ClaimARC Research"
- `ogImage` → ClaimARC stacked logo

## Publishing without a developer

1. Open this folder on GitHub: <https://github.com/tmcpherson13/claimarc-website/tree/main/public/insights>
2. Click **Add file → Upload files**
3. Drag the PDF (and optional `.json`) onto the page
4. Click **Commit changes** at the bottom

Vercel will redeploy automatically and the new paper will appear at
`/insights` within a couple of minutes.
