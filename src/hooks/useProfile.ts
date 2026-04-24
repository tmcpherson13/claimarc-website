import { useEffect, useState } from "react";
import { profilesApi, Profile } from "@/lib/profilesApi";

/**
 * Fetches a profile by id and live-updates when profilesApi receives an
 * `upsertMine` or `invalidate` for that id.
 */
export function useProfile(authorId: string | null | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!authorId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    profilesApi.get(authorId).then((p) => {
      if (!cancelled) setProfile(p);
    });
    const unsub = profilesApi.subscribe((id, next) => {
      if (id !== authorId) return;
      // If the cache was cleared (next === null), re-fetch fresh.
      if (next === null) {
        profilesApi.get(id).then((p) => {
          if (!cancelled) setProfile(p);
        });
      } else {
        setProfile(next);
      }
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, [authorId]);

  return profile;
}
