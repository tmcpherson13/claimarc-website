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
  description: string;
}

const SOURCES: Source[] = [
  {
    name: "HPT MRFs (5,400+ hospitals)",
    description:
      "5,400+ hospitals publish their negotiated rates publicly. ZDefense uses this to benchmark what your payers actually pay others for the same procedures.",
  },
  {
    name: "TiC MRFs (7 payers)",
    description:
      "7 major payers publish rate files under the Transparency in Coverage rule. This is the market rate intelligence behind ContractIntel.",
  },
  {
    name: "CMS Physician Fee Schedule",
    description:
      "Medicare's published allowed amounts by CPT code and geography. The baseline reference for every rate comparison ZDefense makes.",
  },
  {
    name: "CMS OPPS",
    description:
      "Outpatient Prospective Payment System rates and APC packaging rules. Feeds Shield's pre-submission bundling checks.",
  },
  {
    name: "CMS Bulk / NPI Registry",
    description:
      "The national provider registry. ZDefense uses it to route denials and benchmark by specialty and taxonomy.",
  },
  {
    name: "NCCI Edits",
    description:
      "CMS bundling and modifier rules updated quarterly. The core engine behind Shield's 89.4% clean claim rate.",
  },
  {
    name: "CARC/RARC Codes",
    description:
      "The standardized denial reason codes published by X12. Every denial in Triage and Evidence is classified against this reference.",
  },
  {
    name: "NCD/LCD Policies",
    description:
      "National and local coverage determinations from CMS. Defines what is medically necessary — and what Shield flags before submission.",
  },
  {
    name: "MAC CR Bulletins",
    description:
      "Local Medicare contractor rule changes monitored continuously. Shield's Regulatory Intelligence Feed fires 45 days before these affect your claims.",
  },
  {
    name: "Commercial Payer Policies",
    description:
      "UHC, Aetna, Cigna, Anthem, Humana policy updates. The behavioral baseline Sentinel uses to detect strategy shifts before your team sees denials.",
  },
  {
    name: "ICD-10 Code Reference",
    description:
      "Annual CMS diagnosis code updates. Used by Triage to validate denial reasons and by Evidence to assemble accurate appeal packages.",
  },
];

interface ModuleDef {
  name: string;
  layer: Layer;
  description: string;
}

