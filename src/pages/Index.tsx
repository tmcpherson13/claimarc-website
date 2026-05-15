import { Link } from "react-router-dom";
import { ArrowRight, Banknote, FileStack, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import HeroDataViz from "@/components/marketing/HeroDataViz";
import HeroDataStream from "@/components/marketing/HeroDataStream";
import DsoCalculator from "@/components/marketing/DsoCalculator";
import DenialCrisis from "@/components/marketing/DenialCrisis";
import Define from "@/components/marketing/Define";
import ScrollIndicator from "@/components/marketing/ScrollIndicator";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import CtaBand from "@/components/marketing/CtaBand";
import { Section, SectionHeading, CtaLink } from "@/components/marketing/primitives";

/**
 * Home — structured as a story, not a wall.
 *
 *   01 Hook         → Hero (value prop + 1-day promise)
 *   02 Problem      → DenialCrisis (does this feel familiar?)
 *   03 Solution     → Service trio (Accelerator featured + 2 supporting)
 *   04 Proof        → StatRow + ComplianceStrip
 *   05 Interactive  → DSO calculator (run your numbers)
 *   06 Convert      → CtaBand
 *
 * "How it works" depth lives on /why-claimarc.
 * "What each piece does" depth lives on the three service pages.
 */
const serviceCards = [
  {
    to: "/accelerator",
    icon: Banknote,
    name: "Claims Accelerator",
    tag: "The differentiator · Patent Pending",
    desc: "AI scores every claim for propensity to pay and advances payment to you in 1 business day — at a fraction of the cost of a line of credit or factoring. Bi-directional true-up returns the upside to you.",
    accent: "var(--arc-1)",
  },
  {
    to: "/eob-conversion",
    icon: FileStack,
    name: "Claim to Cash Conversion",
    tag: "The fuel for acceleration",
    desc: "Paper EOBs, checks, and correspondence become structured, auto-postable 835 files — indexed, categorized, and routed with your custom business rules applied. 99.7% real-world accuracy.",
    accent: "var(--arc-2)",
  },
  {
    to: "/era-processing",
    icon: RefreshCw,
    name: "ERA Processing",
    tag: "Remittance intelligence",
    desc: "Electronic remittance normalized, reconciled, and posted across every payer — with a searchable, audit-ready archive and reporting on demand.",
    accent: "var(--arc-3)",
  },
];

const Index = () => (
  <Layout>
    <SeoHead
      title="ClaimARC — Claim Payment Acceleration in 1 Business Day"
      description="ClaimARC is the AI-powered claim payment acceleration platform for healthcare. Get paid in 1 business day, powered by claim-to-cash conversion, correspondence indexing, and ERA processing."
      path="/"
    />
    <div className="home-dot-grid">

    {/* 01 — Hero. Constrained to ~viewport so the scroll cue stays above fold. */}
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
      <div aria-hidden="true" className="hero-precision-accent" />
      <HeroDataStream />

      <div className="shell relative grid flex-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--arc-1)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--arc-1)]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-mid)]">
              AI-Powered Claim Payment Acceleration
            </span>
          </div>
          <h1 className="display mt-6 text-balance text-5xl leading-[0.98] tracking-tight md:text-6xl lg:text-[4.4rem]">
            <span className="block text-[var(--text-hi)]">Get paid in</span>
            <span className="block arc-text">1 business day.<span className="text-[0.4em] align-super text-[var(--text-lo)] ml-1">*</span></span>
          </h1>
          <p className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
            <span className="shimmer-text">Precision valuation.</span>{" "}
            <span className="shimmer-text">Lightning acceleration.</span>
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-mid)]">
            ClaimARC's AI scores every claim, prices the risk, and advances cash to
            you in as little as one business day — instead of the 45+ you're waiting
            on now. Claim-to-cash conversion, correspondence indexing, and ERA
            processing feed the engine.
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-[var(--text-lo)]">
            <span className="text-[var(--lime)]">*</span> One business day is our funding target. Most claims fund same- or next-day; some may take additional review based on payer and scoring profile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/contact" variant="primary">
              Contact Us <ArrowRight size={16} />
            </CtaLink>
            <CtaLink to="/why-claimarc" variant="secondary">
              See how it works
            </CtaLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-lo)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--arc-1)]" />
              SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              HIPAA Compliant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--arc-2)]" />
              Patent Pending
            </span>
          </div>
        </Reveal>
        <Reveal delay={140} className="hidden md:block">
          <HeroDataViz />
        </Reveal>
      </div>
      <ScrollIndicator absolute />
      <div className="hairline" />
    </section>

    {/* 02 — Problem. Empathy framing + 4 cited stats + pivot to ClaimARC. */}
    <DenialCrisis />

    {/* 03 — Solution. Service trio (Accelerator featured + 2 supporting). */}
    <Section tone="light">
      <SectionHeading
        align="center"
        eyebrow="The answer"
        title={<>One platform. <span className="arc-text">Acceleration at the center.</span></>}
        intro="Acceleration is the differentiator. Claim-to-cash conversion and ERA processing are the supporting services that feed it — each works on its own; together they create an advantage built from your own data."
        className="mb-4"
      />
      {(() => {
        const featured = serviceCards[0];
        const FIcon = featured.icon;
        return (
          <Reveal className="mt-12 block">
            <Link
              to={featured.to}
              className="group relative grid items-stretch gap-0 overflow-hidden rounded-2xl border border-[var(--lime)]/30 bg-gradient-to-br from-[var(--lime)]/[0.07] via-[var(--ink-1)] to-[var(--ink-1)] transition-all duration-300 hover:border-[var(--lime)]/50 hover:shadow-[0_24px_60px_-30px_rgba(126,217,87,0.5)] md:grid-cols-[1.4fr_1fr]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--lime)] via-[var(--arc-1)] to-transparent"
              />
              <div className="relative flex flex-col p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${featured.accent}33, ${featured.accent}05)`,
                      border: `1px solid ${featured.accent}66`,
                      color: featured.accent,
                    }}
                  >
                    <FIcon size={24} />
                  </span>
                  <span className="rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
                    The differentiator
                  </span>
                </div>
                <h3 className="display mt-5 text-balance text-3xl font-bold leading-tight text-[var(--text-hi)] md:text-[2.2rem]">
                  {featured.name}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-mid)]">
                  AI scores every claim for{" "}
                  <Define
                    term="propensity to pay"
                    definition="ClaimARC's per-claim probability that a given payer pays a given amount within a target window — produced by ML models trained on your remittance history."
                  />{" "}
                  and advances payment to you in 1 business day (target) — at a fraction of the
                  cost of a line of credit or factoring.{" "}
                  <Define
                    term="Bi-directional true-up"
                    definition="If the claim ultimately pays more than ClaimARC priced, the upside is returned to you. The model never benefits from being wrong in its favor."
                  />{" "}
                  returns the upside to you.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--lime)] transition-transform group-hover:translate-x-0.5">
                    Explore {featured.name}
                    <ArrowRight size={15} />
                  </span>
                  <span className="hidden text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-lo)] md:inline">
                    · Patent Pending
                  </span>
                </div>
              </div>
              <div className="relative flex flex-col items-center justify-center gap-2 border-t border-white/[0.05] p-8 md:border-l md:border-t-0 md:p-10">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
                  Funding target
                </span>
                <p className="mono text-7xl font-semibold leading-none tracking-tight text-[var(--lime)] md:text-[6rem]">
                  1
                </p>
                <span className="mono text-xs uppercase tracking-[0.16em] text-[var(--text-mid)]">
                  Business day
                </span>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 80% at 50% 50%, rgba(126,217,87,0.15), transparent 70%)",
                  }}
                />
              </div>
            </Link>
          </Reveal>
        );
      })()}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {serviceCards.slice(1).map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.to} delay={i * 90}>
              <Link
                to={s.to}
                className="glass group relative flex h-full flex-col overflow-hidden p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span
                  aria-hidden="true"
                  className="service-bar"
                  style={{ color: s.accent }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(60% 80% at 50% 0%, ${s.accent}22, transparent 70%)`,
                  }}
                />
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${s.accent}33, ${s.accent}05)`,
                    border: `1px solid ${s.accent}55`,
                    color: s.accent,
                  }}
                >
                  <Icon size={22} />
                </div>
                <p className="relative mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
                  {s.tag}
                </p>
                <h3 className="relative mt-1 text-xl font-bold text-[var(--text-hi)]">
                  {s.name}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-[var(--text-mid)]">
                  {s.desc}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: s.accent }}>
                  Explore {s.name}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* Bridge to /why-claimarc for the "how it works" depth */}
      <div className="mt-10 flex justify-center">
        <CtaLink to="/why-claimarc" variant="secondary">
          See how the whole platform fits together
          <ArrowRight size={15} />
        </CtaLink>
      </div>
    </Section>

    {/* 04 — Proof. Three numbers + a thin compliance band. */}
    <StatRow
      stats={[
        { value: "45+", label: "Days you're currently waiting", note: "Industry-avg DSO · HFMA", accent: "cyan" },
        { value: "99.7%", label: "Real-world EOB data accuracy", note: "98.5% contracted SLA · ClaimARC", accent: "lime" },
        { value: "1", label: "Business day to payment*", note: "ClaimARC Accelerator funding target", accent: "cyan" },
      ]}
    />
    <ComplianceStrip />

    {/* 05 — Interactive proof on the visitor's own numbers. */}
    <Section tone="elev">
      <SectionHeading
        align="center"
        eyebrow="Run your numbers"
        title={<>What does <span className="arc-text">1-day funding</span> unlock for your AR?</>}
        intro="No email, no gate — move the sliders to see the shape of the upside on your own volume."
        className="mb-4"
      />
      <DsoCalculator />
    </Section>

    {/* 06 — Convert. */}
    <CtaBand
      kicker="ClaimARC partnerships are limited and require qualification."
      headline="The question isn't whether you can afford ClaimARC."
      highlight="It's whether you can afford another 45 days of waiting."
      subhead="Book a 30-minute working session with our team and see the model against your own numbers."
    />
    </div>
  </Layout>
);

export default Index;
