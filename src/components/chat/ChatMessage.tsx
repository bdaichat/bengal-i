import { Message } from "@/hooks/useChat";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        isUser 
          ? "bg-primary/10 text-primary" 
          : "bg-gradient-bengal text-white"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={cn(
        "flex-1 max-w-[85%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted/50 border border-border/50"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                pre: ({ children, node }) => {
                  // Extract code content and language from the code element
                  const codeElement = node?.children?.[0];
                  let code = "";
                  let language = "text";
                  
                  if (codeElement && codeElement.type === "element" && codeElement.tagName === "code") {
                    const className = codeElement.properties?.className as string[] | undefined;
                    if (className && Array.isArray(className)) {
                      const langClass = className.find((c) => c.startsWith("language-"));
                      if (langClass) {
                        language = langClass.replace("language-", "");
                      }
                    }
                    // Extract text content
                    const textNode = codeElement.children?.[0];
                    if (textNode && textNode.type === "text") {
                      code = textNode.value;
                    }
                  }
                  
                  return (
                    <CodeBlock code={code} language={language}>
                      {children}
                    </CodeBlock>
                  );
                },
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
