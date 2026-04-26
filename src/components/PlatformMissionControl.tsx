import { useEffect, useRef, useState } from "react";

/**
 * PlatformMissionControl — full-width, mission-control style decorative SVG
 * for the /platform hero. Nine independent instruments arranged in a 3x3
 * grid, all driven by a single requestAnimationFrame loop. Pure SVG +
 * React hooks. Animation kicks in only when the component enters the
 * viewport via IntersectionObserver. Every readout is meant to look like
 * it is measuring something real about the ZDefense platform itself.
 */

// ---------- Layout constants ----------
const VB_W = 1200;
const VB_H = 320;
const COLS = 3;
const ROWS = 3;
const GAP = 10;
const CELL_W = (VB_W - GAP * (COLS + 1)) / COLS; // ~393.3
const CELL_H = (VB_H - GAP * (ROWS + 1)) / ROWS; // ~95
const cellX = (col: number) => GAP + col * (CELL_W + GAP);
const cellY = (row: number) => GAP + row * (CELL_H + GAP);

// ---------- Module catalog (must match the rest of the platform) ----------
type Layer = "predict" | "protect" | "recover";
interface ModuleSpec {
  name: string;
  layer: Layer;
  baa: boolean; // true => BAA required
}
const MODULES_LIST: ModuleSpec[] = [
  { name: "Sentinel", layer: "predict", baa: true },
  { name: "ContractIntel", layer: "predict", baa: false },
  { name: "Forecast", layer: "predict", baa: true },
  { name: "Shield", layer: "protect", baa: false },
  { name: "Prevent", layer: "protect", baa: false },
  { name: "Ledger", layer: "protect", baa: true },
  { name: "Triage", layer: "recover", baa: true },
  { name: "Evidence", layer: "recover", baa: true },
  { name: "Resolve", layer: "recover", baa: true },
];
const LAYER_COLOR: Record<Layer, string> = {
  predict: "#06B6D4",
  protect: "#10B981",
  recover: "#8B5CF6",
};

// ---------- Shared helpers ----------
const polarX = (cx: number, cy: number, r: number, angDeg: number) =>
  cx + r * Math.cos(((angDeg - 90) * Math.PI) / 180);
const polarY = (cx: number, cy: number, r: number, angDeg: number) =>
  cy + r * Math.sin(((angDeg - 90) * Math.PI) / 180);

/** SVG arc path between two angles (deg, 0=top, clockwise). */
const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) => {
  const start = { x: polarX(cx, cy, r, endDeg), y: polarY(cx, cy, r, endDeg) };
  const end = { x: polarX(cx, cy, r, startDeg), y: polarY(cx, cy, r, startDeg) };
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
};

// ---------- Bezel ----------
interface BezelProps {
  col: number;
  row: number;
  label: string;
  children: React.ReactNode;
}
const Bezel = ({ col, row, label, children }: BezelProps) => {
  const x = cellX(col);
  const y = cellY(row);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={CELL_W}
        height={CELL_H}
        rx={8}
        fill="#0A1628"
        stroke="#1E3A5F"
        strokeWidth={1.5}
      />
      <text x={8} y={11} fontSize={7} fill="#475569" fontFamily="monospace">
        {label}
      </text>
      {children}
    </g>
  );
};

