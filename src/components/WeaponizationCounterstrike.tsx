import { useEffect, useMemo, useRef, useState } from "react";

/**
 * WeaponizationCounterstrike — active defense visualization. Incoming
 * payer threat vectors travel right→left; the ZDefense barrier intercepts
 * most, firing a cyan counter-beam and a burst of victory particles.
 * Pure SVG + React hooks. Decorative.
 */

const VIEW_W = 1200;
const VIEW_H = 360;
const BARRIER_X = 750;

const THREAT_COUNT = 6;
const THREAT_LEN = 120;
const THREAT_DY = 18; // total downward drift across full width
const THREAT_TOP = 60;
const THREAT_BOT = 300;
// Fixed durations per threat (seconds to cross full width)
const THREAT_DURATIONS = [2.7, 3.4, 2.5, 3.8, 3.1, 4.0];
const THREAT_OFFSETS = [0, 0.6, 1.2, 1.9, 2.4, 3.0]; // seconds
// Stable intercept pattern: 70% intercepted (4/6), 30% pass (2/6)
const THREAT_INTERCEPTED = [true, true, false, true, true, false];

const BARRIER_PULSE_MS = 3000;

interface Beam {
  id: number;
  x: number;
  y: number;
  angle: number; // radians
  born: number;
}
const BEAM_LIFETIME_MS = 250;
const BEAM_LEN = 120;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
}
const PARTICLE_LIFETIME_MS = 600;
const PARTICLE_SPEED = 70; // px/sec

const WI_TEXTS = ["WI 1.8x", "WI 2.1x", "WI 2.4x"];
interface WiLabel {
  id: number;
  x: number;
  y: number;
  text: string;
  born: number;
  strike: boolean; // true = strikethrough+fade, false = fade out only
}
const WI_FADE_IN_MS = 300;
const WI_HOLD_MS = 900;
const WI_STRIKE_MS = 350;
const WI_FADE_OUT_MS = 300;
const WI_TOTAL_MS = WI_FADE_IN_MS + WI_HOLD_MS + WI_STRIKE_MS + WI_FADE_OUT_MS;
const WI_SPAWN_INTERVAL_MS = 2500;

// Hexagonal grid (flat-top), side length 28
const HEX_SIDE = 28;
const HEX_W = 2 * HEX_SIDE; // 56 (flat-top width)
const HEX_H = Math.sqrt(3) * HEX_SIDE; // ~48.5
const hexPolygon = (cx: number, cy: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i; // flat-top: 0, 60, 120...
    pts.push(`${cx + HEX_SIDE * Math.cos(a)},${cy + HEX_SIDE * Math.sin(a)}`);
  }
  return pts.join(" ");
};

// Threat geometry helpers
const threatY0 = (i: number) =>
  THREAT_TOP + ((THREAT_BOT - THREAT_TOP) / (THREAT_COUNT - 1)) * i;
// Travel from x=1250 → x=0 with downward drift of THREAT_DY across full pass
const threatPos = (i: number, t: number) => {
  // t in [0,1] along the trajectory
  const x = 1250 - t * 1250;
  const y = threatY0(i) + t * THREAT_DY;
  return { x, y };
};
const threatAngle = () => Math.atan2(THREAT_DY, -1250); // radians; vector dir of travel

