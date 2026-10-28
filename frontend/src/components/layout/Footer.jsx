import BrandLogo from '../common/BrandLogo';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-10 text-slate-500 text-xs sm:text-[13px]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Logo */}
        <BrandLogo size="sm" />

        {/* Center: Quick Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium" aria-label="Footer navigation">
          <a href="#privacy" className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]">
            Terms of Service
          </a>
          <a href="#security" className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]">
            Security
          </a>
          <a href="#support" className="hover:text-slate-950 transition-colors focus:outline-none focus-visible:text-[#FF5A0A]">
            Support
          </a>
        </nav>

        {/* Right: Copyright */}
        <p className="text-slate-400 text-center md:text-right">
          © {currentYear} CareerBridge Inc. Modern Talent Infrastructure.
        </p>

      </div>
    </footer>
  );
}