// ===========================================================================
// 1. Module Status Board
// ===========================================================================
const ModuleStatusBoard = ({ t }: { t: number }) => {
  const rowGap = (CELL_H - 22) / MODULES_LIST.length;
  const startY = 20;
  const layerLabelByIndex: Record<number, string> = {
    0: "PREDICT",
    3: "PROTECT",
    6: "RECOVER",
  };
  return (
    <g>
      {MODULES_LIST.map((m, i) => {
        const y = startY + i * rowGap + rowGap / 2;
        const period = 2 + (i % 4) * 0.75; // 2..4.75s
        const phase = (i * Math.PI) / 3;
        const wave = Math.sin((t / period) * Math.PI * 2 + phase);
        const opacity = 0.6 + 0.4 * (wave * 0.5 + 0.5); // 0.6..1.0
        const color = LAYER_COLOR[m.layer];
        return (
          <g key={m.name}>
            {layerLabelByIndex[i] && (
              <text
                x={6}
                y={y - rowGap / 2 + 5}
                fontSize={6}
                fill="#475569"
                fontFamily="monospace"
              >
                {layerLabelByIndex[i]}
              </text>
            )}
            <circle
              cx={70}
              cy={y}
              r={4}
              fill={color}
              opacity={opacity}
            />
            <circle
              cx={70}
              cy={y}
              r={6}
              fill={color}
              opacity={opacity * 0.18}
            />
            <text
              x={82}
              y={y + 2.5}
              fontSize={7}
              fill="#94A3B8"
              fontFamily="monospace"
            >
              {m.name}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ===========================================================================
// 2. Clean Claim Rate Gauge
// ===========================================================================
const ClaimRateGauge = ({ t }: { t: number }) => {
  const cx = CELL_W / 2;
  const cy = CELL_H / 2 + 4;
  const r = 36; // scaled from 52 to fit smaller cell height
  const startDeg = 210;
  const endDeg = 330; // sweeps via 0/top
  // 210 -> 330 the short way is 360-(330-210)=240 going clockwise from 210
  // we draw via the top so total span is 360-(330-210)=240deg via top:
  const totalSpan = 240;

  const wave = Math.sin((t / 18) * Math.PI * 2);
  const pct = 89.4 + wave * 1.3; // 88.1..90.7
  const fillSpan = (pct / 100) * totalSpan;
  // From angle 210 going clockwise (i.e. up over the top) by fillSpan:
  // We treat angle going "up over top" as decreasing the angle (mod 360).
  const fillEnd = (210 + fillSpan) % 360;

  // Build the arcs by sampling — easier than juggling sweep flags.
  const samples = 60;
  const trackPts: string[] = [];
  const fillPts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const a = (210 - (i / samples) * totalSpan + 360) % 360;
    trackPts.push(`${polarX(cx, cy, r, a).toFixed(2)},${polarY(cx, cy, r, a).toFixed(2)}`);
    if (i / samples <= pct / 100) {
      fillPts.push(`${polarX(cx, cy, r, a).toFixed(2)},${polarY(cx, cy, r, a).toFixed(2)}`);
    }
  }

  // Tick marks
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (210 - (i / 9) * totalSpan + 360) % 360;
    ticks.push({
      x1: polarX(cx, cy, r + 3, a),
      y1: polarY(cx, cy, r + 3, a),
      x2: polarX(cx, cy, r + 7, a),
      y2: polarY(cx, cy, r + 7, a),
    });
  }

  // Needle position based on current pct
  const needleAngle = (210 - (pct / 100) * totalSpan + 360) % 360;
  const nx = polarX(cx, cy, r - 4, needleAngle);
  const ny = polarY(cx, cy, r - 4, needleAngle);

  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 10} fill="#060E1A" stroke="#1E3A5F" />
      {/* Track rail */}
      <polyline
        points={trackPts.join(" ")}
        fill="none"
        stroke="#1E3A5F"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.4}
      />
      {/* Fill arc */}
      <polyline
        points={fillPts.join(" ")}
        fill="none"
        stroke="#10B981"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Ticks */}
      {ticks.map((tk, i) => (
        <line
          key={i}
          x1={tk.x1}
          y1={tk.y1}
          x2={tk.x2}
          y2={tk.y2}
          stroke="#475569"
          strokeWidth={1}
        />
      ))}
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#F59E0B"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={2.2} fill="#F59E0B" />
      {/* Center text */}
      <text
        x={cx}
        y={cy - 2}
        fontSize={11}
        fill="#10B981"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        {pct.toFixed(1)}%
      </text>
      <text
        x={cx}
        y={cy + 9}
        fontSize={6}
        fill="#475569"
        textAnchor="middle"
        fontFamily="monospace"
      >
        CLEAN CLAIM RATE
      </text>
    </g>
  );
};

