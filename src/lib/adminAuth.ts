// V0 admin auth: in-memory flag + env-provided password.
// The password is read from `VITE_ADMIN_PASSWORD` at build time. If not set,
// a development fallback is used so the admin UI is reachable locally.
// Replace with proper Supabase Auth + role-based RLS before exposing to real
// admin users. The compare runs on the client — this is intentionally a
// lightweight gate, not real security.

const FALLBACK_PASSWORD = "zdefense-admin";
const ENV_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "";
const EXPECTED_PASSWORD = ENV_PASSWORD || FALLBACK_PASSWORD;

let isAdmin = false;

export const adminAuth = {
  isAuthenticated: () => isAdmin,
  attempt: (password: string) => {
    if (password === EXPECTED_PASSWORD) {
      isAdmin = true;
      return true;
    }
    return false;
  },
  signOut: () => {
    isAdmin = false;
  },
};
