interface LogoProps {
  /** "light" = white wordmark for dark backgrounds; "color" = full-color for light backgrounds. */
  variant?: "light" | "color";
  /** "horiz" = full lockup with tagline; "icon" = the arc mark only. */
  kind?: "horiz" | "icon";
  /** Rendered height in px. Width scales automatically. */
  height?: number;
  className?: string;
}

const SRC: Record<string, string> = {
  "light-horiz": "/brand/claimarc-horiz-white.png",
  "color-horiz": "/brand/claimarc-horiz-color.png",
  "light-icon": "/brand/claimarc-icon-white.png",
  "color-icon": "/brand/claimarc-icon-color.png",
};

/** Official ClaimARC logo lockup. */
const Logo = ({ variant = "color", kind = "horiz", height = 36, className = "" }: LogoProps) => (
  <img
    src={SRC[`${variant}-${kind}`]}
    alt="ClaimARC"
    height={height}
    style={{ height }}
    className={`w-auto ${className}`}
    loading="eager"
    decoding="async"
  />
);

export default Logo;
