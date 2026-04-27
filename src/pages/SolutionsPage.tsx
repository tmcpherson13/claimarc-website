import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowDown, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import CTABand from "@/components/CTABand";
import HeroAccent from "@/components/HeroAccent";
import RoleRoutingDiagram from "@/components/RoleRoutingDiagram";
import SeoHead from "@/components/SeoHead";
import SolutionFlowStream from "@/components/SolutionFlowStream";
import { MODULES } from "@/config/modules";
import { useChatbot } from "@/context/ChatbotContext";

interface ModuleContent {
  metric: string;
  whatItDoes: string;
  howItDoes: string;
  actions: string[];
}

const MODULE_CONTENT: Record<string, ModuleContent> = {
  Sentinel: {
    metric: "Weaponization Index 2.4x · UHC",
    whatItDoes:
      "Sentinel detects when payers silently change their denial strategies — often weeks before your team sees the resulting spike in denials.",
    howItDoes:
      "It continuously monitors 9 behavioral signals across your entire 835 remittance stream and scores each payer with a normalized Weaponization Index. When the index crosses 2.0x or spikes sharply, it fires an alert.",
    actions: [
      "Immediately filter your Triage queue to the aggressive payer",
      "Update Shield rules before the next claim batch",
      "Prepare clinical teams with exact documentation changes",
      "Feed Forecast with the earliest possible downside risk signal",
    ],
  },
  ContractIntel: {
    metric: "73rd percentile → $2.8M annual gap to 85th",
    whatItDoes:
      "It shows you exactly what the same payer is paying comparable providers for the same CPT codes — giving you data-backed leverage in every contract negotiation.",
    howItDoes:
      "Pulls from Transparency in Coverage MRFs and benchmarks your contracted rates against the true market 75th and 85th percentiles, then surfaces upcoming renewals with quantified opportunity.",
    actions: [
      "Walk into renewal meetings with hard evidence instead of guesses",
      "Prioritize which contracts to renegotiate first",
      "Run what-if scenarios to see the exact revenue impact of a 5% rate increase",
      "Protect strong rates you already have above market",
    ],
  },
  Forecast: {
    metric: "$12.6M projected 90-day revenue · 84% confidence",
    whatItDoes:
      "It synthesizes signals from all 8 other modules into a single, continuously updated 90-day revenue projection.",
    howItDoes:
      "Combines Sentinel's Weaponization Index, Shield's clean claim rate, Prevent's auth exposure, Ledger's under/overpayments, Resolve's appeal pipeline, and ContractIntel's renewal risk into one forward-looking model with what-if sliders.",
    actions: [
      "See the real financial impact of payer aggression before it hits cash flow",
      "Make data-driven decisions on staffing, contract priorities, and resource allocation",
      "Give the CFO a single number they can trust instead of multiple conflicting reports",
      "Run scenarios to quantify the ROI of investing more in prevention",
    ],
  },
  Shield: {
    metric: "89.4% clean claim rate · up from 76.1%",
    whatItDoes:
      "It scans every outbound claim against live payer behavior — not just published rules — and flags or fixes problems before submission.",
    howItDoes:
      "Combines real-time CARC prediction from Sentinel with NCCI edits, CMS fee schedule rules, and your own historical denial patterns to assign a deny risk score and specific fix guidance.",
    actions: [
      "Auto-release clean claims with zero delay",
      "Apply precise documentation or modifier fixes on flagged claims",
      "Stop 1 in 4 denials before they ever reach the payer",
      "Dramatically reduce rework and accelerate cash flow",
    ],
  },
  Prevent: {
    metric: "3 new auth requirements detected · 11 days early",
    whatItDoes:
      "It detects new or changed prior authorization requirements — often days or weeks before the payer publishes formal notice.",
    howItDoes:
      "Monitors CO-15 denial patterns across the entire ZDefense client portfolio and cross-references them with public payer policy pages to catch silent policy changes.",
    actions: [
      "Submit prior auths proactively instead of reacting to denials",
      "Avoid entire batches of CO-15 denials",
      "Update clinical and billing workflows before the requirement hits volume",
      "Protect $284K+ in quarterly revenue that would otherwise be lost",
    ],
  },
  Ledger: {
    metric: "$295 underpayment identified · $8,317 overpayment compliance exposure",
    whatItDoes:
      "It finds money payers have already technically paid you but at less than the contracted rate — and simultaneously protects you from costly overpayment repayment violations.",
    howItDoes:
      "Compares every 835 remittance line against your contracted rates in real time, surfaces systematic underpayments, and maintains a full audit-ready 7-stage overpayment compliance workflow including the 2025 CMS 60-day rule.",
    actions: [
      "Recover invisible underpayments that most systems miss",
      "Stay compliant with mandatory federal repayment deadlines",
      "Avoid False Claims Act exposure",
      "Turn Ledger into the default financial performance dashboard",
    ],
  },
  Triage: {
    metric: "71 claims · Sorted by Expected Recovery Value",
    whatItDoes:
      "It automatically prioritizes every denial by Expected Recovery Value — dollar amount times probability — so your team works the highest-value claims first.",
    howItDoes:
      "Uses a 50-rule CARC/RARC intelligence model plus payer-specific historical outcomes, then applies natural language smart search and recovery threshold filtering.",
    actions: [
      "Stop working denials in arrival order",
      "Focus effort where it produces the most revenue per hour",
      "Route claims intelligently to Evidence or Resolve with one click",
      "Give your billing team a prioritized daily worklist instead of chaos",
    ],
  },
  Evidence: {
    metric: "136 of 168 documents auto-retrieved · 81% complete",
    whatItDoes:
      "It assembles the exact documentation package needed for every appeal so your team reviews instead of hunts.",
    howItDoes:
      "Links directly to claims in Triage, categorizes required documents, and uses auto-collect from the Xtract archive.",
    actions: [
      "Eliminate hours of manual document gathering",
      "Route complete packages straight to Resolve",
      "Handle partial denials with per-line checklists",
      "Dramatically increase appeal success rates by submitting stronger packages",
    ],
  },
  Resolve: {
    metric: "$1,146K in active appeals · 37 in progress",
    whatItDoes:
      "It generates payer-specific, CARC-accurate appeal letters at scale and tracks every outcome.",
    howItDoes:
      "Uses template-based generation from the 50-rule intelligence model, supports 6 automated lanes, and records outcomes that continuously improve the entire platform.",
    actions: [
      "Generate 10+ perfect appeal letters in seconds instead of hours",
      "Submit stronger, more consistent appeals",
      "Track appeal velocity and payer performance",
      "Feed real outcome data back into Sentinel, Shield, and Triage for continuous improvement",
    ],
  },
};

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
  /** Module names (matching MODULES catalog) the role touches most. */
  relatedModules: string[];
}

