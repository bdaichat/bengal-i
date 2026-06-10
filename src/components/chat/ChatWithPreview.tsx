import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { TemplateSelector } from "./TemplateSelector";
import { ModelSelector } from "./ModelSelector";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { extractCodeBlocks, getBestPreviewCode, transformForPreview } from "@/utils/codeExtractor";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ChatWithPreview() {
  const { chatId } = useParams();
  const { messages, isLoading, language, setLanguage, model, setModel, sendMessage, regenerate, clearMessages, initialLoading, currentChatId } = useChat(chatId);
  const [showTemplates, setShowTemplates] = useState(!chatId && messages.length === 0);
  const [showPreview, setShowPreview] = useState(true);

  // Extract code from the latest assistant message
  const previewCode = useMemo(() => {
    // Get the last assistant message
    const assistantMessages = messages.filter(m => m.role === "assistant");
    if (assistantMessages.length === 0) return null;

    const lastMessage = assistantMessages[assistantMessages.length - 1];
    const codeBlocks = extractCodeBlocks(lastMessage.content);
    const bestCode = getBestPreviewCode(codeBlocks);

    if (!bestCode) return null;

    try {
      return transformForPreview(bestCode.code, bestCode.componentName);
    } catch {
      return bestCode.code;
    }
  }, [messages]);

  // Auto-show preview when code is detected
  useEffect(() => {
    if (previewCode && !showPreview) {
      setShowPreview(true);
    }
  }, [previewCode]);

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
        extraActions={
          <TooltipProvider>
            <ModelSelector
              model={model}
              onModelChange={setModel}
              language={language}
              disabled={isLoading}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showPreview ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showPreview ? "Hide Preview" : "Show Preview"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {showTemplates && messages.length === 0 ? (
                  <TemplateSelector 
                    language={language} 
                    onSelect={handleTemplateSelect}
                  />
                ) : (
                  <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    language={language}
                    onRegenerate={regenerate}
                  />
                )}
              </div>
              
              <ChatInput 
                onSend={handleSend} 
                isLoading={isLoading} 
                language={language}
              />
            </div>
          </ResizablePanel>

          {/* Preview Panel */}
          {showPreview && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <PreviewPanel 
                  code={previewCode}
                  chatId={currentChatId}
                  onClose={() => setShowPreview(false)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
