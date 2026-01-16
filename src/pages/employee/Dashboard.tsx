import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { useGetDashboardStats } from "../../api/dashboard.api";
import { institutionsApi } from "../../api/institutions.api";
import HeroSection from "../../features/dashboard/components/HeroSection";
import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import CalendarCard from "../../features/dashboard/components/CalendarCard";
import RevenueTrendChart from "../../features/dashboard/components/RevenueTrendChart";
import { format } from "date-fns";
import StatCard from "../../features/dashboard/components/StatCard";
import BreakdownRow from "../../features/dashboard/components/BreakdownRow";
import WinRateInfo from "../../features/dashboard/components/WinRateInfo";
import { useDashboardLayout } from "../../features/dashboard/hooks/useDashboardLayout";
import { mindfulnessApi } from "../../api/mindfulness.api";

export default function Dashboard() {
  const { isExpanded } = useSidebar();
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    isCustomizerOpen,
    setIsCustomizerOpen,
    visibleWidgets,
    onToggleWidget,
    heroAtStart,
    setHeroAtStart,
    onResetLayout,
  } = useDashboardLayout();

  // Weekend days from institution settings
  const [weekendDays, setWeekendDays] = useState<number[]>([0, 6]);

  // Fetch institution settings for weekend days
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await institutionsApi.getSettings();
        setWeekendDays(settings.weekendDays || [0, 6]);
      } catch (error) {
        console.error('Failed to fetch institution settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // React Query Hook
  const { data, isLoading, refetch } = useGetDashboardStats();

  const [pinnedThought, setPinnedThought] = useState<string | null>(null);

  useEffect(() => {
    // Fetch pinned thought on mount/refresh
    const fetchPinned = async () => {
      try {
        const data = await mindfulnessApi.getPinnedThought();
        if (data) {
          setPinnedThought(data.content);
        }
      } catch (e) { console.error(e); }
    };
    fetchPinned();
  }, []);

  const calendarEvents = data?.tasks?.calendar || [];
  const tasksDue = data?.tasks?.due || [];
  const recentCampaigns = data?.recent?.campaigns || [];
  const recentLeads = data?.recent?.leads || [];
  const recentContacts = data?.recent?.contacts || [];
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
        <DashboardHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          title="Dashboard"
          isCustomizerOpen={isCustomizerOpen}
          setIsCustomizerOpen={setIsCustomizerOpen}
          visibleWidgets={visibleWidgets}
          onToggleWidget={onToggleWidget}
          heroAtStart={heroAtStart}
          setHeroAtStart={setHeroAtStart}
          onResetLayout={onResetLayout}
        />

        <main className="flex-1 p-3 bg-white overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Top Stats Cards & Hero Section */}
              {heroAtStart && visibleWidgets['hero'] !== false && (
                <div className="lg:col-span-3">
                  <HeroSection userName={user?.name || 'User'} pinnedThought={pinnedThought} />
                </div>
              )}

              {visibleWidgets['stats-leads'] !== false && (
                <div className="lg:col-span-3">
                  <StatCard
                    title="Your Leads"
                    value={data?.stats?.newLeads?.count ?? 0}
                    growth={`${(data?.stats?.newLeads?.growth ?? 0) >= 0 ? '+' : ''}${data?.stats?.newLeads?.growth ?? 0}%`}
                    growthDesc="vs last 30 days"
                  />
                </div>
              )}

              {visibleWidgets['stats-conv'] !== false && (
                <div className="lg:col-span-3">
                  <StatCard
                    title="Your Conv. Rate"
                    value={`${data?.stats?.conversionRate?.value ?? 0}%`}
                    growth={`${(data?.stats?.conversionRate?.growth ?? 0) >= 0 ? '+' : ''}${data?.stats?.conversionRate?.growth ?? 0}%`}
                    growthDesc="vs last 30 days"
                  />
                </div>
              )}

              {visibleWidgets['stats-pipeline'] !== false && (
                <div className="lg:col-span-3">
                  <StatCard
                    title="Your Pipeline"
                    value={formatCurrency(data?.stats?.totalPipeline?.value ?? 0)}
                    isSmallText
                  />
                </div>
              )}

              {!heroAtStart && visibleWidgets['hero'] !== false && (
                <div className="lg:col-span-3">
                  <HeroSection userName={user?.name || 'User'} pinnedThought={pinnedThought} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {visibleWidgets['revenue'] !== false && (
                <div className="lg:col-span-5 bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col min-h-[380px]">
                  <RevenueTrendChart
                    data={data?.revenueData}
                    currencyFormatter={formatCurrency}
                    totalValue={formatCurrency(totalRevenue)}
                  />
                </div>
              )}

              {/* Status Breakdown & Win Rate */}
              {(visibleWidgets['breakdown'] !== false || visibleWidgets['winrate'] !== false) && (
                <div className="lg:col-span-3 flex flex-col gap-6">
                  {visibleWidgets['breakdown'] !== false && (
                    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex-1">
                      <h3 className="font-bold text-slate-900 mb-6 text-sm">Leads Breakdown</h3>
                      <div className="space-y-4">
                        <BreakdownRow label="Qualified" value={data?.leadsBreakdown?.Qualified ?? 0} />
                        <BreakdownRow label="Proposed" value={data?.leadsBreakdown?.Proposed ?? 0} />
                        <BreakdownRow label="Closed" value={data?.leadsBreakdown?.Closed ?? 0} />
                      </div>
                    </div>
                  )}
                  {visibleWidgets['winrate'] !== false && (
                    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-bold text-slate-900">Win Rate</h3>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">↑ 12%</span>
                      </div>
                      <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">{data?.winRate?.value ?? 0}%</div>
                      <div className="space-y-3">
                        <WinRateInfo label="Deals Won" value={data?.winRate?.won ?? 0} type="won" />
                        <WinRateInfo label="Deals Lost" value={data?.winRate?.lost ?? 0} type="lost" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {visibleWidgets['calendar'] !== false && (
                <div className="lg:col-span-4">
                  <CalendarCard
                    events={calendarEvents}
                    weekendDays={weekendDays}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {visibleWidgets['tasks'] !== false && (
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
                      {tasksDue.slice(0, 3).map((task: any) => {
                        // Calculate relative due date
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                        if (dueDate) dueDate.setHours(0, 0, 0, 0);

                        const diffDays = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

                        let dueLabel = 'No date';
                        let dueColor = 'text-slate-500';
                        let dueBgColor = 'bg-slate-50';

                        if (diffDays !== null) {
                          if (diffDays < 0) {
                            dueLabel = `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
                            dueColor = 'text-rose-600';
                            dueBgColor = 'bg-rose-50';
                          } else if (diffDays === 0) {
                            dueLabel = 'Due today';
                            dueColor = 'text-amber-600';
                            dueBgColor = 'bg-amber-50';
                          } else if (diffDays === 1) {
                            dueLabel = 'Due tomorrow';
                            dueColor = 'text-blue-600';
                            dueBgColor = 'bg-blue-50';
                          } else if (diffDays <= 7) {
                            dueLabel = `Due in ${diffDays} days`;
                            dueColor = 'text-emerald-600';
                            dueBgColor = 'bg-emerald-50';
                          } else {
                            dueLabel = format(new Date(dueDate!), 'MMM d');
                            dueColor = 'text-slate-600';
                            dueBgColor = 'bg-slate-50';
                          }
                        }

                        return (
                          <li
                            key={task.id}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors ${diffDays !== null && diffDays < 0
                              ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50'
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-900 line-clamp-1">{task.title}</span>
                              {task.category && (
                                <span className="text-[10px] font-medium text-slate-500 mt-0.5">{task.category}</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${dueColor} ${dueBgColor}`}>
                                {dueLabel}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/employee/tasks')}
                    className="mt-auto self-start px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    View all tasks
                    <span>→</span>
                  </button>
                </div>
              )}

              {visibleWidgets['campaigns'] !== false && (
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
              )}

              {visibleWidgets['leads-contacts'] !== false && (
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
