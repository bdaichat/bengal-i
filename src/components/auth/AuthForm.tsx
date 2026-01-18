import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

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
