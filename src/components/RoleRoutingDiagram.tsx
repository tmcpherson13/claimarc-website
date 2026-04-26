import { useEffect, useRef, useState } from "react";

/**
 * RoleRoutingDiagram — two-column SVG showing how each role maps to its
 * default ZDefense module on first login. Lines draw in sequentially when
 * the diagram scrolls into view; hovering a role highlights its line and
 * pulses the target module.
 */

type ClusterKey = "predict" | "protect" | "recover";

const CLUSTER_COLOR: Record<ClusterKey, string> = {
  predict: "#F59E0B",
  protect: "#10B981",
  recover: "#3B82F6",
};

const ROLES = [
  { key: "cfo", label: "CFO / Executive", target: "forecast" },
  { key: "director", label: "Rev Cycle Director", target: "ledger" },
  { key: "manager", label: "Revenue Cycle Manager", target: "shield" },
  { key: "billing", label: "Billing Specialist", target: "triage" },
  { key: "denial", label: "Denial Coordinator", target: "triage" },
  { key: "compliance", label: "Auditor/Compliance Officer", target: "ledger" },
  { key: "audit", label: "Internal Audit", target: "ledger" },
] as const;

const MODULES: { key: string; label: string; cluster: ClusterKey }[] = [
  { key: "sentinel", label: "Sentinel", cluster: "predict" },
  { key: "forecast", label: "Forecast", cluster: "predict" },
  { key: "shield", label: "Shield", cluster: "protect" },
  { key: "ledger", label: "Ledger", cluster: "protect" },
  { key: "triage", label: "Triage", cluster: "recover" },
];

// SVG layout constants
const SVG_W = 800;
const ROW_H = 56;
const TOP_PAD = 20;
const ROLE_X_END = 230; // right edge of role column
const MODULE_X_START = 570; // left edge of module column

// Module Y positions — distribute evenly down the right column
const moduleYs: Record<string, number> = {};
MODULES.forEach((m, i) => {
  moduleYs[m.key] = TOP_PAD + ROW_H * (i + 0.5) + (ROLES.length - MODULES.length) * ROW_H * 0.5;
});

const RoleRoutingDiagram = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hoverRole, setHoverRole] = useState<string | null>(null);

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
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const svgH = TOP_PAD * 2 + ROW_H * ROLES.length;

  const hoverTarget = hoverRole
    ? ROLES.find((r) => r.key === hoverRole)?.target
    : null;

  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[var(--navy)] text-3xl font-bold">
            Every role lands where it matters most.
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            ZDefense routes each user to their default module on first login —
            automatically, based on role.
          </p>
        </div>

        <div ref={ref} className="relative">
          <svg
            viewBox={`0 0 ${SVG_W} ${svgH}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Connection lines */}
            {ROLES.map((role, i) => {
              const y1 = TOP_PAD + ROW_H * (i + 0.5);
              const y2 = moduleYs[role.target];
              const x1 = ROLE_X_END;
              const x2 = MODULE_X_START;
              // Curved path: horizontal then bezier
              const midX = (x1 + x2) / 2;
              const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
              const isHover = hoverRole === role.key;
              const isSharedTarget =
                hoverTarget && role.target === hoverTarget && !isHover;
              const stroke = isHover
                ? "#10B981"
                : isSharedTarget
                ? "#10B98166"
                : "#1E3A5F";
              const strokeWidth = isHover ? 2 : 1;
              // Sequential draw: each line gets a delay
              const drawDelay = i * 150;
              return (
                <path
                  key={role.key}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray="600"
                  strokeDashoffset={visible ? 0 : 600}
                  style={{
                    transition: `stroke-dashoffset 800ms ease-out ${drawDelay}ms, stroke 200ms ease, stroke-width 200ms ease`,
                  }}
                />
              );
            })}
          </svg>

          {/* HTML overlay: role pills (left) and module pills (right) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Role column */}
            <div
              className="absolute left-0 top-0 h-full"
              style={{ width: `${(ROLE_X_END / SVG_W) * 100}%` }}
            >
              {ROLES.map((role, i) => {
                const topPct =
                  ((TOP_PAD + ROW_H * (i + 0.5)) / svgH) * 100;
                return (
                  <div
                    key={role.key}
                    className="absolute right-2 -translate-y-1/2 pointer-events-auto"
                    style={{ top: `${topPct}%` }}
                    onMouseEnter={() => setHoverRole(role.key)}
                    onMouseLeave={() => setHoverRole(null)}
                  >
                    <span
                      className={`block bg-slate-800 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-default transition-colors ${
                        hoverRole === role.key
                          ? "ring-2 ring-[var(--emerald)]"
                          : ""
                      }`}
                    >
                      {role.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Module column */}
            <div
              className="absolute top-0 h-full"
              style={{
                left: `${(MODULE_X_START / SVG_W) * 100}%`,
                right: 0,
              }}
            >
              {MODULES.map((m) => {
                const topPct = (moduleYs[m.key] / svgH) * 100;
                const color = CLUSTER_COLOR[m.cluster];
                const isPulse = hoverTarget === m.key;
                return (
                  <div
                    key={m.key}
                    className="absolute left-2 -translate-y-1/2"
                    style={{ top: `${topPct}%` }}
                  >
                    <span
                      className={`inline-block text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap border-2 ${
                        isPulse ? "animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: color,
                        color,
                        backgroundColor: `${color}1A`,
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cluster legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-xs">
          {(Object.keys(CLUSTER_COLOR) as ClusterKey[]).map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 text-slate-600 uppercase tracking-wider"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CLUSTER_COLOR[c] }}
              />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleRoutingDiagram;
