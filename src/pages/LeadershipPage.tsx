import { Sparkles, Zap, Database } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import LeadershipGrid from "@/components/marketing/LeadershipGrid";
import CtaBand from "@/components/marketing/CtaBand";
import ScrollIndicator from "@/components/marketing/ScrollIndicator";
import { Section, SectionHeading, Eyebrow } from "@/components/marketing/primitives";

const aboutPillars = [
  {
    icon: Database,
    accent: "var(--arc-1)",
    title: "Conversion is the engine",
    body: "Processing claim-to-cash transactions — paper EOBs, checks, correspondence, and electronic ERAs — is the byproduct that feeds the Accelerator. Same workflow, two outputs: clean 835 files for your AR team and a remittance dataset for the AI.",
  },
  {
    icon: Sparkles,
    accent: "var(--arc-2)",
    title: "Built with AI, ML, RPA",
    body: "Tasks that used to require staff, spreadsheets, and unavoidable data leakage are now handled by machine learning models with measurable accuracy. The technology finally caught up to the problem.",
  },
  {
    icon: Zap,
    accent: "var(--arc-3)",
    title: "Acceleration is the payoff",
    body: "Once the data is structured, the same engine that classified it can price the risk of every claim and advance payment in 1 business day (target) — at a fraction of the cost of factoring or a line of credit.",
  },
];

const LeadershipPage = () => (
  <Layout>
    <SeoHead
      title="About & Leadership — ClaimARC"
      description="ClaimARC, a Retrieve Remit company, was built to solve healthcare's two biggest revenue-cycle pain points: time-to-reimbursement and making sense of claim-to-cash data. Meet the team and learn the origin story."
      path="/leadership"
    />

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <Eyebrow tone="arc" className="mb-5">The team behind ClaimARC</Eyebrow>
          <h1 className="display text-balance text-4xl leading-[1.05] md:text-6xl">
            Operators, data scientists,{" "}
            <span className="arc-text">and capital allocators.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-mid)]">
            ClaimARC was built by leaders who've spent careers inside healthcare revenue
            cycle, applied AI, and institutional finance — and decided to stop accepting
            that providers had to wait 45+ days for money they'd already earned.
          </p>
        </Reveal>
        <ScrollIndicator />
      </div>
    </section>

    {/* About / origin story */}
    <Section tone="mist">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="About ClaimARC"
            title={<>Born from a survey. <span className="arc-text">Two answers kept coming back.</span></>}
            intro="ClaimARC, a Retrieve Remit company, was born from a partnership with a leading Electronic Health Record platform. When we surveyed their providers, the answers came back unanimous: time-to-reimbursement was the biggest pain point, and making sense of claim-to-cash data — paper and electronic — was a close second."
          />
        </Reveal>
        <Reveal delay={120} className="space-y-5 text-[var(--text-mid)]">
          <p>
            We built ClaimARC to solve both problems in the same motion. The platform
            processes every paper EOB, check, correspondence, and electronic 835 a
            provider receives — and produces two outputs from the same workflow.
            The first is clean, auto-postable data your AR team can act on the same
            day. The second is the structured remittance dataset that trains our
            propensity-to-pay models.
          </p>
          <p>
            Traditionally, claim-to-cash has been handled manually — spreadsheets,
            keyed entries, and people. It can be made to work, but staffing is a
            persistent challenge, and manual processing inevitably produces data
            leakage and operational drag. The cost of "good enough" compounds quietly.
          </p>
          <p>
            AI, ML, and RPA have finally reached the maturity needed to handle this
            work at the accuracy bar that healthcare requires. The result is a step
            change: efficiency where the work used to be tedious, accuracy where errors
            used to be expensive, and time back for the people who used to do the
            keying. The data byproduct then powers our Claim Payment Accelerator — letting
            providers receive payments quickly, at a fraction of the cost of factoring
            or a line of credit.
          </p>
          <p className="text-[var(--text-hi)]">
            As healthcare keeps evolving, the providers that invest in this layer of
            their tech stack are the ones that stay competitive and well-positioned
            for the long term.
          </p>
        </Reveal>
      </div>

      {/* Three pillars summarizing the model */}
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {aboutPillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 90}>
              <div className="glass relative flex h-full flex-col p-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}33, ${p.accent}05)`,
                    border: `1px solid ${p.accent}55`,
                    color: p.accent,
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--text-hi)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">{p.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>

    <Section tone="light">
      <SectionHeading
        align="center"
        eyebrow="Leadership"
        title={<>The people accountable for every advance.</>}
        intro="Real names, real expertise, real accountability. We treat client capital like our own — because it is."
        className="mb-12"
      />
      <LeadershipGrid />
    </Section>

    <CtaBand
      kicker="Want to meet the team?"
      headline="Every conversation includes a working session with leadership."
      subhead="If you're qualified to evaluate ClaimARC, you should be talking to the people building it."
    />
  </Layout>
);

export default LeadershipPage;
