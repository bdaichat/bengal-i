import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Settings() {
  const { user, profile } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setLanguage(profile.preferred_language || "en");
    }
  }, [profile]);

  const initials = (displayName || user?.email?.split("@")[0] || "U").slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
        preferred_language: language,
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Build Bengal AI" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-display font-bold">Build Bengal AI</span>
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Profile Settings</h1>

        {/* Personal Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Personal Info</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-bengal text-white text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  placeholder="https://example.com/avatar.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="opacity-60" />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language */}
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <ToggleGroup type="single" value={language} onValueChange={(v) => v && setLanguage(v)} className="justify-start">
                <ToggleGroupItem value="en" className="px-4">English</ToggleGroupItem>
                <ToggleGroupItem value="bn" className="px-4">বাংলা</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Separator />

            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <ToggleGroup type="single" value={theme || "system"} onValueChange={(v) => v && setTheme(v)} className="justify-start">
                <ToggleGroupItem value="light" className="px-4">Light</ToggleGroupItem>
                <ToggleGroupItem value="dark" className="px-4">Dark</ToggleGroupItem>
                <ToggleGroupItem value="system" className="px-4">System</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-bengal hover:opacity-90">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </main>
    </div>
  );
}
