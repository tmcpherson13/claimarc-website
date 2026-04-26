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

// Tightened viewBox wraps content snugly so the parent flex centers it
// inside the dark section instead of leaving empty space on the right.
const VIEW_X = 150;
const VIEW_Y = 0;
const VIEW_W = 800;
const VIEW_H = 525;
const VIEW_RIGHT = VIEW_X + VIEW_W;

const TOOLTIP_HOVER_DELAY_MS = 120;
const TOOLTIP_LEAVE_DELAY_MS = 80;

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

type TooltipState = { index: number; x: number; y: number } | null;

const DefenseNexusFlow = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [moduleTooltip, setModuleTooltip] = useState<TooltipState>(null);
  const [isMobile, setIsMobile] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number | null>(null);

  // Persistent chaotic random-walk state for interior nexus particles.
  // Each particle keeps its own position + velocity and updates per frame
  // with random direction kicks for genuinely chaotic, non-periodic motion.
  const CHAOS_COUNT = 22;
  const chaosRef = useRef(
    Array.from({ length: CHAOS_COUNT }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 24;
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        radius: 1.1 + (i % 3) * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    })
  );

  // Hover-delay timers — prevent flicker between rapid hovers
  const srcEnterTimer = useRef<number | null>(null);
  const srcLeaveTimer = useRef<number | null>(null);
  const modEnterTimer = useRef<number | null>(null);
  const modLeaveTimer = useRef<number | null>(null);

  const clearTimer = (t: React.MutableRefObject<number | null>) => {
    if (t.current !== null) {
      window.clearTimeout(t.current);
      t.current = null;
    }
  };

  const showSrc = (next: NonNullable<TooltipState>) => {
    clearTimer(srcLeaveTimer);
    // If a tooltip is already visible, switch immediately (no flicker delay)
    if (tooltip !== null) {
      setTooltip(next);
      return;
    }
    clearTimer(srcEnterTimer);
    srcEnterTimer.current = window.setTimeout(() => {
      setTooltip(next);
    }, TOOLTIP_HOVER_DELAY_MS);
  };
  const hideSrc = () => {
    clearTimer(srcEnterTimer);
    clearTimer(srcLeaveTimer);
    srcLeaveTimer.current = window.setTimeout(() => {
      setTooltip(null);
    }, TOOLTIP_LEAVE_DELAY_MS);
  };

  const showMod = (next: NonNullable<TooltipState>) => {
    clearTimer(modLeaveTimer);
    if (moduleTooltip !== null) {
      setModuleTooltip(next);
      return;
    }
    clearTimer(modEnterTimer);
    modEnterTimer.current = window.setTimeout(() => {
      setModuleTooltip(next);
    }, TOOLTIP_HOVER_DELAY_MS);
  };
  const hideMod = () => {
    clearTimer(modEnterTimer);
    clearTimer(modLeaveTimer);
    modLeaveTimer.current = window.setTimeout(() => {
      setModuleTooltip(null);
    }, TOOLTIP_LEAVE_DELAY_MS);
  };

  // Detect small viewports for mobile tooltip placement
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

      // Update chaotic interior particles with random direction kicks.
      const prev = lastFrameRef.current ?? timestamp;
      const dt = Math.min(0.05, (timestamp - prev) / 1000); // seconds, clamped
      lastFrameRef.current = timestamp;
      const MAX_R = 24; // confine inside inner ring
      const MAX_SPEED = 9;
      const KICK = 22; // velocity change per second
      const DAMP = 0.94;
      for (const p of chaosRef.current) {
        // Random impulse — direction can flip every frame
        p.vx = p.vx * DAMP + (Math.random() - 0.5) * KICK * dt * 60;
        p.vy = p.vy * DAMP + (Math.random() - 0.5) * KICK * dt * 60;
        // Clamp speed so it stays slow + jittery
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > MAX_SPEED) {
          p.vx = (p.vx / sp) * MAX_SPEED;
          p.vy = (p.vy / sp) * MAX_SPEED;
        }
        p.x += p.vx * dt * 18;
        p.y += p.vy * dt * 18;
        // Soft boundary — reflect inward when escaping the disc
        const d = Math.hypot(p.x, p.y);
        if (d > MAX_R) {
          const nx = p.x / d;
          const ny = p.y / d;
          p.x = nx * MAX_R;
          p.y = ny * MAX_R;
          // reflect velocity
          const dot = p.vx * nx + p.vy * ny;
          p.vx -= 2 * dot * nx;
          p.vy -= 2 * dot * ny;
        }
      }

      setTick((n) => (n + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, packets, cycleLen]);

  // Cleanup hover timers on unmount
  useEffect(() => {
    return () => {
      clearTimer(srcEnterTimer);
      clearTimer(srcLeaveTimer);
      clearTimer(modEnterTimer);
      clearTimer(modLeaveTimer);
    };
  }, []);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;

  const nexusGlow =
    0.03 + (Math.sin((elapsed / 1000) * ((2 * Math.PI) / 4)) + 1) / 2 * 0.04;

  const TOOLTIP_W = isMobile ? 260 : 293;
  const TOOLTIP_H_MIN = 96;
  const LINE_H = 14;
  const TOOLTIP_PAD_TOP = 22;
  const TOOLTIP_HEADER_GAP = 20;
  const TOOLTIP_PAD_BOTTOM = 12;

  // Theme-aware fills via CSS variables defined in index.css.
  // The component lives inside a forced-dark section (PlatformPage) so the
  // canvas stays dark, but tooltip + text use semantic tokens so they remain
  // legible if the wrapper ever changes theme.
  const CANVAS_FILL = "hsl(var(--card))";
  const TOOLTIP_BG = "hsl(var(--card))";
  const TOOLTIP_BORDER = "hsl(var(--border))";
  const TOOLTIP_TITLE = "hsl(var(--foreground))";
  const TOOLTIP_BODY = "hsl(var(--muted-foreground))";

  const computeTooltipLayout = (
    src: { description: string },
    anchorX: number,
    anchorY: number,
    side: "right" | "left"
  ) => {
    const lines = wrapText(src.description, isMobile ? 32 : 38, 8);
    const height = Math.max(
      TOOLTIP_H_MIN,
      TOOLTIP_PAD_TOP + TOOLTIP_HEADER_GAP + lines.length * LINE_H + TOOLTIP_PAD_BOTTOM
    );

    let tx: number;
    if (isMobile) {
      // Center horizontally inside viewBox, sit near the top to avoid overlap
      tx = VIEW_X + (VIEW_W - TOOLTIP_W) / 2;
    } else if (side === "right") {
      const want = anchorX + 8;
      tx = want + TOOLTIP_W > VIEW_RIGHT - 4
        ? Math.max(VIEW_X + 4, anchorX - SRC_W - TOOLTIP_W - 10)
        : want;
    } else {
      tx = anchorX - TOOLTIP_W - 8;
      if (tx < VIEW_X + 4) {
        // flip to right of element if can't fit on left
        const right = anchorX + MOD_W + 8;
        tx = right + TOOLTIP_W > VIEW_RIGHT - 4 ? VIEW_X + 4 : right;
      }
    }

    const ty = isMobile
      ? VIEW_Y + 8
      : Math.max(VIEW_Y + 4, Math.min(VIEW_Y + VIEW_H - height - 4, anchorY - 8));

    return { tx, ty, lines, height };
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <style>{`
        @keyframes nexusTooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nexus-tooltip {
          animation: nexusTooltipIn 180ms ease-out both;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>
      <div className="flex justify-center w-full">
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        className="w-full max-w-5xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="nexus-tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          <radialGradient id="nexus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="80%" stopColor="#10B981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nexus-substrate" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F2A22" />
            <stop offset="70%" stopColor="#0A1F1A" />
            <stop offset="100%" stopColor="#06120F" />
          </radialGradient>
        </defs>

        <rect x={VIEW_X} y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill={CANVAS_FILL} />

        {/* Soft outer green glow */}
        <circle
          cx={NEXUS_X}
          cy={NEXUS_Y}
          r={110}
          fill="url(#nexus-glow)"
          opacity={0.85 + nexusGlow * 2}
        />

        {/* Lighter PCB substrate disc (radial gradient) */}
        <circle
          cx={NEXUS_X}
          cy={NEXUS_Y}
          r={66}
          fill="url(#nexus-substrate)"
          stroke="#10B981"
          strokeWidth={1.2}
          opacity={1}
        />

        {/* Circuit-board nexus: PCB traces with right-angle segments,
            solder pads, vias, and chaotic particles "buzzing" around
            before exiting outward to the modules. */}
        {(() => {
          const RINGS = [22, 40, 58];
          const TRACE_COUNT = 16;
          const PAD_R = 2.4;

          // Outer pads + radial connection points
          const traces = Array.from({ length: TRACE_COUNT }, (_, i) => {
            const a = (i / TRACE_COUNT) * Math.PI * 2;
            return {
              a,
              x1: NEXUS_X + Math.cos(a) * RINGS[0],
              y1: NEXUS_Y + Math.sin(a) * RINGS[0],
              x2: NEXUS_X + Math.cos(a) * RINGS[2],
              y2: NEXUS_Y + Math.sin(a) * RINGS[2],
            };
          });

          // Traditional PCB-style traces: a mix of L-shaped (right-angle)
          // jogs between rings and tangential arc segments. Built as SVG
          // path strings using cartesian coords relative to the nexus center.
          const pcbPaths: string[] = [];
          for (let i = 0; i < TRACE_COUNT; i++) {
            const a0 = (i / TRACE_COUNT) * Math.PI * 2;
            const a1 = ((i + 1) / TRACE_COUNT) * Math.PI * 2;
            // L-shaped jog from inner ring to mid ring
            const ix = NEXUS_X + Math.cos(a0) * RINGS[0];
            const iy = NEXUS_Y + Math.sin(a0) * RINGS[0];
            const mx = NEXUS_X + Math.cos(a0) * RINGS[1];
            const my = NEXUS_Y + Math.sin(a0) * RINGS[1];
            // Right-angle elbow: go horizontally then vertically (or rotated by quadrant)
            // For a more authentic PCB look use 45° diagonal jogs.
            const dx = mx - ix;
            const dy = my - iy;
            const elbowX = ix + dx * 0.6;
            const elbowY = iy;
            pcbPaths.push(`M ${ix} ${iy} L ${elbowX} ${elbowY} L ${elbowX} ${elbowY + dy} L ${mx} ${my}`);

            // Tangential arc segment along middle ring (every other trace)
            if (i % 2 === 0) {
              const ax0 = NEXUS_X + Math.cos(a0) * RINGS[1];
              const ay0 = NEXUS_Y + Math.sin(a0) * RINGS[1];
              const ax1 = NEXUS_X + Math.cos(a1) * RINGS[1];
              const ay1 = NEXUS_Y + Math.sin(a1) * RINGS[1];
              pcbPaths.push(`M ${ax0} ${ay0} A ${RINGS[1]} ${RINGS[1]} 0 0 1 ${ax1} ${ay1}`);
            }

            // Straight + diagonal trace from mid ring out to pad
            const ox = NEXUS_X + Math.cos(a0) * RINGS[2];
            const oy = NEXUS_Y + Math.sin(a0) * RINGS[2];
            const midOutX = NEXUS_X + Math.cos(a0) * (RINGS[1] + 6);
            const midOutY = NEXUS_Y + Math.sin(a0) * (RINGS[1] + 6);
            // 45° jog: tangent offset before continuing radially
            const tangent = a0 + Math.PI / 2;
            const jogX = midOutX + Math.cos(tangent) * 4;
            const jogY = midOutY + Math.sin(tangent) * 4;
            pcbPaths.push(`M ${mx} ${my} L ${midOutX} ${midOutY} L ${jogX} ${jogY} L ${ox} ${oy}`);
          }

          // Chaotic interior particles — read live from the random-walk
          // simulation maintained in chaosRef (updated each animation frame).
          const chaos = chaosRef.current.map((p, i) => ({
            cx: NEXUS_X + p.x,
            cy: NEXUS_Y + p.y,
            opacity: 0.55 + 0.45 * Math.abs(Math.sin(elapsed / 400 + p.phase)),
            r: p.radius,
          }));

          // Buzzing particles that travel outward along radial traces and exit
          const BUZZ_COUNT = 16;
          const BUZZ_PERIOD = 1700;
          const buzzers = Array.from({ length: BUZZ_COUNT }, (_, i) => {
            const trace = traces[i % TRACE_COUNT];
            const phase = (i / BUZZ_COUNT) * BUZZ_PERIOD;
            const local = ((elapsed + phase) % BUZZ_PERIOD) / BUZZ_PERIOD;
            const k = local < 0.85 ? local / 0.85 : 1;
            const r = RINGS[0] + (RINGS[2] - RINGS[0]) * k;
            return {
              cx: NEXUS_X + Math.cos(trace.a) * r,
              cy: NEXUS_Y + Math.sin(trace.a) * r,
              opacity: local < 0.85 ? 0.95 : 0.4 + 0.6 * Math.sin(local * 40),
            };
          });

          return (
            <g>
              {/* Concentric rings (PCB silkscreen) */}
              {RINGS.map((r, i) => (
                <circle
                  key={`ring-${i}`}
                  cx={NEXUS_X}
                  cy={NEXUS_Y}
                  r={r}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={i === 1 ? 0.9 : 0.5}
                  opacity={i === 1 ? 0.5 : 0.28}
                  strokeDasharray={i === 2 ? "3 4" : undefined}
                />
              ))}

              {/* Traditional PCB traces (right-angle + tangential arcs) */}
              {pcbPaths.map((d, i) => (
                <path
                  key={`pcb-${i}`}
                  d={d}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={0.8}
                  opacity={0.55}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              ))}

              {/* Vias (small filled dots at trace junctions on middle ring) */}
              {traces.map((t, i) => {
                const vx = NEXUS_X + Math.cos(t.a) * RINGS[1];
                const vy = NEXUS_Y + Math.sin(t.a) * RINGS[1];
                return (
                  <circle
                    key={`via-${i}`}
                    cx={vx}
                    cy={vy}
                    r={1.1}
                    fill="#10B981"
                    opacity={0.7}
                  />
                );
              })}

              {/* Solder pads at outer ring */}
              {traces.map((t, i) => (
                <g key={`pad-out-${i}`}>
                  <circle
                    cx={t.x2}
                    cy={t.y2}
                    r={PAD_R}
                    fill="#020617"
                    stroke="#10B981"
                    strokeWidth={0.9}
                    opacity={0.9}
                  />
                  <circle
                    cx={t.x2}
                    cy={t.y2}
                    r={0.8}
                    fill="#10B981"
                    opacity={0.6}
                  />
                </g>
              ))}

              {/* Inner core pad */}
              <circle
                cx={NEXUS_X}
                cy={NEXUS_Y}
                r={9}
                fill="#020617"
                stroke="#10B981"
                strokeWidth={1}
                opacity={0.95}
              />
              <circle
                cx={NEXUS_X}
                cy={NEXUS_Y}
                r={3.5}
                fill="#10B981"
                opacity={0.7 + 0.3 * Math.sin(elapsed / 300)}
              />

              {/* Chaotic interior particles */}
              {chaos.map((c, i) => (
                <circle
                  key={`chaos-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#6EE7B7"
                  opacity={c.opacity}
                />
              ))}

              {/* Buzzing particles traveling outward along traces */}
              {buzzers.map((b, i) => (
                <circle
                  key={`buzz-${i}`}
                  cx={b.cx}
                  cy={b.cy}
                  r={1.7}
                  fill="#34D399"
                  opacity={b.opacity}
                />
              ))}
            </g>
          );
        })()}

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
          const handleEnter = () => showSrc({ index: i, x: SRC_RIGHT, y });
          return (
            <g
              key={`src-${i}`}
              onMouseEnter={handleEnter}
              onMouseLeave={hideSrc}
              onTouchStart={handleEnter}
              onClick={handleEnter}
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
          const handleEnter = () => showMod({ index: i, x: MOD_X, y });
          return (
            <g
              key={`mod-${i}`}
              onMouseEnter={handleEnter}
              onMouseLeave={hideMod}
              onTouchStart={handleEnter}
              onClick={handleEnter}
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

        {(() => {
          const LABEL_R = 92;
          // Top arc: left → right across the top (sweep 1)
          const topPath = `M ${NEXUS_X - LABEL_R} ${NEXUS_Y} A ${LABEL_R} ${LABEL_R} 0 0 1 ${NEXUS_X + LABEL_R} ${NEXUS_Y}`;
          // Bottom arc: left → right across the bottom (sweep 0) so text reads upright
          const bottomPath = `M ${NEXUS_X - LABEL_R} ${NEXUS_Y} A ${LABEL_R} ${LABEL_R} 0 0 0 ${NEXUS_X + LABEL_R} ${NEXUS_Y}`;
          return (
            <g
              fill="#10B981"
              fontSize={10}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              opacity={0.85}
              letterSpacing={3}
            >
              <defs>
                <path id="nexus-label-top" d={topPath} />
                <path id="nexus-label-bottom" d={bottomPath} />
              </defs>
              <text>
                <textPath href="#nexus-label-top" startOffset="50%" textAnchor="middle">
                  DEFENSE
                </textPath>
              </text>
              <text>
                <textPath href="#nexus-label-bottom" startOffset="50%" textAnchor="middle">
                  NEXUS
                </textPath>
              </text>
            </g>
          );
        })()}

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
            const { tx, ty, lines, height } = computeTooltipLayout(
              src,
              tooltip.x,
              tooltip.y,
              "right"
            );
            return (
              <g
                key={`src-tt-${tooltip.index}`}
                className="nexus-tooltip"
                filter="url(#nexus-tooltip-shadow)"
                style={{ pointerEvents: "none" }}
              >
                <rect
                  x={tx}
                  y={ty}
                  width={TOOLTIP_W}
                  height={height}
                  rx={6}
                  fill={TOOLTIP_BG}
                  stroke={TOOLTIP_BORDER}
                  strokeWidth={1}
                />
                <text
                  x={tx + 14}
                  y={ty + TOOLTIP_PAD_TOP}
                  fill={TOOLTIP_TITLE}
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
                    y={ty + TOOLTIP_PAD_TOP + TOOLTIP_HEADER_GAP + li * LINE_H}
                    fill={TOOLTIP_BODY}
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
            const { tx, ty, lines, height } = computeTooltipLayout(
              mod,
              moduleTooltip.x,
              moduleTooltip.y,
              "left"
            );
            return (
              <g
                key={`mod-tt-${moduleTooltip.index}`}
                className="nexus-tooltip"
                filter="url(#nexus-tooltip-shadow)"
                style={{ pointerEvents: "none" }}
              >
                <rect
                  x={tx}
                  y={ty}
                  width={TOOLTIP_W}
                  height={height}
                  rx={6}
                  fill={TOOLTIP_BG}
                  stroke={LAYER_COLOR[mod.layer]}
                  strokeWidth={1}
                />
                <text
                  x={tx + 14}
                  y={ty + TOOLTIP_PAD_TOP}
                  fill={TOOLTIP_TITLE}
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
                    y={ty + TOOLTIP_PAD_TOP + TOOLTIP_HEADER_GAP + li * LINE_H}
                    fill={TOOLTIP_BODY}
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
