import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import CampaignsHeader from '../../components/CampaignsHeader';
import CampaignCard from '../../components/CampaignCard';
import { campaignsApi } from '../../api/campaigns';
import type { Campaign } from '../../api/campaigns';
import CreateCampaignModal from '../../components/CreateCampaignModal';

export default function Campaigns() {
  const { isExpanded } = useSidebar();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

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

  useEffect(() => {
    fetchCampaigns();
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

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        {/* Top Global Header */}
        <CampaignsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">

          {/* Sub Header / Controls Section */}
          <div className="mt-8 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Email Campaign</h2>

              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
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
                <button className="flex h-10 items-center gap-2 rounded-full border border-gray-100 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Status
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
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
        </main>

        {/* Modal */}
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
      </div>
    </div>
  );
}