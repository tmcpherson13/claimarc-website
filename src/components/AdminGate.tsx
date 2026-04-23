import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

interface AdminGateProps {
  children: ReactNode;
}

const AdminGate = ({ children }: AdminGateProps) => {
  const { session, user, isAdmin, loading, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--navy)]">No admin access</h1>
          <p className="mt-2 text-sm text-slate-600">
            You're signed in as <span className="font-medium">{user?.email}</span>, but this account
            doesn't have the <code className="px-1 py-0.5 rounded bg-slate-100">admin</code> role.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Ask an existing admin to grant you access, or sign in with an admin account.
          </p>
          <Button onClick={signOut} className="mt-6 w-full bg-[var(--emerald)] hover:bg-emerald-600">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGate;
