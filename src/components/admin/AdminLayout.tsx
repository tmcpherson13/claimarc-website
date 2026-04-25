import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, FileEdit, Image as ImageIcon, User } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AI3 from "@/components/AI3";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/content", label: "Content", icon: FileText, end: false },
  { to: "/admin/about", label: "About Page", icon: FileEdit, end: false },
  { to: "/admin/assets", label: "Assets", icon: ImageIcon, end: false },
  { to: "/admin/profile", label: "My Profile", icon: User, end: false },
];

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const { signOut } = useAdminAuth();
  const { pathname } = useLocation();

  const isActive = (to: string, end: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="flex flex-row min-h-screen">
      <aside className="w-56 shrink-0 bg-[var(--navy)] text-white flex flex-col py-6 sticky top-0 h-screen">
        <Link to="/admin" className="text-white font-bold text-base px-5 mb-8 hover:text-[var(--emerald)] transition-colors">
          ZDefense <AI3 />
        </Link>
        <nav className="space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => {
            const active = isActive(to, end);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-3 space-y-2">
          <Link to="/" className="block text-white/50 text-xs hover:text-white transition-colors px-3">
            ← Back to site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="block text-white/50 text-xs hover:text-white transition-colors px-3 text-left w-full"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
