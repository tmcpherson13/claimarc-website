// Utilities for the rich article template. We pre-process markdown in JS
// rather than via a remark plugin to keep the dependency surface small.

export interface ParsedMarkdown {
  takeaways: string[];
  body: string; // markdown with the takeaways fence removed
}

// Strips the first ```takeaways ... ``` fenced block (if any) and returns its
// list items as an array. Inside the block, lines starting with `-` or `*` are
// treated as items; other non-empty lines fall through as items too.
export const parseTakeaways = (markdown: string): ParsedMarkdown => {
  const re = /```takeaways\s*\n([\s\S]*?)\n```/i;
  const m = re.exec(markdown);
  if (!m) return { takeaways: [], body: markdown };
  const items = m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
  return { takeaways: items, body: markdown.replace(re, "").trim() };
};
