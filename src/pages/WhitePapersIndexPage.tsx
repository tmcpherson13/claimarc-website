import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem } from "@/lib/contentApi";

const WhitePapersIndexPage = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contentApi
      .listPublished("white_paper")
      .then(setItems)
      .catch((e) => setError(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <SeoHead
        title="ZDefense White Papers — Payer Behavior & Revenue Cycle Research"
        description="In-depth research on payer behavior, denial intelligence, and revenue cycle strategy from the ZDefense team."
        path="/white-papers"
      />

      <section className="bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">White Papers</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Long-form research from the ZDefense team — denial intelligence, payer behavior,
            and revenue cycle strategy.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {loading && <p className="text-slate-500">Loading…</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="text-slate-500">No white papers published yet.</p>
          )}
          {items.map((p) => (
            <article key={p.id} className="border-b border-slate-200 pb-8">
              <h2 className="text-2xl font-semibold text-[var(--navy)]">
                <Link to={`/white-papers/${p.slug}`} className="hover:text-[var(--emerald)]">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600">{p.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {p.publishedAt && (
                  <time dateTime={p.publishedAt}>
                    {new Date(p.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {p.tags.length > 0 &&
                  p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default WhitePapersIndexPage;
