import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TrialCallout from "@/components/TrialCallout";
import CTABand from "@/components/CTABand";
import BADBadge from "@/components/BADBadge";
import HeroAccent from "@/components/HeroAccent";
import PlatformCommandCenter from "@/components/PlatformCommandCenter";
import ModulePipelineFlow from "@/components/ModulePipelineFlow";
import DefenseNexusFlow from "@/components/DefenseNexusFlow";
import SeoHead from "@/components/SeoHead";
import { PHRASES } from "@/config/terminology";

interface Module {
  name: string;
  tagline: string;
  body: string;
  audience: string;
  required: boolean;
}

const ModuleCard = ({ m }: { m: Module }) => (
  <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition-colors bg-white">
    <BADBadge required={m.required} />
    <h3 className="text-[var(--navy)] font-bold text-xl mt-3">{m.name}</h3>
    <p className="text-[var(--emerald)] text-sm font-medium mt-0.5">{m.tagline}</p>
    <p className="text-slate-600 text-sm mt-3">{m.body}</p>
    <p className="text-slate-400 text-xs mt-3">{m.audience}</p>
  </div>
);

const predict: Module[] = [
  { name: "Sentinel", tagline: "Payer Weaponization Index", body: "See payer behavioral shifts 7–14 days before formal policy notice — so leadership can react before revenue is at risk.", audience: "RC Director", required: true },
  { name: "ContractIntel", tagline: "Rate Benchmarking & Contract Intelligence", body: "Benchmark contracted rates against public Transparency in Coverage data. $2.8M annual contract gap surfaced in demo. Public data only.", audience: "CFO · RC Director", required: false },
  { name: "Forecast", tagline: "90-Day Revenue Projection", body: "One unified 90-day revenue projection driven by every other module. $12.6M projected at 84% confidence in demo.", audience: "CFO · Executive", required: true },
];

const protect: Module[] = [
  { name: "Shield", tagline: "Pre-Submission Claim Interception", body: "89.4% clean claim rate in demo. Surfaces CMS, MAC, and commercial payer rule changes 45 days before they affect claims. Public data only.", audience: "RC Manager · Billing Specialist", required: false },
  { name: "Prevent", tagline: "Prior Authorization Defense", body: "Detects new prior authorization requirements 11 days in advance on average. $284K protected in demo. No patient data required.", audience: "RC Manager · RC Director", required: false },
  { name: "Ledger", tagline: "Underpayment Detection & Compliance Tracking", body: "Underpayment detection plus a Medicare 60-day compliance audit trail with dual-approver authorization on every write-off.", audience: "RC Director · Auditor/Compliance Officer", required: true },
];

const recover: Module[] = [
  { name: "Triage", tagline: "AI-Powered Denial Queue", body: "Denial queue auto-classified and ranked by recovery probability. $1.146M active recovery pipeline in current live build.", audience: "Billing Specialist · RC Manager", required: true },
  { name: "Evidence", tagline: "Automated Evidence Assembly", body: "Assembles the full appeal documentation package — clinical notes, modifiers, authorizations, coverage rules — before a specialist opens the file.", audience: "Billing Specialist", required: true },
  { name: "Resolve", tagline: "Bulk Appeal Generation", body: "Payer-specific appeal letters at bulk scale. Outcome tracking feeds back into the recovery model — accuracy improves with every appeal.", audience: "Billing Specialist · RC Director", required: true },
];

