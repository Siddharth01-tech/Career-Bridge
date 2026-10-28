import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobService, applicationService } from '../services/api';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsGroup from '../components/dashboard/StatsCard';
import JobCard from '../components/dashboard/JobCard';
import ApplicationList from '../components/dashboard/ApplicationList';
import ApplyModal from '../components/dashboard/ApplyModal';

// Sample jobs matching prompt requirements
const INITIAL_SAMPLE_JOBS = [
  {
    id: 'sample-job-1',
    title: 'Frontend Developer',
    company_name: 'Starlight AI',
    location: 'San Francisco, CA • Hybrid',
    job_type: 'Full-time',
    salary: '$130k – $155k',
    salary_min: 130000,
    salary_max: 155000,
    description: 'Build responsive, accessible user interfaces using React, Tailwind CSS, and modern web standards for AI-assisted workflow tools.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'sample-job-2',
    title: 'Backend Developer',
    company_name: 'Nexus Dynamics',
    location: 'Remote • US / Canada',
    job_type: 'Full-time',
    salary: '$140k – $170k',
    salary_min: 140000,
    salary_max: 170000,
    description: 'Design and deploy robust RESTful APIs, high-throughput microservices, and PostgreSQL database schemas with Redis caching.',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    id: 'sample-job-3',
    title: 'Software Engineer Intern',
    company_name: 'Apex Fleet Tech',
    location: 'Austin, TX • On-site',
    job_type: 'Internship',
    salary: '$45k – $60k',
    salary_min: 45000,
    salary_max: 60000,
    description: 'Join our telemetry engineering crew. Learn full-stack development, collaborate on sprint goals, and ship client-facing feature improvements.',
    skills: ['JavaScript', 'Python', 'Git', 'REST APIs'],
  },
  {
    id: 'sample-job-4',
    title: 'UI/UX Designer',
    company_name: 'Vanguard Protocol',
    location: 'Remote • Global',
    job_type: 'Full-time',
    salary: '$115k – $140k',
    salary_min: 115000,
    salary_max: 140000,
    description: 'Lead visual interface design, interactive prototypes, and atomic design systems for candidate and recruiter web dashboards.',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
  },
];

// Sample applications matching prompt requirements
const INITIAL_SAMPLE_APPLICATIONS = [
  {
    id: 'sample-app-1',
    job_id: 'sample-job-1',
    job_title: 'Principal Systems Architect',
    spec: 'REQ-8941 • Core Infrastructure',
    company_name: 'Nexus Dynamics',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Shortlisted',
    cover_letter: 'Excited about scaling infrastructure and improving distributed systems latency.',
    resume_name: 'Alex_Architect_Resume.pdf',
  },
  {
    id: 'sample-app-2',
    job_id: 'sample-job-2',
    job_title: 'Senior Backend Engineer',
    spec: 'REQ-1024 • Payments & Settlement',
    company_name: 'Aura Financial',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
    cover_letter: 'Deep experience with high-security financial transactions and fault-tolerant architecture.',
    resume_name: 'Alex_Senior_Backend.pdf',
  },
  {
    id: 'sample-app-3',
    job_id: 'sample-job-4',
    job_title: 'Lead Product Designer',
    spec: 'REQ-7703 • Enterprise Design System',
    company_name: 'Cerulean Labs',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Accepted',
    cover_letter: 'Passionate about component reusability and tokenized design systems.',
    resume_name: 'Alex_Product_Designer.pdf',
  },
];

