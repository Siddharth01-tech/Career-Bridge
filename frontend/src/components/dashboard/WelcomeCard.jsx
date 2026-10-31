import { useState } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, Zap } from 'lucide-react';

export default function WelcomeCard({ 
  candidateName = 'Candidate',
  onSearch,
  onBrowseClick 
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

      {/* Top Header Row: Welcome & Profile Strength */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          {/* Tag & Candidate Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A0A] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
              <span>Candidate Portal</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Hi, {candidateName}
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080D1C] tracking-tight">
            Your next opportunity starts here.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Explore curated jobs, track your applications, and take the next step in your career with transparent compensation.
          </p>

          {/* Quick Action Button */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            >
              <span>Browse Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Personalized for your career interests
            </span>
          </div>
        </div>

        {/* Profile Strength Widget */}
        <div className="self-start lg:self-center shrink-0">
          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#080D1C] text-[#FF5A0A] flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5 fill-[#FF5A0A]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Profile Status
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>Active</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold text-xs">Ready to Apply</span>
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
              placeholder="Role, skill, or keyword (e.g. Frontend, React)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              aria-label="Filter jobs by keyword or role"
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
              aria-label="Filter jobs by location"
            />
          </div>

          {/* Job Type Select */}
          <div className="lg:w-44 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              aria-label="Filter jobs by job type"
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
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
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