const MODULES: ModuleDef[] = [
  {
    name: "Sentinel",
    layer: "predict",
    description:
      "Monitors payer behavioral shifts in real time using the Payer Weaponization Index. Detects systematic denial strategy changes 7–14 days before your billing team sees them in volume.",
  },
  {
    name: "ContractIntel",
    layer: "predict",
    description:
      "Benchmarks your contracted rates against TiC MRF data from 7 major payers. Surfaces underpayment gaps and flags contract renewal windows before negotiations open.",
  },
  {
    name: "Forecast",
    layer: "predict",
    description:
      "Synthesizes all 9 modules into a single 90-day revenue projection. $12.6M projected at 84% confidence in the current demo build.",
  },
  {
    name: "Shield",
    layer: "protect",
    description:
      "Scans every outbound claim against live payer rules and NCCI edits before submission. 89.4% clean claim rate in demo. No BAA required.",
  },
  {
    name: "Prevent",
    layer: "protect",
    description:
      "Detects prior authorization requirement changes an average of 11 days before formal payer notice. No BAA required.",
  },
  {
    name: "Ledger",
    layer: "protect",
    description:
      "Underpayment detection, plus Overpayment discovery with Medicare 60-day countdown tracker for enforcement compliance. Immutable audit log with configurable dual-approver authorization on every write-off.",
  },
  {
    name: "Triage",
    layer: "recover",
    description:
      "AI-powered denial queue ranked by recovery probability. Using a CARC/RARC classification model, to streamline the denials workflow. Gives the Rev Cycle team to view all denials in the queue and decide where to focus their efforts based on the Recovery Probability Score.",
  },
  {
    name: "Evidence",
    layer: "recover",
    description:
      "Assembles the full appeal documentation package automatically before a specialist opens the file — clinical notes, modifiers, authorizations, and coverage rules.",
  },
  {
    name: "Resolve",
    layer: "recover",
    description:
      "Generates bulk payer-specific appeal letters. 10 letters in 8 seconds. Outcome tracking feeds back into the recovery model so accuracy improves with every appeal.",
  },
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

// Layout constants — all x shifted by +150 to center within wider viewBox
const SRC_X = 190;
const SRC_W = 190;
const SRC_H = 28;
const SRC_RIGHT = SRC_X + SRC_W;
const NEXUS_IN_X = 560;
const NEXUS_OUT_X = 580;
const NEXUS_X = 570;
const NEXUS_Y = 262.5;
const MOD_X = 730;
const MOD_W = 170;
const MOD_H = 32;

const VIEW_W = 1400;
const VIEW_H = 525;

const sourceY = (i: number) => {
  const top = 37.5;
  const bot = 487.5;
  return top + ((bot - top) / (SOURCES.length - 1)) * i + SRC_H / 2;
};
const moduleY = (i: number) => {
  const top = 52.5;
  const bot = 472.5;
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

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  const consumed = lines.join(" ").length;
  if (consumed < text.length && lines.length === maxLines) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines;
}

const DefenseNexusFlow = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const [tooltip, setTooltip] = useState<
    { index: number; x: number; y: number } | null
  >(null);
  const [moduleTooltip, setModuleTooltip] = useState<
    { index: number; x: number; y: number } | null
  >(null);
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

  const TOOLTIP_W = 293;
  const TOOLTIP_H = 96;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <div className="flex justify-center w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full max-w-6xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="nexus-tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#0B1628" />

        <circle
          cx={NEXUS_X}
          cy={NEXUS_Y}
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
              y2={NEXUS_Y}
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
              y1={NEXUS_Y}
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
            <g
              key={`src-${i}`}
              onMouseEnter={() =>
                setTooltip({ index: i, x: SRC_RIGHT, y: y })
              }
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "default" }}
            >
              {/* inner glow */}
              <rect
                x={SRC_X}
                y={y}
                width={SRC_W}
                height={SRC_H}
                rx={4}
                fill="#10B981"
                opacity={0.04}
              />
              <rect
                x={SRC_X}
                y={y}
                width={SRC_W}
                height={SRC_H}
                rx={4}
                fill="#0F172A"
                stroke="#2D4F7A"
                strokeWidth={1.5}
              />
              <text
                x={SRC_X + SRC_W / 2}
                y={y + SRC_H / 2 + 4}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize={11}
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
            <g
              key={`mod-${i}`}
              onMouseEnter={() =>
                setModuleTooltip({ index: i, x: MOD_X, y: y })
              }
              onMouseLeave={() => setModuleTooltip(null)}
              style={{ cursor: "default" }}
            >
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
                y={y + MOD_H / 2 + 4}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize={11}
              >
                {m.name}
              </text>
            </g>
          );
        })}

        <text
          x={NEXUS_X}
          y={NEXUS_Y}
          textAnchor="middle"
          fill="#10B981"
          fontSize={10}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.6}
          letterSpacing={3}
          transform={`rotate(-90 ${NEXUS_X} ${NEXUS_Y})`}
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
            y = sy + (NEXUS_Y - sy) * k;
          } else {
            const k = (t - 0.5) / 0.5;
            x = NEXUS_X + (MOD_X - NEXUS_X) * k;
            y = NEXUS_Y + (my - NEXUS_Y) * k;
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
            x={570 - 100}
            y={505 - 10}
            width={200}
            height={20}
            rx={10}
            fill="#021A0F"
            stroke="#10B981"
            strokeWidth={1}
          />
          <text
            x={570}
            y={505 + 4}
            textAnchor="middle"
            fill="#10B981"
            fontSize={10}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            letterSpacing={1}
          >
            NO PHI · PUBLIC DATA ONLY
          </text>
        </g>

        {tooltip !== null &&
          (() => {
            const src = SOURCES[tooltip.index];
            const wantRightX = tooltip.x + 8;
            const flipLeft = wantRightX + TOOLTIP_W > VIEW_W;
            const tx = flipLeft ? tooltip.x - SRC_W - TOOLTIP_W - 10 : wantRightX;
            const ty = Math.max(
              4,
              Math.min(VIEW_H - TOOLTIP_H - 4, tooltip.y - 8)
            );
            const lines = wrapText(src.description, 38, 4);
            return (
              <g filter="url(#nexus-tooltip-shadow)" style={{ pointerEvents: "none" }}>
                <rect
                  x={tx}
                  y={ty}
                  width={TOOLTIP_W}
                  height={Math.max(TOOLTIP_H, 36 + lines.length * 14)}
                  rx={6}
                  fill="#0F172A"
                  stroke="#2D4F7A"
                  strokeWidth={1}
                />
                <text
                  x={tx + 14}
                  y={ty + 22}
                  fill="#CBD5E1"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {src.name}
                </text>
                {lines.map((line, li) => (
                  <text
                    key={`tt-line-${li}`}
                    x={tx + 14}
                    y={ty + 42 + li * 14}
                    fill="#64748B"
                    fontSize={11}
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })()}

        {moduleTooltip !== null &&
          (() => {
            const mod = MODULES[moduleTooltip.index];
            // Render to the LEFT of module: offset x-301 (TOOLTIP_W + 8 gap)
            let tx = moduleTooltip.x - TOOLTIP_W - 8;
            // Clamp to left edge
            if (tx < 4) tx = 4;
            const ty = Math.max(
              4,
              Math.min(VIEW_H - TOOLTIP_H - 4, moduleTooltip.y - 8)
            );
            const lines = wrapText(mod.description, 38, 5);
            return (
              <g filter="url(#nexus-tooltip-shadow)" style={{ pointerEvents: "none" }}>
                <rect
                  x={tx}
                  y={ty}
                  width={TOOLTIP_W}
                  height={Math.max(TOOLTIP_H, 36 + lines.length * 14)}
                  rx={6}
                  fill="#0F172A"
                  stroke={LAYER_COLOR[mod.layer]}
                  strokeWidth={1}
                />
                <text
                  x={tx + 14}
                  y={ty + 22}
                  fill="#CBD5E1"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {mod.name}
                </text>
                {lines.map((line, li) => (
                  <text
                    key={`mtt-line-${li}`}
                    x={tx + 14}
                    y={ty + 42 + li * 14}
                    fill="#64748B"
                    fontSize={11}
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })()}
      </svg>
      </div>
    </div>
  );
};

export default DefenseNexusFlow;
