import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CTABand from "@/components/CTABand";

interface RoleContent {
  key: string;
  tab: string;
  headline: string;
  body: string;
  supporting: string;
  ctaText: string;
  ctaHref: string;
  ctaEmerald?: boolean;
  ctaNote?: string;
  moduleName: string;
  stats: string[];
}

const roles: RoleContent[] = [
  {
    key: "cfo",
    tab: "CFO / Executive",
    headline: "Stop Forecasting from Spreadsheets.",
    body: "ZDefense gives you a 90-day revenue projection that synthesizes denial trends, payer behavioral shifts, underpayment recovery, and contract risk into one confident number. With a what-if modeler and six driver cards, you can model the impact of payer contract decisions before you negotiate.",
    supporting: "Also recommended: Sentinel · ContractIntel · Ledger",
    ctaText: "Book a CFO-Focused Demo",
    ctaHref: "/contact?role=cfo",
    moduleName: "Forecast",
    stats: [
      "$12.6M 90-day projection",
      "84% confidence score",
      "6 driver cards",
      "What-if sliders",
    ],
  },
  {
    key: "director",
    tab: "RC Director",
    headline:
      "See Underpayments, Overpayments, and Compliance Risk in One View.",
    body: "Ledger gives you financial performance oversight at the claim level — underpayment detection against contracted rates, Medicare 60-day repayment compliance, and an immutable audit trail. Paired with Forecast, you have the complete picture from individual claim to 90-day projection.",
    supporting: "Also recommended: Forecast · Sentinel · ContractIntel",
    ctaText: "Book a Director-Focused Demo",
    ctaHref: "/contact?role=director",
    moduleName: "Ledger",
    stats: [
      "$295 underpayment detected (demo)",
      "-14.4% contract variance",
      "6-stage compliance workflow",
      "Immutable audit log",
    ],
  },
  {
    key: "manager",
    tab: "RC Manager",
    headline: "Stop Denials Before They Leave Your System.",
    body: "Shield scans every outbound claim batch against live payer adjudication rules before submission — with no BAA required. The Regulatory Intelligence Feed surfaces CMS rule changes and payer policy shifts 45 days before they affect your claims. Start your 30-day evaluation today with live data and no data sharing required.",
    supporting: "Also recommended: Prevent · Triage",
    ctaText: "Start 30-Day Evaluation — No BAA Required",
    ctaHref: "/contact?offer=trial",
    ctaEmerald: true,
    ctaNote: "Shield and Prevent included. Live data. Activates immediately.",
    moduleName: "Shield",
    stats: [
      "89.4% clean claim rate",
      "8 claims intercepted (demo)",
      "$41K protected today (demo)",
      "No BAA Required",
    ],
  },
  {
    key: "specialist",
    tab: "Billing Specialist",
    headline: "Work the Claims Most Likely to Pay. In That Order.",
    body: "Triage auto-classifies your denial queue by recovery probability using a 50-rule CARC/RARC model. Every claim shows its recovery score, rule driver, and AI insight before you touch it. Natural language search. One-click evidence assembly. Appeal letters generated in 8 seconds.",
    supporting: "Also recommended: Evidence · Resolve",
    ctaText: "Book a Specialist-Focused Demo",
    ctaHref: "/contact?role=specialist",
    moduleName: "Triage",
    stats: [
      "55 active claims (demo)",
      "$847K recovery pipeline",
      "Recovery probability per claim",
      "Natural language search",
    ],
  },
  {
    key: "compliance",
    tab: "Compliance Officer",
    headline: "The Medicare 60-Day Rule Has No Margin for Error.",
    body: "Ledger enforces the Medicare 60-day voluntary repayment rule automatically — with an immutable audit log, dual-approver authorization on every write-off, and a six-stage overpayment compliance workflow. If regulators knock, your documentation is already there and time-stamped.",
    supporting: "Also recommended: Shield · Forecast",
    ctaText: "Book a Compliance-Focused Demo",
    ctaHref: "/contact?role=compliance",
    moduleName: "Ledger",
    stats: [
      "Medicare 60-day compliance enforced",
      "Dual-approver write-off authorization",
      "Immutable audit log",
      "6-stage overpayment workflow",
    ],
  },
  {
    key: "supervisor",
    tab: "Supervisor",
    headline:
      "Know When a Payer Changes Strategy — Before Your Team Feels It.",
    body: "Sentinel monitors the Payer Weaponization Index across all 7 standard payers simultaneously. UHC at 2.4x and BCBS at 2.1x in live data. Appeal Response Velocity (ARV) and Eligibility Volatility (EV) signals give you 7–14 days advance warning before behavioral shifts become denial patterns.",
    supporting: "Also recommended: Triage · Shield",
    ctaText: "Book a Supervisor-Focused Demo",
    ctaHref: "/contact?role=supervisor",
    moduleName: "Sentinel",
    stats: [
      "6 payer cards",
      "UHC 2.4x · BCBS 2.1x (live data)",
      "ARV + EV signal tracking",
      "90-day trajectory chart",
    ],
  },
];

