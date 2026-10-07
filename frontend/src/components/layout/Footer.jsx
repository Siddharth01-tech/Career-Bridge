import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-8 text-gray-500 text-xs sm:text-[13px]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
              <path d="M6 18a9 9 0 0 1 12 0" stroke="#FF5C00" />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-gray-950 tracking-tight">
            CareerBridge
          </span>
        </Link>

        {/* Center: Quick Links */}
        <div className="flex items-center gap-6 text-gray-600 font-medium">
          <a href="#privacy" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-black transition-colors">Security</a>
          <a href="#support" className="hover:text-black transition-colors">Support</a>
        </div>

        {/* Right: Copyright */}
        <p className="text-gray-400 text-center md:text-right">
          © {new Date().getFullYear()} CareerBridge Inc. Modern Talent Infrastructure. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
