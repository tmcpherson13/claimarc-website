-- =============================================================================
-- Security + UX fixes
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Fix site_pages: replace open anon write policies with role-gated ones
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anon can update site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Anon can insert site pages" ON public.site_pages;

CREATE POLICY "Admins can update site pages"
  ON public.site_pages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert site pages"
  ON public.site_pages FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ---------------------------------------------------------------------------
-- 2. Contact form submissions table
--    Anon users can INSERT (submit a form); only admins can SELECT.
--    No UPDATE or DELETE for anyone (immutable lead record).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name      text        NOT NULL,
  last_name       text        NOT NULL,
  email           text        NOT NULL,
  organization    text        NOT NULL,
  role            text        NOT NULL,
  org_type        text,
  claim_volume    text,
  primary_challenge text,
  offer_type      text,
  interested_in_trial boolean NOT NULL DEFAULT false,
  selected_payers text[]      NOT NULL DEFAULT '{}',
  other_payer     text,
  message         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ---------------------------------------------------------------------------
-- 3. Chat rate-limit tables for shared, instance-safe limiting
--    Edge functions connect via the service role and bypass RLS,
--    so we don't need policies here — just lock out direct anon access.
-- ---------------------------------------------------------------------------

-- Per-session message counter (replaces the in-memory `sessions` Map)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  session_id  text        PRIMARY KEY,
  msg_count   int         NOT NULL DEFAULT 0,
  first_seen  timestamptz NOT NULL DEFAULT now(),
  last_seen   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
-- No public access — the edge function uses the service role key.

-- Per-IP session counter (replaces the in-memory `IP_SESSIONS` Map)
CREATE TABLE IF NOT EXISTS public.chat_ip_limits (
  ip_address   text        PRIMARY KEY,
  sess_count   int         NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_ip_limits ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4. Atomic RPC: check + increment a chat session message count.
--    Returns (allowed bool, count int).
--    Resets the counter automatically when the TTL has expired.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_session_check(
  p_session_id  text,
  p_max_msgs    int  DEFAULT 10,
  p_ttl_secs    int  DEFAULT 1800   -- 30 min
)
RETURNS TABLE (allowed boolean, msg_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count  int;
  v_first  timestamptz;
BEGIN
  -- Upsert: create a fresh row or bump the counter on the existing one.
  -- If the existing session has expired, reset it as if it were new.
  INSERT INTO public.chat_sessions (session_id, msg_count, first_seen, last_seen)
  VALUES (p_session_id, 1, now(), now())
  ON CONFLICT (session_id) DO UPDATE SET
    msg_count  = CASE
                   WHEN now() - chat_sessions.first_seen > (p_ttl_secs || ' seconds')::interval
                   THEN 1
                   ELSE chat_sessions.msg_count + 1
                 END,
    first_seen = CASE
                   WHEN now() - chat_sessions.first_seen > (p_ttl_secs || ' seconds')::interval
                   THEN now()
                   ELSE chat_sessions.first_seen
                 END,
    last_seen  = now()
  RETURNING chat_sessions.msg_count, chat_sessions.first_seen
    INTO v_count, v_first;

  IF v_count > p_max_msgs THEN
    -- Clamp the stored value so it doesn't grow unboundedly.
    UPDATE public.chat_sessions SET msg_count = p_max_msgs WHERE session_id = p_session_id;
    RETURN QUERY SELECT false, p_max_msgs;
  ELSE
    RETURN QUERY SELECT true, v_count;
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Atomic RPC: check + increment a per-IP session count (hourly window).
--    Returns true when the IP is within the allowed limit.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_ip_check(
  p_ip          text,
  p_max_sess    int  DEFAULT 5,
  p_window_secs int  DEFAULT 3600   -- 1 hour
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  INSERT INTO public.chat_ip_limits (ip_address, sess_count, window_start)
  VALUES (p_ip, 1, now())
  ON CONFLICT (ip_address) DO UPDATE SET
    sess_count   = CASE
                     WHEN now() - chat_ip_limits.window_start > (p_window_secs || ' seconds')::interval
                     THEN 1
                     ELSE chat_ip_limits.sess_count + 1
                   END,
    window_start = CASE
                     WHEN now() - chat_ip_limits.window_start > (p_window_secs || ' seconds')::interval
                     THEN now()
                     ELSE chat_ip_limits.window_start
                   END
  RETURNING chat_ip_limits.sess_count INTO v_count;

  RETURN v_count <= p_max_sess;
END;
$$;
