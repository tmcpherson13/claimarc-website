import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, FileText, Maximize2, Minimize2, AlertTriangle, Loader2 } from "lucide-react";

interface PdfViewerProps {
  url: string;
  fileName: string;
  sizeBytes: number;
  title: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const PdfViewer = ({ url, fileName, sizeBytes, title }: PdfViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reachability probe — catches blocked CORS / 404 / wrong URL before we trust the iframe.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch(url, { method: "HEAD", signal: controller.signal })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          return;
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [url]);

  // Iframe load watchdog — if it never fires onLoad within 12s, treat as failure.
  useEffect(() => {
    if (status !== "ready" || iframeLoaded) return;
    const t = setTimeout(() => {
      if (!iframeLoaded) setStatus("error");
    }, 12000);
    return () => clearTimeout(t);
  }, [status, iframeLoaded]);

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

  const embedUrl = `${url}#view=FitH&toolbar=0&navpanes=0`;

  return (
    <div
      ref={containerRef}
      className="group relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-[var(--emerald)]/10 text-[var(--emerald)] flex items-center justify-center">
            <FileText className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--navy)] truncate">{fileName}</p>
            <p className="text-xs text-slate-500">PDF · {formatSize(sizeBytes)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[var(--emerald)] hover:bg-emerald-600 px-3 py-1.5 rounded-md transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Viewer body */}
      <div className="relative bg-slate-100" style={{ height: isFullscreen ? "calc(100vh - 64px)" : undefined }}>
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
              src={embedUrl}
              title={`${title} — PDF preview`}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-[80vh] min-h-[600px] bg-white"
              style={isFullscreen ? { height: "calc(100vh - 64px)" } : undefined}
            />
          </>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center text-center px-6 py-16 h-[60vh] min-h-[480px] bg-gradient-to-b from-white to-slate-50">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[var(--navy)]">
              Inline preview unavailable
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              We couldn't display this PDF directly in the browser. This can happen when
              embedded PDFs are blocked by your browser, an extension, or a network policy.
              You can still download it or open it in a new tab.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={url}
                download={fileName}
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
  );
};

export default PdfViewer;
