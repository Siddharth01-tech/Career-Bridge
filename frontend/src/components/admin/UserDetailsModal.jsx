import { X, Mail, Calendar, ShieldAlert, CheckCircle2, Ban, UserCheck } from 'lucide-react';

export default function UserDetailsModal({ 
  user, 
  isOpen, 
  onClose, 
  onToggleBlock, 
  currentUserId,
  loading = false 
}) {
  if (!isOpen || !user) return null;

  const isSelf = currentUserId && Number(user.id) === Number(currentUserId);
  const isBlocked = Boolean(user.is_blocked);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5A0A] font-extrabold text-xl flex items-center justify-center border border-orange-200 shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {user.name}
              </h3>
              {isSelf && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-[#D9480F]">
                  CURRENT ADMIN
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="py-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account ID
              </span>
              <span className="font-mono font-bold text-slate-900">
                #{user.id}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Platform Role
              </span>
              <span className="capitalize font-bold text-slate-900">
                {user.role}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account Standing
              </span>
              <span className="font-bold text-slate-900">
                {isBlocked ? 'Blocked / Suspended' : 'Active & Verified'}
              </span>
            </div>
            <div>
              {isBlocked ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Suspended</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Good Standing</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> Registration Timestamp:
              </span>
              <span className="font-medium text-slate-800">{formatDate(user.created_at)}</span>
            </div>
            {user.updated_at && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> Last Modified:
                </span>
                <span className="font-medium text-slate-800">{formatDate(user.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>

          {!isSelf && (
            isBlocked ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  onToggleBlock?.(user, false);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Unblock Account'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  onToggleBlock?.(user, true);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Block Account'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
