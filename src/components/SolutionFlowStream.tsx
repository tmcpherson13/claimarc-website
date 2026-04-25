import { useEffect, useRef, useState } from "react";

/**
 * SolutionFlowStream — full-width animated SVG background for the Solutions
 * hero. Tells a left-to-right story: denials (red) get intercepted by the
 * intelligence layer (emerald barriers) and emerge as resolved revenue.
 * Pure SVG + React hooks. Decorative; values illustrative.
 */

const RAILS = [60, 110, 170, 230, 280];

const DENIAL_LABELS = ["CO-50", "CO-16", "CO-97", "CO-45", "CO-29"];
const RESOLVED_LABELS = ["$1.2K", "$3.4K", "RESOLVED", "↑ Revenue", "$890"];

interface DenialCloud {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
}

const CLOUDS: DenialCloud[] = [
  { cx: 80, cy: 100, rx: 90, ry: 50, opacity: 0.08 },
  { cx: 180, cy: 80, rx: 110, ry: 55, opacity: 0.06 },
  { cx: 130, cy: 220, rx: 100, ry: 60, opacity: 0.1 },
  { cx: 240, cy: 240, rx: 90, ry: 45, opacity: 0.07 },
  { cx: 300, cy: 150, rx: 80, ry: 50, opacity: 0.06 },
];

interface BrokenClaim {
  x: number;
  y: number;
  label?: string;
}

const BROKEN_CLAIMS: BrokenClaim[] = [
  { x: 40, y: 50, label: "CO-50" },
  { x: 220, y: 50 },
  { x: 100, y: 160 },
  { x: 280, y: 110, label: "CO-16" },
  { x: 60, y: 280 },
  { x: 320, y: 270 },
];

interface ArrowIcon {
  x: number;
  y: number;
}

const RESOLUTION_ARROWS: ArrowIcon[] = [
  { x: 880, y: 80 },
  { x: 1000, y: 130 },
  { x: 940, y: 250 },
  { x: 1080, y: 280 },
];

const RESOLUTION_DOLLARS: ArrowIcon[] = [
  { x: 920, y: 200 },
  { x: 1040, y: 80 },
  { x: 1140, y: 220 },
];

// Each rail gets a denial packet (left zone) and a resolved packet (right zone).
const RAIL_CONFIGS = RAILS.map((y, i) => ({
  y,
  speed: 0.85 + (i % 3) * 0.12, // slight variation
  offset: (i * 0.27) % 1,
  denialLabel: DENIAL_LABELS[i % DENIAL_LABELS.length],
  resolvedLabel: RESOLVED_LABELS[i % RESOLVED_LABELS.length],
}));

const PACKET_DURATION_MS = 3000;
const RADAR_PERIOD_MS = 6000;
const GLOW_PERIOD_MS = 5000;

