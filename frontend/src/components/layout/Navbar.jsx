import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onOpenAuth, onOpenPostJob }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
                <path d="M6 18a9 9 0 0 1 12 0" stroke="#FF5C00" />
              </svg>
            </div>
            <span className="text-[21px] font-bold text-gray-950 tracking-tight">
              CareerBridge
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-gray-700">
            <a href="#find-jobs" className="hover:text-black transition-colors">
              Find Jobs
            </a>
            <a href="#companies" className="hover:text-black transition-colors">
              Companies
            </a>
            <a 
              href="#for-employers" 
              onClick={(e) => {
                e.preventDefault()
                onOpenPostJob?.()
              }}
              className="hover:text-black transition-colors cursor-pointer"
            >
              For Employers
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200/60"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5C00] font-bold text-xs flex items-center justify-center border border-orange-200">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize font-medium">
                    {user.role || 'Member'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-slate-200/80"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                to="/signin" 
                className="text-[14.5px] font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                Sign In
              </Link>

              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[14px] font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
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
        <div className="flex md:hidden items-center gap-3">
          {!isAuthenticated && (
            <Link 
              to="/signup" 
              className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-semibold"
            >
              Get Started
            </Link>
          )}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-3">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            <a href="#find-jobs" onClick={() => setMobileMenuOpen(false)}>Find Jobs</a>
            <a href="#companies" onClick={() => setMobileMenuOpen(false)}>Companies</a>
            <a href="#for-employers" onClick={() => { setMobileMenuOpen(false); onOpenPostJob?.(); }}>For Employers</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <hr className="border-gray-100" />
            
            {isAuthenticated && user ? (
              <div className="pt-1 pb-2 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5C00] font-bold text-xs flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{user.role} • {user.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left font-semibold text-red-600 flex items-center gap-2 text-xs pt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left font-semibold text-gray-900 block"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

