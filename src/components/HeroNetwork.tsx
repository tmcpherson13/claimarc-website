import { useEffect, useRef, useState } from "react";

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
const RINGS = [120, 210, 310, 420]; // ring 1, 2, 3, outer
const R_MAX = 420;

// Sweep duration must match the CSS animation below.
const SWEEP_DURATION_MS = 9200;


// Blip definitions: ring index (0=innermost..3=outer) + angle in standard
// math degrees (0 = +x axis, CCW positive — used directly with cos/sin).
const BLIP_DEFS = [
  { ring: 3, angle: 35 },   // A — outer
  { ring: 2, angle: 95 },   // B — ring 3
  { ring: 1, angle: 155 },  // C — ring 2
  { ring: 3, angle: 210 },  // D — outer
  { ring: 2, angle: 270 },  // E — ring 3
  { ring: 1, angle: 315 },  // F — ring 2
  { ring: 0, angle: 60 },   // G — ring 1
  { ring: 3, angle: 140 },  // H — outer
];

// Precompute pixel positions and "north-clockwise" angle for sweep matching.
// Sweep arm at rotation R points to (CX, CY - R_MAX) rotated CW by R, i.e.
// north + R clockwise. Convert each blip's (dx, dy) to north-CW degrees.
const BLIPS = BLIP_DEFS.map((b) => {
  const r = RINGS[b.ring];
  const rad = (b.angle * Math.PI) / 180;
  const x = CX + r * Math.cos(rad);
  const y = CY + r * Math.sin(rad);
  const dx = x - CX;
  const dy = y - CY;
  let northCw = 90 + (Math.atan2(dy, dx) * 180) / Math.PI;
  northCw = ((northCw % 360) + 360) % 360;
  return { x, y, northCw };
});

const HeroNetwork = ({ className = "" }: HeroNetworkProps) => {
  const [active, setActive] = useState<boolean[]>(() => BLIPS.map(() => false));
  const pulseKeysRef = useRef<number[]>(BLIPS.map(() => 0));
  const [, forcePulse] = useState(0);

  useEffect(() => {
    const TRAIL_WINDOW = 6; // degrees past the blip
    const OFF_DELAY_MS = 500;
    const wasActive = BLIPS.map(() => false);
    const offTimers: Array<number | null> = BLIPS.map(() => null);

    const id = window.setInterval(() => {
      const elapsed = performance.now() % SWEEP_DURATION_MS;
      const armAngle = (elapsed / SWEEP_DURATION_MS) * 360;
      let changed = false;
      let pulseChanged = false;
      const next = wasActive.slice();

      for (let i = 0; i < BLIPS.length; i++) {
        // Trailing window: how far past the blip the arm has swept (0..360).
        const diff = (armAngle - BLIPS[i].northCw + 360) % 360;
        const inWindow = diff < TRAIL_WINDOW;

        if (inWindow && !wasActive[i]) {
          // Rising edge: arm just reached the blip.
          if (offTimers[i] !== null) {
            window.clearTimeout(offTimers[i] as number);
            offTimers[i] = null;
          }
          next[i] = true;
          wasActive[i] = true;
          changed = true;
          pulseKeysRef.current[i] += 1;
          pulseChanged = true;
        } else if (!inWindow && wasActive[i] && offTimers[i] === null) {
          // Falling edge: schedule turn-off after the fade delay.
          const idx = i;
          offTimers[idx] = window.setTimeout(() => {
            wasActive[idx] = false;
            offTimers[idx] = null;
            setActive((prev) => {
              if (!prev[idx]) return prev;
              const copy = prev.slice();
              copy[idx] = false;
              return copy;
            });
          }, OFF_DELAY_MS);
        }
      }
      if (changed) setActive(next);
      if (pulseChanged) forcePulse((n) => n + 1);
    }, 50);

    return () => {
      window.clearInterval(id);
      offTimers.forEach((t) => t !== null && window.clearTimeout(t));
    };
  }, []);

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

      {/* Blip dots — dark by default, light up as sweep arm passes */}
      <g>
        {BLIPS.map((b, i) => {
          const isActive = active[i];
          const pulseKey = pulseKeysRef.current[i];
          return (
            <g key={`blip-${i}`}>
              {pulseKey > 0 && (
                <circle
                  key={`pulse-${pulseKey}`}
                  cx={b.x}
                  cy={b.y}
                  r={8}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={1}
                  opacity={0}
                  className="hero-radar-blip-pulse"
                  style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                />
              )}
              <circle
                cx={b.x}
                cy={b.y}
                r={3}
                fill="#10B981"
                className="transition-opacity duration-500"
                style={{ opacity: isActive ? 0.7 : 0 }}
              />
            </g>
          );
        })}
      </g>

      {/* Sweep arm + glow trail, rotating around radar center */}
      <g
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          animation: "heroRadarSweep 9.2s linear infinite",
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
