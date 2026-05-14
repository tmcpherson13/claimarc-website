import { useMemo, useState } from "react";
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
 * The math is intentionally simple and conservative:
 *   monthlyClaims × averageClaim = monthly receipts
 *   acceleratedDays = currentDSO - 1 (our target)
 *   cashUnlocked = (monthly receipts × 12) × (acceleratedDays / 365)
 *
 * This is an order-of-magnitude tool, not a quote. The CTA at the bottom
 * is the actual quote conversion.
 */
const fmt$ = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

const DsoCalculator = () => {
  const [monthlyClaims, setMonthlyClaims] = useState(15_000);
  const [avgClaim, setAvgClaim] = useState(220);
  const [currentDso, setCurrentDso] = useState(46);

  const result = useMemo(() => {
    const monthlyReceipts = monthlyClaims * avgClaim;
    const annualReceipts = monthlyReceipts * 12;
    const daysAccelerated = Math.max(0, currentDso - 1);
    const cashUnlocked = annualReceipts * (daysAccelerated / 365);
    return {
      cashUnlocked,
      daysAccelerated,
      monthlyReceipts,
    };
  }, [monthlyClaims, avgClaim, currentDso]);

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1.05fr_1fr]">
      {/* Left — inputs */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur">
          <Calculator size={13} className="text-[var(--arc-1)]" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-mid)]">
            Run your numbers
          </span>
        </div>
        <h3 className="display text-balance text-3xl leading-tight tracking-tight text-[var(--text-hi)] md:text-4xl">
          What does <span className="arc-text">1-day funding</span> unlock for your AR?
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-[var(--text-mid)]">
          Order-of-magnitude only — not a quote. Move the sliders to see the
          shape of the upside on your own volume. No data leaves the page.
        </p>

        <div className="space-y-5">
          <SliderRow
            label="Monthly claims"
            value={monthlyClaims}
            display={fmtNum(monthlyClaims)}
            min={1000}
            max={500_000}
            step={1000}
            onChange={setMonthlyClaims}
          />
          <SliderRow
            label="Average claim amount"
            value={avgClaim}
            display={fmt$(avgClaim)}
            min={50}
            max={2000}
            step={10}
            onChange={setAvgClaim}
          />
          <SliderRow
            label="Current DSO (days)"
            value={currentDso}
            display={`${currentDso}d`}
            min={15}
            max={120}
            step={1}
            onChange={setCurrentDso}
          />
        </div>
      </div>

      {/* Right — result tile */}
      <div className="glass-strong relative flex flex-col gap-6 p-7 md:p-8">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
            Annual cash unlocked
          </p>
          <p className="mono mt-2 text-5xl font-semibold leading-none tracking-tight text-[var(--lime)] md:text-6xl">
            {fmt$(result.cashUnlocked)}
          </p>
          <p className="mt-3 text-xs text-[var(--text-mid)]">
            from accelerating <span className="mono text-[var(--text-hi)]">{result.daysAccelerated}</span> days
            of monthly receipts of <span className="mono text-[var(--text-hi)]">{fmt$(result.monthlyReceipts)}</span>.
          </p>
        </div>

        <div className="h-px w-full bg-white/[0.06]" />

        <div className="flex flex-col gap-2 text-sm text-[var(--text-mid)]">
          <p className="text-[var(--text-hi)]">
            This is one-time working capital you free up by closing the
            gap between earned and received.
          </p>
          <p>
            Acceleration fees apply, priced by AI per claim — typically a
            fraction of the cost of factoring or a line of credit.
          </p>
        </div>

        <Link
          to="/contact"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--arc-1)] via-[var(--arc-2)] to-[var(--arc-3)] bg-[length:200%_100%] bg-left px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset] transition-all hover:bg-right"
        >
          Get pricing on your volume
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

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
        <span className="mono text-base font-semibold text-[var(--text-hi)]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--arc-1)]"
      />
    </label>
  );
}

export default DsoCalculator;
