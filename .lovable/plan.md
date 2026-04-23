## Plan: Add Blog to nav + upgrade Admin to real auth

### Part A — Surface the Blog in navbar & footer

1. **`src/config/routes.ts`**
   - Add `{ label: "Blog", to: "/blog" }` to `marketingRoutes`, placed between "Pricing" and "Contact" (Blog is content, Contact stays last as the conversion endpoint).
   - `footerPlatformRoutes` already filters out Home and Contact, so Blog will automatically appear in the footer "Platform" column. No further change needed there.
   - Active-state matching in `Navbar.tsx` uses `pathname === link.to`, so `/blog/:slug` post pages won't highlight the Blog tab. Update the active check to also match when `pathname.startsWith(link.to + "/")` for non-root routes, so Blog stays highlighted on post detail pages.

2. **`public/sitemap.xml`** — confirm `/blog` is already listed (it is, from the previous pass). No change.

### Part B — Replace v0 password gate with real Lovable Cloud auth + roles

Goal: replace the `VITE_ADMIN_PASSWORD` client-side gate with proper email/password authentication and a server-enforced `admin` role, following the security pattern (separate `user_roles` table + `has_role` SECURITY DEFINER function + RLS).

#### Database migration

1. Create enum `public.app_role` with value `admin` (extensible later: `moderator`, `user`).
2. Create table `public.user_roles` (`id`, `user_id` → `auth.users`, `role app_role`, unique on `(user_id, role)`).
3. Enable RLS on `user_roles`. Policies:
   - SELECT: users can read their own roles (`auth.uid() = user_id`).
   - No public INSERT/UPDATE/DELETE — roles are managed manually via the backend for v1.
4. Create `public.has_role(_user_id uuid, _role app_role)` as `SECURITY DEFINER`, `STABLE`, `SET search_path = public`.
5. **Tighten `blog_posts` RLS** — current policies allow anon to read/insert/update/delete everything, which is wide open. Replace the four "Anon can …" admin policies with role-gated equivalents:
   - Keep: `Published posts are viewable by everyone` (unchanged).
   - Drop: the four anon admin policies.
   - Add: `Admins can SELECT all`, `Admins can INSERT`, `Admins can UPDATE`, `Admins can DELETE`, each `using/with check (public.has_role(auth.uid(), 'admin'))`.

#### Auth configuration

- Use `configure_auth` to enable auto-confirm signups (so the first admin can be bootstrapped without email verification friction during setup). The user can toggle this off later if desired.
- Email/password only for v1 (no Google OAuth — admin surface is internal).

#### Frontend

1. **Replace** `src/lib/adminAuth.ts` (delete the password-flag implementation) with a small `useAdminAuth` hook in `src/hooks/useAdminAuth.ts` that:
   - Subscribes to `supabase.auth.onAuthStateChange` first, then calls `getSession()`.
   - For each session, queries `user_roles` to determine if the current user has the `admin` role.
   - Returns `{ session, user, isAdmin, loading, signOut }`.

2. **New page** `src/pages/admin/AdminLogin.tsx`
   - Email + password form (sign in only — no public sign-up form, since signup is gated by needing a role assigned afterwards).
   - On success, redirect to `/admin`.
   - Show clear error messages for invalid credentials.
   - Include a small note: "Need an admin account? Contact the site owner." (No public self-serve admin signup.)

3. **Rewrite** `src/components/AdminGate.tsx`
   - Uses `useAdminAuth`.
   - While `loading`: show a spinner.
   - If no session: redirect to `/admin/login`.
   - If session but `!isAdmin`: show "You're signed in as `<email>` but don't have admin access" with a Sign Out button.
   - If admin: render children.

4. **`src/pages/admin/AdminDashboard.tsx`** — add the signed-in user email and a Sign Out button in the header.

5. **`src/App.tsx`** — register the new `/admin/login` route (public, not wrapped in `AdminGate`).

6. **Delete** `src/lib/adminAuth.ts` after the gate no longer imports it.

#### Bootstrapping the first admin

Since there's no public admin signup, the user will need to:
1. Visit `/admin/login` — but they have no account yet. Add a one-time "Create initial admin account" sign-up form on the login page that is **only visible when the `user_roles` table has zero admin rows** (checked via a public RPC or a count query against a view). Once any admin exists, the form disappears and only sign-in is available.
2. Alternative simpler approach: provide a one-time SQL snippet in the migration's accompanying note that the user runs to grant themselves admin after they sign up via Supabase auth directly. We'll go with the **first approach** (in-app bootstrap) since it's friendlier.

Implementation detail for bootstrap: create a SECURITY DEFINER function `public.bootstrap_first_admin(_user_id uuid)` that inserts into `user_roles` only if no admin currently exists, and is callable by `authenticated` role. The login page calls this immediately after the bootstrap signup completes.

#### Files touched

- **Migration (new)**: app_role enum, user_roles table + RLS, has_role function, bootstrap_first_admin function, updated blog_posts policies.
- **Created**: `src/hooks/useAdminAuth.ts`, `src/pages/admin/AdminLogin.tsx`.
- **Rewritten**: `src/components/AdminGate.tsx`, `src/pages/admin/AdminDashboard.tsx` (add signout).
- **Edited**: `src/config/routes.ts` (add Blog), `src/components/Navbar.tsx` (active-state matcher), `src/App.tsx` (register `/admin/login`).
- **Deleted**: `src/lib/adminAuth.ts`.

### What you'll be able to do after this

- Visitors see a "Blog" link in the navbar (between Pricing and Contact) and in the footer Platform column. The link stays highlighted when reading individual posts.
- Visiting `/admin` for the first time prompts you to create the initial admin account (email + password). After that account is created, the bootstrap form disappears and only sign-in is available.
- Subsequent admins are added by an existing admin running an INSERT into `user_roles` (or we can add an admin user-management page in a later pass — out of scope here).
- The `blog_posts` table is now properly locked down: only authenticated users with the `admin` role can create, update, or delete posts. Public reads remain limited to `status = 'published'`.

### Notes / caveats

- This removes `VITE_ADMIN_PASSWORD` entirely — that env var becomes obsolete and can be deleted from project settings after the migration.
- Existing draft posts in the DB remain; only the access control changes.
- Email auto-confirm will be enabled to make initial setup smooth. If you'd prefer email verification before first login, say so and I'll skip that step (you'll then need to confirm via the magic link in your inbox).