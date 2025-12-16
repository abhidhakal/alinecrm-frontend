import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-[312px] transition-all max-w-[calc(100vw-312px)]">
        <DashboardHeader />
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