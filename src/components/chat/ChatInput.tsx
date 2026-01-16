import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  language: "en" | "bn";
}

const examplePrompts = {
  en: [
    "Build a todo app with categories",
    "Create a restaurant menu page",
    "Make a portfolio website",
  ],
  bn: [
    "ক্যাটাগরি সহ একটি টুডু অ্যাপ তৈরি করুন",
    "রেস্টুরেন্ট মেনু পেজ তৈরি করুন",
    "একটি পোর্টফোলিও ওয়েবসাইট তৈরি করুন",
  ],
};

export function ChatInput({ onSend, isLoading, language }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        {/* Example prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {examplePrompts[language].map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="relative flex items-end gap-2 bg-muted/50 rounded-2xl border border-border/50 p-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === "bn" 
              ? "আপনার প্রজেক্ট আইডিয়া লিখুন..." 
              : "Describe your project idea..."}
            className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-xl bg-gradient-bengal hover:opacity-90 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          {language === "bn" 
            ? "Build Bengal AI আপনার জন্য কোড জেনারেট করবে"
            : "Build Bengal AI will generate code for you"}
        </p>
      </div>
    </div>
  );
}
