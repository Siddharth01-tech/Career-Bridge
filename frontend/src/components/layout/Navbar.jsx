import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1320px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="CareerBridge Logo" 
              className="w-7 h-7 object-cover rounded-[5px] block transition-transform group-hover:scale-105" 
            />
            <span className="text-[19px] font-bold text-gray-900 tracking-tight">
              CareerBridge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="#find-jobs" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Find Jobs
            </a>
            <a 
              href="#companies" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Companies
            </a>
          </nav>
        </div>

        {/* Right Side: Auth actions */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="px-3.5 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Login
          </button>
          <button 
            type="button" 
            className="px-4 py-1.5 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            SignUp
          </button>
          <button 
            type="button" 
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Account profile"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  )
}
