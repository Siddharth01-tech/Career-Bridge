import { useState } from 'react';
import { 
  FileText, 
  ArrowRight,
  X
} from 'lucide-react';

export default function ApplicationList({ 
  applications = [], 
  onBrowseJobs,
  onViewDetails: _onViewDetails 
}) {
  const [selectedApp, setSelectedApp] = useState(null);

  // Status badge styling helper
  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    
    if (s.includes('accepted') || s.includes('offer')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Accepted</span>
        </span>
      );
    }

    if (s.includes('shortlist') || s.includes('interview')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Shortlisted</span>
        </span>
      );
    }

    if (s.includes('review') || s.includes('progress')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Under Review</span>
        </span>
      );
    }

    if (s.includes('reject')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Rejected</span>
        </span>
      );
    }

    // Default: Pending
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <span>Pending</span>
      </span>
    );
  };

  // Company logo initial helper
  const getCompanyBg = (name = '') => {
    const colors = [
      'bg-slate-900 text-white',
      'bg-blue-600 text-white',
      'bg-indigo-600 text-white',
      'bg-amber-600 text-white',
      'bg-emerald-600 text-white',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

  // Format date helper
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

  // G. Empty State: When candidate has no applications
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          You haven&apos;t applied for any jobs yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Discover positions tailored to your skills from vetted tech companies, submit your application, and track progress here.
        </p>
        <button
          type="button"
          onClick={onBrowseJobs}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <span>Browse Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Job Title & Spec</th>
                <th className="py-3.5 px-6">Company</th>
                <th className="py-3.5 px-6">Date Applied</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {applications.slice(0, 5).map((app, index) => {
                const jobTitle = app.job_title || app.title || 'Software Engineer';
                const companyName = app.company_name || app.company || 'TechCorp';
                const initial = companyName.charAt(0).toUpperCase();
                const appliedDate = formatDate(app.created_at || app.date);
                const specId = app.spec || `REQ-${1000 + (app.id || index * 123)}`;

                return (
                  <tr 
                    key={app.id || index}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Job Title & Spec */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {specId}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${getCompanyBg(companyName)}`}>
                          {initial}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {companyName}
                        </span>
                      </div>
                    </td>

                    {/* Date Applied */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="sm:hidden divide-y divide-slate-100">
          {applications.slice(0, 5).map((app, index) => {
            const jobTitle = app.job_title || app.title || 'Software Engineer';
            const companyName = app.company_name || app.company || 'TechCorp';
            const initial = companyName.charAt(0).toUpperCase();
            const appliedDate = formatDate(app.created_at || app.date);

            return (
              <div key={app.id || index} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${getCompanyBg(companyName)}`}>
                      {initial}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {companyName}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Applied: {appliedDate}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Details Dialog / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Application Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApp.job_title || selectedApp.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.company_name || selectedApp.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Application Status:</span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Date Submitted:</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedApp.created_at || selectedApp.date)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Resume File:</span>
                <span className="font-semibold text-slate-800">
                  {selectedApp.resume_name || 'Resume_SoftwareEngineer.pdf'}
                </span>
              </div>

              {selectedApp.cover_letter && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block mb-1">Cover Note:</span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 italic">
                    &ldquo;{selectedApp.cover_letter}&rdquo;
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
