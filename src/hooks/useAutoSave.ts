import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface UseAutoSaveOptions {
  code: string;
  projectId?: string | null;
  language?: string;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  currentProjectId: string | null;
}

export function useAutoSave({
  code,
  projectId = null,
  language = "tsx",
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions) {
  const { user, isAuthenticated } = useAuthContext();
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    currentProjectId: projectId,
  });
  
  const lastSavedCodeRef = useRef<string>(code);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update currentProjectId when prop changes
  useEffect(() => {
    setState(prev => ({ ...prev, currentProjectId: projectId }));
  }, [projectId]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = code !== lastSavedCodeRef.current && code.length > 0;
    setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
  }, [code]);

  const saveToProject = useCallback(async (codeToSave: string, targetProjectId: string) => {
    if (!isAuthenticated || !user) return false;

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      const { error } = await supabase
        .from("projects")
        .update({ code: codeToSave })
        .eq("id", targetProjectId);

      if (error) throw error;

      lastSavedCodeRef.current = codeToSave;
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));

      return true;
    } catch (error) {
      console.error("Auto-save failed:", error);
      setState(prev => ({ ...prev, isSaving: false }));
      return false;
    }
  }, [isAuthenticated, user]);

  const createNewProject = useCallback(async (
    codeToSave: string,
    title: string,
    description?: string
  ) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save projects",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description?.trim() || null,
          code: codeToSave,
          language,
        })
        .select("id")
        .single();

      if (error) throw error;

      lastSavedCodeRef.current = codeToSave;
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        currentProjectId: data.id,
      }));

      toast({
        title: "Saved!",
        description: "Project created successfully",
      });

      return data.id;
    } catch (error) {
      console.error("Failed to create project:", error);
      setState(prev => ({ ...prev, isSaving: false }));
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
      return null;
    }
  }, [isAuthenticated, user, language]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled || !state.currentProjectId || !isAuthenticated || !code) {
      return;
    }

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Skip if no changes
    if (code === lastSavedCodeRef.current) {
      return;
    }

    // Set new debounced save
    debounceTimeoutRef.current = setTimeout(() => {
      saveToProject(code, state.currentProjectId!);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [code, state.currentProjectId, enabled, isAuthenticated, debounceMs, saveToProject]);

  const manualSave = useCallback(async () => {
    if (state.currentProjectId && code) {
      const success = await saveToProject(code, state.currentProjectId);
      if (success) {
        toast({
          title: "Saved",
          description: "Changes saved successfully",
        });
      }
      return success;
    }
    return false;
  }, [code, state.currentProjectId, saveToProject]);

  return {
    ...state,
    saveToProject,
    createNewProject,
    manualSave,
  };
}
