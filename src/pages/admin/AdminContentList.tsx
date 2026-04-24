import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Archive, Trash2 } from "lucide-react";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { contentApi, ContentItem, ContentType, PostStatus } from "@/lib/contentApi";
import { assetsApi, type Asset } from "@/lib/assetsApi";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [assetMap, setAssetMap] = useState<Record<string, Asset>>({});
  const [pendingDelete, setPendingDelete] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = () => {
    setLoading(true);
    contentApi.listAll().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  // Load hero thumbnails for items that have a heroAssetId
  useEffect(() => {
    const ids = Array.from(
      new Set(items.map((i) => i.heroAssetId).filter((v): v is string => Boolean(v))),
    );
    const missing = ids.filter((id) => !assetMap[id]);
    if (missing.length === 0) return;
    assetsApi
      .getMany(missing)
      .then((map) => setAssetMap((prev) => ({ ...prev, ...map })))
      .catch(() => {});
  }, [items, assetMap]);

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

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await contentApi.remove(pendingDelete.id);
      toast({ title: "Deleted" });
      setPendingDelete(null);
      refresh();
    } catch (e: unknown) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async (item: ContentItem) => {
    const next = item.status === "archived" ? "draft" : "archived";
    const verb = next === "archived" ? "Archive" : "Unarchive";
    if (!confirm(`${verb} "${item.title}"?`)) return;
    try {
      await contentApi.update(item.id, {
        contentType: item.contentType,
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        body: item.body,
        tags: item.tags,
        status: next,
        featured: item.featured,
        ctaType: item.ctaType,
        heroAssetId: item.heroAssetId,
        pdfAssetId: item.pdfAssetId,
        relatedIds: item.relatedIds,
        scheduledFor: item.scheduledFor,
        publishedAt: item.publishedAt,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        canonicalUrl: item.canonicalUrl,
      });
      toast({ title: `${verb}d` });
      refresh();
    } catch (e: unknown) {
      toast({
        title: `${verb} failed`,
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
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
                  <TableHead className="w-[64px]"></TableHead>
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
                {filtered.map((i) => {
                  const heroAsset = i.heroAssetId ? assetMap[i.heroAssetId] : undefined;
                  return (
                    <TableRow key={i.id}>
                      <TableCell>
                        {heroAsset ? (
                          <img
                            src={heroAsset.publicUrl}
                            alt=""
                            className="w-12 h-9 rounded object-cover bg-slate-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                            ZD
                          </div>
                        )}
                      </TableCell>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/content/${i.id}`}
                            title="Edit"
                            aria-label="Edit"
                            className="p-2 rounded text-slate-600 hover:text-[var(--navy)] hover:bg-slate-100 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleArchive(i)}
                            title={i.status === "archived" ? "Unarchive" : "Archive"}
                            aria-label={i.status === "archived" ? "Unarchive" : "Archive"}
                            className="p-2 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => setPendingDelete(i)}
                              title="Permanent delete (admin only)"
                              aria-label="Delete"
                              className="p-2 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete ? (
                <>
                  &ldquo;<span className="font-medium">{pendingDelete.title}</span>&rdquo; will be
                  permanently removed. This cannot be undone — consider archiving instead.
                </>
              ) : (
                "This cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

const AdminContentList = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminContentList;
