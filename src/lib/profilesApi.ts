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

// In-memory cache + subscriber list so updates propagate live to any mounted
// BylineRow / ContentCard without a hard reload.
const cache = new Map<string, Profile | null>();
type Listener = (id: string, profile: Profile | null) => void;
const listeners = new Set<Listener>();

const notify = (id: string, profile: Profile | null) => {
  for (const l of listeners) l(id, profile);
};

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
    notify(uid, p);
    return p;
  },

  /** Drop a single id (or all) from cache and notify subscribers. */
  invalidate(id?: string) {
    if (id) {
      cache.delete(id);
      notify(id, null);
    } else {
      const ids = [...cache.keys()];
      cache.clear();
      for (const i of ids) notify(i, null);
    }
  },

  /** Subscribe to profile updates. Returns an unsubscribe fn. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
