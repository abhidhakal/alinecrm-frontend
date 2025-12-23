import { useState, useCallback } from "react";
import CampaignsHeader from "../components/CampaignsHeader";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function Campaigns() {
  const { isExpanded } = useSidebar();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const handleRefresh = useCallback(() => {
    // Refresh campaigns data here when API is implemented
    setLastUpdated(new Date());
  }, []);

  return(
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar/>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`} >

          <CampaignsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        </div>
    </div>
  )
}