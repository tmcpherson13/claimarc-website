import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getModule } from "@/config/modules";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type ChatbotContextValue = {
  isOpen: boolean;
  open: (moduleContext?: string, initialPrompt?: string) => void;
  close: () => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messageCount: number;
  offerDemo: boolean;
  sendMessage: (content: string) => Promise<void>;
  moduleContext: string | null;
  clearModuleContext: () => void;
  pageContext: string | null;
  clearSession: () => void;
  draftPrompt: string | null;
  consumeDraftPrompt: () => string | null;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

const SESSION_KEY = "zdefense_chat_session";
const MODULE_CONTEXT_KEY = "zdefense_chat_module_context";
const DRAFT_PROMPTS_KEY = "zdefense_chat_draft_prompts";
const MAX_MESSAGE_CHARS = 500;
const CONTEXT_WINDOW = 12;

/**
 * DEVELOPER NOTE — Module slug ↔ moduleContext mapping
 * -----------------------------------------------------
 * Every value passed to `useChatbot().open(moduleContext)` MUST match the
 * `name` field of a module defined in `src/config/modules.ts` exactly
 * (capitalized, no abbreviations). The chatbot's system prompt and tutor
 * behavior reference these names verbatim ("Sentinel", "ContractIntel",
 * "Forecast", "Shield", "Prevent", "Ledger", "Triage", "Evidence", "Resolve").
 *
 * SolutionsPage URL hash slugs are the lowercase form of the module name
 * (see `slugify` in src/pages/SolutionsPage.tsx — `name.toLowerCase()`),
 * which yields:
 *
 *   URL hash slug      ↔   moduleContext string
 *   ----------------       --------------------
 *   #sentinel          ↔   "Sentinel"
 *   #contractintel     ↔   "ContractIntel"
 *   #forecast          ↔   "Forecast"
 *   #shield            ↔   "Shield"
 *   #prevent           ↔   "Prevent"
 *   #ledger            ↔   "Ledger"
 *   #triage            ↔   "Triage"
 *   #evidence          ↔   "Evidence"
 *   #resolve           ↔   "Resolve"
 *
 * When opening the chatbot from a module section button on /solutions,
 * always pass `m.name` (NOT the slug) — the slug exists only for URL routing.
 *
 * The selected moduleContext is persisted in sessionStorage under
 * `MODULE_CONTEXT_KEY` so reopening the chatbot on any subsequent page
 * (or after a hard reload within the same browser tab) restores the same
 * context until `clearSession()` is called or the user clears the badge
 * inside the panel.
 */

const PAGE_MAP: Record<string, string> = {
  "/": "home",
  "/platform": "platform",
  "/solutions": "solutions",
  "/why-zdefense": "why-zdefense",
  "/pricing": "pricing",
  "/about": "about",
  "/contact": "contact",
  "/blog": "intelligence-center",
};

function detectPageContext(pathname: string): string | null {
  if (PAGE_MAP[pathname]) return PAGE_MAP[pathname];
  if (pathname.startsWith("/blog")) return "intelligence-center";
  if (pathname.startsWith("/white-papers")) return "intelligence-center";
  if (pathname.startsWith("/platform")) return "platform";
  if (pathname.startsWith("/solutions")) return "solutions";
  return null;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return generateId();
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = generateId();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return generateId();
  }
}

function readPersistedModuleContext(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(MODULE_CONTEXT_KEY);
  } catch {
    return null;
  }
}

