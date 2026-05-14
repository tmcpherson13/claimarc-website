import { CtaLink } from "./primitives";

interface CtaBandProps {
  kicker?: string;
  headline: string;
  highlight?: string;
  subhead?: string;
  primaryText?: string;
  primaryTo?: string;
}

/** Full-width closing call-to-action — premium dark gradient band. */
const CtaBand = ({
  kicker,
  headline,
  highlight,
  subhead,
  primaryText = "Contact Us",
  primaryTo = "/contact",
}: CtaBandProps) => (
  <section className="relative overflow-hidden">
    {/* Gradient backdrop */}
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(60% 80% at 15% 0%, rgba(0,200,255,0.18), transparent 60%), radial-gradient(50% 70% at 90% 100%, rgba(255,79,163,0.14), transparent 60%), radial-gradient(40% 50% at 50% 50%, rgba(110,91,255,0.12), transparent 70%)",
      }}
    />
    {/* Top + bottom signature hairlines */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--arc-1), var(--arc-2), var(--arc-3), transparent)",
        opacity: 0.6,
      }}
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--arc-3), var(--arc-2), var(--arc-1), transparent)",
        opacity: 0.4,
      }}
    />
    <div className="shell relative py-20 text-center md:py-24">
      {kicker && (
        <p className="text-sm text-[var(--text-lo)]">{kicker}</p>
      )}
      <h2 className="display mx-auto mt-3 max-w-3xl text-balance text-3xl leading-[1.15] md:text-[2.6rem]">
        {headline}{" "}
        {highlight && <span className="arc-text">{highlight}</span>}
      </h2>
      {subhead && (
        <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--text-mid)]">
          {subhead}
        </p>
      )}
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <CtaLink to={primaryTo} variant="primary">
          {primaryText}
        </CtaLink>
        <CtaLink to="/why-claimarc" variant="secondary">
          Why ClaimARC
        </CtaLink>
      </div>
    </div>
  </section>
);

export default CtaBand;
