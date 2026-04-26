import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import AssetPicker from "@/components/admin/AssetPicker";
import PdfUploadCard from "@/components/admin/PdfUploadCard";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import TagInput from "@/components/admin/TagInput";
import HeroImagePreview from "@/components/admin/HeroImagePreview";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

// Intelligence Center taxonomy — must stay in sync with the generate-content
// edge function's SYSTEM_PROMPT.
const TOPIC_TAGS = [
  "payer-behavior",
  "denial-prevention",
  "prior-authorization",
  "contract-intelligence",
  "underpayment-recovery",
  "compliance",
  "forecasting",
] as const;

const AUDIENCE_TAGS = [
  "audience:CFO",
  "audience:Rev Cycle Director",
  "audience:Rev Cycle Manager",
  "audience:Billing Specialist",
  "audience:Compliance Officer",
] as const;

const isTopicTag = (t: string) => (TOPIC_TAGS as readonly string[]).includes(t);
const isAudienceTag = (t: string) => t.startsWith("audience:");

// Generation settings shown in the sidebar so a user can reproduce outputs.
const GEN_SETTINGS = {
  model: "claude-sonnet-4-6",
  maxTokens: 8192,
  blogTarget: "600–900 words",
  whitePaperTarget: "1,500–2,500 words",
};

interface FormState {
  contentType: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
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
  tags: [],
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
  tags: i.tags,
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

