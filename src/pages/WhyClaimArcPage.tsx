import { Boxes, Layers, Lock, RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ServiceHero from "@/components/marketing/ServiceHero";
import ComplianceStrip from "@/components/marketing/ComplianceStrip";
import StatRow from "@/components/marketing/StatRow";
import CompareTable from "@/components/marketing/CompareTable";
import ValueCards from "@/components/marketing/ValueCards";
import CtaBand from "@/components/marketing/CtaBand";
import Reveal from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/primitives";
import { compliance } from "@/config/site";

const pipeline = [
  { label: "Paper & ERA", sub: "Remittance in", color: "var(--navy-soft)", note: "Expensive to process manually, invisible to most systems. This is where most organizations leave value on the table.", foot: "The starting point." },
  { label: "Xtract Engine", sub: "Structured 835s", color: "var(--cyan)", note: "AI converts paper to structured, auto-postable 835 files in 24–48 hours with your business rules applied. Output returned to your SFTP.", foot: "Builds the data asset." },
  { label: "AI Scoring", sub: "Propensity to pay", color: "var(--navy)", key: true, note: "Remittance history trains ML models that predict propensity to pay — per claim, per payer, per procedure. The more you process, the smarter it gets.", foot: "More data = lower cost." },
  { label: "Accelerator", sub: "Funded in 1–2 days", color: "var(--lime)", note: "Selected claims funded in 1–2 days at a fraction of LOC or factoring cost. Bi-directional true-up built in. Funds directly to you.", foot: "Always in your favor." },
];

const advantages = [
  {
    icon: TrendingUp,
    accent: "cyan" as const,
    title: "Cash flow transformation",
    body: "A 45+ day wait becomes 1–2 days. Your workflow is enhanced, not disrupted. Meet payroll. Fund operations. Grow. SOC 2 Type II and ISO 27001 certified.",
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
      title="Why ClaimARC — One Platform: Conversion, Intelligence, Acceleration"
      description="ClaimARC unifies EOB conversion, ERA processing, and AI-powered claim payment acceleration into one platform. More data trains smarter scoring, which lowers acceleration cost — a compounding advantage competitors can't replicate."
      path="/why-claimarc"
    />
    <ServiceHero
      eyebrow="EOB Conversion + ERA + Claim Acceleration"
      title={<>One platform. <span className="text-[var(--cyan)]">A compounding advantage.</span></>}
      body="ClaimARC's Accelerator advances payment in 1–2 business days — and the AI powering it is fueled by structured remittance data, the byproduct of our conversion platform. Three services. One advantage that builds over time. SOC 2 Type II."
      statValue="3"
      statLabel="Services · one vendor · no disruption"
      statNote="Conversion · Intelligence · Acceleration"
    />
    <ComplianceStrip />

    <StatRow
      stats={[
        { value: "99.7%", label: "Real-world EOB accuracy", note: "98.5% contracted SLA · ClaimARC", accent: "lime" },
        { value: "1–2", label: "Business days to payment", note: "ClaimARC Accelerator funding target", accent: "cyan" },
        { value: "7yr", label: "Compliant remittance archive", note: "10-year option available", accent: "cyan" },
      ]}
    />

    {/* Pipeline diagram */}
    <Section tone="light">
      <SectionHeading
        eyebrow="How the two services create a compounding advantage"
        title={<>More data. Smarter scoring. Lower cost. Repeat.</>}
        intro="Conversion produces the structured remittance that trains the scoring engine. Better scoring lowers the cost of acceleration. Lower cost makes processing more valuable. The loop tightens the longer you run it."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {pipeline.map((p, i) => (
          <Reveal key={p.label} delay={i * 80} className="flex flex-col">
            <div
              className="relative flex h-24 flex-col justify-center rounded-xl px-5 text-white"
              style={{ background: p.color }}
            >
              {p.key && (
                <span className="absolute -top-2.5 left-5 rounded bg-[var(--lime)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[var(--navy)]">
                  Key
                </span>
              )}
              <p className="text-base font-bold uppercase tracking-wide">{p.label}</p>
              <p className="text-xs text-white/70">{p.sub}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--slate)]">{p.note}</p>
            <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs font-semibold text-[var(--cyan)]">
              {p.foot}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section tone="mist">
      <SectionHeading
        eyebrow="What changes when you have both"
        title={<>Three advantages. One vendor. No disruption.</>}
        intro="Most health systems have one or the other. The ones growing fastest have both."
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
          { icon: Lock, t: "ISO 27001", d: "Certified information security management across people, process, and technology." },
          { icon: Layers, t: "HIPAA Compliant", d: "BAA-backed handling of PHI, with a 7-year (10-year optional) compliant archive." },
          { icon: TrendingUp, t: "Patent Pending", d: "Proprietary AI propensity scoring and bi-directional true-up methodology." },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.t} delay={i * 70} className="rounded-2xl border border-white/10 bg-[var(--navy-soft)] p-6">
              <Icon size={22} className="text-[var(--cyan)]" />
              <h3 className="mt-3 text-base font-bold text-white">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{c.d}</p>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-white/40">{compliance.join(" · ")}</p>
    </Section>

    <CtaBand
      kicker="ClaimARC partnerships are limited and require qualification."
      headline="Most health systems have one or the other."
      highlight="The ones growing fastest have both."
      subhead="Talk to our team about bringing conversion, intelligence, and acceleration under one roof."
    />
  </Layout>
);

export default WhyClaimArcPage;
