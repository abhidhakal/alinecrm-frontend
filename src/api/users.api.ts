import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../lib/axios";
import type { User, CreateUserDto, UpdateUserDto } from "../types/user.types";

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  getAll: async (): Promise<User[]> => {
    const response = await API.get('/users');
    return response.data;
  },
  getOne: async (id: number): Promise<User> => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await API.post('/users', data);
    return response.data;
  },
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await API.patch(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await API.delete(`/users/${id}`);
  },
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await API.get<User>("/auth/me");
      return response.data;
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await API.get<User[]>("/users");
      return response.data;
    },
  });
};

export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await API.get<User>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await API.post<User>("/users", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      const response = await API.patch<User>(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await API.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