const SolutionsPage = () => {
  const [activeRole, setActiveRole] = useState("cfo");
  const role = roles.find((r) => r.key === activeRole)!;

  return (
    <Layout>
      {/* SECTION 1: HERO */}
      <section className="bg-[var(--navy)] py-20 px-16">
        <h1 className="text-white text-5xl font-bold max-w-3xl">
          Built for the Teams Who Live Inside the Revenue Cycle
        </h1>
        <p className="text-slate-300 text-xl max-w-2xl mt-4">
          ZDefense routes each user to the intelligence that matters most to
          their workflow. Select your role to see what the platform looks
          like for you.
        </p>
      </section>

      {/* SECTION 2: TABBED ROLE CARDS */}
      <section className="bg-white py-20 px-16">
        <div className="flex gap-2 mb-12 flex-wrap">
          {roles.map((r) => {
            const active = r.key === activeRole;
            return (
              <button
                key={r.key}
                onClick={() => setActiveRole(r.key)}
                className={
                  active
                    ? "bg-[var(--emerald)] text-white px-5 py-2 rounded-full font-semibold text-sm"
                    : "bg-[var(--lgray)] text-[var(--navy)] px-5 py-2 rounded-full text-sm hover:bg-emerald-50 transition"
                }
              >
                {r.tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-[var(--navy)] font-bold text-3xl">
              {role.headline}
            </h2>
            <p className="text-slate-600 mt-4">{role.body}</p>
            <p className="text-slate-400 text-sm mt-4">{role.supporting}</p>
            <Link
              to={role.ctaHref}
              className={
                role.ctaEmerald
                  ? "bg-[var(--emerald)] text-white px-6 py-2 rounded mt-6 inline-block"
                  : "bg-[var(--navy)] text-white px-6 py-2 rounded mt-6 inline-block"
              }
            >
              {role.ctaText}
            </Link>
            {role.ctaNote && (
              <p className="text-slate-400 text-xs mt-2">{role.ctaNote}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="bg-[var(--lgray)] rounded-xl p-6 border-l-4 border-[var(--emerald)]">
              <p className="text-[var(--emerald)] text-xs uppercase tracking-widest font-semibold">
                PRIMARY MODULE
              </p>
              <h3 className="text-[var(--navy)] font-bold text-2xl mt-1">
                {role.moduleName}
              </h3>
              <ul className="text-slate-600 text-sm mt-3 space-y-1">
                {role.stats.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        headline="Not Sure Where to Start?"
        subhead="Book a demo and we will route you to the modules most relevant to your role, your payer mix, and your biggest revenue challenge."
        primaryText="Book a Role-Based Demo"
        primaryHref="/contact"
        secondaryText="Start 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default SolutionsPage;
