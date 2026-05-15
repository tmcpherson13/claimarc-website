import { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";

/* ---------------------------------------------------------------- Section */

/**
 * Two-tone dark rhythm. Every "dark" tone maps to one of two surfaces —
 * FLAT (pure ink) or ELEV (ink + soft top gradient). Section tones from
 * earlier pages are kept as semantic aliases so existing markup doesn't
 * change; they just resolve to one of the two surfaces. Visual rhythm
 * comes from the alternation, not from contrast jumps. The "paper" tone
 * is preserved as a true light break for the few sections that need
 * documentation-style readability.
 */
type Tone = "light" | "mist" | "navy" | "navy-dk" | "deep" | "elev" | "paper";

const toneClass: Record<Tone, string> = {
  // FLAT surface — pure ink, the resting tone
  light: "surface-flat text-[var(--text-hi)]",
  deep: "surface-flat text-[var(--text-hi)]",
  "navy-dk": "surface-flat text-[var(--text-hi)]",

  // ELEV surface — lifted ink with soft cyan-tinted top gradient
  mist: "surface-elev text-[var(--text-hi)]",
  navy: "surface-elev text-[var(--text-hi)]",
  elev: "surface-elev text-[var(--text-hi)]",

  // Light institutional break — used sparingly for documentation-tone moments.
  // Scope-overrides the arc tokens so brand-color text (eyebrows, footnotes,
  // borders) hits WCAG AA on the light background instead of the dark-bg shades.
  paper:
    "bg-[#EEF4F8] text-[#0F1B2D] border-y border-[#D6E2EB] [--text-hi:#0F1B2D] [--text-mid:#3C5067] [--text-lo:#6E7E94] [--arc-1:#006A87] [--arc-2:#1A5F96] [--arc-3:#3F7724]",
};

export function Section({
  children,
  tone = "light",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative ${toneClass[tone]} py-20 md:py-28 ${className}`}>
      <div className="shell relative">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------- Eyebrow */

export function Eyebrow({
  children,
  tone = "cyan",
  className = "",
}: {
  children: ReactNode;
  tone?: "cyan" | "lime" | "white" | "arc";
  className?: string;
}) {
  const color =
    tone === "lime"
      ? "text-[var(--lime)]"
      : tone === "white"
        ? "text-white/70"
        : tone === "arc"
          ? "shimmer-text"
          : "text-[var(--arc-1)]";
  return <p className={`eyebrow ${color} ${className}`}>{children}</p>;
}

/* ---------------------------------------------------------- IndexedEyebrow

  Numbered eyebrow with a thin lime tick — e.g. "01 / ACCELERATION".
  ClaimARC's section signature. */

export function IndexedEyebrow({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`indexed-eyebrow ${className}`}>
      <span className="ix-num">{index}</span>
      <span>/</span>
      <span>{children}</span>
    </p>
  );
}

/* ---------------------------------------------------------- Section header */

export function SectionHeading({
  eyebrow,
  eyebrowTone,
  numberedIndex,
  title,
  intro,
  align = "left",
  // `invert` retained for backwards compat — dark-first means no-op
  invert: _invert = false,
  className = "",
}: {
  eyebrow?: string;
  eyebrowTone?: "cyan" | "lime" | "white" | "arc";
  /** When set, renders a numbered IndexedEyebrow (e.g. "01") instead of the
      plain colored eyebrow. Replaces the gradient-bar eyebrow seen in many
      "modern fintech" templates with a more institutional voice. */
  numberedIndex?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {numberedIndex && eyebrow ? (
        <IndexedEyebrow index={numberedIndex} className={align === "center" ? "justify-center mb-4" : "mb-4"}>
          {eyebrow}
        </IndexedEyebrow>
      ) : eyebrow ? (
        <Eyebrow tone={eyebrowTone ?? "cyan"} className="mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 className="display text-balance text-3xl leading-[1.12] tracking-tight text-[var(--text-hi)] md:text-[2.6rem]">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-lg leading-relaxed text-[var(--text-mid)]">
          {intro}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Buttons */

type BtnVariant = "primary" | "secondary" | "ghost" | "onDark";

const btnBase =
  "relative inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink-0)]";

const btnVariant: Record<BtnVariant, string> = {
  // Primary CTA — signature gradient with glow
  primary:
    "text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset,0_10px_30px_-10px_rgba(0,200,255,0.55)] bg-gradient-to-r from-[var(--arc-1)] via-[var(--arc-2)] to-[var(--arc-3)] bg-[length:200%_100%] bg-left hover:bg-right hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18)_inset,0_18px_44px_-12px_rgba(110,91,255,0.7)] focus-visible:ring-[var(--arc-1)]",
  // Secondary — hairline border, light fill on hover
  secondary:
    "border border-white/15 bg-white/[0.03] text-[var(--text-hi)] hover:border-white/30 hover:bg-white/[0.06] focus-visible:ring-white",
  ghost:
    "text-[var(--arc-1)] hover:text-white px-0 py-0",
  onDark:
    "border border-white/20 text-white hover:bg-white/10 hover:border-white/35 focus-visible:ring-white",
};

export function CtaLink({
  to,
  href,
  children,
  variant = "primary",
  className = "",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
}) {
  const cls = `${btnBase} ${btnVariant[variant]} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return (
    <Link to={to ?? "/"} className={cls}>
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------- Card */

export function Card({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      className={`glass p-7 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] ${className}`}
    >
      {children}
    </Tag>
  );
}
