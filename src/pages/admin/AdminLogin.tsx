import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Mode = "signin" | "bootstrap";

const AdminLogin = () => {
  const { session, user, isAdmin, loading, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fromState = (location.state as { from?: { pathname?: string } } | null)?.from;
  const fromPath = fromState?.pathname && fromState.pathname !== "/admin/login" ? fromState.pathname : null;

  const [mode, setMode] = useState<Mode>("signin");
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => {
      setAdminExists(Boolean(data));
      if (!data) setMode("bootstrap");
    });
  }, []);

  // Already signed in as admin → bounce to dashboard or original destination.
  if (!loading && session && isAdmin) {
    return <Navigate to={fromPath || "/admin"} replace />;
  }

  const submit = async (submitMode: Mode) => {
    setErr(null);
    if (!email || !password) {
      setErr("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    setMode(submitMode);
    setBusy(true);
    try {
      if (submitMode === "bootstrap") {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpErr) throw signUpErr;

        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          const { error: siErr } = await supabase.auth.signInWithPassword({ email, password });
          if (siErr) throw siErr;
        }

        const { data: claimed, error: rpcErr } = await supabase.rpc("bootstrap_first_admin");
        if (rpcErr) throw rpcErr;
        if (!claimed) throw new Error("An admin already exists. Sign in instead.");

        toast({ title: "Admin account created" });
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
        onSubmit={(e) => {
          e.preventDefault();
          submit(isBootstrap ? "bootstrap" : "signin");
        }}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-[var(--navy)]">Admin access</h1>
        <p className="mt-1 text-sm text-slate-500">
          {adminExists === false
            ? "No admin exists yet. Create the first admin, or sign in if you already have an account."
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
        <div className="relative mt-1">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete={isBootstrap ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-[var(--navy)]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <div className="mt-6 space-y-2">
          <Button
            type="button"
            disabled={busy}
            onClick={() => submit("signin")}
            className="w-full bg-[var(--emerald)] hover:bg-emerald-600"
          >
            {busy && !isBootstrap ? "Signing in…" : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy || adminExists === true}
            onClick={() => submit("bootstrap")}
            className="w-full"
            title={adminExists ? "An admin already exists" : undefined}
          >
            {busy && isBootstrap ? "Creating admin…" : "Create admin"}
          </Button>
        </div>

        {adminExists === true && (
          <p className="mt-4 text-xs text-slate-500">
            An admin already exists. Use “Sign in”, or ask an existing admin to add your account.
          </p>
        )}
        {adminExists === false && (
          <p className="mt-4 text-xs text-slate-500">
            Tip: “Create admin” works only for the very first account.
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