const WeaponizationCounterstrike = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);

  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const beamsRef = useRef<Beam[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const wiLabelsRef = useRef<WiLabel[]>([]);
  const idRef = useRef(0);

  // Per-threat per-cycle: have we fired the intercept this pass yet?
  const lastCycleRef = useRef<number[]>(
    Array.from({ length: THREAT_COUNT }, () => -1)
  );

  // Last WI spawn time
  const lastWiSpawnRef = useRef<number>(-Infinity);

  // Hex grid points (memoized)
  const hexPoints = useMemo(() => {
    const pts: { cx: number; cy: number }[] = [];
    const colSpacing = HEX_W * 0.75; // flat-top horizontal spacing = 1.5 * side
    const rowSpacing = HEX_H;
    const cols = Math.ceil(VIEW_W / colSpacing) + 2;
    const rows = Math.ceil(VIEW_H / rowSpacing) + 2;
    for (let c = -1; c < cols; c++) {
      for (let r = -1; r < rows; r++) {
        const cx = c * colSpacing;
        const cy = r * rowSpacing + (c % 2 === 0 ? 0 : rowSpacing / 2);
        pts.push({ cx, cy });
      }
    }
    return pts;
  }, []);

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
    const angle = threatAngle();

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const elapsedSec = elapsed / 1000;

      // Detect threat intercepts (when crossing barrier this cycle)
      for (let i = 0; i < THREAT_COUNT; i++) {
        if (!THREAT_INTERCEPTED[i]) continue;
        const dur = THREAT_DURATIONS[i];
        const offset = THREAT_OFFSETS[i];
        const localSec = elapsedSec - offset;
        if (localSec < 0) continue;
        const cycle = Math.floor(localSec / dur);
        const tInCycle = (localSec % dur) / dur;
        // x at front of segment crosses BARRIER_X when:
        // 1250 - tInCycle*1250 = BARRIER_X → tInCycle = (1250-500)/1250 = 0.6
        const interceptT = (1250 - BARRIER_X) / 1250;
        if (
          tInCycle >= interceptT &&
          lastCycleRef.current[i] !== cycle
        ) {
          lastCycleRef.current[i] = cycle;
          const pos = threatPos(i, interceptT);
          // Spawn beam (extends to the right along the travel-back direction).
          // Threat travels right→left, so counter-beam fires right.
          beamsRef.current.push({
            id: ++idRef.current,
            x: BARRIER_X,
            y: pos.y,
            angle: -angle, // mirror: outbound to the right with slight upward
            born: elapsed,
          });
          // Spawn 6 victory particles
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI * 2 * k) / 6;
            particlesRef.current.push({
              id: ++idRef.current,
              x: BARRIER_X,
              y: pos.y,
              vx: Math.cos(a) * PARTICLE_SPEED,
              vy: Math.sin(a) * PARTICLE_SPEED,
              born: elapsed,
            });
          }
        }
      }

      // Cull expired beams + particles
      beamsRef.current = beamsRef.current.filter(
        (b) => elapsed - b.born < BEAM_LIFETIME_MS
      );
      particlesRef.current = particlesRef.current.filter(
        (p) => elapsed - p.born < PARTICLE_LIFETIME_MS
      );

      // Spawn WI labels
      if (elapsed - lastWiSpawnRef.current >= WI_SPAWN_INTERVAL_MS) {
        lastWiSpawnRef.current = elapsed;
        const seed = idRef.current + 1;
        const rx = 650 + ((seed * 97) % 451); // 650-1100
        const ry = 60 + ((seed * 53) % 241); // 60-300
        const text = WI_TEXTS[seed % WI_TEXTS.length];
        const strike = (seed * 7) % 10 < 7; // 70%
        wiLabelsRef.current.push({
          id: ++idRef.current,
          x: rx,
          y: ry,
          text,
          born: elapsed,
          strike,
        });
      }
      // Cull expired WI labels
      wiLabelsRef.current = wiLabelsRef.current.filter(
        (w) => elapsed - w.born < WI_TOTAL_MS
      );

      setTick((n) => (n + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;
  const elapsedSec = elapsed / 1000;

  // Barrier glow opacity
  const barrierGlow =
    0.03 +
    ((Math.sin(elapsedSec * ((2 * Math.PI) / (BARRIER_PULSE_MS / 1000))) + 1) /
      2) *
      0.05;

  const angle = threatAngle();
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#0B1628" />

        {/* Hex grid overlay */}
        <g>
          {hexPoints.map((p, i) => (
            <polygon
              key={`hex-${i}`}
              points={hexPolygon(p.cx, p.cy)}
              fill="none"
              stroke="#1E3A5F"
              strokeWidth={0.5}
              opacity={0.12}
            />
          ))}
        </g>

        {/* Barrier glow */}
        <circle
          cx={BARRIER_X}
          cy={180}
          r={180}
          fill="#06B6D4"
          opacity={barrierGlow}
        />

        {/* Defense barrier */}
        <line
          x1={BARRIER_X}
          y1={20}
          x2={BARRIER_X}
          y2={340}
          stroke="#06B6D4"
          strokeWidth={2}
          opacity={0.7}
        />

        {/* Threat vectors */}
        {Array.from({ length: THREAT_COUNT }).map((_, i) => {
          const dur = THREAT_DURATIONS[i];
          const offset = THREAT_OFFSETS[i];
          const localSec = elapsedSec - offset;
          if (localSec < 0) return null;
          const tInCycle = (localSec % dur) / dur;
          const head = threatPos(i, tInCycle);
          // Tail is THREAT_LEN behind, along reversed travel direction.
          // Travel dir vector (from x=1250 to x=0): (-1, +THREAT_DY/1250); normalized.
          const travelLen = Math.sqrt(1250 * 1250 + THREAT_DY * THREAT_DY);
          const tx = -1250 / travelLen;
          const ty = THREAT_DY / travelLen;
          const tail = {
            x: head.x - tx * THREAT_LEN,
            y: head.y - ty * THREAT_LEN,
          };
          // Intercept logic: if intercepted, hide once head crosses barrier.
          const intercepted = THREAT_INTERCEPTED[i];
          let opacity = 0.55;
          if (intercepted && head.x <= BARRIER_X) return null;
          if (!intercepted && head.x <= BARRIER_X) opacity = 0.2;
          return (
            <line
              key={`threat-${i}`}
              x1={tail.x}
              y1={tail.y}
              x2={head.x}
              y2={head.y}
              stroke="#EF4444"
              strokeWidth={1.5}
              opacity={opacity}
            />
          );
        })}

        {/* Counter beams */}
        {beamsRef.current.map((b) => {
          const age = elapsed - b.born;
          const t = age / BEAM_LIFETIME_MS;
          const op = 0.85 * (1 - t);
          // Beam fires to the right; direction is mirrored travel angle
          const dx = -dirX; // outbound right (positive x)
          const dy = -dirY;
          return (
            <line
              key={`beam-${b.id}`}
              x1={b.x}
              y1={b.y}
              x2={b.x + dx * BEAM_LEN}
              y2={b.y + dy * BEAM_LEN}
              stroke="#06B6D4"
              strokeWidth={1.5}
              opacity={op}
            />
          );
        })}

        {/* Victory particles */}
        {particlesRef.current.map((p) => {
          const ageSec = (elapsed - p.born) / 1000;
          const age = elapsed - p.born;
          const t = age / PARTICLE_LIFETIME_MS;
          const op = 0.9 * (1 - t);
          const x = p.x + p.vx * ageSec;
          const y = p.y + p.vy * ageSec;
          return (
            <circle
              key={`p-${p.id}`}
              cx={x}
              cy={y}
              r={2.5}
              fill="#10B981"
              opacity={op}
            />
          );
        })}

        {/* WI labels */}
        {wiLabelsRef.current.map((w) => {
          const age = elapsed - w.born;
          let opacity = 0;
          if (age < WI_FADE_IN_MS) {
            opacity = age / WI_FADE_IN_MS;
          } else if (age < WI_FADE_IN_MS + WI_HOLD_MS) {
            opacity = 1;
          } else if (
            age <
            WI_FADE_IN_MS + WI_HOLD_MS + WI_STRIKE_MS
          ) {
            opacity = 1;
          } else {
            const t =
              (age - WI_FADE_IN_MS - WI_HOLD_MS - WI_STRIKE_MS) /
              WI_FADE_OUT_MS;
            opacity = Math.max(0, 1 - t);
          }
          // Strike progress
          let strikeProg = 0;
          if (
            w.strike &&
            age >= WI_FADE_IN_MS + WI_HOLD_MS &&
            age < WI_FADE_IN_MS + WI_HOLD_MS + WI_STRIKE_MS
          ) {
            strikeProg =
              (age - WI_FADE_IN_MS - WI_HOLD_MS) / WI_STRIKE_MS;
          } else if (
            w.strike &&
            age >= WI_FADE_IN_MS + WI_HOLD_MS + WI_STRIKE_MS
          ) {
            strikeProg = 1;
          }
          // Approx text width for strikethrough
          const textWidth = w.text.length * 6.5;
          return (
            <g key={`wi-${w.id}`} opacity={opacity}>
              <text
                x={w.x}
                y={w.y}
                fill="#EF4444"
                fontSize={10}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {w.text}
              </text>
              {w.strike && strikeProg > 0 && (
                <line
                  x1={w.x}
                  y1={w.y - 3}
                  x2={w.x + textWidth * strikeProg}
                  y2={w.y - 3}
                  stroke="#06B6D4"
                  strokeWidth={1.5}
                  opacity={0.9}
                />
              )}
            </g>
          );
        })}

        {/* Static zone labels */}
        <text
          x={30}
          y={24}
          fill="#10B981"
          fontSize={8}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.45}
          letterSpacing={2}
        >
          PROVIDER
        </text>
        <text
          x={30}
          y={38}
          fill="#06B6D4"
          fontSize={8}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.5}
          letterSpacing={2}
        >
          ZDEFENSE ACTIVE
        </text>
        <text
          x={960}
          y={24}
          fill="#EF4444"
          fontSize={8}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.45}
          letterSpacing={2}
        >
          PAYER NETWORK
        </text>
      </svg>
    </div>
  );
};

export default WeaponizationCounterstrike;
