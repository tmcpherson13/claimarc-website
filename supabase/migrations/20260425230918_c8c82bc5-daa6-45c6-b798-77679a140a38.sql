-- Audit log for content publish/unpublish/archive actions, with checklist
-- acknowledgements captured at the moment of publish.

CREATE TABLE public.content_publish_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  actor_id UUID,
  action TEXT NOT NULL CHECK (action IN ('publish', 'unpublish', 'archive')),
  from_status public.post_status,
  to_status public.post_status NOT NULL,
  ack_preview BOOLEAN NOT NULL DEFAULT FALSE,
  ack_hero BOOLEAN NOT NULL DEFAULT FALSE,
  ack_seo BOOLEAN NOT NULL DEFAULT FALSE,
  hero_override BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_publish_audit_content_id
  ON public.content_publish_audit(content_id, created_at DESC);

ALTER TABLE public.content_publish_audit ENABLE ROW LEVEL SECURITY;

-- Admins and editors can read the full audit trail
CREATE POLICY "Admins and editors can read audit log"
  ON public.content_publish_audit
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'editor'::public.app_role)
  );

-- Admins and editors can write audit entries; actor_id must match the caller
CREATE POLICY "Admins and editors can insert audit entries"
  ON public.content_publish_audit
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (public.has_role(auth.uid(), 'admin'::public.app_role)
     OR public.has_role(auth.uid(), 'editor'::public.app_role))
    AND actor_id = auth.uid()
  );

-- No updates or deletes allowed (immutable audit log)