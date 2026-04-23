import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TrialCallout from "@/components/TrialCallout";
import CTABand from "@/components/CTABand";
import BADBadge from "@/components/BADBadge";

interface Module {
  name: string;
  tagline: string;
  body: string;
  audience: string;
  required: boolean;
}

const ModuleCard = ({ m }: { m: Module }) => (
  <div className="border border-[var(--lgray)] rounded-xl p-6 hover:border-emerald-200 transition bg-white">
    <BADBadge required={m.required} />
    <h3 className="text-[var(--navy)] font-bold text-xl mt-3">{m.name}</h3>
    <p className="text-[var(--emerald)] text-sm font-medium mt-0.5">
      {m.tagline}
    </p>
    <p className="text-slate-600 text-sm mt-3">{m.body}</p>
    <p className="text-slate-400 text-xs mt-3">{m.audience}</p>
  </div>
);

const predict: Module[] = [
  {
    name: "Sentinel",
    tagline: "Payer Weaponization Index",
    body: "Detects payer behavioral shifts 7–14 days before formal policy notice across all 7 standard payers. Tracks Appeal Response Velocity (ARV) and Eligibility Volatility (EV) signals. UHC at 2.4x, BCBS at 2.1x in live data.",
    audience: "Supervisor · RC Director",
    required: true,
  },
  {
    name: "ContractIntel",
    tagline: "Rate Benchmarking & Contract Intelligence",
    body: "Benchmarks contracted rates against Transparency in Coverage (TiC) data across 7 major payers. What-if contract modeler. Renewal calendar with days-to-expiration alerts. $2.8M annual contract gap on CPT 99214 visible in demo. Runs on public data only.",
    audience: "CFO · RC Director",
    required: false,
  },
  {
    name: "Forecast",
    tagline: "90-Day Revenue Projection",
    body: "Synthesizes all 8 other module signals into one 90-day revenue projection. $12.6M at 84% confidence in demo. Six driver cards. What-if sliders. The proof that the whole platform is working simultaneously.",
    audience: "CFO · Executive",
    required: true,
  },
];

const protect: Module[] = [
  {
    name: "Shield",
    tagline: "Pre-Submission Claim Interception",
    body: "89.4% clean claim rate. Regulatory Intelligence Feed surfaces CMS rule changes, MAC (Medicare Administrative Contractor) bulletins, and commercial payer policy shifts 45 days before they affect claims. Runs on public data only — no BAA required.",
    audience: "RC Manager · Billing Specialist",
    required: false,
  },
  {
    name: "Prevent",
    tagline: "Prior Authorization Defense",
    body: "Detects new prior authorization requirements 11 days in advance on average. $284K protected in demo. Specific to your CPT (Current Procedural Terminology) code mix and payer contracts. No patient data required.",
    audience: "RC Manager · RC Director",
    required: false,
  },
  {
    name: "Ledger",
    tagline: "Underpayment Detection & Compliance Tracking",
    body: "Underpayment detection against contracted rates. Medicare 60-day voluntary repayment compliance — immutable audit log, dual-approver authorization on all write-offs. Six-stage overpayment compliance workflow with full documentation trail.",
    audience: "RC Director · Compliance Officer",
    required: true,
  },
];

const recover: Module[] = [
  {
    name: "Triage",
    tagline: "AI-Powered Denial Queue",
    body: "Auto-classified denial queue. Recovery probability scored per claim using a 50-rule CARC (Claim Adjustment Reason Code)/RARC (Remittance Advice Remark Code) model. Rule Driver column. Natural language search. $847K active recovery pipeline in demo.",
    audience: "Billing Specialist · RC Manager",
    required: true,
  },
  {
    name: "Evidence",
    tagline: "Automated Evidence Assembly",
    body: "Automatically assembles the documentation package for each appeal — clinical notes, modifier records, authorization records, and coverage rules — organized by evidence category before a specialist touches the file.",
    audience: "Billing Specialist",
    required: true,
  },
  {
    name: "Resolve",
    tagline: "Bulk Appeal Generation",
    body: "Payer-specific appeal letters at bulk scale. 10 letters in 8 seconds at 78% confidence in demo. Six-lane routing by denial type. Outcome tracking feeds back into the recovery probability model — improves with every appeal.",
    audience: "Billing Specialist · RC Director",
    required: true,
  },
];

