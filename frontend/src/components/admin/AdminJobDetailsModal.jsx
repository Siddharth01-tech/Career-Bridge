import { X, Building2, MapPin, Briefcase, DollarSign, Calendar, UserCheck, Trash2, Tag } from 'lucide-react';

export default function AdminJobDetailsModal({
  job,
  isOpen,
  onClose,
  onDeleteJob
}) {
  if (!isOpen || !job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCompensation = (jobItem) => {
    if (jobItem.salary_min && jobItem.salary_max) {
      return `$${Number(jobItem.salary_min).toLocaleString()} - $${Number(jobItem.salary_max).toLocaleString()}`;
    }
    if (jobItem.salary) return jobItem.salary;
    return 'Competitive';
  };

  const skills = Array.isArray(job.skills) 
    ? job.skills 
    : (typeof job.skills === 'string' ? job.skills.split(',').map((s) => s.trim()).filter(Boolean) : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center border border-orange-100 shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="min-w-0 pr-8">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold text-[#FF5A0A] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/80">
                {job.job_type || job.jobType || 'Full-time'}
              </span>
              <span className="text-xs text-slate-400">Requisition ID: #{job.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] leading-snug truncate">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              {job.company_name || 'Independent Company'}
            </p>
          </div>
        </div>

        {/* Requisition Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-100 text-xs sm:text-sm">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
              <span className="font-semibold text-slate-800">{job.location || 'Remote'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
              <span className="font-bold text-emerald-700">{formatCompensation(job)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recruiter In Charge</span>
              <span className="font-semibold text-slate-800">{job.recruiter_name || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Published Date</span>
              <span className="font-semibold text-slate-800">{formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        {skills.length > 0 && (
          <div className="py-5 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="py-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Job Description & Responsibilities
          </h4>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100 max-h-60 overflow-y-auto">
            {job.description || 'No detailed description provided for this requisition.'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDeleteJob?.(job);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-all border border-red-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Requisition</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

