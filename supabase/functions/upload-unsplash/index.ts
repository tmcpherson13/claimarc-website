import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const BUCKET = "content-assets";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { photoUrl, downloadLocation, alt, credit } = await req.json();

    if (!photoUrl || typeof photoUrl !== "string") {
      return new Response(JSON.stringify({ error: "photoUrl is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessKey = Deno.env.get("UNSPLASH_ACCESS_KEY");

    // Trigger Unsplash download tracking (required by Unsplash API guidelines)
    if (downloadLocation && accessKey) {
      await fetch(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          "Accept-Version": "v1",
        },
      }).catch(() => {});
    }

    // Identify the calling user (for uploaded_by)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      userId = userData?.user?.id ?? null;
    }

    // Download the image
    const imgResp = await fetch(photoUrl);
    if (!imgResp.ok) throw new Error("Failed to download image");

    const arrayBuffer = await imgResp.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const supabase = createClient(supabaseUrl, serviceKey);

    const fileName = `unsplash/unsplash-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const creditName =
      credit && typeof credit === "object" && typeof credit.name === "string"
        ? credit.name
        : "Unsplash";

    const originalName = `Photo by ${creditName} on Unsplash.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, uint8, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: asset, error: insertError } = await supabase
      .from("assets")
      .insert({
        storage_path: fileName,
        original_name: originalName,
        mime_type: "image/jpeg",
        size_bytes: uint8.byteLength,
        uploaded_by: userId,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        assetId: asset.id,
        alt: typeof alt === "string" ? alt : "",
        credit: { name: creditName },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
