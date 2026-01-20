import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalProjects: number;
  totalChats: number;
  totalMessages: number;
  recentActivity: number;
}

export function useDashboardStats() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) {
        return { totalProjects: 0, totalChats: 0, totalMessages: 0, recentActivity: 0 };
      }

      const [projectsResult, chatsResult, messagesResult] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("chats").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ]);

      // Count recent activity (chats updated in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const recentResult = await supabase
        .from("chats")
        .select("id", { count: "exact", head: true })
        .gte("updated_at", weekAgo.toISOString());

      return {
        totalProjects: projectsResult.count ?? 0,
        totalChats: chatsResult.count ?? 0,
        totalMessages: messagesResult.count ?? 0,
        recentActivity: recentResult.count ?? 0,
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
  });
}
