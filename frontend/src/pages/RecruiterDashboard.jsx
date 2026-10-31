import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  ChevronRight,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobService, companyService } from '../services/api';

import RecruiterSidebar from '../components/recruiter/RecruiterSidebar';
import RecruiterNavbar from '../components/recruiter/RecruiterNavbar';
import RecruiterWelcomeCard from '../components/recruiter/RecruiterWelcomeCard';
import RecruiterStatsGroup from '../components/recruiter/RecruiterStatsGroup';
import RecruiterJobCard from '../components/recruiter/RecruiterJobCard';
import RecruiterJobModal from '../components/recruiter/RecruiterJobModal';
import CompanyProfileModal from '../components/recruiter/CompanyProfileModal';
import RecruiterApplicantsList from '../components/recruiter/RecruiterApplicantsList';
import DeleteJobModal from '../components/recruiter/DeleteJobModal';

export default function RecruiterDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Layout state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Company and Requisition Data only (no mock items)
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  // Search & Filter state
  const [filterCriteria, setFilterCriteria] = useState({ search: '', location: '', jobType: '' });

  // Modal states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // API & Loading states
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Section references for smooth scrolling
  const jobsSectionRef = useRef(null);
  const applicantsSectionRef = useRef(null);

  // Fetch live Company & Jobs from Backend API
  useEffect(() => {
    let isMounted = true;

    async function loadRecruiterData() {
      setLoading(true);
      let liveConnected = false;
      let fetchedCompany = null;

      // 1. Fetch Company for Recruiter if authenticated
      if (isAuthenticated) {
        try {
          const compData = await companyService.getMyCompany();
          if (isMounted && compData && compData.id) {
            fetchedCompany = compData;
            setCompany(compData);
            liveConnected = true;
          } else if (isMounted) {
            setCompany(null);
          }
        } catch (err) {
          console.info('Recruiter company not created yet or endpoint unreachable:', err.message);
          if (isMounted) setCompany(null);
        }
      }

      // 2. Fetch Jobs from backend
      try {
        const jobsResponse = await jobService.getAllJobs();
        if (isMounted && jobsResponse?.jobs) {
          const allJobs = jobsResponse.jobs;
          // Filter to jobs belonging to this recruiter or company
          const currentCompanyId = fetchedCompany?.id || company?.id;
          const recruiterJobs = allJobs.filter((j) => {
            if (user?.id && j.recruiter_id === user.id) return true;
            if (currentCompanyId && j.company_id === currentCompanyId) return true;
            return false;
          });

          setJobs(recruiterJobs);
          liveConnected = true;
        }
      } catch (err) {
        console.info('Backend jobs endpoint not reachable:', err.message);
      }

      if (isMounted) {
        setIsLiveApi(liveConnected);
        setLoading(false);
      }
    }

    loadRecruiterData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id, company?.id]);

  // Handle Search & Filter
  const handleSearch = ({ search, location, jobType }) => {
    setFilterCriteria({ search, location, jobType });
    if (search || location || jobType) {
      jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Jobs based on search criteria
  const displayedJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch = !filterCriteria.search || 
        job.title?.toLowerCase().includes(filterCriteria.search.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(filterCriteria.search.toLowerCase()) ||
        (Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(filterCriteria.search.toLowerCase())));

      const matchLocation = !filterCriteria.location || 
        (job.location || job.company_location)?.toLowerCase().includes(filterCriteria.location.toLowerCase());

      const matchType = !filterCriteria.jobType || 
        (job.job_type || job.jobType)?.toLowerCase() === filterCriteria.jobType.toLowerCase();

      return matchSearch && matchLocation && matchType;
    });
  }, [jobs, filterCriteria]);

  // Handle Job Post / Edit Success
  const handleJobSaved = (savedJob, isEditing) => {
    if (isEditing) {
      setJobs((prev) => prev.map((j) => (j.id === savedJob.id ? { ...j, ...savedJob } : j)));
    } else {
      setJobs((prev) => [savedJob, ...prev]);
    }
  };

  // Handle Job Delete
  const handleConfirmDelete = async (job) => {
    setDeleteLoading(true);
    try {
      try {
        await jobService.deleteJob(job.id);
      } catch (err) {
        console.warn('Backend delete API call:', err.message);
      }
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      setJobToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Company Profile Saved
  const handleCompanySaved = (updatedCompany) => {
    setCompany(updatedCompany);
    // Update company name on existing jobs
    setJobs((prev) => prev.map((j) => ({ ...j, company_name: updatedCompany.company_name })));
  };

  // Handle Application Status Change
  const handleApplicationStatusChange = (applicantId, newStatus) => {
    setApplicants((prev) => prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a)));
  };

  // Smooth scroll helpers for sidebar actions
  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToApplicants = () => {
    applicantsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const recruiterDisplayName = user?.name || 'Recruiter';
  const effectiveCompanyName = company?.company_name || '';

  const handleOpenPostJob = () => {
    if (!company) {
      setIsCompanyModalOpen(true);
    } else {
      setJobToEdit(null);
      setIsJobModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* A. Sidebar Navigation */}
      <RecruiterSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onManageJobsClick={scrollToJobs}
        onApplicantsClick={scrollToApplicants}
        onCompanyProfileClick={() => setIsCompanyModalOpen(true)}
        onPostJobClick={handleOpenPostJob}
        jobCount={jobs.length}
        applicantCount={applicants.length}
        companyName={effectiveCompanyName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* B. Top Navbar */}
        <RecruiterNavbar
          onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          isLiveApi={isLiveApi}
          onPostJobClick={handleOpenPostJob}
          onCompanyProfileClick={() => setIsCompanyModalOpen(true)}
          companyName={effectiveCompanyName}
        />

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {loading && (
            <div className="w-full bg-orange-100/60 h-1 overflow-hidden rounded-full">
              <div className="bg-[#FF5A0A] h-1 w-1/3 animate-pulse"></div>
            </div>
          )}

          {/* Unauthenticated Notice */}
          {!isAuthenticated && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Sparkles className="w-4 h-4 text-[#FF5A0A] shrink-0" />
                <span>
                  <strong className="text-slate-900 font-bold">Sign In Required:</strong> Sign in with a recruiter account to manage your hiring pipeline.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/signin"
                  className="px-3.5 py-1.5 rounded-lg bg-[#080D1C] text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg bg-orange-50 text-[#FF5A0A] border border-orange-200/80 font-semibold hover:bg-orange-100 transition-colors"
                >
                  Create Recruiter Account
                </Link>
              </div>
            </div>
          )}

          {/* Missing Company Profile Callout Banner */}
          {!company && (
            <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50/40 border border-orange-200/90 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5A0A] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Set up your Company Profile to start hiring
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                    A verified company profile is required before you can publish job openings and receive applicant dossiers. It only takes a minute.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Company Profile</span>
              </button>
            </div>
          )}

          {/* C. Welcome Section */}
          <RecruiterWelcomeCard
            recruiterName={recruiterDisplayName}
            companyName={effectiveCompanyName}
            onSearch={handleSearch}
            onPostJobClick={handleOpenPostJob}
            onCompanyProfileClick={() => setIsCompanyModalOpen(true)}
          />

          {/* D. Statistics Cards */}
          <section aria-label="Recruiter Requisition Statistics">
            <RecruiterStatsGroup
              totalJobs={jobs.length}
              totalApplicants={applicants.length}
              shortlistedCount={applicants.filter((a) => (a.status || '').toLowerCase().includes('shortlist') || (a.status || '').toLowerCase().includes('accept')).length}
              onCardClick={(cardId) => {
                if (cardId === 'jobs') scrollToJobs();
                if (cardId === 'applicants' || cardId === 'shortlisted') scrollToApplicants();
              }}
            />
          </section>

          {/* E. Manage Requisitions Section */}
          <section ref={jobsSectionRef} aria-label="Active Requisitions" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                  Your Active Requisitions
                </h2>
                <span className="text-[11px] font-bold text-[#D9480F] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/70 uppercase tracking-wide">
                  {jobs.length} Openings Live
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Showing {displayedJobs.length} of {jobs.length} positions
                </span>
                <button
                  type="button"
                  onClick={handleOpenPostJob}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Post Requisition</span>
                </button>
              </div>
            </div>

            {/* Requisitions Grid */}
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200/80 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A0A] flex items-center justify-center mx-auto mb-3 border border-orange-100">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No active job requisitions published yet
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Publish your first open position to connect with qualified candidates.
                </p>
                <button
                  type="button"
                  onClick={handleOpenPostJob}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Post First Requisition</span>
                </button>
              </div>
            ) : displayedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
                <p className="text-sm text-slate-500">
                  No requisitions match your filter &ldquo;{filterCriteria.search || filterCriteria.location || filterCriteria.jobType}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setFilterCriteria({ search: '', location: '', jobType: '' })}
                  className="mt-3 text-xs font-bold text-[#FF5A0A] hover:underline cursor-pointer"
                >
                  Reset filters to see all jobs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {displayedJobs.map((job) => (
                  <RecruiterJobCard
                    key={job.id}
                    job={job}
                    onEdit={(selected) => {
                      setJobToEdit(selected);
                      setIsJobModalOpen(true);
                    }}
                    onDelete={(selected) => {
                      setJobToDelete(selected);
                    }}
                    onViewDetails={(selected) => {
                      setJobToEdit(selected);
                      setIsJobModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* F. Candidates & Pipeline Section */}
          <section ref={applicantsSectionRef} aria-label="Candidate Applications" className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                    Candidate Submissions
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    ({applicants.length} total received)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant profiles, evaluate candidate dossiers, and advance hiring stages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToApplicants}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#FF5A0A] transition-colors"
                >
                  <span>Review all candidates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Applicants List */}
            <RecruiterApplicantsList
              applicants={applicants}
              onPostJob={handleOpenPostJob}
              onStatusChange={handleApplicationStatusChange}
            />
          </section>

          {/* Recruiter Workspace Footer note */}
          <div className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CareerBridge Portal • Recruiter Workspace</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-500' : 'bg-[#FF5A0A]'}`} />
                <span>{isLiveApi ? 'Connected to live API' : 'System Ready'}</span>
              </span>
              <span>Updated in real-time</span>
            </div>
          </div>
        </main>
      </div>

      {/* Post / Edit Job Modal */}
      <RecruiterJobModal
        isOpen={isJobModalOpen}
        jobToEdit={jobToEdit}
        companyId={company?.id}
        companyName={effectiveCompanyName}
        onClose={() => {
          setIsJobModalOpen(false);
          setJobToEdit(null);
        }}
        onSuccess={handleJobSaved}
      />

      {/* Company Profile Modal */}
      <CompanyProfileModal
        isOpen={isCompanyModalOpen}
        currentCompany={company}
        onClose={() => setIsCompanyModalOpen(false)}
        onSuccess={handleCompanySaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteJobModal
        isOpen={!!jobToDelete}
        job={jobToDelete}
        loading={deleteLoading}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
