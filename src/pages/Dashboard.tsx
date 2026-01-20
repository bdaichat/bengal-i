import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMenu } from "@/components/auth/UserMenu";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, FolderOpen, History, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Dashboard() {
  const { profile, user } = useAuthContext();
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";

  const quickActions = [
    {
      title: "Start New Chat",
      description: "Begin a new AI-powered conversation",
      icon: MessageSquare,
      href: "/chat",
      gradient: "from-primary to-primary/70",
    },
    {
      title: "My Projects",
      description: "View and manage your saved projects",
      icon: FolderOpen,
      href: "/projects",
      gradient: "from-secondary to-secondary/70",
    },
    {
      title: "Chat History",
      description: "Browse your previous conversations",
      icon: History,
      href: "/history",
      gradient: "from-accent to-accent/70",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Build Bengal AI" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-bold">Build Bengal AI</span>
            </Link>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, <span className="text-primary">{displayName}</span>!
          </h1>
          <p className="text-muted-foreground">
            What would you like to build today?
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">-</div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">-</div>
                <p className="text-sm text-muted-foreground">Chat Sessions</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">-</div>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">-</div>
                <p className="text-sm text-muted-foreground">Code Generated</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
