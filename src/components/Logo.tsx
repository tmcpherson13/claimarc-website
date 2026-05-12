interface LogoProps {
  /** "light" = for dark backgrounds (white text); "dark" = for light backgrounds. */
  variant?: "light" | "dark";
  className?: string;
  showArc?: boolean;
}

/** ClaimARC wordmark with the signature acceleration arc. */
const Logo = ({ variant = "light", className = "", showArc = true }: LogoProps) => {
  const base = variant === "light" ? "#FFFFFF" : "var(--navy)";
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      {showArc && (
        <svg
          width="26"
          height="16"
          viewBox="0 0 26 16"
          fill="none"
          aria-hidden="true"
          className="translate-y-[2px]"
        >
          <path
            d="M1 13C5 5 12 2 18 4.5"
            stroke="var(--cyan)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M14.5 1.5L20 4.8L15.2 8.6" stroke="var(--lime)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className="font-extrabold tracking-tight text-[1.35rem]" style={{ color: base }}>
        Claim<span style={{ color: "var(--cyan)" }}>ARC</span>
      </span>
    </span>
  );
};

export default Logo;
