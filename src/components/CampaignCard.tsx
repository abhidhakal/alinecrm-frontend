import { useState, useEffect, useRef } from 'react';
import { campaignsApi } from '../api/campaigns';
import type { Campaign } from '../api/campaigns';
import { useToast } from '../context/ToastContext';

interface CampaignCardProps {
  campaign: Campaign;
  onRefresh: () => void;
  onEdit: (campaign: Campaign) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export default function CampaignCard({
  campaign,
  onRefresh,
  onEdit,
  isSelected,
  onToggleSelect,
}: CampaignCardProps) {
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignsApi.delete(campaign.id);
        showToast('Campaign deleted successfully', 'success');
        onRefresh();
      } catch (error) {
        showToast('Failed to delete campaign', 'error');
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      await campaignsApi.duplicate(campaign.id);
      showToast('Campaign duplicated successfully', 'success');
      onRefresh();
    } catch (error) {
      showToast('Failed to duplicate campaign', 'error');
    }
  };

  const handleSend = async () => {
    if (window.confirm('Are you sure you want to send this campaign now?')) {
      try {
        await campaignsApi.send(campaign.id);
        showToast('Campaign sending started', 'success');
        onRefresh();
      } catch (error) {
        showToast('Failed to send campaign', 'error');
      }
    }
  };

  // Format date: "Nov 25, 2025 7:03am"
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  // Status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'sent':
      case 'completed':
        return { color: 'text-[#00A86B]', label: 'Complete', dot: 'bg-[#00A86B]' };
      case 'sending':
        return { color: 'text-orange-500', label: 'Running', dot: 'bg-orange-500' };
      case 'draft':
        return { color: 'text-gray-500', label: 'Draft', dot: 'bg-gray-400' };
      case 'failed':
        return { color: 'text-red-500', label: 'Failed', dot: 'bg-red-500' };
      default:
        return { color: 'text-gray-500', label: status, dot: 'bg-gray-400' };
    }
  };

  const statusConfig = getStatusConfig(campaign.status);

  // Calculate success rate (delivered / total)
  const successRate = campaign.sentCount > 0
    ? Math.round((campaign.sentCount / (campaign.totalRecipients || 1)) * 100)
    : 0;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:bg-gray-50 hover:shadow-sm">
      {/* Left Section: Info */}
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>

          <div className="mt-1 flex items-center gap-3 text-xs font-medium">
            <span className={`flex items-center gap-1.5 ${statusConfig.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}></span>
              {statusConfig.label}
            </span>
            <span className="text-gray-400">{formatDate(campaign.createdAt)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>{campaign.totalRecipients} contacts</span>
            <span>•</span>
            <span className="text-gray-900">{campaign.audienceFilters.source === 'contacts' ? 'Contacts' : 'Leads'}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-12">
        {/* Success */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500">Success</span>
          <span className="text-2xl font-bold text-gray-900">{successRate}%</span>
        </div>

        {/* Opens */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500">Opens</span>
          <span className="text-2xl font-bold text-[#00A86B]">{campaign.openCount}</span>
        </div>

        {/* Clicks */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500">Clicks</span>
          <span className="text-2xl font-bold text-blue-600">{campaign.clickCount}</span>
        </div>

        {/* Unsubscribed */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500">Unsubscribed</span>
          <span className="text-2xl font-bold text-gray-900">{campaign.unsubscribeCount}</span>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => {
                      onEdit(campaign);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Campaign
                  </button>
                )}

                {campaign.status === 'draft' && (
                  <button
                    onClick={() => {
                      handleSend();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Send Now
                  </button>
                )}

                {campaign.status === 'failed' && (
                  <button
                    onClick={() => {
                      handleSend();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Retry Sending
                  </button>
                )}

                <button
                  onClick={() => {
                    handleDuplicate();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Duplicate
                </button>

                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
