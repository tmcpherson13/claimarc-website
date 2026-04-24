

# CMS Upgrade Plan — Confirmed Scope

Decisions locked in:
1. Drop "review" status.
2. Two roles: `admin` (full) + `editor` (draft/edit only, no publish/delete).
3. Revision history: snapshots + restore, no diff UI.
4. CTA selector: enum dropdown (Demo / Trial / None).
5. White papers: long-form readable pages with optional PDF download.

## Phase 1 — Schema foundation

**Migration `<ts>_cms_v2.sql`:**
- Extend `app_role` enum: add `editor`.
- New enum `content_type`: `blog` | `white_paper`.
- New enum `post_status`: `draft` | `scheduled` | `published` | `archived`.
- Rename `blog_posts` → `content_items`. Add columns:
  - `content_type content_type NOT NULL DEFAULT 'blog'`
  - `featured boolean NOT NULL DEFAULT false`
  - `cta_type text NOT NULL DEFAULT 'demo'` (`demo` | `trial` | `none`)
  - `hero_asset_id uuid` (FK → `assets`)
  - `pdf_asset_id uuid` (FK → `assets`, nullable, white-paper optional download)
  - `author_id uuid` (FK → `auth.users`)
  - `related_ids uuid[] NOT NULL DEFAULT '{}'`
  - `scheduled_for timestamptz`
- Migrate `status text` → `post_status` enum (map existing `draft`/`published`).
- Unique index on `(content_type, slug)`.
- New tables: `assets` (id, storage_path, mime_type, size_bytes, original_name, uploaded_by, created_at), `content_revisions` (id, content_id, snapshot jsonb, edited_by, created_at).
- New storage bucket `content-assets` (public read, admin/editor write).
- RLS:
  - Public SELECT: `status = 'published'`.
  - Admin: full CRUD.
  - Editor: INSERT + UPDATE drafts only. Trigger blocks editors from setting `status` to `published`/`archived` and from DELETE.
  - `assets`: admin/editor full CRUD; public SELECT.
  - `content_revisions`: admin/editor SELECT; INSERT via trigger only.
- Trigger: snapshot `content_items` rows into `content_revisions` on every UPDATE.
- `pg_cron` job (every 5 min): flip `scheduled` → `published` when `scheduled_for <= now()`.

## Phase 2 — Admin console

**`/admin/content` (list)** — replaces `/admin/blog`:
- Columns: title, type, status, author, updated, scheduled/published, featured.
- Filters: type, status, tag, author. Search by title/slug.
- Bulk: archive/unarchive, delete (admin only).
- "New" dropdown: Blog / White paper.

**`/admin/content/:id` (editor)** — two-column layout, sticky right sidebar:
- Status panel: status dropdown, schedule datetime (when `scheduled`), publish/unpublish/archive buttons gated by role.
- SEO panel: SEO title, description, canonical, OG image picker, slug + live duplicate check.
- Taxonomy: tags, content type (locked after create), featured toggle.
- CTA selector: radio (Demo / Trial / None).
- Related content: searchable multi-select from other published items (max 3).
- Hero asset: asset picker.
- White papers only: optional PDF asset picker.
- Revisions: collapsible last-20 list with "Restore" (admin only).
- Main column: title, slug, summary, body (markdown editor + live preview).
- Preview button: opens public route with `?preview=<token>` (signed token verified by edge function).

## Phase 3 — Assets

- `/admin/assets`: grid of uploads (images + PDFs), search, copy URL, delete.
- `<AssetPicker>` dialog reused by hero, OG, inline body insert, PDF picker.
- Browser-direct uploads to `content-assets` bucket; signed URLs for drafts, public URLs for published.

## Phase 4 — Public surface

- `/blog` filters to `content_type = 'blog'`, renders featured hero.
- New `/white-papers` index + `/white-papers/:slug` detail page (mirrors blog styling, do not redesign). Long-form body with optional "Download PDF" button when `pdf_asset_id` set.
- `BlogPostPage` + `WhitePaperPage` read `cta_type`, render related-content cards (max 3).
- Add `/white-papers` to `marketingRoutes`.
- Sitemap regenerated to include published items.
- Toasts + loading states throughout admin.

## Files

**New:** `supabase/migrations/<ts>_cms_v2.sql`, `src/lib/contentApi.ts`, `src/lib/assetsApi.ts`, `src/hooks/useSlugAvailability.ts`, `src/components/admin/{AssetPicker,RelatedContentPicker,RevisionList,StatusPanel,SeoPanel}.tsx`, `src/pages/admin/{AdminContentList,AdminContentEditor,AdminAssets}.tsx`, `src/pages/{WhitePapersIndexPage,WhitePaperPage}.tsx`, `supabase/functions/preview-token/index.ts`.

**Edited:** `src/App.tsx` (new routes + `/admin/blog*` → `/admin/content*` redirect), `src/pages/BlogIndexPage.tsx`, `src/pages/BlogPostPage.tsx`, `src/pages/admin/AdminDashboard.tsx`, `src/config/routes.ts`.

**Deleted:** `src/pages/admin/AdminBlogList.tsx`, `src/pages/admin/AdminBlogEditor.tsx`, `src/lib/blogApi.ts`.

## Order of execution

Phase 1 (migration) → Phase 2 (admin list + editor) → Phase 3 (assets + picker) → Phase 4 (public white-papers + CTA/related rendering). Each phase is shippable on its own; you can stop after any phase.

## Caveats

- Existing `/admin/blog/*` URLs will redirect to `/admin/content/*`.
- Preview tokens require an edge function; published content is unaffected.
- `pg_cron` requires extension enable (handled in migration).

