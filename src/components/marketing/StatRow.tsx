import Reveal from "./Reveal";

export interface StatItem {
  value: string;
  label: string;
  note?: string;
  accent?: "cyan" | "lime";
}

/** Horizontal band of headline statistics — glass over the global mesh. */
const StatRow = ({ stats, className = "" }: { stats: StatItem[]; className?: string }) => (
  <section className={`relative ${className}`}>
    <div className="shell">
      <dl className="glass-strong grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 90}
            className="px-6 py-8 text-center sm:px-8"
          >
            <dt
              className="display text-4xl tracking-tight md:text-5xl"
              style={{ color: s.accent === "lime" ? "var(--lime)" : "var(--arc-1)" }}
            >
              {s.value}
            </dt>
            <dd className="mt-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-hi)]">
              {s.label}
            </dd>
            {s.note && (
              <dd className="mt-1 text-xs text-[var(--text-lo)]">{s.note}</dd>
            )}
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);

export default StatRow;
