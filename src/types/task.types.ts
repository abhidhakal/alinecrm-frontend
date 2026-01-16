import type { TaskStatusType } from "../constants/task.constants";

export interface TaskAttachment {
  url: string;
  name: string;
}

export interface TaskLink {
  url: string;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category?: string;
  progress: number;
  assignedDate?: string;
  dueDate: string;
  status: TaskStatusType;
  assignedTo: {
    id: number;
    name: string;
    email?: string;
    profilePicture?: string
  }[];
  assignedBy?: {
    id: number;
    name: string;
    profilePicture?: string
  };
  attachments?: TaskAttachment[];
  links?: TaskLink[];
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDto = {
  title: string;
  description: string;
  category?: string;
  progress?: number;
  dueDate: string;
  status?: TaskStatusType;
  assignedToIds?: number[];
  relatedLeadId?: number;
  relatedContactId?: number;
  attachments?: TaskAttachment[];
  links?: TaskLink[];
};

export type UpdateTaskDto = Partial<CreateTaskDto>;
