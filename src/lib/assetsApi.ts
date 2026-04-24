import { supabase } from "@/integrations/supabase/client";

export interface Asset {
  id: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  originalName: string;
  uploadedBy: string | null;
  createdAt: string;
  publicUrl: string;
}

const BUCKET = "content-assets";

const publicUrlFor = (path: string) =>
  supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

interface Row {
  id: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  original_name: string;
  uploaded_by: string | null;
  created_at: string;
}

const fromRow = (r: Row): Asset => ({
  id: r.id,
  storagePath: r.storage_path,
  mimeType: r.mime_type,
  sizeBytes: r.size_bytes,
  originalName: r.original_name,
  uploadedBy: r.uploaded_by,
  createdAt: r.created_at,
  publicUrl: publicUrlFor(r.storage_path),
});

export const assetsApi = {
  async list(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data as unknown) as Row[]).map(fromRow);
  },

  async getMany(ids: string[]): Promise<Record<string, Asset>> {
    if (ids.length === 0) return {};
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .in("id", ids);
    if (error) throw error;
    const map: Record<string, Asset> = {};
    for (const r of (data as unknown) as Row[]) map[r.id] = fromRow(r);
    return map;
  },

  async upload(file: File): Promise<Asset> {
    const session = (await supabase.auth.getSession()).data.session;
    const userId = session?.user?.id;
    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const path = `${userId ?? "anon"}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw upErr;
    const { data, error } = await supabase
      .from("assets")
      .insert({
        storage_path: path,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        original_name: file.name,
        uploaded_by: userId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return fromRow((data as unknown) as Row);
  },

  async remove(asset: Asset): Promise<void> {
    await supabase.storage.from(BUCKET).remove([asset.storagePath]);
    const { error } = await supabase.from("assets").delete().eq("id", asset.id);
    if (error) throw error;
  },

  publicUrl: publicUrlFor,
};
