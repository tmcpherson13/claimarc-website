import { Banknote, FlaskConical, Scale, Settings2, ShieldCheck, Target } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import StepFlow from "@/components/marketing/StepFlow";
import ValueCards from "@/components/marketing/ValueCards";
import CompareTable from "@/components/marketing/CompareTable";
import NextPage from "@/components/marketing/NextPage";
import Reveal from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/primitives";

const implementationPillars = [
  {
    icon: ShieldCheck,
    accent: "var(--arc-1)",
    title: "Comprehensive onboarding",
    body: "A guided implementation playbook — connectivity, security, SLAs, escalation paths — documented end to end before a single file moves. Your team always knows what's next.",
    footnote: "No surprises. Ever.",
  },
  {
    icon: FlaskConical,
    accent: "var(--arc-3)",
    title: "Free parallel testing",
    body: "Run ClaimARC against your live remittance in parallel with your current process — at no cost — until output meets your bar. You only commit when the numbers prove themselves.",
    footnote: "Prove it before you commit.",
  },
  {
    icon: Settings2,
    accent: "var(--arc-2)",
    title: "Your business rules",
    body: "Posting logic, payer mappings, exception handling, adjustment codes — encoded to your specifications, not ours. ClaimARC adapts to how your shop already works.",
    footnote: "Configured to you.",
  },
];

const steps = [
  {
    title: "Score",
    lead: "Claim submitted",
    body: "AI scores every claim for propensity to pay and predicted DSO using your full claim history and ML-trained models — built around your payer mix.",
    footnote: "Built for your payer mix.",
  },
  {
    title: "Select",
    lead: "You stay in control",
    body: "Rank claims by score and choose which to fund. Lower risk means lower cost. Works with any bank, clearinghouse, or lockbox vendor.",
    footnote: "You decide what gets funded.",
  },
  {
    title: "Get paid",
    lead: "Next-day funding",
    body: "Funds are sent directly to you in 1 business day (target) after claim submission. No waiting on the payer's timeline.",
    footnote: "1 business day target.",
  },
  {
    title: "True-up",
    lead: "Bi-directional recourse",
    body: "If the payer pays more than predicted, the overage is returned to you. Bi-directional recourse is built into every advance — precision, every time.",
    footnote: "Precision built in. Every time.",
  },
];

const delivers = [
  {
    icon: Target,
    accent: "cyan" as const,
    title: "Priced by AI, not by risk class",
    body: "Every advance carries a transparent, risk-scored fee derived from your own remittance history — not a flat factor rate. The cleaner your data, the lower your cost.",
    footnote: "Transparent. Low. Yours.",
  },
  {
    icon: Scale,
    accent: "lime" as const,
    title: "Bi-directional true-up",
    body: "Unlike factoring or a line of credit, the upside comes back to you. If a claim pays above the prediction, you receive the difference — recourse that runs both ways.",
    footnote: "Always in your favor.",
  },
  {
    icon: Banknote,
    accent: "cyan" as const,
    title: "Cash flow on your schedule",
    body: "Turn a 55+ day wait into 1 day, on the claims you choose, without covenants or new debt on the balance sheet. Meet payroll. Fund operations. Grow.",
    footnote: "Workflow enhanced, not disrupted.",
  },
];

const compareRows = [
  { label: "Cost of funds", them: "10–30% per transaction", us: "Transparent, risk-scored fee" },
  { label: "Recourse model", them: "One-directional", us: "Bi-directional true-up — overage returned to you" },
  { label: "Claim intelligence", them: "None", us: "AI propensity scoring per claim" },
  { label: "Compatibility", them: "Often vendor-specific", us: "Bank, clearinghouse & lockbox agnostic" },
  { label: "Workflow impact", them: "Disruptive to existing processes", us: "Enhances your existing workflow" },
];

const AcceleratorPage = () => (
  <Layout>
    <SeoHead
      title="Claim Payment Accelerator — Funded in 1 Business Day | ClaimARC"
      description="ClaimARC's patent-pending Accelerator scores every claim for propensity to pay and advances payment in 1 business day (target) at a fraction of the cost of a line of credit or factoring — with bi-directional true-up. Bank, clearinghouse, and lockbox agnostic."
      path="/accelerator"
    />
    <ServiceHero
      eyebrow="Claim Payment Accelerator · Patent Pending · AI-Powered"
      title={<>Unlock capital already sitting in <span className="arc-text">unpaid claims.</span></>}
      body="Stop financing your own receivables. ClaimARC scores every claim for propensity to pay, then advances the cash to you in as little as one business day — at a fraction of the cost of a line of credit or factoring, with the upside returned to you. You choose which claims to fund. Nothing about your billing workflow changes."
      statValue="55"
      statSuffix="+"
      statLabel="Days you're currently waiting"
      statNote="Industry-avg wait to be paid · Kodiak, 2026"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "5.2%", label: "YoY growth in unpaid claims", note: "Your outstanding A/R balance is growing, not shrinking · Becker's / Kodiak, 2024", accent: "lime" },
        { value: "1", label: "Business day to payment*", note: "ClaimARC funding target", accent: "cyan" },
        { value: "100%", label: "Of overage returned to you", note: "Bi-directional true-up — on every single advance", accent: "cyan" },
      ]}
    />

    <Section tone="light">
      <SectionHeading
        eyebrow="Why most financing options fall short"
        title={<>It isn't a loan. It isn't factoring.</>}
        intro="It's payment acceleration priced by AI on your own data — with the upside returned to you, not kept by a lender."
      />
      <CompareTable themHeading="LOC / Factoring" usHeading="ClaimARC Accelerator" rows={compareRows} />
    </Section>

    <Section tone="navy">
      <SectionHeading
        invert
        eyebrow="How the Accelerator works"
        eyebrowTone="cyan"
        title={<>Four steps. AI-powered. Bi-directional.</>}
        intro="Submit. Score. Select. Get paid. The true-up keeps every advance precise — overpredict or underpredict, the difference comes back to you."
      />
      <StepFlow steps={steps} />
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What ClaimARC delivers"
        title={<>Fair pricing. Recourse that runs <span className="arc-text">both ways.</span></>}
        intro="Cash when you need it — on the claims you choose, with the upside returned to you."
      />
      <ValueCards cards={delivers} columns={3} />
    </Section>

    {/* Frictionless implementation — moved from home */}
    <Section tone="paper">
      <SectionHeading
        align="center"
        eyebrow="Frictionless implementation"
        title={<>Live without <span className="text-[var(--cyan-dk)]">the implementation tax.</span></>}
        intro="ClaimARC is engineered to drop into your existing workflow — not replace it. Onboarding is documented end-to-end, testing is free, and your business rules drive the output."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {implementationPillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 90}>
              <div
                className="relative flex h-full flex-col bg-white p-7"
                style={{
                  borderRadius: "14px",
                  border: "1px solid #D6E2EB",
                  borderLeft: `3px solid ${p.accent}`,
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}05)`,
                    border: `1px solid ${p.accent}44`,
                    color: p.accent,
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--text-hi)]">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-mid)]">{p.body}</p>
                <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                  {p.footnote}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>

    <NextPage
      title="Next: where the data comes from."
      description="The Accelerator is only as smart as the remittance it learns from. Claim to Cash Conversion is how paper EOBs, checks, and correspondence become the structured data the AI uses to price you."
      to="/eob-conversion"
      cta="Claim to Cash Conversion"
    />
  </Layout>
);

export default AcceleratorPage;
