import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * HeroDataViz — "The Duel"
 *
 * Replaces the fabricated Funding Ledger mockup with a single decisive
 * before/after lockup: 45 days (industry-average DSO) versus 1 day
 * (ClaimARC's funding target).
 *
 * Treatment:
 *  - The 45 sits in slate with a hard strikethrough that draws on mount.
 *  - The 1 sits in lime, mono, oversized — the punchline.
 *  - An arrow animates between them once.
 *  - A small DSO sparkline beneath shows the curve dropping (animated path).
 *
 * No fake claim IDs, no synthesized $ amounts. The dataviz IS the pitch.
 */
const HeroDataViz = ({ className = "" }: { className?: string }) => {
  const [counted, setCounted] = useState(45);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCounted(1);
      return;
    }
    const FROM = 45;
    const TO = 1;
    const DURATION = 3200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 4); // strong ease-out — settles
      setCounted(Math.round(FROM + (TO - FROM) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    // Small delay so the entrance lands after the rest of the hero appears.
    const start_t = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 350);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(start_t);
    };
  }, []);

  return (
    <div className={`relative hidden md:flex flex-col items-center justify-center ${className}`} aria-hidden="true">
      {/* The duel — two big numerals with an arrow between */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-10">
        {/* Before — 45 days */}
        <div className="text-right">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-lo)]">
            Industry average
          </p>
          <p
            className="mono relative mt-2 text-[6.5rem] font-semibold leading-none text-[var(--text-mid)] lg:text-[7.5rem]"
            style={{ letterSpacing: "-0.04em" }}
          >
            <span className="relative inline-block">
              45
              <span className="absolute left-[-6%] right-[-6%] top-1/2 h-[6px] -translate-y-1/2 bg-[var(--text-mid)] origin-left animate-[strikeDraw_0.7s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards] scale-x-0 rounded-full" />
            </span>
          </p>
          <p className="mono mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-lo)]">
            DAYS · DSO
          </p>
        </div>

        {/* The arrow — fades in between the numbers */}
        <div
          className="flex items-center justify-center text-[var(--arc-1)] opacity-0"
          style={{ animation: "duelArrowIn 0.5s ease 1.4s forwards" }}
        >
          <ArrowRight size={32} strokeWidth={2.5} />
        </div>

        {/* After — 1 day */}
        <div className="text-left">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--lime)]">
            ClaimARC target
          </p>
          <p
            className="mono mt-2 text-[6.5rem] font-bold leading-none text-[var(--lime)] lg:text-[7.5rem]"
            style={{
              letterSpacing: "-0.04em",
              textShadow: "0 0 60px rgba(126, 217, 87, 0.35)",
            }}
          >
            {counted}
          </p>
          <p className="mono mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-lo)]">
            BUSINESS DAY{counted === 1 ? "" : "S"} · TARGET
          </p>
        </div>
      </div>

      {/* DSO acceleration curve — draws in from left, settles at the new floor.
          Pure SVG, no fake data points, no payer codes. */}
      <svg
        viewBox="0 0 400 80"
        className="mt-10 h-16 w-full max-w-[420px]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="duelStroke" x1="0" y1="0" x2="400" y2="0">
            <stop offset="0" stopColor="rgba(126,137,166,0.65)" />
            <stop offset="0.55" stopColor="#00C8E6" />
            <stop offset="1" stopColor="#7ED957" />
          </linearGradient>
          <linearGradient id="duelFill" x1="0" y1="0" x2="0" y2="80">
            <stop offset="0" stopColor="rgba(0, 200, 230, 0.18)" />
            <stop offset="1" stopColor="rgba(0, 200, 230, 0)" />
          </linearGradient>
        </defs>
        {/* Baseline grid line at "old" floor */}
        <line x1="0" y1="12" x2="400" y2="12" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
        {/* Baseline grid line at "new" floor */}
        <line x1="0" y1="62" x2="400" y2="62" stroke="rgba(126,217,87,0.18)" strokeDasharray="2 4" />

        {/* The curve — high left, plunging to a near-zero floor on the right */}
        <path
          d="M 0 12 C 80 12, 130 16, 180 30 C 230 44, 280 56, 400 62"
          stroke="url(#duelStroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: "duelCurveDraw 1.6s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards" }}
        />
        {/* Area fill below the curve, faded */}
        <path
          d="M 0 12 C 80 12, 130 16, 180 30 C 230 44, 280 56, 400 62 L 400 80 L 0 80 Z"
          fill="url(#duelFill)"
          opacity="0"
          style={{ animation: "duelFillIn 0.8s ease 1.8s forwards" }}
        />
        {/* End-of-curve marker dot */}
        <circle
          cx="400"
          cy="62"
          r="4"
          fill="#7ED957"
          opacity="0"
          style={{ animation: "duelDotIn 0.4s ease 2s forwards" }}
        />
      </svg>

      {/* Footnote caption beneath the chart */}
      <p className="mt-5 max-w-[420px] text-center text-xs leading-relaxed text-[var(--text-lo)]">
        Industry-average DSO sourced from HFMA / Kodiak benchmarks. ClaimARC's
        1-business-day funding is our target for selected claims — see hero
        footnote for full disclosure.
      </p>
    </div>
  );
};

export default HeroDataViz;
