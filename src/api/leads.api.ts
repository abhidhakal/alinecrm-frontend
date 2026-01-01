import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../lib/axios";
import type { Lead, CreateLeadDto, UpdateLeadDto } from "../types/lead.types";

export const useGetAllLeads = () => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await API.get<Lead[]>("/leads");
      return response.data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLeadDto) => {
      const response = await API.post<Lead>("/leads", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateLeadDto }) => {
      const response = await API.patch<Lead>(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await API.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
