import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="CareerBridge Logo" 
            className="w-6 h-6 object-cover rounded-[4px] block" 
          />
          <span className="text-[17px] font-bold text-gray-900 tracking-tight">
            CareerBridge
          </span>
        </Link>

        <p className="text-xs sm:text-[13px] text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} CareerBridge Inc. Professional Talent Infrastructure. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
