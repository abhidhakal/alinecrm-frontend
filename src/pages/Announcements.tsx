import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AnnouncementsHeader from '../features/admin/components/AnnouncementsHeader';
import { useSidebar } from '../context/SidebarContext';
import { useNotifications } from '../context/NotificationContext';
import { useDeleteAnnouncement } from '../api/notifications.api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AdminAnnouncementModal from '../features/admin/components/AdminAnnouncementModal';
import { Megaphone, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function Announcements() {
  const { isExpanded } = useSidebar();
  const { notifications, refetch } = useNotifications();
  const { user } = useAuth();
  const { showToast } = useToast();
  const deleteMutation = useDeleteAnnouncement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  // Grouped announcements to avoid showing the same one multiple times on this specific page
  const uniqueAnnouncements = Array.from(
    new Map(
      notifications
        .filter(n => n.category === 'ANNOUNCEMENT')
        .filter(n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(n => [n.groupId || n.id, n])
    ).values()
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = async (groupId: string | undefined) => {
    if (!groupId) return;
    if (!confirm('Are you sure you want to delete this announcement for everyone?')) return;

    try {
      await deleteMutation.mutateAsync(groupId);
      showToast('Announcement deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete announcement', 'error');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white relative">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px]' : 'ml-[110px]'}`}>
        <AnnouncementsHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mt-1 font-medium">Stay updated with the latest company news and alerts.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                New Announcement
              </button>
            )}
          </div>

          <div className="grid gap-6">
            {uniqueAnnouncements.length === 0 ? (
              <div className="bg-white rounded-[32px] p-20 border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                  <Megaphone size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No announcements yet</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">When admins broadcast news, they will appear here for everyone.</p>
              </div>
            ) : (
              uniqueAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                          Official
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                          <Calendar size={14} />
                          {format(new Date(ann.createdAt), 'hh:mm aa, MMM dd')}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{ann.title}</h2>
                      <p className="text-gray-600 leading-relaxed max-w-4xl text-lg font-medium">
                        {ann.message}
                      </p>

                      {ann.link && (
                        <a
                          href={ann.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                          <LinkIcon size={16} />
                          Learn More
                        </a>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(ann.groupId || ann.id.toString())}
                        className="p-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                        title="Delete for everyone"
                      >
                        <Trash2 size={20} />
                        <span className="text-sm font-bold">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <AdminAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
