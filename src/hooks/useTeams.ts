import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface TeamMemberWithProfile {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  status: string;
  created_at: string;
}

export function useTeams() {
  const { user } = useAuthContext();
  const qc = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Team[]> => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, owner_id, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const myInvitesQuery = useQuery({
    queryKey: ["my-invites", user?.email],
    enabled: !!user?.email,
    queryFn: async (): Promise<(TeamInvitation & { teamName: string })[]> => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("id, team_id, email, status, created_at, teams(name)")
        .eq("status", "pending");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        team_id: row.team_id,
        email: row.email,
        status: row.status,
        created_at: row.created_at,
        teamName: (row.teams as { name: string } | null)?.name ?? "Team",
      }));
    },
  });

  const createTeam = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("teams")
        .insert({ name: name.trim(), owner_id: user.id })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teams"] });
      toast({ title: "Team created" });
    },
    onError: () =>
      toast({ title: "Error", description: "Could not create team", variant: "destructive" }),
  });

  const inviteMember = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("team_invitations").insert({
        team_id: teamId,
        email: email.trim().toLowerCase(),
        invited_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["team-invites", vars.teamId] });
      toast({ title: "Invitation sent" });
    },
    onError: (err: unknown) =>
      toast({
        title: "Error",
        description:
          err instanceof Error && err.message.includes("duplicate")
            ? "This email is already invited"
            : "Could not send invitation",
        variant: "destructive",
      }),
  });

  const acceptInvite = useMutation({
    mutationFn: async (invite: { id: string; team_id: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error: joinError } = await supabase
        .from("team_members")
        .insert({ team_id: invite.team_id, user_id: user.id, role: "member" });
      if (joinError) throw joinError;
      const { error: updateError } = await supabase
        .from("team_invitations")
        .update({ status: "accepted" })
        .eq("id", invite.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teams"] });
      qc.invalidateQueries({ queryKey: ["my-invites"] });
      toast({ title: "Joined team" });
    },
    onError: () =>
      toast({ title: "Error", description: "Could not join team", variant: "destructive" }),
  });

  const declineInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from("team_invitations")
        .update({ status: "declined" })
        .eq("id", inviteId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invites"] });
    },
  });

  return {
    teams: teamsQuery.data ?? [],
    teamsLoading: teamsQuery.isLoading,
    myInvites: myInvitesQuery.data ?? [],
    createTeam,
    inviteMember,
    acceptInvite,
    declineInvite,
  };
}

export function useTeamDetail(teamId: string | null) {
  const membersQuery = useQuery({
    queryKey: ["team-members", teamId],
    enabled: !!teamId,
    queryFn: async (): Promise<TeamMemberWithProfile[]> => {
      const { data: members, error } = await supabase
        .from("team_members")
        .select("id, team_id, user_id, role")
        .eq("team_id", teamId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (!members || members.length === 0) return [];

      const userIds = members.map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const byId = new Map(
        (profiles ?? []).map((p) => [p.user_id, p])
      );

      return members.map((m) => ({
        ...m,
        displayName: byId.get(m.user_id)?.display_name || "Member",
        avatarUrl: byId.get(m.user_id)?.avatar_url ?? null,
      }));
    },
  });

  const invitesQuery = useQuery({
    queryKey: ["team-invites", teamId],
    enabled: !!teamId,
    queryFn: async (): Promise<TeamInvitation[]> => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("id, team_id, email, status, created_at")
        .eq("team_id", teamId!)
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return {
    members: membersQuery.data ?? [],
    membersLoading: membersQuery.isLoading,
    pendingInvites: invitesQuery.data ?? [],
  };
}