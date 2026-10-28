import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JobDetailsModal from '../components/landing/JobDetailsModal';
import PostJobModal from '../components/landing/PostJobModal';
import { 
  Search, 
  MapPin, 
  Bookmark, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  ArrowUpRight,
  Layers,
  Palette,
  Cloud,
  Code2
} from 'lucide-react';

const FEATURED_OPPORTUNITIES = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Vortex Labs',
    location: 'San Francisco (Hybrid)',
    iconType: 'orange-box',
    icon: 'layout',
    badge1: 'Full-time',
    badge2: 'Design Systems',
    compensation: '$150,000 – $185,000',
    postedAgo: '2h ago',
    tags: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: 2,
    title: 'Lead Product Designer',
    company: 'HyperScale Design',
    location: 'Remote',
    iconType: 'gold-box',
    icon: 'palette',
    badge1: 'Remote',
    badge2: 'Figma & UI',
    compensation: '$140,000 – $175,000',
    postedAgo: '4h ago',
    tags: ['Design Systems', 'User Research', 'Prototyping'],
  },
  {
    id: 3,
    title: 'DevOps Architect',
    company: 'Synapse Cloud',
    location: 'New York, NY',
    iconType: 'dark-box',
    icon: 'cloud',
    badge1: 'Full-time',
    badge2: 'AWS / K8s',
    compensation: '$170,000 – $215,000',
    postedAgo: '6h ago',
    tags: ['Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'Acuity Core',
    location: 'Remote',
    iconType: 'orange-box',
    icon: 'code',
    badge1: 'Remote',
    badge2: 'Node & React',
    compensation: '$138,000 – $168,000',
    postedAgo: '8h ago',
    tags: ['Node.js', 'React', 'GraphQL', 'PostgreSQL'],
  },
];

