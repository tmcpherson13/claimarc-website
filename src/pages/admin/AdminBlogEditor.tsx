import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminGate from "@/components/AdminGate";
import { blogApi, BlogPost, BlogStatus, slugify } from "@/lib/blogApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface FormState {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsInput: string;
  status: BlogStatus;
  publishedAt: string; // datetime-local value or ""
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

const empty: FormState = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  tagsInput: "",
  status: "draft",
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
};

const toDatetimeLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromDatetimeLocal = (v: string): string | null => (v ? new Date(v).toISOString() : null);

const fromPost = (p: BlogPost): FormState => ({
  title: p.title,
  slug: p.slug,
  summary: p.summary,
  body: p.body,
  tagsInput: p.tags.join(", "),
  status: p.status,
  publishedAt: toDatetimeLocal(p.publishedAt),
  seoTitle: p.seoTitle ?? "",
  seoDescription: p.seoDescription ?? "",
  canonicalUrl: p.canonicalUrl ?? "",
});

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [existing, setExisting] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (isNew) return;
    blogApi.getById(id!).then((p) => {
      if (p) {
        setExisting(p);
        setForm(fromPost(p));
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildInput = (status: BlogStatus, publishedAt: string | null) => ({
    title: form.title.trim(),
    slug: form.slug.trim(),
    summary: form.summary.trim(),
    body: form.body,
    tags: form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status,
    publishedAt,
    seoTitle: form.seoTitle.trim() || null,
    seoDescription: form.seoDescription.trim() || null,
    canonicalUrl: form.canonicalUrl.trim() || null,
  });

  const save = async (status: BlogStatus) => {
    if (!validate()) return;
    setSaving(true);
    try {
      let publishedAt = fromDatetimeLocal(form.publishedAt);
      if (status === "published" && !publishedAt) {
        publishedAt = new Date().toISOString();
      }
      const input = buildInput(status, publishedAt);
      const saved = isNew
        ? await blogApi.create(input)
        : await blogApi.update(id!, input);
      toast({ title: status === "published" ? "Published" : "Saved" });
      if (isNew) navigate(`/admin/blog/${saved.id}`, { replace: true });
      else {
        setExisting(saved);
        setForm(fromPost(saved));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      toast({ title: "Save failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminGate>
        <div className="min-h-screen bg-slate-50 p-10 text-slate-500">Loading…</div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-[var(--navy)] text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/blog" className="text-sm text-white/70 hover:text-white">← Posts</Link>
              <span className="text-lg font-semibold">{isNew ? "New post" : "Edit post"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={saving}
                onClick={() => save("draft")}
                className="bg-white text-[var(--navy)]"
              >
                Save Draft
              </Button>
              {existing?.status === "published" ? (
                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => save("draft")}
                  className="bg-white text-[var(--navy)]"
                >
                  Unpublish
                </Button>
              ) : (
                <Button
                  disabled={saving}
                  onClick={() => save("published")}
                  className="bg-[var(--emerald)] hover:bg-emerald-600"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Metadata */}
          <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
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
            </Field>
            <Field label="Summary">
              <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} />
            </Field>
            <Field label="Tags (comma-separated)">
              <Input value={form.tagsInput} onChange={(e) => set("tagsInput", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as BlogStatus)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <Field label="Published at">
                <Input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                />
              </Field>
            </div>
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">SEO (optional)</p>
              <Field label="SEO Title">
                <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              </Field>
              <Field label="SEO Description">
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  rows={2}
                />
              </Field>
              <Field label="Canonical URL">
                <Input value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} />
              </Field>
            </div>
          </section>

          {/* Right — Content + preview */}
          <section className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <label className="text-sm font-medium text-[var(--navy)]">Body (Markdown)</label>
              <Textarea
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                rows={18}
                className="mt-2 font-mono text-sm"
              />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Preview</p>
              <div className="prose prose-slate max-w-none prose-headings:text-[var(--navy)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.body || "_Nothing to preview yet._"}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AdminGate>
  );
};

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

export default AdminBlogEditor;
