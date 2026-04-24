import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import { Asset, assetsApi } from "@/lib/assetsApi";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";
import Dropzone from "@/components/admin/Dropzone";
import UploadQueue from "@/components/admin/UploadQueue";
import { useUploadQueue } from "@/hooks/useUploadQueue";

const Inner = () => {
  const { isAdmin } = useAdminAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const refresh = () => {
    setLoading(true);
    assetsApi.list().then(setAssets).finally(() => setLoading(false));
  };
  useEffect(refresh, []);

  const { items, enqueue, retry, remove } = useUploadQueue({
    maxSizeMb: 25,
    onUploaded: () => refresh(),
  });

  const onDelete = async (asset: Asset) => {
    if (!confirm(`Delete ${asset.originalName}?`)) return;
    try {
      await assetsApi.remove(asset);
      toast({ title: "Deleted" });
      refresh();
    } catch (e: unknown) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied" });
  };

  const filtered = assets.filter((a) =>
    search ? a.originalName.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[var(--navy)] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/admin" className="text-lg font-semibold hover:text-[var(--emerald)]">
            ZDefense Admin
          </Link>
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-[var(--navy)]">Assets</h2>

        <div className="mt-6">
          <Dropzone onFiles={enqueue} maxSizeMb={25} multiple enablePaste />
          <UploadQueue items={items} onRetry={retry} onDismiss={remove} />
        </div>

        <Input
          className="mt-6 max-w-sm"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="mt-8 text-sm text-slate-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">No assets yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-slate-200 rounded-lg p-3 text-sm flex flex-col"
              >
                {a.mimeType.startsWith("image/") ? (
                  <img
                    src={a.publicUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500">
                    {a.mimeType}
                  </div>
                )}
                <p className="mt-2 font-medium truncate text-[var(--navy)]">
                  {a.originalName}
                </p>
                <p className="text-[10px] text-slate-400">
                  {(a.sizeBytes / 1024).toFixed(1)} KB ·{" "}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <button
                    onClick={() => copyUrl(a.publicUrl)}
                    className="text-[var(--emerald)] hover:underline"
                  >
                    Copy URL
                  </button>
                  <a
                    href={a.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 hover:underline"
                  >
                    Open
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(a)}
                      className="text-red-600 hover:underline ml-auto"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const AdminAssets = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminAssets;
