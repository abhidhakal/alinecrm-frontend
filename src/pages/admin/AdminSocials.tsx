import { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import SocialsHeader from "../../features/admin/components/SocialsHeader";
import { useSidebar } from "../../context/SidebarContext";
import AdminViewBanner from "../../features/admin/components/AdminViewBanner";

export default function AdminSocials() {
  const { isExpanded } = useSidebar();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const handleRefresh = useCallback(() => {
    // Refresh socials data here when API is implemented
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`} >

        <SocialsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        <div className="px-8">
          <AdminViewBanner
            label="Viewing all social media accounts across all users"
          />
        </div>

      </div>
    </div>
  )
}
