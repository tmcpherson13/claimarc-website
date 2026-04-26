import { useEffect, useMemo, useRef, useState } from "react";

/**
 * DefenseNexusFlow — architectural infrastructure diagram showing
 * 11 public data sources flowing through the Defense Nexus into the
 * 9 ZDefense modules. Pure SVG + React hooks. Decorative but data-rich.
 */

type Layer = "predict" | "protect" | "recover";

const LAYER_COLOR: Record<Layer, string> = {
  predict: "#06B6D4",
  protect: "#10B981",
  recover: "#8B5CF6",
};

interface Source {
  name: string;
}

const SOURCES: Source[] = [
  { name: "HPT MRFs (5,400+ hospitals)" },
  { name: "TiC MRFs (7 payers)" },
  { name: "CMS Physician Fee Schedule" },
  { name: "CMS OPPS" },
  { name: "CMS Bulk / NPI Registry" },
  { name: "NCCI Edits" },
  { name: "CARC/RARC Codes" },
  { name: "NCD/LCD Policies" },
  { name: "MAC CR Bulletins" },
  { name: "Commercial Payer Policies" },
  { name: "ICD-10 Code Reference" },
];

interface ModuleDef {
  name: string;
  layer: Layer;
}

const MODULES: ModuleDef[] = [
  { name: "Sentinel", layer: "predict" },
  { name: "ContractIntel", layer: "predict" },
  { name: "Forecast", layer: "predict" },
  { name: "Shield", layer: "protect" },
  { name: "Prevent", layer: "protect" },
  { name: "Ledger", layer: "protect" },
  { name: "Triage", layer: "recover" },
  { name: "Evidence", layer: "recover" },
  { name: "Resolve", layer: "recover" },
];

// Source-index → list of consuming module names.
const SOURCE_TO_MODULES: Record<number, string[]> = {
  0: ["ContractIntel", "Forecast"],
  1: ["ContractIntel", "Forecast"],
  2: ["ContractIntel"],
  3: ["ContractIntel"],
  4: ["ContractIntel", "Ledger", "Forecast"],
  5: ["Shield"],
  6: ["Triage", "Evidence", "Shield"],
  7: ["Shield", "Prevent"],
  8: ["Shield"],
  9: ["Prevent", "Sentinel"],
  10: ["Triage", "Evidence"],
};

// Layout constants
const SRC_X = 40;
const SRC_W = 160;
const SRC_H = 22;
const SRC_RIGHT = SRC_X + SRC_W;
const NEXUS_IN_X = 410;
const NEXUS_OUT_X = 430;
const NEXUS_X = 420;
const MOD_X = 580;
const MOD_W = 140;
const MOD_H = 26;

const sourceY = (i: number) => {
  const top = 30;
  const bot = 390;
  return top + ((bot - top) / (SOURCES.length - 1)) * i + SRC_H / 2;
};
const moduleY = (i: number) => {
  const top = 42;
  const bot = 378;
  return top + ((bot - top) / (MODULES.length - 1)) * i + MOD_H / 2;
};

const PACKET_DURATION_MS = 2500;
const FLASH_MS = 400;

interface Edge {
  sourceIdx: number;
  moduleIdx: number;
}

const EDGES: Edge[] = (() => {
  const out: Edge[] = [];
  Object.entries(SOURCE_TO_MODULES).forEach(([sIdx, names]) => {
    const si = Number(sIdx);
    names.forEach((name) => {
      const mi = MODULES.findIndex((m) => m.name === name);
      if (mi >= 0) out.push({ sourceIdx: si, moduleIdx: mi });
    });
  });
  return out;
})();

interface Packet {
  edgeIdx: number;
  start: number;
}

