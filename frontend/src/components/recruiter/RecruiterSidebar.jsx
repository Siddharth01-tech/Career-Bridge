import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  LogOut, 
  X,
  ExternalLink,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

export default function RecruiterSidebar({ 
  mobileOpen, 
  onCloseMobile, 
  activeTab = 'dashboard', 
  onSelectTab,
  onManageJobsClick,
  onApplicantsClick,
  onCompanyProfileClick,
  onPostJobClick,
  jobCount = 4,
  applicantCount = 8,
  companyName = 'Starlight AI'
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
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: activeTab === 'dashboard',
      action: () => {
        onSelectTab?.('dashboard');
        onCloseMobile?.();
      },
    },
    {
      id: 'jobs',
      label: 'My Requisitions',
      icon: Briefcase,
      active: activeTab === 'jobs',
      badge: String(jobCount),
      action: () => {
        onSelectTab?.('jobs');
        onManageJobsClick?.();
        onCloseMobile?.();
      },
    },
    {
      id: 'applicants',
      label: 'Applicants',
      icon: Users,
      active: activeTab === 'applicants',
      badge: String(applicantCount),
      action: () => {
        onSelectTab?.('applicants');
        onApplicantsClick?.();
        onCloseMobile?.();
      },
    },
    {
      id: 'company',
      label: 'Company Profile',
      icon: Building2,
      active: activeTab === 'company',
      action: () => {
        onSelectTab?.('company');
        onCompanyProfileClick?.();
        onCloseMobile?.();
      },
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 text-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100">
        <BrandLogo size="md" subtitle="Recruiter Portal" />

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-orange-50/90 text-[#D9480F] font-semibold border-l-4 border-[#FF5A0A] shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#FF5A0A]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
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

        {/* Quick Action: Post New Job */}
        <div className="pt-3 px-1">
          <button
            type="button"
            onClick={() => {
              onPostJobClick?.();
              onCloseMobile?.();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A0A] hover:bg-[#E44D00] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Requisition</span>
          </button>
        </div>

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
          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5A0A] font-bold text-xs flex items-center justify-center border border-orange-200 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user?.name || 'Recruiter'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {companyName || user?.email || 'recruiter@company.com'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

