import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminGate from "@/components/AdminGate";
import AssetPicker from "@/components/admin/AssetPicker";
import PdfUploadCard from "@/components/admin/PdfUploadCard";
import {
  contentApi,
  ContentItem,
  ContentType,
  CtaType,
  PostStatus,
  slugify,
} from "@/lib/contentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface FormState {
  contentType: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsInput: string;
  status: PostStatus;
  featured: boolean;
  ctaType: CtaType;
  heroAssetId: string | null;
  pdfAssetId: string | null;
  relatedIds: string[];
  scheduledFor: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

const todayLocal = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const empty = (type: ContentType): FormState => ({
  contentType: type,
  title: "",
  slug: "",
  summary: "",
  body: "",
  tagsInput: "",
  status: "draft",
  featured: false,
  ctaType: "demo",
  heroAssetId: null,
  pdfAssetId: null,
  relatedIds: [],
  scheduledFor: "",
  publishedAt: todayLocal(),
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
});

const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocal = (v: string): string | null => (v ? new Date(v).toISOString() : null);

const fromItem = (i: ContentItem): FormState => ({
  contentType: i.contentType,
  title: i.title,
  slug: i.slug,
  summary: i.summary,
  body: i.body,
  tagsInput: i.tags.join(", "),
  status: i.status,
  featured: i.featured,
  ctaType: i.ctaType,
  heroAssetId: i.heroAssetId,
  pdfAssetId: i.pdfAssetId,
  relatedIds: i.relatedIds,
  scheduledFor: toLocal(i.scheduledFor),
  publishedAt: toLocal(i.publishedAt),
  seoTitle: i.seoTitle ?? "",
  seoDescription: i.seoDescription ?? "",
  canonicalUrl: i.canonicalUrl ?? "",
});

