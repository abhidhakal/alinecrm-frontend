import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { useGetDashboardStats } from "../../api/dashboard.api";
import HeroSection from "../../features/dashboard/components/HeroSection";
import RevenueTrendChart from "../../features/dashboard/components/RevenueTrendChart";
import CalendarCard from "../../features/dashboard/components/CalendarCard";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetDashboardStats();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    if (data) setLastUpdated(new Date());
  }, [data]);

  const tasksDue = data?.tasks.due || [];
  const recentCampaigns = data?.recent.campaigns || [];
  const recentLeads = data?.recent.leads || [];
  const recentContacts = data?.recent.contacts || [];

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
                  <RevenueTrendChart 
                    data={data?.revenueData} 
                    totalValue="$ 17,000"
                  />
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Tasks Due</h3>
                      <p className="text-[11px] text-slate-500 mt-1">Your next few upcoming tasks</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      {Math.min(tasksDue.length, 3)} task{Math.min(tasksDue.length, 3) === 1 ? "" : "s"}
                    </span>
                  </div>

                  {tasksDue.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400 italic">No upcoming tasks due.</p>
                  ) : (
                    <ul className="space-y-3">
                      {tasksDue.slice(0, 3).map((task: any) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-900 line-clamp-1">{task.title}</span>
                            {task.category && (
                              <span className="text-[10px] font-medium text-slate-500 mt-0.5">{task.category}</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="block text-[11px] font-semibold text-slate-700">
                              {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">Due date</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    className="mt-5 inline-flex items-center self-start text-[11px] font-semibold text-slate-700 hover:text-slate-900"
                  >
                    View all tasks
                    <span className="ml-1">→</span>
                  </button>
                </div>

                <div className="lg:col-span-3 bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Recent Campaigns</h3>
                    <span className="text-[10px] font-medium text-slate-500">Last {Math.min(recentCampaigns.length || 0, 3)}</span>
                  </div>
                  {recentCampaigns.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400 italic">No campaigns yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {recentCampaigns.slice(0, 3).map((campaign: any) => (
                        <li
                          key={campaign.id}
                          className="flex items-start justify-between px-3 py-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1 pr-2">
                            <span className="block text-xs font-semibold text-slate-900 line-clamp-1">{campaign.title}</span>
                            {campaign.createdAt && (
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Started {format(new Date(campaign.createdAt), "MMM d")}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="lg:col-span-4 bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Recent Leads & Contacts</h3>
                    <span className="text-[10px] font-medium text-slate-500">
                      Leads {Math.min(recentLeads.length || 0, 3)} · Contacts {Math.min(recentContacts.length || 0, 3)}
                    </span>
                  </div>

                  {recentLeads.length === 0 && recentContacts.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400 italic">No leads or contacts yet.</p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-slate-700">Leads</span>
                          <span className="text-[10px] text-slate-400">Showing {Math.min(recentLeads.length, 3)}</span>
                        </div>
                        {recentLeads.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No leads yet.</p>
                        ) : (
                          <ul className="mt-1.5 divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-white">
                            {recentLeads.slice(0, 3).map((lead: any) => (
                              <li
                                key={lead.id}
                                className="px-3 py-2.5 text-xs hover:bg-slate-50 transition-colors"
                              >
                                <span className="flex items-center gap-1.5 font-semibold text-slate-900 line-clamp-1">
                                  <span>{lead.name}</span>
                                  {lead.companyName && (
                                    <>
                                      <span className="text-slate-400">-</span>
                                      <span className="text-slate-700">{lead.companyName}</span>
                                    </>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-slate-700">Contacts</span>
                          <span className="text-[10px] text-slate-400">Showing {Math.min(recentContacts.length, 3)}</span>
                        </div>
                        {recentContacts.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No contacts yet.</p>
                        ) : (
                          <ul className="mt-1.5 divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-white">
                            {recentContacts.slice(0, 3).map((contact: any) => {
                              const priority = contact.priority as string | undefined;
                              const priorityColor =
                                priority === "High"
                                  ? "text-rose-600"
                                  : priority === "Medium"
                                  ? "text-amber-600"
                                  : priority === "Low"
                                  ? "text-emerald-600"
                                  : "text-slate-500";
                              return (
                                <li
                                  key={contact.id}
                                  className="px-3 py-2.5 text-xs hover:bg-slate-50 transition-colors"
                                >
                                  <span className="flex items-center gap-1.5 font-semibold text-slate-900 line-clamp-1">
                                    <span>{contact.name}</span>
                                    {contact.companyName && (
                                      <>
                                        <span className="text-slate-400">-</span>
                                        <span className="text-slate-700">{contact.companyName}</span>
                                      </>
                                    )}
                                    {priority && (
                                      <>
                                        <span className="text-slate-400">-</span>
                                        <span className={priorityColor}>{priority}</span>
                                      </>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
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
