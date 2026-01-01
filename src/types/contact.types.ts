import type { ContactPriorityType } from "../constants/contact.constants";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  industry?: string;
  priority: ContactPriorityType;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
    profilePicture?: string
  }[];
  createdAt: string;
}

export type CreateContactDto = {
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  industry?: string;
  priority?: ContactPriorityType;
  assignedToIds?: number[];
};

export type UpdateContactDto = Partial<CreateContactDto>;
