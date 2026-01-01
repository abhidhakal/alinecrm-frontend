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
  });
};