function writePersistedModuleContext(value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage.setItem(MODULE_CONTEXT_KEY, value);
    else window.sessionStorage.removeItem(MODULE_CONTEXT_KEY);
  } catch {
    /* ignore */
  }
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [offerDemo, setOfferDemo] = useState(false);
  const [moduleContext, setModuleContext] = useState<string | null>(() =>
    readPersistedModuleContext()
  );
  const [pageContext, setPageContext] = useState<string | null>(
    detectPageContext(typeof window !== "undefined" ? window.location.pathname : "/")
  );

  const [draftPrompt, setDraftPrompt] = useState<string | null>(null);

  const sessionIdRef = useRef<string>(getOrCreateSessionId());

  useEffect(() => {
    setPageContext(detectPageContext(location.pathname));
  }, [location.pathname]);

  const open = useCallback((nextModuleContext?: string, initialPrompt?: string) => {
    setIsOpen(true);
    if (initialPrompt && initialPrompt.trim()) {
      setDraftPrompt(initialPrompt.trim());
    }
    if (nextModuleContext) {
      setModuleContext(nextModuleContext);
      writePersistedModuleContext(nextModuleContext);
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        const mod = getModule(nextModuleContext);
        const tagline = mod?.tagline ?? "";
        const firstOutcome = mod?.outcomes?.[0] ?? "";
        // Phrase the outcome as a problem (lowercase first letter, strip trailing period).
        const outcomePhrase = firstOutcome
          ? firstOutcome.charAt(0).toLowerCase() + firstOutcome.slice(1).replace(/\.$/, "")
          : "";
        const hook = mod
          ? `I can see you're looking at ${nextModuleContext}${tagline ? ` — ${tagline}` : ""}.${outcomePhrase ? ` Most teams come here because they need ${outcomePhrase}.` : ""} What's your situation?`
          : `I can see you're looking at ${nextModuleContext}. What would you like to know — how it works, what it costs, or whether you need a BAA?`;
        return [
          {
            id: generateId(),
            role: "assistant",
            content: `Hi, I'm Z, your revenue defense assistant. ${hook}`,
            timestamp: Date.now(),
          },
        ];
      });
    } else {
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: generateId(),
            role: "assistant",
            content:
              "Hi, I'm Z, your revenue defense assistant. Ask me anything about ZDefense — how the modules work, what requires a BAA, or why your denial rate is probably not as random as it looks.",
            timestamp: Date.now(),
          },
        ];
      });
    }
  }, []);

  const consumeDraftPrompt = useCallback((): string | null => {
    let value: string | null = null;
    setDraftPrompt((prev) => {
      value = prev;
      return null;
    });
    return value;
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const clearSession = useCallback(() => {
    setMessages([]);
    setMessageCount(0);
    setOfferDemo(false);
    setError(null);
    setModuleContext(null);
    writePersistedModuleContext(null);
    const fresh = generateId();
    sessionIdRef.current = fresh;
    try {
      window.sessionStorage.setItem(SESSION_KEY, fresh);
    } catch {
      /* ignore */
    }
  }, []);

  const clearModuleContext = useCallback(() => {
    setModuleContext(null);
    writePersistedModuleContext(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      if (trimmed.length > MAX_MESSAGE_CHARS) {
        setError(`Messages must be ${MAX_MESSAGE_CHARS} characters or fewer.`);
        return;
      }

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      // Build the outgoing payload from the latest history including the new message.
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsLoading(true);

      const contextWindow = nextMessages
        .slice(-CONTEXT_WINDOW)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "chat-assistant",
          {
            body: {
              messages: contextWindow,
              moduleContext,
              pageContext,
              sessionId: sessionIdRef.current,
            },
          }
        );

        if (fnError) {
          // supabase.functions.invoke surfaces non-2xx as an error, but the
          // body may still contain our typed error payload.
          const payload = (data ?? null) as
            | { error?: string; message?: string }
            | null;

          if (payload?.error === "SESSION_LIMIT") {
            setMessages((prev) => [
              ...prev,
              {
                id: generateId(),
                role: "assistant",
                content:
                  (payload.message ??
                    "You've reached the session limit.") +
                  "\n\n[Book a demo](/contact?offer=demo) to continue the conversation with our team.",
                timestamp: Date.now(),
              },
            ]);
            return;
          }

          if (payload?.error === "MESSAGE_TOO_LONG") {
            setError(
              payload.message ??
                `Messages must be ${MAX_MESSAGE_CHARS} characters or fewer.`
            );
            return;
          }

          setError(payload?.message ?? fnError.message ?? "Something went wrong. Please try again.");
          return;
        }

        const payload = data as
          | {
              reply?: string;
              messageCount?: number;
              offerDemo?: boolean;
              error?: string;
              message?: string;
            }
          | null;

        if (!payload) {
          setError("No response received. Please try again.");
          return;
        }

        if (payload.error === "SESSION_LIMIT") {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "assistant",
              content:
                (payload.message ?? "You've reached the session limit.") +
                "\n\n[Book a demo](/contact?offer=demo) to continue the conversation with our team.",
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        if (payload.error) {
          setError(payload.message ?? payload.error);
          return;
        }

        if (payload.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "assistant",
              content: payload.reply!,
              timestamp: Date.now(),
            },
          ]);
        }

        if (typeof payload.messageCount === "number") {
          setMessageCount(payload.messageCount);
        }
        if (typeof payload.offerDemo === "boolean") {
          setOfferDemo(payload.offerDemo);
        }
      } catch (e) {
        console.error("chat-assistant invoke error", e);
        setError(
          e instanceof Error ? e.message : "Something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, moduleContext, pageContext]
  );

  const value = useMemo<ChatbotContextValue>(
    () => ({
      isOpen,
      open,
      close,
      messages,
      isLoading,
      error,
      messageCount,
      offerDemo,
      sendMessage,
      moduleContext,
      clearModuleContext,
      pageContext,
      clearSession,
      draftPrompt,
      consumeDraftPrompt,
    }),
    [
      isOpen,
      open,
      close,
      messages,
      isLoading,
      error,
      messageCount,
      offerDemo,
      sendMessage,
      moduleContext,
      clearModuleContext,
      pageContext,
      clearSession,
      draftPrompt,
      consumeDraftPrompt,
    ]
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) {
    throw new Error("useChatbot must be used inside a ChatbotProvider");
  }
  return ctx;
}