const Inner = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const [params] = useSearchParams();
  const initialType = (params.get("type") as ContentType) || "blog";
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  const [form, setForm] = useState<FormState>(empty(initialType));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [existing, setExisting] = useState<ContentItem | null>(null);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revisions, setRevisions] = useState<any[]>([]);
  const [revisionsOpen, setRevisionsOpen] = useState(false);

  useEffect(() => {
    if (isNew) {
      setForm(empty(initialType));
      setLoading(false);
      return;
    }
    contentApi.getById(id!).then((p) => {
      if (p) {
        setExisting(p);
        setForm(fromItem(p));
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew, initialType]);

  useEffect(() => {
    contentApi.listAll().then(setAllItems).catch(() => {});
  }, []);

  // Slug availability check (debounced)
  useEffect(() => {
    if (!form.slug.trim()) {
      setSlugAvailable(null);
      return;
    }
    const t = setTimeout(async () => {
      const ok = await contentApi.checkSlug(form.contentType, form.slug, existing?.id);
      setSlugAvailable(ok);
    }, 400);
    return () => clearTimeout(t);
  }, [form.slug, form.contentType, existing?.id]);

  const loadRevisions = async () => {
    if (!existing) return;
    const r = await contentApi.listRevisions(existing.id);
    setRevisions(r);
    setRevisionsOpen(true);
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onTitleChange = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugTouched ? f.slug : slugify(v),
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    if (slugAvailable === false) e.slug = "This slug is already used by another item of this type.";
    if (form.status === "scheduled" && !form.scheduledFor)
      e.scheduledFor = "Scheduled time is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (status?: PostStatus) => {
    const targetStatus = status ?? form.status;
    if (!isAdmin && (targetStatus === "published" || targetStatus === "archived")) {
      toast({
        title: "Permission denied",
        description: "Only admins can publish or archive.",
        variant: "destructive",
      });
      return;
    }
    if (!validate()) return;
    setSaving(true);
    try {
      let publishedAt = fromLocal(form.publishedAt);
      if (targetStatus === "published" && !publishedAt) publishedAt = new Date().toISOString();
      const input = {
        contentType: form.contentType,
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim(),
        body: form.body,
        tags: form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        status: targetStatus,
        featured: form.featured,
        ctaType: form.ctaType,
        heroAssetId: form.heroAssetId,
        pdfAssetId: form.contentType === "white_paper" ? form.pdfAssetId : null,
        relatedIds: form.relatedIds,
        scheduledFor: targetStatus === "scheduled" ? fromLocal(form.scheduledFor) : null,
        publishedAt,
        seoTitle: form.seoTitle.trim() || null,
        seoDescription: form.seoDescription.trim() || null,
        canonicalUrl: form.canonicalUrl.trim() || null,
      };
      const saved = isNew
        ? await contentApi.create(input)
        : await contentApi.update(id!, input);
      toast({ title: targetStatus === "published" ? "Published" : "Saved" });
      if (isNew) navigate(`/admin/content/${saved.id}`, { replace: true });
      else {
        setExisting(saved);
        setForm(fromItem(saved));
      }
    } catch (e: unknown) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Failed to save",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const restoreRevision = async (snapshot: Record<string, unknown>) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can restore revisions.",
        variant: "destructive",
      });
      return;
    }
    if (!existing) return;
    if (
      !confirm(
        "Restore this revision? Current content will be replaced with the snapshot and a new revision will be saved.",
      )
    )
      return;
    setSaving(true);
    try {
      const restored = await contentApi.restoreFromSnapshot(existing.id, snapshot);
      setExisting(restored);
      setForm(fromItem(restored));
      // Refresh revision list to include the new snapshot just created by the trigger.
      const r = await contentApi.listRevisions(existing.id);
      setRevisions(r);
      toast({ title: "Revision restored" });
    } catch (e: unknown) {
      toast({
        title: "Restore failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openPreview = async () => {
    if (!existing) {
      toast({
        title: "Save first",
        description: "Save the item before generating a preview link.",
      });
      return;
    }
    if (existing.status === "published") {
      window.open(previewPath, "_blank", "noreferrer");
      return;
    }
    try {
      const token = await contentApi.createPreviewToken(existing.id);
      window.open(`${previewPath}?preview=${encodeURIComponent(token)}`, "_blank", "noreferrer");
      toast({ title: "Preview link opened", description: "Token expires in 30 minutes." });
    } catch (e: unknown) {
      toast({
        title: "Preview failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  const relatedCandidates = useMemo(
    () =>
      allItems.filter(
        (i) =>
          i.id !== existing?.id &&
          i.status === "published" &&
          !form.relatedIds.includes(i.id),
      ),
    [allItems, existing?.id, form.relatedIds],
  );
  const relatedSelected = useMemo(
    () => form.relatedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ContentItem[],
    [form.relatedIds, allItems],
  );

  const previewPath =
    form.contentType === "blog" ? `/blog/${form.slug}` : `/white-papers/${form.slug}`;

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-10 text-slate-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[var(--navy)] text-white px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link to="/admin/content" className="text-sm text-white/70 hover:text-white">
              ← Content
            </Link>
            <span className="text-lg font-semibold">
              {isNew ? "New " : "Edit "}
              {form.contentType === "blog" ? "blog post" : "white paper"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {existing && (
              <Button
                type="button"
                variant="outline"
                onClick={openPreview}
                className="bg-white text-[var(--navy)]"
              >
                Preview ↗
              </Button>
            )}
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => save("draft")}
              className="bg-white text-[var(--navy)]"
            >
              Save Draft
            </Button>
            {isAdmin && existing?.status === "published" ? (
              <Button
                variant="outline"
                disabled={saving}
                onClick={() => save("draft")}
                className="bg-white text-[var(--navy)]"
              >
                Unpublish
              </Button>
            ) : null}
            {isAdmin && (
              <Button
                disabled={saving}
                onClick={() => save("published")}
                className="bg-[var(--emerald)] hover:bg-emerald-600"
              >
                Publish
              </Button>
            )}
            {isAdmin && existing && existing.status !== "archived" && (
              <Button
                variant="outline"
                disabled={saving}
                onClick={() => save("archived")}
                className="bg-white text-[var(--navy)]"
              >
                Archive
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <section className="lg:col-span-2 space-y-6">
          {form.contentType === "white_paper" && (
            <PdfUploadCard
              value={form.pdfAssetId}
              onChange={(id) => set("pdfAssetId", id)}
              onSuggestTitle={(suggested) => {
                if (!form.title.trim()) onTitleChange(suggested);
              }}
            />
          )}

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <Field label="Title" error={errors.title}>
              <Input value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
            </Field>
            <Field label="Slug" error={errors.slug}>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
              {form.slug && slugAvailable === true && (
                <p className="mt-1 text-xs text-emerald-600">Slug is available.</p>
              )}
              {form.slug && slugAvailable === false && (
                <p className="mt-1 text-xs text-red-600">
                  Slug is already in use for {form.contentType === "blog" ? "a blog post" : "a white paper"}.
                </p>
              )}
            </Field>
            <Field label="Summary">
              <Textarea
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                rows={3}
              />
            </Field>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <label className="text-sm font-medium text-[var(--navy)]">Body (Markdown)</label>
            <Textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={20}
              className="mt-2 font-mono text-sm"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Live preview
            </p>
            <div className="prose prose-slate max-w-none prose-headings:text-[var(--navy)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.body || "_Nothing to preview yet._"}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Status panel */}
          <Panel title="Status">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as PostStatus)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                {isAdmin && <option value="published">Published</option>}
                {isAdmin && <option value="archived">Archived</option>}
              </select>
            </Field>
            {form.status === "scheduled" && (
              <Field label="Publish at" error={errors.scheduledFor}>
                <Input
                  type="datetime-local"
                  value={form.scheduledFor}
                  onChange={(e) => set("scheduledFor", e.target.value)}
                />
              </Field>
            )}
            <Field label="Published at (override)">
              <Input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </Field>
          </Panel>

          {/* Taxonomy */}
          <Panel title="Taxonomy">
            <Field label="Content type">
              <select
                value={form.contentType}
                disabled={!isNew}
                onChange={(e) => set("contentType", e.target.value as ContentType)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:bg-slate-50"
              >
                <option value="blog">Blog</option>
                <option value="white_paper">White paper</option>
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <Input
                value={form.tagsInput}
                onChange={(e) => set("tagsInput", e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[var(--navy)]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
          </Panel>

          {/* CTA */}
          <Panel title="CTA">
            <div className="space-y-2 text-sm text-[var(--navy)]">
              {(["demo", "trial", "none"] as CtaType[]).map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cta"
                    checked={form.ctaType === c}
                    onChange={() => set("ctaType", c)}
                  />
                  {c === "demo" ? "Book a demo" : c === "trial" ? "30-day evaluation" : "None"}
                </label>
              ))}
            </div>
          </Panel>

          {/* Hero asset */}
          <Panel title="Hero image">
            <AssetPicker
              value={form.heroAssetId}
              onChange={(id) => set("heroAssetId", id)}
              accept="image/"
              label="Pick image"
            />
          </Panel>

          {/* PDF asset is managed by the prominent PdfUploadCard at the top of the editor
              for white papers, so no sidebar panel is needed here. */}


          {/* Related */}
          <Panel title="Related content (max 3)">
            <div className="space-y-2">
              {relatedSelected.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <span className="truncate">{r.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "relatedIds",
                        form.relatedIds.filter((rid) => rid !== r.id),
                      )
                    }
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {form.relatedIds.length < 3 && relatedCandidates.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value)
                      set("relatedIds", [...form.relatedIds, e.target.value]);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="">+ Add related…</option>
                  {relatedCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.contentType === "blog" ? "B" : "WP"}] {c.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Panel>

          {/* SEO */}
          <Panel title="SEO">
            <Field label="SEO title">
              <Input
                value={form.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)}
              />
            </Field>
            <Field label="SEO description">
              <Textarea
                value={form.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)}
                rows={2}
              />
            </Field>
            <Field label="Canonical URL">
              <Input
                value={form.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
              />
            </Field>
          </Panel>

          {/* Revisions */}
          {existing && (
            <Panel title="Revisions">
              <Button
                variant="outline"
                size="sm"
                onClick={loadRevisions}
                className="w-full"
              >
                {revisionsOpen ? "Refresh revisions" : "Load revisions"}
              </Button>
              {revisionsOpen && (
                <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                  {revisions.length === 0 ? (
                    <p className="text-xs text-slate-500">No revisions yet.</p>
                  ) : (
                    revisions.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-xs border border-slate-200 rounded px-2 py-1"
                      >
                        <span>{new Date(r.created_at).toLocaleString()}</span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => restoreRevision(r.snapshot)}
                            className="text-[var(--emerald)] hover:underline"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </Panel>
          )}
        </aside>
      </main>
    </div>
  );
};

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-5">
    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
      {title}
    </p>
    <div className="space-y-3">{children}</div>
  </section>
);

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-sm font-medium text-[var(--navy)] block mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const AdminContentEditor = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminContentEditor;
