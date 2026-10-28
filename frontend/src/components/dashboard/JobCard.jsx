import { useState } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Check, 
  ArrowUpRight
} from 'lucide-react';

export default function JobCard({ 
  job, 
  onApply, 
  isApplied = false,
  isBookmarked = false,
  onToggleBookmark 
}) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const nextState = !bookmarked;
    setBookmarked(nextState);
    onToggleBookmark?.(job.id, nextState);
  };

  // Company logo initial background color helper
  const getCompanyBg = (name = '') => {
    const colors = [
      'bg-orange-50 text-[#FF5A0A] border-orange-200/70',
      'bg-slate-100 text-slate-800 border-slate-200/80',
      'bg-amber-50 text-amber-700 border-amber-200/70',
      'bg-emerald-50 text-emerald-700 border-emerald-200/70',
      'bg-neutral-100 text-neutral-800 border-neutral-200/80',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

  const companyInitial = job.company_name?.charAt(0) || job.company?.charAt(0) || 'C';
  const companyName = job.company_name || job.company || 'TechCorp';
  const location = job.location || job.company_location || 'Remote';
  const jobType = job.job_type || job.jobType || 'Full-time';
  
  // Format salary
  const formatSalary = () => {
    if (job.salary) return job.salary;
    if (job.salary_min && job.salary_max) {
      return `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary_min) return `From $${Number(job.salary_min).toLocaleString()}`;
    return 'Competitive';
  };

  const skills = Array.isArray(job.skills) 
    ? job.skills 
    : (typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : []);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-orange-200/90 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Avatar + Name + Bookmark Icon */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center border shadow-2xs ${getCompanyBg(companyName)}`}>
              {companyInitial}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {companyName}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[170px]">{location}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{jobType}</span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-2 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A] ${
              bookmarked 
                ? 'text-[#FF5A0A] bg-orange-50 hover:bg-orange-100' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Save job'}
            aria-label={bookmarked ? 'Remove bookmark' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#FF5A0A]' : ''}`} />
          </button>
        </div>

        {/* Job Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-[#FF5A0A] transition-colors tracking-tight line-clamp-1 mb-2">
          {job.title}
        </h3>

        {/* Short Job Description */}
        <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description || 'Join our engineering team to build scalable cloud-native products and intuitive user interfaces.'}
        </p>

        {/* Skills Pills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-lg bg-slate-50 text-slate-400">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Compensation + Apply Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Compensation
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            {formatSalary()}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onApply?.(job)}
          disabled={isApplied}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A] ${
            isApplied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 cursor-default'
              : 'bg-[#080D1C] hover:bg-[#FF5A0A] text-white'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </>
          ) : (
            <>
              <span>Apply Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
