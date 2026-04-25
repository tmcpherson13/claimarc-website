import { supabase } from "@/integrations/supabase/client";

export interface SitePage {
  id: string;
  pageKey: string;
  title: string;
  headline: string;
  subheadline: string;
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

const toSitePage = (r: Record<string, unknown>): SitePage => ({
  id: String(r.id),
  pageKey: String(r.page_key),
  title: String(r.title),
  headline: String(r.headline),
  subheadline: String(r.subheadline),
  body: String(r.body),
  metaTitle: r.meta_title ? String(r.meta_title) : null,
  metaDescription: r.meta_description ? String(r.meta_description) : null,
  updatedAt: String(r.updated_at),
});

export const sitePageApi = {
  async get(pageKey: string): Promise<SitePage | null> {
    const { data, error } = await supabase
      .from("site_pages")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    if (error || !data) return null;
    return toSitePage(data as Record<string, unknown>);
  },

  async upsert(
    page: Partial<SitePage> & { pageKey: string },
  ): Promise<SitePage | null> {
    const { data, error } = await supabase
      .from("site_pages")
      .upsert(
        {
          page_key: page.pageKey,
          title: page.title ?? "",
          headline: page.headline ?? "",
          subheadline: page.subheadline ?? "",
          body: page.body ?? "",
          meta_title: page.metaTitle ?? null,
          meta_description: page.metaDescription ?? null,
        },
        { onConflict: "page_key" },
      )
      .select()
      .single();
    if (error || !data) return null;
    return toSitePage(data as Record<string, unknown>);
  },
};
