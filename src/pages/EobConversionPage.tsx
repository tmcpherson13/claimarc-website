import { Infinity as InfinityIcon, ShieldCheck, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import StepFlow from "@/components/marketing/StepFlow";
import ValueCards from "@/components/marketing/ValueCards";
import NextPage from "@/components/marketing/NextPage";
import { Section, SectionHeading } from "@/components/marketing/primitives";

const steps = [
  {
    title: "Receive",
    lead: "Paper & correspondence arrive",
    body: "EOBs, checks, and correspondence are scanned at 300 DPI and transmitted to ClaimARC via SFTP in the agreed format — from any lockbox or scanning vendor.",
    footnote: "Any lockbox or scanning vendor.",
  },
  {
    title: "Index & categorize",
    lead: "Every document classified",
    body: "Correspondence is automatically indexed and categorized — denials, requests for information, refunds, recoupments — so nothing sits in a queue waiting to be triaged.",
    footnote: "No more correspondence backlog.",
  },
  {
    title: "Extract",
    lead: "Our platform processes",
    body: "ML data-lifting pulls every data element from most images. Each file is quality-checked and structured for clean 835 generation.",
    footnote: "Builds your intelligence layer.",
  },
  {
    title: "Convert",
    lead: "835 generated",
    body: "ANSI X12 5010 835 output with your custom business rules applied per your specifications. Auto-postable, returned to your SFTP.",
    footnote: "Ready for your system. Every time.",
  },
  {
    title: "RevARC",
    lead: "Full visibility portal",
    body: "Searchable remittance research, reporting, reconciliation, and a 7-year archive in a HIPAA-compliant portal.",
    footnote: "Actionable data on demand.",
  },
];

const delivers = [
  {
    stat: "99.7%",
    accent: "lime" as const,
    title: "Accuracy & speed",
    body: "Real-world field accuracy with a 98.5% contracted SLA — service credit applied if missed. 24-hour or 48-hour turnaround options to fit your workflow.",
    footnote: "Eliminate the cost of manual error.",
  },
  {
    stat: "7yr",
    accent: "cyan" as const,
    title: "Archive & compliance",
    body: "Seven-year image storage included, with a 10-year option available. SOC 2 Type II and HIPAA compliant — instantly retrievable, audit-ready, BAA-backed.",
    footnote: "Enterprise security. Zero compromise.",
  },
  {
    icon: InfinityIcon,
    accent: "lime" as const,
    title: "The data flywheel",
    body: "Every EOB processed feeds ClaimARC's AI scoring engine — turning remittance history into the intelligence that powers claim payment acceleration. The data you generate compounds in your favor.",
    footnote: "A competitive moat that builds itself.",
  },
];

const EobConversionPage = () => (
  <Layout>
    <SeoHead
      title="Claim to Cash Conversion — Paper, EOBs & Correspondence to 835s | ClaimARC"
      description="ClaimARC's claim-to-cash conversion platform turns paper EOBs, checks, and correspondence into structured, auto-postable ANSI X12 835 files — indexed, categorized, and routed with your business rules applied. 99.7% accuracy, 24/48-hour turnaround."
      path="/eob-conversion"
    />
    <ServiceHero
      eyebrow="Claim to Cash Conversion · HIPAA Compliant"
      title={<>Unlock the data buried <span className="arc-text">in paper and correspondence.</span></>}
      body="ClaimARC turns paper Explanation of Benefits, checks, and correspondence — indexed and categorized — into structured, auto-postable 835 files. Your custom business rules applied, returned ready to post. The same clean output feeds the AI that powers claim payment acceleration. Works with whatever lockbox, bank, or scanning vendor you already use; nothing in your workflow changes."
      statValue="99.7"
      statSuffix="%"
      statLabel="Real-world data accuracy"
      statNote="98.5% contracted SLA · ClaimARC"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "$20B", label: "Annual admin burden", note: "Remittance processing inefficiency · HFMA", accent: "lime" },
        { value: "24 & 48hr", label: "Turnaround options", note: "ClaimARC service-level agreement", accent: "cyan" },
        { value: "100%", label: "Auto-postable output", note: "ANSI X12 5010 835 · your business rules", accent: "cyan" },
      ]}
    />

    <Section tone="light">
      <SectionHeading
        eyebrow="From paper to structured intelligence"
        title={<>Five steps. Minimal manual handling.</>}
        intro="Your team stops keying remittance by hand — our trained specialists handle what the models can't. ClaimARC delivers clean, postable data — and quietly builds the data asset that powers the rest of the platform."
      />
      <StepFlow steps={steps} />
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What ClaimARC delivers"
        title={<>Precision at every step.</>}
        intro="Accuracy you can post against, compliance you can defend, and a data layer that pays dividends downstream."
      />
      <ValueCards cards={delivers} columns={3} />
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-[var(--text-hi)]">
        <span className="inline-flex items-center gap-2"><Zap size={16} className="text-[var(--arc-1)]" />Eliminate the cost of manual error.</span>
        <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[var(--lime)]" />Enterprise security. Zero compromise.</span>
        <span className="inline-flex items-center gap-2"><InfinityIcon size={16} className="text-[var(--arc-1)]" />A competitive moat that builds itself.</span>
      </div>
    </Section>

    <NextPage
      title="Next: the electronic side of the same engine."
      description="Conversion handles paper and correspondence. ERA Processing handles the 835s already coming in — normalized, reconciled, and posted across every payer."
      to="/era-processing"
      cta="ERA Processing"
    />

  </Layout>
);

export default EobConversionPage;
