interface LeadFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  leadsCount: number;
  stats: {
    new: number;
    qualified: number;
    working: number;
    proposed: number;
    won: number;
  };
}

export const LeadFilters = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  leadsCount,
  stats
}: LeadFiltersProps) => {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex gap-8">
        {[
          { id: 'All', label: 'All', count: leadsCount },
          { id: 'New', label: 'New', count: stats.new },
          { id: 'Qualified', label: 'Qualified', count: stats.qualified },
          { id: 'Working', label: 'Working', count: stats.working },
          { id: 'Proposed', label: 'Proposed', count: stats.proposed },
          { id: 'Won', label: 'Won', count: stats.won }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gray-900'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">

        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <img src="/icons/export-icn.svg" alt="Export" className="h-4 w-4" />
          Export Data
        </button>
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded p-1 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <img src="/icons/grid-view-icon-filled.svg" alt="Grid" className={`h-4 w-4 ${viewMode === 'grid' ? '' : 'opacity-50'}`} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded p-1 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <img src="/icons/list-view-icon.svg" alt="List" className={`h-4 w-4 ${viewMode === 'list' ? '' : 'opacity-50'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
