import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send } from "lucide-react";
import { useChatbot, type Message } from "@/context/ChatbotContext";

const MAX_CHARS = 500;
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_TIMEOUT_MS = 5000;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "compact" | "invisible";
          execution?: "render" | "execute";
        }
      ) => string;
      execute: (widgetIdOrContainer?: string | HTMLElement) => void;
      reset: (widgetIdOrContainer?: string | HTMLElement) => void;
      remove: (widgetIdOrContainer?: string | HTMLElement) => void;
    };
  }
}
const LINK_RE = /\/solutions#[a-z-]+/g;
const MONEY_RE = /\$[0-9][0-9,.]*[KMB]?/g;
const PCT_RE = /[0-9]+(?:\.[0-9]+)?%/g;

type Segment = { kind: "text" | "link" | "metric"; value: string };

function tokenize(text: string): Segment[] {
  const combined = new RegExp(
    `(${LINK_RE.source})|(${MONEY_RE.source})|(${PCT_RE.source})`,
    "g"
  );
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1]) segments.push({ kind: "link", value: match[1] });
    else if (match[2] || match[3]) segments.push({ kind: "metric", value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

function AssistantContent({ content }: { content: string }) {
  const navigate = useNavigate();
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => {
        const segs = tokenize(line);
        return (
          <p
            key={lineIdx}
            style={{
              margin: 0,
              marginTop: lineIdx === 0 ? 0 : 6,
              fontSize: 13,
              lineHeight: 1.6,
              color: "#CBD5E1",
            }}
          >
            {segs.length === 0
              ? line || "\u00A0"
              : segs.map((s, i) => {
                  if (s.kind === "link") {
                    return (
                      <a
                        key={i}
                        href={s.value}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(s.value);
                        }}
                        style={{ color: "#10B981", textDecoration: "underline" }}
                      >
                        {s.value}
                      </a>
                    );
                  }
                  if (s.kind === "metric") {
                    return (
                      <span key={i} style={{ color: "#10B981", fontWeight: 500 }}>
                        {s.value}
                      </span>
                    );
                  }
                  return <span key={i}>{s.value}</span>;
                })}
          </p>
        );
      })}
    </>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "6px 2px" }} aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#10B981",
            display: "inline-block",
            animation: `pmcChatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ChatbotPanel() {
  const {
    isOpen,
    close,
    messages,
    isLoading,
    error,
    sendMessage,
    moduleContext,
    clearModuleContext,
    offerDemo,
    draftPrompt,
    draftPromptVersion,
    consumeDraftPrompt,
    turnstileToken,
    setTurnstileToken,
  } = useChatbot();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Seed the input with the prefilled prompt every time a fresh signal
  // arrives (panel open OR a new draftPromptVersion bump). This guarantees
  // that toggling Ask Z between modules — or re-clicking the same module's
  // Ask Z button — always re-seeds the textarea with the *current* module's
  // question, never a stale one left over from editing.
  useEffect(() => {
    if (!isOpen) return;
    const next = consumeDraftPrompt();
    if (next) {
      setInput(next);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, draftPromptVersion]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const last = messages[messages.length - 1];
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    if (!last) {
      scrollToBottom();
      return;
    }
    if (last.role === "assistant") {
      const wordCount = last.content.split(" ").length;
      if (wordCount > 80) {
        const el = messageRefs.current.get(last.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const max = 24 * 4 + 20;
    ta.style.height = Math.min(ta.scrollHeight, max) + "px";
  }, [input]);

  const remaining = MAX_CHARS - input.length;
  const trimmed = input.trim();
  const canSend = trimmed.length > 0 && !isLoading && remaining >= 0;

  const submit = () => {
    if (!canSend) return;
    const value = trimmed;
    setInput("");
    void sendMessage(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <>
      <style>{`
        @keyframes pmcChatDot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes pmcChatPing {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
        .zd-chat-textarea::placeholder { opacity: 0.5; }
        .zd-chat-textarea::-webkit-input-placeholder { opacity: 0.5; }
        .zd-chat-textarea::-moz-placeholder { opacity: 0.5; }
      `}</style>

      <aside
        role="dialog"
        aria-label="Z — your revenue defense assistant"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(420px, 100vw)",
          background: "#0B1628",
          borderLeft: "1px solid #1E3A5F",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-out",
          boxShadow: isOpen ? "-20px 0 40px rgba(0,0,0,0.45)" : "none",
        }}
      >
        <div
          style={{
            height: 56,
            flexShrink: 0,
            background: "#0B1628",
            borderBottom: "1px solid #1E3A5F",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ position: "relative", display: "inline-flex", width: 6, height: 6 }}>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  background: "#10B981",
                  animation: "pmcChatPing 1.6s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span
                style={{
                  position: "relative",
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#10B981",
                }}
              />
            </span>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600 }}>Z</span>
              <span style={{ color: "#64748B", fontSize: 11 }}>your revenue defense assistant</span>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#64748B",
              padding: 6,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CBD5E1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
          >
            <X size={18} />
          </button>
        </div>

        {moduleContext && (
          <div style={{ padding: "8px 16px 0" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#1E3A5F",
                color: "#06B6D4",
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              Viewing: {moduleContext}
              <button
                type="button"
                aria-label="Clear context"
                onClick={clearModuleContext}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#06B6D4",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <X size={11} />
              </button>
            </span>
          </div>
        )}

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.length === 0 && !isLoading && (
            <div
              style={{
                margin: "auto",
                color: "#475569",
                fontSize: 13,
                fontStyle: "italic",
                textAlign: "center",
                maxWidth: 320,
                lineHeight: 1.6,
              }}
            >
              Ask me anything about ZDefense — how the modules work, what you actually need a BAA for, or why your denial rate is probably not as random as it looks.
            </div>
          )}

          {messages.map((m: Message) =>
            m.role === "user" ? (
              <div
                key={m.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(m.id, el);
                  else messageRefs.current.delete(m.id);
                }}
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "80%",
                  background: "#1E3A5F",
                  color: "#CBD5E1",
                  borderRadius: "12px 12px 2px 12px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ) : (
              <div
                key={m.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(m.id, el);
                  else messageRefs.current.delete(m.id);
                }}
                style={{ alignSelf: "flex-start", maxWidth: "85%" }}
              >
                <AssistantContent content={m.content} />
              </div>
            )
          )}

          {isLoading && (
            <div style={{ alignSelf: "flex-start" }}>
              <LoadingDots />
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                alignSelf: "stretch",
                color: "#FCA5A5",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {offerDemo && !bannerDismissed && (() => {
          const convo = messages.map((m) => m.content).join(" ").toLowerCase();
          const roleRules: Array<[RegExp, string]> = [
            [/\bcfo\b|forecast/, "cfo"],
            [/\bdirector\b|ledger/, "director"],
            [/\bmanager\b|shield/, "manager"],
            [/\bspecialist\b|triage/, "specialist"],
            [/\bcompliance\b|audit/, "compliance"],
          ];
          const detectedRole = roleRules.find(([re]) => re.test(convo))?.[1];
          const params = new URLSearchParams({ offer: "demo" });
          if (detectedRole) params.set("role", detectedRole);
          if (moduleContext) params.set("module", moduleContext);
          const demoHref = `/contact?${params.toString()}`;
          return (
          <div
            style={{
              background: "#065F46",
              borderTop: "1px solid #10B981",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#D1FAE5", fontSize: 12, flex: 1 }}>
              Ready to see this against your actual payer mix?
            </span>
            <button
              type="button"
              onClick={() => navigate(demoHref)}
              style={{
                background: "#10B981",
                color: "#0B1628",
                fontSize: 11,
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Book a Demo
            </button>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setBannerDismissed(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#D1FAE5",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                padding: 2,
              }}
            >
              <X size={14} />
            </button>
          </div>
          );
        })()}

        <div
          style={{
            background: "#0B1628",
            borderTop: "1px solid #1E3A5F",
            padding: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any module, pricing, BAA requirements..."
              disabled={isLoading}
              className="zd-chat-textarea"
              style={{
                flex: 1,
                resize: "none",
                background: "#1E3A5F",
                border: "none",
                borderRadius: 8,
                color: "#CBD5E1",
                padding: "10px 12px",
                fontSize: 13,
                lineHeight: "24px",
                outline: "none",
                fontFamily: "inherit",
                maxHeight: 24 * 4 + 20,
                overflowY: "auto",
              }}
            />
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              style={{
                background: canSend ? "#10B981" : "#1E3A5F",
                color: canSend ? "#0B1628" : "#475569",
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 40,
              }}
            >
              <Send size={12} />
              Send
            </button>
          </div>

          <div
            style={{
              fontSize: 10,
              color: remaining < 50 ? "#EF4444" : "#475569",
              textAlign: "right",
              marginTop: 6,
            }}
          >
            {remaining} / {MAX_CHARS}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#475569",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            10 message session limit · Sessions reset after 30 min
          </div>
        </div>
      </aside>
    </>
  );
}
