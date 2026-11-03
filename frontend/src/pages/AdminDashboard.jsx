import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  RefreshCw, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Server, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminWelcomeCard from '../components/admin/AdminWelcomeCard';
import AdminStatsGroup from '../components/admin/AdminStatsGroup';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminJobsTable from '../components/admin/AdminJobsTable';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import AdminBlockUserModal from '../components/admin/AdminBlockUserModal';
import AdminJobDetailsModal from '../components/admin/AdminJobDetailsModal';
import AdminDeleteJobModal from '../components/admin/AdminDeleteJobModal';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Layout & Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Platform Data
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Search filter across admin panel
  const [filterCriteria, setFilterCriteria] = useState({ search: '', role: undefined });

  // Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [userToBlock, setUserToBlock] = useState(null);
  const [isBlockingAction, setIsBlockingAction] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);

  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // API & Loading States
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Section references for smooth scrolling
  const usersSectionRef = useRef(null);
  const jobsSectionRef = useRef(null);

  // Fetch real users and jobs from backend
  const loadAdminData = async () => {
    setLoading(true);
    let liveConnected = false;

    // 1. Fetch Users
    try {
      const usersResponse = await adminService.getAllUsers();
      if (usersResponse?.users && Array.isArray(usersResponse.users)) {
        setUsers(usersResponse.users);
        liveConnected = true;
      }
    } catch (err) {
      console.info('Admin users fetch notice:', err.message);
    }

    // 2. Fetch Jobs
    try {
      const jobsResponse = await adminService.getAllJobs();
      if (jobsResponse?.jobs && Array.isArray(jobsResponse.jobs)) {
        setJobs(jobsResponse.jobs);
        liveConnected = true;
      }
    } catch (err) {
      console.info('Admin jobs fetch notice:', err.message);
    }

    setIsLiveApi(liveConnected);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      let liveConnected = false;

      try {
        const usersResponse = await adminService.getAllUsers();
        if (isMounted && usersResponse?.users && Array.isArray(usersResponse.users)) {
          setUsers(usersResponse.users);
          liveConnected = true;
        }
      } catch (err) {
        console.info('Admin users fetch notice:', err.message);
      }

      try {
        const jobsResponse = await adminService.getAllJobs();
        if (isMounted && jobsResponse?.jobs && Array.isArray(jobsResponse.jobs)) {
          setJobs(jobsResponse.jobs);
          liveConnected = true;
        }
      } catch (err) {
        console.info('Admin jobs fetch notice:', err.message);
      }

      if (isMounted) {
        setIsLiveApi(liveConnected);
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Derived statistics
  const stats = useMemo(() => {
    const candidates = users.filter((u) => u.role === 'candidate').length;
    const recruiters = users.filter((u) => u.role === 'recruiter').length;
    const blocked = users.filter((u) => u.is_blocked).length;

    return {
      totalUsers: users.length,
      candidatesCount: candidates,
      recruitersCount: recruiters,
      totalJobs: jobs.length,
      blockedCount: blocked,
    };
  }, [users, jobs]);

  // Handle Search from Welcome Card
  const handleSearch = ({ search, role }) => {
    setFilterCriteria({ search, role });
    if (search || role) {
      usersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // User Moderation: initiate block/unblock confirmation
  const handleInitiateToggleBlock = (targetUser, blockState) => {
    setUserToBlock(targetUser);
    setIsBlockingAction(blockState);
  };

  // User Moderation: perform API request to block or unblock
  const handleConfirmToggleBlock = async (targetUser, willBlock) => {
    setBlockLoading(true);
    try {
      if (willBlock) {
        await adminService.blockUser(targetUser.id);
        setActionFeedback({
          type: 'success',
          message: `User account "${targetUser.name}" has been blocked from accessing the platform.`,
        });
      } else {
        await adminService.unblockUser(targetUser.id);
        setActionFeedback({
          type: 'success',
          message: `User account "${targetUser.name}" has been unblocked and restored to active status.`,
        });
      }

      // Update state locally
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_blocked: willBlock ? 1 : 0 } : u))
      );

      // Also update selectedUserForDetails if currently open
      if (selectedUserForDetails && selectedUserForDetails.id === targetUser.id) {
        setSelectedUserForDetails((prev) => ({ ...prev, is_blocked: willBlock ? 1 : 0 }));
      }

      setUserToBlock(null);
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update user account status.',
      });
    } finally {
      setBlockLoading(false);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  // Job Moderation: initiate delete confirmation
  const handleInitiateDeleteJob = (job) => {
    setJobToDelete(job);
  };

  // Job Moderation: perform API request to delete job
  const handleConfirmDeleteJob = async (job) => {
    setDeleteLoading(true);
    try {
      await adminService.deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      setActionFeedback({
        type: 'success',
        message: `Job requisition "${job.title}" has been deleted across the platform.`,
      });
      setJobToDelete(null);
      if (selectedJobForDetails && selectedJobForDetails.id === job.id) {
        setSelectedJobForDetails(null);
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to delete job posting.',
      });
    } finally {
      setDeleteLoading(false);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  // Scroll helpers
  const scrollToUsers = () => {
    setActiveTab('users');
    usersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJobs = () => {
    setActiveTab('jobs');
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adminDisplayName = user?.name || 'Administrator';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* 1. Sidebar Navigation */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onManageUsersClick={scrollToUsers}
        onManageJobsClick={scrollToJobs}
        userCount={users.length}
        jobCount={jobs.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          isLiveApi={isLiveApi}
          unreadCount={stats.blockedCount}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Real-time Loading Indicator */}
          {loading && (
            <div className="w-full bg-orange-100/60 h-1 overflow-hidden rounded-full">
              <div className="bg-[#FF5A0A] h-1 w-1/3 animate-pulse" />
            </div>
          )}

          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                  : 'bg-red-50 text-red-800 border-red-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {actionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-xs underline hover:opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Unauthenticated / Non-Admin Notice */}
          {(!isAuthenticated || user?.role !== 'admin') && (
            <div className="bg-white border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong className="text-slate-900 font-bold">Admin Privileges Required:</strong>{' '}
                  You are viewing the administration dashboard. Sign in with an authorized administrator account to exercise full platform governance.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/signin"
                  className="px-3.5 py-1.5 rounded-lg bg-[#080D1C] text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Admin Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg bg-orange-50 text-[#FF5A0A] border border-orange-200/80 font-semibold hover:bg-orange-100 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* 3. Welcome Banner with Platform Overview */}
          <AdminWelcomeCard
            adminName={adminDisplayName}
            onSearch={handleSearch}
            onManageUsersClick={scrollToUsers}
            onManageJobsClick={scrollToJobs}
          />

          {/* 4. Platform Statistics Cards */}
          <section aria-label="Platform Statistics">
            <AdminStatsGroup
              totalUsers={stats.totalUsers}
              candidatesCount={stats.candidatesCount}
              recruitersCount={stats.recruitersCount}
              totalJobs={stats.totalJobs}
              blockedUsersCount={stats.blockedCount}
              onCardClick={(cardId) => {
                if (cardId === 'users' || cardId === 'moderation') scrollToUsers();
                if (cardId === 'jobs') scrollToJobs();
              }}
            />
          </section>

          {/* 5. User Management Table Section */}
          <section ref={usersSectionRef} aria-label="User Management">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                  User Account Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View, inspect, and moderate all candidate, recruiter, and administrator accounts.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAdminData}
                disabled={loading}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                title="Refresh platform users and jobs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5A0A]' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            <AdminUsersTable
              users={users}
              currentUserId={user?.id}
              externalSearch={filterCriteria.search}
              externalRole={filterCriteria.role}
              onInspectUser={(selectedUser) => setSelectedUserForDetails(selectedUser)}
              onToggleBlockUser={(targetUser, blockState) => handleInitiateToggleBlock(targetUser, blockState)}
              loadingUserId={blockLoading ? userToBlock?.id : null}
            />
          </section>

          {/* 6. Job Moderation Table Section */}
          <section ref={jobsSectionRef} aria-label="Job Moderation">
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                Job Posting Moderation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit and moderate live requisitions submitted by recruiters across all verified companies.
              </p>
            </div>

            <AdminJobsTable
              jobs={jobs}
              onInspectJob={(job) => setSelectedJobForDetails(job)}
              onDeleteJob={(job) => handleInitiateDeleteJob(job)}
              deletingJobId={deleteLoading ? jobToDelete?.id : null}
            />
          </section>

          {/* 7. Platform Security & System Integrity Info Card */}
          <section aria-label="Platform Diagnostics" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center border border-orange-100">
                <Server className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  CareerBridge Platform Architecture & Diagnostics
                </h4>
                <p className="text-xs text-slate-500">
                  Real-time role-based access control and system integrity status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#FF5A0A]" />
                  <span>Security Gateway</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  JWT authentication with standard authorization middleware enforces protected boundaries across Candidate, Recruiter, and Admin tiers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                  <Users className="w-3.5 h-3.5 text-[#FF5A0A]" />
                  <span>Zero Demo Data Guarantee</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Only authentic registered accounts and published positions from the database are presented. No hardcoded mock records are retained.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#FF5A0A]" />
                  <span>Administrative Control</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Immediate account suspension and global job requisition removal capabilities are wired directly to the backend admin endpoints.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- Modals --- */}

      {/* User Details Inspector Modal */}
      <UserDetailsModal
        user={selectedUserForDetails}
        isOpen={Boolean(selectedUserForDetails)}
        onClose={() => setSelectedUserForDetails(null)}
        onToggleBlock={(userItem, isBlocking) => {
          setSelectedUserForDetails(null);
          handleInitiateToggleBlock(userItem, isBlocking);
        }}
        currentUserId={user?.id}
        loading={blockLoading}
      />

      {/* Block / Unblock Confirmation Modal */}
      <AdminBlockUserModal
        isOpen={Boolean(userToBlock)}
        user={userToBlock}
        blocking={isBlockingAction}
        loading={blockLoading}
        onClose={() => setUserToBlock(null)}
        onConfirm={handleConfirmToggleBlock}
      />

      {/* Job Details Inspector Modal */}
      <AdminJobDetailsModal
        isOpen={Boolean(selectedJobForDetails)}
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onDeleteJob={(job) => {
          setSelectedJobForDetails(null);
          handleInitiateDeleteJob(job);
        }}
      />

      {/* Job Deletion Confirmation Modal */}
      <AdminDeleteJobModal
        isOpen={Boolean(jobToDelete)}
        job={jobToDelete}
        loading={deleteLoading}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDeleteJob}
      />
    </div>
  );
}