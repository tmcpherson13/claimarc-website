import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

import CTABand from "@/components/CTABand";
import HeroAccent from "@/components/HeroAccent";
import WeaponizationCounterstrike from "@/components/WeaponizationCounterstrike";
import SeoHead from "@/components/SeoHead";
import ComplianceStrip from "@/components/ComplianceStrip";

const WhyZDefensePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Wait a tick for content to render before scrolling.
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <Layout>
      <SeoHead
        title="Why ZDefense — Payer Behavioral Intelligence & No-BAA Entry"
        description="Six reasons providers choose ZDefense: no-BAA entry, Payer Weaponization Index, cross-portfolio 835 intelligence, and nearly a decade of EOB heritage."
        path="/why-zdefense"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16">
        <HeroAccent />
        <WeaponizationCounterstrike className="absolute inset-0 w-full h-full opacity-85" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            WHY ZDEFENSE
          </p>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mt-2">
            Built on Years of Doing This Work by Hand
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mt-4">
            ZDefense is expertise-first and AI-amplified — not a generic AI
            company. Built by a team that spent nearly a decade converting
            EOBs (Explanation of Benefits) and indexing denials before writing
            a single line of platform code.
          </p>
          <p className="text-slate-400 text-base max-w-2xl mt-3 italic">
            The result: a payer-intelligence moat competitors can't replicate
            and a no-BAA entry path no enterprise vendor offers.
          </p>
          <div className="mt-10 max-w-3xl">
            <ComplianceStrip />
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY NOW */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--amber)] text-sm font-semibold uppercase tracking-widest">
            THE MARKET
          </p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold max-w-3xl mt-2">
            The denial crisis is accelerating. Most providers are fighting it with yesterday's tools.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              { h: "Payer AI Is Weaponized", b: "Payers deploy machine learning to identify denial opportunities, shift rules mid-year, and change adjudication behavior faster than provider workflows can detect. The gap is widening — providers are on the wrong side of it." },
              { h: "Prevention Is Underserved", b: "86% of denials are preventable. Most revenue cycle platforms focus on recovery after the denial. ZDefense focuses on the 30 days before the claim leaves your system — and makes three of those modules available with no data sharing required. (CAQH Index, 2023)" },
              { h: "Detection Lag Is Costly", b: "Traditional workflows detect payer behavioral shifts 60–90 days after they begin. ZDefense detects them in 7–14 days. That window is the difference between denial prevention and denial recovery." },
              { h: "Mid-Market Is Underserved", b: "Enterprise health systems have analytics teams. Smaller providers have spreadsheets. ZDefense gives community hospitals and multi-specialty groups the same intelligence advantage that payers already have." },
            ].map((c) => (
              <div key={c.h} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[var(--navy)] font-semibold text-lg">{c.h}</h3>
                <p className="text-slate-600 text-sm mt-2">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SIX DIFFERENTIATORS */}
      <section className="bg-[var(--lgray)] py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold text-center">
            Six Reasons ZDefense Is Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            <div className="bg-white rounded-xl p-7 border border-[var(--lgray)] hover:border-emerald-200 transition-colors">
              <h3 className="text-[var(--navy)] font-bold text-lg">No-BAA Entry Path</h3>
              <p className="text-slate-600 text-sm mt-2">
                The single most important differentiator. Three modules activate
                immediately with zero data sharing. ContractIntel, Shield, and
                Prevent run on public data only. Start your 30-day evaluation
                today — no legal agreements, no IT, no BAA. Most organizations
                see their first intelligence signal within 72 hours.
              </p>
              <Link to="/contact?offer=trial" className="text-[var(--emerald)] text-sm mt-3 inline-block hover:underline">
                Start your no-BAA evaluation →
              </Link>
            </div>
            {[
              { h: "Payer Weaponization Index", b: "Proprietary behavioral scoring powered by cross-portfolio 835 ERA (Electronic Remittance Advice) analysis. The only platform detecting systematic payer strategy changes — not just your denials, but cross-market patterns across hundreds of providers simultaneously. 7–14 days advance warning." },
              { h: "Cross-Portfolio 835 Intelligence", b: "ZTech processes 835 ERA files across hundreds of provider organizations. That cross-portfolio view powers pattern detection no single-provider system can replicate. When a payer changes behavior, ZDefense sees it portfolio-wide — not just your claims." },
              { h: "Nearly a Decade of EOB Heritage", b: "ZTech has processed Explanation of Benefits documents by hand for nearly a decade. ZDefense reflects codified institutional knowledge — not generic AI trained on generic data. The 50-rule CARC model reflects real denial patterns from real providers across every major payer." },
              { h: "AI³ Delivery Flexibility", b: "AI³ = three ways to deploy the intelligence — not three different products. Same platform. Same nine modules. Three delivery models: Actionable AI¹ (your team, our platform), Augmented AI² (ZTech co-pilot), Automated AI³ (fire and forget)." },
              { h: "Compliance-First Architecture", b: "SOC 2 Type II certified. ISO/IEC 27001:2022 certified. HIPAA-aligned from day one. Built to pass health system security reviews without a six-month procurement cycle." },
            ].map((c) => (
              <div key={c.h} className="bg-white rounded-xl p-7 border border-[var(--lgray)] hover:border-emerald-200 transition-colors">
                <h3 className="text-[var(--navy)] font-bold text-lg">{c.h}</h3>
                <p className="text-slate-600 text-sm mt-2">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TRUST + CTA */}
      <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest text-center">
            COMPLIANCE & SECURITY
          </p>
          <h2 className="text-white text-4xl font-bold text-center mt-2">
            Built to Pass Any Security Review
          </h2>
          <p className="text-slate-400 text-center mt-3 max-w-xl mx-auto text-lg">
            Three independent certifications. Zero exceptions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {[
              {
                id: "compliance-soc2",
                badge: "SOC 2",
                sub: "Type II Certified",
                color: "from-emerald-500 to-emerald-700",
                glow: "shadow-emerald-500/30",
                whatItMeans:
                  "Independent auditors observed our security controls operating in production over an extended period — not a snapshot, a sustained track record. Renewed annually.",
                whyItMatters: [
                  "Hardest of the three certifications to earn and keep",
                  "Proves controls actually work day after day, not just on paper",
                  "Accepted by enterprise security teams without additional testing",
                ],
                icon: "🛡",
              },
              {
                id: "compliance-iso",
                badge: "ISO 27001",
                sub: "IEC 27001:2022",
                color: "from-blue-500 to-blue-700",
                glow: "shadow-blue-500/30",
                whatItMeans:
                  "Our information security management system is aligned to the global standard for protecting sensitive data, including the 2022 update covering modern cloud and supply-chain risks.",
                whyItMatters: [
                  "Required baseline for most enterprise health-system reviews",
                  "Recognized internationally — clears procurement in any region",
                  "Demonstrates a managed program, not ad-hoc security",
                ],
                icon: "🔒",
              },
              {
                id: "compliance-hipaa",
                badge: "HIPAA",
                sub: "Compliant",
                color: "from-violet-500 to-violet-700",
                glow: "shadow-violet-500/30",
                whatItMeans:
                  "Administrative, technical, and physical safeguards for all ePHI handling are aligned to the HIPAA Security and Privacy Rules. BAA available for all full-platform engagements.",
                whyItMatters: [
                  "Table-stakes requirement for any healthcare vendor",
                  "Covers ePHI at rest, in transit, and in workflow",
                  "BAA-ready when you move beyond the no-BAA entry path",
                ],
                icon: "✦",
              },
            ].map((c, i) => (
              <div
                key={c.badge}
                id={c.id}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-8 text-center overflow-hidden hover:border-white/30 transition-all duration-500 hover:-translate-y-1 scroll-mt-24 target:ring-2 target:ring-[var(--emerald)]"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${c.color}`} />
                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${c.color} shadow-xl ${c.glow} mx-auto mb-5`}>
                  <span className="text-white text-2xl">{c.icon}</span>
                </div>
                <p className="text-white font-bold text-2xl">{c.badge}</p>
                <p className="text-slate-400 text-sm mt-0.5">{c.sub}</p>

                <div className="relative mt-6 text-left">
                  <p className="text-[var(--emerald)] text-[10px] font-semibold uppercase tracking-widest">
                    What it means
                  </p>
                  <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
                    {c.whatItMeans}
                  </p>

                  <p className="text-[var(--emerald)] text-[10px] font-semibold uppercase tracking-widest mt-5">
                    Why it matters
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {c.whyItMatters.map((point) => (
                      <li
                        key={point}
                        className="text-slate-300 text-sm leading-relaxed flex gap-2"
                      >
                        <span className="text-[var(--emerald)] mt-0.5 shrink-0">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${c.color} opacity-20 animate-ping`}
                  style={{ animationDuration: '3s', animationDelay: `${i * 0.5}s` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 flex flex-wrap justify-center gap-8 text-slate-500 text-xs uppercase tracking-widest">
            <span>Annual Independent Audit</span>
            <span>·</span>
            <span>Zero PHI Incidents</span>
            <span>·</span>
            <span>BAA Available on Request</span>
            <span>·</span>
            <span>SOC 2 Report on Request</span>
          </div>
        </div>
      </section>


      <CTABand
        headline="See the Difference for Yourself"
        subhead="Book a strategic demo or start your 30-day no-obligation evaluation with live payer data today."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default WhyZDefensePage;
