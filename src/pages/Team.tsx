import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTeams, useTeamDetail } from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Plus,
  Mail,
  Crown,
  Check,
  X,
  Loader2,
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function Team() {
  const { user } = useAuthContext();
  const {
    teams,
    teamsLoading,
    myInvites,
    createTeam,
    inviteMember,
    acceptInvite,
    declineInvite,
  } = useTeams();

  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (!activeTeamId && teams.length > 0) {
      setActiveTeamId(teams[0].id);
    }
  }, [teams, activeTeamId]);

  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? null;
  const isOwner = activeTeam?.owner_id === user?.id;
  const { members, membersLoading, pendingInvites } = useTeamDetail(activeTeamId);

  const handleCreate = async () => {
    if (!newTeamName.trim()) return;
    const id = await createTeam.mutateAsync(newTeamName);
    setNewTeamName("");
    if (id) setActiveTeamId(id);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !activeTeamId) return;
    await inviteMember.mutateAsync({ teamId: activeTeamId, email: inviteEmail });
    setInviteEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Build Bengal AI" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-bold">Team</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl px-4 py-8 space-y-8">
        {/* Pending invitations for me */}
        {myInvites.length > 0 && (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" /> Invitations
              </CardTitle>
              <CardDescription>You've been invited to join these teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <span className="font-medium">{inv.teamName}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptInvite.mutate({ id: inv.id, team_id: inv.team_id })}
                      disabled={acceptInvite.isPending}
                      className="gap-1"
                    >
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => declineInvite.mutate(inv.id)}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* Teams sidebar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> Your teams
              </h2>
              {teamsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">No teams yet.</p>
              ) : (
                <div className="space-y-1">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTeamId(t.id)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeTeamId === t.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="new-team" className="text-xs text-muted-foreground">
                Create a new team
              </Label>
              <Input
                id="new-team"
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <Button
                onClick={handleCreate}
                disabled={!newTeamName.trim() || createTeam.isPending}
                className="w-full gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" /> Create team
              </Button>
            </div>
          </div>

          {/* Active team detail */}
          <div>
            {!activeTeam ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Create or select a team to manage members.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {activeTeam.name}
                      {isOwner && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown className="h-3 w-3" /> Owner
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {members.length} member{members.length === 1 ? "" : "s"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {membersLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={m.avatarUrl ?? undefined} />
                            <AvatarFallback>
                              {m.displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {m.displayName}
                            {m.user_id === user?.id && " (You)"}
                          </span>
                          <Badge variant="outline" className="ml-auto capitalize">
                            {m.role}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {isOwner && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Invite members</CardTitle>
                      <CardDescription>
                        Invite teammates by email. They can accept from their Team page.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="teammate@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                        />
                        <Button
                          onClick={handleInvite}
                          disabled={!inviteEmail.trim() || inviteMember.isPending}
                          className="gap-2 shrink-0"
                        >
                          <Mail className="h-4 w-4" /> Invite
                        </Button>
                      </div>

                      {pendingInvites.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Pending invitations</p>
                          {pendingInvites.map((inv) => (
                            <div
                              key={inv.id}
                              className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
                            >
                              <span>{inv.email}</span>
                              <Badge variant="outline">Pending</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}