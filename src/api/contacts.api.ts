import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../lib/axios";
import type { Contact, CreateContactDto, UpdateContactDto } from "../types/contact.types";

export const useGetAllContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await API.get<Contact[]>("/contacts");
      return response.data;
    },
  });
};

export const useGetContact = (id: number) => {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async () => {
      const response = await API.get<Contact>(`/contacts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateContactDto) => {
      const response = await API.post<Contact>("/contacts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateContactDto }) => {
      const response = await API.patch<Contact>(`/contacts/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts", variables.id] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await API.delete(`/contacts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useBulkCreateContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateContactDto[]) => {
      const response = await API.post<Contact[]>("/contacts/bulk", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await API.delete("/contacts/bulk", { data: { ids } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
