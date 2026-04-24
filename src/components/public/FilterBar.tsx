import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentItem } from "@/lib/contentApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AUDIENCE_PREFIX = "audience:";

const splitTags = (items: ContentItem[]) => {
  const topics = new Set<string>();
  const audiences = new Set<string>();
  for (const i of items) {
    for (const t of i.tags) {
      if (t.toLowerCase().startsWith(AUDIENCE_PREFIX)) {
        audiences.add(t.slice(AUDIENCE_PREFIX.length));
      } else {
        topics.add(t);
      }
    }
  }
  return {
    topics: [...topics].sort(),
    audiences: [...audiences].sort(),
  };
};

export const matchesFilters = (
  item: ContentItem,
  search: string,
  topic: string,
  audience: string,
) => {
  if (topic && !item.tags.includes(topic)) return false;
  if (audience && !item.tags.includes(`${AUDIENCE_PREFIX}${audience}`)) return false;
  if (search) {
    const q = search.toLowerCase();
    const hay = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
};

interface Props {
  items: ContentItem[];
}

const Controls = ({
  search,
  topic,
  audience,
  topics,
  audiences,
  onChange,
  onClear,
}: {
  search: string;
  topic: string;
  audience: string;
  topics: string[];
  audiences: string[];
  onChange: (k: "search" | "topic" | "audience", v: string) => void;
  onClear: () => void;
}) => (
  <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
    <input
      type="search"
      value={search}
      onChange={(e) => onChange("search", e.target.value)}
      placeholder="Search articles…"
      className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--emerald)]"
    />
    <select
      value={topic}
      onChange={(e) => onChange("topic", e.target.value)}
      className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
      aria-label="Filter by topic"
    >
      <option value="">All topics</option>
      {topics.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
    <select
      value={audience}
      onChange={(e) => onChange("audience", e.target.value)}
      className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
      aria-label="Filter by audience"
    >
      <option value="">All audiences</option>
      {audiences.map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </select>
    {(search || topic || audience) && (
      <button
        onClick={onClear}
        className="text-sm text-[var(--emerald)] font-medium hover:underline whitespace-nowrap"
      >
        Clear
      </button>
    )}
  </div>
);

const FilterBar = ({ items }: Props) => {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const topic = params.get("topic") ?? "";
  const audience = params.get("audience") ?? "";

  const { topics, audiences } = useMemo(() => splitTags(items), [items]);

  const update = (k: "search" | "topic" | "audience", v: string) => {
    const next = new URLSearchParams(params);
    const key = k === "search" ? "q" : k;
    if (v) next.set(key, v);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clear = () => {
    const next = new URLSearchParams(params);
    next.delete("q");
    next.delete("topic");
    next.delete("audience");
    setParams(next, { replace: true });
  };

  const activeCount = [search, topic, audience].filter(Boolean).length;

  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-slate-200 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Desktop */}
        <div className="hidden md:block">
          <Controls
            search={search}
            topic={topic}
            audience={audience}
            topics={topics}
            audiences={audiences}
            onChange={update}
            onClear={clear}
          />
        </div>
        {/* Mobile */}
        <div className="md:hidden flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search articles…"
            className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="default" className="shrink-0">
                Filters
                {activeCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--emerald)] text-white text-xs">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Filter content</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <Controls
                  search={search}
                  topic={topic}
                  audience={audience}
                  topics={topics}
                  audiences={audiences}
                  onChange={update}
                  onClear={clear}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
