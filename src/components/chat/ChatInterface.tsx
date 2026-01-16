import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { TemplateSelector } from "./TemplateSelector";

export function ChatInterface() {
  const { messages, isLoading, language, setLanguage, sendMessage, clearMessages } = useChat();
  const [showTemplates, setShowTemplates] = useState(messages.length === 0);

  const handleTemplateSelect = (prompt: string) => {
    setShowTemplates(false);
    sendMessage(prompt);
  };

  const handleSend = (message: string) => {
    setShowTemplates(false);
    sendMessage(message);
  };

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
