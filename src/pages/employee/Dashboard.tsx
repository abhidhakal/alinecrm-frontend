import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { useGetDashboardStats } from "../../api/dashboard.api";
import HeroSection from "../../features/dashboard/components/HeroSection";
import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import CalendarCard from "../../features/dashboard/components/CalendarCard";
// (calendar grid helpers removed; CalendarCard handles its own layout)
import RevenueTrendChart from "../../features/dashboard/components/RevenueTrendChart";

export default function Dashboard() {
  const { isExpanded } = useSidebar();
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();

  // React Query Hook
  const { data, isLoading, refetch } = useGetDashboardStats();
  const calendarEvents = data?.tasks.calendar || [];
  const totalRevenue = (data?.revenueData ?? []).reduce((sum, entry) => {
    const raw = typeof entry.amount === "string" ? parseFloat(entry.amount) : entry.amount;
    const safe = Number.isFinite(raw) ? Number(raw) : 0;
    return sum + safe;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar />
        <div className={`flex flex-1 items-center justify-center ${isExpanded ? 'ml-[280px]' : 'ml-[110px]'}`}>
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <DashboardHeader onRefresh={refetch} lastUpdated={new Date()} title="User Dashboard" />

        <main className="flex-1 p-3 bg-white overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <StatCard
                  title="Your Leads"
                  value={data?.stats.newLeads.count || 0}
                  growth={`+${data?.stats.newLeads.growth}%`}
                  growthDesc="vs last 30 days"
                />
              </div>
              <div className="lg:col-span-3">
                <StatCard
                  title="Your Conv. Rate"
                  value={`${data?.stats.conversionRate.value}%`}
                  growth={`+${data?.stats.conversionRate.growth}%`}
                  growthDesc="vs last 30 days"
                />
              </div>
              <div className="lg:col-span-3">
                <StatCard
                  title="Your Pipeline"
                  value={formatCurrency(data?.stats.totalPipeline.value || 0)}
                  growth={`+${data?.stats.totalPipeline.growth}%`}
                  growthDesc="vs last 30 days"
                />
              </div>
              <div className="lg:col-span-3">
                <HeroSection userName={user?.name || 'User'} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col min-h-[380px]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Total Revenue <span className="text-[10px] font-bold text-slate-400 ml-1">30 days</span>
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 mt-auto">
                  {(!data?.revenueData || data.revenueData.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">No revenue data yet</div>
                  ) : (
                    <RevenueTrendChart data={data?.revenueData} currencyFormatter={formatCurrency} />
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex-1">
                  <h3 className="font-bold text-slate-900 mb-6 text-sm">Leads Breakdown</h3>
                  <div className="space-y-4">
                    <BreakdownRow label="Qualified" value={data?.leadsBreakdown.Qualified || 0} />
                    <BreakdownRow label="Proposed" value={data?.leadsBreakdown.Proposed || 0} />
                    <BreakdownRow label="Closed" value={data?.leadsBreakdown.Closed || 0} />
                  </div>
                </div>
                <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold text-slate-900">Win Rate</h3>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">↑ 12%</span>
                  </div>
                  <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">{data?.winRate.value}%</div>
                  <div className="space-y-3">
                    <WinRateInfo label="Deals Won" value={data?.winRate.won || 0} type="won" />
                    <WinRateInfo label="Deals Lost" value={data?.winRate.lost || 0} type="lost" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <CalendarCard events={calendarEvents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, growth, growthDesc }: { title: string; value: string | number; growth: string; growthDesc: string }) {
  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
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
