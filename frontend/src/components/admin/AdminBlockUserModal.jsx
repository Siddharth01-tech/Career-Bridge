import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

export default function AdminBlockUserModal({
  isOpen,
  user,
  blocking, // true = about to block, false = about to unblock
  loading = false,
  onClose,
  onConfirm
}) {
  if (!isOpen || !user) return null;

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
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            blocking 
              ? 'bg-red-50 text-red-600 border-red-100' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {blocking ? (
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              {blocking ? 'Block User Account' : 'Unblock User Account'}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Administrative action confirmation
            </span>
          </div>
        </div>

        {/* Context description */}
        <div className="py-2 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
          {blocking ? (
            <p>
              Are you sure you want to block <strong className="text-slate-900">{user.name}</strong> ({user.email})?
            </p>
          ) : (
            <p>
              Are you sure you want to restore access for <strong className="text-slate-900">{user.name}</strong> ({user.email})?
            </p>
          )}

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            {blocking ? (
              <>
                <strong className="text-slate-700 block mb-0.5">Restriction Impact:</strong>
                This user will be immediately rejected upon attempting to log in until an administrator unblocks them.
              </>
            ) : (
              <>
                <strong className="text-slate-700 block mb-0.5">Restoration Impact:</strong>
                This user will regain full platform privileges associated with their <span className="capitalize font-semibold">{user.role}</span> role.
              </>
            )}
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
            onClick={() => onConfirm?.(user, blocking)}
            className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 ${
              blocking 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            }`}
          >
            {loading ? 'Updating status...' : (blocking ? 'Confirm Block' : 'Confirm Unblock')}
          </button>
        </div>
      </div>
    </div>
  );
}
