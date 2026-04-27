import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import Layout from "@/components/Layout";
import CTABand from "@/components/CTABand";
import HeroAccent from "@/components/HeroAccent";
import RoleRoutingDiagram from "@/components/RoleRoutingDiagram";
import SeoHead from "@/components/SeoHead";
import SolutionFlowStream from "@/components/SolutionFlowStream";
import { MODULES } from "@/config/modules";
import { useChatbot } from "@/context/ChatbotContext";

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

      {/* SECTION 3: 9 → 5 ROLLUP MAPPING */}
      <section className="bg-[var(--navy)] py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
            How the Pieces Fit
          </p>
          <h2 className="text-white font-bold text-2xl md:text-3xl mt-2">
            How the 9 Modules Roll Up Into the 5 Roles
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl">
            Every module reports up to one or more of the five roles it serves.
            Use this as the quick map between what each module does and who
            owns the outcome.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["predict", "protect", "recover"] as const).map((layer) => {
              const layerModules = MODULES.filter((m) => m.layer === layer);
              return (
                <div
                  key={layer}
                  className="bg-[var(--navy-dk)] border border-slate-700 rounded-xl p-6"
                >
                  <p className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
                    {LAYER_LABEL[layer]}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {LAYER_DESCRIPTION[layer]}
                  </p>
                  <ul className="mt-5 space-y-4">
                    {layerModules.map((m) => {
                      const primaryRole = (moduleRoleMap[m.name] ?? [])[0];
                      const abbrev = primaryRole ? ROLE_ABBREV[primaryRole] ?? primaryRole : null;
                      return (
                        <li key={m.name} className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <a
                              href={`#${slugify(m.name)}`}
                              onClick={(e) => handleSidebarClick(e, slugify(m.name))}
                              className="text-white font-semibold text-sm hover:text-[var(--emerald)] transition-colors"
                            >
                              {m.name}
                            </a>
                            <p className="text-slate-500 text-xs mt-0.5">{m.tagline}</p>
                          </div>
                          {abbrev && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                              {abbrev}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: ALL 9 MODULES — sidebar + section content */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
            The Full Catalog
          </p>
          <h2 className="text-[var(--navy)] font-bold text-2xl md:text-3xl mt-2">
            All Nine Modules
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl">
            Every module in the ZDefense platform — across Predict, Protect, and
            Recover. Use the sidebar to jump to any module.
          </p>

          <div className="mt-8 flex gap-8 items-start">
            {/* Sticky sidebar */}
            <aside
              className={`hidden lg:block sticky transition-all duration-200 ${
                sidebarOpen ? "w-64" : "w-12"
              }`}
              style={{ top: `${SCROLL_OFFSET_PX + 8}px` }}
              aria-label="Module navigation"
            >
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  {sidebarOpen && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Modules
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((s) => !s)}
                    className="ml-auto p-1 rounded hover:bg-slate-100 text-slate-500"
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <nav>
                  <ul className="space-y-1">
                    {MODULES.map((m) => {
                      const slug = slugify(m.name);
                      const active = activeModule === slug;
                      return (
                        <li key={m.name}>
                          <a
                            href={`#${slug}`}
                            onClick={(e) => handleSidebarClick(e, slug)}
                            aria-current={active ? "true" : undefined}
                            className={
                              active
                                ? "flex items-center gap-2 rounded-md bg-[var(--emerald)]/10 border-l-2 border-[var(--emerald)] px-2 py-1.5 text-sm font-semibold text-[var(--navy)]"
                                : "flex items-center gap-2 rounded-md border-l-2 border-transparent px-2 py-1.5 text-sm text-slate-600 hover:text-[var(--navy)] hover:bg-slate-50"
                            }
                            title={!sidebarOpen ? m.name : undefined}
                          >
                            <span
                              className={
                                active
                                  ? "h-2 w-2 rounded-full bg-[var(--emerald)] shrink-0"
                                  : "h-2 w-2 rounded-full bg-slate-300 shrink-0"
                              }
                            />
                            {sidebarOpen && (
                              <>
                                <span className="truncate">{m.name}</span>
                                {active && (
                                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--emerald)]" />
                                )}
                              </>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Module sections */}
            <div className="flex-1 min-w-0 space-y-6">
              {MODULES.map((m) => {
                const slug = slugify(m.name);
                const isExpanded = expandedModule === slug;
                const teaser = m.detail.split(".")[0] + ".";
                return (
                  <section
                    key={m.name}
                    id={slug}
                    style={{ scrollMarginTop: `${SCROLL_OFFSET_PX}px` }}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-[var(--emerald)] transition-colors duration-200"
                  >
                    {/* Collapsed header — always visible, clickable */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedModule((prev) => (prev === slug ? null : slug))
                      }
                      aria-expanded={isExpanded}
                      className="w-full text-left cursor-pointer py-4 px-6 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
                            {LAYER_LABEL[m.layer]}
                          </span>
                          <BADBadge required={m.required} />
                        </div>
                        <h3 className="text-[var(--navy)] font-bold text-2xl mt-2">
                          {m.name}
                        </h3>
                        <p className="text-[var(--emerald)] font-medium text-sm mt-1">
                          {m.tagline}
                        </p>
                        {!isExpanded && (
                          <p className="text-slate-600 text-sm mt-2 line-clamp-1">
                            {teaser}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expanded content — animated max-height */}
                    <div
                      className="overflow-hidden transition-[max-height] duration-300 ease-out"
                      style={{ maxHeight: isExpanded ? "2000px" : "0px" }}
                      aria-hidden={!isExpanded}
                    >
                      <div className="px-6 md:px-8 pb-8">
                        <p className="text-slate-700 text-sm leading-relaxed mt-2">
                          {m.detail}
                        </p>

                        {(() => {
                          const tabs: { key: string; label: string }[] = [
                            { key: "capabilities", label: "Capabilities" },
                            { key: "howItWorks", label: "How It Works" },
                            { key: "outcomes", label: "Outcomes" },
                            { key: "dataInputs", label: "Data Inputs" },
                          ];
                          const activeTab = activeModuleTab[slug] ?? "capabilities";
                          return (
                            <>
                              <div className="flex gap-2 mt-6 flex-wrap">
                                {tabs.map((t) => {
                                  const isActive = t.key === activeTab;
                                  return (
                                    <button
                                      key={t.key}
                                      type="button"
                                      onClick={() =>
                                        setActiveModuleTab((prev) => ({
                                          ...prev,
                                          [slug]: t.key,
                                        }))
                                      }
                                      className={
                                        isActive
                                          ? "bg-[var(--navy)] text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                                          : "bg-[var(--lgray)] text-slate-600 px-4 py-1.5 rounded-full text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                                      }
                                    >
                                      {t.label}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="mt-6">
                                {activeTab === "capabilities" && (
                                  <ul className="space-y-2">
                                    {m.capabilities.map((c) => (
                                      <li
                                        key={c}
                                        className="flex items-start gap-2 text-sm text-slate-600"
                                      >
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                                        <span>{c}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {activeTab === "howItWorks" && (
                                  <ol className="space-y-2">
                                    {m.howItWorks.map((step, i) => (
                                      <li
                                        key={step}
                                        className="flex items-start gap-3 text-sm text-slate-600"
                                      >
                                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[var(--emerald)]/10 text-[var(--emerald)] text-[11px] font-bold flex items-center justify-center shrink-0">
                                          {i + 1}
                                        </span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                )}

                                {activeTab === "outcomes" && (
                                  <ul className="space-y-2">
                                    {m.outcomes.map((o) => (
                                      <li
                                        key={o}
                                        className="flex items-start gap-2 text-sm text-slate-600"
                                      >
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                                        <span>{o}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {activeTab === "dataInputs" && (
                                  <>
                                    <ul className="space-y-2">
                                      {m.dataInputs.map((d) => (
                                        <li
                                          key={d}
                                          className="flex items-start gap-2 text-sm text-slate-600"
                                        >
                                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                                          <span>{d}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="mt-6 rounded-md bg-slate-50 border border-[var(--lgray)] p-3">
                                      <p className="text-slate-400 text-xs uppercase tracking-widest">
                                        Integration & deployment
                                      </p>
                                      <p className="text-slate-700 text-sm mt-1">{m.integration}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          );
                        })()}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-slate-400 text-[11px] uppercase tracking-widest">
                              Built for
                            </p>
                            <p className="text-slate-700 text-sm">{m.audience}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              to="/contact"
                              className="text-[var(--emerald)] font-semibold text-sm hover:underline"
                            >
                              Talk to us about {m.name} →
                            </Link>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                          <div />
                          <button
                            type="button"
                            onClick={() => openChatbot(m.name)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--emerald)] border border-[var(--emerald)]/30 rounded-lg px-3 py-1.5 hover:bg-[var(--emerald)]/5 transition-colors"
                          >
                            <span className="bg-[var(--emerald)] text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold mr-1">Z</span>
                            Ask Z about this
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

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
