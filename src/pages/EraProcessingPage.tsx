import { CheckCircle2, FileSearch, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import StepFlow from "@/components/marketing/StepFlow";
import ValueCards from "@/components/marketing/ValueCards";
import CtaBand from "@/components/marketing/CtaBand";
import { Section, SectionHeading } from "@/components/marketing/primitives";

const steps = [
  {
    title: "Ingest",
    lead: "Every payer, one pipeline",
    body: "835 ERAs flow in from any clearinghouse, bank, or payer portal. ClaimARC consolidates them into a single normalized stream — no per-payer integrations to maintain.",
    footnote: "Bank & clearinghouse agnostic.",
  },
  {
    title: "Normalize",
    lead: "Clean, consistent data",
    body: "Adjustment codes, payer identifiers, and remittance details are standardized and validated, then enriched alongside your converted paper remittance.",
    footnote: "One source of truth.",
  },
  {
    title: "Reconcile & post",
    lead: "Matched to deposits",
    body: "ERAs are matched to bank deposits and outstanding claims, with exceptions surfaced for review. Auto-postable output is returned to your system on your schedule.",
    footnote: "Faster, cleaner posting.",
  },
  {
    title: "RevARC",
    lead: "Searchable archive",
    body: "Every remittance — electronic and paper — lands in a HIPAA-compliant portal with reporting, research, and a 7-year archive on demand.",
    footnote: "Actionable data on demand.",
  },
];

const delivers = [
  {
    icon: CheckCircle2,
    accent: "cyan" as const,
    title: "Hands-off posting",
    body: "Auto-postable 835 output across every payer means your team stops chasing remittance and starts working exceptions — not data entry.",
    footnote: "Less keying. Cleaner books.",
  },
  {
    icon: FileSearch,
    accent: "lime" as const,
    title: "Reconciliation & exceptions",
    body: "Deposits, claims, and adjustments matched automatically, with a clear queue for the items that need a human. Month-end gets quieter.",
    footnote: "Close the period with confidence.",
  },
  {
    icon: Layers,
    accent: "cyan" as const,
    title: "Unified remittance layer",
    body: "Paper and electronic remittance in one normalized dataset — the same data layer that trains ClaimARC's AI scoring and powers acceleration.",
    footnote: "The data flywheel, electronic too.",
  },
];

const EraProcessingPage = () => (
  <Layout>
    <SeoHead
      title="ERA Processing — 835 Normalization, Reconciliation & Posting | ClaimARC"
      description="ClaimARC normalizes, reconciles, and posts electronic remittance (835 ERAs) across every payer, with a searchable HIPAA-compliant archive — and feeds the same data layer that powers AI claim acceleration."
      path="/era-processing"
    />
    <ServiceHero
      eyebrow="ERA Processing · 835 Normalization"
      title={<>Every payer's remittance, <span className="text-[var(--cyan)]">one clean pipeline.</span></>}
      body="ClaimARC pulls electronic remittance from every clearinghouse, bank, and payer portal into one normalized stream — reconciled to your deposits, returned auto-postable, and archived in a searchable, audit-ready portal. Run it alongside EOB Conversion and your paper and electronic remittance finally live in one dataset."
      statValue="100"
      statSuffix="%"
      statLabel="Of your payers, one pipeline"
      statNote="No per-payer integrations to maintain"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "835", label: "ANSI X12 5010 output", note: "Auto-postable to your system", accent: "cyan" },
        { value: "7yr", label: "Compliant archive included", note: "10-year option available", accent: "lime" },
        { value: "1", label: "Unified remittance dataset", note: "Paper + electronic, normalized together", accent: "cyan" },
      ]}
    />

    <Section tone="light">
      <SectionHeading
        eyebrow="From feed to posted"
        title={<>Four steps. One normalized stream.</>}
        intro="Stop maintaining a patchwork of payer connections and posting rules. ClaimARC consolidates electronic remittance into one pipeline your team — and your AI — can rely on."
      />
      <StepFlow steps={steps} />
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What ClaimARC delivers"
        title={<>Cleaner posting. Quieter month-end.</>}
        intro="Automation where it's routine, visibility where it matters, and a unified data layer that earns its keep downstream."
      />
      <ValueCards cards={delivers} columns={3} />
    </Section>

    <CtaBand
      kicker="ERA and EOB conversion work best together — most teams have one, not both."
      headline="Bring every remittance into one pipeline."
      highlight="Then put that data to work."
      subhead="We'll map your current ERA flow and show where ClaimARC removes the manual steps."
    />
  </Layout>
);

export default EraProcessingPage;
