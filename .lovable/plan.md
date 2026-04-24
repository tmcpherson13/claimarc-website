

# Merge Blog and White Papers into "Insights" at `/blog`

Single hub at `/blog` showing all published content (blog posts + white papers) with a type filter. URL stays `/blog` so existing links and SEO are preserved.

## Page layout (`/blog`)

```text
┌──────────────────────────────────────────────┐
│  Insights                                    │
│  Payer behavior, denial intelligence, and    │
│  revenue cycle strategy.                     │
└──────────────────────────────────────────────┘

[Search…] [Type ▾] [Topic ▾] [Audience ▾]
[ All ] [ Blog ] [ White Papers ]   ← pill toggle, mirrors ?type=

┌────────── Featured (newest featured) ──────────┐
└────────────────────────────────────────────────┘

┌────────┐ ┌────────┐ ┌────────┐
│ [Blog] │ │[WP·PDF]│ │ [Blog] │   ← type badge always visible
└────────┘ └────────┘ └────────┘
```

- Combined list from `contentApi.listPublished("blog")` + `listPublished("white_paper")`, sorted by `publishedAt` desc.
- Featured: newest item with `featured: true` across both types; falls back to newest item.
- Cards always show the type badge; white-paper cards keep the existing PDF corner ribbon. Links continue to route to `/blog/:slug` or `/white-papers/:slug` (detail pages unchanged).
- Type filter syncs to `?type=blog|white_paper`. Topic, Audience, Search continue to work.

## Navigation

- `src/config/routes.ts`: replace the separate "Blog" and "White Papers" entries with a single `{ label: "Insights", to: "/blog" }`. Navbar and footer pick this up automatically.

## Routing

- `/blog` → renders the new merged `InsightsPage`.
- `/white-papers` → `<Navigate to="/blog?type=white_paper" replace />`.
- `/blog/:slug` and `/white-papers/:slug` → unchanged.

## Admin

No changes. Authors still pick `blog` or `white_paper` in the editor.

## Files

**New**
- `src/pages/InsightsPage.tsx` — merged listing (built from current `BlogIndexPage`, fetches both types, adds type filter).

**Edited**
- `src/components/public/FilterBar.tsx` — add Type select + pill row, wire to `?type=`. `matchesFilters` gains a type check.
- `src/components/public/ContentCard.tsx` — ensure type badge renders when `showTypeBadge` is set (no API change).
- `src/config/routes.ts` — collapse two entries into one "Insights" → `/blog`.
- `src/App.tsx` — point `/blog` to `InsightsPage`; `/white-papers` becomes a redirect.

**Deleted**
- `src/pages/BlogIndexPage.tsx`
- `src/pages/WhitePapersIndexPage.tsx`
- `src/components/public/WhitePaperStrip.tsx` (no longer needed)

**Unchanged**
- Detail pages, `contentApi`, all admin pages, SEO on detail pages.