const PlatformPage = () => {
  return (
    <Layout>
      <SeoHead
        title="ZDefense Platform — Predict · Protect · Recover"
        description="Nine revenue cycle intelligence modules across Predict, Protect, and Recover. Start with three no-BAA modules; activate the rest as you grow."
        path="/platform"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16">
        <HeroAccent />
        <PlatformCommandCenter />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            HOW IT WORKS
          </p>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mt-2">
            Modular. Intelligent. Built for the Revenue Cycle.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mt-4">
            ZDefense is a modular revenue cycle intelligence platform organized
            into {PHRASES.threeOperationalLayers}. Start with the modules that match
            your biggest pain — no BAA required for three of them. Add modules
            as your organization grows.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to="/contact" className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors">
              Book a Demo
            </Link>
            <Link to="/contact?offer=trial" className="border-2 border-[var(--emerald)] text-[var(--emerald)] px-6 py-3 rounded font-semibold hover:bg-[var(--emerald)]/10 transition-colors">
              Start Your 30-Day Evaluation — No BAA Required
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: MODULE PIPELINE OVERVIEW */}
      <section className="bg-[var(--navy-dk)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              {PHRASES.nineModulesThreeLayers}
            </h2>
            <p className="text-slate-400 mt-4">
              Intelligence flows in one direction — forward. Every module
              feeds the next.
            </p>
          </div>
          <ModulePipelineFlow />
        </div>
      </section>

      {/* DATA FOUNDATION */}
      <section className="bg-[var(--navy-dk)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest text-center">
            THE DATA FOUNDATION
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mt-2 max-w-3xl mx-auto">
            The Data Foundation Behind Every ZDefense Decision
          </h2>
          <p className="text-slate-400 text-lg text-center max-w-3xl mx-auto mt-4">
            Crucible ingests 11 public data sources continuously — the same data your payers use to set rates and write rules. Few platforms in this space are built on a foundation like this, and none currently combine it with cross-portfolio remittance intelligence.
          </p>
          <DefenseNexusFlow className="mt-12" />
        </div>
      </section>

      {/* SECTION 2: NO-BAA ENTRY BAND */}
      <section className="bg-[var(--emerald)] py-14 px-6 md:px-12 lg:px-16 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl font-bold">
            Start in 30 minutes. Live data. No BAA required.
          </h2>
          <p className="text-[var(--navy)]/80 text-lg max-w-2xl mx-auto mt-3">
            ContractIntel, Shield, and Prevent run on public payer data only.
            No BAA. No IT involvement. Available for qualifying provider
            organizations. See real payer intelligence within 72 hours.
          </p>
          <Link to="/contact?offer=trial" className="bg-[var(--navy)] text-white px-8 py-3 rounded font-semibold mt-6 inline-block hover:bg-[var(--navy-dk)] transition-colors">
            Start Your 30-Day Evaluation — No BAA Required
          </Link>
          <p className="text-[var(--navy)]/60 text-xs mt-2">
            Available for qualifying provider organizations.
          </p>
        </div>
      </section>

      {/* SECTION 3: PREDICT */}
      <section id="predict" className="bg-white py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">PREDICT</p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold mt-2">
            Anticipate Risk Before It Becomes a Denial
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            Three modules that give your financial leadership the forward
            intelligence to act before revenue is at risk.
          </p>
          <p className="text-[var(--emerald)] text-sm font-semibold mt-4">
            Proof point: $12.6M forecasted over 90 days (demo baseline).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {predict.map((m) => <ModuleCard key={m.name} m={m} />)}
          </div>
        </div>
      </section>

      {/* SECTION 4: PROTECT */}
      <section id="protect" className="bg-[var(--lgray)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">PROTECT</p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold mt-2">
            Intercept Problems Before Payers — or Regulators — Find Them
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            Three modules that work pre-submission and pre-audit — stopping
            revenue loss and compliance exposure before it starts.
          </p>
          <p className="text-[var(--emerald)] text-sm font-semibold mt-4">
            Proof point: 89.4% clean claim rate (demo baseline).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {protect.map((m) => <ModuleCard key={m.name} m={m} />)}
          </div>
        </div>
      </section>

      {/* SECTION 5: RECOVER */}
      <section id="recover" className="bg-white py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">RECOVER</p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold mt-2">
            Turn Denied Claims Into Recovered Revenue — At Scale
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            Three modules that transform your denial queue into a structured
            recovery operation — triaged, documented, and appealed at bulk scale.
          </p>
          <p className="text-[var(--emerald)] text-sm font-semibold mt-4">
            Proof point: $1.146M active appeals pipeline (current live build).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {recover.map((m) => <ModuleCard key={m.name} m={m} />)}
          </div>
        </div>
      </section>

      {/* SECTION 6: AI³ DEPLOYMENT */}
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
        </div>
      </section>

      {/* SECTION 7: CTA */}
      <section className="px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <TrialCallout />
        </div>
      </section>
      <CTABand
        headline="See the Platform in Your Market Context"
        subhead="Book a personalized demo or start your 30-day no-obligation evaluation with live payer data today."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default PlatformPage;
