import { useState } from 'react';
import { Search, Users, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminWelcomeCard({ 
  adminName = 'Administrator',
  onSearch,
  onManageUsersClick,
  onManageJobsClick
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.({
      search: searchTerm.trim(),
      role: filterRole || undefined,
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilterRole('');
    onSearch?.({ search: '', role: undefined });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Decorative ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header Row: Welcome & Platform Health */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          {/* Tag & Admin Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A0A] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
              <span>Platform Administration</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {adminName} (Super Admin)
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080D1C] tracking-tight">
            Oversee users, jobs, and platform integrity.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Govern registered candidate and recruiter accounts, enforce security policies, and moderate active job requisitions across the CareerBridge network.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onManageUsersClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <Users className="w-4 h-4" />
              <span>Review Users</span>
            </button>

            <button
              type="button"
              onClick={onManageJobsClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Moderate Jobs</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Administrative controls active
            </span>
          </div>
        </div>

        {/* Security & Health Widget */}
        <div className="self-start lg:self-center shrink-0">
          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#080D1C] text-[#FF5A0A] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#FF5A0A]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                System Status
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Operational</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium text-xs">Security OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Search Bar */}
      <form onSubmit={handleSearchSubmit} className="pt-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/80">
          {/* Keyword / Name / Email input */}
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <Search className="w-4 h-4 text-[#FF5A0A] shrink-0" />
            <input
              type="text"
              placeholder="Search users by name, email, or jobs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400"
              aria-label="Search users or jobs"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="w-full lg:w-48 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-slate-700 cursor-pointer"
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Search</span>
            </button>

            {(searchTerm || filterRole) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

