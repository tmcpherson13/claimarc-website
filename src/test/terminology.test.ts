// @vitest-environment node
/**
 * Terminology guard
 * -----------------
 * Ensures deprecated terms (see FORBIDDEN_TERMS in src/config/terminology.ts)
 * never appear in any user-facing surface and that the canonical replacement
 * ("Layers") IS present in the metadata where it is expected.
 *
 * Scope:
 *   1. Source code under src/        (UI copy)
 *   2. Static assets: index.html, public/sitemap.xml, public/robots.txt
 *   3. Live CMS rows: site_pages and content_items (incl. SEO fields)
 *
 * The test runs against the live Supabase project using the publishable key.
 * If the network is unavailable, the CMS portion is skipped (not failed) so
 * local dev without internet still passes; the code/asset checks are always
 * enforced.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { FORBIDDEN_TERMS, TERMS } from "@/config/terminology";

const ROOT = process.cwd();

/** Files/dirs allowed to mention forbidden terms (this guard + config). */
const ALLOWLIST = new Set<string>([
  "src/config/terminology.ts",
  "src/test/terminology.test.ts",
]);

const SRC_EXTS = [".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css"];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (SRC_EXTS.some((e) => full.endsWith(e))) out.push(full);
  }
  return out;
}

function findForbidden(text: string): string[] {
  const hits: string[] = [];
  for (const term of FORBIDDEN_TERMS) {
    const re = new RegExp(`\\b${term}\\b`, "gi");
    const m = text.match(re);
    if (m) hits.push(...m);
  }
  return hits;
}

/**
 * Stricter scanner for source files: only flag occurrences that appear in
 * user-facing surfaces — string literals, template literals, and JSX text.
 * This intentionally ignores identifiers, type names, and comments so we can
 * keep internal code names like `ClusterKey` while still catching any
 * forbidden term that would render to a user.
 */
function findForbiddenUserFacing(text: string): string[] {
  // Strip block + line comments first so identifiers in commented-out code
  // are ignored.
  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

  const hits: string[] = [];
  // 1. Quoted strings: "...", '...', `...`
  const stringRe = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g;
  let match: RegExpExecArray | null;
  while ((match = stringRe.exec(stripped)) !== null) {
    hits.push(...findForbidden(match[0]));
  }
  // 2. JSX text nodes: text between `>` and `<` that isn't pure whitespace.
  const jsxTextRe = />([^<>{}]+)</g;
  while ((match = jsxTextRe.exec(stripped)) !== null) {
    hits.push(...findForbidden(match[1]));
  }
  return hits;
}

describe("terminology guard — code & static assets", () => {
  it("contains no user-facing forbidden terms in src/", () => {
    const offenders: { file: string; hits: string[] }[] = [];
    for (const file of walk(join(ROOT, "src"))) {
      const rel = relative(ROOT, file).replace(/\\/g, "/");
      if (ALLOWLIST.has(rel)) continue;
      const text = readFileSync(file, "utf8");
      // For TS/TSX/JS/JSX use the strict scanner (strings + JSX text only),
      // since identifier names like `ClusterKey` are intentionally kept.
      // For JSON/MD/HTML/CSS treat the whole file as user-facing-ish content.
      const useStrict = /\.(t|j)sx?$/.test(file);
      const hits = useStrict ? findForbiddenUserFacing(text) : findForbidden(text);
      if (hits.length) offenders.push({ file: rel, hits });
    }
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });

  it("contains no forbidden terms in static SEO assets (index.html, sitemap, robots)", () => {
    const files = ["index.html", "public/sitemap.xml", "public/robots.txt"];
    const offenders: { file: string; hits: string[] }[] = [];
    for (const f of files) {
      try {
        const hits = findForbidden(readFileSync(join(ROOT, f), "utf8"));
        if (hits.length) offenders.push({ file: f, hits });
      } catch {
        // file optional
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("terminology guard — CMS content (Supabase)", () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  it("CMS env is configured", () => {
    expect(url, "VITE_SUPABASE_URL must be set").toBeTruthy();
    expect(key, "VITE_SUPABASE_PUBLISHABLE_KEY must be set").toBeTruthy();
  });

  it("site_pages rows contain no forbidden terms in user-facing or SEO fields", async () => {
    if (!url || !key) return;
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("site_pages")
      .select("page_key, title, headline, subheadline, body, meta_title, meta_description");
    if (error) throw error;
    const offenders: unknown[] = [];
    for (const row of data ?? []) {
      const fields: Array<keyof typeof row> = [
        "title",
        "headline",
        "subheadline",
        "body",
        "meta_title",
        "meta_description",
      ];
      for (const f of fields) {
        const v = (row as Record<string, unknown>)[f as string];
        if (typeof v === "string") {
          const hits = findForbidden(v);
          if (hits.length) offenders.push({ page_key: row.page_key, field: f, hits });
        }
      }
    }
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  }, 20_000);

  it("content_items rows contain no forbidden terms in body or SEO fields", async () => {
    if (!url || !key) return;
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("content_items")
      .select("id, slug, title, summary, body, seo_title, seo_description, status")
      .eq("status", "published");
    if (error) throw error;
    const offenders: unknown[] = [];
    for (const row of data ?? []) {
      for (const f of ["title", "summary", "body", "seo_title", "seo_description"] as const) {
        const v = (row as Record<string, unknown>)[f];
        if (typeof v === "string") {
          const hits = findForbidden(v);
          if (hits.length) offenders.push({ slug: row.slug, field: f, hits });
        }
      }
    }
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  }, 20_000);
});

describe("terminology guard — canonical 'Layers' presence", () => {
  it("the platform/index pages reference the canonical 'Layers' term", () => {
    const platform = readFileSync(join(ROOT, "src/pages/PlatformPage.tsx"), "utf8");
    const index = readFileSync(join(ROOT, "src/pages/Index.tsx"), "utf8");
    // Either direct mention or an import of the centralized terminology.
    const ok = (s: string) =>
      s.includes(TERMS.layers) || /from\s+["']@\/config\/terminology["']/.test(s);
    expect(ok(platform), "PlatformPage must reference Layers terminology").toBe(true);
    expect(ok(index), "Index must reference Layers terminology").toBe(true);
  });
});
