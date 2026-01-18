import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSent(true);
        toast({
          title: "Email sent",
          description: "Check your inbox for the password reset link.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Link to="/signin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-bengal flex items-center justify-center">
              {sent ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <Mail className="h-6 w-6 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl font-display">
              {sent ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {sent
                ? "We've sent a password reset link to your email address."
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Remember your password?{" "}
                  <Link to="/signin" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full"
              >
                Send Again
              </Button>
              <Link to="/signin" className="w-full">
                <Button className="w-full bg-gradient-bengal hover:opacity-90">
                  Back to Sign In
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}
