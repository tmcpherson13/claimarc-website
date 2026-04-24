import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem } from "@/lib/contentApi";
import FilterBar, { matchesFilters } from "@/components/public/FilterBar";
import FeaturedHero from "@/components/public/FeaturedHero";
import ContentCard from "@/components/public/ContentCard";
import WhitePaperStrip from "@/components/public/WhitePaperStrip";

const BlogIndexPage = () => {
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    contentApi
      .listPublished("blog")
      .then(setPosts)
      .catch((e) => setError(e.message ?? "Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  const search = params.get("q") ?? "";
  const topic = params.get("topic") ?? "";
  const audience = params.get("audience") ?? "";
  const isFiltering = !!(search || topic || audience);

  const featured = useMemo(
    () => (isFiltering ? null : posts.find((p) => p.featured) ?? posts[0] ?? null),
    [posts, isFiltering],
  );
  const grid = useMemo(() => {
    const filtered = posts.filter((p) => matchesFilters(p, search, topic, audience));
    return isFiltering ? filtered : filtered.filter((p) => p !== featured);
  }, [posts, search, topic, audience, featured, isFiltering]);

  return (
    <Layout>
      <SeoHead
        title="ZDefense Blog — Payer Behavior & Revenue Cycle Intelligence"
        description="Insights on payer behavior, denial intelligence, and revenue cycle strategy from the ZDefense team."
        path="/blog"
      />

      {/* Hero */}
      <section className="bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ZDefense Blog</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Payer behavior, denial intelligence, and revenue cycle strategy.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <FilterBar items={posts} />

          <div className="pt-10">
            {loading && <p className="text-slate-500">Loading posts…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="text-slate-500">No posts published yet. Check back soon.</p>
            )}

            {!loading && !error && featured && (
              <div className="mb-10">
                <FeaturedHero item={featured} />
              </div>
            )}

            {!loading && !error && grid.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grid.map((p) => (
                  <ContentCard key={p.id} item={p} />
                ))}
              </div>
            )}

            {!loading && !error && isFiltering && grid.length === 0 && (
              <p className="text-slate-500 py-12 text-center">
                No posts match your filters.
              </p>
            )}
          </div>

          <WhitePaperStrip />
        </div>
      </section>
    </Layout>
  );
};

export default BlogIndexPage;
