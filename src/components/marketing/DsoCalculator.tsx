import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * DsoCalculator
 *
 * Soft-conversion interactive: visitor enters their monthly claim volume
 * and current DSO; we show what acceleration unlocks in plain dollars and
 * days. No email gate — the visitor leaves with a number they can take to
 * their CFO, which is the point.
 *
 * Three demo-craft moves on top of the math:
 *   1. Preset chips populate "what's typical" volumes in one click.
 *   2. The headline dollar figure animates between values via rAF count-up.
 *   3. A two-bar visual contrasts "stuck at N days" vs "ClaimARC at 1 day"
 *      so the delta is felt visually, not just read.
 *
 * Math (intentionally simple, conservative, order-of-magnitude):
 *   monthlyClaims × averageClaim = monthly receipts
 *   acceleratedDays = currentDSO - 1
 *   cashUnlocked = (monthly receipts × 12) × (acceleratedDays / 365)
 */
const fmt$ = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

interface Preset {
  label: string;
  sub: string;
  monthlyClaims: number;
  avgClaim: number;
  currentDso: number;
}

const PRESETS: Preset[] = [
  {
    label: "Mid-size group",
    sub: "Multi-specialty · 15K claims/mo",
    monthlyClaims: 15_000,
    avgClaim: 220,
    currentDso: 46,
  },
  {
    label: "Regional system",
    sub: "Hospital network · 120K claims/mo",
    monthlyClaims: 120_000,
    avgClaim: 380,
    currentDso: 52,
  },
  {
    label: "Enterprise",
    sub: "Health system · 400K claims/mo",
    monthlyClaims: 400_000,
    avgClaim: 540,
    currentDso: 58,
  },
];

