import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Ban, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';

export default function AdminUsersTable({ 
  users = [], 
  currentUserId,
  onInspectUser,
  onToggleBlockUser,
  loadingUserId,
  externalSearch = '',
  externalRole
}) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const effectiveSearch = searchQuery || externalSearch;
  const effectiveRole = externalRole || (roleFilter === 'all' ? undefined : roleFilter);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = !effectiveRole || u.role === effectiveRole;
      const matchStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'blocked' ? u.is_blocked : !u.is_blocked);
      const matchSearch = 
        !effectiveSearch.trim() ||
        u.name?.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(effectiveSearch.toLowerCase());

      return matchRole && matchStatus && matchSearch;
    });
  }, [users, effectiveRole, statusFilter, effectiveSearch]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      candidate: users.filter((u) => u.role === 'candidate').length,
      recruiter: users.filter((u) => u.role === 'recruiter').length,
      admin: users.filter((u) => u.role === 'admin').length,
    };
  }, [users]);

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

  const getRoleBadge = (role = '') => {
    switch (role.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </span>
        );
      case 'recruiter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#FF5A0A] border border-orange-200/80">
            <span>Recruiter</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Candidate</span>
          </span>
        );
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 sm:p-14 border border-slate-200/80 text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-2xs">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          No Registered Users Yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          When candidates and recruiters register on CareerBridge, they will appear here with full account moderation options.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Controls Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('candidate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'candidate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidates ({counts.candidate})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('recruiter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'recruiter'
                ? 'bg-white text-[#FF5A0A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recruiters ({counts.recruiter})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admins ({counts.admin})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-[#FF5A0A] cursor-pointer"
            aria-label="Filter by user status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked / Suspended Only</option>
          </select>

          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#FF5A0A] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search user by name/email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      {filteredUsers.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-sm">
          No users match the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5 sm:px-6">User Account</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-5 sm:px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSelf = currentUserId && Number(u.id) === Number(currentUserId);
                const isBlocked = Boolean(u.is_blocked);
                const isOperating = loadingUserId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Identity */}
                    <td className="py-4 px-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 truncate">
                              {u.name}
                            </span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-[#D9480F]">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          <span>Blocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(u.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* Inspect User button */}
                        <button
                          type="button"
                          onClick={() => onInspectUser?.(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View user details"
                          aria-label={`View details for ${u.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Block / Unblock Toggle */}
                        {isSelf ? (
                          <span 
                            className="text-[11px] font-semibold text-slate-300 italic px-2 py-1"
                            title="Cannot block current administrator"
                          >
                            Protected
                          </span>
                        ) : isBlocked ? (
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => onToggleBlockUser?.(u, false)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{isOperating ? 'Updating...' : 'Unblock'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => onToggleBlockUser?.(u, true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold border border-slate-200 hover:border-red-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5 text-red-500" />
                            <span>{isOperating ? 'Updating...' : 'Block'}</span>
                          </button>
                        )}
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
