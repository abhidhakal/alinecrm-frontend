import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';

type Tab = 'preferences' | 'notifications';

export default function Settings() {
  const { isExpanded } = useSidebar();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('preferences');
  const [loading, setLoading] = useState(false);

  // Notification State (Mock)
  const [notifications, setNotifications] = useState({
    emailCampaigns: true,
    taskReminders: true,
    systemUpdates: false,
    leadAssignments: true,
  });

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
                      <select
                        disabled={loading}
                        value={currency.code}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold outline-none focus:border-black transition-all cursor-pointer disabled:opacity-50"
                      >
                        {availableCurrencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
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
                      <select className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold outline-none focus:border-black transition-all">
                        <option>English (US)</option>
                        <option disabled>Nepali (Coming Soon)</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">i</div>
                    <p className="text-xs leading-relaxed text-gray-600">
                      These settings apply globally to your workspace. Changes to system currency will update all financial data displays.
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

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
