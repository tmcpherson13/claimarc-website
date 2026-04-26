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

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type ChatbotContextValue = {
  isOpen: boolean;
  open: (moduleContext?: string) => void;
  close: () => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messageCount: number;
  offerDemo: boolean;
  sendMessage: (content: string) => Promise<void>;
  moduleContext: string | null;
  pageContext: string | null;
  clearSession: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

const SESSION_KEY = "zdefense_chat_session";
const MAX_MESSAGE_CHARS = 500;
const CONTEXT_WINDOW = 12;

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

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [offerDemo, setOfferDemo] = useState(false);
  const [moduleContext, setModuleContext] = useState<string | null>(null);
  const [pageContext, setPageContext] = useState<string | null>(
    detectPageContext(typeof window !== "undefined" ? window.location.pathname : "/")
  );

  const sessionIdRef = useRef<string>(getOrCreateSessionId());

  useEffect(() => {
    setPageContext(detectPageContext(location.pathname));
  }, [location.pathname]);

  const open = useCallback((nextModuleContext?: string) => {
    setIsOpen(true);
    if (nextModuleContext) {
      setModuleContext(nextModuleContext);
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: generateId(),
            role: "assistant",
            content: `I can see you're looking at ${nextModuleContext}. What would you like to know about it — how it works, what it costs, or whether you need a BAA?`,
            timestamp: Date.now(),
          },
        ];
      });
    }
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const clearSession = useCallback(() => {
    setMessages([]);
    setMessageCount(0);
    setOfferDemo(false);
    setError(null);
    setModuleContext(null);
    const fresh = generateId();
    sessionIdRef.current = fresh;
    try {
      window.sessionStorage.setItem(SESSION_KEY, fresh);
    } catch {
      /* ignore */
    }
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
      pageContext,
      clearSession,
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
      pageContext,
      clearSession,
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
