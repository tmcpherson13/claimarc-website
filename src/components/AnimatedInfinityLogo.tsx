/**
 * AnimatedInfinityLogo
 *
 * SVG rendition of the official ClaimARC mark — a figure-eight ribbon
 * (cyan top, navy underside) with three lime accent dots that travel as a
 * single cluster around the loop, preserving the trio's relative spacing
 * the way it sits in the static logo.
 *
 * The visible ribbon and the motion path share one geometry (LOOP_PATH),
 * so the dots ride the curve exactly.
 *
 * Respects prefers-reduced-motion (CSS layer disables .loop-cluster).
 */
interface Props {
  /** Rendered width in px. */
  size?: number;
  className?: string;
}

/* Figure-eight ribbon path tuned to the official mark's proportions:
   - left lobe slightly higher (where the dot cluster sits in the static logo)
   - single self-crossing in the middle
   - subtle vertical asymmetry so the curve reads as a ribbon, not a math glyph
   The path starts at the top of the left lobe so the dot cluster's resting
   pose matches the official artwork. */
const LOOP_PATH =
  "M 80 110 C 80 50, 200 40, 250 130 C 300 220, 420 210, 420 130 C 420 50, 300 40, 250 130 C 200 220, 80 210, 80 150 C 80 130, 80 130, 80 110 Z";

const AnimatedInfinityLogo = ({ size = 220, className = "" }: Props) => {
  const height = (size * 260) / 500;
  return (
    <svg
      viewBox="0 0 500 260"
      width={size}
      height={height}
      className={className}
      aria-label="ClaimARC"
      role="img"
    >
      <defs>
        <linearGradient id="ribbonTop" x1="0" y1="0" x2="500" y2="0">
          <stop offset="0" stopColor="#00C8E6" />
          <stop offset="0.5" stopColor="#1EB3D6" />
          <stop offset="1" stopColor="#00A0C8" />
        </linearGradient>
        <linearGradient id="ribbonShadow" x1="0" y1="0" x2="0" y2="260">
          <stop offset="0" stopColor="#0E5288" />
          <stop offset="1" stopColor="#052A48" />
        </linearGradient>
        <radialGradient id="dotGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7ED957" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7ED957" stopOpacity="0" />
        </radialGradient>
        <filter id="logoSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ribbon shadow — sits slightly below to evoke the navy underside */}
      <path
        d={LOOP_PATH}
        transform="translate(4 6)"
        stroke="url(#ribbonShadow)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.92"
      />

      {/* Ribbon top — cyan */}
      <path
        d={LOOP_PATH}
        stroke="url(#ribbonTop)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Specular highlight along the inner ribbon edge */}
      <path
        d={LOOP_PATH}
        stroke="#FFFFFF"
        strokeOpacity="0.18"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Motion-path reference — invisible, same geometry as the ribbon */}
      <path id="loopPath" d={LOOP_PATH} fill="none" opacity="0" />

      {/* Single cluster: three lime dots in formation (matches the static
          logo's trio) that ride the loop as one group. */}
      <g className="loop-cluster">
        {/* Leading dot — slightly smaller (the "tail" of the trio) */}
        <circle cx="-30" cy="0" r="13" fill="url(#dotGlow)" />
        <circle cx="-30" cy="0" r="7" fill="#7ED957" filter="url(#logoSoftGlow)" />
        <circle cx="-30" cy="0" r="2.4" fill="#E6FFD6" />
        {/* Mid dot */}
        <circle cx="-8" cy="0" r="15" fill="url(#dotGlow)" />
        <circle cx="-8" cy="0" r="8" fill="#7ED957" filter="url(#logoSoftGlow)" />
        <circle cx="-8" cy="0" r="2.8" fill="#E6FFD6" />
        {/* Lead dot — largest (the head of the trio) */}
        <circle cx="18" cy="0" r="17" fill="url(#dotGlow)" />
        <circle cx="18" cy="0" r="9" fill="#7ED957" filter="url(#logoSoftGlow)" />
        <circle cx="18" cy="0" r="3" fill="#E6FFD6" />

        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
          <mpath href="#loopPath" />
        </animateMotion>
      </g>
    </svg>
  );
};

export default AnimatedInfinityLogo;
