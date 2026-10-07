import { useState } from 'react'
import { 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Clock, 
  Send,
  ShieldCheck,
  Zap,
  Bookmark
} from 'lucide-react'

export default function JobDetailsModal({ job, isOpen, onClose, onSaveJob, isSaved }) {
  const [applied, setApplied] = useState(false)
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantResume, setApplicantResume] = useState(null)

  if (!isOpen || !job) return null

  const handleApply = (e) => {
    e.preventDefault()
    setApplied(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-orange-400 font-bold text-2xl shadow-inner">
              {job.company?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-orange-400 tracking-wide">{job.company}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Verified Band
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {job.compensation} / yr
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {job.postedAgo || 'Today'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSaveJob?.(job.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved 
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Save Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Key tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
              {job.badge1}
            </span>
            <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              {job.badge2}
            </span>
            {job.tags?.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                {tag}
              </span>
            ))}
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Full Benefits & Equity
            </span>
          </div>

          {/* Job Overview */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Role Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We are seeking an exceptional {job.title} to join our high-growth engineering team. In this position, you will directly architect critical modules, collaborate closely with design and product leads, and deliver high-performance user experiences.
            </p>
          </div>

          {/* Transparent Compensation Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Confirmed Total Compensation Package</span>
              <span className="text-emerald-600">Zero Ghost Band</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-black text-slate-900">{job.compensation}</span>
                <span className="text-xs text-slate-500 font-medium ml-1">base + performance bonus</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-orange-600">0.1% – 0.4% Equity</span>
                <span className="block text-[11px] text-slate-500">4-year vesting schedule</span>
              </div>
            </div>
          </div>

          {/* Hiring Process Pipeline */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Verified Fast-Track Hiring Steps (Avg 14 Days)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">1. Recruiter Intro</span>
                <p className="text-slate-500">30 min chat on goals and compensation sync.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">2. Technical & Architecture</span>
                <p className="text-slate-500">Practical real-world code pair session.</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 text-xs">
                <span className="font-bold text-orange-900 block mb-1">3. Team Meet & Offer</span>
                <p className="text-orange-700">Culture alignment and confirmed offer letter.</p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="pt-4 border-t border-slate-200">
            {applied ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Application Submitted Directly!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your profile and verified credentials have been sent directly to the hiring team at {job.company}. You will receive a response within 48 hours.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Close & Browse More Jobs
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">1-Click Direct Application</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Alex Taylor"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="alex@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LinkedIn / GitHub / Portfolio URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/username or https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Private & direct to engineering manager</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Submit Application</span>
                    <Send className="w-4 h-4 text-orange-400" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
