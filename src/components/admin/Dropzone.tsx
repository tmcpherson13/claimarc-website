import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onFiles: (files: File[]) => void;
  /** Mime prefix filter, e.g. "image/" or "application/pdf" */
  accept?: string;
  maxSizeMb?: number;
  multiple?: boolean;
  compact?: boolean;
  /** Listen for clipboard paste events while mounted */
  enablePaste?: boolean;
}

const Dropzone = ({
  onFiles,
  accept,
  maxSizeMb = 25,
  multiple = true,
  compact = false,
  enablePaste = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const [isOver, setIsOver] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return;
      const arr = Array.from(list);
      if (arr.length === 0) return;
      onFiles(multiple ? arr : [arr[0]]);
    },
    [onFiles, multiple],
  );

  useEffect(() => {
    if (!enablePaste) return;
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.files;
      if (items && items.length > 0) handleFiles(items);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [enablePaste, handleFiles]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsOver(false);
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    };
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (e.dataTransfer?.types?.includes("Files")) setIsOver(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsOver(false);
      }
    };

    el.addEventListener("dragover", onDragOver, true);
    el.addEventListener("drop", onDrop, true);
    el.addEventListener("dragenter", onDragEnter, true);
    el.addEventListener("dragleave", onDragLeave, true);
    return () => {
      el.removeEventListener("dragover", onDragOver, true);
      el.removeEventListener("drop", onDrop, true);
      el.removeEventListener("dragenter", onDragEnter, true);
      el.removeEventListener("dragleave", onDragLeave, true);
    };
  }, [handleFiles]);

  const acceptAttr = accept ? `${accept}*` : undefined;
  const acceptLabel =
    accept === "image/"
      ? "Images"
      : accept === "application/pdf"
        ? "PDFs"
        : "Images, PDFs, docs";

  return (
    <div
      ref={rootRef}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        "w-full cursor-pointer rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center px-4",
        compact ? "py-6 gap-1" : "py-10 gap-2",
        isOver
          ? "border-[var(--emerald)] bg-emerald-50"
          : "border-slate-300 bg-white hover:border-[var(--emerald)] hover:bg-slate-50",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptAttr}
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <UploadCloud
        className={cn(
          "text-[var(--emerald)]",
          compact ? "w-6 h-6" : "w-10 h-10",
        )}
      />
      <p
        className={cn(
          "font-medium text-[var(--navy)]",
          compact ? "text-sm" : "text-base",
        )}
      >
        {isOver ? "Drop to upload" : "Drag files here, or click to browse"}
      </p>
      <p className="text-xs text-slate-500">
        {acceptLabel} · up to {maxSizeMb} MB each
        {enablePaste && !compact ? " · or paste from clipboard" : ""}
      </p>
    </div>
  );
};

export default Dropzone;
