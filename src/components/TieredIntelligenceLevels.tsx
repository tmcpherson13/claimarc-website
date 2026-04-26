import { useEffect, useRef, useState } from "react";

/**
 * TieredIntelligenceLevels — full-width animated SVG background for the
 * Pricing hero. Five vertical tier zones with upward-flowing data streams,
 * bobbing price badges, and rising +$ value pops. Pure SVG + React hooks.
 */

interface Tier {
  key: string;
  name: string;
  color: string;
  price: string;
  streams: number;
}

const TIERS: Tier[] = [
  { key: "insight", name: "INSIGHT", color: "#64748B", price: "$1.5K", streams: 2 },
  { key: "defend", name: "DEFEND", color: "#3B82F6", price: "$3.5K", streams: 3 },
  { key: "recover", name: "RECOVER", color: "#8B5CF6", price: "$5K", streams: 4 },
  { key: "intel", name: "INTELLIGENCE", color: "#10B981", price: "$8.5K", streams: 5 },
  { key: "enterprise", name: "ENTERPRISE", color: "#F59E0B", price: "$15K", streams: 6 },
];

const ZONE_W = 240;
const SVG_H = 320;

const STREAM_HEIGHT = 40;
const STREAM_DURATION_RANGE: [number, number] = [3500, 6500];

interface StreamDef {
  zoneIndex: number;
  x: number;
  duration: number;
  offset: number;
  opacity: number;
  color: string;
}

const STREAMS: StreamDef[] = (() => {
  const list: StreamDef[] = [];
  TIERS.forEach((tier, zi) => {
    const baseX = zi * ZONE_W;
    // opacity ramps from 0.15 (insight) to 0.45 (enterprise)
    const op = 0.15 + (zi / (TIERS.length - 1)) * 0.3;
    for (let i = 0; i < tier.streams; i++) {
      const x = baseX + ((i + 1) * ZONE_W) / (tier.streams + 1);
      const duration =
        STREAM_DURATION_RANGE[0] +
        ((i * 977 + zi * 313) % 1000) / 1000 *
          (STREAM_DURATION_RANGE[1] - STREAM_DURATION_RANGE[0]);
      const offset = ((i * 0.31 + zi * 0.17) % 1);
      list.push({
        zoneIndex: zi,
        x,
        duration,
        offset,
        opacity: op,
        color: tier.color,
      });
    }
  });
  return list;
})();

const BADGE_W = 72;
const BADGE_H = 22;
const BADGE_AMPLITUDE = 12;
const BADGE_PERIOD_MS = 4000;

const ENTERPRISE_PERIOD_MS = 5000;

const POP_SPAWN_MS = 2000;
const POP_FADE_IN = 300;
const POP_DRIFT = 1200;
const POP_FADE_OUT = 300;
const POP_TOTAL = POP_FADE_IN + POP_DRIFT + POP_FADE_OUT;
const POP_TEXTS = ["✓", "+$2.4K", "✓", "+$8.1K", "✓", "+$14.2K"];

interface Pop {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  born: number;
}

