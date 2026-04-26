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
  onSelect,
}: {
  label: string;
  color: string;
  modules: string[];
  onSelect?: (name: string) => void;
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
        <li key={m} className="w-full flex justify-center">
          <button
            type="button"
            onClick={() => onSelect?.(m)}
            className="text-base font-semibold bg-slate-800 text-slate-200 px-4 py-1.5 rounded-full text-center transition-all hover:bg-slate-700 hover:text-white hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)] cursor-pointer"
            style={{
              boxShadow: `inset 0 0 0 1px ${color}33`,
            }}
            aria-label={`Open ${m} module details`}
          >
            {m}
          </button>
        </li>
      ))}
    </ul>
    <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest">
      Click a module
    </p>
  </div>
);

const ModulePipelineFlow = ({
  onSelect,
}: {
  onSelect?: (name: string) => void;
}) => {
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

        {/* Connecting line spanning all three clusters */}
        <line
          x1="20"
          y1="110"
          x2="880"
          y2="110"
          stroke="#1E3A5F"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Long arrows spanning each cluster gap */}
        <line
          x1="270"
          y1="110"
          x2="345"
          y2="110"
          stroke="#64748B"
          strokeWidth="2"
          markerEnd="url(#pipeline-arrow)"
        />
        <line
          x1="570"
          y1="110"
          x2="645"
          y2="110"
          stroke="#64748B"
          strokeWidth="2"
          markerEnd="url(#pipeline-arrow)"
        />

        {/* Animated particles travel the full pipeline, connecting all boxes. */}
        {[
          { dur: "6s", begin: "0s" },
          { dur: "6s", begin: "1.5s" },
          { dur: "6s", begin: "3s" },
          { dur: "6s", begin: "4.5s" },
        ].map((p, i) => (
          <circle key={i} r={3.5} fill="#10B981" opacity={0.9}>
            <animateMotion
              dur={p.dur}
              begin={p.begin}
              repeatCount="indefinite"
              path="M 20 110 L 880 110"
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
              onSelect={onSelect}
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
