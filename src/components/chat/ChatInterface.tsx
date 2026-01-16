import { useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { TemplateSelector } from "./TemplateSelector";
import { Loader2 } from "lucide-react";

export function ChatInterface() {
  const { chatId } = useParams();
  const { messages, isLoading, language, setLanguage, sendMessage, clearMessages, initialLoading } = useChat(chatId);
  const [showTemplates, setShowTemplates] = useState(!chatId && messages.length === 0);

  const handleTemplateSelect = (prompt: string) => {
    setShowTemplates(false);
    sendMessage(prompt);
  };

  const handleSend = (message: string) => {
    setShowTemplates(false);
    sendMessage(message);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ChatHeader 
          language={language} 
          onLanguageChange={setLanguage}
          onClear={clearMessages}
          hasMessages={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader 
        language={language} 
        onLanguageChange={setLanguage}
        onClear={clearMessages}
        hasMessages={messages.length > 0}
      />
      
      <div className="flex-1 overflow-hidden">
        {showTemplates && messages.length === 0 ? (
          <TemplateSelector 
            language={language} 
            onSelect={handleTemplateSelect}
          />
        ) : (
          <ChatMessages messages={messages} isLoading={isLoading} language={language} />
        )}
      </div>
      
      <ChatInput 
        onSend={handleSend} 
        isLoading={isLoading} 
        language={language}
      />
    </div>
  );
}
