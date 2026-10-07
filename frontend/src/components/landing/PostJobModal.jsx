import { useState } from 'react'
import { X, Building2, DollarSign, MapPin, Sparkles, CheckCircle2 } from 'lucide-react'

export default function PostJobModal({ isOpen, onClose, onJobCreated }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('Remote')
  const [compensation, setCompensation] = useState('$150,000 – $180,000')
  const [badge1, setBadge1] = useState('Full-time')
  const [badge2, setBadge2] = useState('React / Node')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const newJob = {
      id: Date.now(),
      title,
      company,
      location,
      compensation,
      badge1,
      badge2,
      icon: 'code_blocks',
      postedAgo: 'Just now',
      tags: ['New Opening', 'Direct Hiring'],
    }
    onJobCreated?.(newJob)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Post a Verified Opening</h3>
              <p className="text-xs text-slate-400">Reach 25,000+ vetted engineers & designers</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Position Successfully Listed!</h4>
              <p className="text-xs text-slate-500">
                Your role is now live on the verified board with transparent salary metrics.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer (Go/Rust)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Nexus AI"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / Work Mode</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Remote or NYC (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salary Range (Transparent)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. $140,000 – $180,000"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Tech Stack / Domain</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. TypeScript / Next.js"
                    value={badge2}
                    onChange={(e) => setBadge2(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Publish Verified Position
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
