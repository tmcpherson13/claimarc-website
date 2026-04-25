// AI content generator for the admin editor.
// Uses the Lovable AI Gateway (server-side LOVABLE_API_KEY) and returns
// a structured article via tool calling so we never have to parse markdown
// fences from the model output.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `You are a content writer for ZDefense AI³, a revenue cycle intelligence platform for healthcare providers. You write authoritative, executive-level content for CFOs, Revenue Cycle Directors, RC Managers, Billing Specialists, and Auditor/Compliance Officers.

BRAND VOICE:
- Confident and authoritative — never startup-casual
- Data-driven — cite HFMA, CAQH, Becker's where relevant
- Problem-first — lead with the pain, then the solution
- Never use the phrase "game-changer" or "revolutionary"

PLATFORM KNOWLEDGE:
ZDefense has 9 modules in 3 layers:

PREDICT layer:
- Sentinel: Payer Weaponization Index. Detects payer behavioral shifts 7-14 days before formal notice. Requires BAA. Audience: RC Director.
- ContractIntel: Rate benchmarking vs TiC data across 7 payers. No BAA required. Audience: CFO, RC Director.
- Forecast: 90-day revenue projection synthesizing all 8 other modules. $12.6M / 84% confidence in demo. Requires BAA. Audience: CFO.

PROTECT layer:
- Shield: Pre-submission claim interception. 89.4% clean claim rate. No BAA required. RC Manager.
- Prevent: Prior auth requirement detection, 11 days advance average. No BAA required. RC Manager.
- Ledger: Underpayment detection + Medicare 60-day compliance. 6-stage workflow, immutable audit log, dual-approver write-offs. Requires BAA. Audience: RC Director, Auditor/Compliance Officer.

RECOVER layer:
- Triage: AI denial queue. 50-rule CARC/RARC model. Recovery probability per claim. $847K pipeline in demo. Requires BAA. Billing Specialist.
- Evidence: Automated evidence assembly for appeals. Requires BAA. Billing Specialist.
- Resolve: Bulk payer-specific appeal letters. 10 letters in 8 seconds, 78% confidence. Requires BAA. Billing Specialist, RC Director.

KEY STATS (cite these):
- 41% of providers report denial rates above 10% (HFMA Denials Management Survey, 2024)
- 86% of denials are preventable (CAQH Index: Closing the Gap, 2023)
- 60-90 days: average lag to detect payer behavioral shifts (Becker's Hospital Review, 2023)

30-DAY NO-OBLIGATION EVALUATION:
ContractIntel, Shield, and Prevent activate with live payer data — no BAA, no IT setup, no legal agreements.

POSITIONING:
"While payers weaponize data and shifting rules against providers, ZDefense turns that same intelligence into your defense. We also catch compliance landmines before they explode."

Lead with the problem. Use real stats with citations. Reference the correct layer (PREDICT, PROTECT, or RECOVER) for any module mentioned. End with which modules are involved and BAA requirements. Body should be 600-900 words, markdown with ## headings, **bold**, and bullet lists.`;

const ARTICLE_TOOL = {
  type: "function",
  function: {
    name: "write_article",
    description: "Return a fully-drafted article for the admin editor.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Compelling, specific headline." },
        slug: { type: "string", description: "URL-friendly slug derived from the title." },
        summary: {
          type: "string",
          description: "2-3 sentence summary for meta/preview, max 160 characters.",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "3-6 short topical tags.",
        },
        body: {
          type: "string",
          description:
            "Full article body in markdown, 600-900 words, ## headings, **bold**, bullet lists.",
        },
      },
      required: ["title", "slug", "summary", "tags", "body"],
      additionalProperties: false,
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { prompt, model } = await req.json();
    const MODELS: Record<string, string> = {
      claude: "openai/gpt-5",
      gemini: "google/gemini-3-flash-preview",
    };
    const selectedModel = MODELS[model as string] ?? MODELS.gemini;
    if (typeof prompt !== "string" || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        tools: [ARTICLE_TOOL],
        tool_choice: { type: "function", function: { name: "write_article" } },
      }),
    });

    if (resp.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached — please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (resp.status === 402) {
      return new Response(
        JSON.stringify({
          error: "AI credits exhausted. Add credits in Workspace → Usage to continue.",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = toolCall?.function?.arguments;
    if (!argsRaw) {
      return new Response(
        JSON.stringify({ error: "AI returned no structured output. Try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(argsRaw);
    } catch {
      return new Response(
        JSON.stringify({ error: "AI returned an unexpected format. Try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
