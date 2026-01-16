import { useState, useMemo, useEffect } from 'react';
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import LeadsHeader from "../../features/leads/components/LeadsHeader";
import AddLeadModal from "../../features/leads/components/AddLeadModal";
import EditLeadModal from "../../features/leads/components/EditLeadModal";
import { useGetAllLeads, useCreateLead, useUpdateLead, useDeleteLead } from "../../api/leads.api";
import type { Lead, CreateLeadDto, UpdateLeadDto } from "../../types/lead.types";
import { LeadStats } from '../../features/leads/components/LeadStats';
import { LeadFilters } from '../../features/leads/components/LeadFilters';
import { LeadCard } from '../../features/leads/components/LeadCard';

export default function Leads() {
  const { isExpanded } = useSidebar();

  // React Query Hooks
  const { data: leads = [], isLoading, refetch } = useGetAllLeads();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  // Local UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('leads-view-mode');
    return (saved === 'grid' || saved === 'list') ? saved : 'grid';
  });

  useEffect(() => {
    localStorage.setItem('leads-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdownId !== null && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownId]);

  const handleCreateLead = async (data: CreateLeadDto) => {
    await createLeadMutation.mutateAsync(data);
    setIsAddModalOpen(false);
  };

  const handleUpdateLead = async (id: number, data: UpdateLeadDto) => {
    await updateLeadMutation.mutateAsync({ id, data });
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLeadMutation.mutateAsync(id);
    }
    setActiveDropdownId(null);
  };

  const handleArchiveLead = async (id: number) => {
    await updateLeadMutation.mutateAsync({ id, data: { status: 'Archived' as any } });
    setActiveDropdownId(null);
  };

  const filterStats = useMemo(() => ({
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    working: leads.filter(l => ['Negotiation', 'Contacted'].includes(l.status)).length,
    proposed: leads.filter(l => l.status === 'Proposal').length,
    won: leads.filter(l => l.status === 'Closed Won').length
  }), [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (activeTab === 'All') return true;
      if (activeTab === 'New') return lead.status === 'New';
      if (activeTab === 'Qualified') return lead.status === 'Qualified';
      if (activeTab === 'Working') return ['Negotiation', 'Contacted'].includes(lead.status);
      if (activeTab === 'Proposed') return lead.status === 'Proposal';
      if (activeTab === 'Won') return lead.status === 'Closed Won';
      return true;
    });
  }, [leads, searchQuery, activeTab]);

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <LeadsHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-8 space-y-8">
          <LeadStats leads={leads} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-50" />
                </div>
                <input
                  type="text"
                  placeholder="search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-[320px] rounded-full border border-transparent bg-gray-100 pl-10 pr-4 text-sm focus:bg-white focus:border-gray-200 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 filter invert brightness-0" />
              Add Lead
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <LeadFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              leadsCount={leads.length}
              stats={filterStats}
            />

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No leads found</div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"}>
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    viewMode={viewMode}
                    activeDropdownId={activeDropdownId}
                    setActiveDropdownId={setActiveDropdownId}
                    onEdit={(l) => { setSelectedLead(l); setIsEditModalOpen(true); }}
                    onDelete={handleDeleteLead}
                    onArchive={handleArchiveLead}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedLead(null); }}
        onSubmit={handleUpdateLead}
        lead={selectedLead}
      />
    </div>
  );
}