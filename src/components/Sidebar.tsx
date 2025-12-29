import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/aline-logo.svg';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const navItems = [
  {
    name: 'Dashboard',
    icon: '/icons/dashboard.svg',
    activeIcon: '/icons/dashboard-filled.svg',
    path: '/dashboard'
  },
  {
    name: 'Leads',
    icon: '/icons/filter-icon.svg',
    activeIcon: '/icons/filter-icon-filled.svg',
    path: '/leads'
  },
  {
    name: 'Contacts',
    icon: '/icons/contact-icon.svg',
    activeIcon: '/icons/contact-icon-filled.svg',
    path: '/contacts'
  },
  {
    name: 'Campaigns',
    icon: '/icons/campaign-icon.svg',
    activeIcon: '/icons/campaign-icon-filled.svg',
    path: '/campaigns'
  },
  {
    name: 'Tasks',
    icon: '/icons/task-icon.svg',
    activeIcon: '/icons/task-icon-filled.svg',
    path: '/tasks'
  },
  {
    name: 'Socials',
    icon: '/icons/social-icon.svg',
    activeIcon: '/icons/social-icon-filled.svg',
    path: '/social-media'
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded } = useSidebar();
  const { isAdmin, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userName = user?.name || 'John Doe';
  const roleDisplay = user?.role === 'admin' ? 'Admin' : user?.role === 'superadmin' ? 'Super Admin' : 'User';
  const institutionName = user?.institutionName;

  const userDetails = institutionName
    ? `${institutionName}, ${roleDisplay}`
    : roleDisplay;

  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase().substring(0, 2);

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Close modals
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);

    // Redirect to login
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed left-4 top-4 z-40 h-[calc(100vh-32px)] flex flex-col rounded-[16px] border border-gray-200 bg-white shadow-sm transition-all duration-300 ${isExpanded ? 'w-[250px] px-4' : 'w-[80px] px-3'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* Floating Expand/Collapse Button - Shows on hover */}
        {isHovered && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <svg
              className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 1. Header: Logo */}
        <div className={`flex items-center mb-6 pt-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="AlineCRM" className="h-9 w-9 rounded-full flex-shrink-0" />
            {isExpanded && <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">AlineCRM</span>}
          </Link>
        </div>

        {/* 2. User Profile */}
        <div className={`relative mb-6 ${isExpanded ? 'px-2' : 'px-0'}`}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex cursor-pointer items-center rounded-2xl border border-transparent transition-all duration-200 ${isExpanded
              ? 'p-2 hover:bg-gray-50 hover:border-gray-200 justify-between'
              : 'p-2 justify-center hover:bg-gray-50'
              } ${isProfileOpen ? 'bg-gray-50 border-gray-200' : ''}`}
          >
            <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-sm font-bold text-foreground flex-shrink-0 shadow-sm overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              {isExpanded && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-foreground truncate max-w-[120px] leading-tight">{userName}</span>
                  <span className="text-[10px] font-medium text-gray-500 truncate" title={userDetails}>{userDetails}</span>
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
            <div className={`absolute z-50 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-1.5 flex flex-col gap-0.5 ${isExpanded ? 'left-2 right-2 top-full mt-2' : 'left-full top-0 ml-3 w-48'
              }`}>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left group"
              >
                <img src="/icons/account-icon.svg" alt="Profile" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                Profile
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left group"
              >
                <img src="/icons/settings-icon.svg" alt="Settings" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                Settings
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left group"
              >
                <img src="/icons/mail-icon.svg" alt="Contact" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                Contact
              </Link>

              <div className="h-px bg-gray-100 my-1 mx-2"></div>

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
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${isExpanded ? 'gap-3 px-4' : 'justify-center px-3'
                    } ${isActive
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.name}
                    className="w-5 h-5 transition-transform duration-200 flex-shrink-0"
                  />
                  {isExpanded && item.name}
                </Link>

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 4. Footer & Sign Out */}
        <div className="mt-auto flex flex-col gap-4 pt-6 pb-4">
          {/* Admin Panel Button - Only for Admins */}
          {isAdmin && (
            <div className="relative group">
              <Link to="/admin/dashboard" className={`group flex w-full items-center rounded-2xl bg-black p-2 text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-900 active:scale-[0.98] ${isExpanded ? 'gap-3' : 'justify-center'
                }`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {isExpanded && <span className="text-sm font-bold">Admin Panel</span>}
              </Link>

              {/* Tooltip */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Admin Panel
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          )}

          {/* Mindfulness Button */}
          <div className="relative group">
            <Link to="/mindfulness" className={`group flex w-full items-center rounded-2xl bg-[#1A1A1A] p-2 text-white shadow-lg shadow-gray-200 transition-all hover:bg-black hover:shadow-xl active:scale-[0.98] ${isExpanded ? 'gap-3' : 'justify-center'
              }`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                <img src="/icons/mindfulness-icon.svg" alt="Mindfulness" className="w-5 h-5 invert brightness-0 filter" />
              </div>
              {isExpanded && <span className="text-sm font-bold">Mindfulness</span>}
            </Link>

            {/* Tooltip for mindfulness in collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                Mindfulness
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
