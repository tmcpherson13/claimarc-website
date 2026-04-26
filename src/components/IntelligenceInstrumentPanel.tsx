import { useEffect, useRef, useState } from "react";

/**
 * IntelligenceInstrumentPanel — Bloomberg-terminal-meets-flight-deck
 * decorative SVG panel of nine module-specific "instruments". Pure SVG +
 * a single requestAnimationFrame loop. IntersectionObserver gates the
 * animation until the component is on screen.
 *
 * One instrument per ZDefense module, laid out in a 3x3 grid.
 */

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

// ----- shared visual tokens -----
const BEZEL_FILL = "#0A1628";
const BEZEL_STROKE = "#1E3A5F";
const PANEL_FILL = "#060E1A";
const GRID = "#1E3A5F";
const LABEL = "#475569";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const CYAN = "#06B6D4";
const GREEN = "#10B981";
const TEXT_DIM = "#64748B";

const MONO = "ui-monospace, SFMono-Regular, monospace";

// ----- 3x3 grid layout in 1200x380 viewBox -----
const PAD_X = 10;
const PAD_Y = 10;
const GAP = 8;
const CELL_W = (1200 - PAD_X * 2 - GAP * 2) / 3; // ~388
const CELL_H = (380 - PAD_Y * 2 - GAP * 2) / 3; // ~118
const cellPos = (col: number, row: number) => ({
  x: PAD_X + col * (CELL_W + GAP),
  y: PAD_Y + row * (CELL_H + GAP),
});

// ----- Bezel helper -----
const Bezel = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={8}
    fill={BEZEL_FILL}
    stroke={BEZEL_STROKE}
    strokeWidth={1.5}
  />
);

