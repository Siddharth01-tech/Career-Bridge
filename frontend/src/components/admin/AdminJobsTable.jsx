import { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Eye, 
  Trash2, 
  Building2, 
  UserCheck 
} from 'lucide-react';

export default function AdminJobsTable({ 
  jobs = [], 
  onInspectJob, 
  onDeleteJob,
  deletingJobId 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchType = !typeFilter || (j.job_type || j.jobType)?.toLowerCase() === typeFilter.toLowerCase();
      const matchSearch = 
        !searchQuery.trim() ||
        j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.recruiter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(j.skills) && j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchType && matchSearch;
    });
  }, [jobs, typeFilter, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCompensation = (job) => {
    if (job.salary_min && job.salary_max) {
      return `$${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary_min) {
      return `$${Number(job.salary_min).toLocaleString()}+`;
    }
    return job.compensation || 'Competitive';
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 sm:p-14 border border-slate-200/80 text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-2xs">
          <Briefcase className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          No Job Postings on Platform
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          When verified recruiters publish requisitions, they will be listed here for compliance review, policy moderation, and administrative management.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Controls Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Platform Job Postings ({jobs.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit job requisitions and ensure compliance with CareerBridge fair hiring guidelines.
          </p>
        </div>

        {/* Search & Type Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Job Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-[#FF5A0A] cursor-pointer"
            aria-label="Filter by job type"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#FF5A0A] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, company, recruiter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      {filteredJobs.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-sm">
          No job requisitions match the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5 sm:px-6">Requisition Details</th>
                <th className="py-3.5 px-4">Company & Recruiter</th>
                <th className="py-3.5 px-4">Type & Compensation</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-5 sm:px-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => {
                const isDeleting = deletingJobId === job.id;
                const companyName = job.company_name || 'Verified Employer';
                const recruiterName = job.recruiter_name || 'Recruiter';
                const location = job.location || job.company_location || 'Remote';
                const jobType = job.job_type || job.jobType || 'Full-time';

                return (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Requisition Title & Location */}
                    <td className="py-4 px-5 sm:px-6">
                      <div className="min-w-0">
                        <div 
                          onClick={() => onInspectJob?.(job)}
                          className="font-bold text-slate-900 hover:text-[#FF5A0A] transition-colors cursor-pointer truncate max-w-xs"
                        >
                          {job.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company & Recruiter */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{companyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Posted by {recruiterName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type & Compensation */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold mb-1">
                          {jobType}
                        </span>
                        <div className="text-xs font-bold text-slate-900">
                          {formatCompensation(job)}
                        </div>
                      </div>
                    </td>

                    {/* Published Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(job.created_at)}
                    </td>

                    {/* Moderation Actions */}
                    <td className="py-4 px-5 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => onInspectJob?.(job)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Inspect requisition details"
                          aria-label={`Inspect ${job.title}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Job */}
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => onDeleteJob?.(job)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Remove job from platform"
                          aria-label={`Remove ${job.title}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

