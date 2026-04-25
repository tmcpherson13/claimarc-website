import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

// These prefixes bias Unsplash toward healthcare and financial imagery
// while still allowing the article topic to drive the search.
const DOMAIN_PREFIX = "healthcare finance";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, page = 1 } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return new Response(JSON.stringify({ error: "Query is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessKey = Deno.env.get("UNSPLASH_ACCESS_KEY");
    if (!accessKey) throw new Error("UNSPLASH_ACCESS_KEY not set");

    const biasedQuery = `${DOMAIN_PREFIX} ${query}`;

    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", biasedQuery);
    url.searchParams.set("per_page", "4");
    url.searchParams.set("page", String(page));
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("content_filter", "high");

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!resp.ok) throw new Error(`Unsplash API error: ${resp.status}`);

    const data = await resp.json();

    const photos = (data.results ?? []).map((p: Record<string, unknown>) => ({
      id: p.id,
      thumb: (p.urls as Record<string, string>).small,
      full: (p.urls as Record<string, string>).regular,
      downloadLocation: (p.links as Record<string, string>).download_location,
      alt: (p.alt_description as string) ?? query,
      credit: {
        name: ((p.user as Record<string, unknown>)?.name as string) ?? "Unsplash",
        link: (((p.user as Record<string, unknown>)?.links as Record<string, string>)?.html) ?? "https://unsplash.com",
      },
    }));

    return new Response(JSON.stringify({ photos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
