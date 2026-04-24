

# Refined upload UI for `/admin/assets`

Yes — fully possible. Here's the plan.

## What changes on the Assets page

Replace the current "Upload file" button (top-right) with a **prominent dropzone at the top of the page**, above the search and grid.

### Dropzone behavior
- Large bordered area (~140px tall) with dashed border, cloud-upload icon, and copy: "Drag files here, or click to browse" + secondary line "Images, PDFs, docs · up to 25 MB each".
- **Drag and drop**: Highlights emerald with solid border + tinted background while a file is hovered over the page (or the zone). Uses `dragenter` / `dragover` / `dragleave` / `drop` handlers with a counter to avoid flicker from child elements.
- **Click anywhere in the zone** opens the native file picker.
- **Multi-file support**: dropping/picking multiple files queues them all (current flow only handles one).
- **Paste support**: pasting an image from clipboard while focused on the page uploads it.

### Upload queue
Below the dropzone, render a compact list of in-progress / just-finished uploads:
- Each row: filename, size, status (Queued → Uploading → Done / Failed), and a per-file progress bar.
- Failed rows show the error message + a "Retry" link.
- Done rows fade out after ~3 seconds, or user can dismiss.
- Uploads run sequentially (simpler, avoids storage rate-limit issues) but the queue UI updates live.

### Validation
- Per-file: max 25 MB (configurable constant), reject zero-byte files. Bad files are added to the queue as "Failed" with a clear reason rather than silently toasted, so the user sees exactly which file was rejected.
- No mime-type restriction on the general assets page (it's a general library) — but the `AssetPicker` keeps its existing `accept`/`maxSizeMb` filters.

### Layout order on `/admin/assets`
```text
Header (Assets title)
─────────────────────
Dropzone               ← NEW, full-width, top of content
Upload queue (if any)  ← NEW, appears under dropzone
─────────────────────
Search input
Asset grid (existing)
```

## Should the `AssetPicker` modal get the same treatment?

Yes — same dropzone component reused inside the picker dialog, but smaller (single-file mode, since the picker resolves to one selected asset). Keeps UX consistent and removes the extra "Upload" button click.

## Files

**New**
- `src/components/admin/Dropzone.tsx` — reusable dropzone (props: `onFiles`, `accept?`, `maxSizeMb`, `multiple`, `compact?`).
- `src/components/admin/UploadQueue.tsx` — queue list with progress rows.
- `src/hooks/useUploadQueue.ts` — manages queue state, sequential upload, retry.

**Edited**
- `src/pages/admin/AdminAssets.tsx` — drop top-right Upload button, mount `Dropzone` + `UploadQueue` at top of `<main>`, refresh grid when queue completes a file.
- `src/components/admin/AssetPicker.tsx` — replace the inline "Upload" button + hidden input with `<Dropzone compact />` inside the dialog, keep `accept`/`maxSizeMb` validation.

**No schema or storage changes** — `assetsApi.upload` already does everything needed; we just call it per file from the queue.

## Technical notes

- True upload progress requires XHR; `supabase-js` v2 storage uploads don't expose progress events, so progress bars will be **indeterminate (animated stripe)** while uploading and snap to 100% on completion. Honest about this rather than faking a percentage.
- Drag-and-drop uses native HTML5 DnD (no extra library) — keeps bundle size flat.
- Paste-to-upload listens on `window` only while the Assets page is mounted, cleaned up on unmount.

