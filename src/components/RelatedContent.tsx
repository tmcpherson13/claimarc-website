import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi, ContentItem } from "@/lib/contentApi";

const RelatedContent = ({ ids }: { ids: string[] }) => {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    Promise.all(ids.slice(0, 3).map((id) => contentApi.getById(id))).then((results) => {
      setItems(results.filter((r): r is ContentItem => !!r && r.status === "published"));
    });
  }, [ids]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
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
