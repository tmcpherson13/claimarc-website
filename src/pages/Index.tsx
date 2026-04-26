import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

import CTABand from "@/components/CTABand";
import TrialCallout from "@/components/TrialCallout";
import HeroAccent from "@/components/HeroAccent";
import HeroNetwork from "@/components/HeroNetwork";
import PayerThreatRadar from "@/components/PayerThreatRadar";
import SeoHead from "@/components/SeoHead";
import ComplianceStrip from "@/components/ComplianceStrip";
import { PHRASES } from "@/config/terminology";
import { useChatbot } from "@/context/ChatbotContext";

const Index = () => {
  const { open: openChatbot } = useChatbot();
  return (
    <Layout>
      <SeoHead
        title="ZDefense AI³ — Revenue Cycle Intelligence Platform"
        description="Predict payer risk. Protect revenue. Recover cash. ZDefense gives providers real-time payer behavioral insights, denial prevention, and 90-day revenue forecasting."
        path="/"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] min-h-[90vh] flex items-center px-6 md:px-12 lg:px-16 py-24">
        <HeroAccent />
        <HeroNetwork className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <p className="text-slate-400 italic text-base max-w-xl">
            While payers weaponize data and shifting rules against providers,
            ZDefense turns that same intelligence into your defense.
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mt-4 leading-tight">
            Predict payer risk. Protect revenue. Recover cash.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-xl mt-6">
            Nine modules. One platform. Real-time intelligence from payer
            behavior to 90-day revenue forecast.
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
              title="ContractIntel, Shield, and Prevent run on public payer data only. No BAA. No IT involvement."
            >
              30-Day Evaluation
            </Link>
          </div>
          <button
            type="button"
            onClick={() => openChatbot()}
            className="text-white/50 text-xs hover:text-white/80 transition-colors flex items-center gap-1.5 mt-3"
          >
            <span className="bg-[var(--emerald)] text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold mr-1">Z</span>
            Have a question? Ask Z
          </button>
          <div className="mt-14 pt-6 border-t border-slate-800">
            <ComplianceStrip />
          </div>
        </div>
      </section>

      {/* SECTION 2: PREDICT / PROTECT / RECOVER */}
      <section className="bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest text-center">
            THE PLATFORM
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mt-2">
            {PHRASES.threeLayersNineModules}
          </h2>
          <p className="text-slate-400 text-center mt-2 text-lg">
            ZDefense covers the full revenue cycle lifecycle — before, during,
            and after every claim.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { tag: "PREDICT", modules: "Sentinel · ContractIntel · Forecast", headline: "See risk before it becomes a denial.", body: "Payer behavior, contract gaps, and a 90-day revenue projection — surfaced for leadership.", proof: "$12.6M forecasted over 90 days", href: "/platform#predict", link: "Explore PREDICT →" },
              { tag: "PROTECT", modules: "Shield · Prevent · Ledger", headline: "Stop problems before payers or regulators find them.", body: "Pre-submission interception, prior auth defense, and 60-day Medicare compliance — handled.", proof: "89.4% clean claim rate", href: "/platform#protect", link: "Explore PROTECT →" },
              { tag: "RECOVER", modules: "Triage · Evidence · Resolve", headline: "Turn denied claims into recovered cash.", body: "Probability-ranked triage, automated evidence, and payer-specific appeals at bulk scale.", proof: "$1.146M active appeals pipeline", href: "/platform#recover", link: "Explore RECOVER →" },
            ].map((c) => (
              <div key={c.tag} className="bg-[var(--navy-dk)] border border-slate-700 rounded-xl p-8 hover:border-emerald-800 transition-colors">
                <div className="text-[var(--emerald)] font-bold text-xs uppercase tracking-widest">{c.tag}</div>
                <div className="text-slate-500 text-xs mt-1">{c.modules}</div>
                <div className="text-white font-semibold text-lg mt-4">{c.headline}</div>
                <p className="text-slate-400 text-sm mt-3">{c.body}</p>
                <div className="mt-6 pt-6 border-t border-slate-800 text-[var(--emerald)] text-sm font-bold mb-2">
                  {c.proof}
                </div>
                <Link to={c.href} className="text-slate-300 text-sm mt-1 block hover:text-white hover:underline">
                  {c.link}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: AI³ DEPLOYMENT */}
      <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">AI³ DEPLOYMENT</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            AI³ = three ways to deploy the intelligence — not three different products.
          </h2>
          <p className="text-slate-400 text-lg mt-3 max-w-2xl">
            Same platform. Same nine modules. Three delivery models: Actionable AI¹, Augmented AI², Automated AI³ — choose the one that fits your team's capacity and oversight preference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { tag: "Actionable AI¹", title: "Your team, our platform", body: "ZDefense surfaces the intelligence and prioritized actions. Your team executes inside their existing workflow." },
              { tag: "Augmented AI²", title: "ZTech co-pilot", body: "ZDefense plus a ZTech analyst working alongside your team — reviewing signals, prepping appeals, and accelerating recovery." },
              { tag: "Automated AI³", title: "Fire and forget", body: "ZDefense and ZTech operate the recovery and protection workflows end-to-end. Your team receives outcomes, not work queues." },
            ].map((c) => (
              <div key={c.tag} className="bg-[var(--navy-dk)] border border-slate-700 rounded-xl p-6">
                <div className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">{c.tag}</div>
                <div className="text-white font-semibold text-lg mt-2">{c.title}</div>
                <p className="text-slate-400 text-sm mt-2">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/pricing" className="text-slate-400 text-sm underline hover:text-white transition-colors">
              Learn about deployment models →
            </Link>
          </div>
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
          <p className="text-slate-600 max-w-xl mt-4 text-lg">
            Payers have deployed AI to identify denial opportunities faster than
            ever — shifting rules, weaponizing data, and moving faster than
            traditional revenue cycle workflows can detect. The gap between
            payer intelligence and provider response is widening.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { stat: "41%", label: "of providers report denial rates above 10%", source: "HFMA Denials Management Survey, 2024" },
              { stat: "86%", label: "of denials are preventable with earlier detection", source: "CAQH Index: Closing the Gap, 2023" },
              { stat: "60–90 days", label: "average lag to detect payer behavioral shifts", source: "Becker's Hospital Review, Revenue Cycle, 2023" },
            ].map((c) => (
              <div key={c.stat} className="bg-[var(--lgray)] rounded-xl p-8">
                <div className="text-[var(--navy)] font-bold text-4xl">{c.stat}</div>
                <div className="text-slate-700 text-sm mt-3">{c.label}</div>
                <div className="text-slate-500 text-xs mt-3 italic">{c.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: PAYER THREAT RADAR */}
      <PayerThreatRadar />

      {/* SECTION 5: DIFFERENTIATION */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
            WHY ZDEFENSE
          </p>
          <h2 className="text-[var(--navy)] text-2xl md:text-3xl font-semibold max-w-3xl mt-2">
            Denial management companies process denials. ZDefense understands payers.
          </h2>
          <p className="text-slate-600 max-w-xl mt-4 text-lg">
            Every denial management vendor works with data after it enters your
            system. ZDefense works at the point where data is created — the raw
            payer output, before any provider system transforms it. That is a
            data advantage no competitor can replicate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition-colors">
              <h3 className="text-[var(--navy)] font-semibold text-lg">We aren't your generic AI Start-up</h3>
              <p className="text-slate-600 text-sm mt-2">
                ZTech has processed Explanation of Benefits documents at scale
                for nearly a decade. ZDefense reflects codified institutional
                knowledge — not generic AI trained on generic data. The 50-rule
                CARC model reflects real denial patterns from real providers
                across every major payer.
              </p>
            </div>
            <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition-colors">
              <h3 className="text-[var(--navy)] font-semibold text-lg">No-BAA Entry Path</h3>
              <p className="text-slate-600 text-sm mt-2">
                Three modules activate immediately with zero data sharing.
                ContractIntel, Shield, and Prevent run entirely on public payer
                data. Start your 30-day evaluation with live intelligence
                benchmarked to your market — no BAA, no IT, no legal agreements.
              </p>
              <Link to="/contact?offer=trial" className="text-slate-500 text-sm mt-3 inline-block hover:text-[var(--navy)] hover:underline">
                Start your no-BAA evaluation →
              </Link>
            </div>
          </div>
          <Link to="/why-zdefense" className="text-slate-500 text-sm mt-8 inline-block hover:text-[var(--navy)] hover:underline font-semibold">
            See all differentiators →
          </Link>
        </div>
      </section>

      {/* SECTION 6: OUTCOMES */}
      <section className="bg-[var(--navy)] py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
            Platform Performance Signals
          </h2>
          <p className="text-slate-500 text-center text-xs mt-1">
            300-bed community hospital demo baseline · Figures are illustrative.
          </p>
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
            ].map((s, i) => (
              <div
                key={s.stat}
                className={`text-center py-8 px-6 min-h-[120px] flex flex-col justify-center ${
                  i < 2 ? "border-b border-slate-800 md:border-b-0" : ""
                }`}
              >
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
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
            BUILT FOR YOUR TEAM
          </p>
          <h2 className="text-[var(--navy)] text-2xl md:text-3xl font-semibold mt-2">
            Different roles. Different modules. Same platform.
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-xl">
            ZDefense routes each role to the modules that matter most — CFOs
            see Forecast, Directors see Ledger, Specialists see Triage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              { role: "CFO / Executive", module: "Forecast", desc: "90-day revenue visibility and risk modeling" },
              { role: "Rev Cycle Director", module: "Ledger", desc: "Underpayment detection and compliance oversight" },
              { role: "Billing Specialist", module: "Triage", desc: "Denial queue ranked by recovery probability" },
              { role: "Auditor/Compliance Officer", module: "Ledger", desc: "Medicare 60-day rule enforcement and audit trail" },
            ].map((r) => (
              <div key={r.role} className="bg-[var(--lgray)] rounded-xl p-5 hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="text-[var(--navy)] font-semibold">{r.role}</div>
                <div className="text-slate-500 text-sm mt-0.5">{r.module}</div>
                <div className="text-slate-600 text-xs mt-1">{r.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/solutions" className="text-slate-500 text-sm mt-8 inline-block hover:text-[var(--navy)] hover:underline font-semibold">
            See all roles →
          </Link>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA BAND */}
      <CTABand
        headline="Ready to See What Your Revenue Is Worth?"
        subhead="Book a personalized demo or start your 30-day no-obligation evaluation. Live payer data. No BAA required."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default Index;
