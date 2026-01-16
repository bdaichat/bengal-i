import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, FolderPlus } from "lucide-react";
import { SaveProjectDialog } from "./SaveProjectDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeBlockProps {
  children: React.ReactNode;
  code: string;
  language: string;
}

export function CodeBlock({ children, code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    setSaveDialogOpen(true);
  };

  return (
    <div className="relative group">
      <pre className="bg-background/80 rounded-lg p-4 overflow-x-auto text-sm border border-border/50">
        {children}
      </pre>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleSaveClick}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save as project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SaveProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        code={code}
        language={language}
      />
    </div>
  );
}