const roles: RoleContent[] = [
  { key: "cfo", tab: "CFO / Executive", headline: "Stop Forecasting from Spreadsheets.", body: "One 90-day revenue projection that pulls in denial trends, payer behavior, underpayment recovery, and contract risk — so you can model contract decisions before you negotiate them.", supporting: "Also recommended: Sentinel · ContractIntel", ctaText: "Book a CFO-Focused Demo", ctaHref: "/contact?role=cfo", moduleName: "Forecast", stats: ["$12.6M 90-day projection", "84% confidence score", "What-if contract modeler", "Six driver cards"], relatedModules: ["Forecast", "Sentinel", "ContractIntel"] },
  { key: "director", tab: "Rev Cycle Director", headline: "See Underpayments, Overpayments, and Compliance in One View.", body: "Ledger gives you claim-level financial oversight — underpayment detection, Medicare 60-day repayment compliance, and an immutable audit trail. Pair with Forecast for the full picture from claim to projection.", supporting: "Also recommended: Forecast · Sentinel", ctaText: "Book a Director-Focused Demo", ctaHref: "/contact?role=director", moduleName: "Ledger", stats: ["Contract variance tracked per claim", "Six-stage compliance workflow", "Immutable audit log", "Dual-approver write-offs"], relatedModules: ["Ledger", "Prevent", "Forecast"] },
  { key: "manager", tab: "Rev Cycle Manager", headline: "Stop Denials Before They Leave Your System.", body: "Shield scans every outbound claim batch against live payer rules pre-submission — no BAA required. The Regulatory Intelligence Feed flags CMS and payer policy shifts 45 days ahead. Activate today with live data.", supporting: "Also recommended: Prevent · Triage", ctaText: "Start Your 30-Day Evaluation — No BAA Required", ctaHref: "/contact?offer=trial", ctaEmerald: true, ctaNote: "Shield and Prevent included. Live data. Activates immediately.", moduleName: "Shield", stats: ["89.4% clean claim rate", "45-day regulatory advance feed", "No BAA Required", "Activates in 30 minutes"], relatedModules: ["Shield", "Prevent", "Triage"] },
  { key: "specialist", tab: "Billing Specialist", headline: "Work the Claims Most Likely to Pay. In That Order.", body: "Triage ranks your denial queue by recovery probability so you start with the cash that's actually recoverable. Every claim shows its score, rule driver, and AI insight — with one-click evidence assembly behind it.", supporting: "Also recommended: Evidence · Resolve", ctaText: "Book a Specialist-Focused Demo", ctaHref: "/contact?role=specialist", moduleName: "Triage", stats: ["$1.146M active recovery pipeline", "Recovery probability per claim", "Natural language search", "One-click evidence assembly"], relatedModules: ["Triage", "Evidence", "Resolve"] },
  { key: "compliance", tab: "Auditor/Compliance Officer", headline: "The Medicare 60-Day Rule Has No Margin for Error.", body: "Ledger enforces the 60-day voluntary repayment rule automatically — immutable audit log, dual-approver authorization on every write-off, six-stage workflow. If regulators knock, your documentation is already time-stamped.", supporting: "Also recommended: Shield", ctaText: "Book a Compliance-Focused Demo", ctaHref: "/contact?role=compliance", moduleName: "Ledger", stats: ["Medicare 60-day enforcement", "Dual-approver write-offs", "Immutable audit log", "Six-stage overpayment workflow"], relatedModules: ["Ledger", "Shield", "ContractIntel"] },
];

