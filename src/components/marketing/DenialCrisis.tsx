import { TrendingUp, Clock, AlertTriangle, Banknote } from "lucide-react";
import Reveal from "./Reveal";
import { Section, SectionHeading } from "./primitives";

/**
 * DenialCrisis
 *
 * Empathy-first problem framing for the home page. Opens with the question
 * a CFO is already asking ("does it feel like payers are slow-paying?"),
 * then validates the gut feeling with four punchy, independently-cited
 * stats. Closes by pivoting to ClaimARC as the move that removes the
 * provider from the fight instead of fighting harder.
 *
 * Sources are kept short under each stat. Numbers chosen for emotional
 * pull (the 80.7% overturn rate is the single sharpest one — "they know
 * they owe you").
 */
const stats = [
  {
    icon: Clock,
    accent: "var(--arc-1)",
    value: "55+",
    unit: "days",
    label: "Average wait to be paid",
    detail:
      "vs. the 30-day standard in virtually every other industry. Time-to-payment barely moved 2024 → 2025.",
    source: "Kodiak Solutions, 2026 RCM Benchmark",
  },
  {
    icon: TrendingUp,
    accent: "var(--arc-2)",
    value: "73",
    unit: "%",
    label: "Providers say denials are rising",
    detail:
      "Initial denial rate hit 11.81% — the highest ever recorded. Commercial payers run closer to 13.9%.",
    source: "Experian Health · Change Healthcare 2025",
  },
  {
    icon: AlertTriangle,
    accent: "var(--lime)",
    value: "80.7",
    unit: "%",
    label: "Of MA denials get overturned",
    detail:
      "On appeal. Meaning the majority of Medicare Advantage denials were clinically inappropriate to begin with.",
    source: "KFF analysis of MA prior auth, 2024",
  },
  {
    icon: Banknote,
    accent: "var(--arc-3)",
    value: "$43B",
    unit: "",
    label: "Spent fighting for owed payments",
    detail:
      "Each year, by U.S. hospitals — to collect money payers already owe. That's pure margin set on fire.",
    source: "Premier Inc. national survey, 2025",
  },
];

const DenialCrisis = () => (
  <Section tone="navy">
    <Reveal>
      <SectionHeading
        numberedIndex="01"
        eyebrow="Does this feel familiar?"
        title={
          <>
            Payers are slow-paying your claims —{" "}
            <span className="arc-text">and it's not random.</span>
          </>
        }
        intro={
          <>
            The industry calls it{" "}
            <span className="font-semibold text-[var(--text-hi)]">
              "Delay, Deny, Defend."
            </span>{" "}
            Payers protect float income by requesting redundant docs, running
            AI denial algorithms that fire in seconds, and burying clean claims
            behind impossible ones. Your gut is right — it really is getting
            worse.
          </>
        }
      />
    </Reveal>

    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 80}>
          <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-colors hover:border-white/15">
            {/* Accent wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px opacity-30"
              style={{
                background: `radial-gradient(70% 60% at 0% 0%, ${s.accent}33, transparent 60%)`,
              }}
            />
            <div className="relative">
              <div
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  background: `${s.accent}1A`,
                  color: s.accent,
                  boxShadow: `inset 0 0 0 1px ${s.accent}33`,
                }}
              >
                <s.icon size={16} strokeWidth={2.25} />
              </div>
              <p className="mono mt-5 text-4xl font-semibold leading-none tracking-tight text-[var(--text-hi)] md:text-5xl">
                {s.value}
                {s.unit && (
                  <span className="text-2xl text-[var(--text-mid)] md:text-3xl">
                    {s.unit}
                  </span>
                )}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-hi)]">
                {s.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">
                {s.detail}
              </p>
              <p className="mono mt-4 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-lo)]">
                Source · {s.source}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* Pivot — the "and here's our answer" line */}
    <Reveal delay={300}>
      <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08]">
        <div
          className="px-6 py-7 md:px-10 md:py-9"
          style={{
            background:
              "linear-gradient(135deg, rgba(126,217,87,0.10), rgba(0,200,230,0.08))",
          }}
        >
          <div className="grid items-center gap-6 md:grid-cols-[1.6fr_1fr]">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
                The ClaimARC angle
              </p>
              <h3 className="display mt-3 text-balance text-2xl leading-tight tracking-tight text-[var(--text-hi)] md:text-3xl">
                We don't fight the system harder.{" "}
                <span className="arc-text">We remove you from the fight.</span>
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-mid)]">
                ClaimARC's AI scores every claim, prices the risk, and advances
                cash in 1 business day (target) — regardless of when the payer
                eventually settles. Your A/R aging chart flattens. Denials
                become a back-office workflow, not a cash-flow event.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-[var(--text-hi)]">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
                Paid in 1 business day — not 55.
              </li>
              <li className="flex items-start gap-2 text-[var(--text-hi)]">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--arc-1)]" />
                Stop financing your own receivables.
              </li>
              <li className="flex items-start gap-2 text-[var(--text-hi)]">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--arc-2)]" />
                Denials don't delay your cash.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  </Section>
);

export default DenialCrisis;
