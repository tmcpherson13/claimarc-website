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
      const accent = c.accent === "lime" ? "var(--lime)" : "var(--cyan)";
      const Icon = c.icon;
      return (
        <Reveal
          key={c.title}
          delay={i * 80}
          className="rounded-2xl border border-[var(--line)] bg-white p-7"
        >
          <div
            className="mb-5 h-1 w-12 rounded-full"
            style={{ background: accent }}
          />
          {c.stat ? (
            <p className="text-4xl font-extrabold tracking-tight" style={{ color: accent }}>
              {c.stat}
            </p>
          ) : Icon ? (
            <Icon size={26} style={{ color: accent }} />
          ) : null}
          <h3 className="mt-3 text-base font-bold uppercase tracking-wide text-[var(--navy)]">
            {c.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">{c.body}</p>
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
