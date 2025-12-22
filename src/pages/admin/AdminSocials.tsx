import SocialsHeader from "../../components/SocialsHeader";
import AdminSidebar from "../../components/AdminSidebar";
import { useSidebar } from "../../context/SidebarContext";

export default function AdminSocials() {
  const { isExpanded } = useSidebar();
  return(
    <div className="flex min-h-screen w-full bg-white">
      <AdminSidebar/>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`} >

          <SocialsHeader/>

          {/* Admin Banner */}
          <div className="mx-8 mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Administrator View</h3>
                  <p className="text-sm text-white/80">Viewing all social media accounts across all users</p>
                </div>
              </div>
            </div>
          </div>

        </div>
    </div>
  )
}
