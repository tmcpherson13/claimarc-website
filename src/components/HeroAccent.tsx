import { ReactNode } from "react";

interface HeroAccentProps {
  children?: ReactNode;
}

/**
 * Subtle emerald radial glow + grid pattern overlay for hero sections.
 * Parent must be `relative overflow-hidden`.
 */
const HeroAccent = ({ children }: HeroAccentProps) => (
  <div className="absolute inset-0 opacity-[0.12] pointer-events-none" aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, hsl(160 84% 39% / 0.6), transparent 50%), radial-gradient(circle at 80% 80%, hsl(160 84% 39% / 0.35), transparent 55%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(hsl(160 84% 60% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 60% / 0.15) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    {children}
  </div>
);

export default HeroAccent;
