import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import { blogApi, BlogPost, BlogStatus } from "@/lib/blogApi";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Filter = "all" | BlogStatus;

const AdminBlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    blogApi.listAll().then(setPosts).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.status === filter)),
    [posts, filter],
  );

  return (
    <AdminGate>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-[var(--navy)] text-white px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/admin" className="text-lg font-semibold hover:text-[var(--emerald)]">
              ZDefense Admin
            </Link>
            <Link to="/" className="text-sm text-white/70 hover:text-white">← Back to site</Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-[var(--navy)]">Blog posts</h2>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="h-10 rounded border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <Link to="/admin/blog/new">
                <Button className="bg-[var(--emerald)] hover:bg-emerald-600">New Post</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-6 text-slate-500 text-sm">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No posts yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-[var(--navy)]">{p.title}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            p.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{p.tags.join(", ")}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/blog/${p.id}`} className="text-[var(--emerald)] hover:underline text-sm">
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </div>
    </AdminGate>
  );
};

export default AdminBlogList;
