import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Vortex Labs',
    location: 'San Francisco, CA(Hybrid)',
    icon: 'terminal',
    badge1: 'Full-time',
    badge2: 'Design Systems',
    compensation: '$140,000 – $170,000',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'HyperScale Design',
    location: 'Remote',
    icon: 'palette',
    badge1: 'Remote',
    badge2: 'Figma & UI',
    compensation: '$125,000 – $155,000',
  },
  {
    id: 3,
    title: 'DevOps Architect',
    company: 'Synapse Cloud',
    location: 'New York, NY',
    icon: 'cloud_sync',
    badge1: 'Full-time',
    badge2: 'AWS / Kubernetes',
    compensation: '$165,000 – $210,000',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'Acuity Core',
    location: 'Remote',
    icon: 'code_blocks',
    badge1: 'Remote',
    badge2: 'Node & React',
    compensation: '$135,000 – $165,000',
  },
]

export default function LandingPage() {
  const [searchRole, setSearchRole] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [savedJobs, setSavedJobs] = useState({})

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#141b2b]">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-16 w-full">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden pb-10">
          {/* Ambient Lighting Backdrops */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[980px] h-[360px] bg-[radial-gradient(circle,rgba(225,232,253,0.7)_0%,rgba(233,237,255,0.3)_50%,transparent_80%)] blur-[48px] pointer-events-none z-0" />
          <div className="absolute top-12 right-[10%] w-72 h-72 rounded-full bg-[rgba(255,219,202,0.35)] blur-[40px] pointer-events-none z-0" />

          <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 pt-10 pb-4 text-center flex flex-col items-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e9edff] text-gray-700 text-[11px] font-semibold tracking-wider shadow-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fd761a] animate-pulse" />
              <span>ENGINEERED FOR MODERN TALENT INFRASTRUCTURE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 max-w-3xl mb-3">
              Find Your Next Opportunity
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-10">
              Discover jobs, connect with companies, and take the next step in your career.
            </p>

            {/* Floating Search Hub */}
            <div className="w-full max-w-4xl bg-white p-2 sm:p-2.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] border border-gray-100">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
                {/* Job Title Field */}
                <div className="w-full flex-1 flex items-center px-4 py-3 rounded-xl bg-[#f1f3ff] focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-300 transition-all">
                  <span className="material-symbols-outlined text-gray-400 mr-2 text-[22px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none"
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
                  />
                </div>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block w-px h-8 bg-gray-200" />

                {/* Location Field */}
                <div className="w-full flex-1 flex items-center px-4 py-3 rounded-xl bg-[#f1f3ff] focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-300 transition-all">
                  <span className="material-symbols-outlined text-gray-400 mr-2 text-[22px]">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="Location (e.g. San Francisco, Remote)"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <span>Search Jobs</span>
                  <span className="material-symbols-outlined text-[#fd761a] text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </form>
            </div>

            {/* Statistics Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span><strong className="font-bold text-gray-900">10K+</strong> Active Jobs</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fd761a]" />
                <span><strong className="font-bold text-gray-900">2K+</strong> Verified Companies</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span><strong className="font-bold text-gray-900">25K+</strong> Candidates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Ticker Section */}
        <section className="w-full bg-white py-6 border-y border-gray-200/60">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
              TRUSTED BY INDUSTRY LEADERS
            </span>
            <div className="flex flex-wrap items-center gap-8 sm:gap-12 opacity-65 text-gray-800">
              <span className="text-lg sm:text-xl font-black tracking-tighter">HEXA</span>
              <span className="text-lg sm:text-xl font-bold tracking-[0.25em]">VERTEX</span>
              <span className="text-lg sm:text-xl font-semibold">SYNAPSE.AI</span>
              <span className="text-lg sm:text-xl font-black tracking-tight">KUBEFORT</span>
              <span className="text-lg sm:text-xl font-medium tracking-widest">PULSEVOX</span>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section id="find-jobs" className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#fd761a] mb-1">
                VERIFIED OPENINGS
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Featured Jobs
              </h2>
            </div>
            <a 
              href="#all-jobs" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-[#fd761a] transition-colors group"
            >
              <span>Explore all 10,480 positions</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>

          {/* 4 Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_JOBS.map((job) => (
              <div 
                key={job.id} 
                className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Info & Bookmark */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e1e8fd] flex items-center justify-center text-gray-900">
                        <span className="material-symbols-outlined text-[20px]">{job.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{job.company}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">
                            {job.location.includes('Remote') ? 'public' : 'location_on'}
                          </span>
                          {job.location}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer ${
                        savedJobs[job.id] ? '!text-[#fd761a]' : ''
                      }`}
                      onClick={() => toggleSaveJob(job.id)}
                      aria-label="Save Job"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        bookmark
                      </span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3 leading-snug">
                    {job.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="px-2.5 py-1 rounded-md bg-[#ffdbca]/70 text-[#9d4300] text-xs font-medium">
                      {job.badge1}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#f1f3ff] text-gray-600 text-xs font-medium">
                      {job.badge2}
                    </span>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="block text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-0.5">
                      COMPENSATION
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">{job.compensation}</span>
                      <span className="text-xs text-gray-500">/ yr</span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="w-full py-2 px-3 rounded-lg bg-[#f1f3ff] hover:bg-black hover:text-white text-gray-800 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Job</span>
                    <span className="material-symbols-outlined text-[16px]">
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento / Pipeline Workflow Section */}
        <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Card: Candidate Pipeline (7 cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-[#ffdbca] text-[#9d4300] text-xs font-bold tracking-wide uppercase mb-4">
                  VERIFIED PIPELINE
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 max-w-md mb-3 leading-tight">
                  Built for transparent compensation & direct team access.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-lg mb-8 leading-relaxed">
                  Say goodbye to ghost listings and mystery salaries. Every position on CareerBridge includes confirmed salary bands, clear hiring steps, and direct connection to hiring teams.
                </p>
              </div>

              {/* Pipeline Step Diagram */}
              <div className="bg-[#f1f3ff] p-4 sm:p-5 rounded-xl">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-wide text-gray-500 mb-3">
                  <span>APPLICATION REVIEW</span>
                  <span>TECHNICAL SCREEN</span>
                  <span className="text-[#9d4300] font-bold">OFFER EXTENDED</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full w-1/3 bg-black" />
                  <div className="h-full w-1/3 bg-[#333333]" />
                  <div className="h-full w-1/3 bg-[#fd761a]" />
                </div>
              </div>
            </div>

            {/* Right Card: Hiring Manager Banner (5 cols) */}
            <div className="lg:col-span-5 bg-[#1c1b1b] text-white p-8 sm:p-10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-[#ffb690] mb-3 inline-block">
                  FOR HIRING MANAGERS
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1 mb-3 leading-snug">
                  Hire pre-vetted specialists in days, not quarters.
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-sm mb-6 leading-relaxed">
                  Post an opening and access high-intent technical talent already vetted through our behavioral and technical criteria.
                </p>

                <button 
                  type="button" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fd761a] hover:bg-[#9d4300] text-white text-sm font-semibold transition-all active:scale-98 cursor-pointer shadow-md"
                >
                  <span>Post a Position</span>
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fd761a] text-[16px]">
                    verified
                  </span>
                  <span>Average time-to-hire: 14 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fd761a]" />
                  <span>98% retention rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
