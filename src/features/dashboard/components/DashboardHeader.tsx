import { useState, useRef, useEffect } from 'react';
import { useRelativeTime } from '../../../hooks/useRelativeTime';
import AddLeadModal from '../../leads/components/AddLeadModal';
import AddContactModal from '../../contacts/components/AddContactModal';
import AddTaskModal from '../../tasks/components/AddTaskModal';
import { useCreateLead } from '../../../api/leads.api';
import { useCreateContact } from '../../../api/contacts.api';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  lastUpdated?: Date | null;
  title?: string;
}

export default function DashboardHeader({ onRefresh, lastUpdated = null, title = "Dashboard" }: DashboardHeaderProps) {
  const relativeTime = useRelativeTime(lastUpdated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Mutations
  const createLead = useCreateLead();
  const createContact = useCreateContact();

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex w-full flex-col gap-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm px-8 pt-8 pb-4">
        <div className="flex w-full items-center justify-between">
          {/* Left: Title */}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">

            {/* Notification Bell */}
            <button className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
              <img src="/icons/notification-icon.svg" alt="Notifications" className="h-5 w-5 opacity-70 group-hover:opacity-100" />
            </button>

            {/* Search Bar */}
            <div className="relative group ml-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-50 group-focus-within:opacity-100" />
              </div>
              <input
                type="text"
                placeholder="Search anything"
                className="h-10 w-[220px] rounded-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

          </div>
        </div>

        {/* Sub Header: Customise & Last Updated */}
        <div className="flex w-full items-center justify-between pl-1">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-foreground transition-all hover:bg-gray-50 hover:border-gray-300">
              <img src="/icons/customize-icon.svg" alt="" className="h-4 w-4" />
              Customise
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00A86B]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00A86B]"></div>
              Last updated {relativeTime}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 mr-2 rounded-xl bg-[#1A1A1A] px-10 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.98]"
              >
                <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
                Add New
              </button>

              {isMenuOpen && (
                <div className="absolute right-2 top-full mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200 z-50">
                  <button
                    onClick={() => {
                      setIsLeadModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <img src="/icons/filter-icon.svg" alt="" className="h-5 w-5 opacity-70" />
                    Leads
                  </button>
                  <button
                    onClick={() => {
                      setIsContactModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <img src="/icons/contact-icon.svg" alt="" className="h-5 w-5 opacity-70" />
                    Contacts
                  </button>
                  <button
                    onClick={() => {
                      setIsTaskModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <img src="/icons/task-icon.svg" alt="" className="h-5 w-5 opacity-70" />
                    Tasks
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onRefresh}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:rotate-90 duration-500"
            >
              <img src="/icons/sync-icon.svg" alt="Refresh" className="h-4.5 w-4.5 opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>
      </header>

      {/* Modals - Moved outside the header tag to prevent clipping */}
      <AddLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmit={async (data) => {
          await createLead.mutateAsync(data);
          setIsLeadModalOpen(false);
        }}
      />
      <AddContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        onSubmit={async (data) => {
          await createContact.mutateAsync(data);
          setIsContactModalOpen(false);
        }}
      />
      <AddTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </>
  );
}
