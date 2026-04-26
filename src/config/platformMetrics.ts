/**
 * Canonical, single-source-of-truth platform metrics shown across the
 * /platform and /solutions surfaces. The Mission Control hero, the
 * Sentinel radar, the module copy, and the various stat callouts all
 * read from these constants so the numbers never drift out of sync.
 *
 * Values reflect the current live demo build referenced throughout the
 * marketing site (see modules.ts capabilities/outcomes for matching
 * copy).
 */

import type { ModuleLayer } from "./modules";

/** Shield — pre-submission claim interception. */
export const SHIELD_CLEAN_CLAIM_RATE = 89.4; // percent
/** Allowed jitter for the gauge animation around the canonical value. */
export const SHIELD_CLEAN_CLAIM_JITTER = 1.3;

/** Triage — recovery pipeline (live build). */
export const TRIAGE_RECOVERY_PIPELINE = 851_500; // USD center value
export const TRIAGE_RECOVERY_PIPELINE_JITTER = 39_500; // USD ± around center
export const TRIAGE_RECOVERY_PIPELINE_CEILING = 1_000_000; // for the bar

/** Resolve — appeal confidence band. */
export const RESOLVE_CONFIDENCE_CENTER = 78; // percent
export const RESOLVE_CONFIDENCE_JITTER = 5; // ± around center

/** Forecast — 90-day projection. */
export const FORECAST_PROJECTION_USD = 12_600_000;
export const FORECAST_CONFIDENCE_PCT = 84;

/** Sentinel — payer Weaponization Index per payer (current build). */
export interface PayerWi {
  name: string;
  /** Current 90-day Weaponization Index. */
  wi: number;
  /** True if Sentinel is producing live signals for this payer. */
  active: boolean;
}
export const SENTINEL_PAYERS: PayerWi[] = [
  { name: "UHC", wi: 2.4, active: true },
  { name: "BCBS", wi: 2.1, active: true },
  { name: "Aetna", wi: 1.7, active: true },
  { name: "Cigna", wi: 1.3, active: true },
  { name: "Humana", wi: 1.2, active: true },
  { name: "Molina", wi: 1.8, active: true },
  { name: "Centene", wi: 1.5, active: true },
];

/** Crucible — public-data ingest rails. */
export interface IngestRail {
  label: string;
  /** Approx ingest cadence in seconds between batches. */
  cadenceSec: number;
  /** Module the rail primarily feeds — used for click-through. */
  feedsModule: string;
}
export const CRUCIBLE_RAILS: IngestRail[] = [
  { label: "HPT MRFs", cadenceSec: 1.6, feedsModule: "ContractIntel" },
  { label: "TiC MRFs", cadenceSec: 2.0, feedsModule: "ContractIntel" },
  { label: "MAC Bulletins", cadenceSec: 2.6, feedsModule: "Shield" },
];

/** Regulatory feed — sample log entries for the bottom-right monitor. */
export interface RegulatoryFeedEntry {
  source: string;
  module: string; // upstream module the entry feeds
}
export const REGULATORY_FEED: RegulatoryFeedEntry[] = [
  { source: "MAC-CR-1247", module: "Shield" },
  { source: "NCD-UPDATE", module: "Prevent" },
  { source: "NCCI-Q2-2026", module: "Shield" },
  { source: "LCD-REVISION", module: "Prevent" },
  { source: "TiC-MRF-REFRESH", module: "ContractIntel" },
  { source: "CARC-UPDATE", module: "Triage" },
  { source: "CMS-PFS-DELTA", module: "Shield" },
  { source: "PAYER-POLICY-UHC", module: "Sentinel" },
];

/** Status board palette per platform layer. */
export const LAYER_LED_COLOR: Record<ModuleLayer, string> = {
  predict: "#06B6D4",
  protect: "#10B981",
  recover: "#8B5CF6",
};