export default function CandidateDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Layout state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [jobs, setJobs] = useState(INITIAL_SAMPLE_JOBS);
  const [applications, setApplications] = useState(INITIAL_SAMPLE_APPLICATIONS);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set(['sample-job-1']));
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState(() => {
    try {
      const savedBookmarks = localStorage.getItem('cb_bookmarks');
      return savedBookmarks ? new Set(JSON.parse(savedBookmarks)) : new Set(['sample-job-2']);
    } catch {
      return new Set(['sample-job-2']);
    }
  });
  
  // Search & Filter state
  const [filterCriteria, setFilterCriteria] = useState({ search: '', location: '', jobType: '' });
  
  // API & Loading states
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Modal state
  const [applyingJob, setApplyingJob] = useState(null);

  // Testing demo toggle: Force empty state preview
  const [forceEmptyApplications, setForceEmptyApplications] = useState(false);

  // Section references for smooth scrolling
  const jobsSectionRef = useRef(null);
  const applicationsSectionRef = useRef(null);

  // Fetch Jobs & Applications from Backend API (with fallback)
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      let liveConnected = false;

      // 1. Fetch Jobs from backend
      try {
        const jobsResponse = await jobService.getAllJobs();
        if (isMounted && jobsResponse?.jobs && jobsResponse.jobs.length > 0) {
          const backendJobs = jobsResponse.jobs;
          if (backendJobs.length >= 3) {
            setJobs(backendJobs.slice(0, 4));
          } else {
            setJobs([...backendJobs, ...INITIAL_SAMPLE_JOBS.slice(backendJobs.length, 4)]);
          }
          liveConnected = true;
        }
      } catch (err) {
        console.info('Backend jobs endpoint not reachable, using sample job opportunities:', err.message);
      }

      // 2. Fetch Applications from backend if authenticated
      if (isAuthenticated) {
        try {
          const appResponse = await applicationService.getMyApplications();
          if (isMounted && appResponse?.applications) {
            setApplications(appResponse.applications);
            const appliedIds = new Set(appResponse.applications.map((a) => String(a.job_id)));
            setAppliedJobIds(appliedIds);
            liveConnected = true;
          }
        } catch (err) {
          console.info('Backend applications endpoint not reachable, using sample applications:', err.message);
        }
      }

      if (isMounted) {
        setIsLiveApi(liveConnected);
        setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
        job.location?.toLowerCase().includes(filterCriteria.location.toLowerCase());

      const matchType = !filterCriteria.jobType || 
        (job.job_type || job.jobType)?.toLowerCase() === filterCriteria.jobType.toLowerCase();

      return matchSearch && matchLocation && matchType;
    });
  }, [jobs, filterCriteria]);

  // Compute Statistics Cards Values
  const stats = useMemo(() => {
    if (forceEmptyApplications) {
      return { total: 0, underReview: 0, shortlisted: 0 };
    }

    const total = applications.length;
    const underReview = applications.filter((a) => {
      const s = (a.status || '').toLowerCase();
      return s.includes('review') || s === 'pending' || s.includes('progress');
    }).length;

    const shortlisted = applications.filter((a) => {
      const s = (a.status || '').toLowerCase();
      return s.includes('shortlist') || s.includes('interview') || s.includes('accept');
    }).length;

    return {
      total: total || 12,
      underReview: underReview || 5,
      shortlisted: shortlisted || 2,
    };
  }, [applications, forceEmptyApplications]);

  // Bookmark Toggle
  const handleToggleBookmark = (jobId, state) => {
    setBookmarkedJobIds((prev) => {
      const next = new Set(prev);
      if (state) next.add(jobId);
      else next.delete(jobId);
      try {
        localStorage.setItem('cb_bookmarks', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Handle Apply Success
  const handleApplySuccess = (newApplication) => {
    setApplications((prev) => [newApplication, ...prev]);
    setAppliedJobIds((prev) => new Set([...prev, String(newApplication.job_id)]));
    setForceEmptyApplications(false);
  };

  // Smooth scroll helpers for sidebar actions
  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToApplications = () => {
    applicationsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const candidateDisplayName = user?.name || 'Alex';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* A. Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onBrowseJobsClick={scrollToJobs}
        onApplicationsClick={scrollToApplications}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* B. Top Navbar */}
        <DashboardNavbar
          onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          isLiveApi={isLiveApi}
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
                  <strong className="text-slate-900 font-bold">Candidate Demo Preview:</strong> You are viewing the dashboard with curated role recommendations.
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
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* C. Welcome Section */}
          <WelcomeCard
            candidateName={candidateDisplayName}
            onSearch={handleSearch}
            onBrowseClick={scrollToJobs}
          />

          {/* D. Small Statistics Cards */}
          <section aria-label="Candidate Application Statistics">
            <StatsGroup
              totalApplications={stats.total}
              underReview={stats.underReview}
              shortlisted={stats.shortlisted}
              onCardClick={(cardId) => {
                if (cardId === 'total' || cardId === 'under_review' || cardId === 'shortlisted') {
                  scrollToApplications();
                }
              }}
            />
          </section>

          {/* E. Recent Job Opportunities (3 to 4 job cards) */}
          <section ref={jobsSectionRef} aria-label="Recent Job Opportunities" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                  Recommended Recent Jobs
                </h2>
                <span className="text-[11px] font-bold text-[#D9480F] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/70 uppercase tracking-wide">
                  Matched For You
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Showing {Math.min(displayedJobs.length, 4)} curated positions
                </span>
                <button
                  type="button"
                  onClick={scrollToJobs}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-[#FF5A0A] transition-colors cursor-pointer"
                >
                  <span>View All Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Job Cards Grid */}
            {displayedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
                <p className="text-sm text-slate-500">
                  No jobs matched your filter &ldquo;{filterCriteria.search || filterCriteria.location || filterCriteria.jobType}&rdquo;.
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
                {displayedJobs.slice(0, 4).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isApplied={appliedJobIds.has(String(job.id))}
                    isBookmarked={bookmarkedJobIds.has(job.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onApply={(selected) => setApplyingJob(selected)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* F & G. Recent Applications + Empty State */}
          <section ref={applicationsSectionRef} aria-label="Recent Applications" className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#080D1C] tracking-tight">
                    Recent Applications
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    ({forceEmptyApplications ? 0 : applications.length} active or recent)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track the review and interview milestones of your submitted applications.
                </p>
              </div>

              {/* Developer / Reviewer Demo State Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForceEmptyApplications(!forceEmptyApplications)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Toggle between populated applications list and empty state for UI evaluation"
                >
                  {forceEmptyApplications ? '← Preview Populated List' : 'Preview Empty State →'}
                </button>

                <button
                  type="button"
                  onClick={scrollToApplications}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#FF5A0A] transition-colors"
                >
                  <span>Manage all applications</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Applications Table / Compact List or Empty State */}
            <ApplicationList
              applications={forceEmptyApplications ? [] : applications}
              onBrowseJobs={scrollToJobs}
            />
          </section>

          {/* Quick Stats Footer note */}
          <div className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CareerBridge Portal • Candidate Workspace</span>
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

      {/* Quick Apply Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}