// ===========================================================================
// 3. Crucible Pipeline Throughput
// ===========================================================================
interface Packet {
  id: number;
  rail: number;
  speed: number; // px/s
  x: number;
}
const RAIL_LABELS = ["HPT MRFs", "TiC MRFs", "MAC Bulletins"];
const CrucibleThroughput = ({
  t,
  packets,
  accumHeights,
  livePulse,
}: {
  t: number;
  packets: Packet[];
  accumHeights: number[];
  livePulse: number;
}) => {
  const leftPad = 70;
  const rightPad = 14;
  const railTopY = 22;
  const railSpacing = (CELL_H - railTopY - 8) / 3;
  return (
    <g>
      {/* LIVE indicator */}
      <g transform={`translate(${CELL_W - 38} 9)`}>
        <circle cx={0} cy={3} r={2.5} fill="#10B981" opacity={0.6 + 0.4 * livePulse} />
        <text x={6} y={5} fontSize={6} fill="#10B981" fontFamily="monospace">
          LIVE
        </text>
      </g>
      {[0, 1, 2].map((i) => {
        const y = railTopY + i * railSpacing + railSpacing / 2;
        const railEndX = CELL_W - rightPad;
        return (
          <g key={i}>
            <text
              x={6}
              y={y + 2.5}
              fontSize={7}
              fill="#475569"
              fontFamily="monospace"
            >
              {RAIL_LABELS[i]}
            </text>
            <line
              x1={leftPad}
              y1={y}
              x2={railEndX}
              y2={y}
              stroke="#1E3A5F"
              strokeWidth={1}
            />
            {/* accumulator */}
            <rect
              x={railEndX - 1}
              y={y - accumHeights[i] / 2}
              width={4}
              height={accumHeights[i]}
              rx={1}
              fill="#06B6D4"
              opacity={0.7}
            />
          </g>
        );
      })}
      {/* Packets */}
      {packets.map((p) => {
        const y = railTopY + p.rail * railSpacing + railSpacing / 2 - 3;
        return (
          <rect
            key={p.id}
            x={leftPad + p.x}
            y={y}
            width={20}
            height={6}
            rx={2}
            fill="#06B6D4"
            opacity={0.7}
          />
        );
      })}
    </g>
  );
};

