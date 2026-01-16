import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useDeleteAnnouncement } from '../api/notifications.api';
import { Trash2, Megaphone } from 'lucide-react';

export default function NotificationPanel() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'system'>('all');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const deleteMutation = useDeleteAnnouncement();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'announcements') return n.category === 'ANNOUNCEMENT';
    if (activeTab === 'system') return n.category === 'SYSTEM';
    return true;
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
      showToast('Marked as read', 'success');
    }
    if (notification.link) {
      // If admin, redirect to main admin pages instead of individual items for system notifs
      if (isAdmin && notification.category === 'SYSTEM') {
        const typeLinkMap: Record<string, string> = {
          'lead': '/admin/leads',
          'task': '/admin/tasks',
          'contact': '/admin/contacts',
          'campaign': '/admin/campaigns'
        };
        const targetPath = typeLinkMap[notification.type];
        if (targetPath) return navigate(targetPath);
      }
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    showToast('All notifications marked as read', 'success');
  };

  const handleDeleteAnnouncement = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (!confirm('Delete this announcement for everyone?')) return;
    try {
      await deleteMutation.mutateAsync(groupId);
      showToast('Announcement deleted', 'success');
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="flex flex-col h-[480px] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-primary hover:opacity-80 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 border-b border-gray-50 bg-gray-50/30">
        {(['all', 'announcements', 'system'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-3 text-xs font-bold capitalize transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <img src="/icons/notification-icon.svg" className="w-12 h-12 mb-2 grayscale" />
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                isAdmin={isAdmin}
                onDelete={(e) => n.groupId && handleDeleteAnnouncement(e, n.groupId)}
                onClick={() => handleNotificationClick(n)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer link to Announcements page */}
      <Link
        to="/announcements"
        className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-[10px] font-medium tracking-widest text-gray-400 hover:text-primary hover:bg-primary/5 transition-all border-t border-gray-100"
      >
        <Megaphone size={12} />
        View All Announcements
      </Link>
    </div>
  );
}

function NotificationItem({
  notification,
  onClick,
  isAdmin,
  onDelete
}: {
  notification: any,
  onClick: () => void,
  isAdmin: boolean,
  onDelete: (e: React.MouseEvent) => void
}) {
  const dateObj = new Date(notification.createdAt);
  const formattedTime = isNaN(dateObj.getTime()) ? 'Unknown time' : format(dateObj, 'hh:mm aa, MMM dd');

  const badgeColor = notification.category === 'ANNOUNCEMENT' ? 'bg-blue-100/50' : 'bg-gray-100/50';

  return (
    <button
      onClick={onClick}
      className={`w-full flex gap-4 px-6 py-4 text-left transition-all border-l-2 ${!notification.isRead
        ? 'bg-primary/[0.03] border-primary hover:bg-primary/[0.06]'
        : 'bg-white border-transparent hover:bg-gray-50'
        }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${badgeColor}`}>
        <img src="/icons/announcement-icon.svg" className="w-5 h-5 opacity-80" alt="Notification" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-bold truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
            {notification.title}
          </p>
          {!notification.isRead && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">New</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            </div>
          )}
        </div>
        <p className={`text-xs line-clamp-2 leading-relaxed mb-2 ${!notification.isRead ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
          {notification.message}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-tight">
            {formattedTime}
          </span>
          {notification.category === 'ANNOUNCEMENT' && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 uppercase tracking-wider">
              Announcement
            </span>
          )}
        </div>
      </div>

      {isAdmin && notification.category === 'ANNOUNCEMENT' && notification.groupId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="flex-shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-start"
          title="Delete for everyone"
        >
          <Trash2 size={14} />
        </button>
      )}
    </button>
  );
}
