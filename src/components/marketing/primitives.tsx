import { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";

/* ---------------------------------------------------------------- Section */

type Tone = "light" | "mist" | "navy" | "navy-dk";

const toneClass: Record<Tone, string> = {
  light: "bg-white text-[var(--navy)]",
  mist: "bg-[var(--mist)] text-[var(--navy)]",
  navy: "bg-[var(--navy)] text-white",
  "navy-dk": "bg-[var(--navy-dk)] text-white",
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
    <section id={id} className={`${toneClass[tone]} py-20 md:py-28 ${className}`}>
      <div className="shell">{children}</div>
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
  tone?: "cyan" | "lime" | "white";
  className?: string;
}) {
  const color =
    tone === "lime" ? "text-[var(--lime)]" : tone === "white" ? "text-white/70" : "text-[var(--cyan)]";
  return <p className={`eyebrow ${color} ${className}`}>{children}</p>;
}

/* ---------------------------------------------------------- Section header */

export function SectionHeading({
  eyebrow,
  eyebrowTone,
  title,
  intro,
  align = "left",
  invert = false,
  className = "",
}: {
  eyebrow?: string;
  eyebrowTone?: "cyan" | "lime" | "white";
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
      {eyebrow && (
        <Eyebrow tone={eyebrowTone ?? (invert ? "white" : "cyan")} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={`text-balance text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl ${
          invert ? "text-white" : "text-[var(--navy)]"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${invert ? "text-white/70" : "text-[var(--slate)]"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Buttons */

type BtnVariant = "primary" | "secondary" | "ghost" | "onDark";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const btnVariant: Record<BtnVariant, string> = {
  primary: "bg-[var(--cyan)] text-white hover:bg-[var(--cyan-dk)] focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-white",
  secondary:
    "border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white focus-visible:ring-[var(--navy)] focus-visible:ring-offset-white",
  ghost: "text-[var(--cyan)] hover:text-[var(--cyan-dk)] px-0 py-0",
  onDark:
    "border border-white/25 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[var(--navy)]",
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
      className={`rounded-2xl border border-[var(--line)] bg-white p-7 transition-shadow hover:shadow-[0_8px_30px_rgba(10,38,71,0.08)] ${className}`}
    >
      {children}
    </Tag>
  );
}
