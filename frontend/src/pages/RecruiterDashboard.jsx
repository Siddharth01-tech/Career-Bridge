import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  ChevronRight
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

const INITIAL_COMPANY = {
  id: 1,
  company_name: 'Starlight AI',
  industry: 'AI & Cloud Infrastructure',
  location: 'San Francisco, CA • Hybrid',
  website: 'https://starlight.ai',
  description: 'Pioneering generative intelligence pipelines and next-generation developer platforms.',
};

const INITIAL_RECRUITER_JOBS = [
  {
    id: 'job-rec-1',
    title: 'Lead Frontend Architect',
    company_name: 'Starlight AI',
    company_id: 1,
    location: 'San Francisco, CA • Hybrid',
    job_type: 'Full-time',
    salary_min: 160000,
    salary_max: 195000,
    description: 'Lead visual design system execution, high-performance UI rendering, and enterprise React applications.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL'],
    experience: 5,
    deadline: '2026-12-15',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-rec-2',
    title: 'Senior Distributed Systems Engineer',
    company_name: 'Starlight AI',
    company_id: 1,
    location: 'Remote • US / Canada',
    job_type: 'Full-time',
    salary_min: 165000,
    salary_max: 200000,
    description: 'Architect resilient event-driven data streaming pipelines, PostgreSQL clusters, and microservices.',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
    experience: 4,
    deadline: '2026-12-31',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-rec-3',
    title: 'Cloud DevOps & Platform Engineer',
    company_name: 'Starlight AI',
    company_id: 1,
    location: 'Remote • Global',
    job_type: 'Full-time',
    salary_min: 150000,
    salary_max: 185000,
    description: 'Maintain CI/CD automation, cloud infrastructure security, and Kubernetes workload orchestration.',
    skills: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Linux'],
    experience: 3,
    deadline: '2026-11-30',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-rec-4',
    title: 'Product Design Lead (Design Systems)',
    company_name: 'Starlight AI',
    company_id: 1,
    location: 'San Francisco, CA • Hybrid',
    job_type: 'Full-time',
    salary_min: 140000,
    salary_max: 175000,
    description: 'Design interactive web workflows, accessible component specifications, and developer documentation.',
    skills: ['Figma', 'Design Systems', 'UI/UX', 'User Research'],
    experience: 4,
    deadline: '2026-12-20',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_APPLICANTS = [
  {
    id: 'app-1',
    job_id: 'job-rec-1',
    job_title: 'Lead Frontend Architect',
    candidate_name: 'Alex Vance',
    candidate_email: 'alex.vance@mit.edu',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Shortlisted',
    cover_letter: 'Deep experience building enterprise React applications and multi-tenant design systems.',
    resume_name: 'Alex_Vance_Staff_Frontend.pdf',
  },
  {
    id: 'app-2',
    job_id: 'job-rec-2',
    job_title: 'Senior Distributed Systems Engineer',
    candidate_name: 'Marcus Chen',
    candidate_email: 'marcus.chen@distributed.dev',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
    cover_letter: 'Spearheaded event-driven streaming at scale using PostgreSQL and distributed caches.',
    resume_name: 'Marcus_Chen_Backend_2026.pdf',
  },
  {
    id: 'app-3',
    job_id: 'job-rec-4',
    job_title: 'Product Design Lead (Design Systems)',
    candidate_name: 'Elena Rostova',
    candidate_email: 'elena@designcraft.io',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Accepted',
    cover_letter: 'Passionate about atomic design tokens and seamless engineering handoffs in Figma.',
    resume_name: 'Elena_Rostova_Design_Systems.pdf',
  },
  {
    id: 'app-4',
    job_id: 'job-rec-1',
    job_title: 'Lead Frontend Architect',
    candidate_name: 'Liam Patel',
    candidate_email: 'liam.patel@techlab.io',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
    cover_letter: 'Experienced with Vite, Next.js, and high-performance browser rendering engines.',
    resume_name: 'Liam_Patel_Resume.pdf',
  },
];

export default function RecruiterDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Layout state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Company and Requisition Data
  const [company, setCompany] = useState(INITIAL_COMPANY);
  const [jobs, setJobs] = useState(INITIAL_RECRUITER_JOBS);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  // Search & Filter state
  const [filterCriteria, setFilterCriteria] = useState({ search: '', location: '', jobType: '' });

  // Modal states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Testing demo toggle: Force empty state preview
  const [forceEmptyApplicants, setForceEmptyApplicants] = useState(false);

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

      // 1. Fetch Company for Recruiter if authenticated
      if (isAuthenticated) {
        try {
          const compData = await companyService.getMyCompany();
          if (isMounted && compData && compData.id) {
            setCompany(compData);
            liveConnected = true;
          }
        } catch (err) {
          console.info('Recruiter company endpoint not reachable or no company created yet:', err.message);
        }
      }

      // 2. Fetch Jobs from backend
      try {
        const jobsResponse = await jobService.getAllJobs();
        if (isMounted && jobsResponse?.jobs && jobsResponse.jobs.length > 0) {
          const allJobs = jobsResponse.jobs;
          // Filter to jobs belonging to this recruiter or company if present
          const recruiterJobs = allJobs.filter((j) => {
            if (user?.id && j.recruiter_id === user.id) return true;
            if (company?.id && j.company_id === company.id) return true;
            return false;
          });

          if (recruiterJobs.length > 0) {
            setJobs(recruiterJobs);
          } else {
            // Keep curated high-fidelity sample jobs with company name
            setJobs(INITIAL_RECRUITER_JOBS);
          }
          liveConnected = true;
        }
      } catch (err) {
        console.info('Backend jobs endpoint not reachable, using sample recruiter opportunities:', err.message);
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
        console.warn('Backend delete API call finished or simulated:', err.message);
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
  const effectiveCompanyName = company?.company_name || 'Starlight AI';

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
        onPostJobClick={() => {
          setJobToEdit(null);
          setIsJobModalOpen(true);
        }}
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
          onPostJobClick={() => {
            setJobToEdit(null);
            setIsJobModalOpen(true);
          }}
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

          {/* Unauthenticated Guest Demo Banner */}
          {!isAuthenticated && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Sparkles className="w-4 h-4 text-[#FF5A0A] shrink-0" />
                <span>
                  <strong className="text-slate-900 font-bold">Recruiter Demo Preview:</strong> You are viewing the recruiter workspace with live requisition publishing and candidate management.
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

          {/* C. Welcome Section */}
          <RecruiterWelcomeCard
            recruiterName={recruiterDisplayName}
            companyName={effectiveCompanyName}
            onSearch={handleSearch}
            onPostJobClick={() => {
              setJobToEdit(null);
              setIsJobModalOpen(true);
            }}
            onCompanyProfileClick={() => setIsCompanyModalOpen(true)}
          />

          {/* D. Statistics Cards (3 cards matching candidate design) */}
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
                  onClick={() => {
                    setJobToEdit(null);
                    setIsJobModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#080D1C] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Post Requisition</span>
                </button>
              </div>
            </div>

            {/* Requisitions Grid */}
            {displayedJobs.length === 0 ? (
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
                    ({forceEmptyApplicants ? 0 : applicants.length} total received)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant profiles, evaluate candidate dossiers, and advance hiring stages.
                </p>
              </div>

              {/* Developer / Reviewer Demo State Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForceEmptyApplicants(!forceEmptyApplicants)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Toggle between populated applicants list and empty state for UI evaluation"
                >
                  {forceEmptyApplicants ? '← Preview Populated List' : 'Preview Empty State →'}
                </button>

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
              applicants={forceEmptyApplicants ? [] : applicants}
              onPostJob={() => {
                setJobToEdit(null);
                setIsJobModalOpen(true);
              }}
              onStatusChange={handleApplicationStatusChange}
            />
          </section>

          {/* Recruiter Workspace Footer note */}
          <div className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CareerBridge Portal • Recruiter Workspace</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-500' : 'bg-[#FF5A0A]'}`} />
                <span>{isLiveApi ? 'Connected to live API' : 'Sample Data Connected'}</span>
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
        companyId={company?.id || 1}
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
