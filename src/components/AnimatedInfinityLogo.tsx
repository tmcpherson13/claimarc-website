/**
 * AnimatedInfinityLogo
 *
 * SVG rendition of the ClaimARC mark — a layered cyan/navy ribbon shaped like
 * an infinity loop, with three lime accent dots that travel along the path.
 *
 * Uses SVG <animateMotion> referencing the ribbon's centerline so the dots
 * follow the curve exactly. Respects prefers-reduced-motion (handled at the
 * CSS layer by .loop-dot animation reset).
 */
interface Props {
  /** Rendered size in px (square). */
  size?: number;
  className?: string;
}

/* The ribbon's geometric centerline — a clean lemniscate-ish path tuned to
   visually match the official mark. Used both for the visible ribbon and as
   the motion path for the traveling dots. */
const LOOP_PATH =
  "M 60 130 C 60 60, 160 60, 250 130 C 340 200, 440 200, 440 130 C 440 60, 340 60, 250 130 C 160 200, 60 200, 60 130 Z";

const AnimatedInfinityLogo = ({ size = 220, className = "" }: Props) => (
  <svg
    viewBox="0 0 500 260"
    width={size}
    height={(size * 260) / 500}
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

    {/* Ribbon shadow (offset slightly, evokes the navy underside of the logo) */}
    <path
      d={LOOP_PATH}
      transform="translate(4 6)"
      stroke="url(#ribbonShadow)"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.9"
    />

    {/* Ribbon top (cyan) */}
    <path
      d={LOOP_PATH}
      stroke="url(#ribbonTop)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Specular highlight inside the ribbon */}
    <path
      d={LOOP_PATH}
      stroke="#FFFFFF"
      strokeOpacity="0.18"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Hidden motion-path reference (must match the visible ribbon) */}
    <path id="loopPath" d={LOOP_PATH} fill="none" opacity="0" />

    {/* Three lime dots, evenly phased around the loop. */}
    {[0, 1, 2].map((i) => {
      const begin = `-${(i * 4.4).toFixed(2)}s`;
      return (
        <g key={i} className="loop-dot">
          {/* Soft halo */}
          <circle r="14" fill="url(#dotGlow)">
            <animateMotion
              dur="13.2s"
              repeatCount="indefinite"
              rotate="auto"
              begin={begin}
            >
              <mpath href="#loopPath" />
            </animateMotion>
          </circle>
          {/* Solid dot */}
          <circle r="9" fill="#7ED957" filter="url(#logoSoftGlow)">
            <animateMotion
              dur="13.2s"
              repeatCount="indefinite"
              rotate="auto"
              begin={begin}
            >
              <mpath href="#loopPath" />
            </animateMotion>
          </circle>
          {/* Inner specular */}
          <circle r="3" fill="#E6FFD6">
            <animateMotion
              dur="13.2s"
              repeatCount="indefinite"
              rotate="auto"
              begin={begin}
            >
              <mpath href="#loopPath" />
            </animateMotion>
          </circle>
        </g>
      );
    })}
  </svg>
);

export default AnimatedInfinityLogo;
