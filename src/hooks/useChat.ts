import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Language = "en" | "bn";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat(chatId?: string) {
  const { user, isAuthenticated } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [initialLoading, setInitialLoading] = useState(!!chatId);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Load existing chat if chatId is provided
  useEffect(() => {
    if (chatId && isAuthenticated) {
      loadChat(chatId);
    }
  }, [chatId, isAuthenticated]);

  const loadChat = async (id: string) => {
    setInitialLoading(true);
    try {
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (messagesData) {
        setMessages(
          messagesData.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
          }))
        );
        setCurrentChatId(id);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const createNewChat = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;

    // Generate a title from the first message (first 50 chars)
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");

    const { data, error } = await supabase
      .from("chats")
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      return null;
    }

    return data.id;
  };

  const saveMessage = async (chatIdToUse: string, role: "user" | "assistant", content: string) => {
    const { error } = await supabase.from("messages").insert({
      chat_id: chatIdToUse,
      role,
      content,
    });

    if (error) {
      console.error("Error saving message:", error);
    }
  };

  const streamChat = useCallback(
    async (
      userMessages: { role: string; content: string }[],
      onDelta: (text: string) => void,
      onDone: () => void
    ) => {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: userMessages, language }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait and try again.");
        }
        if (response.status === 402) {
          throw new Error("Usage limit reached. Please try again later.");
        }
        throw new Error("Failed to connect to AI");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onDelta(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      onDone();
    },
    [language]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Create chat if authenticated and no current chat
      let chatIdToUse = currentChatId;
      if (isAuthenticated && !chatIdToUse) {
        chatIdToUse = await createNewChat(content.trim());
        if (chatIdToUse) {
          setCurrentChatId(chatIdToUse);
        }
      }

      // Save user message if authenticated
      if (chatIdToUse) {
        await saveMessage(chatIdToUse, "user", content.trim());
      }

      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let assistantContent = "";
      const assistantId = generateId();

      const updateAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id === assistantId) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [
            ...prev,
            {
              id: assistantId,
              role: "assistant" as const,
              content: assistantContent,
              timestamp: new Date(),
            },
          ];
        });
      };

      try {
        await streamChat(chatHistory, updateAssistant, async () => {
          setIsLoading(false);
          // Save assistant message if authenticated
          if (chatIdToUse && assistantContent) {
            await saveMessage(chatIdToUse, "assistant", assistantContent);
          }
        });
      } catch (error) {
        setIsLoading(false);
        toast({
          title: language === "bn" ? "ত্রুটি" : "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
        // Remove the user message if failed
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      }
    },
    [messages, isLoading, streamChat, language, currentChatId, isAuthenticated]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  return {
    messages,
    isLoading,
    language,
    setLanguage,
    sendMessage,
    clearMessages,
    currentChatId,
    initialLoading,
  };
}
