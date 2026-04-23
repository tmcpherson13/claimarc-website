import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import AI3 from "@/components/AI3";
import CTABand from "@/components/CTABand";
import TrialCallout from "@/components/TrialCallout";
import HeroAccent from "@/components/HeroAccent";

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>ZDefense AI³ — Predict Payer Risk. Protect Revenue. Recover Cash.</title>
        <meta
          name="description"
          content="ZDefense is a revenue cycle intelligence platform with payer behavioral insights, denial prevention, automated recovery, and 90-day revenue forecasting."
        />
        <link rel="canonical" href="https://zdefense.ai/" />
      </Helmet>

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] min-h-[90vh] flex items-center px-6 md:px-12 lg:px-16 py-24">
        <HeroAccent />
        <div className="relative w-full max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            Revenue Cycle Intelligence Platform
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mt-4 leading-tight">
            Predict payer risk. Protect revenue. Recover cash.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mt-6">
            ZDefense is a revenue cycle intelligence platform that gives
            providers real-time payer behavioral insights, denial prevention,
            automated recovery, regulatory intelligence, and compliance
            protection — unified into 90-day revenue forecasts.
          </p>
          <p className="text-slate-400 text-base md:text-lg max-w-3xl mt-3 italic">
            While payers weaponize data and shifting rules against providers,
            ZDefense turns that same intelligence into your defense.
          </p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link
              to="/contact"
              className="bg-[var(--emerald)] text-white px-7 py-3 rounded font-semibold text-lg hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
            >
              Book a Demo
            </Link>
            <Link
              to="/contact?offer=trial"
              className="border-2 border-[var(--emerald)] text-[var(--emerald)] px-7 py-3 rounded font-semibold text-lg hover:bg-[var(--emerald)]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
            >
              Start Your 30-Day Evaluation — No BAA Required
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            ContractIntel, Shield, and Prevent available immediately. No BAA
            required. No IT involvement. Available for qualifying provider
            organizations.
          </p>
          <div className="mt-14 pt-6 border-t border-slate-800 flex gap-8 text-slate-400 text-sm flex-wrap">
            <span>✓ SOC 2 Type II</span>
            <span>✓ ISO/IEC 27001:2022</span>
            <span>✓ HIPAA Compliant</span>
            <span>✓ 7-Year Remittance Archive</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: AI³ BAND */}
      <section className="bg-[var(--navy-dk)] py-10 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 flex-wrap">
          <span className="text-white text-base mr-4">
            <AI3 /> = intelligence delivered three ways:
          </span>
          <span className="border border-[var(--emerald)] text-[var(--emerald)] rounded-full px-5 py-1.5 text-sm">
            Actionable AI¹ — Your team, our platform
          </span>
          <span className="border border-[var(--emerald)] text-[var(--emerald)] rounded-full px-5 py-1.5 text-sm">
            Augmented AI² — ZTech co-pilot
          </span>
          <span className="border border-[var(--emerald)] text-[var(--emerald)] rounded-full px-5 py-1.5 text-sm">
            Automated AI³ — Fire and Forget
          </span>
          <Link to="/pricing" className="text-slate-400 text-sm underline ml-4 hover:text-white transition-colors">
            Learn about deployment models →
          </Link>
        </div>
      </section>

      {/* SECTION 3: MARKET PROBLEM */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--amber)] text-sm font-semibold uppercase tracking-widest">
            THE PROBLEM
          </p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold max-w-3xl mt-2">
            Payers are winning. Most providers don't know it yet.
          </h2>
          <p className="text-slate-600 max-w-2xl mt-4 text-lg">
            Payers have deployed AI to identify denial opportunities faster than
            ever — shifting rules, weaponizing data, and moving faster than
            traditional revenue cycle workflows can detect. The gap between
            payer intelligence and provider response is widening.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { stat: "41%", label: "of providers report denial rates above 10%", source: "(Industry benchmark)" },
              { stat: "86%", label: "of denials are preventable", source: "(Industry benchmark)" },
              { stat: "60–90 days", label: "average lag to detect payer behavioral shifts using traditional workflows", source: "(Industry benchmark)" },
            ].map((c) => (
              <div key={c.stat} className="bg-[var(--lgray)] rounded-xl p-8">
                <div className="text-[var(--navy)] font-bold text-4xl">{c.stat}</div>
                <div className="text-slate-600 text-sm mt-2">{c.label}</div>
                <div className="text-slate-400 text-xs mt-1 italic">{c.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PREDICT / PROTECT / RECOVER */}
      <section className="bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest text-center">
            THE PLATFORM
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mt-2">
            Three Clusters. Nine Modules. One Platform.
          </h2>
          <p className="text-slate-400 text-center mt-2 text-lg">
            ZDefense covers the full revenue cycle lifecycle — before, during,
            and after every claim.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { tag: "PREDICT", modules: "Sentinel · ContractIntel · Forecast", headline: "See risk before it becomes a denial.", body: "Payer behavior, contract gaps, and a 90-day revenue projection — surfaced for leadership.", href: "/platform#predict", link: "Explore PREDICT →" },
              { tag: "PROTECT", modules: "Shield · Prevent · Ledger", headline: "Stop problems before payers or regulators find them.", body: "Pre-submission interception, prior auth defense, and 60-day Medicare compliance — handled.", href: "/platform#protect", link: "Explore PROTECT →" },
              { tag: "RECOVER", modules: "Triage · Evidence · Resolve", headline: "Turn denied claims into recovered cash.", body: "Probability-ranked triage, automated evidence, and payer-specific appeals at bulk scale.", href: "/platform#recover", link: "Explore RECOVER →" },
            ].map((c) => (
              <div key={c.tag} className="bg-[var(--navy-dk)] border border-slate-700 rounded-xl p-8 hover:border-emerald-800 transition-colors">
                <div className="text-[var(--emerald)] font-bold text-xs uppercase tracking-widest">{c.tag}</div>
                <div className="text-slate-500 text-xs mt-1">{c.modules}</div>
                <div className="text-white font-semibold text-lg mt-4">{c.headline}</div>
                <p className="text-slate-400 text-sm mt-3">{c.body}</p>
                <Link to={c.href} className="text-[var(--emerald)] text-sm mt-4 inline-block hover:underline">
                  {c.link}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DIFFERENTIATION */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            WHY ZDEFENSE
          </p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold max-w-3xl mt-2">
            Denial management companies fight denials. ZDefense understands payers.
          </h2>
          <p className="text-slate-600 max-w-2xl mt-4 text-lg">
            Every denial management vendor works with data after it enters your
            system. ZDefense works at the point where data is created — the raw
            payer output, before any provider system transforms it. That is a
            data advantage no competitor can replicate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition-colors">
              <h3 className="text-[var(--navy)] font-semibold text-lg">No-BAA Entry Path</h3>
              <p className="text-slate-600 text-sm mt-2">
                Three modules activate immediately with zero data sharing.
                ContractIntel, Shield, and Prevent run entirely on public payer
                data. Start your 30-day evaluation with live intelligence
                benchmarked to your market — no BAA, no IT, no legal agreements.
              </p>
              <Link to="/contact?offer=trial" className="text-[var(--emerald)] text-sm mt-3 inline-block hover:underline">
                Start your no-BAA evaluation →
              </Link>
            </div>
            <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition-colors">
              <h3 className="text-[var(--navy)] font-semibold text-lg">Eight Years of EOB Heritage</h3>
              <p className="text-slate-600 text-sm mt-2">
                ZTech has processed Explanation of Benefits documents at scale
                for nearly a decade. ZDefense reflects codified institutional
                knowledge — not generic AI trained on generic data. The 50-rule
                CARC model reflects real denial patterns from real providers
                across every major payer.
              </p>
            </div>
          </div>
          <Link to="/why-zdefense" className="text-[var(--emerald)] text-sm mt-8 inline-block hover:underline font-semibold">
            See all differentiators →
          </Link>
        </div>
      </section>

      {/* SECTION 6: OUTCOMES */}
      <section className="bg-[var(--navy)] py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-3xl font-bold text-center">
            Platform Performance Signals
          </h2>
          <p className="text-slate-500 text-center text-xs mt-2">
            Figures shown reflect ZDefense platform demo outputs. Results vary
            by organization and data configuration.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-12 md:divide-x divide-slate-800">
            {[
              { stat: "$12.6M", label: "90-day revenue forecast", note: "Demo baseline" },
              { stat: "89.4%", label: "Clean claim rate post-Shield", note: "Demo baseline" },
              { stat: "$1.146M", label: "Active appeals pipeline", note: "Demo baseline" },
              { stat: "$2.8M", label: "Annual contract gap identified", note: "Demo baseline" },
            ].map((s) => (
              <div key={s.stat} className="text-center py-8 px-6">
                <div className="text-[var(--emerald)] text-4xl font-bold">{s.stat}</div>
                <div className="text-white text-sm mt-2">{s.label}</div>
                <div className="text-slate-500 text-xs mt-1">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: WHO IT'S FOR */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            BUILT FOR YOUR TEAM
          </p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold mt-2">
            Different roles. Different modules. Same platform.
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            ZDefense routes each user to the intelligence that matters most to
            their workflow — automatically, from day one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              { role: "CFO / Executive", module: "Forecast", desc: "90-day revenue visibility and risk modeling" },
              { role: "RC Director", module: "Ledger", desc: "Underpayment detection and compliance oversight" },
              { role: "Billing Specialist", module: "Triage", desc: "Denial queue ranked by recovery probability" },
              { role: "Compliance Officer", module: "Ledger", desc: "Medicare 60-day rule enforcement and audit trail" },
            ].map((r) => (
              <div key={r.role} className="bg-[var(--lgray)] rounded-xl p-5 hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="text-[var(--navy)] font-semibold">{r.role}</div>
                <div className="text-[var(--emerald)] text-sm mt-0.5">{r.module}</div>
                <div className="text-slate-600 text-xs mt-1">{r.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/solutions" className="text-[var(--emerald)] text-sm mt-8 inline-block hover:underline font-semibold">
            See all roles →
          </Link>
        </div>
      </section>

      {/* SECTION 8: TRIAL CALLOUT */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <TrialCallout />
        </div>
      </section>

      {/* SECTION 9: FINAL CTA BAND */}
      <CTABand
        headline="Ready to See What Your Revenue Is Worth?"
        subhead="Book a personalized demo or start your 30-day no-obligation evaluation. Live payer data. No BAA required."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default Index;
