import { ReactNode } from "react";
import { CtaLink, Eyebrow } from "./primitives";
import Reveal from "./Reveal";

interface ServiceHeroProps {
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  statValue: string;
  statSuffix?: string;
  statLabel: string;
  statNote?: string;
  primaryText?: string;
}

/** Shared hero for the three service pages — dark, gradient-accented. */
const ServiceHero = ({
  eyebrow,
  title,
  body,
  statValue,
  statSuffix,
  statLabel,
  statNote,
  primaryText = "Book a Demo",
}: ServiceHeroProps) => (
  <section className="relative overflow-hidden">
    {/* Localised spotlight */}
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(55% 65% at 78% 5%, rgba(0,200,255,0.18), transparent 60%), radial-gradient(45% 55% at 5% 100%, rgba(110,91,255,0.14), transparent 60%)",
      }}
    />
    <div className="shell relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr]">
      <Reveal>
        <Eyebrow tone="arc" className="mb-5">
          {eyebrow}
        </Eyebrow>
        <h1 className="display text-balance text-4xl leading-[1.06] tracking-tight md:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-mid)]">
          {body}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CtaLink to="/contact" variant="primary">
            {primaryText}
          </CtaLink>
          <CtaLink to="/why-claimarc" variant="secondary">
            See the full platform
          </CtaLink>
        </div>
      </Reveal>
      <Reveal delay={120} className="lg:justify-self-end">
        <div className="glass-strong relative p-7">
          {/* Glow rail behind the stat */}
          <div
            aria-hidden="true"
            className="absolute -inset-px rounded-2xl opacity-60"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,200,255,0.18), rgba(110,91,255,0.18), rgba(255,79,163,0.10))",
              filter: "blur(14px)",
              zIndex: -1,
            }}
          />
          <p className="display text-6xl leading-none tracking-tight md:text-7xl">
            <span className="arc-text">{statValue}</span>
            {statSuffix && (
              <span className="text-[var(--lime)]">{statSuffix}</span>
            )}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-hi)]">
            {statLabel}
          </p>
          {statNote && (
            <p className="mt-1 text-xs italic text-[var(--text-lo)]">{statNote}</p>
          )}
        </div>
      </Reveal>
    </div>
  </section>
);

export default ServiceHero;