const DefenseNexusFlow = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const packets = useMemo<Packet[]>(() => {
    const list: Packet[] = [];
    const inFlight = 5;
    const spacing = PACKET_DURATION_MS / inFlight;
    const cycle = 60;
    for (let i = 0; i < cycle; i++) {
      list.push({
        edgeIdx: i % EDGES.length,
        start: i * spacing,
      });
    }
    return list;
  }, []);
  const cycleLen = packets.length * (PACKET_DURATION_MS / 5);

  const lastArrivalRef = useRef<number[]>(MODULES.map(() => -Infinity));
  const seenPacketRef = useRef<boolean[]>(packets.map(() => false));

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

      packets.forEach((p, i) => {
        const tRaw = (elapsed - p.start) % cycleLen;
        const local = tRaw < 0 ? tRaw + cycleLen : tRaw;
        const inWindow = local >= 0 && local <= PACKET_DURATION_MS;
        const arrived = inWindow && local >= PACKET_DURATION_MS - 16;
        if (arrived && !seenPacketRef.current[i]) {
          seenPacketRef.current[i] = true;
          lastArrivalRef.current[EDGES[p.edgeIdx].moduleIdx] = elapsed;
        } else if (!inWindow) {
          seenPacketRef.current[i] = false;
        }
      });

      setTick((n) => (n + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, packets, cycleLen]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;

  const nexusGlow =
    0.03 + (Math.sin((elapsed / 1000) * ((2 * Math.PI) / 4)) + 1) / 2 * 0.04;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1100 420"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x={0} y={0} width={1100} height={420} fill="#0B1628" />

        <circle
          cx={NEXUS_X}
          cy={210}
          r={80}
          fill="#10B981"
          opacity={nexusGlow}
        />

        {SOURCES.map((_, i) => {
          const y = sourceY(i);
          return (
            <line
              key={`src-line-${i}`}
              x1={SRC_RIGHT}
              y1={y}
              x2={NEXUS_IN_X}
              y2={210}
              stroke="#1E3A5F"
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}

        {EDGES.map((e, i) => {
          const my = moduleY(e.moduleIdx);
          return (
            <line
              key={`edge-line-${i}`}
              x1={NEXUS_OUT_X}
              y1={210}
              x2={MOD_X}
              y2={my}
              stroke="#1E3A5F"
              strokeWidth={1}
              opacity={0.35}
            />
          );
        })}

        {SOURCES.map((s, i) => {
          const y = sourceY(i) - SRC_H / 2;
          return (
            <g key={`src-${i}`}>
              <rect
                x={SRC_X}
                y={y}
                width={SRC_W}
                height={SRC_H}
                rx={4}
                fill="#0F172A"
                stroke="#1E3A5F"
                strokeWidth={1}
              />
              <text
                x={SRC_X + SRC_W / 2}
                y={y + SRC_H / 2 + 2.5}
                textAnchor="middle"
                fill="#64748B"
                fontSize={7}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {s.name}
              </text>
            </g>
          );
        })}

        {MODULES.map((m, i) => {
          const y = moduleY(i) - MOD_H / 2;
          const baseStroke = LAYER_COLOR[m.layer];
          const lastHit = lastArrivalRef.current[i];
          const since = elapsed - lastHit;
          const flashing = since >= 0 && since < FLASH_MS;
          const t = flashing ? since / FLASH_MS : 1;
          const strokeWidth = flashing ? 2 + (1 - t) * 1.5 : 1.25;
          const strokeOpacity = flashing ? 1 : 0.75;
          return (
            <g key={`mod-${i}`}>
              <rect
                x={MOD_X}
                y={y}
                width={MOD_W}
                height={MOD_H}
                rx={4}
                fill="#0C1F35"
                stroke={baseStroke}
                strokeWidth={strokeWidth}
                opacity={strokeOpacity}
              />
              <text
                x={MOD_X + MOD_W / 2}
                y={y + MOD_H / 2 + 3}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize={8}
              >
                {m.name}
              </text>
            </g>
          );
        })}

        <text
          x={NEXUS_X}
          y={210}
          textAnchor="middle"
          fill="#10B981"
          fontSize={14}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.6}
          letterSpacing={3}
          transform={`rotate(-90 ${NEXUS_X} 210)`}
        >
          DEFENSE NEXUS
        </text>

        {packets.map((p, i) => {
          const tRaw = (elapsed - p.start) % cycleLen;
          const local = tRaw < 0 ? tRaw + cycleLen : tRaw;
          if (local < 0 || local > PACKET_DURATION_MS) return null;
          const t = local / PACKET_DURATION_MS;
          const edge = EDGES[p.edgeIdx];
          const sy = sourceY(edge.sourceIdx);
          const my = moduleY(edge.moduleIdx);
          let x: number, y: number;
          if (t < 0.5) {
            const k = t / 0.5;
            x = SRC_RIGHT + (NEXUS_X - SRC_RIGHT) * k;
            y = sy + (210 - sy) * k;
          } else {
            const k = (t - 0.5) / 0.5;
            x = NEXUS_X + (MOD_X - NEXUS_X) * k;
            y = 210 + (my - 210) * k;
          }
          const color = LAYER_COLOR[MODULES[edge.moduleIdx].layer];
          return (
            <circle
              key={`pkt-${i}`}
              cx={x}
              cy={y}
              r={3}
              fill={color}
              opacity={0.7}
            />
          );
        })}

        <g>
          <rect
            x={550 - 80}
            y={400 - 10}
            width={160}
            height={20}
            rx={10}
            fill="#021A0F"
            stroke="#10B981"
            strokeWidth={1}
          />
          <text
            x={550}
            y={400 + 3}
            textAnchor="middle"
            fill="#10B981"
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            letterSpacing={1}
          >
            NO PHI · PUBLIC DATA ONLY
          </text>
        </g>
      </svg>
    </div>
  );
};

export default DefenseNexusFlow;
