import { CheckCircle2, Loader2, X, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QueueItem } from "@/hooks/useUploadQueue";

interface Props {
  items: QueueItem[];
  onRetry: (id: string) => void;
  onDismiss: (id: string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const StatusIcon = ({ status }: { status: QueueItem["status"] }) => {
  switch (status) {
    case "queued":
      return <Clock className="w-4 h-4 text-slate-400" />;
    case "uploading":
      return <Loader2 className="w-4 h-4 text-[var(--emerald)] animate-spin" />;
    case "done":
      return <CheckCircle2 className="w-4 h-4 text-[var(--emerald)]" />;
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
  }
};

const UploadQueue = ({ items, onRetry, onDismiss }: Props) => {
  if (items.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm flex items-center gap-3"
        >
          <StatusIcon status={item.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-[var(--navy)] truncate">{item.name}</p>
              <span className="text-xs text-slate-400 shrink-0">
                {formatSize(item.size)}
              </span>
            </div>
            {item.status === "uploading" && (
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 bg-[var(--emerald)] animate-pulse rounded-full" />
              </div>
            )}
            {item.status === "queued" && (
              <p className="text-xs text-slate-400 mt-0.5">Waiting…</p>
            )}
            {item.status === "done" && (
              <p className="text-xs text-[var(--emerald)] mt-0.5">Uploaded</p>
            )}
            {item.status === "failed" && (
              <p className="text-xs text-red-600 mt-0.5 truncate">
                {item.error || "Upload failed"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.status === "failed" && (
              <button
                type="button"
                onClick={() => onRetry(item.id)}
                className="text-xs text-[var(--emerald)] hover:underline"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UploadQueue;
