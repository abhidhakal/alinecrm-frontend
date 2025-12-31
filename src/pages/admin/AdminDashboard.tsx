import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi, type DashboardStats } from "../../api/dashboard";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await dashboardApi.getStats();
      setData(stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, [fetchData]);

  // Simple SVG Line Chart Component
  const RevenueChart = ({ data: _data }: { data: any[] }) => {
    const points = "0,100 40,95 80,60 120,80 160,50 200,70 240,30 280,50 320,15 360,40 400,5 440,25 480,0 500,10";

    return (
      <div className="relative h-64 w-full overflow-hidden">
        <svg viewBox="0 0 500 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />

          <path d={`M0,120 L${points} L500,120 Z`} fill="url(#chartGradient)" />
          <path d={`M${points}`} fill="none" stroke="#64748b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

          <line x1="350" y1="0" x2="350" y2="120" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

          <circle cx="350" cy="40" r="4" fill="#0B3954" stroke="white" strokeWidth="2" />
          <foreignObject x="325" y="15" width="60" height="25">
            <div className="bg-[#0B3954] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center justify-center whitespace-nowrap">
              Nov 2025
            </div>
          </foreignObject>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <DashboardHeader onRefresh={fetchData} lastUpdated={lastUpdated} title="Admin Dashboard" />

        <main className="flex-1 p-3 bg-white overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">Loading admin dashboard data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">

              {/* --- Row 1: Top Stats (Global) --- */}
              <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Global Leads</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">{data?.stats.newLeads.count || 0}</span>
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-full">
                    +17% <span className="text-emerald-500/60 font-medium">vs last 30 days</span>
                  </span>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Global Conv. Rate</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">{data?.stats.conversionRate.value || 0}%</span>
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-full">
                    +6% <span className="text-emerald-500/60 font-medium">vs last 30 days</span>
                  </span>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Global Pipeline</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">$ 54k</span>
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-full">
                    +3.8k <span className="text-emerald-500/60 font-medium">vs last 30 days</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#D9EAFD] p-5 rounded-[1.5rem] border border-blue-100 shadow-sm flex items-center gap-4">
                <div className="flex items-stretch gap-0 overflow-hidden rounded-xl border border-blue-200/50 bg-white">
                  <div className="flex flex-col items-center justify-center px-4 py-2 border-r border-blue-100">
                    <span className="text-4xl font-bold text-slate-900 leading-none">{format(currentTime, 'd')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{format(currentTime, 'MMM yyyy')}</span>
                  </div>
                  <div className="bg-[#BAE6FD] flex items-center justify-center px-3 writing-mode-vertical min-w-[40px]">
                    <span className="text-[14px] font-bold text-[#1E40AF]">{format(currentTime, 'EEEE')}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">Admin, {user?.name?.split(' ')[0] || 'User'}</h2>
                  <p className="text-[10px] text-slate-500 font-bold -mt-0.5 mb-2">How is the system today?</p>
                  <div className="bg-[#1E293B] text-white text-sm font-bold px-4 py-2 rounded-full inline-block shadow-md">
                    {format(currentTime, 'HH:mm')}
                  </div>
                </div>
              </div>

              {/* --- Row 2: Charts & Widgets --- */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col min-h-[380px]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Total Revenue <span className="text-[10px] font-bold text-slate-400 ml-1">30 days</span></h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">$ 17,000</span>
                      <span className="text-[11px] font-bold text-slate-400">+5% vs last month</span>
                    </div>
                  </div>
                  <div className="flex bg-slate-100/50 rounded-xl p-1 gap-1">
                    {['1D', '1W', '1M', '1Y', 'ALL'].map(period => (
                      <button key={period} className={`px-3 py-1 text-[10px] font-bold rounded-lg ${period === '1M' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>{period}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 mt-auto">
                  {(!data?.revenueData || data.revenueData.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">
                      No global revenue data available
                    </div>
                  ) : (
                    <RevenueChart data={data.revenueData} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex-1">
                  <h3 className="font-bold text-slate-900 mb-6 text-sm">System Leads</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Qualified', value: data?.leadsBreakdown.Qualified || 0 },
                      { label: 'Proposed', value: data?.leadsBreakdown.Proposed || 0 },
                      { label: 'Closed', value: data?.leadsBreakdown.Closed || 0 }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center bg-transparent">
                        <span className="text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg flex-1">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900 ml-4">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Global Win % <span className="text-[10px] font-normal text-slate-400 ml-1">last 30 days</span></h3>
                  <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">{data?.winRate.value || 0}%</div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-3 border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600">Total Won</span>
                      <span className="text-sm font-bold text-slate-900">{data?.winRate.won || 0}</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-rose-500/30 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600">Total Lost</span>
                      <span className="text-sm font-bold text-slate-900">{data?.winRate.lost || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-sm">System Calendar - {format(currentTime, 'yyyy')}</h3>
                  <div className="bg-slate-100/50 text-[10px] font-bold px-3 py-1.5 rounded-full text-slate-600 flex items-center gap-1">
                    {format(currentTime, 'MMMM')} <img src="/icons/chevron-down.svg" className="w-2 h-2" alt="" />
                  </div>
                </div>
                <div className="flex justify-between mb-8">
                  {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                    const d = new Date();
                    d.setDate(d.getDate() + (offset - 2));
                    const isToday = offset === 2;
                    return (
                      <div key={offset} className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${isToday ? 'bg-[#1E293B] text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-900 hover:bg-slate-50'}`}>{format(d, 'd')}</div>
                        <span className="text-[10px] font-bold text-slate-400">{format(d, 'EEE')}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-4 flex-1">
                  {(!data?.tasks.calendar || data.tasks.calendar.length === 0) ? (
                    <div className="text-center text-xs text-slate-300 py-8 italic">No upcoming system events</div>
                  ) : (
                    data.tasks.calendar.slice(0, 4).map((event: any, idx: number) => {
                      const colors = [
                        'bg-[#FFD699] text-[#92400E]',
                        'bg-[#C7D2FE] text-[#3730A3]',
                        'bg-[#C7D2FE] text-[#3730A3]',
                        'bg-[#E0E7FF] text-[#4338CA]'
                      ];
                      return (
                        <div key={event.id || idx} className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 w-12">{format(new Date(event.dueDate), 'h:mm a')}</span>
                          <div className={`flex-1 p-3 rounded-xl text-[11px] font-bold truncate ${colors[idx % colors.length]}`}>{event.title}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* --- Row 3: Bottom Items --- */}
              <div className="lg:col-span-2 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-7 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">Tasks Due (System)</h3>
                  <Link to="/admin/tasks" className="text-[11px] font-bold text-slate-500 flex items-center gap-1">All Tasks <span>→</span></Link>
                </div>
                <div className="px-7 pb-7 space-y-3">
                  {(!data?.tasks.due || data.tasks.due.length === 0) ? (
                    <div className="text-center text-xs text-slate-300 py-4 italic">No pending tasks</div>
                  ) : (
                    data.tasks.due.slice(0, 3).map((task: any, i: number) => (
                      <div key={task.id || i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100">
                        <span className="text-sm font-bold text-slate-700">{task.title}</span>
                        <span className="text-[11px] font-bold text-slate-900">{format(new Date(task.dueDate), 'h:mm a')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="p-7 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Campaigns</h3>
                  <Link to="/admin/campaigns" className="text-slate-400"><span>→</span></Link>
                </div>
                <div className="px-7 pb-7 space-y-3">
                  {(!data?.recent.campaigns || data.recent.campaigns.length === 0) ? (
                    <div className="text-center text-xs text-slate-300 py-4 italic">No recent status</div>
                  ) : (
                    data.recent.campaigns.slice(0, 2).map((camp: any, i: number) => (
                      <div key={camp.id || i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:border-slate-100 border border-transparent">
                        <span className="text-sm font-bold text-slate-800">{camp.name}</span>
                        <span className="text-[10px] font-bold text-emerald-500">Success: {camp.success || '0%'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col p-6">
                  <h3 className="font-bold text-slate-900 text-xs mb-4">Latest leads</h3>
                  <div className="space-y-2">
                    {(!data?.recent.leads || data.recent.leads.length === 0) ? (
                      <div className="text-center text-[10px] text-slate-300 py-2 italic font-medium">Empty</div>
                    ) : (
                      data.recent.leads.slice(0, 2).map((lead: any, i: number) => (
                        <div key={lead.id || i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-colors">
                          <span className="text-[10px] font-bold text-slate-600 truncate">{lead.name || 'Unnamed'}</span>
                          <span className="text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col p-6">
                  <h3 className="font-bold text-slate-900 text-xs mb-4">Latest contacts</h3>
                  <div className="space-y-2">
                    {(!data?.recent.contacts || data.recent.contacts.length === 0) ? (
                      <div className="text-center text-[10px] text-slate-300 py-2 italic font-medium">Empty</div>
                    ) : (
                      data.recent.contacts.slice(0, 2).map((contact: any, i: number) => (
                        <div key={contact.id || i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-colors">
                          <span className="text-[10px] font-bold text-slate-600 truncate">{contact.name || 'Unnamed'}</span>
                          <span className="text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
