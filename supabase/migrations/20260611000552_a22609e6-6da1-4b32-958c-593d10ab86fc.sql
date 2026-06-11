-- 1) Restrict project policies to authenticated role
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 2) Restrict chats policies to authenticated role
DROP POLICY IF EXISTS "Users can create their own chats" ON public.chats;
CREATE POLICY "Users can create their own chats"
  ON public.chats FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;
CREATE POLICY "Users can delete their own chats"
  ON public.chats FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
CREATE POLICY "Users can update their own chats"
  ON public.chats FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
CREATE POLICY "Users can view their own chats"
  ON public.chats FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3) Restrict messages policies to authenticated role
DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.messages;
CREATE POLICY "Users can create messages in their chats"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (chat_id IN (SELECT id FROM public.chats WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete messages in their chats" ON public.messages;
CREATE POLICY "Users can delete messages in their chats"
  ON public.messages FOR DELETE TO authenticated
  USING (chat_id IN (SELECT id FROM public.chats WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update messages in their chats" ON public.messages;
CREATE POLICY "Users can update messages in their chats"
  ON public.messages FOR UPDATE TO authenticated
  USING (chat_id IN (SELECT id FROM public.chats WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
CREATE POLICY "Users can view messages in their chats"
  ON public.messages FOR SELECT TO authenticated
  USING (chat_id IN (SELECT id FROM public.chats WHERE user_id = auth.uid()));

-- 4) Restrict profiles policies to authenticated role
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
-- Note: "Teammates can view shared profiles" already covers own + teammate reads for authenticated.

-- 5) Revoke direct EXECUTE on SECURITY DEFINER helper functions.
-- These are only used inside RLS policies / triggers, which do not require
-- the calling role to hold EXECUTE, so the app continues to work.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_team_owner(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_team_invite(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.shares_team(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_team() FROM PUBLIC, anon, authenticated;