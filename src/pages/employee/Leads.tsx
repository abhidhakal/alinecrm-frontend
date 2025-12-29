import { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import LeadsHeader from "../../components/LeadsHeader";
import AddLeadModal from "../../components/AddLeadModal";
import EditLeadModal from "../../components/EditLeadModal";
import { leadsApi, type Lead, type CreateLeadDto, type UpdateLeadDto } from "../../api/leads";
import { useCurrency } from "../../context/CurrencyContext";

export default function Leads() {
  const { isExpanded } = useSidebar();
  const { formatCurrency } = useCurrency();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.getAll();
      setLeads(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdownId !== null && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownId]);

  const handleCreateLead = async (data: CreateLeadDto) => {
    await leadsApi.create(data);
    fetchLeads();
  };

  const handleUpdateLead = async (id: number, data: UpdateLeadDto) => {
    await leadsApi.update(id, data);
    fetchLeads();
  };

  const handleDeleteLead = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await leadsApi.delete(id);
      fetchLeads();
    }
    setActiveDropdownId(null);
  };

  const handleArchiveLead = async (id: number) => {
    await leadsApi.update(id, { status: 'Archived' as any });
    fetchLeads();
    setActiveDropdownId(null);
  };

  // Calculate Stats
  const stats = {
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    working: leads.filter(l => ['Negotiation', 'Proposal'].includes(l.status)).length,
    cancelled: leads.filter(l => l.status === 'Closed Lost').length,
    pipelineValue: leads.filter(l => l.status !== 'Closed Lost').reduce((acc, curr) => acc + (curr.potentialValue || 0), 0),
    winRate: leads.length > 0
      ? Math.round((leads.filter(l => l.status === 'Closed Won').length / leads.length) * 100)
      : 0
  };

  // Filter Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'New') return lead.status === 'New';
    if (activeTab === 'Qualified') return lead.status === 'Qualified';
    if (activeTab === 'Working') return ['Negotiation', 'Contacted'].includes(lead.status);
    if (activeTab === 'Proposed') return lead.status === 'Proposal';

    return true;
  });

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        <LeadsHeader
          onRefresh={fetchLeads}
          lastUpdated={lastUpdated}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-12 gap-6">
            {/* New Leads Card */}
            <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white">
                  <img src="/icons/add-icon-filled.svg" alt="New" className="h-8 w-8 invert brightness-0" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-500">New Leads</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.new}</p>
                </div>
              </div>
            </div>

            {/* Contacted Leads Card */}
            <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white">
                  <img src="/icons/call-icon-filled.svg" alt="Contacted" className="h-8 w-8 invert brightness-0" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-500">Contacted</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.contacted}</p>
                </div>
              </div>
            </div>

            {/* Win Rate Card */}
            <div className="col-span-3 flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
                  <span className="text-2xl font-bold text-purple-600">%</span>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-500">Win Rate</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.winRate}%</p>
                </div>
              </div>
            </div>

            {/* Status Breakdown Card */}
            <div className="col-span-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="mb-4 text-sm font-medium text-gray-500">Pipeline Status</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Qualified</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.qualified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Working</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.working}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Cancelled</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.cancelled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-50" />
                </div>
                <input
                  type="text"
                  placeholder="search for existing leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-[320px] rounded-full border border-transparent bg-gray-100 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-[16px] font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <img src="/icons/plus-icon.svg" alt="Add" className="h-6 w-6 filter invert brightness-0" />
                Add Lead
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Tabs & Filters */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex gap-8">
                {['All', 'New', 'Qualified', 'Working', 'Proposed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-4 text-sm font-medium transition-colors ${activeTab === tab
                      ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {tab === 'All' ? leads.length :
                        tab === 'New' ? stats.new :
                          tab === 'Qualified' ? stats.qualified :
                            tab === 'Working' ? stats.working + stats.contacted :
                              tab === 'Proposed' ? leads.filter(l => l.status === 'Proposal').length : 0}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <img src="/icons/filter-list-on.svg" alt="Filter" className="h-4 w-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <img src="/icons/export-icn.svg" alt="Export" className="h-4 w-4" />
                  Export Data
                </button>
                <div className="flex rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-1 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <img src="/icons/grid-view-icon-filled.svg" alt="Grid" className={`h-4 w-4 ${viewMode === 'grid' ? '' : 'opacity-50'}`} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-1 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <img src="/icons/list-view-icon.svg" alt="List" className={`h-4 w-4 ${viewMode === 'list' ? '' : 'opacity-50'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Leads Content */}
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No leads found</div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsEditModalOpen(true);
                    }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                          {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <p className="text-xs font-medium text-gray-500">{lead.jobTitle || 'No Title'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="relative dropdown-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === lead.id ? null : lead.id);
                            }}
                            className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <img src="/icons/more-vertical.svg" alt="More" className="h-4 w-4" />
                          </button>

                          {activeDropdownId === lead.id && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveLead(lead.id);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <img src="/icons/archive-icon.svg" alt="" className="h-4 w-4" />
                                Archive
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <img src="/icons/delete-icon.svg" alt="" className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="mb-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                          <img src="/icons/mail-icon.svg" alt="Email" className="h-3.5 w-3.5 opacity-60" />
                        </div>
                        <span className="truncate font-medium">{lead.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                          <img src="/icons/call-icon.svg" alt="Phone" className="h-3.5 w-3.5 opacity-60" />
                        </div>
                        <span className="font-medium">{lead.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                          <img src="/icons/location-icon.svg" alt="Location" className="h-3.5 w-3.5 opacity-60" />
                        </div>
                        <span className="font-medium">{lead.companyName || 'No Company'}</span>
                      </div>
                      {(lead.source || lead.inquiredFor) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lead.source && (
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                              {lead.source}
                            </span>
                          )}
                          {lead.inquiredFor && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {lead.inquiredFor}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${lead.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          lead.status === 'Qualified' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                            lead.status === 'Closed Won' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                              'bg-gray-50 text-gray-600 ring-gray-500/20'
                          }`}>
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${lead.status === 'New' ? 'bg-blue-600' :
                            lead.status === 'Qualified' ? 'bg-green-600' :
                              lead.status === 'Closed Won' ? 'bg-purple-600' :
                                'bg-gray-500'
                            }`}></span>
                          {lead.status}
                        </span>
                        {lead.assignedTo && lead.assignedTo.length > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1.5">
                              {lead.assignedTo.slice(0, 2).map((user) => (
                                user.profilePicture ? (
                                  <img
                                    key={user.id}
                                    src={user.profilePicture}
                                    alt={user.name}
                                    title={user.name}
                                    className="h-5 w-5 rounded-full ring-2 ring-white object-cover"
                                  />
                                ) : (
                                  <div
                                    key={user.id}
                                    className="h-5 w-5 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center"
                                    title={user.name}
                                  >
                                    <span className="text-[8px] font-bold text-gray-600">
                                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                    </span>
                                  </div>
                                )
                              ))}
                            </div>
                            {lead.assignedTo.length > 2 && (
                              <span className="text-[10px] font-bold text-gray-600">+{lead.assignedTo.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Potential Value</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(lead.potentialValue || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsEditModalOpen(true);
                    }}
                    className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar & Name */}
                      <div className="flex items-center gap-4 min-w-[240px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                          {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <p className="text-xs font-medium text-gray-500">{lead.jobTitle || 'No Title'}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                            <img src="/icons/mail-icon.svg" alt="Email" className="h-3.5 w-3.5 opacity-60" />
                          </div>
                          <span className="truncate max-w-[180px]">{lead.email || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                            <img src="/icons/call-icon.svg" alt="Phone" className="h-3.5 w-3.5 opacity-60" />
                          </div>
                          <span>{lead.phone || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                            <img src="/icons/location-icon.svg" alt="Location" className="h-3.5 w-3.5 opacity-60" />
                          </div>
                          <span>{lead.companyName || '-'}</span>
                        </div>
                      </div>

                      {/* Source & Service */}
                      <div className="flex flex-col gap-1 text-xs text-gray-500 min-w-[120px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-700">Source:</span>
                          <span>{lead.source || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-700">Service:</span>
                          <span className="truncate max-w-[100px]" title={lead.inquiredFor}>{lead.inquiredFor || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-8">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${lead.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                        lead.status === 'Qualified' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          lead.status === 'Closed Won' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                            'bg-gray-50 text-gray-600 ring-gray-500/20'
                        }`}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${lead.status === 'New' ? 'bg-blue-600' :
                          lead.status === 'Qualified' ? 'bg-green-600' :
                            lead.status === 'Closed Won' ? 'bg-purple-600' :
                              'bg-gray-500'
                          }`}></span>
                        {lead.status}
                      </span>

                      <div className="text-right min-w-[100px]">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Value</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(lead.potentialValue || 0)}
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="relative dropdown-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === lead.id ? null : lead.id);
                            }}
                            className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <img src="/icons/more-vertical.svg" alt="More" className="h-4 w-4" />
                          </button>

                          {activeDropdownId === lead.id && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveLead(lead.id);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <img src="/icons/archive-icon.svg" alt="" className="h-4 w-4" />
                                Archive
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <img src="/icons/delete-icon.svg" alt="" className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleUpdateLead}
        lead={selectedLead}
      />
    </div>
  );
}