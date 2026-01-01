import { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import SocialsHeader from "../../features/admin/components/SocialsHeader";
import { useSidebar } from "../../context/SidebarContext";

export default function Socials() {
  const { isExpanded } = useSidebar();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const handleRefresh = useCallback(() => {
    // Refresh socials data here when API is implemented
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <SocialsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        {/* Placeholder for social media content */}
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
          <img src="/icons/social-media.svg" alt="Social Media" className="h-32 w-32 mb-6 opacity-20" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Social Media Management</h2>
          <p className="text-sm text-center max-w-md">Connect your social media accounts to manage your presence, schedule posts, and track engagement directly from Aline CRM.</p>
        </div>
      </div>
    </div>
  );
}