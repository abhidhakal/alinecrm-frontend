import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useSidebar } from "../context/SidebarContext";

export default function Dashboard() {
  const { isExpanded } = useSidebar();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const handleRefresh = useCallback(() => {
    // Refresh dashboard data here when API is implemented
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`}>
        <DashboardHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        <main className="flex-1 p-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[150px]">
              <h3 className="text-sm font-semibold text-gray-900">New leads</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">34</span>
                <span className="text-xs font-medium text-green-600">+17% vs last 30 days</span>
              </div>
            </div>
            {/* Widget 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[150px]">
              <h3 className="text-sm font-semibold text-gray-900">Conversion Rate</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">22%</span>
                <span className="text-xs font-medium text-green-600">+6% vs last 30 days</span>
              </div>
            </div>
            {/* Widget 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[150px]">
              <h3 className="text-sm font-semibold text-gray-900">Total Pipeline</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$ 54k</span>
                <span className="text-xs font-medium text-green-600">+3.8k vs last 30 days</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}