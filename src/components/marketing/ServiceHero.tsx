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

/** Shared hero for the three service pages — headline left, hero stat right. */
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
  <section className="relative overflow-hidden bg-[var(--navy)]">
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(55% 70% at 80% 0%, rgba(26,167,208,0.18), transparent 60%), radial-gradient(45% 60% at 0% 100%, rgba(132,189,0,0.12), transparent 60%)",
      }}
    />
    <div className="shell relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr]">
      <Reveal>
        <Eyebrow tone="cyan" className="mb-5">{eyebrow}</Eyebrow>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{body}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CtaLink to="/contact" variant="primary">{primaryText}</CtaLink>
          <CtaLink to="/why-claimarc" variant="onDark">See the full platform</CtaLink>
        </div>
      </Reveal>
      <Reveal delay={120} className="lg:justify-self-end">
        <div className="flex items-start gap-5 border-l-2 border-[var(--cyan)] pl-6">
          <div>
            <p className="text-6xl font-extrabold leading-none tracking-tight text-[var(--cyan)] md:text-7xl">
              {statValue}
              {statSuffix && <span className="text-[var(--lime)]">{statSuffix}</span>}
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {statLabel}
            </p>
            {statNote && <p className="mt-1 text-xs italic text-white/45">{statNote}</p>}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default ServiceHero;
