import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function AdminDeleteJobModal({
  isOpen,
  job,
  loading = false,
  onClose,
  onConfirm
}) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-red-50 text-red-600 border-red-100">
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              Delete Job Posting
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Administrative removal confirmation
            </span>
          </div>
        </div>

        {/* Context description */}
        <div className="py-2 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
          <p>
            Are you sure you want to permanently delete the job posting <strong className="text-slate-900">"{job.title}"</strong>?
          </p>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span className="text-slate-400 font-medium">Requisition:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">{job.title}</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span className="text-slate-400 font-medium">Company:</span>
              <span className="font-semibold text-slate-800">{job.company_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 font-medium">Recruiter:</span>
              <span className="font-medium text-slate-700">{job.recruiter_name || 'N/A'}</span>
            </div>
          </div>

          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-100/80 text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div>
              <strong className="block font-semibold">Irreversible Action:</strong>
              This will permanently delete this job requisition and all associated applications from the platform database.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm?.(job)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 bg-red-600 hover:bg-red-700 shadow-red-500/20"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

