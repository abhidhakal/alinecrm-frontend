import type { LeadStatusType, LeadSourceType } from "../constants/lead.constants";

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  status: LeadStatusType;
  source?: LeadSourceType;
  inquiredFor?: string;
  potentialValue?: number;
  probability?: number;
  notes?: string;
  contactId?: number;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
    profilePicture?: string
  }[];
  createdAt: string;
  updatedAt: string;
}

export type CreateLeadDto = {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  status?: LeadStatusType;
  source?: LeadSourceType;
  inquiredFor?: string;
  potentialValue?: number;
  probability?: number;
  notes?: string;
  contactId?: number;
  assignedToIds?: number[];
};

export type UpdateLeadDto = Partial<CreateLeadDto>;
