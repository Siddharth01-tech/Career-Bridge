import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

export default function Navbar({ onOpenPostJob }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-colors">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <BrandLogo size="md" />

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-slate-600" aria-label="Main navigation">
            <a 
              href="#featured-opportunities" 
              className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]"
            >
              Find Jobs
            </a>
            <a 
              href="#companies" 
              className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]"
            >
              Companies
            </a>
            <a 
              href="#for-employers" 
              onClick={(e) => {
                e.preventDefault();
                if (isAuthenticated && user?.role === 'recruiter') {
                  window.location.href = '/recruiter/dashboard';
                } else {
                  onOpenPostJob?.();
                }
              }}
              className="hover:text-slate-950 transition-colors cursor-pointer focus:outline-none focus-visible:text-[#FF5A0A]"
            >
              For Employers
            </a>
            <a 
              href="#pricing" 
              className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]"
            >
              Pricing
            </a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-[#FF5A0A] hover:bg-orange-100 transition-colors border border-orange-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
              >
                {user.role === 'recruiter' ? 'Recruiter Dashboard' : 'Dashboard'}
              </Link>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5A0A] font-bold text-xs flex items-center justify-center border border-orange-200 shadow-2xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize font-medium">
                    {user.role || 'Candidate'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                to="/signin" 
                className="text-[14.5px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer focus:outline-none focus-visible:text-[#FF5A0A]"
              >
                Sign In
              </Link>

              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#080D1C] hover:bg-slate-800 text-white text-[14px] font-semibold transition-all active:scale-95 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
              >
                <span>Get Started</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2.5">
          {!isAuthenticated && (
            <Link 
              to="/signup" 
              className="px-3.5 py-1.5 rounded-full bg-[#080D1C] text-white text-xs font-semibold shadow-2xs"
            >
              Get Started
            </Link>
          )}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 py-5 space-y-4 shadow-lg animate-in fade-in duration-150">
          <nav className="flex flex-col gap-3.5 text-sm font-semibold text-slate-700" aria-label="Mobile navigation">
            <a 
              href="#featured-opportunities" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#FF5A0A] py-1 transition-colors"
            >
              Find Jobs
            </a>
            <a 
              href="#companies" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#FF5A0A] py-1 transition-colors"
            >
              Companies
            </a>
            <a 
              href="#for-employers" 
              onClick={() => { 
                setMobileMenuOpen(false); 
                onOpenPostJob?.(); 
              }}
              className="hover:text-[#FF5A0A] py-1 transition-colors"
            >
              For Employers
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#FF5A0A] py-1 transition-colors"
            >
              Pricing
            </a>

            <hr className="border-slate-100" />
            
            {isAuthenticated && user ? (
              <div className="pt-1 pb-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF5A0A] font-bold text-xs flex items-center justify-center border border-orange-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{user.role} • {user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-orange-50 text-[#FF5A0A] font-bold text-xs border border-orange-200"
                  >
                    Go to {user.role === 'recruiter' ? 'Recruiter Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-red-600 font-semibold text-xs hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link 
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#080D1C] text-white font-bold text-sm shadow-xs hover:bg-slate-800 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
