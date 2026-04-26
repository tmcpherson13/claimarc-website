-- Lock down site_pages writes to admins only
DROP POLICY IF EXISTS "Anon can insert site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Anon can update site pages" ON public.site_pages;

CREATE POLICY "Admins can insert site pages"
  ON public.site_pages FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update site pages"
  ON public.site_pages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Lock down user_roles: prevent privilege escalation
-- Only admins can modify role assignments (writes already go through SECURITY DEFINER funcs)
CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update user roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- content_revisions: revisions are written via SECURITY DEFINER trigger; restrict deletes to admins
CREATE POLICY "Admins can delete content revisions"
  ON public.content_revisions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));