const PlatformPage = () => {
  return (
    <Layout>
      {/* SECTION 1: HERO */}
      <section className="bg-[var(--navy)] py-24 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          HOW IT WORKS
        </p>
        <h1 className="text-white text-5xl font-bold max-w-3xl mt-2">
          Modular. Intelligent. Built for the Revenue Cycle.
        </h1>
        <p className="text-slate-300 text-xl max-w-2xl mt-4">
          ZDefense is a modular revenue cycle intelligence platform organized
          into three operational clusters. Start with the modules that match
          your biggest pain — no BAA required for three of them. Add modules
          as your organization grows.
        </p>
        <div className="mt-8 flex gap-4 flex-wrap">
          <Link
            to="/contact"
            className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold"
          >
            Book a Demo
          </Link>
          <Link
            to="/contact?offer=trial"
            className="border-2 border-[var(--emerald)] text-[var(--emerald)] px-6 py-3 rounded font-semibold"
          >
            Start 30-Day Evaluation — No BAA Required
          </Link>
        </div>
      </section>

      {/* SECTION 2: NO-BAA ENTRY BAND */}
      <section className="bg-[var(--emerald)] py-14 px-16 text-center">
        <h2 className="text-[var(--navy)] text-3xl font-bold">
          Start in 30 minutes. Live data. No BAA required.
        </h2>
        <p className="text-[var(--navy)]/80 text-lg max-w-2xl mx-auto mt-3">
          Three ZDefense modules — ContractIntel, Shield, and Prevent — run
          entirely on public payer data and activate with live intelligence
          benchmarked to your actual market. No Business Associate Agreement.
          No IT involvement. No legal agreements. See real payer intelligence
          within 72 hours.
        </p>
        <Link
          to="/contact?offer=trial"
          className="bg-[var(--navy)] text-white px-8 py-3 rounded font-semibold mt-6 inline-block"
        >
          Start Your 30-Day Evaluation
        </Link>
        <p className="text-[var(--navy)]/60 text-xs mt-2">
          Available for qualifying provider organizations.
        </p>
      </section>

      {/* SECTION 3: PREDICT */}
      <section id="predict" className="bg-white py-20 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          PREDICT
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold mt-2">
          Anticipate Risk Before It Becomes a Denial
        </h2>
        <p className="text-slate-600 text-lg mt-3 max-w-2xl">
          Three modules that give your financial leadership the forward
          intelligence to act before revenue is at risk.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {predict.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      {/* SECTION 4: PROTECT */}
      <section id="protect" className="bg-[var(--lgray)] py-20 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          PROTECT
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold mt-2">
          Intercept Problems Before Payers — or Regulators — Find Them
        </h2>
        <p className="text-slate-600 text-lg mt-3 max-w-2xl">
          Three modules that work pre-submission and pre-audit — stopping
          revenue loss and compliance exposure before it starts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {protect.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      {/* SECTION 5: RECOVER */}
      <section id="recover" className="bg-white py-20 px-16">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          RECOVER
        </p>
        <h2 className="text-[var(--navy)] text-4xl font-bold mt-2">
          Turn Denied Claims Into Recovered Revenue — At Scale
        </h2>
        <p className="text-slate-600 text-lg mt-3 max-w-2xl">
          Three modules that transform your denial queue into a structured
          recovery operation — triaged, documented, and appealed at bulk
          scale.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {recover.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="px-16 bg-white">
        <TrialCallout />
      </section>
      <CTABand
        headline="See the Platform in Your Market Context"
        subhead="Book a personalized demo or start your 30-day no-obligation evaluation with live payer data today."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default PlatformPage;
