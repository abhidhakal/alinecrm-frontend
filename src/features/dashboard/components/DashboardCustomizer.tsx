
interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  visibleWidgets: Record<string, boolean>;
  onToggleWidget: (id: string) => void;
  heroAtStart: boolean;
  setHeroAtStart: (atStart: boolean) => void;
  onResetLayout: () => void;
}

const WIDGETS = [
  { id: 'stats-leads', label: 'Stats: Business Metrics (Total Leads)' },
  { id: 'stats-conv', label: 'Stats: Conversion Rate' },
  { id: 'stats-pipeline', label: 'Stats: Pipeline Value' },
  { id: 'hero', label: 'Hero Section' },
  { id: 'revenue', label: 'Revenue Trends Chart' },
  { id: 'breakdown', label: 'Leads Breakdown' },
  { id: 'winrate', label: 'Win Rate Metrics' },
  { id: 'calendar', label: 'Mini Calendar' },
  { id: 'tasks', label: 'Tasks Due List' },
  { id: 'campaigns', label: 'Recent Campaigns' },
  { id: 'leads-contacts', label: 'Recent Leads & Contacts' },
];

export default function DashboardCustomizer({
  isOpen,
  onClose,
  visibleWidgets,
  onToggleWidget,
  heroAtStart,
  setHeroAtStart,
  onResetLayout
}: DashboardCustomizerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-80 bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Positioning</h3>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="text-sm font-semibold text-slate-700">Hero at Start</span>
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setHeroAtStart(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${heroAtStart ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setHeroAtStart(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!heroAtStart ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  No
                </button>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 italic px-1">
              "Yes" moves the Hero section to the first position in the top stats row.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Visible Cards</h3>
            <div className="space-y-2">
              {WIDGETS.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => onToggleWidget(widget.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${visibleWidgets[widget.id] !== false
                    ? 'border-blue-100 bg-blue-50/50 text-blue-900'
                    : 'border-slate-100 bg-white text-slate-400'
                    }`}
                >
                  <span className="text-sm font-semibold">{widget.label}</span>
                  <div className={`h-5 w-9 rounded-full transition-colors relative ${visibleWidgets[widget.id] !== false ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${visibleWidgets[widget.id] !== false ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 pb-8 space-y-3">
          <button
            onClick={onResetLayout}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
