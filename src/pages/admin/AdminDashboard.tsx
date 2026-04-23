import { Link } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

const DashboardInner = () => {
  const { user, isAdmin, signOut } = useAdminAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[var(--navy)] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold">ZDefense Admin</h1>
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden sm:inline-flex items-center gap-2 text-xs text-white/70">
                <span>{user.email}</span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--emerald)]/20 text-[var(--emerald)] font-semibold uppercase tracking-wide">
                  {isAdmin ? "Admin" : "Member"}
                </span>
              </span>
            )}
            <Link to="/" className="text-sm text-white/70 hover:text-white">← Back to site</Link>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--navy)]">Dashboard</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/blog"
            className="block p-6 bg-white border border-slate-200 rounded-lg hover:border-[var(--emerald)] transition-colors"
          >
            <p className="font-semibold text-[var(--navy)]">Blog posts</p>
            <p className="text-sm text-slate-500 mt-1">Create, edit, publish, and unpublish posts.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminGate>
    <DashboardInner />
  </AdminGate>
);

export default AdminDashboard;
