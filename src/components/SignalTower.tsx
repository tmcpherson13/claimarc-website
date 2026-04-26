import { useEffect, useRef, useState } from "react";

/**
 * SignalTower — calm, architectural decorative SVG. A lighthouse for
 * intelligence: a single tower emits horizontal broadcast rings that
 * sweep outward and momentarily light up scattered receiver dots.
 * Pure SVG + React hooks. Decorative.
 */

const CENTER_X = 950;
const CENTER_Y = 70;
const RING_RY = 28;

interface RingDef {
  rx: number;
  opacity: number;
}

const STATIC_RINGS: RingDef[] = [
  { rx: 80, opacity: 0.35 },
  { rx: 165, opacity: 0.25 },
  { rx: 250, opacity: 0.18 },
  { rx: 335, opacity: 0.12 },
  { rx: 420, opacity: 0.07 },
];

const PULSE_DURATION_MS = 3000;
const PULSE_STAGGER_MS = 600;
const BREATH_PERIOD_MS = 4000;
const HIT_FLASH_MS = 400;
const HIT_TOLERANCE = 12; // px tolerance for "pulse passes over dot"

interface Dot {
  x: number;
  y: number;
}

const DOTS: Dot[] = [
  { x: 620, y: 100 },
  { x: 680, y: 230 },
  { x: 740, y: 130 },
  { x: 800, y: 210 },
  { x: 860, y: 90 },
  { x: 900, y: 250 },
  { x: 1000, y: 110 },
  { x: 1040, y: 200 },
  { x: 1080, y: 140 },
  { x: 1130, y: 220 },
  { x: 1160, y: 100 },
  { x: 760, y: 180 },
];

