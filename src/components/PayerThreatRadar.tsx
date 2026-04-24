import { useEffect, useRef, useState } from "react";

/**
 * PayerThreatRadar — sweeping SVG radar visualization of payer behavior
 * with a Weaponization Index (WI) callout. Pure SVG + CSS animation
 * (no chart library). Decorative; values illustrative.
 */

type WiLevel = "high" | "med" | "low";

const WI_COLORS: Record<WiLevel, string> = {
  high: "#EF4444",
  med: "#F59E0B",
  low: "#10B981",
};

interface Blip {
  name: string;
  x: number;
  y: number;
  level: WiLevel;
  wi: string;
  delay: string;
}

const BLIPS: Blip[] = [
  { name: "UHC", x: 170, y: 110, level: "high", wi: "2.4x", delay: "0s" },
  { name: "BCBS", x: 370, y: 150, level: "high", wi: "2.1x", delay: "0.3s" },
  { name: "Aetna", x: 410, y: 310, level: "med", wi: "1.7x", delay: "0.6s" },
  { name: "Cigna", x: 290, y: 410, level: "low", wi: "1.3x", delay: "0.9s" },
  { name: "Humana", x: 120, y: 350, level: "low", wi: "1.2x", delay: "1.2s" },
  { name: "Molina", x: 150, y: 190, level: "med", wi: "1.8x", delay: "1.5s" },
];

const WI_ROWS = [
  { name: "UHC", wi: "2.4x", badge: "bg-red-900/60 text-red-400" },
  { name: "BCBS", wi: "2.1x", badge: "bg-amber-900/60 text-amber-400" },
  { name: "Aetna", wi: "1.7x", badge: "bg-slate-700 text-slate-300" },
];

// Inline keyframes — scoped via a <style> tag rendered once with the component.
const RADAR_STYLES = `
@keyframes radarSweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes radarPulse {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}
.radar-sweep-group {
  transform-origin: 250px 250px;
  transform-box: fill-box;
  animation: radarSweep 4s linear infinite;
}
.radar-blip-pulse {
  transform-origin: center;
  transform-box: fill-box;
  animation: radarPulse 2s ease-out infinite;
}
`;

const PayerThreatRadar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16 border-t border-b border-slate-800">
      <style>{RADAR_STYLES}</style>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT COLUMN — text + WI callout */}
        <div>
          <p className="text-[var(--amber)] text-xs uppercase tracking-widest font-semibold">
            Sentinel — Payer Threat Intelligence
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Not all payers behave the same way.
          </h2>
          <p className="text-slate-400 text-base mt-4 max-w-md">
            ZDefense Sentinel monitors behavioral patterns across every major
            commercial payer in real time — detecting shifts in denial
            strategy before they impact your revenue.
          </p>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mt-6 max-w-md">
            <p className="text-[var(--amber)] text-[10px] uppercase tracking-widest font-semibold">
              Payer Weaponization Index (WI)
            </p>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              A multiplier measuring how aggressively a payer is behaving
              relative to their own 90-day baseline. A WI above 2.0x signals
              a systematic strategy shift — not random variation. At 2.4x,
              UHC is actively weaponizing denial logic against this provider.
            </p>
            <ul className="mt-4">
              {WI_ROWS.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0"
                >
                  <span className="text-slate-300 text-sm">{row.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${row.badge}`}
                  >
                    {row.wi}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN — sweeping radar */}
        <div
          ref={ref}
          className={`max-w-[480px] mx-auto w-full transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <svg
            viewBox="0 0 500 500"
            className="w-full h-auto"
            aria-hidden="true"
          >
            {/* Dark backing circle */}
            <circle
              cx={250}
              cy={250}
              r={215}
              fill="#0F172A"
              stroke="#1E3A5F"
              strokeWidth={1}
            />

            {/* Concentric rings */}
            {[60, 110, 160, 210].map((r) => (
              <circle
                key={r}
                cx={250}
                cy={250}
                r={r}
                fill="none"
                stroke="#1E3A5F"
                strokeWidth={1}
                opacity={0.8}
              />
            ))}

            {/* Crosshairs */}
            <line
              x1={40}
              y1={250}
              x2={460}
              y2={250}
              stroke="#1E3A5F"
              strokeWidth={0.5}
              opacity={0.5}
            />
            <line
              x1={250}
              y1={40}
              x2={250}
              y2={460}
              stroke="#1E3A5F"
              strokeWidth={0.5}
              opacity={0.5}
            />

            {/* Compass labels */}
            <text x={250} y={32} textAnchor="middle" fill="#475569" fontSize={10}>
              0°
            </text>
            <text x={470} y={254} textAnchor="middle" fill="#475569" fontSize={10}>
              90°
            </text>
            <text x={250} y={478} textAnchor="middle" fill="#475569" fontSize={10}>
              180°
            </text>
            <text x={28} y={254} textAnchor="middle" fill="#475569" fontSize={10}>
              270°
            </text>

            {/* Sweep group: arm + trailing pie wedge, rotates as one */}
            <g className="radar-sweep-group">
              {/* Trailing wedge — 60° arc behind the arm.
                  Arm points up (north). Wedge spans from 300° to 360° (i.e.
                  the 60° immediately counter-clockwise of the arm). */}
              <defs>
                <radialGradient id="radar-trail" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.0} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.18} />
                </radialGradient>
              </defs>
              {/* Pie slice path: from center, out to (250, 40) [arm tip],
                  arc clockwise-back to point at angle 300° from center, back to center.
                  Point at 300° from north (i.e. -60° rotation): 
                  x = 250 + 210*sin(-60°) = 250 - 181.87 = 68.13
                  y = 250 - 210*cos(-60°) = 250 - 105 = 145 */}
              <path
                d="M 250 250 L 250 40 A 210 210 0 0 0 68.13 145 Z"
                fill="url(#radar-trail)"
              />
              {/* Sweep arm */}
              <line
                x1={250}
                y1={250}
                x2={250}
                y2={40}
                stroke="#10B981"
                strokeWidth={2}
                opacity={0.9}
              />
            </g>

            {/* Payer blips */}
            {BLIPS.map((b) => {
              const color = WI_COLORS[b.level];
              const labelX = b.x + 12;
              const labelY = b.y - 8;
              return (
                <g key={b.name}>
                  {/* Pulse ring */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={10}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    className="radar-blip-pulse"
                    style={{ animationDelay: b.delay }}
                  />
                  {/* Inner dot */}
                  <circle cx={b.x} cy={b.y} r={4} fill={color} opacity={0.9} />
                  {/* Label */}
                  <text x={labelX} y={labelY} fill="#94A3B8" fontSize={9}>
                    {b.name}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + 10}
                    fill={color}
                    fontSize={8}
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {b.wi}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PayerThreatRadar;
