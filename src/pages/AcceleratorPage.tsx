import { Banknote, Scale, Target } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import StepFlow from "@/components/marketing/StepFlow";
import ValueCards from "@/components/marketing/ValueCards";
import CompareTable from "@/components/marketing/CompareTable";
import CtaBand from "@/components/marketing/CtaBand";
import { Section, SectionHeading } from "@/components/marketing/primitives";

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
    body: "Turn a 45+ day wait into 1 day, on the claims you choose, without covenants or new debt on the balance sheet. Meet payroll. Fund operations. Grow.",
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
      statValue="45"
      statSuffix="+"
      statLabel="Days you're currently waiting"
      statNote="Industry-avg DSO · HFMA"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "5.2%", label: "Annual A/R increase", note: "Trend keeps getting worse · Becker's / Kodiak, 2024", accent: "lime" },
        { value: "1", label: "Business day to payment*", note: "ClaimARC funding target", accent: "cyan" },
        { value: "2-way", label: "Bi-directional true-up", note: "Overage returned to you on every advance", accent: "cyan" },
      ]}
    />

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

    <Section tone="light">
      <SectionHeading
        eyebrow="Why most financing options fall short"
        title={<>It isn't a loan. It isn't factoring.</>}
        intro="It's payment acceleration priced by AI on your own data — with the upside returned to you, not kept by a lender."
      />
      <CompareTable themHeading="LOC / Factoring" usHeading="ClaimARC Accelerator" rows={compareRows} />
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What ClaimARC delivers"
        title={<>Precision valuation. Lightning acceleration.</>}
        intro="Fair pricing, recourse that runs both ways, and cash when you need it — on the claims you choose."
      />
      <ValueCards cards={delivers} columns={3} />
    </Section>

    <CtaBand
      kicker="ClaimARC partnerships are limited and require qualification."
      headline="The question isn't whether you can afford ClaimARC."
      highlight="It's whether you can afford another 45 days of waiting."
      subhead="A 30-minute conversation with our team — open discussion of how the platform fits your operation, no data required."
    />
  </Layout>
);

export default AcceleratorPage;
