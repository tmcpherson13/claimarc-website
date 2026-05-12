import Reveal from "./Reveal";

export interface StatItem {
  value: string;
  label: string;
  note?: string;
  accent?: "cyan" | "lime";
}

/** Horizontal band of headline statistics, navy background. */
const StatRow = ({ stats, className = "" }: { stats: StatItem[]; className?: string }) => (
  <section className={`bg-[var(--navy)] ${className}`}>
    <div className="shell">
      <dl className="grid grid-cols-1 divide-y divide-white/10 py-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 90}
            className="px-2 py-6 text-center sm:px-8 sm:py-2"
          >
            <dt
              className={`text-4xl font-extrabold tracking-tight md:text-5xl ${
                s.accent === "lime" ? "text-[var(--lime)]" : "text-[var(--cyan)]"
              }`}
            >
              {s.value}
            </dt>
            <dd className="mt-2 text-sm font-semibold uppercase tracking-wide text-white">
              {s.label}
            </dd>
            {s.note && <dd className="mt-1 text-xs text-white/45">{s.note}</dd>}
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);

export default StatRow;
