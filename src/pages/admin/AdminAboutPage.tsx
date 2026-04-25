import { useEffect, useRef, useState } from "react";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { sitePageApi, SitePage } from "@/lib/sitePageApi";

const PAGE_KEY = "about";

interface FormState {
  title: string;
  headline: string;
  subheadline: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
}

const empty: FormState = {
  title: "",
  headline: "",
  subheadline: "",
  body: "",
  metaTitle: "",
  metaDescription: "",
};

const formatRelative = (iso: string) => {
  if (!iso) return "never";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
};

const Inner = () => {
  const [form, setForm] = useState<FormState>(empty);
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const dirtyRef = useRef(false);
  const autosaveTimer = useRef<number | null>(null);

  useEffect(() => {
    sitePageApi.get(PAGE_KEY).then((p) => {
      if (p) {
        setPage(p);
        setForm({
          title: p.title,
          headline: p.headline,
          subheadline: p.subheadline,
          body: p.body,
          metaTitle: p.metaTitle ?? "",
          metaDescription: p.metaDescription ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    dirtyRef.current = true;
    setForm((f) => ({ ...f, [k]: v }));
    scheduleAutosave();
  };

  const doSave = async (showToast = false) => {
    setStatus("saving");
    const saved = await sitePageApi.upsert({
      pageKey: PAGE_KEY,
      title: form.title,
      headline: form.headline,
      subheadline: form.subheadline,
      body: form.body,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
    });
    if (saved) {
      setPage(saved);
      setStatus("saved");
      dirtyRef.current = false;
      if (showToast) toast({ title: "Saved" });
    } else {
      setStatus("idle");
      if (showToast)
        toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const scheduleAutosave = () => {
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(() => {
      if (dirtyRef.current) doSave(false);
    }, 1500);
  };

  const metaTitleOver = form.metaTitle.length > 60;
  const metaDescOver = form.metaDescription.length > 160;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-slate-500">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-lg font-semibold text-[var(--navy)]">
            About Page
          </span>
          <span className="text-xs text-slate-400">
            {status === "saving"
              ? "Saving…"
              : status === "saved"
                ? "Saved"
                : ""}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Body editor */}
        <section className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--navy)]">
                Body (Markdown)
              </label>
              <span className="text-xs text-slate-400">
                {status === "saving"
                  ? "Saving…"
                  : status === "saved"
                    ? "Saved"
                    : ""}
              </span>
            </div>
            <MarkdownEditor
              value={form.body}
              onChange={(v) => set("body", v)}
              rows={24}
            />
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Page Details */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[var(--navy)] mb-3">
              Page Details
            </h3>
            <label className="block text-xs text-slate-600 mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
            <label className="block text-xs text-slate-600 mt-3 mb-1">
              Headline
            </label>
            <Input
              value={form.headline}
              onChange={(e) => set("headline", e.target.value)}
            />
            <label className="block text-xs text-slate-600 mt-3 mb-1">
              Subheadline
            </label>
            <Textarea
              rows={3}
              value={form.subheadline}
              onChange={(e) => set("subheadline", e.target.value)}
            />
          </div>

          {/* SEO */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[var(--navy)] mb-3">
              SEO
            </h3>
            <label className="block text-xs text-slate-600 mb-1">
              Meta Title
            </label>
            <Input
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
            <p
              className={`text-xs text-right mt-1 ${metaTitleOver ? "text-red-500" : "text-slate-400"}`}
            >
              {form.metaTitle.length} / 60
            </p>
            <label className="block text-xs text-slate-600 mt-2 mb-1">
              Meta Description
            </label>
            <Textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
            <p
              className={`text-xs text-right mt-1 ${metaDescOver ? "text-red-500" : "text-slate-400"}`}
            >
              {form.metaDescription.length} / 160
            </p>
          </div>

          {/* Save */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <button
              type="button"
              onClick={() => doSave(true)}
              disabled={status === "saving"}
              className="bg-[var(--emerald)] text-white w-full py-2.5 rounded font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60"
            >
              Save Changes
            </button>
            <p className="text-slate-400 text-xs mt-2">
              Last saved: {page ? formatRelative(page.updatedAt) : "never"}
            </p>
          </div>
        </aside>
      </main>
    </AdminLayout>
  );
};

const AdminAboutPage = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminAboutPage;
