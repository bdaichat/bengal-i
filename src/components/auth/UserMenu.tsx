import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, History, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface UserMenuProps {
  language?: "en" | "bn";
}

export function UserMenu({ language = "en" }: UserMenuProps) {
  const { user, profile, signOut, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/signin">
          <Button variant="ghost" size="sm">
            {language === "bn" ? "সাইন ইন" : "Sign In"}
          </Button>
        </Link>
        <Link to="/signup">
          <Button size="sm" className="bg-gradient-bengal hover:opacity-90">
            {language === "bn" ? "সাইন আপ" : "Sign Up"}
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-bengal text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/history" className="flex items-center gap-2 cursor-pointer">
            <History className="h-4 w-4" />
            {language === "bn" ? "চ্যাট ইতিহাস" : "Chat History"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/projects" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            {language === "bn" ? "আমার প্রজেক্ট" : "My Projects"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            {language === "bn" ? "সেটিংস" : "Settings"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {language === "bn" ? "সাইন আউট" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
