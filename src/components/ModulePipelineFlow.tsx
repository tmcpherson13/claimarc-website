/**
 * ModulePipelineFlow — three-cluster ZDefense module map with animated
 * data particles flowing PREDICT → PROTECT → RECOVER.
 *
 * Layout: HTML grid for the cluster boxes (responsive), with an absolutely
 * positioned SVG overlay for connecting arrows and animated particles.
 * On mobile the layout stacks vertically and the SVG arrows hide in favor
 * of vertical flow indicators.
 */

const CLUSTERS = [
  {
    key: "predict",
    label: "PREDICT",
    color: "#F59E0B", // amber
    modules: ["Sentinel", "ContractIntel", "Forecast"],
  },
  {
    key: "protect",
    label: "PROTECT",
    color: "#10B981", // emerald
    modules: ["Shield", "Prevent", "Ledger"],
  },
  {
    key: "recover",
    label: "RECOVER",
    color: "#3B82F6", // blue
    modules: ["Triage", "Evidence", "Resolve"],
  },
];

const ClusterBox = ({
  label,
  color,
  modules,
}: {
  label: string;
  color: string;
  modules: string[];
}) => (
  <div
    className="rounded-xl border-2 bg-[var(--navy)] p-6 flex-1 flex flex-col items-center text-center"
    style={{ borderColor: color }}
  >
    <p
      className="text-sm font-bold tracking-[0.2em] mb-4"
      style={{ color }}
    >
      {label}
    </p>
    <ul className="flex flex-col gap-2 items-center w-full">
      {modules.map((m) => (
        <li
          key={m}
          className="text-base font-semibold bg-slate-800 text-slate-200 px-4 py-1.5 rounded-full text-center"
        >
          {m}
        </li>
      ))}
    </ul>
  </div>
);

const ModulePipelineFlow = () => {
  return (
    <div className="bg-[var(--navy-dk)] rounded-2xl p-8 relative overflow-hidden">
      {/* Desktop: SVG arrow + particle overlay (md+) */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 900 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="pipeline-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
          </marker>
        </defs>

        {/* Arrows: PREDICT(end ~x=300) → PROTECT(start ~x=320), PROTECT(end ~x=600) → RECOVER(start ~x=620) */}
        <line
          x1="305"
          y1="110"
          x2="318"
          y2="110"
          stroke="#64748B"
          strokeWidth="1.5"
          markerEnd="url(#pipeline-arrow)"
        />
        <line
          x1="605"
          y1="110"
          x2="618"
          y2="110"
          stroke="#64748B"
          strokeWidth="1.5"
          markerEnd="url(#pipeline-arrow)"
        />

        {/* Animated particles. Each travels across an entire cluster gap. */}
        {[
          { path: "M 305 110 L 318 110", dur: "3s", begin: "0s" },
          { path: "M 305 110 L 318 110", dur: "4s", begin: "1.4s" },
          { path: "M 605 110 L 618 110", dur: "3.5s", begin: "0.6s" },
          { path: "M 605 110 L 618 110", dur: "5s", begin: "2.2s" },
        ].map((p, i) => (
          <circle key={i} r={3} fill="#10B981" opacity={0.85}>
            <animateMotion
              dur={p.dur}
              begin={p.begin}
              repeatCount="indefinite"
              path={p.path}
            />
          </circle>
        ))}
      </svg>

      {/* Cluster boxes */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {CLUSTERS.map((c, i) => (
          <div key={c.key} className="flex flex-col items-stretch">
            <ClusterBox
              label={c.label}
              color={c.color}
              modules={c.modules}
            />
            {/* Mobile-only down-arrow between clusters */}
            {i < CLUSTERS.length - 1 && (
              <div
                className="md:hidden flex justify-center my-2 text-slate-500"
                aria-hidden="true"
              >
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="14"
                    stroke="#64748B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 3 12 L 8 18 L 13 12"
                    stroke="#64748B"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulePipelineFlow;
