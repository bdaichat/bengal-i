import { ArrowLeft, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { ReactNode } from "react";

type Language = "en" | "bn";

export interface ChatHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onClear: () => void;
  hasMessages: boolean;
  extraActions?: ReactNode;
}

export function ChatHeader({ language, onLanguageChange, onClear, hasMessages, extraActions }: ChatHeaderProps) {
  const toggleLanguage = () => {
    onLanguageChange(language === "en" ? "bn" : "en");
  };

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-bengal flex items-center justify-center">
              <span className="text-white font-bold text-sm">বি</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                {language === "bn" ? "AI প্রজেক্ট বিল্ডার" : "AI Project Builder"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === "bn" ? "আপনার আইডিয়া বর্ণনা করুন" : "Describe your idea"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {extraActions}
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "বাংলা" : "English"}
          </Button>
          
          {hasMessages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <UserMenu language={language} />
        </div>
      </div>
    </header>
  );
}
