/**
 * AnimatedInfinityLogo
 *
 * Faithful SVG rendition of the official ClaimARC mark. Ribbon paths are
 * lifted verbatim from claimarc-logo-source.pdf; an additional cyan "bridge"
 * closes the small open top of the left scoop (where the dots sit in the
 * static logo) so the ribbon reads as a continuous track.
 *
 * The three lime dots ride that track as a single cluster, largest at the
 * head and smaller ones trailing on the same line. `rotate="auto"` keeps
 * the formation aligned with the path tangent so they always face their
 * direction of travel.
 */
interface Props {
  /** Rendered width in px. */
  size?: number;
  className?: string;
}

const NAVY = "#234B8C";   // rgb(13.6%, 29.4%, 55%)
const CYAN = "#43A9D2";   // rgb(26.1%, 66.3%, 82.5%)
const LIME = "#5EC232";   // rgb(37%, 76.1%, 19.8%)

// Official ribbon fills from the brand source PDF.
const RIBBON_NAVY_BACK =
  "M 211.71 310.80 C 212.43 323.72 221.38 337.25 239.59 344.48 C 241.68 345.68 243.97 346.76 246.47 347.70 C 264.23 354.41 290.36 352.77 325.22 334.47 C 290.88 357.69 263.33 361.66 243.08 355.26 C 217.11 347.05 207.45 326.93 211.71 310.80 Z";
const RIBBON_NAVY_FRONT =
  "M 377.53 335.15 C 393.99 334.40 399.16 321.43 381.54 315.48 C 372.98 312.59 359.82 311.31 341.89 318.52 C 358.25 308.37 372.51 307.64 383.07 309.66 C 393.73 311.71 399.30 316.70 400.82 322.28 C 397.68 329.08 389.27 334.84 377.53 335.15 Z";
const RIBBON_CYAN_TOP =
  "M 292.62 304.05 C 292.62 303.04 292.43 302.07 292.12 301.18 C 323.10 315.55 355.40 336.17 377.53 335.15 C 389.27 334.84 397.68 329.08 400.82 322.28 C 403.52 332.17 393.51 343.90 376.61 344.36 C 352.42 345.02 318.29 325.12 288.06 311.65 C 290.77 310.19 292.62 307.33 292.62 304.05 Z";
const RIBBON_CYAN_BACK =
  "M 211.71 310.80 C 213.99 302.15 220.29 294.65 230.22 290.77 C 229.71 292.00 229.42 293.35 229.42 294.76 C 229.42 298.17 231.09 301.19 233.65 303.07 C 217.96 311.11 219.40 332.98 239.59 344.48 C 221.38 337.25 212.43 323.72 211.71 310.80 Z";

// Cyan bridge filling the open top of the left scoop so the dots can
// travel through a continuous ribbon instead of jumping a gap.
const RIBBON_BRIDGE =
  "M 230 291 C 250 286, 275 291, 293 303 C 295 306, 296 309, 295 312 C 275 304, 252 299, 233 299 C 230 297, 229 294, 230 291 Z";

// Motion track — traces the ribbon's visible centerline as a continuous
// figure-eight. Starts at the top of the left scoop, sweeps around the
// scoop, crosses to the right loop, around it, and back. The single self-
// crossing in the middle is handled by the path — animateMotion just
// follows it.
const MOTION_PATH =
  "M 260 297 C 230 292, 208 308, 215 332 C 222 354, 252 360, 285 348 C 315 338, 345 322, 378 320 C 402 320, 410 340, 388 346 C 360 350, 330 334, 300 320 C 282 311, 272 303, 260 297 Z";

// Trio in motion: largest at the head (anchor), smaller dots trailing
// behind in the path's negative-x direction. rotate="auto" aligns local
// +x with the tangent, so the largest always leads.
const DOTS = [
  { x: 0, y: 0, r: 8.7 },     // head — largest
  { x: -20, y: 0, r: 7.2 },   // mid — follows
  { x: -36, y: 0, r: 5.7 },   // tail — smallest, brings up the rear
];

const AnimatedInfinityLogo = ({ size = 220, className = "" }: Props) => {
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

      {/* Ribbon, exact official layering, with bridge closing the top of
          the left scoop. */}
      <path d={RIBBON_NAVY_BACK} fill={NAVY} fillRule="evenodd" />
      <path d={RIBBON_CYAN_BACK} fill={CYAN} fillRule="evenodd" />
      <path d={RIBBON_BRIDGE} fill={CYAN} fillRule="evenodd" />
      <path d={RIBBON_CYAN_TOP} fill={CYAN} fillRule="evenodd" />
      <path d={RIBBON_NAVY_FRONT} fill={NAVY} fillRule="evenodd" />

      <path id="motionPath" d={MOTION_PATH} fill="none" opacity="0" />

      <g className="loop-cluster">
        {DOTS.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.r * 1.9} fill="url(#dotGlow)" />
            <circle cx={d.x} cy={d.y} r={d.r} fill={LIME} />
            <circle cx={d.x} cy={d.y - d.r * 0.25} r={d.r * 0.32} fill="#E6FFD6" opacity="0.85" />
          </g>
        ))}
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
          <mpath href="#motionPath" />
        </animateMotion>
      </g>
    </svg>
  );
};

export default AnimatedInfinityLogo;
