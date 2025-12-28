import api from './api';

export const TaskStatus = {
  TODO: 'To-Do',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];


export interface Task {
  id: number;
  title: string;
  description: string;
  category?: string;
  progress: number;
  assignedDate?: string;
  dueDate: string;
  status: TaskStatusType;
  assignedTo: { id: number; name: string; email: string; profilePicture?: string }[];
  assignedBy?: { id: number; name: string; profilePicture?: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  category?: string;
  progress?: number;
  dueDate: string;
  status?: TaskStatusType;
  assignedToIds?: number[];
  relatedLeadId?: number;
  relatedContactId?: number;
}

export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks'),
  getOne: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<Task> & { assignedToIds?: number[] }) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};
