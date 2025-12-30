import api from './api';

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
  revenueData: any[]; // Or specific type if strict
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

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};
