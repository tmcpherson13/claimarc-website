import { Boxes, Layers, Lock, RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import CompareTable from "@/components/marketing/CompareTable";
import ValueCards from "@/components/marketing/ValueCards";
import CtaBand from "@/components/marketing/CtaBand";
import PartnerBand from "@/components/marketing/PartnerBand";
import NextPage from "@/components/marketing/NextPage";
import Reveal from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/primitives";
import { compliance } from "@/config/site";

/**
 * Why ClaimARC — the "how the platform works" page.
 *
 * Acts as the depth surface for visitors who clicked "See how the whole
 * platform fits together" from the homepage. Tells the system story:
 * pipeline → flywheel → advantages → comparison → trust.
 */
const pipeline = [
  { label: "Paper & ERA", sub: "Remittance in", color: "var(--text-lo)", note: "Expensive to process manually, invisible to most systems. This is where most organizations leave value on the table.", foot: "The starting point." },
  { label: "Conversion Platform", sub: "Structured 835s", color: "var(--arc-1)", note: "AI converts paper to structured, auto-postable 835 files in 24–48 hours with your business rules applied. Output returned to your SFTP.", foot: "Builds the data asset." },
  { label: "AI Scoring", sub: "Propensity to pay", color: "var(--arc-2)", key: true, note: "Remittance history trains ML models that predict propensity to pay — per claim, per payer, per procedure. The more you process, the smarter it gets.", foot: "More data = lower cost." },
  { label: "Accelerator", sub: "Funded in 1 day*", color: "var(--lime)", note: "Selected claims funded in 1 business day (target) at a fraction of LOC or factoring cost. Bi-directional true-up built in. Funds directly to you.", foot: "Always in your favor." },
];

const advantages = [
  {
    icon: TrendingUp,
    accent: "cyan" as const,
    title: "Cash flow transformation",
    body: "A 45+ day wait becomes 1 business day (target). Your workflow is enhanced, not disrupted. Meet payroll. Fund operations. Grow. SOC 2 Type II and HIPAA compliant at every step.",
    footnote: "Bank, clearinghouse & lockbox agnostic.",
  },
  {
    icon: RefreshCw,
    accent: "lime" as const,
    title: "Compounding intelligence",
    body: "Every EOB and ERA processed makes the AI smarter. Better predictions mean lower acceleration costs. The advantage compounds over time in ways competitors can't replicate.",
    footnote: "A moat that builds itself.",
  },
  {
    icon: Boxes,
    accent: "cyan" as const,
    title: "One vendor. Full lifecycle.",
    body: "Paper → structured data → AI scoring → accelerated payment → searchable archive. HIPAA compliant at every step. One relationship. One contract.",
    footnote: "No integration complexity.",
  },
];

const compareRows = [
  { label: "Cost of funds", them: "10–30% per transaction", us: "Transparent, low risk-scored fee" },
  { label: "Recourse model", them: "One-directional", us: "Bi-directional true-up" },
  { label: "Claim intelligence", them: "None", us: "AI propensity scoring per claim" },
  { label: "Compatibility", them: "Often vendor-specific", us: "Bank, clearinghouse & lockbox agnostic" },
  { label: "Workflow impact", them: "Disruptive to existing processes", us: "Enhances your existing workflow" },
];

const WhyClaimArcPage = () => (
  <Layout>
    <SeoHead
      title="Why ClaimARC — Acceleration, Powered by Your Own Data"
      description="ClaimARC's claim payment acceleration is the differentiator. Claim-to-cash conversion (EOBs + correspondence indexing and categorization) and ERA processing feed the AI that scores, prices, and funds your claims in 1 business day (target). SOC 2 Type II at every step."
      path="/why-claimarc"
    />
    <ServiceHero
      eyebrow="Acceleration, powered by your data"
      title={<>Acceleration leads. <span className="arc-text">Your data makes it less expensive.</span></>}
      body="Claim payment acceleration is the differentiator. Claim-to-cash conversion — paper EOBs, checks, and correspondence indexed and categorized into clean 835s — produces the remittance data that trains the AI scoring engine. That scoring is what lets ClaimARC fund you in 1 business day (target), and it gets less expensive to run the longer you run it. SOC 2 Type II at every step."
      statValue="1"
      statLabel="Business days to payment"
      statNote="Acceleration · Conversion · Intelligence"
      hideSecondary
    />

    {/* "Who runs on this" — credibility moment under the hero */}
    <PartnerBand />

    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "99.7%", label: "Real-world EOB accuracy", note: "98.5% contracted SLA · ClaimARC", accent: "lime" },
        { value: "1", label: "Business day to payment*", note: "ClaimARC Accelerator funding target", accent: "cyan" },
        { value: "7yr", label: "Compliant remittance archive", note: "10-year option available", accent: "cyan" },
      ]}
    />

    {/* Pipeline — the four stages, with the compounding payoff as the lede. */}
    <Section tone="light">
      <SectionHeading
        eyebrow="How the platform works"
        title={<>Four stages. <span className="arc-text">More data, less expensive over time.</span></>}
        intro="Remittance enters, conversion structures it, scoring prices it, and the accelerator funds it. Each stage stands on its own — and every document you process feeds the AI that prices the next one, so the longer you run ClaimARC, the less it costs you to run."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {pipeline.map((p, i) => (
          <Reveal key={p.label} delay={i * 80} className="flex flex-col">
            <div
              className="relative flex h-24 flex-col justify-center rounded-xl px-5 text-white"
              style={{ background: p.color }}
            >
              {p.key && (
                <span className="absolute -top-2.5 left-5 rounded bg-[var(--lime)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[var(--ink-0)]">
                  Key
                </span>
              )}
              <p className="text-base font-bold uppercase tracking-wide">{p.label}</p>
              <p className="text-xs text-white/70">{p.sub}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-mid)]">{p.note}</p>
            <p className="mt-4 border-t border-white/[0.08] pt-3 text-xs font-semibold text-[var(--arc-1)]">
              {p.foot}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What changes when you run the platform"
        title={<>Three advantages. One vendor. No disruption.</>}
        intro="Cash flow transformation, compounding intelligence, and a single relationship that spans paper-to-payment."
      />
      <ValueCards cards={advantages} columns={3} />
    </Section>

    <Section tone="light">
      <SectionHeading
        eyebrow="Why most financing options fall short"
        title={<>A line of credit costs you. Factoring costs you more.</>}
        intro="ClaimARC prices acceleration with AI on your own data — and returns the upside to you."
      />
      <CompareTable themHeading="LOC / Factoring" usHeading="ClaimARC" rows={compareRows} />
    </Section>

    <Section tone="navy">
      <SectionHeading
        invert
        eyebrow="Trust & compliance"
        eyebrowTone="cyan"
        title={<>Built for healthcare from the first byte.</>}
        intro="ClaimARC handles protected health information and payment data the way a financial-grade platform should — certified, auditable, and contractually backed."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, t: "SOC 2 Type II", d: "Independently audited security, availability, and confidentiality controls." },
          { icon: Lock, t: "HIPAA Compliant", d: "BAA-backed handling of PHI with PHI-aware access controls across every surface of the platform." },
          { icon: Layers, t: "7-Year Archive", d: "Compliant remittance archive included, 10-year option available — instantly retrievable, audit-ready." },
          { icon: TrendingUp, t: "Patent Pending", d: "Proprietary AI propensity scoring and bi-directional true-up methodology." },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.t} delay={i * 70} className="glass p-6">
              <Icon size={22} className="text-[var(--arc-1)]" />
              <h3 className="mt-3 text-base font-bold text-[var(--text-hi)]">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">{c.d}</p>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-white/40">{compliance.join(" · ")}</p>
    </Section>

    <NextPage
      eyebrow="Continue the conversation"
      title="Talk through how it fits your operation."
      description="A 30-minute working session with our team — open discussion on how conversion, scoring, and acceleration would map to your payer mix, your volumes, and your existing workflow."
      to="/contact"
      cta="Talk to the team"
    />

    <CtaBand
      kicker="ClaimARC partnerships are limited and require qualification."
      headline="Conversion. Intelligence. Acceleration."
      highlight="Three services. One platform."
      subhead="Talk to our team about bringing all three under one roof — built around the service that matters to you most."
    />
  </Layout>
);

export default WhyClaimArcPage;
