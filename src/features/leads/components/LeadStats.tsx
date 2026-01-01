import type { Lead } from "../../../types/lead.types";

interface LeadStatsProps {
  leads: Lead[];
}

export const LeadStats = ({ leads }: LeadStatsProps) => {
  const stats = {
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    working: leads.filter(l => ['Negotiation', 'Proposal'].includes(l.status)).length,
    cancelled: leads.filter(l => l.status === 'Closed Lost').length,
    winRate: leads.length > 0
      ? Math.round((leads.filter(l => l.status === 'Closed Won').length / leads.length) * 100)
      : 0
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white">
            <img src="/icons/add-icon-filled.svg" alt="New" className="h-8 w-8 invert brightness-0" />
          </div>
          <div>
            <p className="text-base font-medium text-gray-500">New Leads</p>
            <p className="text-4xl font-bold text-gray-900 leading-tight">{stats.new}</p>
          </div>
        </div>
      </div>

      <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white">
            <img src="/icons/call-icon-filled.svg" alt="Contacted" className="h-9 w-9 invert brightness-0" />
          </div>
          <div>
            <p className="text-base font-medium text-gray-500">Contacted</p>
            <p className="text-4xl font-bold text-gray-900 leading-tight">{stats.contacted}</p>
          </div>
        </div>
      </div>

      <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
            <span className="text-3xl font-bold text-purple-600">%</span>
          </div>
          <div>
            <p className="text-base font-medium text-gray-500">Win Rate</p>
            <p className="text-4xl font-bold text-gray-900 leading-tight">{stats.winRate}%</p>
          </div>
        </div>
      </div>

      <div className="col-span-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
        <p className="mb-3 text-sm font-medium text-gray-500">Status</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Qualified</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{stats.qualified}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Working</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{stats.working}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-600">Cancelled</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{stats.cancelled}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
