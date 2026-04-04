import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Download,
  Loader2,
  Code,
  Edit2,
  X,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Highlight, themes } from "prism-react-renderer";
import { CodeEditor } from "@/components/editor/CodeEditor";

interface Project {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && projectId) {
      fetchProject();
    }
  }, [isAuthenticated, projectId]);

  const fetchProject = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      navigate("/projects");
    } else if (!data) {
      toast({
        title: "Not found",
        description: "Project not found",
        variant: "destructive",
      });
      navigate("/projects");
    } else {
      setProject(data);
      setEditedCode(data.code || "");
      setEditedTitle(data.title);
      setEditedDescription(data.description || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        title: editedTitle.trim(),
        description: editedDescription.trim() || null,
        code: editedCode,
      })
      .eq("id", project.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } else {
      setProject({
        ...project,
        title: editedTitle.trim(),
        description: editedDescription.trim() || null,
        code: editedCode,
      });
      setEditing(false);
      toast({
        title: "Saved",
        description: "Project updated successfully",
      });
    }
    setSaving(false);
  };

  const handleExport = () => {
    if (!project || !project.code) return;

    const extensionMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      tsx: "tsx",
      jsx: "jsx",
      python: "py",
      html: "html",
      css: "css",
      json: "json",
      markdown: "md",
      sql: "sql",
      bash: "sh",
      shell: "sh",
      text: "txt",
    };

    const extension = extensionMap[project.language.toLowerCase()] || "txt";
    const filename = `${project.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${extension}`;

    const blob = new Blob([project.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `Saved as ${filename}`,
    });
  };

  const cancelEditing = useCallback(() => {
    if (project) {
      setEditedCode(project.code || "");
      setEditedTitle(project.title);
      setEditedDescription(project.description || "");
    }
    setEditing(false);
  }, [project]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!editing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) {
          handleSave();
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        cancelEditing();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editing, saving, editedCode, editedTitle, editedDescription, cancelEditing]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              {editing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-8 w-64 font-display font-semibold"
                />
              ) : (
                <h1 className="font-display text-xl font-semibold">
                  {project.title}
                </h1>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button variant="ghost" onClick={cancelEditing}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-bengal hover:opacity-90"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleExport}
                  className="bg-gradient-bengal hover:opacity-90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 flex-1 flex flex-col">
        {/* Description */}
        <div className="mb-4">
          {editing ? (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description..."
                rows={2}
              />
            </div>
          ) : (
            project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {project.language}
            </span>
            <span className="text-xs text-muted-foreground">
              {(project.code || "").split("\n").length} lines
            </span>
          </div>
        </div>

        {/* Code Editor / Viewer */}
        <div className="flex-1 border border-border rounded-lg overflow-hidden bg-[#1e1e1e]">
          {editing ? (
            <CodeEditor
              value={editedCode}
              onChange={setEditedCode}
              language={project.language}
            />
          ) : (
            <div className="overflow-auto h-full min-h-[500px]">
              <Highlight
                theme={themes.vsDark}
                code={project.code || "// No code"}
                language={project.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={className}
                    style={{
                      ...style,
                      margin: 0,
                      padding: "1rem",
                      minHeight: "100%",
                    }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="inline-block w-8 text-gray-500 select-none text-right mr-4">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
