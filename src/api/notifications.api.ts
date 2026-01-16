import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../lib/axios";

export interface Notification {
  id: number;
  recipientId: number;
  category: 'ANNOUNCEMENT' | 'SYSTEM';
  type: 'lead' | 'task' | 'contact' | 'campaign' | 'general';
  action: 'creation' | 'assignment' | 'broadcast';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  groupId?: string;
  createdAt: string;
}

export const useGetNotifications = (userId?: number) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const response = await API.get<Notification[]>("/notifications");
      return response.data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Poll every 30s
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await API.patch<Notification>(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await API.patch("/notifications/read-all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useBroadcastAnnouncement = () => {
  return useMutation({
    mutationFn: async (data: { title: string; message: string; link?: string }) => {
      const response = await API.post("/notifications/broadcast", data);
      return response.data;
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      await API.delete(`/notifications/broadcast/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
