import ContactsHeader from "../components/ContactsHeader";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function Socials() {
  const { isExpanded } = useSidebar();
  return(
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar/>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`} >

          <ContactsHeader/>

        </div>
    </div>
  )
}