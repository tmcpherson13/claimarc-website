import { useEffect, useState } from "react";
import { Asset, assetsApi } from "@/lib/assetsApi";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Dropzone from "@/components/admin/Dropzone";
import { FileText, Download, Trash2, RefreshCw } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (id: string | null) => void;
  /** Called with a humanized title derived from the filename when a new file is uploaded. */
  onSuggestTitle?: (title: string) => void;
  maxSizeMb?: number;
  status?: "draft" | "scheduled" | "published" | "archived";
}

const humanizeFilename = (filename: string): string => {
  const withoutExt = filename.replace(/\.pdf$/i, "");
  const spaced = withoutExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  // Title case, but keep small words lowercase except first
  const small = new Set([
    "a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or",
    "the", "to", "vs", "via", "with",
  ]);
  return spaced
    .split(" ")
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && small.has(lower)) return lower;
      // Preserve all-caps acronyms (>=2 chars all uppercase letters)
      if (/^[A-Z0-9]{2,}$/.test(w)) return w;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
};

const PdfUploadCard = ({ value, onChange, onSuggestTitle, maxSizeMb = 25, status }: Props) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!value) {
      setAsset(null);
      return;
    }
    assetsApi.getMany([value]).then((m) => setAsset(m[value] ?? null));
  }, [value]);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith("application/pdf") && !/\.pdf$/i.test(file.name)) {
      toast({
        title: "Not a PDF",
        description: "Please choose a .pdf file.",
        variant: "destructive",
      });
      return;
    }
    if (file.size === 0) {
      toast({ title: "Empty file", description: "That PDF is 0 bytes.", variant: "destructive" });
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Max ${maxSizeMb} MB. This file is ${(file.size / 1024 / 1024).toFixed(1)} MB.`,
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const uploaded = await assetsApi.upload(file);
      setAsset(uploaded);
      onChange(uploaded.id);
      const suggested = humanizeFilename(file.name);
      if (suggested && onSuggestTitle) onSuggestTitle(suggested);
      toast({ title: "PDF uploaded", description: file.name });
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

  const remove = () => {
    onChange(null);
    setAsset(null);
  };

  // Empty state — prominent dropzone
  if (!asset) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--emerald)] font-bold">
              White paper PDF
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              Upload the PDF readers will download. The title below will be filled in from the
              filename.
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <Dropzone
            onFiles={handleFiles}
            accept="application/pdf"
            maxSizeMb={maxSizeMb}
            multiple={false}
          />
          {uploading && (
            <p className="mt-3 text-sm text-[var(--emerald)] font-medium">Uploading…</p>
          )}
        </div>
      </div>
    );
  }

  // Filled state — file card with actions
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--emerald)] font-bold">
            White paper PDF
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {status === "published" ? "Published and live." : "Attached and ready to publish."}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
            status === "published"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          ● {status === "published" ? "Published" : "Attached"}
        </span>
      </div>

      <div className="p-6 flex items-center gap-4 flex-wrap">
        <div className="flex-shrink-0 w-14 h-16 rounded-md bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 flex items-center justify-center">
          <FileText className="w-7 h-7 text-rose-600" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--navy)] truncate">{asset.originalName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            PDF · {(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <a
              href={asset.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--emerald)] hover:underline"
            >
              <Download className="w-3.5 h-3.5" aria-hidden />
              Open
            </a>
            <span className="text-slate-300">·</span>
            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:underline cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" aria-hidden />
              Replace
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFiles([f]);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="text-slate-300">·</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={remove}
              className="h-auto py-0 px-0 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-transparent"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden />
              Remove
            </Button>
          </div>
          {uploading && (
            <p className="mt-2 text-xs text-[var(--emerald)] font-medium">Uploading replacement…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { humanizeFilename };
export default PdfUploadCard;
