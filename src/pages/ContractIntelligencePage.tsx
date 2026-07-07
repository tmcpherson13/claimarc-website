import { Handshake, Scale, ShieldAlert } from "lucide-react";
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
    title: "Benchmark",
    lead: "RealRate™ benchmarking",
    body: "Every commercial payer-provider contract is measured against real, nationwide market rates — powered by CIQ Health's dataset of 200+ commercial payers and 500+ network plans.",
    footnote: "Powered by CIQ Health.",
  },
  {
    title: "Detect",
    lead: "Underpayment detection",
    body: "Claim-level comparison of what you were paid against what the market says you should have been paid — across all CPT, HCPCS, and MS-DRG codes.",
    footnote: "Revenue left on the table, surfaced.",
  },
  {
    title: "Negotiate",
    lead: "Negotiation support",
    body: "Data-backed strategy for renegotiating payer terms with confidence — not a guess, a benchmark drawn from 3.5M+ providers and facilities nationwide.",
    footnote: "Walk in with the data.",
  },
];

const delivers = [
  {
    icon: Scale,
    accent: "cyan" as const,
    title: "What you're paid vs. what you're owed",
    body: "ClaimARC already processes the 835 data showing what you were paid. Contract Intelligence adds what the market says you should be paid — closing the loop between paid and owed.",
    footnote: "The comparison you've never had.",
  },
  {
    icon: ShieldAlert,
    accent: "lime" as const,
    title: "Underpayment, surfaced automatically",
    body: "No manual contract review, no spreadsheet audits. Claim-level comparison runs continuously against your own remittance data, flagging underpayment as it happens.",
    footnote: "Continuous, not a one-time audit.",
  },
  {
    icon: Handshake,
    accent: "cyan" as const,
    title: "Negotiate from data, not instinct",
    body: "Renegotiation conversations backed by nationwide market-rate benchmarks — the same data layer that prices every claim ClaimARC accelerates.",
    footnote: "Confidence at the negotiating table.",
  },
];

const ContractIntelligencePage = () => (
  <Layout>
    <SeoHead
      title="Contract Intelligence — Payer Contract Benchmarking | ClaimARC"
      description="ClaimARC Contract Intelligence, powered by CIQ Health, benchmarks payer contracts against real nationwide market rates, detects underpayment claim by claim, and backs your renegotiation strategy with data — across 200+ commercial payers, 500+ network plans, and 3.5M+ providers and facilities."
      path="/contract-intelligence"
    />
    <ServiceHero
      eyebrow="Contract Intelligence · Powered by CIQ Health"
      title={<>Know what you're owed — <span className="arc-text">not just what you're paid.</span></>}
      body="ClaimARC already processes the 835 data showing what you're paid. Contract Intelligence, powered by CIQ Health, adds what the market says you should be paid — benchmarking every payer contract against real, nationwide market rates, surfacing underpayment claim by claim, and backing your renegotiation strategy with data."
      statValue="200"
      statSuffix="+"
      statLabel="Commercial payers benchmarked"
      statNote="Powered by CIQ Health"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "500+", label: "Network plans", note: "Benchmarked against real market rates", accent: "cyan" },
        { value: "3.5M+", label: "Providers and facilities", note: "In the CIQ Health dataset", accent: "lime" },
        { value: "All", label: "CPT, HCPCS & MS-DRG codes", note: "Full coverage, not a sample", accent: "cyan" },
      ]}
    />

    <Section tone="light">
      <SectionHeading
        eyebrow="How Contract Intelligence works"
        title={<>Three steps. Data-backed, end to end.</>}
        intro="Benchmark against the market, detect what's owed, and walk into renegotiation with the data to prove it."
      />
      <StepFlow steps={steps} />
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What ClaimARC delivers"
        title={<>Closes the loop between paid and owed.</>}
        intro="The same remittance data that powers claim scoring also powers contract benchmarking — one platform, one data layer, compounding advantage."
      />
      <ValueCards cards={delivers} columns={3} />
    </Section>

    <NextPage
      title="Next: see how it all fits together."
      description="Contract Intelligence closes the loop on paid vs. owed. The whole platform — conversion, scoring, acceleration, and benchmarking — runs on the same data layer."
      to="/why-claimarc"
      cta="See the full platform"
    />
  </Layout>
);

export default ContractIntelligencePage;