// Build an SVG arc path between two angles (radians)
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const delta = endAngle - startAngle;
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweep = delta >= 0 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`;
}

// Module label header (top-left of each cell)
const CellLabel = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text
    x={x + 10}
    y={y + 13}
    fontSize={7}
    fontFamily={MONO}
    fill={LABEL}
    letterSpacing={1}
  >
    {text}
  </text>
);

const IntelligenceInstrumentPanel = ({
  className = "",
}: {
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
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
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      setTick((n) => (n + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;
  const t = elapsed / 1000;

  // ============================================================
  // INSTRUMENT 1 — SENTINEL · PAYER WEAPONIZATION INDEX (radial gauge)
  // ============================================================
  const s1 = cellPos(0, 0);
  const wiVal = 2.0 + Math.sin((t / 14) * TAU) * 0.6; // 1.4–2.6
  const wiZone =
    wiVal < 1.5 ? "MODERATE" : wiVal < 2.0 ? "ELEVATED" : "CRITICAL";
  const wiZoneColor = wiVal < 1.5 ? GREEN : wiVal < 2.0 ? AMBER : RED;
  const wiCx = s1.x + CELL_W / 2;
  const wiCy = s1.y + 68;
  const wiR = 38;
  const wiStartDeg = 150;
  const wiEndDeg = 30; // arc goes 150° → 390° (i.e. 30°), 240° span
  const wiSpan = 240;
  // Zones in WI value space: 1.0–1.5 green, 1.5–2.0 amber, 2.0–3.0 red
  const wiValToDeg = (v: number) =>
    wiStartDeg + ((v - 1.0) / 2.0) * wiSpan;
  const wiZ1End = wiValToDeg(1.5);
  const wiZ2End = wiValToDeg(2.0);
  const wiZ3End = wiValToDeg(3.0);
  const wiNeedleDeg = wiValToDeg(Math.max(1.0, Math.min(3.0, wiVal)));
  const wiNeedleRad = wiNeedleDeg * DEG;
  const wiNx = wiCx + (wiR - 4) * Math.cos(wiNeedleRad);
  const wiNy = wiCy + (wiR - 4) * Math.sin(wiNeedleRad);

  // ============================================================
  // INSTRUMENT 2 — CONTRACTINTEL · RATE POSITION (horizontal bars)
  // ============================================================
  const s2 = cellPos(1, 0);
  const payers = ["UHC", "BCBS", "AETNA", "CIGNA", "HUMANA", "MOLINA", "CENTENE"];
  const ciPlotX = s2.x + 60;
  const ciPlotY = s2.y + 22;
  const ciPlotW = CELL_W - 70;
  const ciPlotH = CELL_H - 30;
  const ciRowH = ciPlotH / payers.length;
  const ciBarH = ciRowH - 3;
  // 50th percentile marker
  const ciMarkerX = ciPlotX + ciPlotW * 0.5;

  // ============================================================
  // INSTRUMENT 3 — FORECAST · 90-DAY PROJECTION (curve)
  // ============================================================
  const s3 = cellPos(2, 0);
  const fxPlotX = s3.x + 14;
  const fxPlotY = s3.y + 24;
  const fxPlotW = CELL_W - 110; // leave room for value
  const fxPlotH = CELL_H - 36;
  const fxN = 60;
  const fxPoints: { x: number; y: number; yU: number; yL: number }[] = [];
  for (let i = 0; i < fxN; i++) {
    const x = fxPlotX + (i / (fxN - 1)) * fxPlotW;
    // Trend: y declines (upward visually) over time. Add gentle sine.
    const trend = 1 - i / (fxN - 1); // 1 → 0
    const wobble = Math.sin(i * 0.42 + t * 0.6) * 0.06;
    const v = trend * 0.7 + wobble + 0.15; // 0.15..0.91
    const y = fxPlotY + v * fxPlotH;
    const band = 6 + (i / fxN) * 8;
    fxPoints.push({ x, y, yU: y - band, yL: y + band });
  }
  const fxLine = fxPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fxBand =
    `M ${fxPoints[0].x.toFixed(1)} ${fxPoints[0].yU.toFixed(1)} ` +
    fxPoints
      .slice(1)
      .map((p) => `L ${p.x.toFixed(1)} ${p.yU.toFixed(1)}`)
      .join(" ") +
    " " +
    fxPoints
      .slice()
      .reverse()
      .map((p) => `L ${p.x.toFixed(1)} ${p.yL.toFixed(1)}`)
      .join(" ") +
    " Z";
  // Day 45 = i index 45/90 * (fxN-1)
  const fxTodayIdx = Math.round((45 / 90) * (fxN - 1));
  const fxTodayX = fxPoints[fxTodayIdx].x;

  // ============================================================
  // INSTRUMENT 4 — SHIELD · INTERCEPTION RATE (flow meter)
  // ============================================================
  const s4 = cellPos(0, 1);
  const shInX = s4.x + 50;
  const shOutX = s4.x + CELL_W - 70;
  const shTop = s4.y + 24;
  const shBot = s4.y + CELL_H - 12;
  const shH = shBot - shTop;
  const shRectW = 18;
  const shRectH = 6;
  const shGap = 8;
  const shStep = shRectH + shGap;
  // Animate downward
  const shInOffset = (t * 28) % shStep;
  const shOutOffset = (t * 22) % shStep;
  const shCount = Math.floor(shH / shStep) + 2;
  const shPulse = 0.85 + Math.sin(t * 1.5) * 0.15;

  // ============================================================
  // INSTRUMENT 5 — PREVENT · PA LEAD TIME (countdown ring)
  // ============================================================
  const s5 = cellPos(1, 1);
  const pvCx = s5.x + CELL_W / 2;
  const pvCy = s5.y + 60;
  const pvR = 32;
  const pvCycle = (t % 8) / 8; // 0→1 over 8s
  const pvFrac = 1 - pvCycle; // ring depletes
  const pvColor = pvFrac < 0.25 ? AMBER : GREEN;
  const pvArcDeg = pvFrac * 359.9;
  const pvArc =
    pvArcDeg <= 0.1
      ? ""
      : arcPath(pvCx, pvCy, pvR, -90 * DEG, (-90 + pvArcDeg) * DEG);

  // ============================================================
  // INSTRUMENT 6 — LEDGER · UNDERPAYMENT TRACKER
  // ============================================================
  const s6 = cellPos(2, 1);
  const ldOwed = 284 + Math.sin(t * 0.6) * 8; // K
  const ldRecov = 218 + Math.sin(t * 0.5 + 1) * 10; // K
  const ldRecovFrac = ldRecov / ldOwed;
  const ldColLX = s6.x + CELL_W * 0.28;
  const ldColRX = s6.x + CELL_W * 0.72;
  const ldBarY = s6.y + 78;
  const ldBarW = CELL_W * 0.32;
  const ldGapPulse = 0.5 + Math.sin(t * 0.8) * 0.25;

  // ============================================================
  // INSTRUMENT 7 — TRIAGE · DENIAL QUEUE
  // ============================================================
  const s7 = cellPos(0, 2);
  const trEntries = [
    { code: "CO-50", amt: "$1,240", prob: 0.86 },
    { code: "CO-16", amt: "$3,410", prob: 0.72 },
    { code: "CO-97", amt: "$890", prob: 0.58 },
    { code: "PR-1", amt: "$2,180", prob: 0.41 },
    { code: "CO-4", amt: "$740", prob: 0.91 },
    { code: "CO-22", amt: "$1,660", prob: 0.66 },
    { code: "CO-11", amt: "$520", prob: 0.34 },
  ];
  const trCycleS = 2.5;
  const trShiftIdx = Math.floor(t / trCycleS) % trEntries.length;
  const trProgress = (t % trCycleS) / trCycleS; // 0→1
  const trVisible = 5;
  const trRowH = 14;
  const trListX = s7.x + 10;
  const trListY = s7.y + 22;

  // ============================================================
  // INSTRUMENT 8 — EVIDENCE · ASSEMBLY STATUS
  // ============================================================
  const s8 = cellPos(1, 2);
  const evRows = [
    { label: "CLINICAL NOTES", dur: 2.4 },
    { label: "AUTHORIZATION", dur: 3.1 },
    { label: "MODIFIER HISTORY", dur: 2.8 },
    { label: "COVERAGE RULE", dur: 3.6 },
  ];
  // One full cycle: max(dur) + 0.8 hold + 0.8 ready flash + small reset
  const evMaxDur = Math.max(...evRows.map((r) => r.dur));
  const evCycleDur = evMaxDur + 1.6;
  const evCycleT = t % evCycleDur;
  const evReady = evCycleT > evMaxDur && evCycleT < evMaxDur + 0.8;
  const evRowFill = (dur: number) => Math.min(1, evCycleT / dur);
  const evLabelX = s8.x + 12;
  const evBarX = s8.x + 130;
  const evBarW = CELL_W - 145;
  const evBarH = 6;
  const evRowGap = 4;
  const evStartY = s8.y + 26;

  // ============================================================
  // INSTRUMENT 9 — RESOLVE · APPEAL OUTPUT (counter)
  // ============================================================
  const s9 = cellPos(2, 2);
  // Cycle: 1.5s count up, 1s hold "10 LETTERS", 1s show "8 SECONDS", reset.
  const rsCycle = 3.5;
  const rsT = t % rsCycle;
  let rsCount = 0;
  let rsLine2 = "10 LETTERS";
  if (rsT < 1.5) {
    rsCount = Math.min(10, Math.floor((rsT / 1.5) * 10));
    rsLine2 = "GENERATING";
  } else if (rsT < 2.5) {
    rsCount = 10;
    rsLine2 = "10 LETTERS";
  } else {
    rsCount = 10;
    rsLine2 = "8 SECONDS";
  }
  const rsCx = s9.x + CELL_W / 2;
  const rsConfX = s9.x + 30;
  const rsConfW = CELL_W - 60;
  const rsConfY = s9.y + CELL_H - 18;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 380"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ============================================================
            INSTRUMENT 1 — SENTINEL · PAYER WI
           ============================================================ */}
        <g>
          <Bezel x={s1.x} y={s1.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s1.x} y={s1.y} text="SENTINEL · PAYER WI" />
          {/* zone arcs */}
          <path
            d={arcPath(wiCx, wiCy, wiR, wiStartDeg * DEG, wiZ1End * DEG)}
            stroke={GREEN}
            strokeWidth={5}
            fill="none"
            opacity={0.55}
            strokeLinecap="butt"
          />
          <path
            d={arcPath(wiCx, wiCy, wiR, wiZ1End * DEG, wiZ2End * DEG)}
            stroke={AMBER}
            strokeWidth={5}
            fill="none"
            opacity={0.55}
            strokeLinecap="butt"
          />
          <path
            d={arcPath(wiCx, wiCy, wiR, wiZ2End * DEG, wiZ3End * DEG)}
            stroke={RED}
            strokeWidth={5}
            fill="none"
            opacity={0.55}
            strokeLinecap="butt"
          />
          {/* needle */}
          <line
            x1={wiCx}
            y1={wiCy}
            x2={wiNx}
            y2={wiNy}
            stroke={wiZoneColor}
            strokeWidth={1.5}
          />
          <circle cx={wiCx} cy={wiCy} r={2.5} fill={wiZoneColor} />
          {/* value */}
          <text
            x={wiCx}
            y={wiCy + 22}
            textAnchor="middle"
            fontSize={16}
            fontWeight="bold"
            fontFamily={MONO}
            fill={wiZoneColor}
          >
            {wiVal.toFixed(2)}x
          </text>
          <text
            x={wiCx}
            y={s1.y + CELL_H - 10}
            textAnchor="middle"
            fontSize={7}
            fontFamily={MONO}
            fill={wiZoneColor}
            letterSpacing={1}
          >
            THREAT LEVEL: {wiZone}
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 2 — CONTRACTINTEL · RATE POSITION
           ============================================================ */}
        <g>
          <Bezel x={s2.x} y={s2.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s2.x} y={s2.y} text="CONTRACTINTEL · RATE POSITION" />
          {payers.map((p, i) => {
            // independent sine; range 45..85 percentile
            const phase = i * 0.9;
            const period = 9 + i * 1.3;
            const pct = 65 + Math.sin((t / period) * TAU + phase) * 18; // 47..83
            const frac = pct / 100;
            const rowY = ciPlotY + i * ciRowH;
            const w = ciPlotW * frac;
            const fill = pct < 50 ? AMBER : pct > 60 ? GREEN : CYAN;
            return (
              <g key={`ci-${p}`}>
                <text
                  x={s2.x + 8}
                  y={rowY + ciBarH / 2 + 3}
                  fontSize={7}
                  fontFamily={MONO}
                  fill={LABEL}
                  letterSpacing={0.5}
                >
                  {p}
                </text>
                <rect
                  x={ciPlotX}
                  y={rowY}
                  width={ciPlotW}
                  height={ciBarH}
                  fill={PANEL_FILL}
                  stroke={GRID}
                  strokeWidth={0.5}
                />
                <rect
                  x={ciPlotX}
                  y={rowY}
                  width={w}
                  height={ciBarH}
                  fill={fill}
                  opacity={0.85}
                />
              </g>
            );
          })}
          {/* market 50th percentile line */}
          <line
            x1={ciMarkerX}
            y1={ciPlotY - 2}
            x2={ciMarkerX}
            y2={ciPlotY + ciPlotH}
            stroke={LABEL}
            strokeWidth={0.8}
            strokeDasharray="2 2"
          />
        </g>

        {/* ============================================================
            INSTRUMENT 3 — FORECAST · 90-DAY PROJECTION
           ============================================================ */}
        <g>
          <Bezel x={s3.x} y={s3.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s3.x} y={s3.y} text="FORECAST · 90-DAY PROJECTION" />
          {/* confidence band */}
          <path d={fxBand} fill={GREEN} opacity={0.08} />
          {/* line */}
          <polyline
            points={fxLine}
            fill="none"
            stroke={GREEN}
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* TODAY marker */}
          <line
            x1={fxTodayX}
            y1={fxPlotY}
            x2={fxTodayX}
            y2={fxPlotY + fxPlotH}
            stroke={LABEL}
            strokeWidth={0.8}
            strokeDasharray="2 2"
          />
          <text
            x={fxTodayX + 3}
            y={fxPlotY + 9}
            fontSize={6}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={0.5}
          >
            TODAY
          </text>
          {/* terminal value */}
          <text
            x={s3.x + CELL_W - 12}
            y={s3.y + 50}
            textAnchor="end"
            fontSize={16}
            fontWeight="bold"
            fontFamily={MONO}
            fill={GREEN}
          >
            $12.6M
          </text>
          <text
            x={s3.x + CELL_W - 12}
            y={s3.y + 64}
            textAnchor="end"
            fontSize={7}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            84% CONFIDENCE
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 4 — SHIELD · INTERCEPTION RATE
           ============================================================ */}
        <g>
          <Bezel x={s4.x} y={s4.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s4.x} y={s4.y} text="SHIELD · INTERCEPTION RATE" />
          <defs>
            <clipPath id={`sh-clip-in-${0}`}>
              <rect x={shInX - shRectW / 2} y={shTop} width={shRectW} height={shH} />
            </clipPath>
            <clipPath id={`sh-clip-out-${0}`}>
              <rect
                x={shOutX - shRectW / 2}
                y={shTop}
                width={shRectW}
                height={shH}
              />
            </clipPath>
          </defs>
          {/* INBOUND column */}
          <text
            x={shInX}
            y={shTop - 4}
            textAnchor="middle"
            fontSize={6}
            fontFamily={MONO}
            fill={AMBER}
            letterSpacing={1}
          >
            INBOUND
          </text>
          <g clipPath={`url(#sh-clip-in-${0})`}>
            {Array.from({ length: shCount }).map((_, i) => {
              const y = shTop + i * shStep + shInOffset - shStep;
              return (
                <rect
                  key={`sh-in-${i}`}
                  x={shInX - shRectW / 2}
                  y={y}
                  width={shRectW}
                  height={shRectH}
                  fill={AMBER}
                  opacity={0.6}
                  rx={1}
                />
              );
            })}
          </g>
          {/* CLEAN column */}
          <text
            x={shOutX}
            y={shTop - 4}
            textAnchor="middle"
            fontSize={6}
            fontFamily={MONO}
            fill={GREEN}
            letterSpacing={1}
          >
            CLEAN
          </text>
          <g clipPath={`url(#sh-clip-out-${0})`}>
            {Array.from({ length: shCount }).map((_, i) => {
              const y = shTop + i * shStep + shOutOffset - shStep;
              return (
                <rect
                  key={`sh-out-${i}`}
                  x={shOutX - shRectW / 2}
                  y={y}
                  width={shRectW}
                  height={shRectH}
                  fill={GREEN}
                  opacity={0.85}
                  rx={1}
                />
              );
            })}
          </g>
          {/* interception line */}
          <line
            x1={shInX + shRectW / 2 + 2}
            y1={s4.y + CELL_H / 2 + 4}
            x2={shOutX - shRectW / 2 - 6}
            y2={s4.y + CELL_H / 2 + 4}
            stroke={CYAN}
            strokeWidth={0.8}
            opacity={0.7}
          />
          <polygon
            points={`${shOutX - shRectW / 2 - 6},${s4.y + CELL_H / 2 + 4} ${shOutX - shRectW / 2 - 10},${s4.y + CELL_H / 2 + 1} ${shOutX - shRectW / 2 - 10},${s4.y + CELL_H / 2 + 7}`}
            fill={CYAN}
            opacity={0.8}
          />
          {/* central readout */}
          <text
            x={s4.x + CELL_W / 2}
            y={s4.y + CELL_H / 2 - 6}
            textAnchor="middle"
            fontSize={18}
            fontWeight="bold"
            fontFamily={MONO}
            fill={GREEN}
            opacity={shPulse}
          >
            89.4%
          </text>
          <text
            x={s4.x + CELL_W / 2}
            y={s4.y + CELL_H - 8}
            textAnchor="middle"
            fontSize={7}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            CLEAN CLAIM RATE
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 5 — PREVENT · PA LEAD TIME
           ============================================================ */}
        <g>
          <Bezel x={s5.x} y={s5.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s5.x} y={s5.y} text="PREVENT · PA LEAD TIME" />
          {/* base ring */}
          <circle
            cx={pvCx}
            cy={pvCy}
            r={pvR}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={1}
          />
          {/* depleting arc */}
          {pvArc && (
            <path
              d={pvArc}
              stroke={pvColor}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          )}
          {/* big number */}
          <text
            x={pvCx}
            y={pvCy + 6}
            textAnchor="middle"
            fontSize={22}
            fontWeight="bold"
            fontFamily={MONO}
            fill={pvColor}
          >
            11
          </text>
          <text
            x={pvCx}
            y={s5.y + CELL_H - 22}
            textAnchor="middle"
            fontSize={7}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            DAYS ADVANCE NOTICE
          </text>
          <text
            x={pvCx}
            y={s5.y + CELL_H - 10}
            textAnchor="middle"
            fontSize={6}
            fontFamily={MONO}
            fill={TEXT_DIM}
            letterSpacing={1}
          >
            PRIOR AUTH DETECTED
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 6 — LEDGER · UNDERPAYMENT TRACKER
           ============================================================ */}
        <g>
          <Bezel x={s6.x} y={s6.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s6.x} y={s6.y} text="LEDGER · UNDERPAYMENT TRACKER" />
          {/* OWED */}
          <text
            x={ldColLX}
            y={s6.y + 32}
            textAnchor="middle"
            fontSize={6}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            OWED
          </text>
          <text
            x={ldColLX}
            y={s6.y + 60}
            textAnchor="middle"
            fontSize={18}
            fontWeight="bold"
            fontFamily={MONO}
            fill={AMBER}
          >
            ${ldOwed.toFixed(0)}K
          </text>
          <rect
            x={ldColLX - ldBarW / 2}
            y={ldBarY}
            width={ldBarW}
            height={4}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={0.5}
          />
          <rect
            x={ldColLX - ldBarW / 2}
            y={ldBarY}
            width={ldBarW}
            height={4}
            fill={AMBER}
            opacity={0.85}
          />
          {/* RECOVERED */}
          <text
            x={ldColRX}
            y={s6.y + 32}
            textAnchor="middle"
            fontSize={6}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            RECOVERED
          </text>
          <text
            x={ldColRX}
            y={s6.y + 60}
            textAnchor="middle"
            fontSize={18}
            fontWeight="bold"
            fontFamily={MONO}
            fill={GREEN}
          >
            ${ldRecov.toFixed(0)}K
          </text>
          <rect
            x={ldColRX - ldBarW / 2}
            y={ldBarY}
            width={ldBarW}
            height={4}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={0.5}
          />
          <rect
            x={ldColRX - ldBarW / 2}
            y={ldBarY}
            width={ldBarW * ldRecovFrac}
            height={4}
            fill={GREEN}
            opacity={0.9}
          />
          {/* connecting line (gap) */}
          <line
            x1={ldColLX + ldBarW / 2 + 4}
            y1={s6.y + 60}
            x2={ldColRX - ldBarW / 2 - 4}
            y2={s6.y + 60}
            stroke={CYAN}
            strokeWidth={0.8}
            strokeDasharray="3 3"
            opacity={ldGapPulse}
          />
          <text
            x={s6.x + CELL_W / 2}
            y={s6.y + CELL_H - 8}
            textAnchor="middle"
            fontSize={7}
            fontFamily={MONO}
            fill={GREEN}
            letterSpacing={1}
          >
            60-DAY COMPLIANCE: ACTIVE
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 7 — TRIAGE · DENIAL QUEUE
           ============================================================ */}
        <g>
          <Bezel x={s7.x} y={s7.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s7.x} y={s7.y} text="TRIAGE · DENIAL QUEUE" />
          {Array.from({ length: trVisible }).map((_, i) => {
            const idx = (trShiftIdx + i) % trEntries.length;
            const e = trEntries[idx];
            // Top row fades out, bottom row fades in
            let opacity = 1;
            if (i === 0) opacity = 1 - trProgress;
            else if (i === trVisible - 1) opacity = trProgress;
            const rowY = trListY + i * trRowH;
            const probColor =
              e.prob > 0.8 ? GREEN : e.prob > 0.5 ? AMBER : RED;
            const barX = trListX + 110;
            const barW = CELL_W - 130;
            return (
              <g key={`tr-${i}`} opacity={opacity}>
                <text
                  x={trListX}
                  y={rowY + 8}
                  fontSize={7}
                  fontFamily={MONO}
                  fill={CYAN}
                  letterSpacing={0.5}
                >
                  {e.code}
                </text>
                <text
                  x={trListX + 42}
                  y={rowY + 8}
                  fontSize={7}
                  fontFamily={MONO}
                  fill={LABEL}
                >
                  {e.amt}
                </text>
                <rect
                  x={barX}
                  y={rowY + 2}
                  width={barW}
                  height={6}
                  fill={PANEL_FILL}
                  stroke={GRID}
                  strokeWidth={0.5}
                />
                <rect
                  x={barX}
                  y={rowY + 2}
                  width={barW * e.prob}
                  height={6}
                  fill={probColor}
                  opacity={0.9}
                />
              </g>
            );
          })}
          <text
            x={s7.x + CELL_W - 10}
            y={s7.y + CELL_H - 8}
            textAnchor="end"
            fontSize={8}
            fontFamily={MONO}
            fontWeight="bold"
            fill={GREEN}
            letterSpacing={1}
          >
            $847K PIPELINE
          </text>
        </g>

        {/* ============================================================
            INSTRUMENT 8 — EVIDENCE · ASSEMBLY STATUS
           ============================================================ */}
        <g>
          <Bezel x={s8.x} y={s8.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s8.x} y={s8.y} text="EVIDENCE · ASSEMBLY STATUS" />
          {evRows.map((r, i) => {
            const fill = evRowFill(r.dur);
            const rowY = evStartY + i * (evBarH + evRowGap + 8);
            return (
              <g key={`ev-${i}`}>
                <text
                  x={evLabelX}
                  y={rowY + evBarH}
                  fontSize={7}
                  fontFamily={MONO}
                  fill={LABEL}
                  letterSpacing={0.5}
                >
                  {r.label}
                </text>
                <rect
                  x={evBarX}
                  y={rowY}
                  width={evBarW}
                  height={evBarH}
                  fill={PANEL_FILL}
                  stroke={GRID}
                  strokeWidth={0.5}
                />
                <rect
                  x={evBarX}
                  y={rowY}
                  width={evBarW * fill}
                  height={evBarH}
                  fill={fill >= 1 ? GREEN : CYAN}
                  opacity={0.9}
                />
                <text
                  x={evBarX + evBarW + 4}
                  y={rowY + evBarH}
                  fontSize={6}
                  fontFamily={MONO}
                  fill={fill >= 1 ? GREEN : LABEL}
                >
                  {Math.round(fill * 100)}%
                </text>
              </g>
            );
          })}
          {evReady && (
            <text
              x={s8.x + CELL_W / 2}
              y={s8.y + CELL_H - 6}
              textAnchor="middle"
              fontSize={9}
              fontWeight="bold"
              fontFamily={MONO}
              fill={GREEN}
              letterSpacing={2}
            >
              PACKAGE READY
            </text>
          )}
        </g>

        {/* ============================================================
            INSTRUMENT 9 — RESOLVE · APPEAL OUTPUT
           ============================================================ */}
        <g>
          <Bezel x={s9.x} y={s9.y} width={CELL_W} height={CELL_H} />
          <CellLabel x={s9.x} y={s9.y} text="RESOLVE · APPEAL OUTPUT" />
          <text
            x={rsCx}
            y={s9.y + 58}
            textAnchor="middle"
            fontSize={32}
            fontWeight="bold"
            fontFamily={MONO}
            fill={GREEN}
          >
            {rsCount.toString().padStart(2, "0")}
          </text>
          <text
            x={rsCx}
            y={s9.y + 76}
            textAnchor="middle"
            fontSize={8}
            fontFamily={MONO}
            fill={rsLine2 === "8 SECONDS" ? CYAN : LABEL}
            letterSpacing={2}
          >
            {rsLine2}
          </text>
          {/* confidence bar */}
          <rect
            x={rsConfX}
            y={rsConfY}
            width={rsConfW}
            height={5}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={0.5}
          />
          <rect
            x={rsConfX}
            y={rsConfY}
            width={rsConfW * 0.78}
            height={5}
            fill={GREEN}
            opacity={0.9}
          />
          <text
            x={rsConfX + rsConfW}
            y={rsConfY - 3}
            textAnchor="end"
            fontSize={6}
            fontFamily={MONO}
            fill={LABEL}
            letterSpacing={1}
          >
            CONFIDENCE 78%
          </text>
        </g>
      </svg>
    </div>
  );
};

export default IntelligenceInstrumentPanel;
