import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

export default function AdminSidebar({ 
  mobileOpen, 
  onCloseMobile, 
  activeTab = 'dashboard', 
  onSelectTab,
  onManageUsersClick,
  onManageJobsClick,
  userCount = 0,
  jobCount = 0
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/signin');
    } catch {
      navigate('/signin');
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Admin Overview',
      icon: LayoutDashboard,
      active: activeTab === 'dashboard',
      action: () => {
        onSelectTab?.('dashboard');
        onCloseMobile?.();
      },
    },
    {
      id: 'users',
      label: 'Manage Users',
      icon: Users,
      active: activeTab === 'users',
      badge: userCount > 0 ? String(userCount) : undefined,
      action: () => {
        onSelectTab?.('users');
        onManageUsersClick?.();
        onCloseMobile?.();
      },
    },
    {
      id: 'jobs',
      label: 'Job Moderation',
      icon: Briefcase,
      active: activeTab === 'jobs',
      badge: jobCount > 0 ? String(jobCount) : undefined,
      action: () => {
        onSelectTab?.('jobs');
        onManageJobsClick?.();
        onCloseMobile?.();
      },
    },
    {
      id: 'platform',
      label: 'Platform Security',
      icon: ShieldCheck,
      active: activeTab === 'platform',
      action: () => {
        onSelectTab?.('platform');
        onCloseMobile?.();
      },
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 text-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100">
        <BrandLogo size="md" subtitle="Administration" />

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close sidebar navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Privilege Badge */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/80 border border-orange-200/70 text-[#FF5A0A]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Root Access Active</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                item.active
                  ? 'bg-orange-50 text-[#FF5A0A] shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.active ? 'text-[#FF5A0A]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span 
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.active 
                      ? 'bg-orange-100 text-[#D9480F]' 
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Link to Landing Page */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-orange-50/60 hover:text-[#FF5A0A] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Job Portal Home</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </Link>
        </div>
      </div>

      {/* User Info & Logout at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="px-3 py-2 flex items-center gap-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs mb-2">
          <div className="w-8 h-8 rounded-full bg-[#080D1C] text-[#FF5A0A] font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {user?.email || 'admin@careerbridge.io'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 transition-colors cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

