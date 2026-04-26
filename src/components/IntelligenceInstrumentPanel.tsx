import { useEffect, useMemo, useRef, useState } from "react";

/**
 * IntelligenceInstrumentPanel — Bloomberg-terminal-meets-flight-deck
 * decorative SVG panel of six live "instruments". Pure SVG + a single
 * requestAnimationFrame loop. IntersectionObserver gates the animation
 * until the component is on screen.
 *
 * Vibe: amber + cyan instrument lighting on deep navy. Every element
 * looks like it's measuring something real.
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

// ----- ticker text -----
const TICKER_ENTRY =
  "CO-50 · $1,240 · MEDICAL NECESSITY ·· CO-16 · $3,410 · MISSING INFO ·· CO-97 · $890 · BUNDLED ·· PR-1 · $2,180 · DEDUCTIBLE ·· CO-4 · $740 · MODIFIER ·· CO-22 · $1,660 · COB ·· ";
const TICKER_TEXT = TICKER_ENTRY + TICKER_ENTRY;
const TICKER_SPEED_PX_PER_S = 40;
// Approx pixel width per char at fontSize=8 monospace ≈ 4.8px
const TICKER_WIDTH_PX = TICKER_ENTRY.length * 4.8;

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

// Build an SVG arc path between two angles (radians, 0 = +x, clockwise positive in screen coords)
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

// Spectrum bar config — fixed periods/phases per bar so the animation
// is deterministic and harmonically interesting.
const BAR_COUNT = 16;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => ({
  periodMs: 6000 + ((i * 547) % 8000), // 6–14s
  phase: (i * 0.83) % TAU,
  baseFreqOffset: i * 0.41,
}));

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
  const elapsedS = elapsed / 1000;

  // ---- Denial Rate Gauge values ----
  const denialPct = 11 + Math.sin((elapsedS / 12) * TAU) * 3; // 8–14%
  // Map 8% → 210°, 18% → 330°. Active arc spans 210→330 (120° total).
  const startDeg = 210;
  const endDeg = 330;
  // Map denialPct in [8, 18] → fraction in [0, 1]
  const denialFrac = Math.max(0, Math.min(1, (denialPct - 8) / 10));
  const fillEndDeg = startDeg + (endDeg - startDeg) * denialFrac;
  const denialColor = denialPct < 10 ? AMBER : RED;
  const gaugeCx = 120;
  const gaugeCy = 140;
  const gaugeR = 80;
  const trackPath = arcPath(
    gaugeCx,
    gaugeCy,
    gaugeR,
    startDeg * DEG,
    endDeg * DEG
  );
  const fillPath = arcPath(
    gaugeCx,
    gaugeCy,
    gaugeR,
    startDeg * DEG,
    fillEndDeg * DEG
  );
  const needleRad = fillEndDeg * DEG;
  const needleX = gaugeCx + gaugeR * Math.cos(needleRad);
  const needleY = gaugeCy + gaugeR * Math.sin(needleRad);

  // ---- Payer Activity EKG ----
  const ekgX = 230;
  const ekgY = 50;
  const ekgW = 220;
  const ekgH = 180;
  const ekgInnerPadX = 10;
  const ekgInnerPadY = 24;
  const ekgPlotX = ekgX + ekgInnerPadX;
  const ekgPlotY = ekgY + ekgInnerPadY;
  const ekgPlotW = ekgW - ekgInnerPadX * 2;
  const ekgPlotH = ekgH - ekgInnerPadY - ekgInnerPadX;
  const ekgBaseline = ekgPlotY + ekgPlotH / 2;
  const ekgAmplitude = 35;
  // Phase advances 0.012 per frame at ~60fps → 0.72/s
  const ekgPhase = elapsedS * 0.72;
  const ekgPoints = useMemo(() => Array.from({ length: 90 }), []);
  const ekgPolyline = ekgPoints
    .map((_, i) => {
      const x = ekgPlotX + (i / 89) * ekgPlotW;
      const y =
        ekgBaseline +
        ekgAmplitude *
          Math.sin(i * 0.18 + ekgPhase) *
          // Layer a subtle secondary wave for organic feel
          (0.85 + 0.15 * Math.sin(i * 0.07 + ekgPhase * 0.6));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const ekgScanX = ekgPlotX + ekgPlotW;

  // ---- Spectrum bars ----
  const specX = 470;
  const specY = 50;
  const specW = 160;
  const specH = 180;
  const specInnerPadX = 10;
  const specInnerPadTop = 22;
  const specInnerPadBot = 14;
  const specPlotX = specX + specInnerPadX;
  const specPlotY = specY + specInnerPadTop;
  const specPlotW = specW - specInnerPadX * 2;
  const specPlotH = specH - specInnerPadTop - specInnerPadBot;
  const specBaselineY = specPlotY + specPlotH;
  const specBarGap = 2;
  const specBarW = (specPlotW - specBarGap * (BAR_COUNT - 1)) / BAR_COUNT;

  // ---- Compliance Countdown ----
  const dialCx = 720;
  const dialCy = 140;
  const dialR = 75;
  const cyclePeriodS = 15;
  const cycleT = (elapsedS % cyclePeriodS) / cyclePeriodS; // 0→1
  const daysRemainingFloat = 60 * (1 - cycleT);
  const daysRemaining = Math.max(0, Math.ceil(daysRemainingFloat));
  let dialColor = GREEN;
  if (daysRemaining <= 10) dialColor = RED;
  else if (daysRemaining <= 20) dialColor = AMBER;
  // Arc from top (12 o'clock = -90°) clockwise representing days remaining.
  // Full = 360° at 60 days, 0° at 0 days.
  const dialArcDeg = (daysRemainingFloat / 60) * 360;
  const dialStart = -90 * DEG;
  const dialEnd = (-90 + dialArcDeg) * DEG;
  // Avoid degenerate full circle (arcPath can't draw a 360° arc as a single A)
  const dialArcEnd = dialArcDeg >= 359.9 ? (-90 + 359.9) * DEG : dialEnd;
  const dialArcPath =
    dialArcDeg <= 0.1
      ? ""
      : arcPath(dialCx, dialCy, dialR - 8, dialStart, dialArcEnd);

  // ---- Weaponization Index Signal Meter ----
  const wiCx = 890;
  const wiCy = 140;
  const wiW = 120;
  const wiH = 180;
  const wiBezelX = wiCx - wiW / 2;
  const wiBezelY = wiCy - wiH / 2;
  const wiValue = 1.9 + Math.sin((elapsedS / 10) * TAU) * 0.7; // 1.2–2.6
  // Map 1.2→0 bars, 2.6→8 bars
  const wiBarsLitFloat = ((wiValue - 1.2) / (2.6 - 1.2)) * 8;
  const wiBarsLit = Math.max(0, Math.min(8, Math.round(wiBarsLitFloat)));

  // ---- Ticker ----
  const tickerY = 240;
  const tickerH = 28;
  const tickerScrollX =
    -((elapsedS * TICKER_SPEED_PX_PER_S) % TICKER_WIDTH_PX);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 280"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="iip-ticker-clip">
            <rect x={70} y={tickerY + 1} width={1200 - 70 - 4} height={tickerH - 2} />
          </clipPath>
        </defs>

        {/* ============== DENIAL RATE GAUGE ============== */}
        <g>
          <Bezel x={gaugeCx - 90} y={gaugeCy - 90} width={180} height={180} />
          <circle
            cx={gaugeCx}
            cy={gaugeCy}
            r={gaugeR}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={1}
          />
          {/* track */}
          <path
            d={trackPath}
            stroke={GRID}
            strokeWidth={6}
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
          />
          {/* fill */}
          <path
            d={fillPath}
            stroke={denialColor}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          {/* needle */}
          <line
            x1={gaugeCx}
            y1={gaugeCy}
            x2={needleX}
            y2={needleY}
            stroke={AMBER}
            strokeWidth={1.5}
          />
          <circle cx={gaugeCx} cy={gaugeCy} r={3} fill={AMBER} />
          {/* value */}
          <text
            x={gaugeCx}
            y={gaugeCy + 6}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={AMBER}
          >
            {denialPct.toFixed(1)}%
          </text>
          <text
            x={gaugeCx}
            y={gaugeCy + 22}
            textAnchor="middle"
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            DENIAL RATE
          </text>
        </g>

        {/* ============== PAYER ACTIVITY EKG ============== */}
        <g>
          <Bezel x={ekgX} y={ekgY} width={ekgW} height={ekgH} />
          <rect
            x={ekgPlotX}
            y={ekgPlotY}
            width={ekgPlotW}
            height={ekgPlotH}
            fill={PANEL_FILL}
          />
          {/* x-axis ticks every 20px */}
          {Array.from({ length: Math.floor(ekgPlotW / 20) + 1 }).map((_, i) => {
            const x = ekgPlotX + i * 20;
            return (
              <line
                key={`ekg-tick-${i}`}
                x1={x}
                y1={ekgPlotY + ekgPlotH - 2}
                x2={x}
                y2={ekgPlotY + ekgPlotH + 2}
                stroke={GRID}
                strokeWidth={1}
              />
            );
          })}
          {/* baseline */}
          <line
            x1={ekgPlotX}
            y1={ekgBaseline}
            x2={ekgPlotX + ekgPlotW}
            y2={ekgBaseline}
            stroke={GRID}
            strokeWidth={0.5}
            opacity={0.5}
          />
          <polyline
            points={ekgPolyline}
            fill="none"
            stroke={CYAN}
            strokeWidth={1.5}
            opacity={0.9}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* scan line */}
          <line
            x1={ekgScanX}
            y1={ekgPlotY}
            x2={ekgScanX}
            y2={ekgPlotY + ekgPlotH}
            stroke={CYAN}
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={ekgX + 8}
            y={ekgY + 14}
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            PAYER ACTIVITY — 90 DAY
          </text>
          <text
            x={ekgScanX - 4}
            y={ekgPlotY + 9}
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={CYAN}
            textAnchor="end"
            letterSpacing={1}
          >
            NOW
          </text>
        </g>

        {/* ============== CLAIM VOLUME SPECTRUM ============== */}
        <g>
          <Bezel x={specX} y={specY} width={specW} height={specH} />
          <rect
            x={specPlotX}
            y={specPlotY}
            width={specPlotW}
            height={specPlotH}
            fill={PANEL_FILL}
          />
          {BARS.map((b, i) => {
            const phase = (elapsedS / (b.periodMs / 1000)) * TAU + b.phase;
            const norm = (Math.sin(phase) + 1) / 2; // 0–1
            const h = 20 + norm * 100; // 20–120
            const x = specPlotX + i * (specBarW + specBarGap);
            const y = specBaselineY - h;
            let fill = GRID;
            let opacity = 1;
            if (h > 80) {
              fill = CYAN;
              opacity = 0.9;
            } else if (h > 50) {
              fill = CYAN;
              opacity = 0.6;
            } else {
              fill = GRID;
              opacity = 1;
            }
            return (
              <rect
                key={`spec-${i}`}
                x={x}
                y={y}
                width={specBarW}
                height={h}
                fill={fill}
                opacity={opacity}
                rx={1}
              />
            );
          })}
          {/* baseline */}
          <line
            x1={specPlotX}
            y1={specBaselineY}
            x2={specPlotX + specPlotW}
            y2={specBaselineY}
            stroke={GRID}
            strokeWidth={1}
          />
          <text
            x={specX + 8}
            y={specY + 14}
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            CLAIM VOLUME DISTRIBUTION
          </text>
        </g>

        {/* ============== COMPLIANCE COUNTDOWN DIAL ============== */}
        <g>
          <Bezel
            x={dialCx - 87.5}
            y={dialCy - 87.5}
            width={175}
            height={175}
          />
          <circle
            cx={dialCx}
            cy={dialCy}
            r={dialR}
            fill={PANEL_FILL}
            stroke={GRID}
            strokeWidth={1}
          />
          {/* 60 tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * TAU - Math.PI / 2;
            const isMajor = i % 5 === 0;
            const inner = dialR - (isMajor ? 8 : 4);
            const outer = dialR - 1;
            const x1 = dialCx + inner * Math.cos(a);
            const y1 = dialCy + inner * Math.sin(a);
            const x2 = dialCx + outer * Math.cos(a);
            const y2 = dialCy + outer * Math.sin(a);
            return (
              <line
                key={`dial-tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={GRID}
                strokeWidth={1}
                opacity={isMajor ? 0.9 : 0.5}
              />
            );
          })}
          {dialArcPath && (
            <path
              d={dialArcPath}
              stroke={dialColor}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
          )}
          <text
            x={dialCx}
            y={dialCy + 4}
            textAnchor="middle"
            fontSize={18}
            fontWeight="bold"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={dialColor}
          >
            {daysRemaining}
          </text>
          <text
            x={dialCx}
            y={dialCy + 22}
            textAnchor="middle"
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            DAYS REMAINING
          </text>
          <text
            x={dialCx}
            y={dialCy + 34}
            textAnchor="middle"
            fontSize={6}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            opacity={0.6}
            letterSpacing={1}
          >
            60-DAY RULE
          </text>
        </g>

        {/* ============== WEAPONIZATION INDEX SIGNAL METER ============== */}
        <g>
          <Bezel x={wiBezelX} y={wiBezelY} width={wiW} height={wiH} />
          {/* value */}
          <text
            x={wiCx}
            y={wiBezelY + 22}
            textAnchor="middle"
            fontSize={13}
            fontWeight="bold"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={AMBER}
          >
            {wiValue.toFixed(2)}x
          </text>
          {/* 8 stacked bars, bottom-up */}
          {Array.from({ length: 8 }).map((_, i) => {
            // bar 0 = bottom, bar 7 = top
            const lit = i < wiBarsLit;
            let color = GRID;
            let opacity = 0.3;
            if (lit) {
              if (i >= 6) color = RED;
              else if (i >= 3) color = AMBER;
              else color = GREEN;
              opacity = 1;
            }
            const barH = 12;
            const barW = 80;
            const gap = 4;
            // Stack from bottom: bar 0 is lowest
            const stackBottom = wiBezelY + wiH - 28;
            const y = stackBottom - i * (barH + gap) - barH;
            const x = wiCx - barW / 2;
            return (
              <rect
                key={`wi-${i}`}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={2}
                fill={color}
                opacity={opacity}
              />
            );
          })}
          <text
            x={wiCx}
            y={wiBezelY + wiH - 10}
            textAnchor="middle"
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            WEAPONIZATION INDEX
          </text>
        </g>

        {/* ============== CARC TICKER TAPE ============== */}
        <g>
          <Bezel x={0} y={tickerY} width={1200} height={tickerH} />
          <rect
            x={2}
            y={tickerY + 2}
            width={1196}
            height={tickerH - 4}
            fill={PANEL_FILL}
          />
          {/* Static label outside the clip */}
          <rect
            x={2}
            y={tickerY + 2}
            width={64}
            height={tickerH - 4}
            fill={BEZEL_FILL}
          />
          <text
            x={8}
            y={tickerY + tickerH / 2 + 3}
            fontSize={7}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={LABEL}
            letterSpacing={1}
          >
            LIVE DENIAL FEED
          </text>
          <line
            x1={68}
            y1={tickerY + 4}
            x2={68}
            y2={tickerY + tickerH - 4}
            stroke={GRID}
            strokeWidth={1}
          />
          <g clipPath="url(#iip-ticker-clip)">
            <text
              x={tickerScrollX + 76}
              y={tickerY + tickerH / 2 + 3}
              fontSize={8}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fill={CYAN}
              opacity={0.7}
            >
              {TICKER_TEXT}
            </text>
            {/* Second copy offset for seamless scroll */}
            <text
              x={tickerScrollX + 76 + TICKER_WIDTH_PX}
              y={tickerY + tickerH / 2 + 3}
              fontSize={8}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fill={CYAN}
              opacity={0.7}
            >
              {TICKER_TEXT}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default IntelligenceInstrumentPanel;
