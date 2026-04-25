import { useEffect, useState, useCallback } from "react";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface AdminRow {
  user_id: string;
  email: string;
  created_at: string;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const AdminUsersPage = () => {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_admins");
    if (error) {
      console.error("list_admins failed", error);
      setAdmins([]);
    } else {
      setAdmins((data as AdminRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const grantAdmin = async () => {
    if (!inviteEmail.trim() || inviting) return;
    setInviting(true);
    setInviteResult(null);
    const { data, error } = await supabase.rpc("grant_admin_role", {
      target_email: inviteEmail.trim().toLowerCase(),
    });
    if (error) {
      setInviteResult({ type: "error", message: error.message });
    } else {
      const result = data as { success: boolean; error?: string };
      if (result?.success) {
        setInviteResult({
          type: "success",
          message: `${inviteEmail} now has admin access.`,
        });
        setInviteEmail("");
        await loadAdmins();
      } else {
        setInviteResult({
          type: "error",
          message: result?.error ?? "Something went wrong.",
        });
      }
    }
    setInviting(false);
  };

  const revokeAdmin = async (userId: string, email: string) => {
    if (userId === user?.id) return;
    const { data, error } = await supabase.rpc("revoke_admin_role", {
      target_user_id: userId,
    });
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    const result = data as { success: boolean; error?: string };
    if (result?.success) {
      toast({ title: `Admin access removed for ${email}` });
      await loadAdmins();
    } else {
      toast({
        title: result?.error ?? "Failed to remove access",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminGate>
      <AdminLayout>
        <div className="max-w-3xl mx-auto px-8 py-10">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--navy)]">Admin Users</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage who has access to the admin panel.
            </p>
          </header>

          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {loading ? (
              <div className="px-5 py-6 text-sm text-slate-500">Loading…</div>
            ) : admins.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">No admins found.</div>
            ) : (
              admins.map((a) => {
                const isYou = a.user_id === user?.id;
                const initial = (a.email?.[0] ?? "?").toUpperCase();
                return (
                  <div
                    key={a.user_id}
                    className="flex items-center px-5 py-4 border-b border-slate-100 last:border-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-[var(--navy)] text-white text-xs font-bold flex items-center justify-center">
                      {initial}
                    </div>
                    <span className="text-sm font-medium text-[var(--navy)] ml-3">
                      {a.email}
                    </span>
                    {isYou && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold ml-2">
                        You
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-2">
                      {formatDate(a.created_at)}
                    </span>
                    <div className="ml-auto">
                      {!isYou && (
                        <button
                          type="button"
                          onClick={() => revokeAdmin(a.user_id, a.email)}
                          className="text-red-400 hover:text-red-600 text-xs hover:underline transition-colors"
                        >
                          Remove access
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 mt-6">
            <h2 className="text-[var(--navy)] font-semibold text-base">
              Grant Admin Access
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              The person must already have a ZDefense admin account. Have them
              visit /admin/login and create an account first — then grant access
              here.
            </p>

            <div className="flex gap-3 mt-4">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    grantAdmin();
                  }
                }}
                className="flex-1"
              />
              <button
                type="button"
                onClick={grantAdmin}
                disabled={inviting || !inviteEmail.trim()}
                className="bg-[var(--emerald)] hover:bg-emerald-600 text-white px-5 py-2 rounded font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {inviting ? "Granting…" : "Grant Access"}
              </button>
            </div>

            {inviteResult && (
              <p
                className={
                  inviteResult.type === "success"
                    ? "text-emerald-600 text-sm mt-3"
                    : "text-red-500 text-sm mt-3"
                }
              >
                {inviteResult.message}
              </p>
            )}
          </section>

          <section className="bg-[var(--lgray)] rounded-xl p-5 mt-4">
            <h3 className="text-[var(--navy)] font-semibold text-sm">
              How to add a partner as admin
            </h3>
            <ol className="text-slate-600 text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>Ask your partner to go to /admin/login</li>
              <li>
                Have them click "Create admin" and set up their account with
                their email and a password
              </li>
              <li>Come back here and enter their email above</li>
              <li>
                Click "Grant Access" — they can now log in with full admin
                privileges
              </li>
            </ol>
          </section>
        </div>
      </AdminLayout>
    </AdminGate>
  );
};

export default AdminUsersPage;
