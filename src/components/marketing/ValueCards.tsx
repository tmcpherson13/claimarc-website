import { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

export interface ValueCard {
  stat?: string;
  icon?: LucideIcon;
  title: string;
  body: string;
  footnote?: string;
  accent?: "cyan" | "lime";
}

/** Responsive grid of value cards with an accent rail on the left edge. */
const ValueCards = ({ cards, columns = 3 }: { cards: ValueCard[]; columns?: 2 | 3 }) => (
  <div
    className={`mt-12 grid gap-6 ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
  >
    {cards.map((c, i) => {
      const accent = c.accent === "lime" ? "var(--lime)" : "var(--arc-1)";
      const Icon = c.icon;
      return (
        <Reveal
          key={c.title}
          delay={i * 80}
          className="glass relative p-7 transition-all duration-300 hover:border-white/15"
        >
          <div
            className="mb-5 h-1 w-12 rounded-full"
            style={{ background: accent, boxShadow: `0 0 16px -2px ${accent}` }}
          />
          {c.stat ? (
            <p
              className="display text-4xl tracking-tight"
              style={{ color: accent }}
            >
              {c.stat}
            </p>
          ) : Icon ? (
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accent}26, ${accent}05)`,
                border: `1px solid ${accent}55`,
                color: accent,
              }}
            >
              <Icon size={22} />
            </div>
          ) : null}
          <h3 className="mt-4 text-base font-bold uppercase tracking-wide text-[var(--text-hi)]">
            {c.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-mid)]">
            {c.body}
          </p>
          {c.footnote && (
            <p className="mt-4 text-xs font-semibold" style={{ color: accent }}>
              {c.footnote}
            </p>
          )}
        </Reveal>
      );
    })}
  </div>
);

export default ValueCards;
