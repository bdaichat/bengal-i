import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LivePreview } from "./LivePreview";
import { generatePreviewHTML } from "@/utils/previewTemplate";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  Code2, 
  Maximize2,
  ExternalLink,
  X,
  Play,
  Save,
  Cloud,
  CloudOff,
  Loader2,
  Sun,
  Moon,
  Columns,
  Eye
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PreviewPanelProps {
  code: string | null;
  componentName?: string;
  onClose?: () => void;
  projectId?: string | null;
  language?: string;
}

type DeviceSize = "mobile" | "tablet" | "desktop";
type ThemeMode = "light" | "dark";
type ViewMode = "preview" | "code" | "split";

export function PreviewPanel({ 
  code, 
  componentName, 
  onClose,
  projectId = null,
  language = "tsx"
}: PreviewPanelProps) {
  const { isAuthenticated } = useAuthContext();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editableCode, setEditableCode] = useState(code || "");
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  
  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveDescription, setSaveDescription] = useState("");

  // Auto-save hook
  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    currentProjectId,
    createNewProject,
    manualSave,
  } = useAutoSave({
    code: editableCode,
    projectId,
    language,
    debounceMs: 2000,
    enabled: isAuthenticated,
  });

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
    const html = generatePreviewHTML(editableCode, themeMode === "dark");
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const toggleTheme = () => {
    setThemeMode(prev => prev === "light" ? "dark" : "light");
  };

  const handleSaveClick = () => {
    if (currentProjectId) {
      // Already has a project, trigger manual save
      manualSave();
    } else {
      // Open dialog to create new project
      setShowSaveDialog(true);
    }
  };

  const handleCreateProject = async () => {
    if (!saveTitle.trim()) return;
    
    const newProjectId = await createNewProject(
      editableCode,
      saveTitle,
      saveDescription
    );
    
    if (newProjectId) {
      setShowSaveDialog(false);
      setSaveTitle("");
      setSaveDescription("");
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return lastSaved.toLocaleTimeString();
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
          darkMode={themeMode === "dark"}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <TooltipProvider>
          <div className="flex items-center gap-1">
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

            <div className="w-px h-6 bg-border mx-1" />

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleTheme}
                >
                  {themeMode === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {themeMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </TooltipContent>
            </Tooltip>
          </div>
        
          <div className="flex items-center gap-1">
            {/* Auto-save status indicator */}
            {isAuthenticated && editableCode && (
              <div className="flex items-center gap-1 mr-2 text-xs text-muted-foreground">
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : currentProjectId ? (
                  <>
                    <Cloud className="h-3 w-3 text-green-500" />
                    {lastSaved && <span>{formatLastSaved()}</span>}
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <CloudOff className="h-3 w-3 text-amber-500" />
                    <span>Not saved</span>
                  </>
                ) : null}
              </div>
            )}

            {/* Save Button */}
            {isAuthenticated && editableCode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={hasUnsavedChanges && !currentProjectId ? "default" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 ${hasUnsavedChanges && !currentProjectId ? "bg-primary hover:bg-primary/90" : ""}`}
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {currentProjectId ? "Save Changes" : "Save as Project"}
                </TooltipContent>
              </Tooltip>
            )}

            <div className="w-px h-6 bg-border mx-1" />

            {/* View Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "preview" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("preview")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview Only</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "split" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("split")}
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Split View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "code" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("code")}
                >
                  <Code2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Only</TooltipContent>
            </Tooltip>

            {(viewMode === "code" || viewMode === "split") && hasUnappliedChanges && (
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
            )}
            
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

            {onClose && (
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
            )}
          </div>
        </TooltipProvider>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "code" ? (
          <div className="h-full bg-[#1e1e1e]">
            <CodeEditor
              value={editableCode}
              onChange={handleCodeChange}
              language="tsx"
            />
          </div>
        ) : viewMode === "split" ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="h-full bg-[#1e1e1e]">
                <CodeEditor
                  value={editableCode}
                  onChange={handleCodeChange}
                  language="tsx"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={25}>
              <LivePreview 
                key={refreshKey}
                code={editableCode} 
                componentName={componentName}
                deviceSize={deviceSize}
                darkMode={themeMode === "dark"}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <LivePreview 
            key={refreshKey}
            code={editableCode} 
            componentName={componentName}
            deviceSize={deviceSize}
            darkMode={themeMode === "dark"}
          />
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save as Project</DialogTitle>
            <DialogDescription>
              Save this code to your projects for easy access later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                placeholder="My awesome component"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && saveTitle.trim()) {
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                placeholder="A brief description of this code..."
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {language}
              </span>
              <span className="text-xs text-muted-foreground">
                {editableCode.split("\n").length} lines
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={isSaving || !saveTitle.trim()}
              className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