const slugify = (n: string) => n.toLowerCase();

/** Header (64px) + sticky tab bar (~64px) + breathing room. */
const SCROLL_OFFSET_PX = 160;

const LAYER_LABEL: Record<string, string> = {
  predict: "PREDICT",
  protect: "PROTECT",
  recover: "RECOVER",
};

const LAYER_DESCRIPTION: Record<string, string> = {
  predict: "See risk before it becomes a denial.",
  protect: "Stop problems before payers or regulators find them.",
  recover: "Turn denied claims into recovered cash.",
};

/** Short abbreviations for role tabs, used in compact badges. */
const ROLE_ABBREV: Record<string, string> = {
  "CFO / Executive": "CFO",
  "Rev Cycle Director": "RC Director",
  "Rev Cycle Manager": "RC Manager",
  "Billing Specialist": "Billing Specialist",
  "Auditor/Compliance Officer": "Compliance",
};

/** Role membership per module — drives the rollup mapping table. */
const moduleRoleMap: Record<string, string[]> = MODULES.reduce(
  (acc, m) => {
    acc[m.name] = roles
      .filter((r) => r.relatedModules.includes(m.name))
      .map((r) => r.tab);
    return acc;
  },
  {} as Record<string, string[]>,
);

const SolutionsPage = () => {
  const [activeRole, setActiveRole] = useState("cfo");
  const role = roles.find((r) => r.key === activeRole)!;
  const { hash, pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [activeModule, setActiveModule] = useState<string>(slugify(MODULES[0].name));
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [roleHintVisible, setRoleHintVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("roleHintDismissed") !== "true";
  });
  const { open: openChatbot } = useChatbot();

  const dismissRoleHint = () => {
    setRoleHintVisible(false);
    try {
      sessionStorage.setItem("roleHintDismissed", "true");
    } catch {
      /* ignore */
    }
  };

  /** Smooth-scroll to the hash with header offset, on mount + hash changes. */
  const scrollToHash = useCallback((rawHash: string) => {
    const id = rawHash.replace(/^#/, "");
    if (!id) return;
    // Defer until layout settles
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (hash) {
      scrollToHash(hash);
    }
  }, [hash, pathname, scrollToHash]);

  /** Pick up ?role= query so deep links from the home page land on the right tab. */
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && roles.some((r) => r.key === roleParam)) {
      setActiveRole(roleParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Scroll-spy: highlight the module section currently in view. */
  useEffect(() => {
    const sections = MODULES.map((m) =>
      document.getElementById(slugify(m.name)),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveModule(visible[0].target.id);
        }
      },
      {
        // Account for sticky header so the "active" item matches what the user sees.
        rootMargin: `-${SCROLL_OFFSET_PX + 20}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleSidebarClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    e.preventDefault();
    window.history.replaceState(null, "", `#${slug}`);
    scrollToHash(slug);
  };

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
        <SolutionFlowStream />
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
            {roleHintVisible && (
              <div className="mb-3 flex items-center gap-2 text-[var(--emerald)] text-xs font-bold uppercase tracking-widest animate-fade-in">
                <span>Select your role</span>
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {roles.map((r) => {
                const active = r.key === activeRole;
                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      setActiveRole(r.key);
                      if (roleHintVisible) dismissRoleHint();
                    }}
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

      {/* SECTION 3: ALL 9 MODULES — three layer-grouped dark sections */}
      {(["predict", "protect", "recover"] as const).map((layer, idx) => {
        const layerModules = MODULES.filter((m) => m.layer === layer);
        const bg = idx % 2 === 0 ? "bg-[var(--navy-dk)]" : "bg-[var(--navy)]";
        const headlines: Record<string, { h: string; d: string }> = {
          predict: {
            h: "See What's Coming Before It Costs You",
            d: "Intelligence that detects payer behavioral shifts, benchmarks your rates, and projects revenue — before the damage reaches your claims.",
          },
          protect: {
            h: "Stop Problems Before They Leave Your System",
            d: "Pre-submission interception, prior authorization detection, and financial oversight that catches issues before payers do.",
          },
          recover: {
            h: "Turn Denied Claims Into Recovered Revenue",
            d: "AI-ranked denial queues, automated evidence assembly, and bulk appeal generation that works the right claims first.",
          },
        };
        return (
          <section
            key={layer}
            className={`${bg} py-20 px-6 md:px-12 lg:px-16`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <p className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
                  {LAYER_LABEL[layer]}
                </p>
                <h2 className="text-white font-bold text-2xl md:text-3xl mt-2">
                  {headlines[layer].h}
                </h2>
                <p className="text-slate-400 mt-3">{headlines[layer].d}</p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6">
                {layerModules.map((m) => {
                  const slug = slugify(m.name);
                  const content = MODULE_CONTENT[m.name];
                  const isExpanded = expandedModule === slug;
                  return (
                    <article
                      key={m.name}
                      id={slug}
                      style={{ scrollMarginTop: `${SCROLL_OFFSET_PX}px` }}
                      className="bg-white/5 border border-slate-700 rounded-xl p-6 md:p-8 hover:border-[var(--emerald)]/40 transition-colors"
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-[var(--emerald)] text-[10px] font-bold uppercase tracking-widest">
                            {LAYER_LABEL[m.layer]}
                          </p>
                          <h3 className="text-white font-bold text-2xl mt-1">
                            {m.name}
                          </h3>
                          <p className="text-[var(--emerald)] text-sm mt-1">
                            {m.tagline}
                          </p>
                          {content?.metric && (
                            <p className="text-slate-400 text-xs font-mono mt-1">
                              {content.metric}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = isExpanded ? null : slug;
                            setExpandedModule(next);
                            if (next) {
                              window.setTimeout(() => {
                                const el = document.getElementById(slug);
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                              }, 320);
                            }
                          }}
                          aria-expanded={isExpanded}
                          aria-controls={`${slug}-details`}
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${m.name} details`}
                          className="text-[var(--emerald)] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                        >
                          <span aria-hidden="true">
                            {isExpanded ? "Collapse" : "Explore in Depth"}
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expanded details */}
                      <div
                        id={`${slug}-details`}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-6 border-t border-slate-700/60 pt-6">
                            {/* Part 1 — What it does */}
                            <div>
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                What it does
                              </p>
                              <p className="text-slate-300 text-sm leading-relaxed mt-1">
                                {content?.whatItDoes}
                              </p>
                            </div>

                            {/* Part 2 — How it does it */}
                            <div className="mt-5">
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                How it does it
                              </p>
                              <p className="text-slate-300 text-sm leading-relaxed mt-1">
                                {content?.howItDoes}
                              </p>
                            </div>

                            {/* Part 3 — What you can do with it */}
                            <div className="mt-5">
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                What you can do with it
                              </p>
                              <ul className="mt-2 space-y-2">
                                {content?.actions.map((a) => (
                                  <li
                                    key={a}
                                    className="flex items-start gap-2 text-slate-300 text-sm"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                                    <span>{a}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Requirements */}
                            <div className="border-t border-slate-700 pt-4 mt-5">
                              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">
                                Requirements
                              </p>
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-slate-500 text-[11px]">Data sharing</p>
                                  <p className="text-slate-300 text-sm">
                                    {m.required ? "BAA required" : "No BAA required"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-[11px]">Built for</p>
                                  <p className="text-slate-300 text-sm">{m.audience}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => openChatbot(m.name)}
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--emerald)] border border-[var(--emerald)]/30 rounded-lg px-3 py-1.5 hover:bg-[var(--emerald)]/5 transition-colors"
                              >
                                <span className="bg-[var(--emerald)] text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold">
                                  Z
                                </span>
                                Ask Z
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <RoleRoutingDiagram />

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

