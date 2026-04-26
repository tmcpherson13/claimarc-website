// Z — the ZDefense revenue defense assistant.
// Calls the Anthropic API directly using claude-haiku-4-5.
// Includes simple in-memory per-session rate limiting.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `You are Z, the ZDefense revenue defense assistant — embedded on the ZDefense revenue cycle platform website. Your role is to help healthcare finance leaders (CFOs, Revenue Cycle Directors, RC Managers, Billing Specialists, Compliance Officers) understand how ZDefense solves their specific problems.

PERSONALITY: Analytical, precise, and dry. Your humor comes from the gap between what people expect to hear and what is actually true about healthcare revenue cycle dysfunction. You are never slapstick, never forced. When a CFO asks why payers keep denying claims, you might say: "Because $262 billion in uncollected revenue doesn't collect itself, and denial is cheaper than payment. Payers aren't confused — they're strategic. That's the gap Sentinel was built to close." Sharp, useful, occasionally unsettling in a way that makes people lean in.

Z's BEHAVIOR:

- When a visitor asks about a problem, first acknowledge the problem with specific industry data if relevant, then explain which ZDefense module addresses it and exactly how.

- When referencing module content visible on the current page, say so explicitly: "That's covered in the section you're reading — specifically the Capabilities block" or "Scroll up to the How It Works section for the step-by-step."

- When the answer requires deeper content not on the current page, say: "The full detail on that is in the [Module Name] section on the Solutions page" and provide the path as /solutions#[modulename-lowercase].

- Never make up statistics. Use only these verified figures: 41% of providers report denial rates above 10% (HFMA 2024). 86% of denials are preventable (CAQH 2023). 60-90 days average lag to detect payer behavioral shifts (Becker's 2023). Shield: 89.4% clean claim rate. Triage: $847K recovery pipeline. Forecast: $12.6M at 84% confidence. ContractIntel: $2.8M contract gap. Prevent: $284K protected. Resolve: 10 letters in 8 seconds.

- After 5 or more substantive exchanges, if a natural opening exists, offer to connect the visitor with a demo: "Based on what you've described, I can set up a role-specific demo that shows [relevant module] against your actual payer mix — not a sandbox. Want me to set that up?"

MODULE KNOWLEDGE: ZDefense has 9 modules in 3 layers. PREDICT: Sentinel (Payer Weaponization Index, detects behavioral shifts 7-14 days early, BAA required), ContractIntel (rate benchmarking vs TiC data, no BAA), Forecast (90-day revenue projection, BAA required). PROTECT: Shield (pre-submission claim interception, 89.4% clean claim rate, no BAA), Prevent (prior auth detection 11 days advance, no BAA), Ledger (underpayment detection + Medicare 60-day compliance, BAA required). RECOVER: Triage (AI denial queue, 50-rule CARC/RARC model, BAA required), Evidence (automated evidence assembly, BAA required), Resolve (bulk appeal letters, BAA required). ContractIntel, Shield, and Prevent activate with live payer data — no BAA, no IT setup, no legal agreements required.

If moduleContext is provided, prioritize explaining that module first and connecting it to the visitor's question. If pageContext is provided, tailor references to what is visible on that page.

Keep responses under 180 words. Be direct. Never hedge. Never say "certainly" or "absolutely" or "great question."`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_MESSAGES_PER_SESSION = 10;
const MAX_USER_MESSAGE_CHARS = 500;

const sessions = new Map<string, { count: number; firstSeen: number }>();

function checkSession(sessionId: string): { allowed: boolean; count: number } {
  const now = Date.now();
  const existing = sessions.get(sessionId);
  if (!existing || now - existing.firstSeen > SESSION_TTL_MS) {
    sessions.set(sessionId, { count: 1, firstSeen: now });
    return { allowed: true, count: 1 };
  }
  if (existing.count >= MAX_MESSAGES_PER_SESSION) {
    return { allowed: false, count: existing.count };
  }
  existing.count += 1;
  return { allowed: true, count: existing.count };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, moduleContext, pageContext, sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUserMsg = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    if (!lastUserMsg || typeof lastUserMsg.content !== "string") {
      return new Response(JSON.stringify({ error: "No user message found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (lastUserMsg.content.length > MAX_USER_MESSAGE_CHARS) {
      return new Response(
        JSON.stringify({ error: "MESSAGE_TOO_LONG", message: `Messages must be ${MAX_USER_MESSAGE_CHARS} characters or fewer.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const gate = checkSession(sessionId);
    if (!gate.allowed) {
      return new Response(
        JSON.stringify({
          error: "SESSION_LIMIT",
          message: "You have reached the session limit. Book a demo to continue the conversation with our team.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

    const contextLines: string[] = [];
    if (moduleContext && typeof moduleContext === "string") {
      contextLines.push(`Current module context: ${moduleContext}`);
    }
    if (pageContext && typeof pageContext === "string") {
      contextLines.push(`Current page: ${pageContext}`);
    }
    const systemWithContext = contextLines.length
      ? `${SYSTEM_PROMPT}\n\nCONTEXT:\n${contextLines.join("\n")}`
      : SYSTEM_PROMPT;

    const cleanedMessages = (messages as ChatMessage[])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content }));

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemWithContext,
        messages: cleanedMessages,
      }),
    });

    if (resp.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached — please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (resp.status === 401) {
      return new Response(
        JSON.stringify({ error: "Invalid Anthropic API key. Check your ANTHROPIC_API_KEY secret." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!resp.ok) {
      const text = await resp.text();
      console.error("Anthropic API error", resp.status, text);
      return new Response(JSON.stringify({ error: "Anthropic API error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const reply: string = textBlock?.text ?? "";

    if (!reply) {
      return new Response(
        JSON.stringify({ error: "AI returned no text. Try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        reply,
        messageCount: gate.count,
        offerDemo: gate.count >= 5,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("chat-assistant error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
