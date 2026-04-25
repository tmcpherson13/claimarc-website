## What changes

Three files updated, then both edge functions deployed in a single batch.

### 1. `supabase/functions/generate-content/index.ts` (replace)
New version adds:
- `contentType` request param (`blog` | `white_paper`) to drive length: 600-900 words for blog, 1,500-2,500 for white papers.
- `max_tokens` raised to 8192 to fit white papers.
- Updated SYSTEM_PROMPT: recency-ranked stat selection, required Intelligence Center topic tag (one of 7), required `audience:` tags, expanded tool-schema descriptions.
- Article tool summary limit raised to 300 chars.

### 2. `supabase/functions/fetch-images/index.ts` (replace)
New version biases Unsplash queries toward "healthcare finance" via a `DOMAIN_PREFIX`, restricts to landscape + high content filter, and returns 4 photos per page with credit metadata.

### 3. `src/pages/admin/AdminContentEditor.tsx` (replace)
New version wires up the AI panel + image suggestions:
- Calls `generate-content` with `{ prompt, contentType: form.contentType }`.
- After generation, calls `fetch-images` with derived keywords from title + tags.
- Adds suggested-photo grid with `selectAndUploadPhoto` → invokes `upload-unsplash` and sets `heroAssetId`.
- Adds `imageRefreshPage` state for paging through suggestions.
- All other editor behavior (revisions, preview tokens, scheduled publish, related items, SEO fields) unchanged.

### 4. Deploy
Single `deploy_edge_functions` call for `["generate-content", "fetch-images"]`. The `AdminContentEditor.tsx` change is frontend — it goes live in preview immediately and ships to production on next Publish.

## Notes / dependencies

- `ANTHROPIC_API_KEY` and `UNSPLASH_ACCESS_KEY` are already set as runtime secrets — no secret work needed.
- `upload-unsplash` edge function is already deployed and unchanged.
- No DB migrations.
- `claude-sonnet-4-6` model name is preserved as-is from your file.

## Efficiency

Both edge functions deploy in parallel in one tool call. Frontend file is written in the same batch. Total: 3 file writes + 1 deploy call.