// ===========================================================================
// 4. Payer Coverage Grid
// ===========================================================================
const PAYERS = ["UHC", "BCBS", "Aetna", "Cigna", "Humana", "Molina", "Centene"];
const PayerCoverageGrid = ({ t }: { t: number }) => {
  const topPad = 16;
  const bottomPad = 12;
  const colWidth = (CELL_W - 16) / PAYERS.length;
  const maxBarH = CELL_H - topPad - bottomPad - 12;
  return (
    <g>
      {PAYERS.map((p, i) => {
        const period = 6 + (i % 4) * 1.5; // 6..10.5
        const wave = Math.sin((t / period) * Math.PI * 2 + i);
        const norm = wave * 0.5 + 0.5; // 0..1
        const ratio = 0.4 + norm * 0.55; // 0.4..0.95
        const barH = ratio * maxBarH;
        const wi = (1.1 + norm * 1.3).toFixed(1); // 1.1..2.4
        const x = 8 + i * colWidth;
        const colCx = x + colWidth / 2;
        const barW = colWidth * 0.55;
        const barX = colCx - barW / 2;
        const barY = topPad + 10 + (maxBarH - barH);
        return (
          <g key={p}>
            <text
              x={colCx}
              y={topPad + 7}
              fontSize={6}
              fill="#F59E0B"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {wi}x
            </text>
            <defs>
              <linearGradient id={`pcg-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <rect
              x={barX}
              y={barY}
              width={barW}
              height={barH}
              rx={1}
              fill={`url(#pcg-${i})`}
              opacity={0.8}
            />
            <text
              x={colCx}
              y={CELL_H - 4}
              fontSize={6}
              fill="#475569"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {p}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ===========================================================================
// 5. Recovery Pipeline Odometer
// ===========================================================================
const RecoveryOdometer = ({ t }: { t: number }) => {
  const wave = Math.sin((t / 20) * Math.PI * 2);
  const value = 851500 + wave * 39500; // 812k..891k
  const cents = Math.round(value);
  const display =
    "$" +
    cents
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const cx = CELL_W / 2;
  const cy = CELL_H / 2 - 4;
  const barW = CELL_W * 0.6;
  const barX = (CELL_W - barW) / 2;
  const barY = cy + 12;
  const fillRatio = Math.min(1, value / 1_000_000);
  return (
    <g>
      <text
        x={cx}
        y={cy}
        fontSize={20}
        fill="#10B981"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        {display}
      </text>
      <rect
        x={barX}
        y={barY}
        width={barW}
        height={5}
        rx={2.5}
        fill="#1E3A5F"
      />
      <rect
        x={barX}
        y={barY}
        width={barW * fillRatio}
        height={5}
        rx={2.5}
        fill="#10B981"
        opacity={0.7}
      />
      <text
        x={cx}
        y={barY + 16}
        fontSize={7}
        fill="#475569"
        fontFamily="monospace"
        textAnchor="middle"
      >
        ACTIVE PIPELINE
      </text>
      <text
        x={cx}
        y={CELL_H - 4}
        fontSize={6}
        fill="#475569"
        fontFamily="monospace"
        textAnchor="middle"
        opacity={0.6}
      >
        TRIAGE MODULE
      </text>
    </g>
  );
};

// ===========================================================================
// 6. System Clock / Last Refresh
// ===========================================================================
const SystemClock = ({
  now,
  elapsedSec,
}: {
  now: Date;
  elapsedSec: number;
}) => {
  const cx = CELL_W / 2;
  const cy = CELL_H / 2 - 4;
  const r = 30;
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;
  const secAngle = (sec / 60) * 360;
  const minAngle = (min / 60) * 360;
  const hrAngle = (hr / 12) * 360;
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360;
    const long = i % 3 === 0;
    const inner = long ? r - 6 : r - 3;
    ticks.push(
      <line
        key={i}
        x1={polarX(cx, cy, inner, a)}
        y1={polarY(cx, cy, inner, a)}
        x2={polarX(cx, cy, r, a)}
        y2={polarY(cx, cy, r, a)}
        stroke="#1E3A5F"
        strokeWidth={1}
      />,
    );
  }
  const mm = Math.floor(elapsedSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(elapsedSec % 60)
    .toString()
    .padStart(2, "0");
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 6} fill="#060E1A" stroke="#1E3A5F" />
      {ticks}
      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={polarX(cx, cy, r * 0.5, hrAngle)}
        y2={polarY(cx, cy, r * 0.5, hrAngle)}
        stroke="#CBD5E1"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={polarX(cx, cy, r * 0.75, minAngle)}
        y2={polarY(cx, cy, r * 0.75, minAngle)}
        stroke="#CBD5E1"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Second hand */}
      <line
        x1={cx}
        y1={cy}
        x2={polarX(cx, cy, r * 0.85, secAngle)}
        y2={polarY(cx, cy, r * 0.85, secAngle)}
        stroke="#06B6D4"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.9}
      />
      <circle cx={cx} cy={cy} r={3} fill="#475569" />
      <text
        x={CELL_W - 6}
        y={CELL_H - 14}
        fontSize={6}
        fill="#475569"
        fontFamily="monospace"
        textAnchor="end"
      >
        LAST REFRESH
      </text>
      <text
        x={CELL_W - 6}
        y={CELL_H - 4}
        fontSize={9}
        fill="#06B6D4"
        fontFamily="monospace"
        textAnchor="end"
      >
        {mm}:{ss}
      </text>
    </g>
  );
};

// ===========================================================================
// 7. BAA Shield Status
// ===========================================================================
const Padlock = ({
  x,
  y,
  open,
  color,
}: {
  x: number;
  y: number;
  open: boolean;
  color: string;
}) => (
  <g transform={`translate(${x} ${y})`}>
    {/* Shackle */}
    <path
      d={
        open
          ? `M 1 0 A 3 3 0 0 1 7 0 L 7 -1`
          : `M 1 0 A 3 3 0 0 1 7 0 L 7 3`
      }
      stroke={color}
      strokeWidth={1}
      fill="none"
    />
    {/* Body */}
    <rect x={0} y={3} width={8} height={6} rx={1} fill={color} />
  </g>
);

const BAA_REQUIRED = ["Sentinel", "Forecast", "Ledger", "Triage", "Evidence", "Resolve"];
const BAA_NONE = ["ContractIntel", "Shield", "Prevent"];

const BaaStatus = ({ t }: { t: number }) => {
  const headerY = 22;
  const colW = CELL_W / 2;
  const reqRowH = (CELL_H - headerY - 6) / BAA_REQUIRED.length;
  const noneRowH = (CELL_H - headerY - 6) / BAA_NONE.length;

  // Scan bar travels every 3s, top-to-bottom across the visible row band.
  const scanProg = ((t % 3) / 3); // 0..1
  const bandTop = headerY + 4;
  const bandBottom = CELL_H - 4;
  const scanY = bandTop + scanProg * (bandBottom - bandTop);
  const rowHighlight = (rowCenterY: number) => {
    const dist = Math.abs(rowCenterY - scanY);
    return Math.max(0, 1 - dist / 8);
  };

  return (
    <g>
      <text x={8} y={headerY} fontSize={6} fill="#F59E0B" fontFamily="monospace">
        BAA REQUIRED
      </text>
      <text
        x={colW + 4}
        y={headerY}
        fontSize={6}
        fill="#10B981"
        fontFamily="monospace"
      >
        NO BAA
      </text>

      {BAA_REQUIRED.map((n, i) => {
        const ry = headerY + 6 + i * reqRowH + reqRowH / 2;
        const hi = rowHighlight(ry);
        return (
          <g key={n} opacity={0.6 + 0.4 * hi}>
            <Padlock x={8} y={ry - 4} open={false} color="#F59E0B" />
            <text
              x={22}
              y={ry + 2}
              fontSize={6}
              fill="#94A3B8"
              fontFamily="monospace"
            >
              {n}
            </text>
          </g>
        );
      })}
      {BAA_NONE.map((n, i) => {
        const ry = headerY + 6 + i * noneRowH + noneRowH / 2;
        const hi = rowHighlight(ry);
        return (
          <g key={n} opacity={0.6 + 0.4 * hi}>
            <Padlock x={colW + 4} y={ry - 4} open={true} color="#10B981" />
            <text
              x={colW + 18}
              y={ry + 2}
              fontSize={6}
              fill="#94A3B8"
              fontFamily="monospace"
            >
              {n}
            </text>
          </g>
        );
      })}
      {/* Scan line */}
      <line
        x1={4}
        y1={scanY}
        x2={CELL_W - 4}
        y2={scanY}
        stroke="#F59E0B"
        strokeWidth={0.5}
        opacity={0.35}
      />
    </g>
  );
};

// ===========================================================================
// 8. Appeal Confidence Thermometer
// ===========================================================================
const AppealThermometer = ({ t }: { t: number }) => {
  const wave = Math.sin((t / 14) * Math.PI * 2);
  const pct = 78 + wave * 5; // 73..83
  const trackH = 60;
  const trackW = 8;
  const trackX = CELL_W / 2 - 30;
  const trackY = 18;
  const fillH = (pct / 100) * trackH;
  const fillY = trackY + (trackH - fillH);
  const isHot = pct >= 50;
  const fillColor = isHot ? "#10B981" : "#F59E0B";

  return (
    <g>
      <text
        x={trackX + trackW / 2}
        y={14}
        fontSize={6}
        fill="#475569"
        fontFamily="monospace"
        textAnchor="middle"
        opacity={0.6}
      >
        RESOLVE MODULE
      </text>
      {/* Gradient defs */}
      <defs>
        <linearGradient id="thermo-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="33%" stopColor="#F59E0B" />
          <stop offset="34%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Track */}
      <rect
        x={trackX}
        y={trackY}
        width={trackW}
        height={trackH}
        rx={trackW / 2}
        fill="#1E3A5F"
      />
      {/* Fill */}
      <rect
        x={trackX}
        y={fillY}
        width={trackW}
        height={fillH}
        rx={trackW / 2}
        fill="url(#thermo-grad)"
      />
      {/* Bulb */}
      <circle
        cx={trackX + trackW / 2}
        cy={trackY + trackH + 6}
        r={7}
        fill={fillColor}
      />
      {/* Ticks */}
      {[25, 50, 75, 100].map((p) => {
        const ty = trackY + (1 - p / 100) * trackH;
        return (
          <g key={p}>
            <line
              x1={trackX + trackW + 2}
              y1={ty}
              x2={trackX + trackW + 6}
              y2={ty}
              stroke="#475569"
              strokeWidth={0.8}
            />
            <text
              x={trackX + trackW + 9}
              y={ty + 2}
              fontSize={5}
              fill="#475569"
              fontFamily="monospace"
            >
              {p}
            </text>
          </g>
        );
      })}
      {/* Value */}
      <text
        x={CELL_W / 2 + 18}
        y={CELL_H / 2 - 2}
        fontSize={11}
        fill="#10B981"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {pct.toFixed(1)}%
      </text>
      <text
        x={CELL_W / 2 + 18}
        y={CELL_H / 2 + 8}
        fontSize={7}
        fill="#475569"
        fontFamily="monospace"
      >
        CONFIDENCE
      </text>
    </g>
  );
};

// ===========================================================================
// 9. Regulatory Feed Monitor
// ===========================================================================
const FEED_TEMPLATES = [
  "MAC-CR-1247 · SHIELD",
  "NCD-UPDATE · PREVENT",
  "NCCI-Q2-2026 · SHIELD",
  "LCD-REVISION · PREVENT",
  "TiC-MRF-REFRESH · CONTRACT",
  "CARC-UPDATE · TRIAGE",
  "CMS-PFS-DELTA · SHIELD",
  "PAYER-POLICY-UHC · SENTINEL",
];

interface FeedEntry {
  id: number;
  text: string;
  spawnedAt: number;
}

const FEED_LIFE = 6; // seconds visible

const RegulatoryFeed = ({
  t,
  entries,
  cursorOn,
  livePulse,
  clipId,
}: {
  t: number;
  entries: FeedEntry[];
  cursorOn: boolean;
  livePulse: number;
  clipId: string;
}) => {
  const innerX = 4;
  const innerY = 16;
  const innerW = CELL_W - 8;
  const innerH = CELL_H - innerY - 4;
  const topY = innerY + 2;
  const bottomY = innerY + innerH - 4;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={innerX} y={innerY} width={innerW} height={innerH} rx={2} />
        </clipPath>
      </defs>
      <rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={innerH}
        rx={2}
        fill="#030A12"
        stroke="#0F2A0F"
        strokeWidth={1}
      />
      {/* LIVE indicator */}
      <g transform={`translate(${CELL_W - 38} 9)`}>
        <circle cx={0} cy={3} r={2.5} fill="#10B981" opacity={0.55 + 0.45 * livePulse} />
        <text x={6} y={5} fontSize={6} fill="#10B981" fontFamily="monospace">
          LIVE
        </text>
      </g>

      <g clipPath={`url(#${clipId})`}>
        {entries.map((e) => {
          const age = t - e.spawnedAt;
          const prog = Math.min(1, Math.max(0, age / FEED_LIFE));
          const y = bottomY - prog * (bottomY - topY);
          const fade =
            prog < 0.1
              ? prog / 0.1
              : prog > 0.85
                ? (1 - prog) / 0.15
                : 1;
          return (
            <text
              key={e.id}
              x={innerX + 6}
              y={y}
              fontSize={7}
              fill="#10B981"
              fontFamily="monospace"
              opacity={Math.max(0, Math.min(1, fade))}
            >
              {e.text}
            </text>
          );
        })}
      </g>

      {/* Blinking cursor */}
      <text
        x={innerX + 6}
        y={innerY + innerH - 4}
        fontSize={9}
        fill="#10B981"
        fontFamily="monospace"
        opacity={cursorOn ? 0.9 : 0.15}
      >
        _
      </text>
    </g>
  );
};

// ===========================================================================
// Main component
// ===========================================================================
const PlatformMissionControl = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [t, setT] = useState(0); // elapsed seconds
  const [now, setNow] = useState<Date>(() => new Date());

  // Crucible packet state (mutable, lives in a ref)
  const packetsRef = useRef<Packet[]>([]);
  const packetIdRef = useRef(0);
  const lastPacketSpawnRef = useRef<number[]>([0, 0, 0]);
  const accumRef = useRef<number[]>([6, 6, 6]);

  // Regulatory feed state
  const feedRef = useRef<FeedEntry[]>([]);
  const feedIdRef = useRef(0);
  const lastFeedSpawnRef = useRef(-2); // spawn one quickly
  const feedTplIdxRef = useRef(0);

  // Render-trigger ticks (we re-render every frame using setT, but we also
  // need state updates to flow for packet/feed changes — they live in refs
  // and re-render piggybacks on setT).
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const clipId = useRef(`pmc-clip-${Math.random().toString(36).slice(2)}`);

  // IntersectionObserver
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
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Single rAF loop drives every instrument
  useEffect(() => {
    if (!visible) return;
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsedMs = ts - startRef.current;
      const elapsedSec = elapsedMs / 1000;

      // --- Crucible packets ---
      const railSpan = (CELL_W - 70 - 14) - 20; // travel distance
      const spawnInterval = [1.6, 2.0, 2.6];
      for (let r = 0; r < 3; r++) {
        if (elapsedSec - lastPacketSpawnRef.current[r] >= spawnInterval[r]) {
          lastPacketSpawnRef.current[r] = elapsedSec;
          const speed = railSpan / (1.5 + r * 0.5); // px/s
          packetsRef.current.push({
            id: ++packetIdRef.current,
            rail: r,
            speed,
            x: 0,
          });
        }
      }
      // Advance packets at ~1/60s per frame; reap on arrival and pulse the
      // matching accumulator at the right end of the rail.
      const advanced: Packet[] = [];
      for (const p of packetsRef.current) {
        p.x += p.speed * (1 / 60);
        if (p.x >= railSpan) {
          accumRef.current[p.rail] = Math.min(28, accumRef.current[p.rail] + 4);
        } else {
          advanced.push(p);
        }
      }
      packetsRef.current = advanced;
      // Slow decay
      for (let r = 0; r < 3; r++) {
        accumRef.current[r] = Math.max(6, accumRef.current[r] - 0.15);
      }

      // --- Regulatory feed ---
      if (elapsedSec - lastFeedSpawnRef.current >= 1.8) {
        lastFeedSpawnRef.current = elapsedSec;
        const ts2 = new Date(Date.now());
        const hh = ts2.getHours().toString().padStart(2, "0");
        const mm = ts2.getMinutes().toString().padStart(2, "0");
        const ss = ts2.getSeconds().toString().padStart(2, "0");
        const tpl = FEED_TEMPLATES[feedTplIdxRef.current % FEED_TEMPLATES.length];
        feedTplIdxRef.current++;
        feedRef.current.push({
          id: ++feedIdRef.current,
          text: `[${hh}:${mm}:${ss}] ${tpl}`,
          spawnedAt: elapsedSec,
        });
      }
      // Reap old entries
      feedRef.current = feedRef.current.filter(
        (e) => elapsedSec - e.spawnedAt <= FEED_LIFE,
      );

      setT(elapsedSec);
      setNow(new Date());

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  // Cursor blink derived from t
  const cursorOn = Math.floor(t * 2) % 2 === 0;
  const livePulse = (Math.sin(t * Math.PI * 2 * 0.6) + 1) / 2;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full ${visible ? "animate-fade-in" : "opacity-0"}`}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Row 1 */}
        <Bezel col={0} row={0} label="MODULE STATUS">
          <ModuleStatusBoard t={t} />
        </Bezel>
        <Bezel col={1} row={0} label="SHIELD PERFORMANCE">
          <ClaimRateGauge t={t} />
        </Bezel>
        <Bezel col={2} row={0} label="CRUCIBLE INGEST">
          <CrucibleThroughput
            t={t}
            packets={packetsRef.current}
            accumHeights={accumRef.current}
            livePulse={livePulse}
          />
        </Bezel>

        {/* Row 2 */}
        <Bezel col={0} row={1} label="PAYER COVERAGE">
          <PayerCoverageGrid t={t} />
        </Bezel>
        <Bezel col={1} row={1} label="RECOVERY VALUE">
          <RecoveryOdometer t={t} />
        </Bezel>
        <Bezel col={2} row={1} label="SYSTEM CLOCK">
          <SystemClock now={now} elapsedSec={t} />
        </Bezel>

        {/* Row 3 */}
        <Bezel col={0} row={2} label="BAA SHIELD STATUS">
          <BaaStatus t={t} />
        </Bezel>
        <Bezel col={1} row={2} label="APPEAL CONFIDENCE">
          <AppealThermometer t={t} />
        </Bezel>
        <Bezel col={2} row={2} label="REGULATORY FEED">
          <RegulatoryFeed
            t={t}
            entries={feedRef.current}
            cursorOn={cursorOn}
            livePulse={livePulse}
            clipId={clipId.current}
          />
        </Bezel>
      </svg>
    </div>
  );
};

export default PlatformMissionControl;
