import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi, ContentItem } from "@/lib/contentApi";

interface Props {
  ids?: string[] | null;
  /** When false, the section is hidden entirely if there are no related items. */
  showEmptyState?: boolean;
}

const RelatedContent = ({ ids, showEmptyState = true }: Props) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : [];

  useEffect(() => {
    if (safeIds.length === 0) {
      setItems([]);
      return;
    }
    setLoading(true);
    Promise.all(safeIds.slice(0, 3).map((id) => contentApi.getById(id)))
      .then((results) => {
        setItems(results.filter((r): r is ContentItem => !!r && r.status === "published"));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIds.join(",")]);

  if (loading) {
    return (
      <section className="mt-16 not-prose">
        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4">Related</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="p-4 border border-slate-200 rounded-lg animate-pulse"
              aria-hidden
            >
              <div className="h-2 w-12 bg-slate-200 rounded" />
              <div className="mt-2 h-4 w-3/4 bg-slate-200 rounded" />
              <div className="mt-3 h-3 w-full bg-slate-100 rounded" />
              <div className="mt-1 h-3 w-5/6 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    if (!showEmptyState) return null;
    return (
      <section className="mt-16 not-prose">
        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4">Keep reading</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/blog"
            className="block p-5 border border-slate-200 rounded-lg hover:border-[var(--emerald)] transition-colors"
          >
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Browse
            </p>
            <p className="mt-1 font-semibold text-[var(--navy)]">All blog posts</p>
            <p className="mt-2 text-xs text-slate-600">
              Field notes on payer behavior and denial intelligence.
            </p>
          </Link>
          <Link
            to="/white-papers"
            className="block p-5 border border-slate-200 rounded-lg hover:border-[var(--emerald)] transition-colors"
          >
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Browse
            </p>
            <p className="mt-1 font-semibold text-[var(--navy)]">All white papers</p>
            <p className="mt-2 text-xs text-slate-600">
              Long-form research on the revenue cycle.
            </p>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 not-prose">
      <h2 className="text-xl font-semibold text-[var(--navy)] mb-4">Related</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => {
          const href = i.contentType === "blog" ? `/blog/${i.slug}` : `/white-papers/${i.slug}`;
          return (
            <Link
              key={i.id}
              to={href}
              className="block p-4 border border-slate-200 rounded-lg hover:border-[var(--emerald)] transition-colors"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                {i.contentType === "blog" ? "Blog" : "White paper"}
              </p>
              <p className="mt-1 font-semibold text-[var(--navy)]">{i.title}</p>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{i.summary}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedContent;
