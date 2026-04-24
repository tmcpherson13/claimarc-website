import { useEffect, useMemo, useState } from "react";
import AdminGate from "@/components/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import AssetPicker from "@/components/admin/AssetPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profilesApi } from "@/lib/profilesApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";

const MAX_NAME = 80;
const MAX_TITLE = 120;

const validate = (name: string, title: string) => {
  const errors: { displayName?: string; roleTitle?: string } = {};
  const n = name.trim();
  const t = title.trim();
  if (!n) errors.displayName = "Display name is required.";
  else if (n.length > MAX_NAME) errors.displayName = `Keep it under ${MAX_NAME} characters.`;
  if (t && t.length > MAX_TITLE) errors.roleTitle = `Keep it under ${MAX_TITLE} characters.`;
  return errors;
};

const Skeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 animate-pulse">
    <div>
      <div className="h-3 w-20 bg-slate-200 rounded" />
      <div className="mt-2 h-4 w-48 bg-slate-200 rounded" />
    </div>
    <div>
      <div className="h-3 w-24 bg-slate-200 rounded" />
      <div className="mt-2 h-9 w-full bg-slate-100 rounded" />
    </div>
    <div>
      <div className="h-3 w-20 bg-slate-200 rounded" />
      <div className="mt-2 h-9 w-full bg-slate-100 rounded" />
    </div>
    <div>
      <div className="h-3 w-14 bg-slate-200 rounded" />
      <div className="mt-3 flex gap-4">
        <div className="h-16 w-16 rounded-full bg-slate-200" />
        <div className="flex-1 h-9 bg-slate-100 rounded" />
      </div>
    </div>
    <div className="h-9 w-32 bg-slate-200 rounded" />
  </div>
);

const Inner = () => {
  const { user } = useAdminAuth();
  const [displayName, setDisplayName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

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

  const errors = useMemo(() => validate(displayName, roleTitle), [displayName, roleTitle]);
  const isValid = Object.keys(errors).length === 0;

  const save = async () => {
    setTouched(true);
    if (!isValid) return;
    setSaving(true);
    try {
      await profilesApi.upsertMine({
        displayName: displayName.trim(),
        roleTitle: roleTitle.trim(),
        avatarAssetId: avatarId,
      });
      toast({ title: "Profile saved", description: "Your byline will refresh shortly." });
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
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">My profile</h2>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="font-medium text-[var(--navy)]">{user?.email}</p>
            </div>
            <div>
              <Label htmlFor="displayName">
                Display name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. Jane Doe"
                maxLength={MAX_NAME + 5}
                className="mt-1"
                aria-invalid={touched && !!errors.displayName}
              />
              <div className="mt-1 flex items-center justify-between gap-3">
                <p
                  className={`text-xs ${
                    touched && errors.displayName ? "text-red-600" : "text-slate-500"
                  }`}
                >
                  {touched && errors.displayName
                    ? errors.displayName
                    : "Shown as the byline on articles you author."}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {displayName.trim().length}/{MAX_NAME}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="roleTitle">Role / title</Label>
              <Input
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. Director of Revenue Cycle Strategy"
                maxLength={MAX_TITLE + 5}
                className="mt-1"
                aria-invalid={touched && !!errors.roleTitle}
              />
              <div className="mt-1 flex items-center justify-between gap-3">
                <p
                  className={`text-xs ${
                    touched && errors.roleTitle ? "text-red-600" : "text-slate-500"
                  }`}
                >
                  {touched && errors.roleTitle
                    ? errors.roleTitle
                    : "Optional. Appears under your name on bylines."}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {roleTitle.trim().length}/{MAX_TITLE}
                </span>
              </div>
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
                    maxSizeMb={2}
                    label="Avatar image"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Square images work best. Max 2 MB.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={save} disabled={saving || !isValid}>
                {saving ? "Saving…" : "Save profile"}
              </Button>
              {touched && !isValid && (
                <p className="mt-2 text-xs text-red-600">
                  Please fix the highlighted fields before saving.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const AdminProfile = () => (
  <AdminGate>
    <Inner />
  </AdminGate>
);

export default AdminProfile;