/** Smooth count-up between values using rAF. */
function useAnimatedNumber(target: number, durationMs = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const k = Math.min(1, elapsed / durationMs);
      // ease-out cubic for that "machine settling" feel
      const eased = 1 - Math.pow(1 - k, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}

const DsoCalculator = () => {
  const [monthlyClaims, setMonthlyClaims] = useState(PRESETS[0].monthlyClaims);
  const [avgClaim, setAvgClaim] = useState(PRESETS[0].avgClaim);
  const [currentDso, setCurrentDso] = useState(PRESETS[0].currentDso);
  const [activePreset, setActivePreset] = useState<number | null>(0);

  const applyPreset = (i: number) => {
    const p = PRESETS[i];
    setMonthlyClaims(p.monthlyClaims);
    setAvgClaim(p.avgClaim);
    setCurrentDso(p.currentDso);
    setActivePreset(i);
  };

  const onSlide = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setActivePreset(null);
  };

  const result = useMemo(() => {
    const monthlyReceipts = monthlyClaims * avgClaim;
    const annualReceipts = monthlyReceipts * 12;
    const daysAccelerated = Math.max(0, currentDso - 1);
    const cashUnlocked = annualReceipts * (daysAccelerated / 365);
    // Cash currently locked in A/R at current DSO
    const cashStuckAtCurrent = annualReceipts * (currentDso / 365);
    // Cash locked at 1-day DSO (ClaimARC)
    const cashStuckAtAccel = annualReceipts * (1 / 365);
    return {
      cashUnlocked,
      daysAccelerated,
      monthlyReceipts,
      cashStuckAtCurrent,
      cashStuckAtAccel,
    };
  }, [monthlyClaims, avgClaim, currentDso]);

  const animatedCash = useAnimatedNumber(result.cashUnlocked);

  // Bar widths (percentages of max — the "current" bar always anchors at 100%).
  const currentBarPct = 100;
  const accelBarPct = Math.max(
    2,
    Math.round((result.cashStuckAtAccel / result.cashStuckAtCurrent) * 100),
  );

  return (
    <div className="space-y-10">
      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
          Quick start
        </span>
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(i)}
            className={`group rounded-lg border px-3.5 py-2 text-left text-xs transition-all ${
              activePreset === i
                ? "border-[var(--arc-1)] bg-[var(--arc-1)]/10 text-white shadow-[0_0_0_1px_rgba(0,200,230,0.35)_inset]"
                : "border-white/10 bg-white/[0.02] text-[var(--text-mid)] hover:border-white/25 hover:text-white"
            }`}
          >
            <span className="block text-sm font-semibold">{p.label}</span>
            <span className="mono mt-0.5 block text-[0.65rem] text-[var(--text-lo)]">
              {p.sub}
            </span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-10 md:grid-cols-[1.05fr_1fr]">
        {/* Left — inputs */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur">
            <Calculator size={13} className="text-[var(--arc-1)]" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-mid)]">
              Three inputs · One number
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--text-mid)]">
            Order-of-magnitude only — not a quote, just the shape of the upside on
            your own volume. Numbers stay on this page; nothing is sent anywhere.
            Pick a preset to start, or drag the sliders.
          </p>

          <div className="space-y-5">
            <SliderRow
              label="Monthly claims"
              value={monthlyClaims}
              display={fmtNum(monthlyClaims)}
              min={1000}
              max={500_000}
              step={1000}
              onChange={onSlide(setMonthlyClaims)}
            />
            <SliderRow
              label="Average claim amount"
              value={avgClaim}
              display={fmt$(avgClaim)}
              min={50}
              max={2000}
              step={10}
              onChange={onSlide(setAvgClaim)}
            />
            <SliderRow
              label="Current DSO (days)"
              value={currentDso}
              display={`${currentDso}d`}
              min={15}
              max={120}
              step={1}
              onChange={onSlide(setCurrentDso)}
            />
          </div>
        </div>

        {/* Right — result tile */}
        <div className="glass-strong relative flex flex-col gap-6 p-7 md:p-8 md:sticky md:top-24">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
              Working capital you're leaving on the table
            </p>
            <p className="mono mt-2 text-5xl font-semibold leading-none tracking-tight text-[var(--lime)] tabular-nums md:text-6xl">
              {fmt$(animatedCash)}
            </p>
            <p className="mt-3 text-xs text-[var(--text-mid)]">
              from accelerating{" "}
              <span className="mono text-[var(--text-hi)]">
                {result.daysAccelerated}
              </span>{" "}
              days of monthly receipts of{" "}
              <span className="mono text-[var(--text-hi)]">
                {fmt$(result.monthlyReceipts)}
              </span>
              .
            </p>
          </div>

          {/* Comparison bars — stuck vs ClaimARC */}
          <div className="space-y-3">
            <CompareBar
              label="Stuck in A/R today"
              sub={`${currentDso} days · industry default`}
              value={fmt$(result.cashStuckAtCurrent)}
              widthPct={currentBarPct}
              tone="warn"
            />
            <CompareBar
              label="With ClaimARC"
              sub="1 day · funding target"
              value={fmt$(result.cashStuckAtAccel)}
              widthPct={accelBarPct}
              tone="good"
            />
          </div>

          <div className="h-px w-full bg-white/[0.06]" />

          <p className="text-xs text-[var(--text-mid)]">
            Acceleration fees apply, priced by AI per claim — typically a
            fraction of the cost of factoring or a line of credit.
          </p>

          <Link
            to="/contact"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--arc-1)] via-[var(--arc-2)] to-[var(--arc-3)] bg-[length:200%_100%] bg-left px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset] transition-all hover:bg-right"
          >
            Get pricing on your volume
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

function CompareBar({
  label,
  sub,
  value,
  widthPct,
  tone,
}: {
  label: string;
  sub: string;
  value: string;
  widthPct: number;
  tone: "warn" | "good";
}) {
  const fill =
    tone === "warn"
      ? "linear-gradient(90deg, rgba(220,38,38,0.55), rgba(220,38,38,0.25))"
      : "linear-gradient(90deg, var(--lime), var(--arc-1))";
  const textColor = tone === "warn" ? "text-red-300" : "text-[var(--lime)]";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-hi)]">
            {label}
          </span>
          <span className="mono text-[0.65rem] text-[var(--text-lo)]">{sub}</span>
        </div>
        <span className={`mono text-sm font-semibold tabular-nums ${textColor}`}>
          {value}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${widthPct}%`,
            background: fill,
            boxShadow:
              tone === "good"
                ? "0 0 12px -2px rgba(126,217,87,0.5)"
                : "none",
          }}
        />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-mid)]">
          {label}
        </span>
        <span className="mono text-base font-semibold text-[var(--text-hi)] tabular-nums">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="dso-slider mt-2 w-full"
      />
    </label>
  );
}

export default DsoCalculator;
