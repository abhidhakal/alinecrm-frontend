import { useRelativeTime } from '../../../hooks/useRelativeTime';
import NotificationBell from '../../../components/NotificationBell';
import GlobalSearchInput from '../../../components/GlobalSearchInput';

interface TasksHeaderProps {
  onRefresh?: () => void;
  lastUpdated?: Date | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  title?: string;
}

export default function TasksHeader({
  onRefresh,
  lastUpdated = null,
  searchQuery = '',
  onSearchChange,
  title = "Tasks"
}: TasksHeaderProps) {
  const relativeTime = useRelativeTime(lastUpdated);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-sm px-8 pt-8 pb-4">
      {/* Left: Title and Last Updated */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A86B]">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00A86B]"></div>
          Last updated {relativeTime}
        </div>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <GlobalSearchInput />

        {/* Notification Bell */}
        <NotificationBell />

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
