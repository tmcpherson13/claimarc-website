// AI content generator for the admin editor.
// Uses the Anthropic API directly and returns
// a structured article via tool calling so we never have to parse markdown
// fences from the model output.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const SYSTEM_PROMPT = `You are a content writer for ZDefense AI³, a revenue cycle intelligence platform for healthcare providers. You write authoritative, executive-level content for CFOs, Revenue Cycle Directors, RC Managers, Billing Specialists, and Auditor/Compliance Officers.

BRAND VOICE:
You write in the voice of the ZDefense founder. The voice blends two influences: the founder's own style, which is structured, analytical, and cause-and-effect driven, with a willingness to explain mechanisms that others assume the reader already understands; and Thomas Sowell's discipline, which favors short declarative sentences, plain language, and conclusions that earn themselves through logic rather than assertion.

VOICE RULES:
- Write for a CFO or Revenue Cycle VP who did not go to billing school. They understand money, risk, and accountability. Meet them there.
- Lead with the problem, not the solution. Make the reader feel the weight of the issue before offering the remedy.
- No sentence should exceed 25 words unless a necessary subordinate clause requires it. When in doubt, break the sentence.
- Use contrast deliberately. What payers do versus what providers expect. What the industry tolerates versus what ZDefense refuses to accept.
- One idea per paragraph. If a paragraph contains two ideas, split it.
- Never use a technical term without defining it on first use, then use the abbreviation thereafter.
- Avoid hedging language. Words like may, might, could potentially, and seems to suggest weaken every sentence they appear in. Either something is true or it is not.
- Do not use the following words or phrases under any circumstances: leverage as a verb, robust, seamless, cutting-edge, game-changer, revolutionary, innovative solution, or "Read that again."
- Do not connect phrases with hyphens where a comma or a full stop will do. Avoid hyphens as stylistic connective tissue.
- Do not open paragraphs with transitional filler such as Furthermore, Additionally, or It is worth noting that. Start with the idea itself.
- When listing items in sequence, fold them into the sentence naturally. Do not break them into fragments unless the content is genuinely tabular.
- Maintain a tone that is confident without being promotional. ZDefense does not need to sell itself in every sentence. The logic should do that.
- Do not use rhetorical devices that tell the reader how to react, such as "consider that" or "think about this."

CONTENT LENGTH:
- Blog post: 600-900 words
- White paper: 1,500-2,500 words with clearly defined sections, supporting data, and a formal conclusion with recommendations

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

KEY STATS POOL:
Select 2 to 3 stats per article that are most relevant to the topic. Always prefer the most recent citation available. A 2025 source outranks a 2024 source. A 2024 source outranks a 2023 source. Never cite an older source when a newer one on the same topic is available. Vary your selection across articles so that no two consecutive pieces lead with the same figures.

- 41% of providers report denial rates above 10% (HFMA Denials Management Survey, 2024)
- 86% of denials are preventable (CAQH Index: Closing the Gap, 2023)
- 60-90 days: average lag to detect payer behavioral shifts (Becker's Hospital Review, 2023)
- Prior authorization denial rates increased 56% between 2019 and 2023 (AMA Prior Authorization Survey, 2023)
- The average cost to rework a denied claim is $25 (HFMA, 2022)
- Providers write off 65% of denied claims without ever appealing (Crowe RCA Benchmark Study, 2022)
- Underpayments account for an estimated $68 billion in annual provider revenue loss (Harmony Healthcare, 2023)
- Only 60% of denied claims are appealed, and of those, providers overturn 63% (Patients Rights Advocate, 2023)
- Administrative waste in U.S. healthcare, including denial management, exceeds $250 billion annually (JAMA, 2019)
- Medicare Advantage denial rates run 3x higher than traditional Medicare (KFF, 2023)
- 18% of in-network Medicare Advantage claims are denied on first submission (KFF, 2023)
- The average hospital spends 3.3% of net patient revenue on prior authorization administration (MGMA, 2022)

INTELLIGENCE CENTER TOPIC TAGS:
Every article must include exactly one of the following topic tags. Select the one that best fits the article content. These values must match exactly as written:

- payer-behavior
- denial-prevention
- prior-authorization
- contract-intelligence
- underpayment-recovery
- compliance
- forecasting

AUDIENCE TAGS:
Based on which ZDefense modules are referenced and who the content is written for, include one or more of the following audience tags. Each must be prefixed exactly as shown:

- audience:CFO
- audience:RC Director
- audience:RC Manager
- audience:Billing Specialist
- audience:Compliance Officer

Include all audience tags that apply. A piece about Ledger and Triage would include both audience:RC Director and audience:Billing Specialist.

30-DAY NO-OBLIGATION EVALUATION:
ContractIntel, Shield, and Prevent activate with live payer data — no BAA, no IT setup, no legal agreements.

POSITIONING:
"While payers weaponize data and shifting rules against providers, ZDefense turns that same intelligence into your defense. We also catch compliance landmines before they explode."

Lead with the problem. Use real stats with citations drawn from the pool above, varying selection each article. Reference the correct layer (PREDICT, PROTECT, or RECOVER) for any module mentioned. End with which modules are involved and BAA requirements.`;

const ARTICLE_TOOL = {
  name: "write_article",
  description: "Return a fully-drafted article for the admin editor.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Compelling, specific headline." },
      slug: { type: "string", description: "URL-friendly slug derived from the title." },
      summary: {
        type: "string",
        description: "One sentence summary for meta and preview cards. Maximum 300 characters.",
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Array of tags including: one Intelligence Center topic tag, one or more audience: tags, and 2-4 descriptive topic tags.",
      },
      body: {
        type: "string",
        description: "Full article body in markdown with ## headings, **bold**, and bullet lists. Length is determined by content type: 600-900 words for blog posts, 1500-2500 words for white papers.",
      },
    },
    required: ["title", "slug", "summary", "tags", "body"],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Auth guard: require an authenticated admin or editor — this endpoint
    // calls a paid LLM API and must not be reachable by anonymous users.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const allowed = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "editor",
    );
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, contentType } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

    const contentTypeInstruction = contentType === "white_paper"
      ? "This is a WHITE PAPER. Write 1,500-2,500 words with clearly defined sections, supporting data, and a formal conclusion with recommendations."
      : "This is a BLOG POST. Write 600-900 words.";

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `${contentTypeInstruction}\n\n${prompt}` }],
        tools: [ARTICLE_TOOL],
        tool_choice: { type: "tool", name: "write_article" },
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
    const toolUse = data.content?.find((block: { type: string }) => block.type === "tool_use");

    if (!toolUse?.input) {
      return new Response(
        JSON.stringify({ error: "AI returned no structured output. Try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(toolUse.input), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("generate-content error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
