import { useEffect, useMemo, useState } from "react";

const slugifyHeading = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

interface Heading {
  id: string;
  text: string;
}

const extractHeadings = (markdown: string): Heading[] => {
  const lines = markdown.split("\n");
  const out: Heading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/[*_`]/g, "").trim();
      out.push({ id: slugifyHeading(text), text });
    }
  }
  return out;
};

const ArticleTOC = ({ body }: { body: string }) => {
  const headings = useMemo(() => extractHeadings(body), [body]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;
    const ids = headings.map((h) => h.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0, rootMargin: "-20% 0% -70% 0%" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <>
      {/* Desktop sticky TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
            On this page
          </p>
          <ul className="space-y-1 text-sm border-l-2 border-slate-200">
            {headings.map((h) => {
              const isActive = h.id === activeId;
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block py-1 text-sm transition-colors -ml-0.5 pl-4 border-l-2 ${
                      isActive
                        ? "border-[var(--emerald)] text-[var(--emerald)] font-medium"
                        : "border-transparent text-slate-500 hover:text-[var(--navy)] hover:border-slate-300"
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile collapsible */}
      <details
        className="lg:hidden border border-slate-200 rounded-lg overflow-hidden mb-6"
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer list-none px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-semibold text-[var(--navy)]">
          <span>On this page ({headings.length})</span>
          <span className="text-slate-400">{open ? "−" : "+"}</span>
        </summary>
        <ul className="p-4 space-y-2 text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className="text-slate-600 hover:text-[var(--emerald)]"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
};

export const headingId = slugifyHeading;
export default ArticleTOC;
