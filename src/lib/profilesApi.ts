import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  displayName: string | null;
  roleTitle: string | null;
  avatarAssetId: string | null;
  updatedAt: string;
}

interface Row {
  id: string;
  display_name: string | null;
  role_title: string | null;
  avatar_asset_id: string | null;
  updated_at: string;
}

const fromRow = (r: Row): Profile => ({
  id: r.id,
  displayName: r.display_name,
  roleTitle: r.role_title,
  avatarAssetId: r.avatar_asset_id,
  updatedAt: r.updated_at,
});

// Tiny in-memory cache so a page with several bylines hits the network once.
const cache = new Map<string, Profile | null>();

export const profilesApi = {
  async get(id: string): Promise<Profile | null> {
    if (cache.has(id)) return cache.get(id)!;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      cache.set(id, null);
      return null;
    }
    const p = data ? fromRow(data as unknown as Row) : null;
    cache.set(id, p);
    return p;
  },

  async getMine(): Promise<Profile | null> {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return null;
    return profilesApi.get(uid);
  },

  async upsertMine(input: {
    displayName: string;
    roleTitle: string;
    avatarAssetId: string | null;
  }): Promise<Profile> {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) throw new Error("Not signed in");
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: uid,
          display_name: input.displayName,
          role_title: input.roleTitle,
          avatar_asset_id: input.avatarAssetId,
        },
        { onConflict: "id" },
      )
      .select()
      .single();
    if (error) throw error;
    const p = fromRow(data as unknown as Row);
    cache.set(uid, p);
    return p;
  },
};
