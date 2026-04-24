import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
// Vite-friendly worker import — bundled, no CDN dependency.
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
import { trackEvent } from "@/lib/analytics";

// Configure worker once at module load.
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

interface PdfViewerProps {
  url: string;
  fileName: string;
  sizeBytes: number;
  title: string;
  /** Stable key for persisting the last-viewed page (e.g., asset id or slug). */
  storageKey?: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const lsKey = (key: string) => `pdfviewer:lastPage:${key}`;

const readSavedPage = (key?: string): number | null => {
  if (!key || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(lsKey(key));
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
};

const writeSavedPage = (key: string | undefined, page: number) => {
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(lsKey(key), String(page));
  } catch {
    /* quota / private mode — ignore */
  }
};

interface ThumbState {
  page: number;
  dataUrl: string;
}

const PdfViewer = ({ url, fileName, sizeBytes, title, storageKey }: PdfViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking");
  const [errorReason, setErrorReason] = useState<string>("");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const initialPage = useMemo(() => readSavedPage(storageKey) ?? 1, [storageKey]);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [numPages, setNumPages] = useState<number>(0);
  const [thumbs, setThumbs] = useState<ThumbState[]>([]);
  const [thumbsLoading, setThumbsLoading] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [restoredNotice, setRestoredNotice] = useState<number | null>(
    initialPage > 1 ? initialPage : null,
  );

  const analyticsBase = useMemo(
    () => ({ file: fileName, key: storageKey ?? "unknown" }),
    [fileName, storageKey],
  );

  // 1) HEAD reachability probe — catches blocked CORS / 404 / wrong URL.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const startedAt = performance.now();

    fetch(url, { method: "HEAD", signal: controller.signal })
      .then((res) => {
        if (cancelled) return;
        const ms = Math.round(performance.now() - startedAt);
        if (!res.ok) {
          setStatus("error");
          setErrorReason(`HTTP ${res.status}`);
          trackEvent("PDF_Preview_Reachability_Fail", {
            ...analyticsBase,
            status: res.status,
            ms,
          });
          return;
        }
        setStatus("ready");
        trackEvent("PDF_Preview_Reachability_OK", { ...analyticsBase, ms });
      })
      .catch((err) => {
        if (cancelled) return;
        const reason = err?.name === "AbortError" ? "timeout" : "network";
        setStatus("error");
        setErrorReason(reason);
        trackEvent("PDF_Preview_Reachability_Fail", { ...analyticsBase, reason });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, analyticsBase]);

  // 2) Iframe watchdog — if onLoad never fires, treat as failure.
  useEffect(() => {
    if (status !== "ready" || iframeLoaded) return;
    const t = setTimeout(() => {
      if (!iframeLoaded) {
        setStatus("error");
        setErrorReason("embed-timeout");
        trackEvent("PDF_Preview_Embed_Timeout", analyticsBase);
      }
    }, 12000);
    return () => clearTimeout(t);
  }, [status, iframeLoaded, analyticsBase]);

  // 3) Render thumbnails with pdfjs.
  useEffect(() => {
    if (status !== "ready") return;
    let cancelled = false;
    setThumbsLoading(true);

    const render = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setNumPages(doc.numPages);
        trackEvent("PDF_Preview_Pdfjs_Loaded", {
          ...analyticsBase,
          pages: doc.numPages,
        });

        const out: ThumbState[] = [];
        const max = Math.min(doc.numPages, 50); // safety cap
        for (let i = 1; i <= max; i++) {
          if (cancelled) return;
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          out.push({ page: i, dataUrl: canvas.toDataURL("image/jpeg", 0.7) });
          if (!cancelled) setThumbs([...out]);
        }
      } catch (err) {
        trackEvent("PDF_Preview_Pdfjs_Fail", {
          ...analyticsBase,
          reason: err instanceof Error ? err.message.slice(0, 80) : "unknown",
        });
      } finally {
        if (!cancelled) setThumbsLoading(false);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [url, status, analyticsBase]);

  // 4) Persist the page on change.
  useEffect(() => {
    writeSavedPage(storageKey, currentPage);
  }, [storageKey, currentPage]);

  // 5) Build the iframe URL with the current page anchor — changes navigate the embed.
  const embedUrl = useMemo(
    () => `${url}#page=${currentPage}&view=FitH&toolbar=1&navpanes=0`,
    [url, currentPage],
  );

  const goToPage = useCallback(
    (n: number) => {
      const clamped = Math.max(1, Math.min(numPages || 9999, n));
      setCurrentPage(clamped);
      setRestoredNotice(null);
      trackEvent("PDF_Preview_Page_Change", { ...analyticsBase, page: clamped });
    },
    [numPages, analyticsBase],
  );

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-3 min-w-0">
          {status === "ready" && numPages > 0 && (
            <button
              type="button"
              onClick={() => setShowThumbs((v) => !v)}
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-[var(--navy)] hover:bg-slate-100 transition-colors"
              aria-label={showThumbs ? "Hide page thumbnails" : "Show page thumbnails"}
              title={showThumbs ? "Hide pages" : "Show pages"}
            >
              {showThumbs ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
          )}
          <div className="shrink-0 w-9 h-9 rounded-lg bg-[var(--emerald)]/10 text-[var(--emerald)] flex items-center justify-center">
            <FileText className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--navy)] truncate">{fileName}</p>
            <p className="text-xs text-slate-500">
              PDF · {formatSize(sizeBytes)}
              {numPages > 0 && ` · ${numPages} page${numPages === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {status === "ready" && numPages > 0 && (
            <div className="hidden sm:flex items-center gap-1 mr-2 border border-slate-200 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-2 text-xs text-slate-700 tabular-nums min-w-[3.5rem] text-center">
                {currentPage} / {numPages}
              </div>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= numPages}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[var(--navy)] hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[var(--navy)] hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </a>
          <a
            href={url}
            download={fileName}
            onClick={() => trackEvent("PDF_Preview_Download_Click", analyticsBase)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[var(--emerald)] hover:bg-emerald-600 px-3 py-1.5 rounded-md transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {restoredNotice && status === "ready" && (
        <div className="flex items-center justify-between gap-3 bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-900">
          <span>
            Resumed at page <strong>{restoredNotice}</strong> from your last visit.
          </span>
          <button
            type="button"
            onClick={() => {
              goToPage(1);
            }}
            className="font-semibold hover:underline"
          >
            Start from page 1
          </button>
        </div>
      )}

      {/* Viewer body */}
      <div className="relative bg-slate-100 flex" style={{ height: isFullscreen ? "calc(100vh - 64px)" : undefined }}>
        {/* Thumbnails */}
        {status === "ready" && showThumbs && numPages > 0 && (
          <aside
            className="hidden md:block w-40 shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto"
            style={{ height: isFullscreen ? "calc(100vh - 64px)" : "80vh", minHeight: 600 }}
          >
            <div className="p-3 space-y-2">
              {thumbs.length === 0 && thumbsLoading && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin mb-2" />
                  <p className="text-xs">Generating pages…</p>
                </div>
              )}
              {thumbs.map((t) => {
                const active = t.page === currentPage;
                return (
                  <button
                    key={t.page}
                    type="button"
                    onClick={() => goToPage(t.page)}
                    className={`w-full group/thumb block rounded-md overflow-hidden border-2 transition-all ${
                      active
                        ? "border-[var(--emerald)] shadow-md"
                        : "border-transparent hover:border-slate-300"
                    }`}
                    aria-label={`Go to page ${t.page}`}
                  >
                    <img
                      src={t.dataUrl}
                      alt={`Page ${t.page}`}
                      className="w-full block bg-white"
                      loading="lazy"
                    />
                    <div
                      className={`text-[10px] font-medium py-1 ${
                        active
                          ? "bg-[var(--emerald)] text-white"
                          : "bg-white text-slate-600 group-hover/thumb:bg-slate-100"
                      }`}
                    >
                      Page {t.page}
                    </div>
                  </button>
                );
              })}
              {thumbsLoading && thumbs.length > 0 && (
                <div className="flex items-center justify-center py-3 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main viewer */}
        <div className="relative flex-1 min-w-0">
          {status === "checking" && (
            <div className="flex flex-col items-center justify-center h-[80vh] min-h-[600px] text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mb-3 text-[var(--emerald)]" />
              <p className="text-sm">Preparing preview…</p>
            </div>
          )}

          {status === "ready" && (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
                  <Loader2 className="w-6 h-6 animate-spin mb-3 text-[var(--emerald)]" />
                  <p className="text-sm">Loading PDF…</p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                key={url /* recreate iframe per document; page changes via src below */}
                src={embedUrl}
                title={`${title} — PDF preview`}
                onLoad={() => {
                  if (!iframeLoaded) {
                    setIframeLoaded(true);
                    trackEvent("PDF_Preview_Embed_Loaded", analyticsBase);
                  }
                }}
                className="w-full h-[80vh] min-h-[600px] bg-white"
                style={isFullscreen ? { height: "calc(100vh - 64px)" } : undefined}
              />
            </>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 h-[60vh] min-h-[480px] bg-gradient-to-b from-white to-slate-50 w-full">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--navy)]">
                Inline preview unavailable
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                We couldn't display this PDF directly in the browser
                {errorReason && <span className="text-slate-400"> ({errorReason})</span>}.
                This can happen when embedded PDFs are blocked by your browser, an extension,
                or a network policy. You can still download it or open it in a new tab.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={url}
                  download={fileName}
                  onClick={() =>
                    trackEvent("PDF_Preview_Download_Click", {
                      ...analyticsBase,
                      from: "error",
                    })
                  }
                  className="inline-flex items-center gap-2 bg-[var(--emerald)] text-white px-4 py-2.5 rounded-md font-semibold hover:bg-emerald-600 transition-colors shadow-sm text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF ({formatSize(sizeBytes)})
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 text-[var(--navy)] px-4 py-2.5 rounded-md font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
