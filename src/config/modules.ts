/**
 * Shared module catalog used by /platform's pipeline + module detail modal.
 * Single source of truth so the pipeline pills and the detail panel stay
 * in sync.
 */

export type ModuleLayer = "predict" | "protect" | "recover";

export interface ModuleDefinition {
  name: string;
  layer: ModuleLayer;
  tagline: string;
  body: string;
  audience: string;
  required: boolean;
  /** Extra detail revealed in the expanded view. */
  detail: string;
  /** 3–4 short capability bullets. */
  capabilities: string[];
  /** Step-by-step explanation of how the module operates. */
  howItWorks: string[];
  /** Concrete outcomes / KPIs the module delivers. */
  outcomes: string[];
  /** Data sources or inputs the module relies on. */
  dataInputs: string[];
  /** Integration / deployment notes (BAA posture, systems touched, etc.). */
  integration: string;
  /** Where the "Learn more" action routes to. */
  learnMoreHref: string;
}

export const MODULES: ModuleDefinition[] = [
  // PREDICT
  {
    name: "Sentinel",
    layer: "predict",
    tagline: "Payer Weaponization Index",
    body: "See payer behavioral shifts 7–14 days before formal policy notice — so leadership can react before revenue is at risk.",
    audience: "Rev Cycle Director",
    required: true,
    detail:
      "Sentinel monitors commercial and Medicare payer behavior continuously, detecting systematic denial-strategy shifts before they show up in your billing volume. Leadership gets a forward-looking risk signal — not a lagging report.",
    capabilities: [
      "Tracks 5 major commercial payers + Medicare contractors",
      "Behavioral baseline alerts 7–14 days ahead of formal notice",
      "Routes signals into the Forecast 90-day projection",
    ],
    howItWorks: [
      "Continuously ingests payer remits, denial codes, and policy bulletins from commercial and Medicare sources",
      "Builds a rolling behavioral baseline per payer and detects statistically significant shifts in denial mix, downcoding, and timely-filing posture",
      "Scores each shift for revenue impact and routes a forward-looking alert into the executive dashboard and Forecast model",
    ],
    outcomes: [
      "7–14 day early warning before a payer's behavior shows up in your AR aging",
      "Quantified revenue-at-risk per payer trend, not just denial counts",
      "Documented payer behavior history for contract renegotiation leverage",
    ],
    dataInputs: [
      "835/837 transaction patterns (de-identified at the aggregate level)",
      "Public payer policy bulletins, MAC LCDs, and coverage updates",
      "Historical denial CARC/RARC distributions",
    ],
    integration:
      "No BAA required for the public-signal layer. Optional remit feed deepens accuracy and runs under standard BAA.",
    learnMoreHref: "/solutions#sentinel",
  },
  {
    name: "ContractIntel",
    layer: "predict",
    tagline: "Rate Benchmarking & Contract Intelligence",
    body: "Benchmark contracted rates against public Transparency in Coverage data. $2.8M annual contract gap surfaced in demo. Public data only.",
    audience: "CFO · Rev Cycle Director",
    required: false,
    detail:
      "ContractIntel benchmarks your negotiated rates against TiC and HPT data from 5,400+ hospitals and 7 major payers. Surfaces underpayment gaps and flags contract renewal windows before negotiations open.",
    capabilities: [
      "Procedure-level benchmark vs. market and Medicare baseline",
      "Contract renewal radar with countdown timers",
      "No PHI required — runs on public data only",
    ],
    howItWorks: [
      "Pulls public Transparency in Coverage (TiC) machine-readable files and Hospital Price Transparency (HPT) data nightly",
      "Normalizes rates by CPT/HCPCS, place of service, and payer plan to build a market benchmark",
      "Compares your contracted rates line by line and surfaces underpayment patterns plus renewal-window timing",
    ],
    outcomes: [
      "$2.8M annual contract gap surfaced in demo benchmark",
      "Procedure-level evidence packets ready for the negotiation table",
      "Renewal countdown alerts so finance is never caught flat-footed",
    ],
    dataInputs: [
      "TiC Machine-Readable Files (MRFs) from 7 major commercial payers",
      "HPT files from 5,400+ hospitals for peer comparison",
      "Your contracted fee schedules (uploaded — no PHI required)",
    ],
    integration:
      "Authoritative regulatory data — no BAA, no PHI. Stands up in days, not quarters.",
    learnMoreHref: "/solutions#contractintel",
  },
  {
    name: "Forecast",
    layer: "predict",
    tagline: "90-Day Revenue Projection",
    body: "One unified 90-day revenue projection driven by every other module. $12.6M projected at 84% confidence in demo.",
    audience: "CFO · Executive",
    required: true,
    detail:
      "Forecast synthesizes every other module into a single 90-day revenue projection with confidence scoring. CFOs get one number — and the trail of evidence behind it — instead of stitching reports together manually.",
    capabilities: [
      "Confidence-scored 90-day revenue projection",
      "Drill-down from headline to module-level signals",
      "Updated continuously as new payer signals arrive",
    ],
    howItWorks: [
      "Aggregates signals from every active module — Sentinel risk, Shield interception rate, Triage recovery probability, Ledger underpayments",
      "Runs a rolling Monte Carlo projection with confidence bands across the next 90 days",
      "Lets executives drill from the headline number down to the originating module signal in two clicks",
    ],
    outcomes: [
      "$12.6M projected at 84% confidence in demo environment",
      "One executive number replaces a stack of weekly RC reports",
      "Variance alerts when actuals diverge from forecast by configurable thresholds",
    ],
    dataInputs: [
      "Live signal stream from every active ZDefense module",
      "Historical AR, charge, and payment trends",
      "Seasonal and case-mix adjustments",
    ],
    integration:
      "Auto-activates as soon as two or more modules are live. Exports cleanly to Excel, Power BI, and Tableau.",
    learnMoreHref: "/solutions#forecast",
  },

  // PROTECT
  {
    name: "Shield",
    layer: "protect",
    tagline: "Pre-Submission Claim Interception",
    body: "89.4% clean claim rate in demo. Surfaces CMS, MAC, and commercial payer rule changes 45 days before they affect claims. Public data only.",
    audience: "Rev Cycle Manager · Billing Specialist",
    required: false,
    detail:
      "Shield scans every outbound claim against live payer rules, NCCI edits, and coverage policies before submission — catching the issues that drive the bulk of preventable denials. Includes a 45-day Regulatory Intelligence Feed.",
    capabilities: [
      "Pre-submission edit engine (NCCI, NCD/LCD, MAC bulletins)",
      "Regulatory Intelligence Feed fires 45 days before impact",
      "No BAA required — runs on public payer data",
    ],
    howItWorks: [
      "Intercepts every outbound 837 in-flight and runs it against live NCCI, NCD/LCD, and MAC bulletin rules",
      "Applies a 45-day Regulatory Intelligence Feed so claims account for rule changes before they take effect",
      "Returns pass/edit/hold decisions with specific remediation guidance back to the biller in seconds",
    ],
    outcomes: [
      "89.4% clean claim rate in demo benchmark",
      "Catches the preventable denials that drive the bulk of write-offs",
      "Reduces rework cycles per claim from 2.3 to 1.1 on average",
    ],
    dataInputs: [
      "Outbound 837 stream (or pre-bill scrub feed)",
      "Live CMS, NCCI, NCD/LCD, and MAC bulletin database",
      "Public commercial payer policy updates",
    ],
    integration:
      "Public-rule engine runs without a BAA. Drop-in pre-bill API for Epic, Cerner, athenaIDX, and most clearinghouses.",
    learnMoreHref: "/solutions#shield",
  },
  {
    name: "Prevent",
    layer: "protect",
    tagline: "Prior Authorization Defense",
    body: "Detects new prior authorization requirements 11 days in advance on average. $284K protected in demo. No patient data required.",
    audience: "Rev Cycle Manager · Rev Cycle Director",
    required: false,
    detail:
      "Prevent watches commercial and Medicare PA policy feeds and surfaces newly required authorizations an average of 11 days before formal notice — closing the window where revenue typically leaks.",
    capabilities: [
      "Daily monitoring of UHC, Aetna, Cigna, Anthem, Humana",
      "11-day average lead time vs. formal payer notice",
      "Routed to PA queue with required-action prompts",
    ],
    howItWorks: [
      "Monitors UHC, Aetna, Cigna, Anthem, and Humana PA policy feeds plus Medicare PA expansions every day",
      "Diff's policy changes against your active service-line mix to flag newly-required authorizations",
      "Routes the alert into the PA queue with the required CPT codes, documentation list, and submission window",
    ],
    outcomes: [
      "11-day average lead time vs. formal payer notice",
      "$284K in revenue protected in demo over a single quarter",
      "Eliminates the surprise-PA denial category from your A/R",
    ],
    dataInputs: [
      "Public commercial and Medicare PA policy bulletins",
      "Your active CPT/HCPCS service-line mix (codes only — no PHI)",
      "Historical PA approval/denial outcomes for tuning",
    ],
    integration:
      "Runs on public policy data — no BAA, no PHI. Outputs into your existing PA worklist or queue.",
    learnMoreHref: "/solutions#prevent",
  },
  {
    name: "Ledger",
    layer: "protect",
    tagline: "Underpayment Detection & Compliance Tracking",
    body: "Underpayment detection plus a Medicare 60-day compliance audit trail with dual-approver authorization on every write-off.",
    audience: "Rev Cycle Director · Auditor/Compliance Officer",
    required: true,
    detail:
      "Ledger detects underpayments at the line-item level, surfaces overpayments with a Medicare 60-day countdown, and produces an immutable audit trail with configurable dual-approver authorization on every write-off.",
    capabilities: [
      "Line-item underpayment + overpayment detection",
      "Medicare 60-day enforcement countdown tracker",
      "Immutable, dual-approver write-off audit trail",
    ],
    howItWorks: [
      "Reconciles every 835 line item against the contracted rate and flags underpayments and overpayments",
      "Starts a Medicare 60-day countdown timer the moment an overpayment is detected and tracks every status change",
      "Requires dual-approver authorization on every write-off and writes an immutable, timestamped audit record",
    ],
    outcomes: [
      "Catches systemic underpayments that escape line-by-line manual review",
      "Documented Medicare 60-day compliance posture, ready for auditors",
      "Eliminates single-approver write-off risk and the OIG exposure that comes with it",
    ],
    dataInputs: [
      "835 remits and contracted fee schedules",
      "Medicare overpayment rule definitions",
      "Your write-off authorization matrix and approver hierarchy",
    ],
    integration:
      "Runs under standard BAA. Audit trail is exportable for OIG, MAC, and internal compliance review.",
    learnMoreHref: "/solutions#ledger",
  },

  // RECOVER
  {
    name: "Triage",
    layer: "recover",
    tagline: "AI-Powered Denial Queue",
    body: "Denial queue auto-classified and ranked by recovery probability. $1.146M active recovery pipeline in current live build.",
    audience: "Billing Specialist · Rev Cycle Manager",
    required: true,
    detail:
      "Triage classifies every denial against the CARC/RARC taxonomy and ranks the queue by recovery probability — so specialists work the highest-yield denials first instead of working chronologically.",
    capabilities: [
      "CARC/RARC auto-classification on every denial",
      "Recovery Probability Score per claim",
      "Queue routing by specialist skill and payer",
    ],
    howItWorks: [
      "Auto-classifies every inbound denial against the full CARC/RARC taxonomy",
      "Scores each denial with a Recovery Probability Score using historical payer behavior and claim attributes",
      "Routes the queue to the right specialist by payer expertise, denial type, and dollar value",
    ],
    outcomes: [
      "$1.146M active recovery pipeline in the current live build",
      "Specialists work highest-yield denials first instead of chronologically",
      "Cuts time-to-touch on high-value denials from days to hours",
    ],
    dataInputs: [
      "835 denial transactions and CARC/RARC codes",
      "Historical appeal outcomes per payer / denial type",
      "Specialist skill matrix for routing",
    ],
    integration:
      "Runs under standard BAA. Plugs into existing denial worklists in Epic, Cerner, and most billing platforms.",
    learnMoreHref: "/solutions#triage",
  },
  {
    name: "Evidence",
    layer: "recover",
    tagline: "Automated Evidence Assembly",
    body: "Assembles the full appeal documentation package — clinical notes, modifiers, authorizations, coverage rules — before a specialist opens the file.",
    audience: "Billing Specialist",
    required: true,
    detail:
      "Evidence builds the complete appeal documentation package automatically — pulling clinical notes, modifiers, authorizations, and the relevant coverage rules — so the specialist starts from a finished file, not a blank one.",
    capabilities: [
      "Auto-assembled clinical + administrative evidence",
      "Coverage rule citations attached to every appeal",
      "Hands off cleanly into Resolve",
    ],
    howItWorks: [
      "On denial, automatically pulls the relevant clinical notes, op reports, modifiers, and authorization records",
      "Cross-references the payer's own coverage policy and cites the controlling rule directly in the appeal packet",
      "Hands the finished evidence file off to Resolve so the specialist starts from a complete package",
    ],
    outcomes: [
      "Specialists open a finished file, not a blank one",
      "Cuts evidence-assembly time from ~25 minutes to under 2 minutes per appeal",
      "Improves first-pass appeal win rate by 18% in benchmark testing",
    ],
    dataInputs: [
      "EHR clinical documentation (notes, op reports, imaging reads)",
      "Charge master, modifier history, and authorization records",
      "Payer coverage policy library",
    ],
    integration:
      "Runs under standard BAA. Reads from EHR via FHIR or HL7 — no rip-and-replace required.",
    learnMoreHref: "/solutions#evidence",
  },
  {
    name: "Resolve",
    layer: "recover",
    tagline: "Bulk Appeal Generation",
    body: "Payer-specific appeal letters at bulk scale. Outcome tracking feeds back into the recovery model — accuracy improves with every appeal.",
    audience: "Billing Specialist · Rev Cycle Director",
    required: true,
    detail:
      "Resolve generates payer-specific appeal letters in bulk — 10 letters in 8 seconds in demo — and tracks outcomes back into the recovery model so accuracy compounds with every cycle.",
    capabilities: [
      "Payer-specific appeal templates at bulk scale",
      "10 letters in 8 seconds (demo benchmark)",
      "Outcome feedback loop improves the recovery model",
    ],
    howItWorks: [
      "Generates payer-specific appeal letters using the Evidence packet and the controlling coverage rule",
      "Submits in bulk through the appropriate payer channel and tracks status through final determination",
      "Feeds outcomes back into the recovery model so language, framing, and citations improve every cycle",
    ],
    outcomes: [
      "10 appeal letters generated in 8 seconds (demo benchmark)",
      "Compounding accuracy — recovery model improves with every appeal cycle",
      "Specialists scale 5–8x without adding headcount",
    ],
    dataInputs: [
      "Evidence packets handed off from the Evidence module",
      "Payer-specific appeal templates and submission channels",
      "Historical appeal outcomes for model training",
    ],
    integration:
      "Runs under standard BAA. Submits via payer portals, fax, and direct API where available.",
    learnMoreHref: "/solutions#resolve",
  },
];

export const getModule = (name: string) =>
  MODULES.find((m) => m.name === name);

/**
 * Modules that can run with NO BAA (authoritative regulatory data only). Source of truth used
 * by the platform hero readouts, the BAA shield panel, and any other place
 * we need to differentiate regulatory-data vs. PHI-bearing modules.
 */
export const NO_BAA_MODULES: ReadonlyArray<string> = [
  "ContractIntel",
  "Shield",
  "Prevent",
];

export const isBaaRequired = (name: string) =>
  !NO_BAA_MODULES.includes(name);

/** URL-safe slug for anchor navigation (matches Solutions section IDs). */
export const moduleSlug = (name: string) => name.toLowerCase();
