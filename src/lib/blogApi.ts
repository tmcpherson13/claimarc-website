import { supabase } from "@/integrations/supabase/client";

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: BlogStatus;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

// Row shape returned by Supabase
interface BlogRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: string;
  published_at: string | null;
  updated_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
}

const fromRow = (r: BlogRow): BlogPost => ({
  id: r.id,
  title: r.title,
  slug: r.slug,
  summary: r.summary,
  body: r.body,
  tags: r.tags ?? [],
  status: (r.status as BlogStatus) ?? "draft",
  publishedAt: r.published_at,
  updatedAt: r.updated_at,
  seoTitle: r.seo_title,
  seoDescription: r.seo_description,
  canonicalUrl: r.canonical_url,
});

const toRow = (p: BlogPostInput) => ({
  title: p.title,
  slug: p.slug,
  summary: p.summary,
  body: p.body,
  tags: p.tags,
  status: p.status,
  published_at: p.publishedAt ?? null,
  seo_title: p.seoTitle ?? null,
  seo_description: p.seoDescription ?? null,
  canonical_url: p.canonicalUrl ?? null,
});

export const blogApi = {
  async listPublished(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as BlogRow[]).map(fromRow);
  },

  async listAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as BlogRow[]).map(fromRow);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as BlogRow) : null;
  },

  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as BlogRow) : null;
  },

  async create(input: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(toRow(input))
      .select()
      .single();
    if (error) throw error;
    return fromRow(data as BlogRow);
  },

  async update(id: string, input: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(toRow(input))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data as BlogRow);
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
