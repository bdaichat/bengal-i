import { useEffect, useRef } from "react";
import { Message } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  language: "en" | "bn";
  onRegenerate?: () => void;
}

export function ChatMessages({ messages, isLoading, language, onRegenerate }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastMessage = messages[messages.length - 1];
  const canRegenerate =
    !isLoading && lastMessage?.role === "assistant" && messages.some((m) => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-bengal flex items-center justify-center mb-6 glow-green">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {language === "bn" ? "আপনার প্রজেক্ট আইডিয়া বলুন" : "Tell me your project idea"}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {language === "bn" 
            ? "আমি আপনার জন্য React, TypeScript এবং Tailwind CSS দিয়ে কোড লিখব"
            : "I'll generate code for you using React, TypeScript, and Tailwind CSS"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-bengal flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === "bn" ? "চিন্তা করছি..." : "Thinking..."}</span>
            </div>
          </div>
        )}

        {canRegenerate && onRegenerate && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="gap-2 text-muted-foreground"
            >
              <RefreshCw className="h-4 w-4" />
              {language === "bn" ? "আবার তৈরি করুন" : "Regenerate"}
            </Button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
