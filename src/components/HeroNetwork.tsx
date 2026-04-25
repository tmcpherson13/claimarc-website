import { useEffect, useRef, useState } from "react";

/**
 * HeroNetwork — decorative radar background for the hero section.
 * Single rAF loop drives both the sweep arm rotation and blip activation
 * so they always reference the exact same angle value.
 */

interface HeroNetworkProps {
  className?: string;
}

const VB_W = 1200;
const VB_H = 600;
const CX = VB_W * 0.75; // 900
const CY = VB_H * 0.5;  // 300
const RINGS = [120, 210, 310, 420];
const R_MAX = 420;

const DURATION = 9200;
const TRAIL_WINDOW = 8; // degrees

// Blip definitions: ring index + angle in clockwise-from-north degrees
// (0 = up/north, increasing clockwise) — same convention as the sweep arm
// at rotate(armAngle).
const BLIP_DEFS = [
  { ring: 3, angle: 35 },
  { ring: 2, angle: 95 },
  { ring: 1, angle: 155 },
  { ring: 3, angle: 210 },
  { ring: 2, angle: 270 },
  { ring: 1, angle: 315 },
  { ring: 0, angle: 60 },
  { ring: 3, angle: 140 },
];

// Convert clockwise-from-north angle to SVG x/y (north = -y).
const blips = BLIP_DEFS.map((b) => {
  const r = RINGS[b.ring];
  const theta = ((b.angle - 90) * Math.PI) / 180; // shift so 0° = north
  return {
    angle: b.angle,
    x: CX + r * Math.cos(theta),
    y: CY + r * Math.sin(theta),
  };
});

const NUM_BLIPS = blips.length;

const HeroNetwork = ({ className = "" }: HeroNetworkProps) => {
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const [armAngle, setArmAngle] = useState(0);
  const [activeBlips, setActiveBlips] = useState<boolean[]>(
    () => Array(NUM_BLIPS).fill(false)
  );

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const angle = ((elapsed % DURATION) / DURATION) * 360;

      setArmAngle(angle);
      setActiveBlips(
        blips.map((blip) => {
          const diff = (angle - blip.angle + 360) % 360;
          return diff >= 0 && diff < TRAIL_WINDOW;
        })
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
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

      {/* Blip dots — opacity-only fade driven by activeBlips */}
      <g>
        {blips.map((b, i) => {
          const on = activeBlips[i];
          return (
            <g key={`blip-${i}`}>
              <circle
                cx={b.x}
                cy={b.y}
                r={9}
                fill="none"
                stroke="#10B981"
                strokeWidth={1}
                opacity={on ? 0.6 : 0}
                style={{ transition: "opacity 200ms ease" }}
              />
              <circle
                cx={b.x}
                cy={b.y}
                r={4}
                fill="#10B981"
                opacity={on ? 1 : 0}
                style={{ transition: "opacity 200ms ease" }}
              />
            </g>
          );
        })}
      </g>

      {/* Sweep arm — rotated via inline transform from rAF state */}
      <g
        style={{
          transform: `rotate(${armAngle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transformBox: "view-box" as const,
        }}
      >
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
