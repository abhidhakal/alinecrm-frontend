import { useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import CampaignsHeader from '../../features/campaigns/components/CampaignsHeader';
import CampaignCard from '../../features/campaigns/components/CampaignCard';
import { useGetAllCampaigns, useGetAllTemplates, useDeleteTemplate } from '../../api/campaigns.api';
import type { Campaign, EmailTemplate } from '../../types/campaign.types';
import CreateCampaignModal from '../../features/campaigns/components/CreateCampaignModal';
import CreateTemplateModal from '../../features/campaigns/components/CreateTemplateModal';
import CampaignSettingsModal from '../../features/campaigns/components/CampaignSettingsModal';
import AdminViewBanner from '../../features/admin/components/AdminViewBanner';

export default function AdminCampaigns() {
  const { isExpanded } = useSidebar();

  // React Query Hooks
  const { data: campaigns = [], isLoading: loadingCampaigns, refetch: refetchCampaigns } = useGetAllCampaigns();
  const { data: templates = [], isLoading: loadingTemplates, refetch: refetchTemplates } = useGetAllTemplates();
  const deleteTemplateMutation = useDeleteTemplate();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleDeleteTemplate = async (id: number) => {
    if (window.confirm('Delete this template?')) {
      await deleteTemplateMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <CampaignsHeader onRefresh={refetchCampaigns} lastUpdated={new Date()} />

        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <AdminViewBanner
            label="Viewing all campaigns across all users"
            stats={`${campaigns.length} Total Campaigns`}
          />

          <div className="mt-8 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Email Campaign</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 text-gray-400 hover:text-gray-600">
                  <img src="/icons/settings-icon.svg" alt="Settings" className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                  Create Campaign
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <img src="/icons/search-icon.svg" alt="" className="h-4 w-4 opacity-50" />
                  </div>
                  <input
                    type="text"
                    placeholder="search for campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-[300px] rounded-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-sm focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex h-10 items-center gap-2 rounded-full border border-gray-100 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span className="capitalize">{statusFilter === 'all' ? 'Status' : statusFilter}</span>
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 mt-2 z-20 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                      {['all', 'draft', 'scheduled', 'sending', 'sent', 'failed'].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setStatusFilter(s); setIsStatusDropdownOpen(false); }}
                          className="flex w-full px-4 py-2 text-sm capitalize hover:bg-gray-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loadingCampaigns ? (
              <div className="py-20 text-center text-gray-500">Loading...</div>
            ) : filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onRefresh={refetchCampaigns}
                onEdit={(c) => {
                  setEditingCampaign(c);
                  setIsCreateModalOpen(true);
                }}
                isSelected={selectedIds.has(campaign.id)}
                onToggleSelect={() => toggleSelect(campaign.id)}
              />
            ))}
          </div>

          <div className="mt-16 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Email Templates</h2>
                <p className="text-sm text-gray-500">Reusable designs for your campaigns</p>
              </div>
              <button onClick={() => setIsTemplateModalOpen(true)} className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold">
                Create Template
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTemplates ? (
                <div className="py-10 text-center text-gray-400">Loading templates...</div>
              ) : templates.map((template) => (
                <div key={template.id} className="rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md bg-white">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{template.description}</p>
                  <div className="mt-4 flex justify-between pt-4 border-t border-gray-50">
                    <button onClick={() => { setEditingTemplate(template); setIsTemplateModalOpen(true); }} className="text-sm font-medium text-blue-600">Edit</button>
                    <button onClick={() => handleDeleteTemplate(template.id)} className="text-sm font-medium text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <CreateCampaignModal
          isOpen={isCreateModalOpen}
          onClose={() => { setIsCreateModalOpen(false); setEditingCampaign(null); }}
          onSuccess={() => { refetchCampaigns(); setIsCreateModalOpen(false); setEditingCampaign(null); }}
          campaignToEdit={editingCampaign}
        />

        <CreateTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => { setIsTemplateModalOpen(false); setEditingTemplate(null); }}
          onSuccess={() => { refetchTemplates(); setIsTemplateModalOpen(false); setEditingTemplate(null); }}
          templateToEdit={editingTemplate}
        />

        <CampaignSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </div>
    </div>
  );
}
