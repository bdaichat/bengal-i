CREATE OR REPLACE FUNCTION public.shares_team(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members m1
    JOIN public.team_members m2 ON m1.team_id = m2.team_id
    WHERE m1.user_id = _a AND m2.user_id = _b
  )
$$;

CREATE POLICY "Teammates can view shared profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.shares_team(auth.uid(), user_id));