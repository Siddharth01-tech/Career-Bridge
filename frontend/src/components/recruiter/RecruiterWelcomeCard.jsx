import { useState } from 'react';
import { Search, MapPin, Briefcase, Plus, Building2, ShieldCheck } from 'lucide-react';

export default function RecruiterWelcomeCard({ 
  recruiterName = 'Recruiter',
  companyName = 'Starlight AI',
  onSearch,
  onPostJobClick,
  onCompanyProfileClick 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.({
      search: searchTerm.trim(),
      location: locationTerm.trim(),
      jobType: jobType || undefined,
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocationTerm('');
    setJobType('');
    onSearch?.({ search: '', location: '', jobType: undefined });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Decorative subtle ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header Row: Welcome & Pipeline Health */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          {/* Tag & Recruiter Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A0A] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
              <span>Recruiter Workspace</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Hi, {recruiterName} ({companyName})
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080D1C] tracking-tight">
            Build and scale your dream team.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Publish open requisitions, manage active job listings, and review incoming candidate applications with ease.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPostJobClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post New Requisition</span>
            </button>

            <button
              type="button"
              onClick={onCompanyProfileClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Company Profile</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Verified corporate employer
            </span>
          </div>
        </div>

        {/* Pipeline Health Widget */}
        <div className="self-start lg:self-center shrink-0">
          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#080D1C] text-[#FF5A0A] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#FF5A0A]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Hiring Status
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>Active</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold text-xs">Direct Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Search Bar (Desktop & Responsive) */}
      <form onSubmit={handleSearchSubmit} className="pt-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/80">
          {/* Keyword / Role input */}
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <Search className="w-4 h-4 text-[#FF5A0A] shrink-0" />
            <input
              type="text"
              placeholder="Search your requisitions by title, skills, or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              aria-label="Filter requisitions by title or keyword"
            />
          </div>

          {/* Location input */}
          <div className="lg:w-60 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Location or 'Remote'"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              aria-label="Filter requisitions by location"
            />
          </div>

          {/* Job Type Select */}
          <div className="lg:w-44 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              aria-label="Filter requisitions by job type"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <span>Filter Jobs</span>
              <Search className="w-4 h-4" />
            </button>

            {(searchTerm || locationTerm || jobType) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-[#FF5A0A] transition-colors cursor-pointer"
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
