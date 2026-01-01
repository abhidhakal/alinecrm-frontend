import { useState, useEffect } from 'react';
import { campaignsApi } from '../../../api/clients/campaigns.client';
import { useToast } from '../../../context/ToastContext';

interface CampaignSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignSettingsModal({ isOpen, onClose }: CampaignSettingsModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'unsubscribe'>('general');
  const [unsubscribed, setUnsubscribed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [reason, setReason] = useState('');

  const fetchUnsubscribed = async () => {
    try {
      setLoading(true);
      const data = await campaignsApi.getUnsubscribed();
      setUnsubscribed(data.items);
    } catch (error) {
      console.error('Failed to fetch unsubscribed emails', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'unsubscribe') {
      fetchUnsubscribed();
    }
  }, [isOpen, activeTab]);

  const handleAddUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    try {
      await campaignsApi.addUnsubscribed(newEmail, reason);
      showToast('Email added to unsubscribe list', 'success');
      setNewEmail('');
      setReason('');
      fetchUnsubscribed();
    } catch (error) {
      showToast('Failed to add email', 'error');
    }
  };

  const handleRemoveUnsubscribe = async (email: string) => {
    try {
      await campaignsApi.removeUnsubscribed(email);
      showToast('Email removed from unsubscribe list', 'success');
      fetchUnsubscribed();
    } catch (error) {
      showToast('Failed to remove email', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex h-[80vh] w-[700px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-xl font-bold text-gray-900">Campaign Settings</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`border-b-2 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'general' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('unsubscribe')}
            className={`border-b-2 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'unsubscribe' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            Global Unsubscribes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Technical Configuration</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Active Provider</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      Brevo (SMTP)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Sender Identity</span>
                    <span className="text-sm font-medium text-gray-900">hi.alinecrm@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Base App URL</span>
                    <span className="text-sm font-medium text-gray-900">https://alinecrm.com</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Compliance Settings</h3>
                <p className="text-xs text-gray-500">These settings help ensure your campaigns remain in compliance with email marketing laws.</p>
                <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50/50 p-4">
                  <div className="flex gap-3">
                    <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs leading-relaxed text-yellow-800">
                      Auto-unsubscribe is active. All templates must include the <code>&#123;&#123;unsubscribe_url&#125;&#125;</code> tag.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'unsubscribe' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Manual Unsubscribe</h3>
                <p className="text-xs text-gray-500">Add an email address to the global suppression list to prevent future sends.</p>
              </div>

              <form onSubmit={handleAddUnsubscribe} className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-5">
                  <input
                    required
                    type="email"
                    placeholder="Email address..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <input
                    type="text"
                    placeholder="Reason (optional)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-black transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-12 md:col-span-2 rounded-xl bg-black py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
                >
                  Add
                </button>
              </form>

              <div className="h-px bg-gray-100"></div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Blocked Emails ({unsubscribed.length})</h3>
                {loading ? (
                  <p className="py-4 text-center text-sm text-gray-400">Loading list...</p>
                ) : unsubscribed.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">No emails in the suppression list.</p>
                ) : (
                  <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
                    {unsubscribed.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white first:rounded-t-2xl last:rounded-b-2xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.email}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">
                              {new Date(item.unsubscribedAt).toLocaleDateString()}
                            </span>
                            {item.reason && (
                              <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
                                • {item.reason}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUnsubscribe(item.email)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove from list (Resubscribe)"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-5 bg-gray-50/30">
          <p className="text-[10px] text-center text-gray-400">
            Suppression list updates are applied globally to all active and future campaigns.
          </p>
        </div>
      </div>
    </div>
  );
}