const SignalTower = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // Per-dot last-hit timestamp (ms since start) — null means never hit.
  const lastHitRef = useRef<(number | null)[]>(DOTS.map(() => null));
  // Per-pulse-ring last-rx so we can detect crossing events per dot.
  const prevRxRef = useRef<number[]>(STATIC_RINGS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      // For each pulse ring, compute current rx and detect dot crossings.
      STATIC_RINGS.forEach((ring, i) => {
        const local = (elapsed - i * PULSE_STAGGER_MS) % PULSE_DURATION_MS;
        const t = local < 0 ? 0 : local / PULSE_DURATION_MS;
        const currentRx = t * ring.rx;
        const prevRx = prevRxRef.current[i];

        DOTS.forEach((dot, di) => {
          const dist = Math.abs(dot.x - CENTER_X);
          // Dot must be within this ring's max reach
          if (dist > ring.rx + HIT_TOLERANCE) return;
          // Detect crossing this frame
          const wasBefore = prevRx < dist;
          const isAtOrPast = currentRx >= dist;
          if (wasBefore && isAtOrPast && currentRx <= dist + HIT_TOLERANCE * 2) {
            lastHitRef.current[di] = elapsed;
          }
        });

        prevRxRef.current[i] = currentRx;
      });

      setTick((n) => (n + 1) % 1000000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;

  // Breathing glow opacity 0.6 → 1.0
  const breath =
    0.6 +
    ((Math.sin((elapsed / 1000) * ((2 * Math.PI) / (BREATH_PERIOD_MS / 1000))) +
      1) /
      2) *
      0.4;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 340"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="towerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={1200} height={340} fill="#0B1628" />

        {/* Breathing tower glow */}
        <g style={{ opacity: breath }}>
          <rect
            x={CENTER_X - 60}
            y={CENTER_Y - 150}
            width={120}
            height={300}
            fill="url(#towerGlow)"
          />
        </g>

        {/* Static concentric rings */}
        {STATIC_RINGS.map((r, i) => (
          <ellipse
            key={`ring-${i}`}
            cx={CENTER_X}
            cy={CENTER_Y}
            rx={r.rx}
            ry={RING_RY}
            fill="none"
            stroke="#10B981"
            strokeWidth={1}
            opacity={r.opacity}
          />
        ))}

        {/* Animated pulse rings */}
        {STATIC_RINGS.map((r, i) => {
          const local = (elapsed - i * PULSE_STAGGER_MS) % PULSE_DURATION_MS;
          if (local < 0) return null;
          const t = local / PULSE_DURATION_MS;
          const rx = t * r.rx;
          const ry = t * RING_RY;
          const opacity = 0.5 * (1 - t);
          return (
            <ellipse
              key={`pulse-${i}`}
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="#10B981"
              strokeWidth={1.5}
              opacity={opacity}
            />
          );
        })}

        {/* Tower — broadcast signal tower centered at x=600 */}
        {(() => {
          const TX = CENTER_X;
          const baseY = 310;
          const apexY = 100;
          const baseLeftX = TX - 80;
          const baseRightX = TX + 80;
          const apexLeftX = TX - 6;
          const apexRightX = TX + 6;
          const interp = (y: number) => {
            const t = (y - apexY) / (baseY - apexY);
            return {
              left: apexLeftX + (baseLeftX - apexLeftX) * t,
              right: apexRightX + (baseRightX - apexRightX) * t,
            };
          };
          const braceYs = [150, 190, 230, 265];

          // Antenna tip slow steady pulse (reuses elapsed)
          const tipT = (elapsed % PULSE_DURATION_MS) / PULSE_DURATION_MS;
          const tipR = 3 + tipT * 18;
          const tipOpacity = 0.6 * (1 - tipT);

          return (
            <g>
              {/* Base legs */}
              <line x1={TX} y1={280} x2={baseLeftX} y2={baseY} stroke="#10B981" strokeWidth={2} opacity={0.7} />
              <line x1={TX} y1={280} x2={baseRightX} y2={baseY} stroke="#10B981" strokeWidth={2} opacity={0.7} />

              {/* Tower body sides */}
              <line x1={baseLeftX} y1={baseY} x2={apexLeftX} y2={apexY} stroke="#10B981" strokeWidth={2} opacity={0.7} />
              <line x1={baseRightX} y1={baseY} x2={apexRightX} y2={apexY} stroke="#10B981" strokeWidth={2} opacity={0.7} />

              {/* Cross braces */}
              {braceYs.map((y) => {
                const { left, right } = interp(y);
                return (
                  <line
                    key={`brace-${y}`}
                    x1={left}
                    y1={y}
                    x2={right}
                    y2={y}
                    stroke="#10B981"
                    strokeWidth={1}
                    opacity={0.4}
                  />
                );
              })}

              {/* Mast */}
              <line x1={TX} y1={apexY} x2={TX} y2={72} stroke="#10B981" strokeWidth={2} opacity={0.8} />

              {/* Antenna tip pulse ring */}
              <circle
                cx={TX}
                cy={70}
                r={tipR}
                fill="none"
                stroke="#10B981"
                strokeWidth={1}
                opacity={tipOpacity}
              />
              {/* Antenna tip */}
              <circle cx={TX} cy={70} r={3} fill="#10B981" opacity={1} />
            </g>
          );
        })()}

        {/* Receiver dots */}
        {DOTS.map((dot, i) => {
          const lastHit = lastHitRef.current[i];
          const sinceHit = lastHit === null ? Infinity : elapsed - lastHit;
          const lit = sinceHit < HIT_FLASH_MS;
          const flashProgress = lit ? sinceHit / HIT_FLASH_MS : 1;
          const fill = lit ? "#10B981" : "#64748B";
          const opacity = lit ? 0.9 - flashProgress * 0.5 : 0.4;
          return (
            <circle
              key={`dot-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={3}
              fill={fill}
              opacity={opacity}
            />
          );
        })}

        {/* Corner labels */}
        <text
          x={20}
          y={24}
          fill="#10B981"
          fontSize={8}
          opacity={0.4}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          letterSpacing={2}
        >
          SIGNAL ACTIVE
        </text>
        <text
          x={1180}
          y={24}
          fill="#475569"
          fontSize={8}
          opacity={0.35}
          textAnchor="end"
          fontFamily="ui-sans-serif, system-ui"
        >
          ZDefense Intelligence Network
        </text>
      </svg>
    </div>
  );
};

export default SignalTower;
