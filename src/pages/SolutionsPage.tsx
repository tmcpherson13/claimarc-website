import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CTABand from "@/components/CTABand";
import HeroAccent from "@/components/HeroAccent";
import RoleRoutingDiagram from "@/components/RoleRoutingDiagram";
import SeoHead from "@/components/SeoHead";
import SolutionFlowStream from "@/components/SolutionFlowStream";

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
  { key: "cfo", tab: "CFO / Executive", headline: "Stop Forecasting from Spreadsheets.", body: "One 90-day revenue projection that pulls in denial trends, payer behavior, underpayment recovery, and contract risk — so you can model contract decisions before you negotiate them.", supporting: "Also recommended: Sentinel · ContractIntel", ctaText: "Book a CFO-Focused Demo", ctaHref: "/contact?role=cfo", moduleName: "Forecast", stats: ["$12.6M 90-day projection", "84% confidence score", "What-if contract modeler", "Six driver cards"] },
  { key: "director", tab: "RC Director", headline: "See Underpayments, Overpayments, and Compliance in One View.", body: "Ledger gives you claim-level financial oversight — underpayment detection, Medicare 60-day repayment compliance, and an immutable audit trail. Pair with Forecast for the full picture from claim to projection.", supporting: "Also recommended: Forecast · Sentinel", ctaText: "Book a Director-Focused Demo", ctaHref: "/contact?role=director", moduleName: "Ledger", stats: ["Contract variance tracked per claim", "Six-stage compliance workflow", "Immutable audit log", "Dual-approver write-offs"] },
  { key: "manager", tab: "RC Manager", headline: "Stop Denials Before They Leave Your System.", body: "Shield scans every outbound claim batch against live payer rules pre-submission — no BAA required. The Regulatory Intelligence Feed flags CMS and payer policy shifts 45 days ahead. Activate today with live data.", supporting: "Also recommended: Prevent · Triage", ctaText: "Start Your 30-Day Evaluation — No BAA Required", ctaHref: "/contact?offer=trial", ctaEmerald: true, ctaNote: "Shield and Prevent included. Live data. Activates immediately.", moduleName: "Shield", stats: ["89.4% clean claim rate", "45-day regulatory advance feed", "No BAA Required", "Activates in 30 minutes"] },
  { key: "specialist", tab: "Billing Specialist", headline: "Work the Claims Most Likely to Pay. In That Order.", body: "Triage ranks your denial queue by recovery probability so you start with the cash that's actually recoverable. Every claim shows its score, rule driver, and AI insight — with one-click evidence assembly behind it.", supporting: "Also recommended: Evidence · Resolve", ctaText: "Book a Specialist-Focused Demo", ctaHref: "/contact?role=specialist", moduleName: "Triage", stats: ["$1.146M active recovery pipeline", "Recovery probability per claim", "Natural language search", "One-click evidence assembly"] },
  { key: "compliance", tab: "Auditor/Compliance Officer", headline: "The Medicare 60-Day Rule Has No Margin for Error.", body: "Ledger enforces the 60-day voluntary repayment rule automatically — immutable audit log, dual-approver authorization on every write-off, six-stage workflow. If regulators knock, your documentation is already time-stamped.", supporting: "Also recommended: Shield", ctaText: "Book a Compliance-Focused Demo", ctaHref: "/contact?role=compliance", moduleName: "Ledger", stats: ["Medicare 60-day enforcement", "Dual-approver write-offs", "Immutable audit log", "Six-stage overpayment workflow"] },
];

const SolutionsPage = () => {
  const [activeRole, setActiveRole] = useState("cfo");
  const role = roles.find((r) => r.key === activeRole)!;

  return (
    <Layout>
      <SeoHead
        title="Who ZDefense Is For — CFOs, Rev Cycle Leaders, Billing Teams"
        description="ZDefense routes each role to the modules that matter most — CFOs see Forecast, Directors see Ledger, Specialists see Triage."
        path="/solutions"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
        <HeroAccent />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl">
            Built for the Teams Who Live Inside the Revenue Cycle
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mt-4">
            Five roles. Five entry points. Pick yours to see the modules, signals,
            and outcomes built for the work you actually do.
          </p>
        </div>
      </section>

      {/* SECTION 2: TABBED ROLE CARDS */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="sticky top-[72px] z-40 bg-white border-b border-slate-100 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16 py-4 mb-12">
            <div className="flex gap-2 flex-wrap">
              {roles.map((r) => {
                const active = r.key === activeRole;
                return (
                  <button
                    key={r.key}
                    onClick={() => setActiveRole(r.key)}
                    className={
                      active
                        ? "bg-[var(--emerald)] text-white px-5 py-2 rounded-full font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2"
                        : "bg-[var(--lgray)] text-[var(--navy)] px-5 py-2 rounded-full text-sm hover:bg-emerald-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2"
                    }
                  >
                    {r.tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <h2 className="text-[var(--navy)] font-bold text-2xl md:text-3xl">
                {role.headline}
              </h2>
              <p className="text-slate-600 mt-4">{role.body}</p>
              <p className="text-slate-400 text-sm mt-4">{role.supporting}</p>
              <Link
                to={role.ctaHref}
                className={
                  role.ctaEmerald
                    ? "bg-[var(--emerald)] text-white px-6 py-2 rounded mt-6 inline-block hover:bg-emerald-600 transition-colors"
                    : "bg-[var(--navy)] text-white px-6 py-2 rounded mt-6 inline-block hover:bg-[var(--navy-dk)] transition-colors"
                }
              >
                {role.ctaText}
              </Link>
              <p className="text-slate-500 text-xs mt-3 max-w-md">
                We'll tailor the demo to your role, workflow, payer mix, and biggest revenue challenge.
              </p>
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
        </div>
      </section>

      <RoleRoutingDiagram />

      <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Live Triage War Room
            </h2>
            <p className="mt-4 text-white/70">
              Watch ZDefense AI³ route incoming claims into deny, appeal, and approve queues in real time — prioritized by recovery probability and dollar value.
            </p>
          </div>
          <TriageWarRoom />
        </div>
      </section>

      <CTABand
        headline="Not Sure Where to Start?"
        subhead="Book a demo and we'll tailor it to your role, workflow, payer mix, and biggest revenue challenge."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default SolutionsPage;
