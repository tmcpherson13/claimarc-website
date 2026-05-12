import { CtaLink } from "./primitives";

interface CtaBandProps {
  kicker?: string;
  headline: string;
  highlight?: string;
  subhead?: string;
  primaryText?: string;
  primaryTo?: string;
}

/** Full-width closing call-to-action used at the bottom of marketing pages. */
const CtaBand = ({
  kicker,
  headline,
  highlight,
  subhead,
  primaryText = "Book a Demo",
  primaryTo = "/contact",
}: CtaBandProps) => (
  <section className="relative overflow-hidden bg-[var(--navy)]">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.5]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(60% 80% at 15% 0%, rgba(0,160,200,0.18), transparent 60%), radial-gradient(50% 70% at 90% 100%, rgba(104,184,64,0.14), transparent 60%)",
      }}
    />
    <div className="shell relative py-20 text-center md:py-24">
      {kicker && (
        <p className="text-sm text-white/55">{kicker}</p>
      )}
      <h2 className="mx-auto mt-3 max-w-3xl text-balance text-3xl font-bold leading-[1.2] text-white md:text-4xl">
        {headline}{" "}
        {highlight && <span className="text-[var(--cyan)]">{highlight}</span>}
      </h2>
      {subhead && (
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">{subhead}</p>
      )}
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <CtaLink to={primaryTo} variant="primary">
          {primaryText}
        </CtaLink>
        <CtaLink to="/why-claimarc" variant="onDark">
          Why ClaimARC
        </CtaLink>
      </div>
    </div>
  </section>
);

export default CtaBand;
