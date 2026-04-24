import { useCallback, useRef, useState } from "react";
import { Asset, assetsApi } from "@/lib/assetsApi";

export type QueueStatus = "queued" | "uploading" | "done" | "failed";

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: QueueStatus;
  error?: string;
  asset?: Asset;
}

interface Options {
  maxSizeMb?: number;
  acceptPrefix?: string;
  onUploaded?: (asset: Asset) => void;
  autoDismissMs?: number;
}

let counter = 0;
const nextId = () => `q-${Date.now()}-${++counter}`;

export const useUploadQueue = ({
  maxSizeMb = 25,
  acceptPrefix,
  onUploaded,
  autoDismissMs = 3000,
}: Options = {}) => {
  const [items, setItems] = useState<QueueItem[]>([]);
  const runningRef = useRef(false);
  const queueRef = useRef<QueueItem[]>([]);

  const update = (id: string, patch: Partial<QueueItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    queueRef.current = queueRef.current.map((it) =>
      it.id === id ? { ...it, ...patch } : it,
    );
  };

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    queueRef.current = queueRef.current.filter((it) => it.id !== id);
  }, []);

  const validate = (file: File): string | null => {
    if (file.size === 0) return "File is empty.";
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max ${maxSizeMb} MB.`;
    }
    if (acceptPrefix && !file.type.startsWith(acceptPrefix)) {
      return `File type ${file.type || "unknown"} is not allowed.`;
    }
    return null;
  };

  const runNext = useCallback(async () => {
    if (runningRef.current) return;
    const next = queueRef.current.find((it) => it.status === "queued");
    if (!next) return;
    runningRef.current = true;
    update(next.id, { status: "uploading" });
    try {
      const asset = await assetsApi.upload(next.file);
      update(next.id, { status: "done", asset });
      onUploaded?.(asset);
      if (autoDismissMs > 0) {
        setTimeout(() => remove(next.id), autoDismissMs);
      }
    } catch (e: unknown) {
      update(next.id, {
        status: "failed",
        error: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      runningRef.current = false;
      // Process next
      if (queueRef.current.some((it) => it.status === "queued")) {
        runNext();
      }
    }
  }, [autoDismissMs, onUploaded, remove]);

  const enqueue = useCallback(
    (files: File[]) => {
      const newItems: QueueItem[] = files.map((file) => {
        const err = validate(file);
        return {
          id: nextId(),
          file,
          name: file.name,
          size: file.size,
          status: err ? "failed" : "queued",
          error: err ?? undefined,
        };
      });
      setItems((prev) => [...newItems, ...prev]);
      queueRef.current = [...newItems, ...queueRef.current];
      runNext();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runNext, maxSizeMb, acceptPrefix],
  );

  const retry = useCallback(
    (id: string) => {
      const item = queueRef.current.find((it) => it.id === id);
      if (!item) return;
      const err = validate(item.file);
      if (err) {
        update(id, { status: "failed", error: err });
        return;
      }
      update(id, { status: "queued", error: undefined });
      runNext();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runNext],
  );

  return { items, enqueue, retry, remove };
};
