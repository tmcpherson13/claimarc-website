import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import { contentApi, ContentItem, ContentType, PostStatus } from "@/lib/contentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";

const statusLabel: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const statusClass: Record<PostStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  scheduled: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-zinc-200 text-zinc-700",
};

const Inner = () => {
  const { isAdmin } = useAdminAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ContentType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

  const refresh = () => {
    setLoading(true);
    contentApi.listAll().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (typeFilter !== "all" && i.contentType !== typeFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!i.title.toLowerCase().includes(s) && !i.slug.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [items, search, typeFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    try {
      await contentApi.remove(id);
      toast({ title: "Deleted" });
      refresh();
    } catch (e: unknown) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[var(--navy)] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/admin" className="text-lg font-semibold hover:text-[var(--emerald)]">
            ZDefense Admin
          </Link>
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-[var(--navy)]">Content</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[var(--emerald)] hover:bg-emerald-600">
                + New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/admin/content/new?type=blog">Blog post</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/content/new?type=white_paper">White paper</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by title or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | ContentType)}
            className="h-10 rounded border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="all">All types</option>
            <option value="blog">Blog</option>
            <option value="white_paper">White paper</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | PostStatus)}
            className="h-10 rounded border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-lg overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500 text-sm">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">No items.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Scheduled / Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium text-[var(--navy)]">
                      {i.title}
                      <p className="text-[10px] text-slate-400 font-normal">/{i.slug}</p>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {i.contentType === "blog" ? "Blog" : "White paper"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs ${statusClass[i.status]}`}
                      >
                        {statusLabel[i.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      {i.featured ? "★" : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {new Date(i.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {i.status === "scheduled" && i.scheduledFor
                        ? new Date(i.scheduledFor).toLocaleString()
                        : i.publishedAt
                          ? new Date(i.publishedAt).toLocaleDateString()
                          : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-3">
                      <Link
                        to={`/admin/content/${i.id}`}
                        className="text-[var(--emerald)] hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(i.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

const AdminContentList = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminContentList;
