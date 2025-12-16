import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/aline-logo.svg';

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
    activeIcon: '/icons/filter-icon.svg',
    path: '/leads'
  },
  {
    name: 'Contacts',
    icon: '/icons/contact-icon.svg',
    activeIcon: '/icons/contact-icon.svg',
    path: '/contacts'
  },
  {
    name: 'Campaigns',
    icon: '/icons/campaign-icon.svg',
    activeIcon: '/icons/campaign-icon.svg',
    path: '/campaigns'
  },
  {
    name: 'Tasks',
    icon: '/icons/task-icon.svg',
    activeIcon: '/icons/task-icon.svg',
    path: '/tasks'
  },
  {
    name: 'Socials',
    icon: '/icons/social-icon.svg',
    activeIcon: '/icons/social-icon.svg',
    path: '/socials'
  },
];

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'John Doe';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase().substring(0, 2);

  return (
    <aside className="fixed left-4 top-4 z-40 h-[calc(100vh-32px)] w-[250px] flex flex-col rounded-[16px] border border-gray-200 bg-white px-4 py-4 shadow-sm transition-transform">

      {/* 1. Header: Logo */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="AlineCRM" className="h-9 w-9 rounded-full" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">AlineCRM</span>
        </Link>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <img src="/icons/sidebar-close-icon.svg" alt="Collapse" className="w-5 h-5" />
        </button>
      </div>

      {/* 2. User Profile Dropdown */}
      <div className="mb-8 flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-foreground">
            {userInitials}
          </div>
          <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">{userName}</span>
        </div>
        <img src="/icons/expand-icon.svg" alt="Expand" className="w-3 h-3 text-gray-400" />
      </div>

      {/* 3. Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <img
                src={isActive ? item.activeIcon : item.icon}
                alt={item.name}
                className="w-5 h-5 transition-transform duration-200"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 4. Footer & Sign Out */}
      <div className="mt-auto flex flex-col gap-4 pt-6">
        {/* Mindfulness Button */}
        <button className="group flex w-full items-center gap-3 rounded-2xl bg-[#1A1A1A] p-4 text-white shadow-lg shadow-gray-200 transition-all hover:bg-black hover:shadow-xl active:scale-[0.98]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <img src="/icons/mindfulness-icon.svg" alt="Mindfulness" className="w-5 h-5 invert brightness-0 filter" />
          </div>
          <span className="text-sm font-bold">Mindfulness</span>
        </button>

        {/* Sign Out */}
        <Link to="/login" className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors">
          <img src="/icons/logout-icon.svg" alt="Logout" className="w-4 h-4 opacity-70" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
