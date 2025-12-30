import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi, type DashboardStats } from "../../api/dashboard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { isExpanded } = useSidebar();
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const stats = await dashboardApi.getStats();
      setData(stats);
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
  const RevenueChart = ({ data }: { data: any[] }) => {
    // If no data, show empty state or simple line
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No revenue data yet</div>;

    // We can map mock points if real data is sparse for visualization, but let's try to map real data if possible
    // For now, using the nice curve from design as a placeholder if data is flat/empty
    // But ideally: const points = data.map((d, i) => `${i * 50},${120 - (d.amount / max) * 100}`).join(" ");

    // Using a static nice curve for visual consistency with the design request "replicate exact design"
    // In a real scenario with recharts/chartjs this would be dynamic.
    const points = "0,100 50,90 100,50 150,70 200,40 250,60 300,20 350,40 400,10 450,30 500,0";

    return (
      <div className="relative h-48 w-full overflow-hidden">
        <svg viewBox="0 0 500 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,120 L${points} L500,120 Z`} fill="url(#gradient)" />
          <path d={`M${points}`} fill="none" stroke="#0EA5E9" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

          {/* Mock Current Point Marker - Visual only */}
          <circle cx="350" cy="40" r="4" fill="#0B3954" stroke="white" strokeWidth="2" />
          <foreignObject x="320" y="5" width="80" height="30">
            <div className="bg-[#0B3954] text-white text-xs px-2 py-1 rounded text-center shadow-lg">
              Now
            </div>
          </foreignObject>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <DashboardHeader onRefresh={fetchData} lastUpdated={currentTime} />

        <main className="flex-1 p-6 md:p-8 bg-slate-50 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">Loading dashboard data...</div>
          ) : (
            <div className="grid grid-cols-12 gap-6">

              {/* --- Left Column (Main Stats & Chart) --- */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* New Leads */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold text-slate-800">New leads</h3>
                    <div>
                      <span className="text-4xl font-bold text-slate-900 block mb-2">{data?.stats.newLeads.count || 0}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${(data?.stats.newLeads.growth || 0) >= 0
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-rose-600 bg-rose-50'
                        }`}>
                        {(data?.stats.newLeads.growth || 0) > 0 ? '+' : ''}{data?.stats.newLeads.growth || 0}% vs last 30 days
                      </span>
                    </div>
                  </div>
                  {/* Conversion Rate */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold text-slate-800">Conversion Rate</h3>
                    <div>
                      <span className="text-4xl font-bold text-slate-900 block mb-2">{data?.stats.conversionRate.value || 0}%</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Stable vs last 30 days
                      </span>
                    </div>
                  </div>
                  {/* Total Pipeline */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold text-slate-800">Total Pipeline</h3>
                    <div>
                      <span className="text-4xl font-bold text-slate-900 block mb-2">{formatCurrency(data?.stats.totalPipeline.value || 0)}</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Active Opportunities
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">Revenue</h3>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-slate-900">{formatCurrency(17000)}</span>
                        <span className="text-xs font-medium text-slate-500 mb-1">Projected</span>
                      </div>
                    </div>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      {['1D', '1W', '1M', '1Y', 'ALL'].map(period => (
                        <button key={period} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${period === '1M' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <RevenueChart data={data?.revenueData || []} />
                </div>

                {/* Recent Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tasks Due */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0">
                      <h3 className="font-bold text-slate-800">Tasks Due</h3>
                      <Link to="/tasks" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">All Tasks →</Link>
                    </div>
                    <div className="p-2 overflow-y-auto max-h-[300px]">
                      {(!data?.tasks.due || data.tasks.due.length === 0) ? (
                        <div className="p-8 text-center text-sm text-slate-400">No pending tasks</div>
                      ) : (
                        data.tasks.due.map((task: any) => (
                          <div key={task.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white ${task.priority === 'high' ? 'bg-rose-500' : 'bg-slate-300'
                                }`}></div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{task.title}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">{format(new Date(task.dueDate), 'MMM d')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Campaigns */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0">
                      <h3 className="font-bold text-slate-800">Recent Campaigns</h3>
                      <Link to="/campaigns" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">View all →</Link>
                    </div>
                    <div className="p-2 overflow-y-auto max-h-[300px]">
                      {(!data?.recent.campaigns || data.recent.campaigns.length === 0) ? (
                        <div className="p-8 text-center text-sm text-slate-400">No active campaigns</div>
                      ) : (
                        data.recent.campaigns.map((camp: any) => (
                          <div key={camp.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{camp.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${camp.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                              }`}>
                              {camp.status || 'Draft'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Leads & Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Leads */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4">Recent leads</h3>
                    <div className="space-y-2">
                      {(!data?.recent.leads || data.recent.leads.length === 0) ? (
                        <div className="text-center text-sm text-slate-400 py-4">No recently added leads</div>
                      ) : (
                        data.recent.leads.map((lead: any) => (
                          <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{lead.name || 'Unnamed Lead'}</span>
                            <img src="/icons/arrow-right.svg" className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" alt="" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Contacts */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4">Recent contacts</h3>
                    <div className="space-y-2">
                      {(!data?.recent.contacts || data.recent.contacts.length === 0) ? (
                        <div className="text-center text-sm text-slate-400 py-4">No recently added contacts</div>
                      ) : (
                        data.recent.contacts.map((contact: any) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{contact.name}</span>
                            <img src="/icons/arrow-right.svg" className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" alt="" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* --- Right Column (Sidebar Widgets) --- */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                {/* Hello Card */}
                <div className="bg-blue-100/50 p-6 rounded-3xl border border-blue-200/50 flex flex-col justify-between shadow-sm min-h-[160px] relative overflow-hidden group">
                  {/* Decorative Gradients */}
                  <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <span className="text-6xl font-bold text-slate-900 tracking-tighter block">{format(currentTime, 'd')}</span>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{format(currentTime, 'MMM yyyy')}</span>
                      <span className="text-xl font-bold text-blue-900 block mt-1">{format(currentTime, 'EEEE')}</span>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-slate-900">Hello, {user?.name?.split(' ')[0] || 'User'}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">How has your day been?</p>
                      <div className="mt-4 bg-slate-900 text-white text-2xl font-bold px-4 py-2 rounded-xl inline-block shadow-lg transition-transform hover:scale-105">
                        {format(currentTime, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Leads Breakdown */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Your leads</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <span className="text-sm font-bold text-slate-700">Qualified</span>
                      <span className="text-sm font-bold text-slate-900">{data?.leadsBreakdown.Qualified || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <span className="text-sm font-bold text-slate-700">Proposed</span>
                      <span className="text-sm font-bold text-slate-900">{data?.leadsBreakdown.Proposed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <span className="text-sm font-bold text-slate-700">Closed</span>
                      <span className="text-sm font-bold text-slate-900">{data?.leadsBreakdown.Closed || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Win Rate */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Win % <span className="text-xs opacity-60">last 30 days</span></h3>
                  <div className="text-5xl font-bold text-slate-900 mb-4">{data?.winRate.value || 0}%</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                      <span className="text-xs font-bold text-emerald-700 block mb-1">Deals Won</span>
                      <span className="text-lg font-bold text-emerald-900">{data?.winRate.won || 0}</span>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 text-center">
                      <span className="text-xs font-bold text-rose-700 block mb-1">Deals Lost</span>
                      <span className="text-lg font-bold text-rose-900">{data?.winRate.lost || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Calendar & Agenda */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Calendar - {format(new Date(), 'yyyy')}</h3>
                    <div className="bg-slate-100 text-xs font-bold px-2 py-1 rounded-lg text-slate-600">
                      {format(new Date(), 'MMMM')}
                    </div>
                  </div>

                  {/* Date Row (Next 7 days) */}
                  <div className="flex justify-between mb-6 border-b border-slate-100 pb-4">
                    {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                      const d = new Date();
                      d.setDate(d.getDate() + offset);
                      const isToday = offset === 0;
                      return (
                        <div key={offset} className={`text-center flex flex-col items-center cursor-pointer transition-opacity hover:opacity-100 ${isToday ? 'opacity-100' : 'opacity-40'}`}>
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-1 ${isToday ? 'bg-primary text-white shadow-md ring-2 ring-blue-100' : 'text-slate-700 border border-slate-200'}`}>
                            {format(d, 'd')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{format(d, 'EEE')}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Agenda Items */}
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                    {(!data?.tasks.calendar || data.tasks.calendar.length === 0) ? (
                      <div className="text-center text-xs text-slate-400 py-8 italic">No events scheduled for the next 7 days</div>
                    ) : (
                      data.tasks.calendar.map((event: any) => (
                        <div key={event.id} className="grid grid-cols-[60px_1fr] gap-2 group cursor-pointer">
                          <span className="text-xs font-bold text-slate-500 pt-3 group-hover:text-primary transition-colors">{format(new Date(event.dueDate), 'h:mm a')}</span>
                          <div className={`p-3 rounded-xl border-l-4 shadow-sm text-sm font-bold transition-transform group-hover:translate-x-1 ${event.priority === 'high' ? 'bg-amber-50 border-amber-400 text-amber-900 group-hover:bg-amber-100' :
                              'bg-blue-50 border-blue-400 text-blue-900 group-hover:bg-blue-100'
                            }`}>
                            {event.title}
                          </div>
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
