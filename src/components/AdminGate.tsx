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
        <p className="mt-1 text-sm text-slate-500">Enter the admin password to continue.</p>
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
