/**
 * HeroNetwork — decorative radar background for the hero section.
 * A large emerald radar with a slow sweep, partially clipped at the right edge.
 * Sits behind hero text. pointer-events: none, z-index: 0.
 */

interface HeroNetworkProps {
  className?: string;
}

// SVG coordinate system. Radar center at 75% horizontal, 50% vertical.
const VB_W = 1200;
const VB_H = 600;
const CX = VB_W * 0.75; // 900
const CY = VB_H * 0.5;  // 300
const RINGS = [120, 210, 310, 420];
const R_MAX = 420;

// Build the 70deg sweep glow pie-slice path, centered along the sweep arm
// (arm points "up" before rotation, i.e. negative Y). Arc spans -35deg to +35deg
// from the arm. We draw the path "behind" the arm visually using a soft gradient.
const SWEEP_DEG = 70;
const half = (SWEEP_DEG / 2) * (Math.PI / 180);
// Arm direction is straight up: (0, -R). Trail spans from -half..+half around up.
const x1 = CX + R_MAX * Math.sin(-half);
const y1 = CY - R_MAX * Math.cos(-half);
const x2 = CX + R_MAX * Math.sin(half);
const y2 = CY - R_MAX * Math.cos(half);
const SWEEP_PATH = `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R_MAX} ${R_MAX} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

// Blip positions on rings (angle in degrees, ring index)
const BLIPS: { angle: number; ring: number; pulse?: string }[] = [
  { angle: 25, ring: 0, pulse: "0s" },
  { angle: 110, ring: 1 },
  { angle: 165, ring: 2, pulse: "1s" },
  { angle: 215, ring: 1 },
  { angle: 285, ring: 2 },
  { angle: 320, ring: 0, pulse: "2s" },
  { angle: 75, ring: 3 },
];

const HeroNetwork = ({ className = "" }: HeroNetworkProps) => {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="hero-radar-trail" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Concentric rings */}
      <g>
        {RINGS.map((r, i) => (
          <circle
            key={`ring-${i}`}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="#10B981"
            strokeWidth={0.75}
            opacity={0.12}
          />
        ))}
      </g>

      {/* Crosshairs */}
      <g>
        <line
          x1={CX - R_MAX}
          y1={CY}
          x2={CX + R_MAX}
          y2={CY}
          stroke="#10B981"
          strokeWidth={0.5}
          opacity={0.08}
        />
        <line
          x1={CX}
          y1={CY - R_MAX}
          x2={CX}
          y2={CY + R_MAX}
          stroke="#10B981"
          strokeWidth={0.5}
          opacity={0.08}
        />
      </g>

      {/* Blip dots */}
      <g>
        {BLIPS.map((b, i) => {
          const r = RINGS[b.ring];
          const rad = (b.angle - 90) * (Math.PI / 180);
          const x = CX + r * Math.cos(rad);
          const y = CY + r * Math.sin(rad);
          return (
            <circle
              key={`blip-${i}`}
              cx={x}
              cy={y}
              r={2.5}
              fill="#10B981"
              opacity={0.25}
              className={b.pulse !== undefined ? "hero-radar-blip" : undefined}
              style={b.pulse !== undefined ? { animationDelay: b.pulse, transformOrigin: `${x}px ${y}px` } : undefined}
            />
          );
        })}
      </g>

      {/* Sweep arm + glow trail, rotating around radar center */}
      <g
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          animation: "heroRadarSweep 8s linear infinite",
        }}
      >
        <path d={SWEEP_PATH} fill="url(#hero-radar-trail)" />
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - R_MAX}
          stroke="#10B981"
          strokeWidth={1.5}
          opacity={0.5}
        />
      </g>
    </svg>
  );
};

export default HeroNetwork;
