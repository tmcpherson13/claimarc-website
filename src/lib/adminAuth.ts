// V0 admin auth: in-memory flag + env-provided password.
// The password is read from `VITE_ADMIN_PASSWORD` at build time.
// If unset, the admin gate is disabled and surfaces a setup message — there
// is intentionally NO fallback password.
// Replace with proper Supabase Auth + role-based RLS before exposing to real
// admin users. The compare runs on the client — this is a lightweight gate,
// not real security.

const ENV_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim() ?? "";

let isAdmin = false;

export const adminAuth = {
  isConfigured: () => ENV_PASSWORD.length > 0,
  isAuthenticated: () => isAdmin,
  attempt: (password: string) => {
    if (!ENV_PASSWORD) return false;
    if (password === ENV_PASSWORD) {
      isAdmin = true;
      return true;
    }
    return false;
  },
  signOut: () => {
    isAdmin = false;
  },
};
