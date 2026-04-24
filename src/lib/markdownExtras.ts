// Utilities for the rich article template. We pre-process markdown in JS
// rather than via a remark plugin to keep the dependency surface small.

export interface ParsedMarkdown {
  takeaways: string[];
  body: string; // markdown with the takeaways fence removed
}

// Strips the first ```takeaways ... ``` fenced block (if any) and returns its
// list items as an array. Inside the block, lines starting with `-` or `*` are
// treated as bullets; other non-empty lines fall through as items too. An
// empty or whitespace-only block yields an empty array (KeyTakeaways will
// render nothing in that case).
export const parseTakeaways = (markdown: string): ParsedMarkdown => {
  if (!markdown) return { takeaways: [], body: "" };
  // Allow optional trailing whitespace on the closing fence and optional
  // surrounding blank lines so the strip leaves the body tidy.
  const re = /\n?\n?```takeaways[ \t]*\n([\s\S]*?)\n```[ \t]*\n?/i;
  const m = re.exec(markdown);
  if (!m) return { takeaways: [], body: markdown };
  const items = m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
  // Replace with a single newline boundary so adjacent paragraphs don't merge.
  const body = (markdown.slice(0, m.index) + "\n\n" + markdown.slice(m.index + m[0].length))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { takeaways: items, body };
};
