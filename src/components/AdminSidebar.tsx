import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/aline-logo.svg';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const adminNavItems = [
  {
    name: 'Dashboard',
    icon: '/icons/dashboard.svg',
    activeIcon: '/icons/dashboard-filled.svg',
    path: '/admin/dashboard'
  },
  {
    name: 'Users',
    icon: '/icons/account-icon.svg',
    activeIcon: '/icons/account-icon.svg',
    path: '/admin/users'
  },
  {
    name: 'Leads',
    icon: '/icons/filter-icon.svg',
    activeIcon: '/icons/filter-icon-filled.svg',
    path: '/admin/leads'
  },
  {
    name: 'Contacts',
    icon: '/icons/contact-icon.svg',
    activeIcon: '/icons/contact-icon-filled.svg',
    path: '/admin/contacts'
  },
  {
    name: 'Campaigns',
    icon: '/icons/campaign-icon.svg',
    activeIcon: '/icons/campaign-icon-filled.svg',
    path: '/admin/campaigns'
  },
  {
    name: 'Tasks',
    icon: '/icons/task-icon.svg',
    activeIcon: '/icons/task-icon-filled.svg',
    path: '/admin/tasks'
  },
  {
    name: 'Socials',
    icon: '/icons/social-icon.svg',
    activeIcon: '/icons/social-icon-filled.svg',
    path: '/admin/social-media'
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded } = useSidebar();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userName = user?.name || 'Admin';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase().substring(0, 2);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <>
    <aside
      className={`fixed left-4 top-4 z-40 h-[calc(100vh-32px)] flex flex-col rounded-[16px] border border-purple-200 bg-gradient-to-b from-purple-50 to-white shadow-sm transition-all duration-300 ${isExpanded ? 'w-[250px] px-4' : 'w-[80px] px-3'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Floating Expand/Collapse Button - Shows on hover */}
      {isHovered && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-purple-200 shadow-md hover:shadow-lg transition-all hover:scale-110"
        >
          <svg
            className={`w-3 h-3 text-purple-600 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 1. Header: Logo + Admin Badge */}
      <div className={`flex items-center mb-6 pt-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative">
            <img src={Logo} alt="AlineCRM" className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">AlineCRM</span>
              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. User Profile */}
      <div className={`relative mb-6 ${isExpanded ? 'px-2' : 'px-0'}`}>
        <div
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex cursor-pointer items-center rounded-2xl border border-transparent transition-all duration-200 ${isExpanded
            ? 'p-2 hover:bg-purple-50 hover:border-purple-200 justify-between'
            : 'p-2 justify-center hover:bg-purple-50'
            } ${isProfileOpen ? 'bg-purple-50 border-purple-200' : ''}`}
        >
          <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 border border-purple-200 text-sm font-bold text-purple-700 flex-shrink-0 shadow-sm">
              {userInitials}
            </div>
            {isExpanded && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-foreground truncate max-w-[120px] leading-tight">{userName}</span>
                <span className="text-[10px] font-semibold text-purple-600">Administrator</span>
              </div>
            )}
          </div>
          {isExpanded && (
            <img
              src="/icons/expand-icon.svg"
              alt="Expand"
              className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className={`absolute z-50 rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-200/50 p-1.5 flex flex-col gap-0.5 ${isExpanded ? 'left-2 right-2 top-full mt-2' : 'left-full top-0 ml-3 w-48'
            }`}>
            
            {/* Profile */}
            <button className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-900 transition-colors text-left group">
               <img src="/icons/account-icon.svg" alt="Profile" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
               Profile
            </button>

            {/* Settings */}
            <button className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-900 transition-colors text-left group">
               <img src="/icons/settings-icon.svg" alt="Settings" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
               Settings
            </button>

            <div className="h-px bg-purple-100 my-1 mx-2"></div>

            {/* Switch to User View */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Switch to User View
            </Link>

            <div className="h-px bg-purple-100 my-1 mx-2"></div>

            {/* Logout */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
            >
              <img src="/icons/logout-icon.svg" alt="Logout" className="w-4 h-4 opacity-80 group-hover:opacity-100" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* 3. Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.name} className="relative group">
              <Link
                to={item.path}
                className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${isExpanded ? 'gap-3 px-4' : 'justify-center px-3'
                  } ${isActive
                    ? 'bg-purple-100 text-purple-900 font-semibold'
                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-900'
                  }`}
              >
                <img
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.name}
                  className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`}
                />
                {isExpanded && item.name}
              </Link>

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-purple-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-purple-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 4. Footer */}
      <div className="mt-auto flex flex-col gap-4 pt-6 pb-4">
        {/* User View Button */}
        <div className="relative group">
          <Link to="/dashboard" className={`group flex w-full items-center rounded-2xl bg-white border border-gray-200 p-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-[0.98] ${isExpanded ? 'gap-3' : 'justify-center'
            }`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            {isExpanded && <span className="text-sm font-bold">User View</span>}
          </Link>

          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              User View
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </aside>

    <LogoutConfirmationModal
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      onConfirm={handleLogout}
    />
    </>
  );
}
