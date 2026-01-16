import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { institutionsApi } from '../../api/institutions.api';
import { googleCalendarApi } from '../../api/google-calendar.api';

type Tab = 'preferences' | 'notifications' | 'integrations';

export default function Settings() {
  const { isExpanded } = useSidebar();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { showToast } = useToast();
  const { isAdmin, user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('preferences');
  const [loading, setLoading] = useState(false);
  const [savingWeekend, setSavingWeekend] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  // Weekend Days State (fetched from API for admins)
  const [weekendDays, setWeekendDays] = useState<number[]>([0, 6]);
  const [originalWeekendDays, setOriginalWeekendDays] = useState<number[]>([0, 6]);
  const [hasWeekendChanges, setHasWeekendChanges] = useState(false);

  // Handle Google Calendar Callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('google_connect');

    if (status === 'success') {
      showToast('Google Calendar connected successfully', 'success');
      if (user) {
        updateUser({ ...user, isGoogleCalendarConnected: true });
      }
      navigate('/employee/settings', { replace: true });
      setActiveTab('integrations');
    } else if (status === 'error') {
      showToast('Failed to connect Google Calendar', 'error');
      navigate('/employee/settings', { replace: true });
      setActiveTab('integrations');
    }
  }, [location, showToast, navigate, user, updateUser]);

  const handleGoogleConnect = async () => {
    try {
      setConnectLoading(true);
      const { url } = await googleCalendarApi.getConnectUrl();
      window.location.href = url;
    } catch (error) {
      showToast('Failed to initiate connection', 'error');
      setConnectLoading(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      setConnectLoading(true);
      await googleCalendarApi.disconnect();
      if (user) {
        updateUser({ ...user, isGoogleCalendarConnected: false });
      }
      showToast('Google Calendar disconnected', 'success');
    } catch (error) {
      showToast('Failed to disconnect', 'error');
    } finally {
      setConnectLoading(false);
    }
  };

  const [syncing, setSyncing] = useState(false);

  const handleSyncTasks = async () => {
    try {
      setSyncing(true);
      const result = await googleCalendarApi.syncTasks();
      showToast(`Synced ${result.synced} tasks to Google Calendar`, 'success');
    } catch (error) {
      showToast('Failed to sync tasks', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Notification State (Mock)
  const [notifications, setNotifications] = useState({
    emailCampaigns: true,
    taskReminders: true,
    systemUpdates: false,
    leadAssignments: true,
  });

  // Fetch institution settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await institutionsApi.getSettings();
        setWeekendDays(settings.weekendDays || [0, 6]);
        setOriginalWeekendDays(settings.weekendDays || [0, 6]);
      } catch (error) {
        console.error('Failed to fetch institution settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(weekendDays.sort()) !== JSON.stringify(originalWeekendDays.sort());
    setHasWeekendChanges(changed);
  }, [weekendDays, originalWeekendDays]);

  const handleCurrencyChange = async (code: string) => {
    try {
      setLoading(true);
      await setCurrency(code);
      showToast(`Currency updated to ${code}`, 'success');
    } catch (error) {
      showToast('Failed to update currency', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekendDay = (dayId: number) => {
    setWeekendDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSaveWeekendDays = async () => {
    try {
      setSavingWeekend(true);
      await institutionsApi.updateWeekendDays(weekendDays);
      setOriginalWeekendDays([...weekendDays]);
      setHasWeekendChanges(false);
      showToast('Weekend days updated successfully', 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update weekend days';
      showToast(message, 'error');
    } finally {
      setSavingWeekend(false);
    }
  };

  const handleCancelWeekendChanges = () => {
    setWeekendDays([...originalWeekendDays]);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900 mt-4">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        <header className="flex h-16 items-center border-b border-gray-100 bg-white px-8">
          <h1 className="text-xl font-bold">CRM Settings</h1>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 overflow-hidden">
          {/* Settings Navigation */}
          <aside className="w-full lg:w-64 bg-white p-4">
            <nav className="flex flex-row lg:flex-col gap-1">
              {[
                { id: 'preferences', label: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                { id: 'integrations', label: 'Integrations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">

              {activeTab === 'preferences' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold">CRM Preferences</h2>
                    <p className="text-gray-500 mt-1">Localization and system display options.</p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-900 font-bold border border-gray-100">
                          {currency.symbol}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">System Currency</h4>
                          <p className="text-xs text-gray-500">Affects all pipeline and revenue metrics.</p>
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          disabled={loading}
                          value={currency.code}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                          className="appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm font-semibold outline-none focus:border-black transition-all cursor-pointer disabled:opacity-50"
                        >
                          {availableCurrencies.map(c => (
                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-900 border border-gray-100">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-2.002m11.778 2.002c-.751 2.685-2.259 5.023-4.113 7.026m3.065-10.5h2.5M19 10l.524 3.037M7 10a4 4 0 110 8 4 4 0 010-8zm5-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V9a1 1 0 011-1z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Language</h4>
                          <p className="text-xs text-gray-500">Default language for the CRM interface.</p>
                        </div>
                      </div>
                      <div className="relative">
                        <select className="appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm font-semibold outline-none focus:border-black transition-all">
                          <option>English (US)</option>
                          <option disabled>Nepali (Coming Soon)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekend Days - Visible to all, editable by Admin only */}
                  <div className="rounded-2xl border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      {isAdmin ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Admin Only</span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase">Admin Only</span>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-900 border border-gray-100">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Weekend Days</h4>
                          <p className="text-xs text-gray-500">
                            {isAdmin
                              ? 'Days marked as holidays on the calendar for all users.'
                              : 'Days marked as holidays on the calendar. Only admins can change this.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-[200px]">
                        {[
                          { id: 0, label: 'Sun' },
                          { id: 1, label: 'Mon' },
                          { id: 2, label: 'Tue' },
                          { id: 3, label: 'Wed' },
                          { id: 4, label: 'Thu' },
                          { id: 5, label: 'Fri' },
                          { id: 6, label: 'Sat' },
                        ].map((day) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => isAdmin && toggleWeekendDay(day.id)}
                            disabled={!isAdmin}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${weekendDays.includes(day.id)
                              ? isAdmin ? 'bg-rose-500 text-white' : 'bg-rose-200 text-rose-700 cursor-not-allowed'
                              : isAdmin ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save/Cancel buttons - Admin only */}
                    {isAdmin && hasWeekendChanges && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={handleSaveWeekendDays}
                          disabled={savingWeekend}
                          className="rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-900 disabled:opacity-50"
                        >
                          {savingWeekend ? 'Saving...' : 'Save Weekend Days'}
                        </button>
                        <button
                          onClick={handleCancelWeekendChanges}
                          disabled={savingWeekend}
                          className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">i</div>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {isAdmin
                        ? 'These settings apply globally to your institution. Weekend days will affect all users in your organization.'
                        : 'These settings apply to your workspace. Contact your admin to change organization-wide settings like weekend days.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold">System Notifications</h2>
                    <p className="text-gray-500 mt-1">Configure how and when you receive CRM alerts.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'emailCampaigns', label: 'Email Campaign Updates', desc: 'Alerts for scheduled, started, and completed campaigns.' },
                      { id: 'taskReminders', label: 'Automated Task Reminders', desc: 'Sync system task deadlines with your notification tray.' },
                      { id: 'systemUpdates', label: 'CRM System Status', desc: 'Maintenance schedules and new feature releases.' },
                      { id: 'leadAssignments', label: 'Lead Movement Alerts', desc: 'Notifications when leads are assigned or status changes.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/20">
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={notifications[item.id as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                            className="h-5 w-5 rounded-lg border-gray-300 text-black focus:ring-black cursor-pointer"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.label}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <button className="rounded-xl bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-100">
                        Update Notification Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold">Integrations</h2>
                    <p className="text-gray-500 mt-1">Connect external services to enhance your CRM experience.</p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">

                        <div>
                          <h4 className="font-bold text-sm">Google Calendar</h4>
                          <p className="text-xs text-gray-500">
                            {user?.isGoogleCalendarConnected
                              ? 'Your tasks are synced with Google Calendar.'
                              : 'Sync your CRM tasks and deadlines with Google Calendar.'}
                          </p>
                        </div>
                      </div>
                      <div>
                        {user?.isGoogleCalendarConnected ? (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                              Connected
                            </span>
                            <button
                              onClick={handleSyncTasks}
                              disabled={syncing}
                              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50"
                            >
                              {syncing ? 'Syncing...' : 'Sync Tasks'}
                            </button>
                            <button
                              onClick={handleGoogleDisconnect}
                              disabled={connectLoading}
                              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
                            >
                              {connectLoading ? 'Disconnecting...' : 'Disconnect'}
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled
                            className="rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-400 cursor-not-allowed flex items-center gap-2"
                          >
                            <svg className="h-4 w-4 grayscale opacity-50" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google Calendar (Coming Soon)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">i</div>
                    <p className="text-xs leading-relaxed text-gray-600">
                      Connecting Google Calendar allows the CRM to create calendar events for your tasks automatically. You can disconnect at any time.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
