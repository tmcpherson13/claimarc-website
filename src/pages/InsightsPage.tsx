import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem } from "@/lib/contentApi";
import FilterBar, { matchesFilters } from "@/components/public/FilterBar";
import FeaturedHero from "@/components/public/FeaturedHero";
import ContentCard from "@/components/public/ContentCard";
import HeroAccent from "@/components/HeroAccent";
import IntelligenceInstrumentPanel from "@/components/IntelligenceInstrumentPanel";

const InsightsPage = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useSearchParams();

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

      <section className="relative overflow-hidden bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <HeroAccent />
        <IntelligenceInstrumentPanel className="absolute inset-0 w-full h-full opacity-75" />
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Intelligence Center</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Payer intelligence, denial strategy, and revenue cycle briefings —
            curated for healthcare finance leaders.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <FilterBar items={items} showTypeFilter />

          <div className="mt-6">
            <div className="flex flex-wrap gap-1.5 lg:flex-nowrap">
              {[
                { label: "All", value: "" },
                { label: "Payer Behavior", value: "payer-behavior" },
                { label: "Denials", value: "denial-prevention" },
                { label: "Prior Auth", value: "prior-authorization" },
                { label: "Contracts", value: "contract-intelligence" },
                { label: "Underpayments", value: "underpayment-recovery" },
                { label: "Compliance", value: "compliance" },
                { label: "Forecasting", value: "forecasting" },
              ].map((pill) => {
                const isActive = (topic || "") === pill.value;
                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      if (pill.value) next.set("topic", pill.value);
                      else next.delete("topic");
                      setParams(next, { replace: true });
                    }}
                    className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[var(--navy)] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

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
                No intelligence matched those filters — try broadening your search
                or clearing a filter above.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InsightsPage;
