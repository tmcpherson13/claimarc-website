import { useEffect, useState } from "react";
import { assetsApi, type Asset } from "@/lib/assetsApi";

interface Props {
  assetId: string | null;
  onRemove: () => void;
}

const HeroImagePreview = ({ assetId, onRemove }: Props) => {
  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!assetId) {
      setAsset(null);
      return;
    }
    assetsApi
      .getMany([assetId])
      .then((m) => {
        if (!cancelled) setAsset(m[assetId] ?? null);
      })
      .catch(() => {
        if (!cancelled) setAsset(null);
      });
    return () => {
      cancelled = true;
    };
  }, [assetId]);

  if (!assetId) return null;

  return (
    <div>
      {asset ? (
        <img
          src={asset.publicUrl}
          alt={asset.originalName}
          className="w-full aspect-[16/9] object-cover rounded-md mt-3 border border-slate-200"
        />
      ) : (
        <div className="w-full aspect-[16/9] rounded-md mt-3 border border-slate-200 bg-slate-100 animate-pulse" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 text-xs hover:text-red-700 mt-2"
      >
        Remove image
      </button>
    </div>
  );
};

export default HeroImagePreview;
