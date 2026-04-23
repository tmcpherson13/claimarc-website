import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { blogApi, BlogPost } from "@/lib/blogApi";

const BlogIndexPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blogApi
      .listPublished()
      .then(setPosts)
      .catch((e) => setError(e.message ?? "Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <SeoHead
        title="ZDefense Blog — Payer Behavior & Revenue Cycle Intelligence"
        description="Insights on payer behavior, denial intelligence, and revenue cycle strategy from the ZDefense team."
        path="/blog"
      />

      {/* Hero */}
      <section className="bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ZDefense Blog</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Payer behavior, denial intelligence, and revenue cycle strategy.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {loading && <p className="text-slate-500">Loading posts…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="text-slate-500">No posts published yet. Check back soon.</p>
            )}
            {posts.map((p) => (
              <article key={p.id} className="border-b border-slate-200 pb-8">
                <h2 className="text-2xl font-semibold text-[var(--navy)]">
                  <Link to={`/blog/${p.slug}`} className="hover:text-[var(--emerald)]">
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
                  {p.tags.length > 0 && (
                    <span className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--navy)] text-white rounded-lg p-6">
              <p className="text-sm uppercase tracking-wider text-[var(--emerald)] font-semibold">
                Try ZDefense
              </p>
              <p className="mt-3 text-base">
                Want to see this intelligence in your payer mix?
              </p>
              <Link
                to="/contact?offer=trial"
                className="mt-4 inline-block bg-[var(--emerald)] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                Start your 30-day evaluation — no BAA required
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default BlogIndexPage;