  // AI generation panel
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiContentType, setAiContentType] = useState<ContentType>(initialType);
  const [imageRefreshPage, setImageRefreshPage] = useState(1);

  // Suggested hero images (Unsplash) — populated after AI generation
  type SuggestedPhoto = {
    id: string;
    thumb: string;
    full: string;
    downloadLocation: string;
    alt: string;
    credit: { name: string; link: string };
  };
  const [suggestedPhotos, setSuggestedPhotos] = useState<SuggestedPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);

  // Publish-confirm dialog state
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [ackPreview, setAckPreview] = useState(false);
  const [ackHero, setAckHero] = useState(false);
  const [ackSeo, setAckSeo] = useState(false);
  const [heroOverride, setHeroOverride] = useState(false);

  // Audit log state
  type AuditEntry = Awaited<ReturnType<typeof contentApi.listAudit>>[number];
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchSuggestedImages = async (title: string, tags: string[] = [], page = 1) => {
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "how", "why", "what", "when", "where", "your", "our",
    ]);
    const titleWords = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(" ")
      .filter((w) => w.length > 3 && !stopWords.has(w))
      .slice(0, 3);
    const tagWords = tags
      .slice(0, 2)
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const query =
      [...new Set([...titleWords, ...tagWords])].slice(0, 4).join(" ") ||
      "healthcare revenue cycle";

    setPhotosLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-images", {
        body: { query, page },
      });

      if (!error && Array.isArray(data?.photos)) {
        const photos = data.photos as SuggestedPhoto[];
        if (photos.length > 0) {
          setSuggestedPhotos(photos);
          setSelectedPhotoId(null);
        }
        // Unsplash returns up to 4 per page; fewer means we've reached the end.
        setHasMorePhotos(photos.length >= 4);
      } else {
        setHasMorePhotos(false);
      }
    } finally {
      setPhotosLoading(false);
    }
  };

  const selectAndUploadPhoto = async (photo: SuggestedPhoto) => {
    setSelectedPhotoId(photo.id);
    setUploadingPhoto(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "upload-unsplash",
        {
          body: {
            photoUrl: photo.full,
            downloadLocation: photo.downloadLocation,
            alt: photo.alt,
            credit: photo.credit,
          },
        },
      );
      if (error || !data?.assetId) throw new Error("Upload failed");
      setForm((prev) => ({ ...prev, heroAssetId: data.assetId as string }));
      toast({
        title: "Hero image set",
        description: `Photo by ${photo.credit.name} on Unsplash`,
      });
    } catch {
      toast({
        title: "Image upload failed",
        description: "Try selecting another photo.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { prompt: aiPrompt, contentType: aiContentType },
      });
      if (error) throw new Error(error.message || "Generation failed.");
      const parsed = data as {
        title?: string;
        slug?: string;
        summary?: string;
        tags?: string[];
        body?: string;
        error?: string;
      };
      if (parsed?.error) throw new Error(parsed.error);

      setForm((prev) => ({
        ...prev,
        title: parsed.title ?? prev.title,
        slug: parsed.slug ? slugify(parsed.slug) : prev.slug,
        summary: parsed.summary ?? prev.summary,
        tags: Array.isArray(parsed.tags) && parsed.tags.length ? parsed.tags : prev.tags,
        body: parsed.body ?? prev.body,
        // Pre-fill SEO fields only when empty — never overwrite manual entries.
        seoTitle:
          prev.seoTitle.trim().length === 0 && parsed.title
            ? parsed.title.slice(0, 60)
            : prev.seoTitle,
        seoDescription:
          prev.seoDescription.trim().length === 0 && parsed.summary
            ? parsed.summary.slice(0, 160)
            : prev.seoDescription,
      }));
      // Mark slug as user-touched so it won't be re-derived from the title.
      if (parsed.slug) setSlugTouched(true);
      setShowAiPanel(false);
      setAiPrompt("");
      toast({
        title: "Content generated",
        description: "Review the draft and publish when ready.",
      });
      // Reset image page and kick off image suggestions in the background
      setImageRefreshPage(1);
      if (parsed.title) {
        fetchSuggestedImages(parsed.title, parsed.tags ?? [], 1);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Generation failed. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (isNew) {
      setForm(empty(initialType));
      setAiContentType(initialType);
      setLoading(false);
      return;
    }
    contentApi.getById(id!).then((p) => {
      if (p) {
        setExisting(p);
        setForm(fromItem(p));
        setAiContentType(p.contentType);
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew, initialType]);

  useEffect(() => {
    contentApi.listAll().then(setAllItems).catch(() => {});
  }, []);

  // Load audit log for this content item.
  useEffect(() => {
    if (!existing?.id) {
      setAuditEntries([]);
      return;
    }
    setAuditLoading(true);
    contentApi
      .listAudit(existing.id)
      .then(setAuditEntries)
      .catch(() => setAuditEntries([]))
      .finally(() => setAuditLoading(false));
  }, [existing?.id]);

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

  // Tag analysis used by validation, the publish dialog, and the auto-suggest UI.
  const tagAnalysis = useMemo(() => {
    const topicMatches = form.tags.filter(isTopicTag);
    const audienceMatches = form.tags.filter(isAudienceTag);
    const missingTopic = topicMatches.length === 0;
    const tooManyTopics = topicMatches.length > 1;
    const missingAudience = audienceMatches.length === 0;
    const valid = !missingTopic && !tooManyTopics && !missingAudience;
    return { topicMatches, audienceMatches, missingTopic, tooManyTopics, missingAudience, valid };
  }, [form.tags]);

  const addTag = (tag: string) => {
    if (form.tags.includes(tag)) return;
    set("tags", [...form.tags, tag]);
  };

  const replaceTopicTag = (tag: string) => {
    const next = form.tags.filter((t) => !isTopicTag(t));
    set("tags", [...next, tag]);
  };

  // Heuristic auto-suggest: score each topic/audience tag by keyword overlap
  // with title + summary + existing tags.
  const tagSuggestions = useMemo(() => {
    const haystack = `${form.title} ${form.summary} ${form.tags.join(" ")}`.toLowerCase();
    const tokens = new Set(haystack.split(/[^a-z0-9]+/).filter(Boolean));

    const TOPIC_KEYWORDS: Record<(typeof TOPIC_TAGS)[number], string[]> = {
      "payer-behavior": ["payer", "payers", "weaponization", "behavioral", "shift", "sentinel"],
      "denial-prevention": ["denial", "denials", "deny", "shield", "prevention", "clean", "claims"],
      "prior-authorization": ["prior", "auth", "authorization", "preauth", "prevent"],
      "contract-intelligence": ["contract", "rate", "benchmark", "tic", "transparency", "contractintel"],
      "underpayment-recovery": ["underpayment", "underpaid", "recovery", "ledger", "writeoff"],
      "compliance": ["compliance", "audit", "auditor", "medicare", "ledger"],
      "forecasting": ["forecast", "projection", "revenue", "pipeline", "predict"],
    };

    const AUDIENCE_KEYWORDS: Record<(typeof AUDIENCE_TAGS)[number], string[]> = {
      "audience:CFO": ["cfo", "finance", "revenue", "forecast", "executive"],
      "audience:Rev Cycle Director": ["director", "rc", "leadership", "vp"],
      "audience:Rev Cycle Manager": ["manager", "operations", "shield", "prevent"],
      "audience:Billing Specialist": ["billing", "specialist", "appeal", "triage", "evidence", "resolve"],
      "audience:Compliance Officer": ["compliance", "auditor", "audit", "officer", "ledger"],
    };

    const score = (keywords: string[]) =>
      keywords.reduce((n, kw) => n + (tokens.has(kw) ? 1 : 0), 0);

    const topic = (Object.keys(TOPIC_KEYWORDS) as (typeof TOPIC_TAGS)[number][])
      .map((tag) => ({ tag, s: score(TOPIC_KEYWORDS[tag]) }))
      .filter((c) => c.s > 0 && !form.tags.includes(c.tag))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);

    const audience = (Object.keys(AUDIENCE_KEYWORDS) as (typeof AUDIENCE_TAGS)[number][])
      .map((tag) => ({ tag, s: score(AUDIENCE_KEYWORDS[tag]) }))
      .filter((c) => c.s > 0 && !form.tags.includes(c.tag))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);

    return { topic, audience };
  }, [form.title, form.summary, form.tags]);

  const validate = (forPublish = false, allowHeroOverride = false) => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    if (slugAvailable === false) e.slug = "This slug is already used by another item of this type.";
    if (form.status === "scheduled" && !form.scheduledFor)
      e.scheduledFor = "Scheduled time is required.";
    if (forPublish) {
      if (tagAnalysis.missingTopic)
        e.tags = "Add exactly one Intelligence Center topic tag before publishing.";
      else if (tagAnalysis.tooManyTopics)
        e.tags = "Only one Intelligence Center topic tag is allowed. Remove the extras.";
      else if (tagAnalysis.missingAudience)
        e.tags = "Add at least one audience: tag before publishing.";
      // Hard hero-image gate. Admins can override via the publish dialog.
      if (!form.heroAssetId && !allowHeroOverride)
        e.heroAssetId = "A hero image is required to publish. Pick one or override in the publish dialog.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (
    status?: PostStatus,
    audit?: {
      ackPreview: boolean;
      ackHero: boolean;
      ackSeo: boolean;
      heroOverride: boolean;
    },
  ) => {
    const targetStatus = status ?? form.status;
    if (!isAdmin && (targetStatus === "published" || targetStatus === "archived")) {
      toast({
        title: "Permission denied",
        description: "Only admins can publish or archive.",
        variant: "destructive",
      });
      return;
    }
    if (!validate(targetStatus === "published", audit?.heroOverride ?? false)) return;
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
        tags: form.tags.map((t) => t.trim()).filter(Boolean),
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
      const previousStatus = existing?.status ?? null;
      const saved = isNew
        ? await contentApi.create(input)
        : await contentApi.update(id!, input);

      // Write audit row for status transitions we care about. Drafts and
      // scheduled saves are not audited — those go to the revisions log.
      const auditAction =
        targetStatus === "published"
          ? "publish"
          : targetStatus === "archived"
            ? "archive"
            : previousStatus === "published" && targetStatus === "draft"
              ? "unpublish"
              : null;

      if (auditAction) {
        try {
          await contentApi.logPublishAudit({
            contentId: saved.id,
            action: auditAction,
            fromStatus: previousStatus,
            toStatus: targetStatus,
            ackPreview: audit?.ackPreview ?? false,
            ackHero: audit?.ackHero ?? false,
            ackSeo: audit?.ackSeo ?? false,
            heroOverride: audit?.heroOverride ?? false,
          });
          // Refresh the inline audit panel so the new row shows immediately.
          contentApi.listAudit(saved.id).then(setAuditEntries).catch(() => {});
        } catch {
          // Audit failure should not block the save itself.
          toast({
            title: "Audit log warning",
            description: "Action saved, but audit entry could not be written.",
          });
        }
      }

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

  const requestPublish = () => {
    // Validate everything except the hero gate — the dialog handles the
    // hero override flow in-context.
    if (!validate(true, true)) {
      toast({
        title: "Cannot publish yet",
        description: "Fix the highlighted issues, then try again.",
        variant: "destructive",
      });
      return;
    }
    setAckPreview(false);
    setAckHero(false);
    setAckSeo(false);
    setHeroOverride(false);
    setPublishDialogOpen(true);
  };

  const confirmPublish = async () => {
    setPublishDialogOpen(false);
    await save("published", {
      ackPreview,
      ackHero,
      ackSeo,
      heroOverride,
    });
  };

  const heroOk = !!form.heroAssetId;
  const seoOk =
    form.seoTitle.trim().length > 0 &&
    form.seoDescription.trim().length > 0;
  // Hard hero gate: must have a hero OR an explicit admin override.
  const heroGatePassed = heroOk || heroOverride;
  const allChecksAcked = ackPreview && ackHero && ackSeo && heroGatePassed;

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
    return <AdminLayout><div className="p-10 text-slate-500">Loading…</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link to="/admin/content" className="text-sm text-slate-500 hover:text-[var(--navy)]">
              ← Content
            </Link>
            <span className="text-lg font-semibold text-[var(--navy)]">
              {isNew ? "New " : "Edit "}
              {form.contentType === "blog" ? "blog post" : "white paper"}
            </span>
            {existing && (
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  existing.status === "published"
                    ? "bg-emerald-100 text-emerald-800"
                    : existing.status === "scheduled"
                      ? "bg-amber-100 text-amber-800"
                      : existing.status === "archived"
                        ? "bg-zinc-200 text-zinc-700"
                        : "bg-slate-100 text-slate-700"
                }`}
              >
                {existing.status.charAt(0).toUpperCase() + existing.status.slice(1)}
              </span>
            )}
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
            <button
              type="button"
              onClick={openPreview}
              disabled={isNew}
              title={isNew ? "Save first to preview" : undefined}
              aria-label="Preview"
              className="border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M11 3h6v6" />
                <path d="M17 3l-8 8" />
                <path d="M15 11v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
              </svg>
              Preview
            </button>
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
                onClick={requestPublish}
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
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <Field label="Content type">
              <select
                value={form.contentType}
                onChange={(e) => set("contentType", e.target.value as ContentType)}
                disabled={!isNew}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="blog">Blog post (600–900 words)</option>
                <option value="white_paper">White paper (1,500–2,500 words)</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {isNew
                  ? "Drives AI word-count rules and image-suggestion bias."
                  : "Content type is locked after creation."}
              </p>
            </Field>
          </div>

          {form.contentType === "white_paper" && (
            <PdfUploadCard
              value={form.pdfAssetId}
              onChange={(id) => set("pdfAssetId", id)}
              onSuggestTitle={(suggested) => {
                if (!form.title.trim()) onTitleChange(suggested);
              }}
              status={form.status}
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
              <p
                className={`text-xs text-right mt-1 ${
                  form.summary.length > 160 ? "text-red-500" : "text-slate-400"
                }`}
              >
                {form.summary.length} / 160 characters
              </p>
            </Field>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <label className="text-sm font-medium text-[var(--navy)] block mb-2">
              Body (Markdown)
            </label>
            <MarkdownEditor
              value={form.body}
              onChange={(v) => set("body", v)}
              rows={20}
            />
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* AI Generate panel */}
          <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--navy-dk)] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Generate with Z</p>
                <p className="text-white/50 text-xs mt-0.5">
                  Describe what you want — Z writes it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="text-[var(--emerald)] text-xs hover:underline shrink-0"
              >
                {showAiPanel ? "Cancel" : "Open"}
              </button>
            </div>
            {showAiPanel && (
              <div className="mt-4">
                <p className="text-white/50 text-xs mb-2">What are you creating?</p>
                <div className="flex gap-2 mb-3">
                  {(
                    [
                      { value: "blog" as ContentType, label: "Blog Post" },
                      { value: "white_paper" as ContentType, label: "White Paper" },
                    ]
                  ).map((opt) => {
                    const selected = aiContentType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setAiContentType(opt.value);
                          set("contentType", opt.value);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          selected
                            ? "bg-[var(--emerald)] text-white border-[var(--emerald)]"
                            : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder='e.g. "Write an article explaining how Ledger handles Medicare 60-day compliance for auditors and compliance officers"'
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--emerald)] focus:ring-1 focus:ring-[var(--emerald)] resize-none"
                />
                {aiError && <p className="text-red-400 text-xs mt-2">{aiError}</p>}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-white/30 text-[10px] leading-tight max-w-[140px]">
                    Overwrites title, summary, body, and tags. Slug auto-generated.
                  </p>
                  <button
                    type="button"
                    onClick={generateWithAI}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="bg-[var(--emerald)] hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
                  >
                    {aiLoading ? (
                      <>
                        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Z is writing…
                      </>
                    ) : (
                      "✦ Ask Z"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>



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
            <Field label="Tags" error={errors.tags}>
              <TagInput
                value={form.tags}
                onChange={(tags) => set("tags", tags)}
                placeholder="Type a tag and press Enter…"
              />
            </Field>

            {/* Required-tag validation status with one-click fixes */}
            <div
              className={`rounded-md border p-3 text-xs ${
                tagAnalysis.valid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-semibold mb-2">
                {tagAnalysis.valid
                  ? "✓ Required tags look good"
                  : "Required tags missing"}
              </p>

              {/* Topic tag — exactly one */}
              {(tagAnalysis.missingTopic || tagAnalysis.tooManyTopics) && (
                <div className="mb-2">
                  <p className="mb-1">
                    {tagAnalysis.missingTopic
                      ? "Pick one Intelligence Center topic tag:"
                      : "Only one topic tag allowed — pick one to keep:"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {TOPIC_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          tagAnalysis.tooManyTopics ? replaceTopicTag(t) : addTag(t)
                        }
                        className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px]"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Audience tags — at least one */}
              {tagAnalysis.missingAudience && (
                <div>
                  <p className="mb-1">Add at least one audience tag:</p>
                  <div className="flex flex-wrap gap-1">
                    {AUDIENCE_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addTag(t)}
                        className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px]"
                      >
                        + {t.replace("audience:", "")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auto-suggest from title/summary */}
            {(tagSuggestions.topic.length > 0 || tagSuggestions.audience.length > 0) && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
                <p className="font-semibold text-slate-700 mb-2">
                  ✨ Suggested tags
                  <span className="ml-1 font-normal text-slate-500">
                    based on title and summary
                  </span>
                </p>
                {tagSuggestions.topic.length > 0 && (
                  <div className="mb-2">
                    <p className="text-slate-500 mb-1">Topic</p>
                    <div className="flex flex-wrap gap-1">
                      {tagSuggestions.topic.map(({ tag }) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            tagAnalysis.topicMatches.length > 0
                              ? replaceTopicTag(tag)
                              : addTag(tag)
                          }
                          className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px]"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {tagSuggestions.audience.length > 0 && (
                  <div>
                    <p className="text-slate-500 mb-1">Audience</p>
                    <div className="flex flex-wrap gap-1">
                      {tagSuggestions.audience.map(({ tag }) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px]"
                        >
                          + {tag.replace("audience:", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
            <HeroImagePreview
              assetId={form.heroAssetId}
              onRemove={() => set("heroAssetId", null)}
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
          {/* Generation settings — read-only reference for reproducing outputs */}
          <Panel title="Generation settings">
            <dl className="text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Model</dt>
                <dd className="font-mono text-[11px] text-slate-900">{GEN_SETTINGS.model}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Max tokens</dt>
                <dd className="font-mono text-[11px] text-slate-900">{GEN_SETTINGS.maxTokens}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Content type</dt>
                <dd className="text-slate-900">
                  {form.contentType === "blog" ? "Blog post" : "White paper"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Target length</dt>
                <dd className="text-slate-900">
                  {form.contentType === "blog"
                    ? GEN_SETTINGS.blogTarget
                    : GEN_SETTINGS.whitePaperTarget}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
              Reuse the same prompt with these settings to reproduce a draft.
            </p>
          </Panel>

          {/* Publish history (audit log) */}
          {existing && (
            <Panel title="Publish history">
              {auditLoading ? (
                <p className="text-xs text-slate-500">Loading…</p>
              ) : auditEntries.length === 0 ? (
                <p className="text-xs text-slate-500">No publish events yet.</p>
              ) : (
                <ul className="space-y-2 max-h-72 overflow-y-auto">
                  {auditEntries.map((a) => (
                    <li key={a.id} className="text-xs border border-slate-200 rounded px-2 py-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            a.action === "publish"
                              ? "text-emerald-700"
                              : a.action === "unpublish"
                                ? "text-amber-700"
                                : "text-slate-600"
                          }`}
                        >
                          {a.action.charAt(0).toUpperCase() + a.action.slice(1)}
                        </span>
                        <span className="text-slate-500">
                          {new Date(a.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-500">
                        {a.from_status ?? "—"} → {a.to_status}
                      </div>
                      {a.action === "publish" && (
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                          <span className={a.ack_preview ? "text-emerald-700" : "text-slate-400"}>
                            {a.ack_preview ? "✓" : "✗"} preview
                          </span>
                          <span className={a.ack_hero ? "text-emerald-700" : "text-slate-400"}>
                            {a.ack_hero ? "✓" : "✗"} hero
                          </span>
                          <span className={a.ack_seo ? "text-emerald-700" : "text-slate-400"}>
                            {a.ack_seo ? "✓" : "✗"} SEO
                          </span>
                          {a.hero_override && (
                            <span className="text-amber-700 font-semibold">⚠ hero override</span>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </aside>
      </main>

      {/* Publish confirmation dialog with required checklist */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Publish to production?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make <span className="font-semibold">{form.title || "this item"}</span>{" "}
              live at{" "}
              <span className="font-mono text-xs">{previewPath}</span>. Confirm each item below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 my-2">
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <Checkbox
                checked={ackPreview}
                onCheckedChange={(v) => setAckPreview(v === true)}
                className="mt-0.5"
              />
              <span>
                I opened the preview link and reviewed the rendered post.
                {existing && (
                  <button
                    type="button"
                    onClick={openPreview}
                    className="ml-2 text-[var(--emerald)] hover:underline text-xs"
                  >
                    Open preview ↗
                  </button>
                )}
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <Checkbox
                checked={ackHero}
                onCheckedChange={(v) => setAckHero(v === true)}
                disabled={!heroGatePassed}
                className="mt-0.5"
              />
              <span>
                Hero image is set.
                {!heroOk && (
                  <span className="block mt-1 text-amber-700 text-xs">
                    No hero image attached. Publish is blocked unless an admin overrides below.
                  </span>
                )}
              </span>
            </label>

            {!heroOk && isAdmin && (
              <label className="flex items-start gap-3 text-sm cursor-pointer pl-7 border-l-2 border-amber-300">
                <Checkbox
                  checked={heroOverride}
                  onCheckedChange={(v) => setHeroOverride(v === true)}
                  className="mt-0.5"
                />
                <span className="text-amber-900">
                  Override: publish without a hero image (logged to audit).
                </span>
              </label>
            )}

            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <Checkbox
                checked={ackSeo}
                onCheckedChange={(v) => setAckSeo(v === true)}
                className="mt-0.5"
              />
              <span>
                SEO title and description are filled in.
                {!seoOk && (
                  <span className="ml-1 text-amber-600 text-xs">
                    (One or both SEO fields are empty.)
                  </span>
                )}
              </span>
            </label>
          </div>

          <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
            <div><span className="text-slate-400">Type:</span> {form.contentType === "blog" ? "Blog post" : "White paper"}</div>
            <div><span className="text-slate-400">Slug:</span> <span className="font-mono">{form.slug}</span></div>
            <div><span className="text-slate-400">Tags:</span> {form.tags.join(", ") || "—"}</div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!allChecksAcked || saving}
              onClick={confirmPublish}
              className="bg-[var(--emerald)] hover:bg-emerald-600"
            >
              Publish now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
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
