DO $$ BEGIN
  CREATE TYPE public.content_type AS ENUM ('blog', 'white_paper');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL DEFAULT 0,
  original_name text NOT NULL,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets are viewable by everyone" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Admins and editors can insert assets" ON public.assets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));
CREATE POLICY "Admins and editors can update assets" ON public.assets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));
CREATE POLICY "Admins can delete assets" ON public.assets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop legacy text-based check before retyping status
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_status_check;
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_slug_key;

ALTER TABLE public.blog_posts RENAME TO content_items;

DROP POLICY IF EXISTS "Admins can delete posts" ON public.content_items;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.content_items;
DROP POLICY IF EXISTS "Admins can read all posts" ON public.content_items;
DROP POLICY IF EXISTS "Admins can update posts" ON public.content_items;
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.content_items;

ALTER TABLE public.content_items
  ADD COLUMN content_type public.content_type NOT NULL DEFAULT 'blog'::public.content_type,
  ADD COLUMN featured boolean NOT NULL DEFAULT false,
  ADD COLUMN cta_type text NOT NULL DEFAULT 'demo',
  ADD COLUMN hero_asset_id uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN pdf_asset_id uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN author_id uuid,
  ADD COLUMN related_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  ADD COLUMN scheduled_for timestamptz;

ALTER TABLE public.content_items
  ADD CONSTRAINT content_items_cta_type_check CHECK (cta_type IN ('demo', 'trial', 'none'));

ALTER TABLE public.content_items ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.content_items
  ALTER COLUMN status TYPE public.post_status
  USING (
    CASE
      WHEN status = 'published' THEN 'published'::public.post_status
      WHEN status = 'scheduled' THEN 'scheduled'::public.post_status
      WHEN status = 'archived' THEN 'archived'::public.post_status
      ELSE 'draft'::public.post_status
    END
  );
ALTER TABLE public.content_items ALTER COLUMN status SET DEFAULT 'draft'::public.post_status;

CREATE UNIQUE INDEX IF NOT EXISTS content_items_type_slug_unique
  ON public.content_items (content_type, slug);

CREATE POLICY "Published content is viewable by everyone" ON public.content_items FOR SELECT
  USING (status = 'published'::public.post_status);
CREATE POLICY "Admins and editors can read all content" ON public.content_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));
CREATE POLICY "Admins and editors can insert content" ON public.content_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));
CREATE POLICY "Admins and editors can update content" ON public.content_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));
CREATE POLICY "Admins can delete content" ON public.content_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.enforce_editor_status_limits()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN RETURN NEW; END IF;
  IF public.has_role(auth.uid(), 'editor'::public.app_role) THEN
    IF NEW.status NOT IN ('draft'::public.post_status, 'scheduled'::public.post_status) THEN
      RAISE EXCEPTION 'Editors cannot set status to %', NEW.status;
    END IF;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Insufficient permissions';
END;
$$;

CREATE TRIGGER trg_enforce_editor_status_limits_ins
  BEFORE INSERT ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_editor_status_limits();
CREATE TRIGGER trg_enforce_editor_status_limits_upd
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_editor_status_limits();

CREATE TRIGGER trg_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  edited_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_content_revisions_content_id_created
  ON public.content_revisions (content_id, created_at DESC);
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and editors can read revisions" ON public.content_revisions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role));

CREATE OR REPLACE FUNCTION public.snapshot_content_revision()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.content_revisions (content_id, snapshot, edited_by)
  VALUES (OLD.id, to_jsonb(OLD), auth.uid());
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_snapshot_content_revision
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content_revision();

INSERT INTO storage.buckets (id, name, public)
VALUES ('content-assets', 'content-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Content assets are publicly readable" ON storage.objects;
CREATE POLICY "Content assets are publicly readable" ON storage.objects FOR SELECT
  USING (bucket_id = 'content-assets');

DROP POLICY IF EXISTS "Admins and editors can upload content assets" ON storage.objects;
CREATE POLICY "Admins and editors can upload content assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'content-assets'
    AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role)));

DROP POLICY IF EXISTS "Admins and editors can update content assets" ON storage.objects;
CREATE POLICY "Admins and editors can update content assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'content-assets'
    AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role)));

DROP POLICY IF EXISTS "Admins can delete content assets" ON storage.objects;
CREATE POLICY "Admins can delete content assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'content-assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.publish_scheduled_content()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.content_items
  SET status = 'published'::public.post_status,
      published_at = COALESCE(published_at, scheduled_for, now())
  WHERE status = 'scheduled'::public.post_status
    AND scheduled_for IS NOT NULL
    AND scheduled_for <= now();
$$;

DO $$
DECLARE _jobid bigint;
BEGIN
  SELECT jobid INTO _jobid FROM cron.job WHERE jobname = 'publish-scheduled-content';
  IF _jobid IS NOT NULL THEN PERFORM cron.unschedule(_jobid); END IF;
  PERFORM cron.schedule(
    'publish-scheduled-content',
    '*/5 * * * *',
    $cron$ SELECT public.publish_scheduled_content(); $cron$
  );
END $$;