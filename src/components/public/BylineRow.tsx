import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { assetsApi, Asset } from "@/lib/assetsApi";

interface Props {
  authorId: string | null;
  publishedAt: string | null;
  updatedAt?: string | null;
  readTime?: string;
  nameClassName?: string;
  metaClassName?: string;
  titleClassName?: string;
}

const BylineRow = ({
  authorId,
  publishedAt,
  updatedAt,
  readTime,
  nameClassName,
  metaClassName,
  titleClassName,
}: Props) => {
  const profile = useProfile(authorId);
  const [avatar, setAvatar] = useState<Asset | null>(null);

  useEffect(() => {
    if (!profile?.avatarAssetId) {
      setAvatar(null);
      return;
    }
    assetsApi
      .getMany([profile.avatarAssetId])
      .then((m) => setAvatar(m[profile.avatarAssetId!] ?? null));
  }, [profile?.avatarAssetId]);

  const name = profile?.displayName?.trim() || "ZDefense Team";
  const title = profile?.roleTitle?.trim();
  const initial = name.charAt(0).toUpperCase();

  const showUpdated =
    updatedAt &&
    publishedAt &&
    new Date(updatedAt).getTime() - new Date(publishedAt).getTime() > 24 * 60 * 60 * 1000;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar.publicUrl}
            alt={name}
            className="h-9 w-9 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-[var(--navy)] text-white font-semibold flex items-center justify-center text-sm">
            {initial}
          </div>
        )}
        <div className="leading-tight">
          <p className="font-semibold text-[var(--navy)] text-sm">{name}</p>
          {title && <p className="text-xs text-slate-500">{title}</p>}
        </div>
      </div>
      <span className="hidden sm:inline text-slate-300">·</span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {publishedAt && (
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        {showUpdated && (
          <span className="text-slate-400">
            Updated{" "}
            {new Date(updatedAt!).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        {readTime && <span>· {readTime}</span>}
      </div>
    </div>
  );
};

export default BylineRow;
