import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import LeadershipGrid from "@/components/marketing/LeadershipGrid";
import CtaBand from "@/components/marketing/CtaBand";
import { Section, SectionHeading, Eyebrow } from "@/components/marketing/primitives";

const LeadershipPage = () => (
  <Layout>
    <SeoHead
      title="Leadership — ClaimARC"
      description="The team behind ClaimARC: deep healthcare revenue cycle expertise, applied AI, and capital markets discipline."
      path="/leadership"
    />

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <Eyebrow tone="arc" className="mb-5">The team behind ClaimARC</Eyebrow>
          <h1 className="display text-balance text-4xl leading-[1.05] md:text-6xl">
            Operators, scientists,{" "}
            <span className="arc-text">and capital allocators.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-mid)]">
            ClaimARC was built by leaders who've spent careers inside healthcare revenue
            cycle, applied AI, and institutional finance — and decided to stop accepting
            that providers had to wait 45+ days for money they'd already earned.
          </p>
        </Reveal>
      </div>
    </section>

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
      headline="Every demo includes a working session with leadership."
      highlight="No layers, no SDRs."
      subhead="If you're qualified to evaluate ClaimARC, you should be talking to the people building it."
    />
  </Layout>
);

export default LeadershipPage;
