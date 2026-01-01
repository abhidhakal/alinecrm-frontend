export interface RevenueEntry {
  id: number;
  amount: number | string;
  description?: string | null;
  createdAt: string;
  leadId?: number;
  userId?: number;
  institutionId?: number;
}

export interface DashboardStats {
  stats: {
    newLeads: { count: number; growth: number };
    conversionRate: { value: number; growth: number };
    totalPipeline: { value: number; growth: number };
  };
  leadsBreakdown: {
    Qualified: number;
    Proposed: number;
    Closed: number;
  };
  winRate: { value: number; won: number; lost: number };
  revenueData: RevenueEntry[];
  recent: {
    leads: any[];
    contacts: any[];
    campaigns: any[];
  };
  tasks: {
    due: any[];
    calendar: any[];
  };
}
