import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem } from "@/lib/contentApi";
import FilterBar, { matchesFilters } from "@/components/public/FilterBar";
import FeaturedHero from "@/components/public/FeaturedHero";
import ContentCard from "@/components/public/ContentCard";

const InsightsPage = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    Promise.all([
      contentApi.listPublished("blog"),
      contentApi.listPublished("white_paper"),
    ])
      .then(([blogs, papers]) => {
        const combined = [...blogs, ...papers].sort((a, b) => {
          const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bd - ad;
        });
        setItems(combined);
      })
      .catch((e) => setError(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const search = params.get("q") ?? "";
  const topic = params.get("topic") ?? "";
  const audience = params.get("audience") ?? "";
  const type = params.get("type") ?? "";
  const isFiltering = !!(search || topic || audience || type);

  const featured = useMemo(
    () => (isFiltering ? null : items.find((p) => p.featured) ?? items[0] ?? null),
    [items, isFiltering],
  );
  const grid = useMemo(() => {
    const filtered = items.filter((p) =>
      matchesFilters(p, search, topic, audience, type),
    );
    return isFiltering ? filtered : filtered.filter((p) => p !== featured);
  }, [items, search, topic, audience, type, featured, isFiltering]);

  return (
    <Layout>
      <SeoHead
        title="ZDefense Insights — Payer Behavior & Revenue Cycle Intelligence"
        description="Blog posts and white papers on payer behavior, denial intelligence, and revenue cycle strategy from the ZDefense team."
        path="/blog"
      />

      <section className="bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Insights</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Payer behavior, denial intelligence, and revenue cycle strategy — blog posts
            and long-form white papers from the ZDefense team.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <FilterBar items={items} showTypeFilter />

          <div className="pt-10">
            {loading && <p className="text-slate-500">Loading…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && items.length === 0 && (
              <p className="text-slate-500">No content published yet. Check back soon.</p>
            )}

            {!loading && !error && featured && (
              <div className="mb-10">
                <FeaturedHero item={featured} />
              </div>
            )}

            {!loading && !error && grid.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grid.map((p) => (
                  <ContentCard key={p.id} item={p} showTypeBadge />
                ))}
              </div>
            )}

            {!loading && !error && isFiltering && grid.length === 0 && (
              <p className="text-slate-500 py-12 text-center">
                No content matches your filters.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InsightsPage;
