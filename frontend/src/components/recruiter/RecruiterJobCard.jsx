import { MapPin, Edit3, Trash2, Calendar, Award } from 'lucide-react';

export default function RecruiterJobCard({ 
  job, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) {
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
  const companyName = job.company_name || job.company || 'Company';
  const location = job.location || job.company_location || 'Remote';
  const jobType = job.job_type || job.jobType || 'Full-time';

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

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-orange-200/90 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Avatar + Name + Status Badge */}
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

          {/* Active Status Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Job Title */}
        <h3 
          onClick={() => onViewDetails?.(job)}
          className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-[#FF5A0A] transition-colors tracking-tight line-clamp-1 mb-2 cursor-pointer"
        >
          {job.title}
        </h3>

        {/* Short Job Description */}
        <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description || 'Open requisition for qualified engineers and product leaders.'}
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

        {/* Metadata info: Experience / Deadline */}
        {(job.experience !== null && job.experience !== undefined || job.deadline) && (
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4 pb-2 border-b border-slate-100">
            {job.experience !== null && job.experience !== undefined && (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-slate-400" />
                <span>{job.experience}+ yrs exp</span>
              </span>
            )}
            {formatDeadline(job.deadline) && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Closes {formatDeadline(job.deadline)}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Compensation + Recruiter Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Compensation
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            {formatSalary()}
          </div>
        </div>

        {/* Recruiter Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit?.(job)}
            className="p-2 rounded-xl text-slate-500 hover:text-[#FF5A0A] hover:bg-orange-50 border border-slate-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
            title="Edit Requisition"
            aria-label="Edit Requisition"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(job)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            title="Delete Requisition"
            aria-label="Delete Requisition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

