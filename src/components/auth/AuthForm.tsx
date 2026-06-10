import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onSuccess?: () => void;
  language?: "en" | "bn";
}

const translations = {
  en: {
    signin: {
      title: "Welcome Back",
      description: "Sign in to continue building amazing projects",
      button: "Sign In",
      footer: "Don't have an account?",
      footerLink: "Sign Up",
    },
    signup: {
      title: "Create Account",
      description: "Join Build Bengal AI and start creating",
      button: "Sign Up",
      footer: "Already have an account?",
      footerLink: "Sign In",
    },
    email: "Email",
    password: "Password",
    name: "Display Name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Your name",
  },
  bn: {
    signin: {
      title: "স্বাগতম",
      description: "অসাধারণ প্রজেক্ট তৈরি করতে সাইন ইন করুন",
      button: "সাইন ইন",
      footer: "অ্যাকাউন্ট নেই?",
      footerLink: "সাইন আপ",
    },
    signup: {
      title: "অ্যাকাউন্ট তৈরি করুন",
      description: "Build Bengal AI-এ যোগ দিন এবং তৈরি শুরু করুন",
      button: "সাইন আপ",
      footer: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      footerLink: "সাইন ইন",
    },
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    name: "প্রদর্শন নাম",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "আপনার নাম",
  },
};

export function AuthForm({ mode, onSuccess, language = "en" }: AuthFormProps) {
  const { signIn, signUp } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const t = translations[language];
  const modeT = t[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, displayName || undefined);
        if (!error) onSuccess?.();
      } else {
        const { error } = await signIn(email, password);
        if (!error) onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({
          title: language === "bn" ? "ত্রুটি" : "Error",
          description: language === "bn"
            ? "Google দিয়ে সাইন ইন করা যায়নি"
            : "Could not sign in with Google",
          variant: "destructive",
        });
        return;
      }
      if (result.redirected) return;
      onSuccess?.();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-bengal flex items-center justify-center">
          <span className="text-white font-bold text-xl">বি</span>
        </div>
        <CardTitle className="text-2xl font-display">{modeT.title}</CardTitle>
        <CardDescription>{modeT.description}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
              </svg>
            )}
            {language === "bn" ? "Google দিয়ে চালিয়ে যান" : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {language === "bn" ? "অথবা" : "or"}
              </span>
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t.name}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t.namePlaceholder}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-background/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {t.email}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                {t.password}
              </Label>
              {mode === "signin" && (
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-background/50"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-gradient-bengal hover:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "bn" ? "অপেক্ষা করুন..." : "Please wait..."}
              </>
            ) : (
              modeT.button
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            {modeT.footer}{" "}
            <Link
              to={mode === "signin" ? "/signup" : "/signin"}
              className="text-primary hover:underline font-medium"
            >
              {modeT.footerLink}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
