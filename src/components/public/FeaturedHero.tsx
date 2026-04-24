import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { useProfile } from "@/hooks/useProfile";

const FeaturedHero = ({ item }: { item: ContentItem }) => {
  const [hero, setHero] = useState<Asset | null>(null);
  const profile = useProfile(item.authorId);

  useEffect(() => {
    if (!item.heroAssetId) return;
    assetsApi.getMany([item.heroAssetId]).then((m) => setHero(m[item.heroAssetId!] ?? null));
  }, [item.heroAssetId]);

  const href =
    item.contentType === "blog" ? `/blog/${item.slug}` : `/white-papers/${item.slug}`;
  const author = profile?.displayName?.trim() || "ZDefense Team";

  return (
    <Link
      to={href}
      className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[var(--emerald)] hover:shadow-lg transition-all"
    >
      <div className="grid md:grid-cols-2 gap-0">
        <div className="aspect-[16/10] md:aspect-auto bg-slate-100 relative overflow-hidden">
          {hero ? (
            <img
              src={hero.publicUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[var(--navy)] relative overflow-hidden flex items-center justify-center">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,116,139,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.08) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Floating metric chips - static, not animated */}
              <div className="absolute top-6 right-8 border border-emerald-800/40 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full bg-[var(--navy)]/80">
                $12.6M forecast
              </div>
              <div className="absolute bottom-8 left-6 border border-emerald-800/40 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full bg-[var(--navy)]/80">
                89.4% clean claim rate
              </div>

              {/* Central wordmark */}
              <div className="relative text-center">
                <div className="text-white/20 text-2xl font-bold tracking-tight">
                  ZDefense AI³
                </div>
                <div className="w-10 h-0.5 bg-[var(--emerald)] mx-auto mt-3 opacity-60" />
              </div>
            </div>
          )}
        </div>
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-[var(--emerald)] font-semibold">
            Featured · {item.contentType === "blog" ? "Blog" : "White paper"}
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[var(--navy)] group-hover:text-[var(--emerald)] transition-colors leading-tight">
            {item.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 line-clamp-3">{item.summary}</p>
          <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-[var(--navy)]">{author}</span>
            <span className="text-slate-300">·</span>
            {item.publishedAt && (
              <time dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
            <span className="text-slate-300">·</span>
            <span>{estimateReadTime(item.body)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedHero;
