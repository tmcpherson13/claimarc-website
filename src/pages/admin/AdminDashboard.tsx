import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Image as ImageIcon, User } from "lucide-react";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { contentApi, type ContentItem, type PostStatus } from "@/lib/contentApi";

const statusPillClasses: Record<PostStatus, string> = {
  published: "bg-[var(--emerald)]/15 text-[var(--emerald)]",
  draft: "bg-slate-200 text-slate-600",
  scheduled: "bg-amber-100 text-amber-700",
  archived: "bg-slate-100 text-slate-500",
};

const formatRelative = (iso: string) => {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const sec = Math.max(1, Math.round(diff / 1000));
  if (sec < 60) return `Updated ${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `Updated ${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `Updated ${hr} hr ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `Updated ${day} day${day === 1 ? "" : "s"} ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `Updated ${mo} mo ago`;
  return `Updated ${Math.round(mo / 12)} yr ago`;
};

const StatCard = ({ label, value, sub }: { label: string; value: number; sub: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5">
    <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
    <p className="text-[var(--navy)] font-bold text-3xl mt-1">{value}</p>
    <p className="text-slate-400 text-xs mt-1">{sub}</p>
  </div>
);

const NavCard = ({
  to,
  Icon,
  title,
  desc,
}: {
  to: string;
  Icon: typeof FileText;
  title: string;
  desc: string;
}) => (
  <Link
    to={to}
    className="block p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
  >
    <Icon className="h-6 w-6 text-[var(--emerald)]" />
    <p className="font-semibold text-[var(--navy)] mt-3">{title}</p>
    <p className="text-sm text-slate-500 mt-1">{desc}</p>
  </Link>
);

const DashboardInner = () => {
  const { isAdmin } = useAdminAuth();
  const [items, setItems] = useState<ContentItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    contentApi
      .listAll()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load content");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const list = items ?? [];
    return {
      published: list.filter((i) => i.status === "published").length,
      draft: list.filter((i) => i.status === "draft").length,
      scheduled: list.filter((i) => i.status === "scheduled").length,
      total: list.length,
    };
  }, [items]);

  const recent = useMemo(() => {
    const list = items ?? [];
    return [...list]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [items]);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[var(--navy)]">Dashboard</h2>
          {isAdmin && (
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--emerald)]">
              Admin
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard label="Published" value={stats.published} sub="Live on the site" />
          <StatCard label="Drafts" value={stats.draft} sub="In progress" />
          <StatCard label="Scheduled" value={stats.scheduled} sub="Queued to publish" />
          <StatCard label="All content" value={stats.total} sub="Across all states" />
        </div>

        {/* Quick actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 bg-[var(--emerald)] hover:bg-emerald-600 text-white px-5 py-2.5 rounded font-semibold text-sm transition-colors"
          >
            + New Content
          </Link>
        </div>

        {/* Recent content */}
        <section className="mt-8">
          <h3 className="text-[var(--navy)] font-bold text-lg mb-4">Recent Content</h3>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {items === null && !error && (
              <div className="px-5 py-8 text-sm text-slate-400">Loading…</div>
            )}
            {error && (
              <div className="px-5 py-8 text-sm text-red-600">{error}</div>
            )}
            {items !== null && recent.length === 0 && !error && (
              <div className="px-5 py-8 text-sm text-slate-400">No content yet.</div>
            )}
            {recent.map((item) => (
              <Link
                key={item.id}
                to={`/admin/content/${item.id}`}
                className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-4">
                  <p className="font-medium text-[var(--navy)] truncate">{item.title || "Untitled"}</p>
                  <p className="text-xs text-slate-400 truncate">/{item.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusPillClasses[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {formatRelative(item.updatedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NavCard
            to="/admin/content"
            Icon={FileText}
            title="Content"
            desc="Blog posts and white papers — draft, schedule, publish, archive."
          />
          <NavCard
            to="/admin/assets"
            Icon={ImageIcon}
            title="Assets"
            desc="Upload and manage images and downloadable PDFs."
          />
          <NavCard
            to="/admin/profile"
            Icon={User}
            title="My profile"
            desc="Set your display name, role, and avatar — used as your byline on articles."
          />
        </div>
      </div>
    </AdminLayout>
  );
};

const AdminDashboard = () => (
  <AdminGate>
    <DashboardInner />
  </AdminGate>
);

export default AdminDashboard;
