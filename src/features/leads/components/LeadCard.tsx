import type { Lead } from "../../../types/lead.types";
import { useCurrency } from "../../../context/CurrencyContext";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  activeDropdownId: number | null;
  setActiveDropdownId: (id: number | null) => void;
  viewMode: 'grid' | 'list';
}

export const LeadCard = ({
  lead,
  onEdit,
  onDelete,
  onArchive,
  activeDropdownId,
  setActiveDropdownId,
  viewMode
}: LeadCardProps) => {
  const { formatCurrency } = useCurrency();

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'Qualified': return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'Closed Won': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      default: return 'bg-gray-50 text-gray-600 ring-gray-500/20';
    }
  };

  const getStatusDotClasses = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-600';
      case 'Qualified': return 'bg-green-600';
      case 'Closed Won': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onEdit(lead)}
        className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{lead.name}</h3>
              <p className="text-xs font-medium text-gray-500">{lead.jobTitle || 'No Title'}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                <img src="/icons/mail-icon.svg" alt="Email" className="h-3.5 w-3.5 opacity-60" />
              </div>
              <span className="truncate max-w-[180px]">{lead.email || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                <img src="/icons/call-icon.svg" alt="Phone" className="h-3.5 w-3.5 opacity-60" />
              </div>
              <span>{lead.phone || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                <img src="/icons/location-icon.svg" alt="Location" className="h-3.5 w-3.5 opacity-60" />
              </div>
              <span>{lead.companyName || '-'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(lead.status)}`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getStatusDotClasses(lead.status)}`}></span>
            {lead.status}
          </span>

          <div className="text-right min-w-[100px]">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Value</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(lead.potentialValue || 0)}</p>
          </div>

          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdownId(activeDropdownId === lead.id ? null : lead.id);
                }}
                className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <img src="/icons/more-vertical.svg" alt="More" className="h-4 w-4" />
              </button>

              {activeDropdownId === lead.id && (
                <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg text-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(lead.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <img src="/icons/archive-icon.svg" alt="" className="h-4 w-4" />
                    Archive
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lead.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <img src="/icons/delete-icon.svg" alt="" className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onEdit(lead)}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg cursor-pointer"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-xs font-medium text-gray-500">{lead.jobTitle || 'No Title'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdownId(activeDropdownId === lead.id ? null : lead.id);
              }}
              className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <img src="/icons/more-vertical.svg" alt="More" className="h-4 w-4" />
            </button>

            {activeDropdownId === lead.id && (
              <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(lead.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <img src="/icons/archive-icon.svg" alt="" className="h-4 w-4" />
                  Archive
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <img src="/icons/delete-icon.svg" alt="" className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5 space-y-2.5">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
            <img src="/icons/mail-icon.svg" alt="Email" className="h-3.5 w-3.5 opacity-60" />
          </div>
          <span className="truncate font-medium">{lead.email || 'No email'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
            <img src="/icons/call-icon.svg" alt="Phone" className="h-3.5 w-3.5 opacity-60" />
          </div>
          <span className="font-medium">{lead.phone || 'No phone'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
            <img src="/icons/location-icon.svg" alt="Location" className="h-3.5 w-3.5 opacity-60" />
          </div>
          <span className="font-medium">{lead.companyName || 'No Company'}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(lead.status)}`}>
          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getStatusDotClasses(lead.status)}`}></span>
          {lead.status}
        </span>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Potential Value</p>
          <p className="text-sm font-bold text-gray-900">{formatCurrency(lead.potentialValue || 0)}</p>
        </div>
      </div>
    </div>
  );
};