export default function LandingPage() {
  const [jobs, setJobs] = useState(FEATURED_OPPORTUNITIES);
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleAddJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesRole =
        !searchRole.trim() ||
        job.title.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.company.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.badge2.toLowerCase().includes(searchRole.toLowerCase());

      const matchesLocation =
        !searchLocation.trim() ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase());

      return matchesRole && matchesLocation;
    });
  }, [jobs, searchRole, searchLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Navigation Bar */}
      <Navbar 
        onOpenPostJob={() => setIsPostJobOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 lg:pt-16 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Subtitle, CTA & Search */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/80 shadow-2xs text-[11px] font-bold text-[#FF5A0A] uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF5A0A] animate-pulse" />
                <span>THE #1 MODERN TALENT PLATFORM</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-extrabold tracking-tight text-[#080D1C] leading-[1.08] mb-5">
                Your Next<br />
                <span className="text-[#FF5A0A]">Big Opportunity</span><br />
                Is Here
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-lg mb-8 leading-relaxed font-normal">
                Discover top jobs, grow your skills, and build the career you deserve with transparent companies.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-9">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#080D1C] hover:bg-slate-800 text-white text-[15px] font-semibold transition-all active:scale-95 shadow-sm shadow-slate-900/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                >
                  <span>Get Started</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </Link>

                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-200/90 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-[15px] font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                >
                  <span>Sign In</span>
                </Link>

                <a 
                  href="#featured-opportunities"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate-600 hover:text-[#FF5A0A] transition-colors pl-2 py-2 focus:outline-none focus-visible:text-[#FF5A0A]"
                >
                  <span>Explore Roles</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Encapsulated Search Bar */}
              <div className="w-full max-w-[600px] bg-white p-2 rounded-2xl border border-slate-200 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)] mb-6 transition-all focus-within:ring-2 focus-within:ring-[#FF5A0A]/30 focus-within:border-[#FF5A0A]">
                <form 
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row items-center gap-2"
                >
                  {/* Role input */}
                  <div className="w-full flex-1 flex items-center px-3 py-2 text-sm text-slate-800">
                    <Search className="w-4 h-4 text-[#FF5A0A] mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, skills, or keywords"
                      value={searchRole}
                      onChange={(e) => setSearchRole(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm font-medium"
                      aria-label="Search by job title, skills, or keywords"
                    />
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-6 bg-slate-200" />

                  {/* Location input */}
                  <div className="w-full sm:w-[190px] flex items-center px-3 py-2 text-sm text-slate-800">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Location or 'Remote'"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm font-medium"
                      aria-label="Filter by location"
                    />
                  </div>

                  {/* Find Jobs Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]"
                  >
                    <span>Find Jobs</span>
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Stats Line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="text-slate-900 font-bold">14,200+ <span className="text-slate-500 font-normal">Live Requisitions</span></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-900 font-bold">2,800+ <span className="text-slate-500 font-normal">Verified Tech Companies</span></span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Transparent Salaries
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual with Woman in Blazer and Floating Badges */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              
              <div className="relative w-full max-w-[400px] aspect-[4/5] flex items-center justify-center">
                
                {/* Background Orange Accent Shape */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#FF5A0A]/90 blur-3xs -z-0 pointer-events-none" />
                
                {/* Main Portrait Frame */}
                <div className="relative z-10 w-full h-full rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img 
                    src="/hero-businesswoman.jpg" 
                    alt="Professional talent smiling"
                    className="w-full h-full object-cover object-top" 
                  />
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-3 -right-2 sm:-right-4 z-20 bg-white p-2.5 sm:p-3 rounded-2xl shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 animate-float">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FF5A0A]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="#FF5A0A" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 leading-tight">Better Jobs</span>
                    <span className="block text-xs font-bold text-slate-950">Brighter Future</span>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-3 -left-2 sm:-left-4 z-20 bg-white py-2 px-3.5 rounded-full shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Direct Interview Match
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ================= BRAND TICKER SECTION ================= */}
        <section id="companies" className="w-full bg-slate-50/60 py-8 border-y border-slate-200/70">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-slate-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
              <span>TRUSTED BY GLOBAL LEADERS</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-700">
              <span className="text-xl sm:text-2xl font-black tracking-tighter hover:text-slate-950 transition-colors cursor-default">
                HEXA
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] hover:text-slate-950 transition-colors cursor-default">
                VERTEX
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight hover:text-slate-950 transition-colors cursor-default">
                SYNAPSE.AI
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight hover:text-slate-950 transition-colors cursor-default">
                KUBEFORT
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-widest hover:text-slate-950 transition-colors cursor-default">
                PULSEVOX
              </span>
            </div>
          </div>
        </section>

        {/* ================= FEATURED OPPORTUNITIES SECTION ================= */}
        <section id="featured-opportunities" className="max-w-[1360px] mx-auto px-4 sm:px-8 py-14 sm:py-20 w-full">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5A0A] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
                <span>VERIFIED OPENINGS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080D1C] tracking-tight">
                Featured Opportunities
              </h2>
            </div>

            <a 
              href="#featured-opportunities" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#FF5A0A] transition-colors group"
            >
              <span>Explore all 14,200 open positions</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* 4 Card Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredJobs.map((job) => {
              const isSaved = !!savedJobs[job.id];

              return (
                <div 
                  key={job.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-orange-200/90 hover:shadow-[0_12px_28px_-6px_rgba(255,90,10,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top: Icon Box + Company + Bookmark */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        
                        {/* Company Icon styling based on card */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          job.iconType === 'orange-box' 
                            ? 'bg-orange-50 text-[#FF5A0A] border border-orange-100' 
                            : job.iconType === 'gold-box'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {job.icon === 'layout' && <Layers className="w-4 h-4" />}
                          {job.icon === 'palette' && <Palette className="w-4 h-4" />}
                          {job.icon === 'cloud' && <Cloud className="w-4 h-4" />}
                          {job.icon === 'code' && <Code2 className="w-4 h-4" />}
                        </div>

                        <div>
                          <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{job.company}</h4>
                          <span className="text-[11px] text-slate-400">{job.location}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? 'text-[#FF5A0A]' : 'text-slate-300 hover:text-slate-600'
                        }`}
                        title={isSaved ? "Remove bookmark" : "Bookmark Job"}
                        aria-label={isSaved ? "Remove bookmark" : "Bookmark Job"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3 
                      onClick={() => handleOpenJob(job)}
                      className="text-[16px] font-bold text-slate-900 hover:text-[#FF5A0A] transition-colors cursor-pointer line-clamp-1 mb-3"
                    >
                      {job.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        {job.badge1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#FF5A0A] text-[11px] font-semibold border border-orange-200/50">
                        {job.badge2}
                      </span>
                    </div>
                  </div>

                  {/* Compensation & View Requisition Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="mb-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        COMPENSATION
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[14px] font-extrabold text-slate-900">{job.compensation}</span>
                        <span className="text-[11px] text-slate-400 font-medium">/ year</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleOpenJob(job)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-[#FF5A0A] text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent hover:border-orange-200"
                    >
                      <span>View Requisition</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <JobDetailsModal 
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onSaveJob={toggleSaveJob}
        isSaved={selectedJob ? !!savedJobs[selectedJob.id] : false}
      />

      <PostJobModal 
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={handleAddJob}
      />

    </div>
  );
}
