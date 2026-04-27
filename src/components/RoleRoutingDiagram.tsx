import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * RoleRoutingDiagram — two-column SVG showing how each role maps to its
 * related ZDefense modules. Lines draw in sequentially when the diagram
 * scrolls into view; hovering or focusing a role highlights its lines and
 * pulses the target modules. Roles and modules are keyboard-navigable.
 */

type ClusterKey = "predict" | "protect" | "recover";

const CLUSTER_COLOR: Record<ClusterKey, string> = {
  predict: "#F59E0B",
  protect: "#10B981",
  recover: "#3B82F6",
};

const MODULE_CLUSTERS = [
  {
    key: "predict" as ClusterKey,
    label: "PREDICT",
    modules: [
      { key: "sentinel", label: "Sentinel" },
      { key: "contractintel", label: "ContractIntel" },
      { key: "forecast", label: "Forecast" },
    ],
  },
  {
    key: "protect" as ClusterKey,
    label: "PROTECT",
    modules: [
      { key: "shield", label: "Shield" },
      { key: "prevent", label: "Prevent" },
      { key: "ledger", label: "Ledger" },
    ],
  },
  {
    key: "recover" as ClusterKey,
    label: "RECOVER",
    modules: [
      { key: "triage", label: "Triage" },
      { key: "evidence", label: "Evidence" },
      { key: "resolve", label: "Resolve" },
    ],
  },
];

const MODULES = MODULE_CLUSTERS.flatMap((c) =>
  c.modules.map((m) => ({ ...m, cluster: c.key }))
);

const ROLES = [
  { key: "cfo", label: "CFO / Executive", targets: ["forecast", "contractintel", "sentinel"], hint: "90-day revenue visibility" },
  { key: "director", label: "Rev Cycle Director", targets: ["ledger", "forecast", "sentinel"], hint: "Underpayment and compliance oversight" },
  { key: "manager", label: "Revenue Cycle Manager", targets: ["shield", "prevent", "triage"], hint: "Stop denials before submission" },
  { key: "billing", label: "Billing Specialist", targets: ["triage", "evidence", "resolve"], hint: "Work the claims most likely to pay" },
  { key: "compliance", label: "Auditor/Compliance Officer", targets: ["ledger", "shield"], hint: "Medicare 60-day rule enforcement" },
] as const;

// SVG layout constants
const SVG_W = 900;
const ROW_H = 52;
const TOP_PAD = 20;
const ROLE_X_END = 250;
const MODULE_X_START = 620;

const svgH = TOP_PAD * 2 + ROW_H * Math.max(ROLES.length, MODULES.length);

// Role Y positions — distribute across full svg height
const roleYs: Record<string, number> = {};
ROLES.forEach((r, i) => {
  const offset = (MODULES.length - ROLES.length) * ROW_H * 0.5;
  roleYs[r.key] = TOP_PAD + ROW_H * (i + 0.5) + Math.max(0, offset);
});

// Module Y positions — distribute all modules evenly
const moduleYs: Record<string, number> = {};
MODULES.forEach((m, i) => {
  const offset = (ROLES.length - MODULES.length) * ROW_H * 0.5;
  moduleYs[m.key] = TOP_PAD + ROW_H * (i + 0.5) + Math.max(0, offset);
});

