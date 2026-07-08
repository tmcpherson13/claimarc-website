import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const str = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = str(payload.name, 200);
  const email = str(payload.email, 320);
  const organization = str(payload.organization, 200);
  if (!name || !organization || !EMAIL_RE.test(email)) {
    return json({ error: "Name, organization, and a valid email are required." }, 400);
  }

  // Honeypot — bots fill hidden fields; humans don't.
  if (str(payload.company_website)) return json({ ok: true });

  const record = {
    name,
    email,
    organization,
    role: str(payload.role, 200) || null,
    claim_volume: str(payload.claim_volume ?? payload.volume, 200) || null,
    interest: str(payload.interest ?? payload.service, 200) || null,
    message: str(payload.message, 5000) || null,
    source: str(payload.source, 200) || null,
    user_agent: str(req.headers.get("user-agent"), 500) || null,
  };

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    return json({ error: "Server is not configured to accept submissions yet." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("contact_submissions").insert(record);
  if (error) {
    console.error("Insert failed:", error.message);
    return json({ error: "Could not save your request. Please email us instead." }, 500);
  }

  // Optional: forward to a webhook (Slack, etc.) if configured.
  const webhook = Deno.env.get("CONTACT_WEBHOOK_URL");
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New ClaimARC demo request — ${record.name} (${record.organization}) · ${record.email}${record.interest ? ` · ${record.interest}` : ""}`,
        }),
      });
    } catch (e) {
      console.error("Webhook notify failed:", (e as Error).message);
    }
  }

  // Optional: email the team via Resend when a submission lands.
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const notifyTo = Deno.env.get("CONTACT_NOTIFY_EMAIL") || "info@claimarc.com";
  if (resendKey) {
    try {
      const rows = [
        ["Name", record.name],
        ["Email", record.email],
        ["Organization", record.organization],
        ["Role", record.role],
        ["Claim volume", record.claim_volume],
        ["Interested in", record.interest],
        ["Message", record.message],
        ["Source", record.source],
      ].filter(([, v]) => v);

      const html = `<h2>New ClaimARC contact request</h2><table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
        .join("")}</table>`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ClaimARC Website <onboarding@resend.dev>",
          to: [notifyTo],
          reply_to: record.email,
          subject: `New contact request — ${record.organization}`,
          html,
        }),
      });
      if (!res.ok) {
        console.error("Resend notify failed:", res.status, await res.text());
      }
    } catch (e) {
      console.error("Resend notify failed:", (e as Error).message);
    }
  }

  return json({ ok: true });
});
