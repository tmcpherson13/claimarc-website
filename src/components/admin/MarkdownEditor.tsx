import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Heading2,
  Link as LinkIcon,
  Code,
  Quote,
  Minus,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

type Tab = "write" | "preview";

const wrapSelection = (
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = before,
  placeholder = "",
): { value: string; selStart: number; selEnd: number } => {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e) || placeholder;
  const next = value.slice(0, s) + before + selected + after + value.slice(e);
  const start = s + before.length;
  return { value: next, selStart: start, selEnd: start + selected.length };
};

const insertAtCursor = (
  textarea: HTMLTextAreaElement,
  insert: string,
): { value: string; selStart: number; selEnd: number } => {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const next = value.slice(0, s) + insert + value.slice(e);
  const pos = s + insert.length;
  return { value: next, selStart: pos, selEnd: pos };
};

const insertLineStart = (
  textarea: HTMLTextAreaElement,
  prefix: string,
): { value: string; selStart: number; selEnd: number } => {
  const { selectionStart: s, value } = textarea;
  const lineStart = value.lastIndexOf("\n", s - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const pos = s + prefix.length;
  return { value: next, selStart: pos, selEnd: pos };
};

const ToolbarButton = ({
  label,
  title,
  onClick,
  children,
}: {
  label?: string;
  title: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    className="h-7 min-w-7 px-2 inline-flex items-center justify-center rounded text-xs font-semibold text-slate-600 hover:text-[var(--navy)] hover:bg-white transition-colors"
  >
    {children ?? label}
  </button>
);

const MarkdownEditor = ({ value, onChange, rows = 20 }: Props) => {
  const [tab, setTab] = useState<Tab>("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (
    fn: (ta: HTMLTextAreaElement) => { value: string; selStart: number; selEnd: number },
  ) => {
    const ta = ref.current;
    if (!ta) return;
    const { value: next, selStart, selEnd } = fn(ta);
    onChange(next);
    requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.focus();
      ref.current.setSelectionRange(selStart, selEnd);
    });
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;

  return (
    <div>
      <div className="flex gap-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "write"}
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md ${
            tab === "write"
              ? "bg-[var(--navy)] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "preview"}
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md ${
            tab === "preview"
              ? "bg-[var(--navy)] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Preview
        </button>
      </div>

      {tab === "write" ? (
        <div className="border border-slate-200 rounded-b-md rounded-tr-md overflow-hidden">
          <div className="flex gap-1 bg-slate-50 border-b border-slate-200 px-2 py-1.5">
            <ToolbarButton
              title="Bold"
              onClick={() => apply((ta) => wrapSelection(ta, "**", "**", "bold"))}
            >
              <Bold className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              onClick={() => apply((ta) => wrapSelection(ta, "*", "*", "italic"))}
            >
              <Italic className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 2"
              onClick={() => apply((ta) => insertLineStart(ta, "## "))}
            >
              <Heading2 className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Link"
              onClick={() =>
                apply((ta) => {
                  const { selectionStart: s, selectionEnd: e, value: v } = ta;
                  const sel = v.slice(s, e) || "text";
                  const insert = `[${sel}](url)`;
                  const next = v.slice(0, s) + insert + v.slice(e);
                  const start = s + insert.length - 4; // position cursor at "url"
                  return { value: next, selStart: start, selEnd: start + 3 };
                })
              }
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Inline code"
              onClick={() => apply((ta) => wrapSelection(ta, "`", "`", "code"))}
            >
              <Code className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Quote"
              onClick={() => apply((ta) => insertLineStart(ta, "> "))}
            >
              <Quote className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Divider"
              onClick={() => apply((ta) => insertAtCursor(ta, "\n\n---\n\n"))}
            >
              <Minus className="h-3.5 w-3.5" />
            </ToolbarButton>
          </div>
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="font-mono text-sm border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-b-md rounded-tr-md p-5 bg-white min-h-[20rem]">
          <div className="prose prose-slate max-w-none prose-headings:text-[var(--navy)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || "_Nothing to preview yet._"}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <p className="text-slate-400 text-xs text-right mt-1">
        {words.toLocaleString()} words · {chars.toLocaleString()} characters
      </p>
    </div>
  );
};

export default MarkdownEditor;
