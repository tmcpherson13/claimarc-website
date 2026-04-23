import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TrialCallout from "@/components/TrialCallout";
import CTABand from "@/components/CTABand";

const WhyZDefensePage = () => {
  return (
    <Layout>
      {/* SECTION 1: HERO */}
      <section className="bg-[var(--navy)] py-24 px-16">
        <h1 className="text-white text-5xl font-bold max-w-3xl">
          Built on Years of Doing This Work by Hand
        </h1>
        <p className="text-slate-300 text-xl max-w-2xl mt-4">
          ZDefense is not a generic AI company. Expertise-first, AI-amplified
          — built by a team that spent nearly a decade converting EOBs
          (Explanation of Benefits) and indexing denials before writing a
          single line of code.
        </p>
      </section>

      {/* SECTION 2: WHY NOW */}
      <section className="bg-white py-24 px-16">
        <p className="text-[var(--amber)] text-sm font-semibold uppercase tracking-widest">
          THE MARKET
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold max-w-3xl mt-2">
          The Denial Crisis Is Accelerating. Most Providers Are Fighting It
          with Yesterday's Tools.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[
            {
              h: "Payer AI Is Weaponized",
              b: "Payers deploy machine learning to identify denial opportunities, shift rules mid-year, and change adjudication behavior faster than provider workflows can detect. The gap is widening — providers are on the wrong side of it.",
            },
            {
              h: "Prevention Is Underserved",
              b: "86% of denials are preventable. Most revenue cycle platforms focus on recovery after the denial. ZDefense focuses on the 30 days before the claim leaves your system — and makes three of those modules available with no data sharing required.",
            },
            {
              h: "Detection Lag Is Costly",
              b: "Traditional workflows detect payer behavioral shifts 60–90 days after they begin. ZDefense detects them in 7–14 days. That window is the difference between denial prevention and denial recovery.",
            },
            {
              h: "Mid-Market Is Underserved",
              b: "Enterprise health systems have analytics teams. Smaller providers have spreadsheets. ZDefense gives community hospitals and multi-specialty groups the same intelligence advantage that payers already have.",
            },
          ].map((c) => (
            <div key={c.h} className="bg-[var(--lgray)] rounded-xl p-6">
              <h3 className="text-[var(--navy)] font-semibold text-lg">
                {c.h}
              </h3>
              <p className="text-slate-600 text-sm mt-2">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SIX DIFFERENTIATORS */}
      <section className="bg-[var(--lgray)] py-24 px-16">
        <h2 className="text-[var(--navy)] text-4xl font-bold text-center">
          Six Reasons ZDefense Is Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          <div className="bg-white rounded-xl p-7 border border-[var(--lgray)] hover:border-emerald-200 transition">
            <h3 className="text-[var(--navy)] font-bold text-lg">
              No-BAA Entry Path
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              The single most important differentiator. Three modules activate
              immediately with zero data sharing. ContractIntel, Shield, and
              Prevent run on public data only. Start your 30-day evaluation
              today — no legal agreements, no IT, no BAA. Most organizations
              see their first intelligence signal within 72 hours.
            </p>
            <Link
              to="/contact?offer=trial"
              className="text-[var(--emerald)] text-sm mt-3 inline-block hover:underline"
            >
              Start your no-BAA evaluation →
            </Link>
          </div>
          {[
            {
              h: "Payer Weaponization Index",
              b: "Proprietary behavioral scoring powered by cross-portfolio 835 ERA (Electronic Remittance Advice) analysis. The only platform detecting systematic payer strategy changes — not just your denials, but cross-market patterns across hundreds of providers simultaneously. 7–14 days advance warning.",
            },
            {
              h: "Cross-Portfolio 835 Intelligence",
              b: "ZTech processes 835 ERA files across hundreds of provider organizations. That cross-portfolio view powers pattern detection no single-provider system can replicate. When a payer changes behavior, ZDefense sees it portfolio-wide — not just your claims.",
            },
            {
              h: "Nearly a Decade of EOB Heritage",
              b: "ZTech has processed Explanation of Benefits documents by hand for nearly a decade. ZDefense reflects codified institutional knowledge — not generic AI trained on generic data. The 50-rule CARC model reflects real denial patterns from real providers across every major payer.",
            },
            {
              h: "AI³ Delivery Flexibility",
              b: "Three deployment models fit any organizational structure — from self-serve analytics (Actionable AI¹) to fully managed revenue cycle operations (Automated AI³). Same platform. Same nine modules. Delivered the way your team needs it.",
            },
            {
              h: "Compliance-First Architecture",
              b: "SOC 2 Type II certified. ISO/IEC 27001:2022 certified. HIPAA-aligned from day one. Built to pass health system security reviews without a six-month procurement cycle.",
            },
          ].map((c) => (
            <div
              key={c.h}
              className="bg-white rounded-xl p-7 border border-[var(--lgray)] hover:border-emerald-200 transition"
            >
              <h3 className="text-[var(--navy)] font-bold text-lg">{c.h}</h3>
              <p className="text-slate-600 text-sm mt-2">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TRUST + CTA */}
      <section className="bg-white py-20 px-16">
        <h2 className="text-[var(--navy)] text-4xl font-bold text-center">
          Compliance That Protects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            {
              h: "SOC 2 Type II",
              b: "Independently audited against the AICPA SOC 2 Type II framework for security, availability, confidentiality, and data integrity across all operations.",
            },
            {
              h: "ISO/IEC 27001:2022",
              b: "Information Security Management System (ISMS) aligned with ISO/IEC 27001:2022 to safeguard sensitive healthcare data and manage information security risks.",
            },
            {
              h: "HIPAA Compliant",
              b: "HIPAA-aligned administrative, technical, and physical safeguards for all ePHI (electronic Protected Health Information) handling across all platform operations.",
            },
          ].map((c) => (
            <div
              key={c.h}
              className="border border-[var(--lgray)] rounded-xl p-6 text-center"
            >
              <h3 className="text-[var(--navy)] font-semibold text-lg">
                {c.h}
              </h3>
              <p className="text-slate-600 text-sm mt-2">{c.b}</p>
            </div>
          ))}
        </div>
        <TrialCallout />
      </section>

      <CTABand
        headline="See the Difference for Yourself"
        subhead="Book a strategic demo or start your 30-day no-obligation evaluation with live payer data today."
        primaryText="Book a Strategic Demo"
        primaryHref="/contact"
        secondaryText="Start 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default WhyZDefensePage;
