CREATE OR REPLACE FUNCTION public.grant_admin_role(
  target_email TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID;
  v_caller_is_admin BOOLEAN;
  v_target_id UUID;
  v_already_admin BOOLEAN;
BEGIN
  v_caller_id := auth.uid();
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_caller_id AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT id INTO v_target_id
  FROM auth.users
  WHERE email = lower(trim(target_email));

  IF v_target_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No account found for that email. The user must sign up first.'
    );
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_target_id AND role = 'admin'
  ) INTO v_already_admin;

  IF v_already_admin THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This user is already an admin.'
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_target_id, 'admin');

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_admin_role(
  target_user_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID;
  v_caller_is_admin BOOLEAN;
BEGIN
  v_caller_id := auth.uid();

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_caller_id AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  IF target_user_id = v_caller_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'You cannot remove your own admin access.'
    );
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'admin';

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ur.user_id,
    au.email::TEXT,
    ur.created_at
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_admin_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;