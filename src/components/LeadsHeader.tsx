import { useRelativeTime } from '../hooks/useRelativeTime';

interface LeadsHeaderProps {
  onRefresh?: () => void;
  lastUpdated?: Date | null;
}

export default function LeadsHeader({ onRefresh, lastUpdated = null }: LeadsHeaderProps) {
  const relativeTime = useRelativeTime(lastUpdated);
  
  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-sm px-8 pt-8 pb-4">
      {/* Left: Title and Last Updated */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A86B]">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00A86B]"></div>
          Last updated {relativeTime}
        </div>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-50 group-focus-within:opacity-100" />
          </div>
          <input
            type="text"
            placeholder="search anything"
            className="h-10 w-[220px] rounded-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
          />
        </div>

        {/* Notification Bell */}
        <button className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
          <img src="/icons/notification-icon.svg" alt="Notifications" className="h-5 w-5 opacity-70 group-hover:opacity-100" />
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:rotate-90 duration-500"
        >
          <img src="/icons/sync-icon.svg" alt="Refresh" className="h-4.5 w-4.5 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </header>
  );
}
