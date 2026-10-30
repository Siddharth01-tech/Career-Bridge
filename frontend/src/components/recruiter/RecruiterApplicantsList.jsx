import { useState } from 'react';
import { 
  Users, 
  ArrowRight,
  X,
  FileText,
  Mail
} from 'lucide-react';

export default function RecruiterApplicantsList({ 
  applicants = [], 
  onPostJob,
  onStatusChange 
}) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#D9480F] border border-orange-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]" />
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
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span>Pending</span>
      </span>
    );
  };

  const getAvatarBg = (name = '') => {
    const colors = [
      'bg-[#080D1C] text-white',
      'bg-[#FF5A0A] text-white',
      'bg-slate-700 text-white',
      'bg-amber-600 text-white',
      'bg-emerald-600 text-white',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

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

  // Empty State: When no applicants
  if (!applicants || applicants.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-2xs">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          No candidates have applied yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Publish high-priority requisitions with competitive compensation to attract qualified tech professionals.
        </p>
        <button
          type="button"
          onClick={onPostJob}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
        >
          <span>Post a Requisition</span>
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
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-6">Requisition Applied</th>
                <th className="py-3.5 px-6">Date Received</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {applicants.slice(0, 6).map((app, index) => {
                const candidateName = app.candidate_name || app.name || 'Candidate';
                const candidateEmail = app.candidate_email || app.email || 'candidate@example.com';
                const initial = candidateName.charAt(0).toUpperCase();
                const jobTitle = app.job_title || app.title || 'Engineer';
                const specId = app.spec || `REQ-${1000 + (app.job_id || index * 77)}`;
                const appliedDate = formatDate(app.created_at || app.date);

                return (
                  <tr 
                    key={app.id || index}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${getAvatarBg(candidateName)}`}>
                          {initial}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#FF5A0A] transition-colors leading-tight">
                            {candidateName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Requisition */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">
                        {jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {specId}
                      </div>
                    </td>

                    {/* Date Received */}
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
                        onClick={() => setSelectedApplicant(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#FF5A0A] hover:bg-orange-50 hover:border-orange-200/80 border border-slate-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                      >
                        <span>Review</span>
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
          {applicants.slice(0, 6).map((app, index) => {
            const candidateName = app.candidate_name || app.name || 'Candidate';
            const candidateEmail = app.candidate_email || app.email || 'candidate@example.com';
            const initial = candidateName.charAt(0).toUpperCase();
            const jobTitle = app.job_title || app.title || 'Engineer';
            const appliedDate = formatDate(app.created_at || app.date);

            return (
              <div key={app.id || index} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${getAvatarBg(candidateName)}`}>
                      {initial}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {candidateName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {jobTitle} • {candidateEmail}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{appliedDate}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedApplicant(app)}
                    className="text-xs font-bold text-[#FF5A0A] hover:underline"
                  >
                    Review Application &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applicant Review Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
                  Candidate Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApplicant.candidate_name || selectedApplicant.name || 'Candidate'}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedApplicant.candidate_email || selectedApplicant.email || 'candidate@example.com'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close review"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Applied Position:</span>
                <span className="font-bold text-slate-900">{selectedApplicant.job_title || selectedApplicant.title}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Current Status:</span>
                <div>{getStatusBadge(selectedApplicant.status)}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Date Received:</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedApplicant.created_at || selectedApplicant.date)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Attached Resume:</span>
                <span className="font-semibold text-[#FF5A0A] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{selectedApplicant.resume_name || 'Candidate_Resume.pdf'}</span>
                </span>
              </div>

              {selectedApplicant.cover_letter && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block mb-1">Candidate Note:</span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 italic">
                    &ldquo;{selectedApplicant.cover_letter}&rdquo;
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-500 font-semibold block mb-2">Advance Candidate:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onStatusChange?.(selectedApplicant.id, 'Shortlisted');
                      setSelectedApplicant({ ...selectedApplicant, status: 'Shortlisted' });
                    }}
                    className="py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#D9480F] font-bold text-xs border border-orange-200/80 transition-colors"
                  >
                    Shortlist
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStatusChange?.(selectedApplicant.id, 'Accepted');
                      setSelectedApplicant({ ...selectedApplicant, status: 'Accepted' });
                    }}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200/80 transition-colors"
                  >
                    Accept / Offer
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
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
