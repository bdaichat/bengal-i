import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LivePreview } from "./LivePreview";
import { generatePreviewHTML } from "@/utils/previewTemplate";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  Code2, 
  Maximize2,
  ExternalLink,
  X,
  Play
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PreviewPanelProps {
  code: string | null;
  componentName?: string;
  onClose?: () => void;
}

type DeviceSize = "mobile" | "tablet" | "desktop";

export function PreviewPanel({ code, componentName, onClose }: PreviewPanelProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editableCode, setEditableCode] = useState(code || "");
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);

  // Sync editableCode when new code comes in from AI
  useEffect(() => {
    if (code) {
      setEditableCode(code);
      setHasUnappliedChanges(false);
    }
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setEditableCode(newCode);
    setHasUnappliedChanges(newCode !== code);
  };

  const handleApplyChanges = () => {
    setRefreshKey(prev => prev + 1);
    setHasUnappliedChanges(false);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    if (!editableCode) return;
    const html = generatePreviewHTML(editableCode);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <LivePreview 
          key={refreshKey}
          code={editableCode} 
          componentName={componentName}
          deviceSize="desktop"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={deviceSize === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDeviceSize("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={deviceSize === "tablet" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDeviceSize("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={deviceSize === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDeviceSize("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showCode ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowCode(!showCode)}
                >
                  <Code2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Code</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showCode && hasUnappliedChanges && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8 bg-primary hover:bg-primary/90"
                    onClick={handleApplyChanges}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Apply Changes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleOpenInNewTab}
                  disabled={!code}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in New Tab</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onClose && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showCode ? (
          <div className="h-full bg-[#1e1e1e]">
            <CodeEditor
              value={editableCode}
              onChange={handleCodeChange}
              language="tsx"
            />
          </div>
        ) : (
          <LivePreview 
            key={refreshKey}
            code={editableCode} 
            componentName={componentName}
            deviceSize={deviceSize}
          />
        )}
      </div>
    </div>
  );
}
