import { useEffect, useRef, useState } from "react";
import { Asset, assetsApi } from "@/lib/assetsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string | null;
  onChange: (id: string | null) => void;
  /** Filter by mime type prefix, e.g. "image/" or "application/pdf" */
  accept?: string;
  label?: string;
}

const AssetPicker = ({ value, onChange, accept, label = "Select asset" }: Props) => {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await assetsApi.list();
      setAssets(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    assetsApi.getMany([value]).then((m) => setSelected(m[value] ?? null));
  }, [value]);

  const filtered = assets.filter((a) => {
    if (accept && !a.mimeType.startsWith(accept)) return false;
    if (search && !a.originalName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpload = async (file: File) => {
    if (accept && !file.type.startsWith(accept)) {
      toast({
        title: "Wrong file type",
        description: `Expected ${accept}*`,
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const asset = await assetsApi.upload(file);
      onChange(asset.id);
      setSelected(asset);
      await refresh();
      toast({ title: "Uploaded" });
      setOpen(false);
    } catch (e: unknown) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {selected ? (
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-slate-200 rounded text-xs">
            {selected.mimeType.startsWith("image/") && (
              <img
                src={selected.publicUrl}
                alt=""
                className="w-8 h-8 object-cover rounded"
              />
            )}
            <span className="truncate">{selected.originalName}</span>
          </div>
        ) : (
          <span className="flex-1 text-xs text-slate-400 italic">No asset selected</span>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          {label}
        </Button>
        {value && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              onChange(null);
              setSelected(null);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select an asset</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              ref={fileRef}
              type="file"
              accept={accept ? `${accept}*` : undefined}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
            <Button
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="bg-[var(--emerald)] hover:bg-emerald-600"
            >
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 py-8 text-center">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No assets.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onChange(a.id);
                    setSelected(a);
                    setOpen(false);
                  }}
                  className={`text-left border rounded p-2 hover:border-[var(--emerald)] transition-colors ${
                    value === a.id ? "border-[var(--emerald)]" : "border-slate-200"
                  }`}
                >
                  {a.mimeType.startsWith("image/") ? (
                    <img
                      src={a.publicUrl}
                      alt=""
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500">
                      {a.mimeType}
                    </div>
                  )}
                  <p className="mt-2 text-xs truncate font-medium">{a.originalName}</p>
                  <p className="text-[10px] text-slate-400">
                    {(a.sizeBytes / 1024).toFixed(1)} KB
                  </p>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetPicker;
