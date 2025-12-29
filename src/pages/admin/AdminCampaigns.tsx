import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import CampaignsHeader from '../../components/CampaignsHeader';
import CampaignCard from '../../components/CampaignCard';
import { campaignsApi } from '../../api/campaigns';
import type { Campaign } from '../../api/campaigns';
import { templatesApi, type EmailTemplate } from '../../api/templates';
import CreateCampaignModal from '../../components/CreateCampaignModal';
import CreateTemplateModal from '../../components/CreateTemplateModal';
import CampaignSettingsModal from '../../components/CampaignSettingsModal';

export default function AdminCampaigns() {
  const { isExpanded } = useSidebar();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignsApi.getAll();
      setCampaigns(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await templatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        {/* Top Global Header */}
        <CampaignsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">

          {/* Admin Banner */}
          <div className="mt-6 mb-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Administrator View</h3>
                  <p className="text-sm text-white/80">Viewing all campaigns across all users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Header / Controls Section */}
          <div className="mt-8 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Email Campaign</h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
                >
                  <img src="/icons/settings-icon.svg" alt="Settings" className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.98]"
                >
                  Create Campaign
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <img src="/icons/search-icon.svg" alt="" className="h-4 w-4 opacity-50" />
                  </div>
                  <input
                    type="text"
                    placeholder="search for campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-[300px] rounded-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex h-10 items-center gap-2 rounded-full border border-gray-100 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <span className="capitalize">{statusFilter === 'all' ? 'Status' : statusFilter}</span>
                    <svg className={`h-4 w-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isStatusDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsStatusDropdownOpen(false)}
                      ></div>
                      <div className="absolute left-0 mt-2 z-20 w-40 origin-top-left rounded-xl border border-gray-100 bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-200">
                        {['all', 'draft', 'scheduled', 'sending', 'sent', 'failed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsStatusDropdownOpen(false);
                            }}
                            className={`flex w-full items-center px-4 py-2 text-sm capitalize transition-colors ${statusFilter === status
                              ? 'bg-gray-50 font-bold text-black'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pagination / Count */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  {campaigns.length > 0 ? `1-${filteredCampaigns.length}` : '0'}
                </span>
                of {campaigns.length} pages
                <div className="flex gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex h-64 items-center justify-center text-gray-500">
                Loading campaigns...
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                <p className="text-lg font-medium text-gray-900">No campaigns found</p>
                <p className="text-sm">Create a new campaign to get started</p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onRefresh={handleRefresh}
                  onEdit={(c) => {
                    setEditingCampaign(c);
                    setIsCreateModalOpen(true);
                  }}
                  isSelected={selectedIds.has(campaign.id)}
                  onToggleSelect={() => toggleSelect(campaign.id)}
                />
              ))
            )}
          </div>

          {/* Templates Section */}
          <div className="mt-16 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Email Templates</h2>
                <p className="text-sm text-gray-500">Reusable designs for your campaigns</p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
              >
                <img src="/icons/add-icon.svg" alt="" className="h-4 w-4" />
                Create Template
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTemplates ? (
                <div className="col-span-full flex h-32 items-center justify-center text-gray-400 text-sm">
                  Loading templates...
                </div>
              ) : templates.length === 0 ? (
                <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 text-gray-500">
                  <p className="font-medium text-gray-900">No templates yet</p>
                  <p className="text-sm">Create templates to reuse them in campaigns</p>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-black group-hover:text-white">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 font-bold text-gray-900">{template.name}</h3>
                    <p className="mb-4 text-xs text-gray-500 line-clamp-2">
                      {template.description || 'No description provided'}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        Edited {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTemplate(template);
                            setIsTemplateModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <img src="/icons/edit-icon.svg" alt="Edit" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this template?')) {
                              await templatesApi.delete(template.id);
                              fetchTemplates();
                            }
                          }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <img src="/icons/delete-icon.svg" alt="Delete" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Campaign Modal */}
        {isCreateModalOpen && (
          <CreateCampaignModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditingCampaign(null);
            }}
            onSuccess={() => {
              fetchCampaigns();
              setIsCreateModalOpen(false);
              setEditingCampaign(null);
            }}
            campaignToEdit={editingCampaign}
          />
        )}

        {/* Template Modal */}
        {isTemplateModalOpen && (
          <CreateTemplateModal
            isOpen={isTemplateModalOpen}
            onClose={() => {
              setIsTemplateModalOpen(false);
              setEditingTemplate(null);
            }}
            onSuccess={() => {
              fetchTemplates();
              setIsTemplateModalOpen(false);
              setEditingTemplate(null);
            }}
            templateToEdit={editingTemplate}
          />
        )}

        {/* Settings Modal */}
        {isSettingsModalOpen && (
          <CampaignSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
