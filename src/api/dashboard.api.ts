import { useQuery } from "@tanstack/react-query";
import API from "../lib/axios";
import type { DashboardStats } from "../types/dashboard.types";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await API.get<DashboardStats>("/dashboard");
      return response.data;
    },
    staleTime: 0, // Data is always stale, triggers refetch
    gcTime: 0, // Don't cache in garbage collection
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};
