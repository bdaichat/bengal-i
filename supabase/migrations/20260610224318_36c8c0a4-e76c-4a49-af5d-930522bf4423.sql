-- ============ ROLES FOUNDATION ============
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-assign the 'member' role on signup (extends existing profile trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ============ TEAMS ============
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_invitations TO authenticated;
GRANT ALL ON public.team_invitations TO service_role;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Security-definer helpers (avoid RLS recursion across team tables)
CREATE OR REPLACE FUNCTION public.is_team_member(_team_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = _team_id AND user_id = _user_id)
      OR EXISTS (SELECT 1 FROM public.teams WHERE id = _team_id AND owner_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_team_owner(_team_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.teams WHERE id = _team_id AND owner_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.has_team_invite(_team_id uuid, _email text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_invitations
    WHERE team_id = _team_id AND lower(email) = lower(_email) AND status = 'pending'
  )
$$;

-- Add team owner as a member automatically
CREATE OR REPLACE FUNCTION public.handle_new_team()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (team_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_team_created AFTER INSERT ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_team();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- teams policies
CREATE POLICY "Members can view their teams" ON public.teams
  FOR SELECT TO authenticated USING (public.is_team_member(id, auth.uid()));
CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their teams" ON public.teams
  FOR UPDATE TO authenticated USING (public.is_team_owner(id, auth.uid()));
CREATE POLICY "Owners can delete their teams" ON public.teams
  FOR DELETE TO authenticated USING (public.is_team_owner(id, auth.uid()));

-- team_members policies
CREATE POLICY "Members can view team membership" ON public.team_members
  FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()));
CREATE POLICY "Owners or invited users can join" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (
    public.is_team_owner(team_id, auth.uid())
    OR (user_id = auth.uid() AND public.has_team_invite(team_id, auth.jwt() ->> 'email'))
  );
CREATE POLICY "Owners can update membership" ON public.team_members
  FOR UPDATE TO authenticated USING (public.is_team_owner(team_id, auth.uid()));
CREATE POLICY "Owners or self can remove membership" ON public.team_members
  FOR DELETE TO authenticated USING (
    public.is_team_owner(team_id, auth.uid()) OR user_id = auth.uid()
  );

-- team_invitations policies
CREATE POLICY "Owners or invitees can view invitations" ON public.team_invitations
  FOR SELECT TO authenticated USING (
    public.is_team_owner(team_id, auth.uid())
    OR lower(email) = lower(auth.jwt() ->> 'email')
  );
CREATE POLICY "Owners can create invitations" ON public.team_invitations
  FOR INSERT TO authenticated WITH CHECK (
    public.is_team_owner(team_id, auth.uid()) AND invited_by = auth.uid()
  );
CREATE POLICY "Owners or invitees can update invitations" ON public.team_invitations
  FOR UPDATE TO authenticated USING (
    public.is_team_owner(team_id, auth.uid())
    OR lower(email) = lower(auth.jwt() ->> 'email')
  );
CREATE POLICY "Owners can delete invitations" ON public.team_invitations
  FOR DELETE TO authenticated USING (public.is_team_owner(team_id, auth.uid()));

-- ============ PROJECTS: TEAM SHARING ============
ALTER TABLE public.projects ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;
CREATE INDEX idx_projects_team_id ON public.projects(team_id);

DROP POLICY "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view own or team projects" ON public.projects
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id
    OR (team_id IS NOT NULL AND public.is_team_member(team_id, auth.uid()))
  );

DROP POLICY "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update own or team projects" ON public.projects
  FOR UPDATE TO authenticated USING (
    auth.uid() = user_id
    OR (team_id IS NOT NULL AND public.is_team_member(team_id, auth.uid()))
  );