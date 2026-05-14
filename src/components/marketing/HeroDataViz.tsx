import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Circle, Clock3, Sparkles } from "lucide-react";

/**
 * HeroDataViz — "Funding Ledger" product UI mockup.
 *
 * Instead of an abstract flow diagram, this is a glass-paneled window that
 * looks like a real ClaimARC dashboard pane: a live list of claim rows with
 * scores, status pills, and funded amounts, plus an aggregate KPI tile.
 * The premium-fintech move: show the product, don't draw an icon of it.
 *
 * - Window chrome with a ClaimARC tag, live status dot, and "Today" filter
 * - Claim rows: anonymized payer + score badge + status pill + amount
 * - One row animates from "Scored" → "Funded" on mount (the punchline)
 * - Aggregate KPI tile with a simple inline sparkline bar chart
 * - Subtle floating "+1 BUSINESS DAY" badge
 *
 * Hidden below md so we don't compress the layout on mobile.
 */
type Row = {
  id: string;
  payer: string;
  score: number;
  status: "funded" | "scored" | "received";
  amount: string;
  ts: string;
};

const STATIC_ROWS: Row[] = [
  { id: "CL-7821", payer: "Payer 47", score: 94, status: "funded",   amount: "$ 18,420", ts: "T-0 · 8:14a" },
  { id: "CL-7820", payer: "Payer 12", score: 88, status: "funded",   amount: "$  9,860", ts: "T-0 · 7:52a" },
  { id: "CL-7819", payer: "Payer 19", score: 81, status: "scored",   amount: "$ 12,540", ts: "T-0 · 7:31a" },
  { id: "CL-7818", payer: "Payer 03", score: 76, status: "scored",   amount: "$  6,210", ts: "T-1 · 9:48p" },
  { id: "CL-7817", payer: "Payer 21", score: 68, status: "received", amount: "$  4,775", ts: "T-1 · 9:12p" },
];

const SPARK = [22, 28, 24, 36, 32, 40, 48, 42, 55, 58, 64, 72];

const STATUS_META: Record<
  Row["status"],
  { label: string; icon: typeof CheckCircle2; color: string; bg: string }
> = {
  funded: {
    label: "FUNDED",
    icon: CheckCircle2,
    color: "#7ED957",
    bg: "rgba(126, 217, 87, 0.12)",
  },
  scored: {
    label: "SCORED",
    icon: Sparkles,
    color: "#00C8E6",
    bg: "rgba(0, 200, 230, 0.12)",
  },
  received: {
    label: "RECEIVED",
    icon: Circle,
    color: "#7E89A6",
    bg: "rgba(126, 137, 166, 0.10)",
  },
};

const HeroDataViz = ({ className = "" }: { className?: string }) => {
  // The top row starts as "scored" and flips to "funded" 900ms after mount
  // to show the platform doing its job — the visualization's punchline.
  const [rows, setRows] = useState<Row[]>(() =>
    STATIC_ROWS.map((r, i) => (i === 0 ? { ...r, status: "scored" } : r)),
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setRows((curr) => curr.map((r, i) => (i === 0 ? { ...r, status: "funded" } : r)));
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`relative hidden md:block ${className}`} aria-hidden="true">
      {/* Floating badge — sits at the upper-right corner of the card */}
      <div className="absolute -right-2 -top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#7ED957]/40 bg-[var(--ink-0)]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#A6E883] backdrop-blur">
        <Sparkles size={12} />
        +1 business day target
      </div>

      {/* Glass "window" mockup */}
      <div className="glass-strong relative overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-[var(--lime)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--lime)]" />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-mid)]">
              Funding ledger · live
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-lo)]">
            <Clock3 size={11} />
            Today
          </div>
        </div>

        {/* Column header */}
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-white/[0.06] px-5 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
          <span>Claim · Payer</span>
          <span className="text-right">Score</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-white/[0.05]">
          {rows.map((row, i) => {
            const meta = STATUS_META[row.status];
            const StatusIcon = meta.icon;
            const isLead = i === 0;
            return (
              <li
                key={row.id}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-3 transition-colors duration-500 ${
                  isLead && row.status === "funded" ? "bg-[rgba(126,217,87,0.05)]" : ""
                }`}
              >
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.72rem] text-[var(--text-mid)]">{row.id}</span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] transition-colors duration-500"
                      style={{ color: meta.color, background: meta.bg }}
                    >
                      <StatusIcon size={9} />
                      {meta.label}
                    </span>
                  </div>
                  <span className="mt-0.5 text-[0.7rem] text-[var(--text-lo)]">
                    {row.payer} · {row.ts}
                  </span>
                </div>

                {/* Score badge — circular indicator */}
                <div className="relative flex items-center justify-end gap-2 pr-1">
                  <div className="relative h-7 w-7">
                    <svg viewBox="0 0 28 28" className="absolute inset-0">
                      <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
                      <circle
                        cx="14"
                        cy="14"
                        r="11"
                        stroke={meta.color}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${(row.score / 100) * (2 * Math.PI * 11)} ${2 * Math.PI * 11}`}
                        strokeLinecap="round"
                        transform="rotate(-90 14 14)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-bold tabular-nums text-[var(--text-hi)]">
                      {row.score}
                    </span>
                  </div>
                </div>

                <span className="text-right font-mono text-[0.78rem] tabular-nums text-[var(--text-hi)]">
                  {row.amount}
                </span>
              </li>
            );
          })}
        </ul>

        {/* KPI tile — aggregate funded amount with inline sparkline */}
        <div className="grid grid-cols-[1fr_auto] items-end gap-4 border-t border-white/10 px-5 py-4">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
              Funded today
            </p>
            <p className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-semibold tabular-nums text-[var(--text-hi)]">
              $ 84,200
              <span className="inline-flex items-center gap-0.5 text-[0.65rem] font-semibold text-[#7ED957]">
                <ArrowUpRight size={11} />
                +18.4%
              </span>
            </p>
          </div>
          <svg viewBox="0 0 120 36" className="h-10 w-28" fill="none" aria-hidden="true">
            {SPARK.map((v, i) => (
              <rect
                key={i}
                x={i * 10}
                y={36 - v / 2.2}
                width={6}
                height={v / 2.2}
                rx={1}
                fill={i === SPARK.length - 1 ? "#7ED957" : "rgba(0, 200, 230, 0.55)"}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroDataViz;
