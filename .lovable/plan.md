

# Admin login UX improvements

Three small, independent changes to make the admin login flow easier to find and reason about.

## 1. Banner on `/admin/login` showing current auth state

In `src/pages/admin/AdminLogin.tsx`:

- Read `from` location state (set by `AdminGate` when it redirects unauthenticated users — needs a small change there too).
- Render a banner above the form when `session` exists:
  - **Signed in as admin** (green): "You're already signed in as `{email}` with admin access." + button "Go to dashboard" (`/admin`) + "Sign out" link.
  - **Signed in, no admin role** (amber): "You're signed in as `{email}` but this account doesn't have admin access." + "Sign out" button.
  - **Redirected here** (slate, only when `from` is present and no session): "You need to sign in to access `{from.pathname}`. We'll send you back after sign-in."
- After successful sign-in, if `from` is set, navigate there instead of `/admin`.

In `src/components/AdminGate.tsx`:

- When redirecting to `/admin/login`, pass `state={{ from: location }}` via `useLocation()` so the login page knows where to return the user.

## 2. Footer "Admin" link

In `src/components/Footer.tsx`:

- Add a small `Admin` link to the existing **Company** column, pointing to `/admin/login`. Plain text, same styling as the other footer links — no special emphasis. (Pushback: an "admin-only header" link doesn't make sense since we can't show it conditionally on public pages without an auth check on every public route — the footer link is the right call.)

## 3. Sign-out button on admin dashboard

In `src/pages/admin/AdminDashboard.tsx`:

- The header already shows a `Sign out` button via `useAdminAuth().signOut`, but it's styled as a low-contrast outline that's easy to miss. Bump its visibility:
  - Keep the outline variant but increase contrast (white border, white text, hover fills white at 15% opacity — already there) and add a `LogOut` icon from `lucide-react` to the left of the label.
  - On sign-out, redirect to `/admin/login` (currently `signOut` just clears the session; rely on `AdminGate` redirect, which already sends to `/admin/login` — confirmed correct, no change needed beyond the icon + ensuring it stands out).
- Also add a matching sign-out button on the `AdminGate` "no admin access" screen — already present, no change.

## Files

**Edited:**
- `src/pages/admin/AdminLogin.tsx` — banner, return-to-origin redirect.
- `src/components/AdminGate.tsx` — pass `from` location state on redirect.
- `src/components/Footer.tsx` — add `Admin` link to Company column.
- `src/pages/admin/AdminDashboard.tsx` — add `LogOut` icon to existing sign-out button.

**No schema changes. No new files.**

