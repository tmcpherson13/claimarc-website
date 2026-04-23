import { ReactNode, useState } from "react";
import { adminAuth } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminGateProps {
  children: ReactNode;
}

const AdminGate = ({ children }: AdminGateProps) => {
  const [authed, setAuthed] = useState(adminAuth.isAuthenticated());
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  // Env var not set — block access entirely and explain what to do.
  if (!adminAuth.isConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--navy)]">Admin not configured</h1>
          <p className="mt-2 text-sm text-slate-600">
            The admin area is locked because <code className="px-1 py-0.5 rounded bg-slate-100 text-[var(--navy)]">VITE_ADMIN_PASSWORD</code>{" "}
            is not set. There is no fallback password.
          </p>
          <ol className="mt-4 list-decimal list-inside text-sm text-slate-700 space-y-1">
            <li>
              Open <strong>Project&nbsp;→&nbsp;Settings&nbsp;→&nbsp;Environment Variables</strong>.
            </li>
            <li>
              Add a variable named{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 text-[var(--navy)]">VITE_ADMIN_PASSWORD</code>{" "}
              with a strong value.
            </li>
            <li>Republish (or restart the preview) so the variable is baked into the client bundle.</li>
            <li>Reload <code className="px-1 py-0.5 rounded bg-slate-100 text-[var(--navy)]">/admin</code> and sign in.</li>
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            Note: <code>VITE_</code> variables are embedded in the client bundle. This gate is a v0
            convenience — switch to proper auth before granting real admin access.
          </p>
        </div>
      </div>
    );
  }

  if (authed) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAuth.attempt(pw)) {
      setAuthed(true);
      setErr(null);
    } else {
      setErr("Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--navy)]">Admin access</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the password from <code className="px-1 py-0.5 rounded bg-slate-100">VITE_ADMIN_PASSWORD</code>.
        </p>
        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-6"
          autoFocus
        />
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <Button type="submit" className="mt-4 w-full bg-[var(--emerald)] hover:bg-emerald-600">
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default AdminGate;
