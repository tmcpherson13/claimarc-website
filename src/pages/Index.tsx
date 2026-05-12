import { Link } from "react-router-dom";
import { ArrowRight, Banknote, Boxes, FileStack, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import HeroArc from "@/components/marketing/HeroArc";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import StepFlow from "@/components/marketing/StepFlow";
import CompareTable from "@/components/marketing/CompareTable";
import ValueCards from "@/components/marketing/ValueCards";
import CtaBand from "@/components/marketing/CtaBand";
import { Section, SectionHeading, Eyebrow, CtaLink } from "@/components/marketing/primitives";
import { services } from "@/config/site";

const serviceCards = [
  {
    to: "/eob-conversion",
    icon: FileStack,
    name: "EOB Conversion",
    tag: "Xtract Engine",
    desc: "Paper EOBs, checks, and correspondence become structured, auto-postable 835 files — your custom business rules applied, 99.7% real-world accuracy.",
    accent: "var(--cyan)",
  },
  {
    to: "/era-processing",
    icon: RefreshCw,
    name: "ERA Processing",
    tag: "Remittance Intelligence",
    desc: "Electronic remittance normalized, reconciled, and posted across every payer — with a searchable, audit-ready archive and reporting on demand.",
    accent: "var(--lime)",
  },
  {
    to: "/accelerator",
    icon: Banknote,
    name: "Claims Accelerator",
    tag: "Patent Pending",
    desc: "AI scores every claim for propensity to pay and advances payment to you in 1–2 business days — at a fraction of the cost of a line of credit or factoring.",
    accent: "var(--cyan)",
  },
];

const flywheel = [
  {
    title: "Paper & ERA in",
    lead: "Remittance arrives",
    body: "EOBs, checks, correspondence, and 835s flow into ClaimARC from any lockbox, bank, or clearinghouse. Your workflow is enhanced, not disrupted.",
    footnote: "Bank, clearinghouse & lockbox agnostic.",
  },
  {
    title: "Xtract Engine",
    lead: "Structured in 24–48h",
    body: "AI data-lifting converts every document to clean, auto-postable 835 files with your business rules applied, returned to your SFTP.",
    footnote: "Builds the data asset.",
  },
  {
    title: "AI Scoring",
    lead: "Propensity to pay",
    body: "Your remittance history trains ML models that predict payment likelihood and timing — per claim, per payer, per procedure. The more you process, the sharper it gets.",
    footnote: "More data = lower cost.",
  },
  {
    title: "Accelerator",
    lead: "Funded in 1–2 days",
    body: "Select which scored claims to fund. Cash lands with you in one to two business days, with bi-directional true-up built into every advance.",
    footnote: "Always in your favor.",
  },
];

const compareRows = [
  { label: "Cost of funds", them: "10–30% per transaction", us: "Transparent, risk-scored fee" },
  { label: "Recourse model", them: "One-directional", us: "Bi-directional true-up — overage returned to you" },
  { label: "Claim intelligence", them: "None", us: "AI propensity scoring on every claim" },
  { label: "Compatibility", them: "Often vendor-specific", us: "Bank, clearinghouse & lockbox agnostic" },
  { label: "Workflow impact", them: "Disruptive to existing processes", us: "Enhances your existing workflow" },
];

const cfoValue = [
  {
    icon: Banknote,
    accent: "cyan" as const,
    title: "Cash flow transformation",
    body: "A 45+ day wait becomes 1–2 days. Meet payroll, fund operations, and stop financing your own receivables — without the cost or covenants of a line of credit.",
    footnote: "Predictable cash, on your terms.",
  },
  {
    icon: RefreshCw,
    accent: "lime" as const,
    title: "Compounding intelligence",
    body: "Every EOB and ERA processed makes the scoring engine smarter. Better predictions mean lower acceleration costs over time — a moat that builds itself.",
    footnote: "A moat that builds itself.",
  },
  {
    icon: Boxes,
    accent: "cyan" as const,
    title: "One vendor. Full lifecycle.",
    body: "Paper → structured data → AI scoring → accelerated payment → searchable archive. One relationship, one contract, SOC 2 Type II at every step.",
    footnote: "No integration complexity.",
  },
];

const Index = () => (
  <Layout>
    <SeoHead
      title="ClaimARC — Precision Valuation. Lightning Acceleration."
      description="ClaimARC is the AI-powered revenue intelligence platform for healthcare: EOB conversion to auto-postable 835s, ERA processing, and claim payment acceleration in 1–2 business days."
      path="/"
    />

    {/* Hero */}
    <section className="relative overflow-hidden bg-[var(--navy)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(55% 65% at 78% 5%, rgba(26,167,208,0.20), transparent 60%), radial-gradient(45% 55% at 5% 100%, rgba(132,189,0,0.12), transparent 60%)",
        }}
      />
      <div className="shell relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <Eyebrow tone="cyan" className="mb-5">AI-Powered Revenue Intelligence</Eyebrow>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[3.6rem]">
            The revenue cycle,{" "}
            <span className="text-[var(--cyan)]">rebuilt around your cash flow.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            ClaimARC turns remittance — paper EOBs and electronic ERAs alike — into
            structured intelligence, then uses it to advance payment on your claims in
            as little as one business day. Bank, clearinghouse, and lockbox agnostic.
            Precision valuation. Lightning acceleration.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink to="/contact" variant="primary">
              Book a Demo <ArrowRight size={16} />
            </CtaLink>
            <CtaLink to="/why-claimarc" variant="onDark">See how it works</CtaLink>
          </div>
        </Reveal>
        <Reveal delay={140} className="hidden lg:block">
          <HeroArc />
        </Reveal>
      </div>
    </section>
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "45+", label: "Days you're currently waiting", note: "Industry-avg DSO · HFMA", accent: "cyan" },
        { value: "99.7%", label: "Real-world EOB data accuracy", note: "98.5% contracted SLA · ClaimARC", accent: "lime" },
        { value: "1–2", label: "Business days to payment", note: "ClaimARC Accelerator funding target", accent: "cyan" },
      ]}
    />

    {/* Problem framing */}
    <Section tone="mist">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="The cost of the status quo"
            title={<>Your money is already earned. It's just stuck.</>}
            intro="A/R keeps aging, manual remittance handling keeps costing, and most financing options charge you for the privilege of waiting on your own claims. ClaimARC was built to close that gap — without disrupting a single workflow you rely on today."
          />
        </Reveal>
        <Reveal delay={120} className="grid gap-4 sm:grid-cols-2">
          {[
            { v: "5.2%", l: "Annual A/R increase", n: "Trend keeps worsening · Becker's / Kodiak, 2024" },
            { v: "$20B", l: "Annual remittance admin burden", n: "Processing inefficiency · HFMA" },
            { v: "7yr", l: "Compliant remittance archive", n: "Included · 10-year option available" },
            { v: "0", l: "Workflow changes required", n: "Enhances, never replaces" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <p className="text-3xl font-extrabold tracking-tight text-[var(--navy)]">{s.v}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--navy)]/80">{s.l}</p>
              <p className="mt-1 text-xs text-[var(--slate)]">{s.n}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>

    {/* Services */}
    <Section tone="light">
      <SectionHeading
        align="center"
        eyebrow="What we do"
        title={<>Three services. One compounding platform.</>}
        intro="Each works on its own. Together, they create an advantage competitors can't replicate — because it's built from your own data."
        className="mb-4"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {serviceCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.to} delay={i * 90}>
              <Link
                to={s.to}
                className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-white p-7 transition-shadow hover:shadow-[0_10px_36px_rgba(10,38,71,0.10)]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${s.accent}1a`, color: s.accent }}
                >
                  <Icon size={22} />
                </div>
                <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--slate)]">
                  {s.tag}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[var(--navy)]">{s.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--slate)]">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cyan)]">
                  Explore {s.name}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>

    {/* Flywheel */}
    <Section tone="navy">
      <SectionHeading
        invert
        eyebrow="How the platform compounds"
        eyebrowTone="cyan"
        title={<>More data. Smarter scoring. Lower cost. Repeat.</>}
        intro="Remittance is the fuel. Every document you process feeds the AI that prices and accelerates your claims — so the longer you run ClaimARC, the better it works for you."
      />
      <StepFlow steps={flywheel} />
    </Section>

    {/* Comparison */}
    <Section tone="light">
      <SectionHeading
        eyebrow="Why most financing options fall short"
        title={<>A line of credit costs you. Factoring costs you more.</>}
        intro="ClaimARC isn't a loan and it isn't factoring. It's payment acceleration priced by AI, with the upside returned to you."
      />
      <CompareTable themHeading="LOC / Factoring" usHeading="ClaimARC" rows={compareRows} />
    </Section>

    {/* CFO value */}
    <Section tone="mist">
      <SectionHeading
        align="center"
        eyebrow="Built for finance & revenue cycle leaders"
        title={<>What changes when you run ClaimARC.</>}
        intro="Designed with CFOs, controllers, and revenue cycle directors — for the metrics they're measured on."
      />
      <ValueCards cards={cfoValue} columns={3} />
    </Section>

    <CtaBand
      kicker="ClaimARC partnerships are limited and require qualification."
      headline="The question isn't whether you can afford ClaimARC."
      highlight="It's whether you can afford another 45 days of waiting."
      subhead="Book a 30-minute working session with our team and see the model against your own numbers."
    />
  </Layout>
);

export default Index;
