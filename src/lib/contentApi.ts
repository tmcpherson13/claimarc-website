import { supabase } from "@/integrations/supabase/client";

export type ContentType = "blog" | "white_paper";
export type PostStatus = "draft" | "scheduled" | "published" | "archived";
export type CtaType = "demo" | "trial" | "none";

export interface ContentItem {
  id: string;
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
  authorId: string | null;
  relatedIds: string[];
  scheduledFor: string | null;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
}

export interface ContentInput {
  contentType: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: PostStatus;
  featured: boolean;
  ctaType: CtaType;
  heroAssetId?: string | null;
  pdfAssetId?: string | null;
  relatedIds: string[];
  scheduledFor?: string | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

interface Row {
  id: string;
  content_type: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: PostStatus;
  featured: boolean;
  cta_type: string;
  hero_asset_id: string | null;
  pdf_asset_id: string | null;
  author_id: string | null;
  related_ids: string[];
  scheduled_for: string | null;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
}

const fromRow = (r: Row): ContentItem => ({
  id: r.id,
  contentType: r.content_type,
  title: r.title,
  slug: r.slug,
  summary: r.summary,
  body: r.body,
  tags: r.tags ?? [],
  status: r.status,
  featured: r.featured,
  ctaType: (r.cta_type as CtaType) ?? "demo",
  heroAssetId: r.hero_asset_id,
  pdfAssetId: r.pdf_asset_id,
  authorId: r.author_id,
  relatedIds: r.related_ids ?? [],
  scheduledFor: r.scheduled_for,
  publishedAt: r.published_at,
  updatedAt: r.updated_at,
  createdAt: r.created_at,
  seoTitle: r.seo_title,
  seoDescription: r.seo_description,
  canonicalUrl: r.canonical_url,
});

const toRow = (input: ContentInput) => ({
  content_type: input.contentType,
  title: input.title,
  slug: input.slug,
  summary: input.summary,
  body: input.body,
  tags: input.tags,
  status: input.status,
  featured: input.featured,
  cta_type: input.ctaType,
  hero_asset_id: input.heroAssetId ?? null,
  pdf_asset_id: input.pdfAssetId ?? null,
  related_ids: input.relatedIds,
  scheduled_for: input.scheduledFor ?? null,
  published_at: input.publishedAt ?? null,
  seo_title: input.seoTitle ?? null,
  seo_description: input.seoDescription ?? null,
  canonical_url: input.canonicalUrl ?? null,
});

export const contentApi = {
  async listPublished(type?: ContentType): Promise<ContentItem[]> {
    let q = supabase
      .from("content_items")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (type) q = q.eq("content_type", type);
    const { data, error } = await q;
    if (error) throw error;
    return ((data as unknown) as Row[]).map(fromRow);
  },

  async listAll(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data as unknown) as Row[]).map(fromRow);
  },

  async getBySlug(type: ContentType, slug: string): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("content_type", type)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow((data as unknown) as Row) : null;
  },

  async getById(id: string): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow((data as unknown) as Row) : null;
  },

  async create(input: ContentInput): Promise<ContentItem> {
    const { data, error } = await supabase
      .from("content_items")
      .insert(toRow(input))
      .select()
      .single();
    if (error) throw error;
    return fromRow((data as unknown) as Row);
  },

  async update(id: string, input: ContentInput): Promise<ContentItem> {
    const { data, error } = await supabase
      .from("content_items")
      .update(toRow(input))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return fromRow((data as unknown) as Row);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) throw error;
  },

  async checkSlug(
    type: ContentType,
    slug: string,
    excludeId?: string,
  ): Promise<boolean> {
    let q = supabase
      .from("content_items")
      .select("id")
      .eq("content_type", type)
      .eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data, error } = await q.maybeSingle();
    if (error) return true; // permissive on error
    return !data;
  },

  async listRevisions(contentId: string) {
    const { data, error } = await supabase
      .from("content_revisions")
      .select("id, snapshot, edited_by, created_at")
      .eq("content_id", contentId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data ?? [];
  },

  // Restores the content_items row to the given snapshot's editable fields,
  // which automatically creates a new revision via the DB trigger.
  async restoreFromSnapshot(
    id: string,
    snapshot: Record<string, unknown>,
  ): Promise<ContentItem> {
    const input: ContentInput = {
      contentType: (snapshot.content_type as ContentType) ?? "blog",
      title: (snapshot.title as string) ?? "",
      slug: (snapshot.slug as string) ?? "",
      summary: (snapshot.summary as string) ?? "",
      body: (snapshot.body as string) ?? "",
      tags: (snapshot.tags as string[]) ?? [],
      status: (snapshot.status as PostStatus) ?? "draft",
      featured: Boolean(snapshot.featured),
      ctaType: (snapshot.cta_type as CtaType) ?? "demo",
      heroAssetId: (snapshot.hero_asset_id as string) ?? null,
      pdfAssetId: (snapshot.pdf_asset_id as string) ?? null,
      relatedIds: (snapshot.related_ids as string[]) ?? [],
      scheduledFor: (snapshot.scheduled_for as string) ?? null,
      publishedAt: (snapshot.published_at as string) ?? null,
      seoTitle: (snapshot.seo_title as string) ?? null,
      seoDescription: (snapshot.seo_description as string) ?? null,
      canonicalUrl: (snapshot.canonical_url as string) ?? null,
    };
    return contentApi.update(id, input);
  },

  async createPreviewToken(id: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke("preview-content", {
      method: "POST",
      body: { id },
      headers: { "x-action": "sign" },
    });
    // The edge function reads ?action= from the URL — fall back to direct fetch
    // for query-string routing since functions.invoke doesn't expose query params.
    if (error || !data?.token) {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/preview-content?action=sign`;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`Preview token request failed (${res.status})`);
      const j = await res.json();
      return j.token as string;
    }
    return data.token as string;
  },

  async fetchByPreviewToken(token: string): Promise<ContentItem | null> {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/preview-content?action=fetch&token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    });
    if (!res.ok) return null;
    const j = await res.json();
    return j.item ? fromRow(j.item as Row) : null;
  },

  async logPublishAudit(entry: {
    contentId: string;
    action: "publish" | "unpublish" | "archive";
    fromStatus: PostStatus | null;
    toStatus: PostStatus;
    ackPreview: boolean;
    ackHero: boolean;
    ackSeo: boolean;
    heroOverride: boolean;
    notes?: string | null;
  }) {
    const { data: userRes } = await supabase.auth.getUser();
    const actorId = userRes.user?.id;
    if (!actorId) return;
    // Cast: table is new and may not yet appear in generated types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("content_publish_audit").insert({
      content_id: entry.contentId,
      actor_id: actorId,
      action: entry.action,
      from_status: entry.fromStatus,
      to_status: entry.toStatus,
      ack_preview: entry.ackPreview,
      ack_hero: entry.ackHero,
      ack_seo: entry.ackSeo,
      hero_override: entry.heroOverride,
      notes: entry.notes ?? null,
    });
  },

  async listAudit(contentId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("content_publish_audit")
      .select("id, action, from_status, to_status, ack_preview, ack_hero, ack_seo, hero_override, created_at, actor_id")
      .eq("content_id", contentId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) return [];
    return (data ?? []) as Array<{
      id: string;
      action: "publish" | "unpublish" | "archive";
      from_status: PostStatus | null;
      to_status: PostStatus;
      ack_preview: boolean;
      ack_hero: boolean;
      ack_seo: boolean;
      hero_override: boolean;
      created_at: string;
      actor_id: string | null;
    }>;
  },
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const estimateReadTime = (body: string) => {
  const words = body.trim().split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 220));
  return `${min} min read`;
};
