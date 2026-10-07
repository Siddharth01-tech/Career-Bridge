import { useState, useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import JobDetailsModal from '../components/landing/JobDetailsModal'
import PostJobModal from '../components/landing/PostJobModal'
import AuthModal from '../components/landing/AuthModal'
import { 
  Search, 
  MapPin, 
  Bookmark, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  Palette,
  Cloud,
  Code2
} from 'lucide-react'

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
]

export default function LandingPage() {
  const [jobs, setJobs] = useState(FEATURED_OPPORTUNITIES)
  const [searchRole, setSearchRole] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [savedJobs, setSavedJobs] = useState({})
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPostJobOpen, setIsPostJobOpen] = useState(false)
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpenJob = (job) => {
    setSelectedJob(job)
    setIsDetailsOpen(true)
  }

  const handleAddJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev])
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesRole =
        !searchRole.trim() ||
        job.title.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.company.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.badge2.toLowerCase().includes(searchRole.toLowerCase())

      const matchesLocation =
        !searchLocation.trim() ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase())

      return matchesRole && matchesLocation
    })
  }, [jobs, searchRole, searchLocation])

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Navigation Bar */}
      <Navbar 
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenPostJob={() => setIsPostJobOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle, CTA & Search */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
                <span>THE #1 MODERN TALENT PLATFORM</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-gray-950 leading-[1.08] mb-5">
                Your Next<br />
                <span className="text-[#FF5C00]">Big Opportunity</span><br />
                Is Here
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-500 max-w-lg mb-8 leading-relaxed">
                Discover top jobs, grow your skills, and build the career you deserve.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[15px] font-semibold transition-all active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                >
                  <span>Get Started</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-gray-200/90 hover:border-gray-950 bg-white hover:bg-gray-50 text-gray-800 text-[15px] font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Sign In</span>
                </button>

                <a 
                  href="#featured-opportunities"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-gray-600 hover:text-black transition-colors pl-2"
                >
                  <span>Explore Roles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>

              {/* Encapsulated Search Bar */}
              <div className="w-full max-w-[580px] bg-white p-2 rounded-2xl border border-gray-200/90 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] mb-6">
                <form 
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row items-center gap-2"
                >
                  {/* Role input */}
                  <div className="w-full flex-1 flex items-center px-3 py-2 text-sm text-gray-800">
                    <Search className="w-4 h-4 text-[#FF5C00] mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, skills, or keywords"
                      value={searchRole}
                      onChange={(e) => setSearchRole(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400 text-sm font-medium"
                    />
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />

                  {/* Location input */}
                  <div className="w-full sm:w-[190px] flex items-center px-3 py-2 text-sm text-gray-800">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Location or 'Remote'"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400 text-sm font-medium"
                    />
                  </div>

                  {/* Find Jobs Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#E05000] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Find Jobs</span>
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Stats Line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-gray-500">
                <span className="text-gray-900 font-bold">14,200+ <span className="text-gray-500 font-normal">Live Requisitions</span></span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-900 font-bold">2,800+ <span className="text-gray-500 font-normal">Verified Tech Companies</span></span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Transparent Salaries
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual with Woman in Blazer and Floating Badges */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              
              <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
                
                {/* Background Orange Accent Shape */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#FF5C00] -z-0" />
                
                {/* Main Portrait Frame */}
                <div className="relative z-10 w-full h-full rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img 
                    src="/hero-businesswoman.jpg" 
                    alt="Professional talent smiling"
                    className="w-full h-full object-cover object-top" 
                  />
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-3 -right-3 sm:-right-6 z-20 bg-white p-2.5 sm:p-3 rounded-2xl shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 animate-float">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FF5C00]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="#FF5C00" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-gray-400 leading-tight">Better Jobs</span>
                    <span className="block text-xs font-bold text-gray-950">Brighter Future</span>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-4 -left-3 sm:-left-6 z-20 bg-white py-2 px-3.5 rounded-full shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    Direct Interview Match
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ================= BRAND TICKER SECTION ================= */}
        <section id="companies" className="w-full bg-white py-8 border-y border-gray-100">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-gray-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
              <span>TRUSTED BY GLOBAL LEADERS</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-gray-800">
              <span className="text-xl sm:text-2xl font-black tracking-tighter hover:text-black transition-colors cursor-default">
                HEXA
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] hover:text-black transition-colors cursor-default">
                VERTEX
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight hover:text-black transition-colors cursor-default">
                SYNAPSE.AI
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight hover:text-black transition-colors cursor-default">
                KUBEFORT
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-widest hover:text-black transition-colors cursor-default">
                PULSEVOX
              </span>
            </div>
          </div>
        </section>

        {/* ================= FEATURED OPPORTUNITIES SECTION ================= */}
        <section id="featured-opportunities" className="max-w-[1360px] mx-auto px-4 sm:px-8 py-14 sm:py-18 w-full">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5C00] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
                <span>VERIFIED OPENINGS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                Featured Opportunities
              </h2>
            </div>

            <a 
              href="#all-roles" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#FF5C00] transition-colors group"
            >
              <span>Explore all 14,200 open positions</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* 4 Card Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredJobs.map((job) => {
              const isSaved = !!savedJobs[job.id]

              return (
                <div 
                  key={job.id} 
                  className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top: Icon Box + Company + Bookmark */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        
                        {/* Company Icon styling based on card */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          job.iconType === 'orange-box' 
                            ? 'bg-orange-50 text-[#FF5C00] border border-orange-100' 
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
                          <h4 className="text-[13px] font-bold text-gray-900 leading-snug">{job.company}</h4>
                          <span className="text-[11px] text-gray-400">{job.location}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? 'text-[#FF5C00]' : 'text-gray-300 hover:text-gray-600'
                        }`}
                        title="Bookmark Job"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3 
                      onClick={() => handleOpenJob(job)}
                      className="text-[16px] font-bold text-gray-900 hover:text-[#FF5C00] transition-colors cursor-pointer line-clamp-1 mb-3"
                    >
                      {job.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-semibold">
                        {job.badge1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#FF5C00] text-[11px] font-semibold">
                        {job.badge2}
                      </span>
                    </div>
                  </div>

                  {/* Compensation & View Requisition Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="mb-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        COMPENSATION
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[14px] font-extrabold text-gray-900">{job.compensation}</span>
                        <span className="text-[11px] text-gray-400 font-medium">/ year</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleOpenJob(job)}
                      className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Requisition</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
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

      <AuthModal 
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

    </div>
  )
}
