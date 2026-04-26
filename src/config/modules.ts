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
    learnMoreHref: "/solutions#resolve",
  },
];

export const getModule = (name: string) =>
  MODULES.find((m) => m.name === name);
