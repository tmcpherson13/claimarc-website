import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi, ContentItem } from "@/lib/contentApi";
import ContentCard from "./ContentCard";

const WhitePaperStrip = () => {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    contentApi
      .listPublished("white_paper")
      .then((all) => setItems(all.slice(0, 2)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-200 pt-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--emerald)] font-semibold">
            Long-form research
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-[var(--navy)]">
            White papers
          </h2>
        </div>
        <Link
          to="/white-papers"
          className="text-sm font-semibold text-[var(--emerald)] hover:underline whitespace-nowrap"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((i) => (
          <ContentCard key={i.id} item={i} />
        ))}
      </div>
    </section>
  );
};

export default WhitePaperStrip;