const SolutionFlowStream = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [t, setT] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

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
      const e = timestamp - startRef.current;
      setT((e % PACKET_DURATION_MS) / PACKET_DURATION_MS);
      setElapsed(e);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const radarAngle = ((elapsed % RADAR_PERIOD_MS) / RADAR_PERIOD_MS) * 360;
  const glowOpacity =
    0.04 + ((Math.sin((elapsed / 1000) * ((2 * Math.PI) / (GLOW_PERIOD_MS / 1000))) + 1) / 2) * 0.06;

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full opacity-45 pointer-events-none">
      <svg
        viewBox="0 0 1200 340"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Background zones */}
        <rect x={0} y={0} width={380} height={340} fill="#1a0a0a" opacity={0.4} />
        <rect x={380} y={0} width={440} height={340} fill="#0B1628" />
        <rect x={820} y={0} width={380} height={340} fill="#0a1f17" opacity={0.5} />

        {/* LEFT ZONE — denial clouds */}
        {CLOUDS.map((c, i) => (
          <ellipse
            key={i}
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            fill="#EF4444"
            opacity={c.opacity}
          />
        ))}

        {/* LEFT ZONE — broken claim icons */}
        {BROKEN_CLAIMS.map((b, i) => (
          <g key={i} opacity={0.25}>
            <rect
              x={b.x}
              y={b.y}
              width={22}
              height={14}
              rx={1}
              fill="none"
              stroke="#EF4444"
              strokeWidth={1}
            />
            <line
              x1={b.x}
              y1={b.y + 14}
              x2={b.x + 22}
              y2={b.y}
              stroke="#F97316"
              strokeWidth={1}
            />
            {b.label && (
              <text x={b.x + 26} y={b.y + 11} fill="#EF4444" fontSize={8}>
                {b.label}
              </text>
            )}
          </g>
        ))}

        {/* Horizontal data rails */}
        {RAILS.map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={1200}
            y2={y}
            stroke="#1E3A5F"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {/* MIDDLE ZONE — Sentinel radar glow + sweep */}
        <circle cx={600} cy={170} r={80} fill="#10B981" opacity={0.05} />
        <g
          style={{
            transform: `rotate(${radarAngle}deg)`,
            transformOrigin: "600px 170px",
            transformBox: "view-box" as const,
          }}
        >
          <path
            d="M 600 170 L 660 170 A 60 60 0 0 1 630 222 Z"
            fill="#10B981"
            opacity={0.15}
          />
          <line
            x1={600}
            y1={170}
            x2={660}
            y2={170}
            stroke="#10B981"
            strokeWidth={1}
            opacity={0.3}
          />
        </g>
        <rect x={598} y={60} width={3} height={220} fill="#10B981" opacity={0.5} />

        {/* MIDDLE ZONE — primary interception barrier at x=380 */}
        <circle cx={380} cy={170} r={120} fill="#10B981" opacity={0.05} />
        <rect x={378.5} y={20} width={3} height={300} fill="#10B981" opacity={0.6} />

        {/* Animated denial packets (left zone only: -30 → 380) */}
        {RAIL_CONFIGS.map((r, i) => {
          const phase = (t * r.speed + r.offset) % 1;
          const x = -30 + phase * 410;
          return (
            <g key={`den-${i}`} opacity={0.5}>
              <rect
                x={x}
                y={r.y - 5}
                width={28}
                height={10}
                rx={3}
                fill="#EF4444"
              />
              <text
                x={x + 14}
                y={r.y + 2}
                textAnchor="middle"
                fill="#FEE2E2"
                fontSize={7}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {r.denialLabel}
              </text>
            </g>
          );
        })}

        {/* Animated resolved packets (380 → 1200) */}
        {RAIL_CONFIGS.map((r, i) => {
          const phase = (t * r.speed + r.offset + 0.5) % 1;
          const x = 380 + phase * 820;
          return (
            <g key={`res-${i}`} opacity={0.65}>
              <rect
                x={x}
                y={r.y - 5}
                width={r.resolvedLabel.length > 5 ? 56 : 32}
                height={10}
                rx={3}
                fill="#10B981"
                opacity={0.55}
              />
              <text
                x={x + (r.resolvedLabel.length > 5 ? 28 : 16)}
                y={r.y + 2}
                textAnchor="middle"
                fill="#A7F3D0"
                fontSize={7}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {r.resolvedLabel}
              </text>
            </g>
          );
        })}

        {/* RIGHT ZONE — pulsing resolution glow */}
        <defs>
          <radialGradient id="resolutionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={glowOpacity} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={1100} cy={170} r={200} fill="url(#resolutionGlow)" />

        {/* RIGHT ZONE — upward arrows */}
        {RESOLUTION_ARROWS.map((a, i) => (
          <text
            key={`arr-${i}`}
            x={a.x}
            y={a.y}
            fill="#10B981"
            opacity={0.3}
            fontSize={18}
            textAnchor="middle"
          >
            ↑
          </text>
        ))}

        {/* RIGHT ZONE — dollar signs */}
        {RESOLUTION_DOLLARS.map((d, i) => (
          <text
            key={`dol-${i}`}
            x={d.x}
            y={d.y}
            fill="#10B981"
            opacity={0.25}
            fontSize={20}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            $
          </text>
        ))}
      </svg>
    </div>
  );
};

export default SolutionFlowStream;
