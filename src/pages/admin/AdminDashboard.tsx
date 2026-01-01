import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { useGetDashboardStats } from "../../api/dashboard.api";
import HeroSection from "../../features/dashboard/components/HeroSection";
import RevenueTrendChart from "../../features/dashboard/components/RevenueTrendChart";
import CalendarCard from "../../features/dashboard/components/CalendarCard";

export default function AdminDashboard() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetDashboardStats();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    if (data) setLastUpdated(new Date());
  }, [data]);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <DashboardHeader onRefresh={refetch} lastUpdated={lastUpdated} title="Admin Dashboard" />

        <main className="flex-1 p-3 bg-white overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">Loading admin dashboard data...</div>
          ) : (
            <div className="max-w-[1600px] mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                {/* Top Stats Cards */}
                <div className="lg:col-span-3">
                  <StatCard title="Global Leads" value={data?.stats.newLeads.count || 0} growth="+17%" growthDesc="vs last 30 days" />
                </div>
                <div className="lg:col-span-3">
                  <StatCard title="Global Conv. Rate" value={`${data?.stats.conversionRate.value || 0}%`} growth="+6%" growthDesc="vs last 30 days" />
                </div>
                <div className="lg:col-span-3">
                  <StatCard title="Global Pipeline" value="$ 54k" growth="+3.8k" growthDesc="vs last 30 days" />
                </div>
                <div className="lg:col-span-3">
                  <HeroSection userName={user?.name || 'User'} role="Admin" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-5 bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col min-h-[380px]">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">Total Revenue <span className="text-[10px] font-bold text-slate-400 ml-1">30 days</span></h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">$ 17,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 mt-auto">
                    {(!data?.revenueData || data.revenueData.length === 0) ? (
                      <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">No global revenue data</div>
                    ) : (
                      <RevenueTrendChart data={data?.revenueData} />
                    )}
                  </div>
                </div>

                {/* Status Breakdown & Win Rate */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex-1">
                    <h3 className="font-bold text-slate-900 mb-6 text-sm">System Leads</h3>
                    <div className="space-y-4">
                      <BreakdownRow label="Qualified" value={data?.leadsBreakdown.Qualified || 0} />
                      <BreakdownRow label="Proposed" value={data?.leadsBreakdown.Proposed || 0} />
                      <BreakdownRow label="Closed" value={data?.leadsBreakdown.Closed || 0} />
                    </div>
                  </div>
                  <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 mb-1">Global Win %</h3>
                    <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">{data?.winRate.value || 0}%</div>
                    <div className="space-y-3">
                      <WinRateInfo label="Total Won" value={data?.winRate.won || 0} type="won" />
                      <WinRateInfo label="Total Lost" value={data?.winRate.lost || 0} type="lost" />
                    </div>
                  </div>
                </div>

                {/* Calendar Column - shared CalendarCard */}
                <div className="lg:col-span-4">
                  <CalendarCard events={data?.tasks.calendar || []} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, growth, growthDesc }: { title: string, value: string | number, growth: string, growthDesc: string }) {
  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-slate-900 tracking-tight">{value}</span>
        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-full">
          {growth} <span className="text-emerald-500/60 font-medium">{growthDesc}</span>
        </span>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center bg-transparent">
      <span className="text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg flex-1">{label}</span>
      <span className="text-sm font-bold text-slate-900 ml-4">{value}</span>
    </div>
  );
}

function WinRateInfo({ label, value, type }: { label: string, value: number, type: 'won' | 'lost' }) {
  const colorClass = type === 'won' ? 'border-emerald-500/30 text-emerald-600' : 'border-rose-500/30 text-rose-600';
  return (
    <div className={`bg-white rounded-xl p-3 border flex items-center justify-between ${colorClass}`}>
      <span className="text-[11px] font-bold">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}
