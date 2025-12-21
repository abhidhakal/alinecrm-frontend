import LeadsHeader from "../components/LeadsHeader";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function Leads() {
  const { isExpanded } = useSidebar();

  const handleAddLead = () => {
    console.log("Add Lead clicked");
  };

  return(
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar/>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`} >

          <LeadsHeader/>

          {/* Controls Toolbar */}
          <div className="px-8 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search Leads */}
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-100" />
                </div>
                <input
                  type="text"
                  placeholder="search leads, projects..."
                  className="h-10 w-[280px] rounded-full border border-transparent bg-gray-100/50 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-500 focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gray-700 transition-colors">
                <img src="/icons/filter-list-on.svg" alt="Filter" className="h-4 w-4" />
                Filter
              </button>

              {/* Sort By */}
              <button className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gray-700 transition-colors">
                <img src="/icons/sort-icon.svg" alt="Sort" className="h-4 w-4" />
                Sort By
              </button>
            </div>

            {/* Add Lead */}
            <button
              onClick={handleAddLead}
              className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/filter-icon-filled.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
              Add Lead
            </button>
          </div>

        </div>
    </div>
  )
}