const TieredIntelligenceLevels = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const popsRef = useRef<Pop[]>([]);
  const lastPopRef = useRef<number>(0);
  const idRef = useRef<number>(1);

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

      // Spawn pops in right three zones
      if (elapsed - lastPopRef.current > POP_SPAWN_MS) {
        lastPopRef.current = elapsed;
        const zi = 2 + Math.floor(Math.random() * 3);
        const tier = TIERS[zi];
        const baseX = zi * ZONE_W;
        popsRef.current.push({
          id: idRef.current++,
          text: POP_TEXTS[Math.floor(Math.random() * POP_TEXTS.length)],
          x: baseX + 30 + Math.random() * (ZONE_W - 60),
          y: 80 + Math.random() * 180,
          color: tier.color,
          born: elapsed,
        });
      }
      popsRef.current = popsRef.current.filter(
        (p) => elapsed - p.born < POP_TOTAL
      );

      setTick((n) => (n + 1) % 1000000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;
  const enterprisePulse =
    0.03 +
    ((Math.sin(
      (elapsed / 1000) * ((2 * Math.PI) / (ENTERPRISE_PERIOD_MS / 1000))
    ) +
      1) /
      2) *
      0.04;

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full pointer-events-none">
      <div style={{ opacity: 0.9 }} className="w-full h-full">
        <svg
          viewBox="0 0 1200 320"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {TIERS.map((t) => (
              <linearGradient
                key={`g-${t.key}`}
                id={`tier-${t.key}`}
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor={t.color} stopOpacity={0} />
                <stop offset="100%" stopColor={t.color} stopOpacity={0.09} />
              </linearGradient>
            ))}
            <radialGradient id="enterpriseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={enterprisePulse} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
            </radialGradient>
          </defs>

          <rect x={0} y={0} width={1200} height={SVG_H} fill="#0B1628" />

          {/* Tier zones */}
          {TIERS.map((t, zi) => (
            <rect
              key={`zone-${t.key}`}
              x={zi * ZONE_W}
              y={0}
              width={ZONE_W}
              height={SVG_H}
              fill={`url(#tier-${t.key})`}
            />
          ))}

          {/* Boundary lines (between zones) */}
          {TIERS.slice(1).map((t, i) => (
            <line
              key={`bd-${t.key}`}
              x1={(i + 1) * ZONE_W}
              y1={0}
              x2={(i + 1) * ZONE_W}
              y2={SVG_H}
              stroke={t.color}
              strokeWidth={1}
              opacity={0.15}
              strokeDasharray="4 6"
            />
          ))}

          {/* Enterprise glow */}
          <circle
            cx={4 * ZONE_W + ZONE_W / 2}
            cy={SVG_H / 2}
            r={180}
            fill="url(#enterpriseGlow)"
          />

          {/* Tier name labels at top */}
          {TIERS.map((t, zi) => (
            <text
              key={`lbl-${t.key}`}
              x={zi * ZONE_W + ZONE_W / 2}
              y={16}
              textAnchor="middle"
              fill={t.color}
              opacity={0.35}
              fontSize={8}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontWeight="bold"
              letterSpacing={2}
            >
              {t.name}
            </text>
          ))}

          {/* Upward streams */}
          {STREAMS.map((s, i) => {
            const phase = ((elapsed / s.duration) + s.offset) % 1;
            // y travels from SVG_H to -STREAM_HEIGHT
            const y = SVG_H - phase * (SVG_H + STREAM_HEIGHT);
            return (
              <line
                key={`st-${i}`}
                x1={s.x}
                y1={y}
                x2={s.x}
                y2={y + STREAM_HEIGHT}
                stroke={s.color}
                strokeWidth={1.5}
                opacity={s.opacity}
                strokeLinecap="round"
              />
            );
          })}

          {/* Floating price badges */}
          {TIERS.map((t, zi) => {
            const phase = (zi * 0.7);
            const bob =
              Math.sin(
                (elapsed / 1000) * ((2 * Math.PI) / (BADGE_PERIOD_MS / 1000)) +
                  phase
              ) * BADGE_AMPLITUDE;
            const cx = zi * ZONE_W + ZONE_W / 2;
            const cy = SVG_H / 2 + bob;
            return (
              <g key={`bd-${t.key}`}>
                <rect
                  x={cx - BADGE_W / 2}
                  y={cy - BADGE_H / 2}
                  width={BADGE_W}
                  height={BADGE_H}
                  rx={6}
                  fill={t.color}
                  fillOpacity={0.1}
                  stroke={t.color}
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fill={t.color}
                  fontSize={8}
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {t.price}
                </text>
              </g>
            );
          })}

          {/* Animated value pops */}
          {popsRef.current.map((p) => {
            const age = elapsed - p.born;
            let opacity = 0;
            if (age < POP_FADE_IN) opacity = age / POP_FADE_IN;
            else if (age < POP_FADE_IN + POP_DRIFT) opacity = 1;
            else
              opacity = Math.max(
                0,
                1 - (age - POP_FADE_IN - POP_DRIFT) / POP_FADE_OUT
              );
            const driftProgress = Math.min(1, age / (POP_FADE_IN + POP_DRIFT));
            const y = p.y - driftProgress * 20;
            return (
              <text
                key={`pop-${p.id}`}
                x={p.x}
                y={y}
                fill={p.color}
                opacity={opacity}
                fontSize={9}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                textAnchor="middle"
              >
                {p.text}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TieredIntelligenceLevels;
