/**
 * AnimatedInfinityLogo
 *
 * Faithful SVG rendition of the official ClaimARC mark — the exact ribbon
 * paths are taken directly from the brand source PDF, so the curves match
 * the official artwork pixel-for-pixel.
 *
 * The static logo's three lime dots are extracted into a single grouped
 * cluster that travels along an invisible motion path tracing the ribbon's
 * visible centerline. The cluster's relative spacing and size hierarchy
 * (leftmost largest → rightmost smallest) is preserved so the trio reads
 * as the same trio at rest or in motion. `rotate="auto"` lets the cluster
 * bank with the curve, like a comet's tail riding the ribbon.
 */
interface Props {
  /** Rendered width in px. */
  size?: number;
  className?: string;
}

// Official ribbon path segments, lifted verbatim from claimarc-logo-source.pdf.
// Two colors compose the ribbon: navy underside + cyan top, layered to
// produce the appearance of a ribbon that twists over and under itself.
const NAVY = "#234B8C";   // rgb(13.6%, 29.4%, 55%)
const CYAN = "#43A9D2";   // rgb(26.1%, 66.3%, 82.5%)
const LIME = "#5EC232";   // rgb(37%, 76.1%, 19.8%)

const RIBBON_NAVY_BACK =
  "M 211.71 310.80 C 212.43 323.72 221.38 337.25 239.59 344.48 C 241.68 345.68 243.97 346.76 246.47 347.70 C 264.23 354.41 290.36 352.77 325.22 334.47 C 290.88 357.69 263.33 361.66 243.08 355.26 C 217.11 347.05 207.45 326.93 211.71 310.80 Z";
const RIBBON_NAVY_FRONT =
  "M 377.53 335.15 C 393.99 334.40 399.16 321.43 381.54 315.48 C 372.98 312.59 359.82 311.31 341.89 318.52 C 358.25 308.37 372.51 307.64 383.07 309.66 C 393.73 311.71 399.30 316.70 400.82 322.28 C 397.68 329.08 389.27 334.84 377.53 335.15 Z";
const RIBBON_CYAN_TOP =
  "M 292.62 304.05 C 292.62 303.04 292.43 302.07 292.12 301.18 C 323.10 315.55 355.40 336.17 377.53 335.15 C 389.27 334.84 397.68 329.08 400.82 322.28 C 403.52 332.17 393.51 343.90 376.61 344.36 C 352.42 345.02 318.29 325.12 288.06 311.65 C 290.77 310.19 292.62 307.33 292.62 304.05 Z";
const RIBBON_CYAN_BACK =
  "M 211.71 310.80 C 213.99 302.15 220.29 294.65 230.22 290.77 C 229.71 292.00 229.42 293.35 229.42 294.76 C 229.42 298.17 231.09 301.19 233.65 303.07 C 217.96 311.11 219.40 332.98 239.59 344.48 C 221.38 337.25 212.43 323.72 211.71 310.80 Z";

// Motion path tracing the ribbon's visible centerline. The cluster starts
// at the top-left of the left scoop (where the dots rest in the static
// logo), sweeps clockwise down through the scoop, across the central
// crossover, around the right loop, and back to start.
const MOTION_PATH =
  "M 245 296 C 218 304, 211 326, 232 343 C 252 358, 285 357, 320 340 C 350 326, 370 318, 388 320 C 405 322, 405 340, 385 342 C 360 344, 330 332, 300 318 C 270 305, 255 298, 245 296 Z";

// Dot positions extracted from the source, expressed relative to the
// leftmost dot (which becomes the cluster's anchor at the start of the
// motion path).
const DOTS = [
  { x: 0, y: 0, r: 8.7 },     // leftmost — largest
  { x: 21, y: 2, r: 7.2 },    // middle
  { x: 38, y: 9, r: 5.7 },    // rightmost — smallest
];

const AnimatedInfinityLogo = ({ size = 220, className = "" }: Props) => {
  // Viewbox cropped tight to the icon region in source coordinates,
  // with a little padding to accommodate the cluster's glow halo.
  const VB_X = 195;
  const VB_Y = 278;
  const VB_W = 215;
  const VB_H = 95;
  const height = (size * VB_H) / VB_W;

  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      width={size}
      height={height}
      className={className}
      aria-label="ClaimARC"
      role="img"
    >
      <defs>
        <radialGradient id="dotGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={LIME} stopOpacity="0.55" />
          <stop offset="1" stopColor={LIME} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ribbon — layered exactly as in the source artwork.
          The navy "back" segments must paint first so the cyan top crosses
          over them at the visible crossover; the navy front segment sits
          on top of the cyan to recreate the ribbon's twist. */}
      <path d={RIBBON_NAVY_BACK} fill={NAVY} fillRule="evenodd" />
      <path d={RIBBON_CYAN_BACK} fill={CYAN} fillRule="evenodd" />
      <path d={RIBBON_CYAN_TOP} fill={CYAN} fillRule="evenodd" />
      <path d={RIBBON_NAVY_FRONT} fill={NAVY} fillRule="evenodd" />

      {/* Invisible motion path the cluster follows. */}
      <path id="motionPath" d={MOTION_PATH} fill="none" opacity="0" />

      {/* Three lime dots, grouped as a single cluster.
          The group anchors at the leftmost dot's source position; the
          cluster rides the motion path together with `rotate="auto"` so
          the trio banks with the curve. */}
      <g className="loop-cluster">
        {DOTS.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.r * 1.9} fill="url(#dotGlow)" />
            <circle cx={d.x} cy={d.y} r={d.r} fill={LIME} />
            <circle cx={d.x} cy={d.y - d.r * 0.25} r={d.r * 0.32} fill="#E6FFD6" opacity="0.85" />
          </g>
        ))}
        <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
          <mpath href="#motionPath" />
        </animateMotion>
      </g>
    </svg>
  );
};

export default AnimatedInfinityLogo;
