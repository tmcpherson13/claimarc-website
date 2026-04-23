import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Mode = "signin" | "bootstrap";

const AdminLogin = () => {
  const { session, isAdmin, loading } = useAdminAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => {
      setAdminExists(Boolean(data));
      if (!data) setMode("bootstrap");
    });
  }, []);

  // Already signed in as admin → bounce to dashboard.
  if (!loading && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "bootstrap") {
        // 1. sign up the first admin
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpErr) throw signUpErr;

        // 2. ensure a session exists (signUp returns a session when auto-confirm is on)
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          // fall back to explicit sign-in
          const { error: siErr } = await supabase.auth.signInWithPassword({ email, password });
          if (siErr) throw siErr;
        }

        // 3. claim the first-admin role
        const { data: claimed, error: rpcErr } = await supabase.rpc("bootstrap_first_admin");
        if (rpcErr) throw rpcErr;
        if (!claimed) throw new Error("An admin already exists. Sign in instead.");

        toast({ title: "Admin account created" });
        // The auth listener in useAdminAuth will pick up the role and AdminGate will let you in.
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Signed in" });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  const isBootstrap = mode === "bootstrap";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-[var(--navy)]">
          {isBootstrap ? "Create initial admin" : "Admin sign in"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isBootstrap
            ? "No admin exists yet. Create the first admin account."
            : "Sign in with your admin email and password."}
        </p>

        <label className="block mt-6 text-sm font-medium text-[var(--navy)]">Email</label>
        <Input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />

        <label className="block mt-4 text-sm font-medium text-[var(--navy)]">Password</label>
        <Input
          type="password"
          autoComplete={isBootstrap ? "new-password" : "current-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1"
        />

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <Button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-[var(--emerald)] hover:bg-emerald-600"
        >
          {busy ? "Working…" : isBootstrap ? "Create admin & sign in" : "Sign in"}
        </Button>

        {adminExists === false && !isBootstrap && (
          <button
            type="button"
            onClick={() => setMode("bootstrap")}
            className="mt-3 w-full text-xs text-slate-500 hover:text-[var(--navy)]"
          >
            No admin exists yet — create the first one
          </button>
        )}
        {adminExists && (
          <p className="mt-4 text-xs text-slate-500">
            Need an admin account? Ask an existing admin to add you.
          </p>
        )}

        <p className="mt-6 text-xs text-slate-400 text-center">
          <Link to="/" className="hover:text-[var(--navy)]">← Back to site</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
