import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { profilesApi, Profile } from "@/lib/profilesApi";

interface Props {
  item: ContentItem;
  showTypeBadge?: boolean;
}

const ContentCard = ({ item, showTypeBadge = false }: Props) => {
  const [hero, setHero] = useState<Asset | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!item.heroAssetId) return;
    assetsApi.getMany([item.heroAssetId]).then((m) => setHero(m[item.heroAssetId!] ?? null));
  }, [item.heroAssetId]);

  useEffect(() => {
    if (!item.authorId) return;
    profilesApi.get(item.authorId).then(setProfile);
  }, [item.authorId]);

  const href =
    item.contentType === "blog" ? `/blog/${item.slug}` : `/white-papers/${item.slug}`;
  const typeLabel = item.contentType === "blog" ? "Blog" : "White paper";
  const author = profile?.displayName?.trim() || "ZDefense Team";

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
        <h3 className="mt-1 text-lg font-semibold text-[var(--navy)] group-hover:text-[var(--emerald)] transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3 flex-1">{item.summary}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
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
