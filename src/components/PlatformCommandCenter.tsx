import { useEffect, useRef, useState } from "react";

/**
 * PlatformCommandCenter — full-width animated SVG visualization for the
 * Platform page hero background. Three clusters (Predict / Protect / Recover)
 * with continuously traveling data packets along connection lines.
 * Pure SVG + React hooks. Decorative; values illustrative.
 */

interface NodeDef {
  id: string;
  name: string;
  x: number;
  y: number;
  cluster: "predict" | "protect" | "recover";
}

const NODES: NodeDef[] = [
  // PREDICT — left cluster
  { id: "sentinel", name: "Sentinel", x: 150, y: 130, cluster: "predict" },
  { id: "contractintel", name: "ContractIntel", x: 100, y: 220, cluster: "predict" },
  { id: "forecast", name: "Forecast", x: 200, y: 280, cluster: "predict" },
  // PROTECT — center cluster
  { id: "shield", name: "Shield", x: 560, y: 130, cluster: "protect" },
  { id: "prevent", name: "Prevent", x: 500, y: 240, cluster: "protect" },
  { id: "ledger", name: "Ledger", x: 620, y: 290, cluster: "protect" },
  // RECOVER — right cluster
  { id: "triage", name: "Triage", x: 970, y: 130, cluster: "recover" },
  { id: "evidence", name: "Evidence", x: 1050, y: 230, cluster: "recover" },
  { id: "resolve", name: "Resolve", x: 940, y: 290, cluster: "recover" },
];

const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

interface ClusterDef {
  key: "predict" | "protect" | "recover";
  label: string;
  cx: number;
  cy: number;
  r: number;
  labelY: number;
  phase: number;
}

const CLUSTERS: ClusterDef[] = [
  { key: "predict", label: "PREDICT", cx: 150, cy: 210, r: 140, labelY: 60, phase: 0 },
  { key: "protect", label: "PROTECT", cx: 560, cy: 220, r: 140, labelY: 60, phase: 1.2 },
  { key: "recover", label: "RECOVER", cx: 985, cy: 220, r: 140, labelY: 60, phase: 2.4 },
];

interface Edge {
  from: string;
  to: string;
}

const EDGES: Edge[] = [
  // PREDICT internal
  { from: "sentinel", to: "contractintel" },
  { from: "contractintel", to: "forecast" },
  { from: "sentinel", to: "forecast" },
  // PROTECT internal
  { from: "shield", to: "prevent" },
  { from: "prevent", to: "ledger" },
  { from: "shield", to: "ledger" },
  // RECOVER internal
  { from: "triage", to: "evidence" },
  { from: "evidence", to: "resolve" },
  { from: "triage", to: "resolve" },
  // Predict → Protect
  { from: "sentinel", to: "shield" },
  { from: "forecast", to: "prevent" },
  { from: "contractintel", to: "ledger" },
  // Protect → Recover
  { from: "shield", to: "triage" },
  { from: "prevent", to: "evidence" },
  { from: "ledger", to: "resolve" },
];

const PACKET_LABELS = ["CO-50", "$1.2K", "CO-16", "$3.4K", "CO-97", "$890"];

interface Packet {
  edgeIndex: number;
  label: string;
  offset: number; // 0..1 phase offset
}

// Build packet list — only on cross-cluster edges (left → right flow),
// staggered so multiple are always visible.
const PACKETS: Packet[] = (() => {
  const crossEdges: number[] = [];
  EDGES.forEach((e, i) => {
    const a = nodeById(e.from).cluster;
    const b = nodeById(e.to).cluster;
    if (a !== b) crossEdges.push(i);
  });
  const list: Packet[] = [];
  crossEdges.forEach((edgeIndex, i) => {
    // 2 packets per cross edge, staggered
    list.push({
      edgeIndex,
      label: PACKET_LABELS[(i * 2) % PACKET_LABELS.length],
      offset: (i * 0.17) % 1,
    });
    list.push({
      edgeIndex,
      label: PACKET_LABELS[(i * 2 + 1) % PACKET_LABELS.length],
      offset: ((i * 0.17) + 0.5) % 1,
    });
  });
  return list;
})();

const PACKET_DURATION_MS = 4000;
const CLUSTER_PULSE_MS = 5000;

const PlatformCommandCenter = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [t, setT] = useState(0); // packet phase 0..1
  const [pulseT, setPulseT] = useState(0); // cluster pulse seconds elapsed
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
      const elapsed = timestamp - startRef.current;
      setT((elapsed % PACKET_DURATION_MS) / PACKET_DURATION_MS);
      setPulseT(elapsed / 1000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full pointer-events-none">
      <svg
        viewBox="0 0 1200 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        opacity={0.5}
        aria-hidden="true"
      >
        <rect x={0} y={0} width={1200} height={400} fill="#0B1628" />

        {/* Cluster glows */}
        {CLUSTERS.map((c) => {
          const pulse =
            0.04 +
            ((Math.sin((pulseT * (2 * Math.PI)) / (CLUSTER_PULSE_MS / 1000) + c.phase) + 1) / 2) *
              0.06;
          return (
            <g key={c.key}>
              <defs>
                <radialGradient id={`glow-${c.key}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={pulse} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </radialGradient>
              </defs>
              <circle cx={c.cx} cy={c.cy} r={c.r} fill={`url(#glow-${c.key})`} />
              <text
                x={c.cx}
                y={c.labelY}
                textAnchor="middle"
                fill="#475569"
                fontSize={11}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                letterSpacing={3}
              >
                {c.label}
              </text>
            </g>
          );
        })}

        {/* Connection lines */}
        {EDGES.map((e, i) => {
          const a = nodeById(e.from);
          const b = nodeById(e.to);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#1E3A5F"
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}

        {/* Data packets */}
        {PACKETS.map((p, i) => {
          const e = EDGES[p.edgeIndex];
          const a = nodeById(e.from);
          const b = nodeById(e.to);
          const phase = (t + p.offset) % 1;
          const x = a.x + (b.x - a.x) * phase - 16;
          const y = a.y + (b.y - a.y) * phase - 6;
          return (
            <g key={i} opacity={0.7}>
              <rect
                x={x}
                y={y}
                width={32}
                height={12}
                rx={2}
                fill="#10B981"
                fillOpacity={0.18}
                stroke="#10B981"
                strokeOpacity={0.7}
                strokeWidth={0.6}
              />
              <text
                x={x + 16}
                y={y + 9}
                textAnchor="middle"
                fill="#A7F3D0"
                fontSize={7}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const nodePulse =
            0.55 +
            ((Math.sin(pulseT * 1.6 + n.x * 0.01) + 1) / 2) * 0.45;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={14}
                fill="#10B981"
                opacity={nodePulse * 0.18}
              />
              <circle cx={n.x} cy={n.y} r={6} fill="#10B981" opacity={nodePulse} />
              <text
                x={n.x}
                y={n.y + 22}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize={9}
                fontFamily="ui-sans-serif, system-ui"
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PlatformCommandCenter;
