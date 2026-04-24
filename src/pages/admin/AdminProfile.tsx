import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "@/components/AdminGate";
import AssetPicker from "@/components/admin/AssetPicker";
// AssetPicker has its own trigger button; we render it inline.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profilesApi } from "@/lib/profilesApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";

const Inner = () => {
  const { user } = useAdminAuth();
  const [displayName, setDisplayName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profilesApi
      .getMine()
      .then((p) => {
        if (p) {
          setDisplayName(p.displayName ?? "");
          setRoleTitle(p.roleTitle ?? "");
          setAvatarId(p.avatarAssetId);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!avatarId) {
      setAvatar(null);
      return;
    }
    assetsApi.getMany([avatarId]).then((m) => setAvatar(m[avatarId] ?? null));
  }, [avatarId]);

  const save = async () => {
    setSaving(true);
    try {
      await profilesApi.upsertMine({
        displayName: displayName.trim(),
        roleTitle: roleTitle.trim(),
        avatarAssetId: avatarId,
      });
      toast({ title: "Profile saved" });
    } catch (e) {
      toast({
        title: "Save failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[var(--navy)] text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">My profile</h1>
          <Link to="/admin" className="text-sm text-white/70 hover:text-white">
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="font-medium text-[var(--navy)]">{user?.email}</p>
            </div>
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Shown as the byline on articles you author.
              </p>
            </div>
            <div>
              <Label htmlFor="roleTitle">Role / title</Label>
              <Input
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Director of Revenue Cycle Strategy"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Avatar</Label>
              <div className="mt-2 flex items-start gap-4">
                {avatar ? (
                  <img
                    src={avatar.publicUrl}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[var(--navy)] text-white font-semibold flex items-center justify-center text-xl">
                    {(displayName || user?.email || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <AssetPicker
                    value={avatarId}
                    onChange={setAvatarId}
                    accept="image/"
                    label="Avatar image"
                  />
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AdminProfile = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminProfile;
