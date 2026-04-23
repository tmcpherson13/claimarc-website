import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AI3 from "@/components/AI3";
import CTABand from "@/components/CTABand";
import TrialCallout from "@/components/TrialCallout";

const Index = () => {
  return (
    <Layout>
      {/* SECTION 1: HERO */}
      <section className="bg-[var(--navy)] min-h-[90vh] flex items-center px-16 py-24">
        <div className="w-full">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            Revenue Cycle Intelligence Platform
          </p>
          <h1 className="text-white text-6xl font-bold max-w-4xl mt-4 leading-tight">
            Predict payer risk. Protect revenue. Recover cash.
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mt-6">
            ZDefense is a revenue cycle intelligence platform that gives
            providers real-time payer behavioral insights, denial prevention,
            automated recovery, regulatory intelligence, and compliance
            protection — unified into 90-day revenue forecasts.
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mt-3 italic">
            While payers weaponize data and shifting rules against providers,
            ZDefense turns that same intelligence into your defense. We also
            catch compliance landmines before they explode.
          </p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link
              to="/contact"
              className="bg-[var(--emerald)] text-white px-7 py-3 rounded font-semibold text-lg"
            >
              Book a Demo
            </Link>
            <Link
              to="/contact?offer=trial"
              className="border-2 border-[var(--emerald)] text-[var(--emerald)] px-7 py-3 rounded font-semibold text-lg"
            >
              Start Your 30-Day Evaluation — No BAA Required
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            ContractIntel, Shield, and Prevent activate with live payer data.
            No BAA required. No IT involvement. Available for qualifying
            provider organizations.
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
      <section className="bg-[var(--navy-dk)] py-10 px-16 flex items-center justify-center gap-6 flex-wrap">
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
        <Link to="/pricing" className="text-slate-400 text-sm underline ml-4">
          Learn about deployment models →
        </Link>
      </section>

      {/* SECTION 3: MARKET PROBLEM */}
      <section className="bg-white py-24 px-16">
        <p className="text-[var(--amber)] text-sm font-semibold uppercase tracking-widest">
          THE PROBLEM
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold max-w-3xl mt-2">
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
            {
              stat: "41%",
              label: "of providers report denial rates above 10%",
              source: "(Industry benchmark)",
            },
            {
              stat: "86%",
              label: "of denials are preventable with earlier detection",
              source: "(Industry benchmark)",
            },
            {
              stat: "60–90 days",
              label:
                "average lag to detect payer behavioral shifts using traditional workflows",
              source: "(Industry benchmark)",
            },
          ].map((c) => (
            <div key={c.stat} className="bg-[var(--lgray)] rounded-xl p-8">
              <div className="text-[var(--navy)] font-bold text-4xl">
                {c.stat}
              </div>
              <div className="text-slate-600 text-sm mt-2">{c.label}</div>
              <div className="text-slate-400 text-xs mt-1 italic">
                {c.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: PREDICT / PROTECT / RECOVER */}
      <section className="bg-[var(--navy)] py-24 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest text-center">
          THE PLATFORM
        </p>
        <h2 className="text-white text-4xl font-bold text-center mt-2">
          Three Clusters. Nine Modules. One Platform.
        </h2>
        <p className="text-slate-400 text-center mt-2 text-lg">
          ZDefense covers the full revenue cycle lifecycle — before, during,
          and after every claim.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {[
            {
              tag: "PREDICT",
              modules: "Sentinel · ContractIntel · Forecast",
              headline: "Anticipate risk before it becomes a denial.",
              body: "Real-time payer behavioral monitoring, contract benchmarking, and 90-day revenue forecasting — so your leadership team sees what's coming before it arrives.",
              href: "/platform#predict",
              link: "Explore PREDICT modules →",
            },
            {
              tag: "PROTECT",
              modules: "Shield · Prevent · Ledger",
              headline:
                "Prevent financial and compliance exposure before it escalates.",
              body: "Pre-submission claim interception, prior authorization defense, and overpayment compliance tracking — stopping problems before payers — or regulators — find them first.",
              href: "/platform#protect",
              link: "Explore PROTECT modules →",
            },
            {
              tag: "RECOVER",
              modules: "Triage · Evidence · Resolve",
              headline: "Convert denied claims into recovered cash.",
              body: "AI-powered denial triage, automated evidence assembly, and payer-specific appeal generation at bulk scale — with outcome tracking that improves every recovery cycle.",
              href: "/platform#recover",
              link: "Explore RECOVER modules →",
            },
          ].map((c) => (
            <div
              key={c.tag}
              className="bg-[var(--navy-dk)] border border-slate-700 rounded-xl p-8 hover:border-emerald-800 transition"
            >
              <div className="text-[var(--emerald)] font-bold text-xs uppercase tracking-widest">
                {c.tag}
              </div>
              <div className="text-slate-500 text-xs mt-1">{c.modules}</div>
              <div className="text-white font-semibold text-lg mt-4">
                {c.headline}
              </div>
              <p className="text-slate-400 text-sm mt-3">{c.body}</p>
              <Link
                to={c.href}
                className="text-[var(--emerald)] text-sm mt-4 inline-block hover:underline"
              >
                {c.link}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: DIFFERENTIATION */}
      <section className="bg-white py-24 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          WHY ZDEFENSE
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold max-w-3xl mt-2">
          Denial management companies fight denials. ZDefense understands
          payers.
        </h2>
        <p className="text-slate-600 max-w-2xl mt-4 text-lg">
          Every denial management vendor works with data after it enters your
          system. ZDefense works at the point where data is created — the raw
          payer output, before any provider system transforms it. That is a
          data advantage no competitor can replicate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition">
            <h3 className="text-[var(--navy)] font-semibold text-lg">
              No-BAA Entry Path
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Three modules activate immediately with zero data sharing.
              ContractIntel, Shield, and Prevent run entirely on public payer
              data. Start your 30-day evaluation with live intelligence
              benchmarked to your market — no BAA, no IT, no legal agreements.
            </p>
            <Link
              to="/contact?offer=trial"
              className="text-[var(--emerald)] text-sm mt-3 inline-block hover:underline"
            >
              Start your no-BAA evaluation →
            </Link>
          </div>
          <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition">
            <h3 className="text-[var(--navy)] font-semibold text-lg">
              Payer Weaponization Index
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Proprietary payer behavioral scoring powered by cross-portfolio
              835 ERA analysis. Detects systematic payer strategy changes
              7–14 days before formal policy notice across 7 standard payers.
              UHC at 2.4x, BCBS at 2.1x in live data.
            </p>
          </div>
          <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition">
            <h3 className="text-[var(--navy)] font-semibold text-lg">
              Eight Years of EOB Heritage
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              ZTech has processed Explanation of Benefits documents at scale
              for nearly a decade. ZDefense reflects codified institutional
              knowledge — not generic AI trained on generic data. The 50-rule
              CARC model reflects real denial patterns from real providers
              across every major payer.
            </p>
          </div>
          <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition">
            <h3 className="text-[var(--navy)] font-semibold text-lg">
              Compliance-First Architecture
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              SOC 2 Type II certified. ISO/IEC 27001:2022 certified.
              HIPAA-aligned from day one. Built to pass health system security
              reviews without a six-month procurement cycle.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: OUTCOMES */}
      <section className="bg-[var(--navy)] py-16 px-16">
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
            { stat: "$847K", label: "Active appeals pipeline", note: "Demo baseline" },
            { stat: "$2.8M", label: "Annual contract gap identified", note: "Demo baseline" },
          ].map((s) => (
            <div key={s.stat} className="text-center py-8 px-6">
              <div className="text-[var(--emerald)] text-4xl font-bold">
                {s.stat}
              </div>
              <div className="text-white text-sm mt-2">{s.label}</div>
              <div className="text-slate-500 text-xs mt-1">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: WHO IT'S FOR */}
      <section className="bg-white py-24 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          BUILT FOR YOUR TEAM
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold mt-2">
          Different roles. Different modules. Same platform.
        </h2>
        <p className="text-slate-600 text-lg mt-3 max-w-2xl">
          ZDefense routes each user to the intelligence that matters most to
          their workflow — automatically, from day one.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {[
            {
              role: "CFO / Executive",
              module: "Forecast",
              desc: "90-day revenue visibility and risk modeling",
              link: "See your view →",
              href: "/solutions",
            },
            {
              role: "RC Director",
              module: "Ledger",
              desc: "Underpayment detection and compliance oversight",
            },
            {
              role: "RC Manager",
              module: "Shield",
              desc: "Clean claim rate optimization — no BAA required",
            },
            {
              role: "Billing Specialist",
              module: "Triage",
              desc: "Denial queue ranked by recovery probability",
            },
            {
              role: "Compliance Officer",
              module: "Ledger",
              desc: "Medicare 60-day rule enforcement and audit trail",
            },
            {
              role: "Supervisor",
              module: "Sentinel",
              desc: "Payer Weaponization Index across 7 payers",
            },
          ].map((r) => (
            <div
              key={r.role}
              className="bg-[var(--lgray)] rounded-xl p-5 hover:bg-emerald-50 transition cursor-pointer"
            >
              <div className="text-[var(--navy)] font-semibold">{r.role}</div>
              <div className="text-[var(--emerald)] text-sm mt-0.5">
                {r.module}
              </div>
              <div className="text-slate-600 text-xs mt-1">{r.desc}</div>
              {r.link && r.href && (
                <Link
                  to={r.href}
                  className="text-[var(--emerald)] text-xs mt-2 inline-block"
                >
                  {r.link}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: TRIAL CALLOUT */}
      <section className="px-16">
        <TrialCallout />
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
