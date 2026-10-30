import { Trash2 } from 'lucide-react';

export default function DeleteJobModal({ 
  isOpen, 
  job, 
  onClose, 
  onConfirm, 
  loading = false 
}) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
          Delete Requisition?
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
          Are you sure you want to remove <strong className="text-slate-800">&ldquo;{job.title}&rdquo;</strong>? This position will no longer be visible to candidates.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(job)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
