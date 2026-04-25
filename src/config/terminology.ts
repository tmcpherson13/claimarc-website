/**
 * Single source of truth for product terminology that has historically
 * been renamed (e.g. "Clusters" → "Layers"). Use these constants in any
 * user-facing copy or metadata so a future rename only requires editing
 * this file.
 *
 * Rules:
 * - UI/CMS/SEO copy must use these constants (or strings derived from them).
 * - `FORBIDDEN_TERMS` lists deprecated synonyms that must NEVER appear in
 *   user-facing text. The terminology test suite enforces this against the
 *   code, the rendered HTML assets, and the CMS tables.
 */

export const TERMS = {
  /** Singular grouping of modules within the platform. */
  layer: "Layer",
  /** Plural grouping of modules within the platform. */
  layers: "Layers",
} as const;

/**
 * Deprecated terms that must not appear in any user-facing surface.
 * Keep entries lowercase — the matcher is case-insensitive.
 */
export const FORBIDDEN_TERMS: readonly string[] = ["cluster", "clusters"];

/** Common phrases composed from the canonical terms. */
export const PHRASES = {
  threeLayersNineModules: `Three ${TERMS.layers}. Nine Modules. One Platform.`,
  nineModulesThreeLayers: `Nine Modules. Three ${TERMS.layers}. One Connected Platform.`,
  threeOperationalLayers: `three operational ${TERMS.layers.toLowerCase()}`,
} as const;
