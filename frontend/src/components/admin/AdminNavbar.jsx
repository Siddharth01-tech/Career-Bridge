import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

export default function AdminNavbar({ 
  onToggleMobile, 
  isLiveApi = false,
  unreadCount = 0
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminName = user?.name || 'Administrator';
  const initial = adminName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch {
      navigate('/signin');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger on mobile + Welcome Message */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand mark on mobile */}
        <div className="md:hidden">
          <BrandLogo size="sm" showText={false} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-tight">
              Welcome, {adminName}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A0A]" />
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Platform-wide governance, moderation, and user management.
          </p>
        </div>
      </div>

      {/* Right side: Live API Pill, Notification Bell, Profile Avatar Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* API Status Pill */}
        <div 
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isLiveApi 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' 
              : 'bg-slate-50 text-slate-600 border-slate-200/80'
          }`}
          title={isLiveApi ? 'Connected to live CareerBridge backend' : 'CareerBridge platform ready'}
        >
          <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span>{isLiveApi ? 'Backend Live' : 'System Ready'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A0A] ring-2 ring-white"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Admin Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-[#FF5A0A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-50 text-xs">
                <div className="py-8 px-4 text-center text-xs text-slate-400">
                  No new administrative notifications
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            aria-expanded={dropdownOpen}
            aria-label="User account menu"
          >
            <div className="w-7 h-7 rounded-full bg-[#080D1C] text-[#FF5A0A] font-bold text-xs flex items-center justify-center shadow-2xs">
              {initial}
            </div>
            <span className="text-xs font-bold text-slate-900 hidden sm:inline-block max-w-[100px] truncate">
              {adminName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-950 truncate">{adminName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5A0A] font-bold text-[10px] uppercase">
                  Administrator
                </span>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
