import React, { useState } from 'react';
import { useBroadcastAnnouncement } from '../../../api/notifications.api';
import { useToast } from '../../../context/ToastContext';

interface AdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAnnouncementModal({ isOpen, onClose }: AdminAnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const broadcastMutation = useBroadcastAnnouncement();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      await broadcastMutation.mutateAsync({ title, message, link: link || undefined });
      showToast('Announcement broadcasted successfully!', 'success');
      setTitle('');
      setMessage('');
      setLink('');
      onClose();
    } catch (error) {
      showToast('Failed to broadcast announcement.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Announcement</h2>
              <p className="text-sm text-gray-500 mt-1">Broadcast a message to all active users</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src="/icons/close-icon-large.svg" className="w-5 h-5 opacity-40" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Office Maintenance Scheduled"
                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details here..."
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all resize-none text-sm font-medium leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Optional Link (URL)</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g., /dashboard or https://..."
                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={broadcastMutation.isPending}
                className="flex-[2] h-14 rounded-2xl bg-black text-white font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {broadcastMutation.isPending ? 'Sending...' : 'Broadcast Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
