import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface State {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const initial: State = { session: null, user: null, isAdmin: false, loading: true };

export const useAdminAuth = () => {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    let active = true;

    const checkAdmin = async (userId: string): Promise<boolean> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        // RLS prevents reading other users' roles; missing row just means not admin.
        return false;
      }
      return !!data;
    };

    const apply = async (session: Session | null) => {
      if (!active) return;
      if (!session?.user) {
        setState({ session: null, user: null, isAdmin: false, loading: false });
        return;
      }
      // Defer the role lookup so we don't block the auth callback.
      setState({ session, user: session.user, isAdmin: false, loading: true });
      setTimeout(async () => {
        const isAdmin = await checkAdmin(session.user.id);
        if (!active) return;
        setState({ session, user: session.user, isAdmin, loading: false });
      }, 0);
    };

    // Subscribe FIRST, then check current session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });

    supabase.auth.getSession().then(({ data }) => apply(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signOut };
};
