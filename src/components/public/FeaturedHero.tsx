import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { profilesApi, Profile } from "@/lib/profilesApi";

const FeaturedHero = ({ item }: { item: ContentItem }) => {
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
            <div className="w-full h-full bg-gradient-to-br from-[var(--navy)] to-[var(--navy-dk)] flex items-center justify-center">
              <span className="text-white/40 text-6xl font-bold">ZD</span>
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
