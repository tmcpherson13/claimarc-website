import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { useProfile } from "@/hooks/useProfile";

interface Props {
  item: ContentItem;
  showTypeBadge?: boolean;
}

const ContentCard = ({ item, showTypeBadge = false }: Props) => {
  const [hero, setHero] = useState<Asset | null>(null);
  const profile = useProfile(item.authorId);

  useEffect(() => {
    if (!item.heroAssetId) return;
    assetsApi.getMany([item.heroAssetId]).then((m) => setHero(m[item.heroAssetId!] ?? null));
  }, [item.heroAssetId]);

  const href =
    item.contentType === "blog" ? `/blog/${item.slug}` : `/white-papers/${item.slug}`;
  const typeLabel = item.contentType === "blog" ? "Blog" : "White paper";
  const author = profile?.displayName?.trim() || "ZDefense Team";

  const allTags = item.tags ?? [];
  const topicTags = allTags.filter((t) => !t.startsWith("audience:")).slice(0, 2);
  const audienceTag = allTags.find((t) => t.startsWith("audience:"));
  const audienceLabel = audienceTag?.slice("audience:".length);

  const isNew =
    !!item.publishedAt &&
    Date.now() - new Date(item.publishedAt).getTime() < 14 * 24 * 60 * 60 * 1000;

  return (
    <Link
      to={href}
      className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-[var(--emerald)] hover:shadow-md transition-all"
    >
      <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
        {hero ? (
          <img
            src={hero.publicUrl}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--navy)] to-[var(--navy-dk)] flex items-center justify-center">
            <span className="text-white/40 text-4xl font-bold tracking-tight">ZD</span>
          </div>
        )}
        {isNew && (
          <span className="absolute top-3 left-3 bg-[var(--emerald)] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {item.contentType === "white_paper" && item.pdfAssetId && (
          <span className="absolute top-3 right-3 bg-[var(--amber)] text-[var(--navy)] text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
            PDF
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        {showTypeBadge && (
          <p className="text-[10px] uppercase tracking-wider text-[var(--emerald)] font-semibold">
            {typeLabel}
          </p>
        )}
        {(topicTags.length > 0 || audienceLabel) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {topicTags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium"
              >
                {t}
              </span>
            ))}
            {audienceLabel && (
              <span className="text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                {audienceLabel}
              </span>
            )}
          </div>
        )}
        <h3 className="mt-2 text-lg font-semibold text-slate-800 group-hover:text-[var(--emerald)] transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3 flex-1">{item.summary}</p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{author}</span>
          <span className="shrink-0">
            {item.publishedAt &&
              new Date(item.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            {" · "}
            {estimateReadTime(item.body)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