// Precompute static path data once (does not depend on hover state).
const PATHS = ROLES.flatMap((role, ri) =>
  role.targets
    .map((target, ti) => {
      const y1 = roleYs[role.key];
      const y2 = moduleYs[target];
      if (y2 === undefined) return null;
      const midX = (ROLE_X_END + MODULE_X_START) / 2;
      const d = `M ${ROLE_X_END} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${MODULE_X_START} ${y2}`;
      return {
        id: `${role.key}-${target}`,
        roleKey: role.key,
        target,
        d,
        isPrimary: ti === 0,
        drawDelay: ri * 150 + ti * 60,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
);

const scrollToModule = (key: string) => {
  const el = document.getElementById(key);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const RoleRoutingDiagram = () => {
  const navigate = useNavigate();
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

  const hoverTargets = useMemo(
    () =>
      hoverRole
        ? ROLES.find((r) => r.key === hoverRole)?.targets ?? []
        : [],
    [hoverRole]
  );

  const handleRoleKey = (e: KeyboardEvent<HTMLDivElement>, roleKey: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/solutions?role=${roleKey}`);
    }
  };

  const handleModuleKey = (e: KeyboardEvent<HTMLDivElement>, moduleKey: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToModule(moduleKey);
    }
  };

  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[var(--navy)] text-3xl font-bold">
            Every role lands where it matters most.
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Hover a role to see which modules it touches. Click to explore yours.
          </p>
        </div>

        <div ref={ref} className="relative">
          <svg
            viewBox={`0 0 ${SVG_W} ${svgH}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            style={{ willChange: "contents" }}
          >
            {/* Connection lines — one per (role, target) pair.
                Hover state is applied via CSS attribute selectors so we don't
                re-render every path on hover changes. */}
            <g
              data-hover-role={hoverRole ?? ""}
              className="rrd-paths"
            >
              {PATHS.map((p) => (
                <path
                  key={p.id}
                  d={p.d}
                  fill="none"
                  data-role={p.roleKey}
                  data-primary={p.isPrimary ? "1" : "0"}
                  className="rrd-path"
                  strokeDasharray="600"
                  strokeDashoffset={visible ? 0 : 600}
                  style={{
                    transition: `stroke-dashoffset 800ms ease-out ${p.drawDelay}ms, stroke 120ms linear, stroke-width 120ms linear, stroke-opacity 120ms linear`,
                  }}
                />
              ))}
            </g>
          </svg>

          {/* Inline styles for fast attribute-driven hover transitions */}
          <style>{`
            .rrd-path { stroke: #1E3A5F; stroke-width: 1; stroke-opacity: 1; }
            .rrd-path[data-primary="0"] { stroke-width: 0.75; stroke-opacity: 0.35; }
            .rrd-paths[data-hover-role=""] .rrd-path { /* default */ }
            .rrd-paths:not([data-hover-role=""]) .rrd-path { stroke-opacity: 0.08; stroke-width: 0.75; }
            .rrd-paths .rrd-path[data-role=""][data-primary] { /* noop */ }
            ${ROLES.map(
              (r) => `.rrd-paths[data-hover-role="${r.key}"] .rrd-path[data-role="${r.key}"] { stroke: #10B981; stroke-width: 2; stroke-opacity: 1; }`
            ).join("\n")}
          `}</style>

          {/* HTML overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Role column */}
            <div
              className="absolute left-0 top-0 h-full"
              style={{ width: `${(ROLE_X_END / SVG_W) * 100}%` }}
              role="list"
              aria-label="Roles"
            >
              {ROLES.map((role) => {
                const topPct = (roleYs[role.key] / svgH) * 100;
                const isHover = hoverRole === role.key;
                const tooltipBelow = roleYs[role.key] < svgH / 2;
                const targetLabels = role.targets
                  .map((t) => MODULES.find((m) => m.key === t)?.label)
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div
                    key={role.key}
                    className="absolute right-2 -translate-y-1/2 pointer-events-auto group"
                    style={{ top: `${topPct}%` }}
                    role="listitem"
                  >
                    <div
                      role="link"
                      tabIndex={0}
                      aria-label={`${role.label}: explore solutions for this role. Touches modules: ${targetLabels}.`}
                      onMouseEnter={() => setHoverRole(role.key)}
                      onMouseLeave={() => setHoverRole(null)}
                      onFocus={() => setHoverRole(role.key)}
                      onBlur={() => setHoverRole(null)}
                      onClick={() => navigate(`/solutions?role=${role.key}`)}
                      onKeyDown={(e) => handleRoleKey(e, role.key)}
                      className="inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-shadow duration-100 hover:ring-2 hover:ring-[var(--emerald)] hover:ring-offset-1 ${
                          isHover ? "ring-2 ring-[var(--emerald)] ring-offset-1" : ""
                        }`}
                      >
                        {role.label}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--emerald)]" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </div>

                    {/* Tooltip */}
                    <div
                      role="tooltip"
                      className={`absolute left-1/2 -translate-x-1/2 ${
                        tooltipBelow ? "top-full mt-2" : "bottom-full mb-2"
                      } bg-[var(--navy)] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-100 ${
                        isHover ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {role.hint}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cluster layer labels */}
            {MODULE_CLUSTERS.map((cluster) => {
              const ys = cluster.modules
                .map((m) => moduleYs[m.key])
                .filter((y) => y !== undefined);
              if (ys.length === 0) return null;
              const minY = Math.min(...ys);
              const topPct = ((minY - ROW_H * 0.55) / svgH) * 100;
              const leftPct = ((MODULE_X_START + 8) / SVG_W) * 100;
              const color = CLUSTER_COLOR[cluster.key];
              return (
                <div
                  key={`label-${cluster.key}`}
                  className="absolute"
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  aria-hidden="true"
                >
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {cluster.label}
                  </span>
                </div>
              );
            })}

            {/* Module column */}
            <div
              className="absolute top-0 h-full pointer-events-auto"
              style={{
                left: `${(MODULE_X_START / SVG_W) * 100}%`,
                right: 0,
              }}
              role="list"
              aria-label="Modules"
            >
              {MODULES.map((m) => {
                const topPct = (moduleYs[m.key] / svgH) * 100;
                const color = CLUSTER_COLOR[m.cluster];
                const isPulse = hoverTargets.includes(m.key);
                return (
                  <div
                    key={m.key}
                    className="absolute left-2 -translate-y-1/2"
                    style={{ top: `${topPct}%` }}
                    role="listitem"
                  >
                    <div
                      role="link"
                      tabIndex={0}
                      aria-label={`${m.label} module — jump to details in the ${m.cluster} layer.`}
                      onClick={() => scrollToModule(m.key)}
                      onKeyDown={(e) => handleModuleKey(e, m.key)}
                      className="inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`inline-block text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap border-2 cursor-pointer hover:opacity-90 transition-opacity ${
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
