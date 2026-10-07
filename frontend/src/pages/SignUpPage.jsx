import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, User, Building2 } from 'lucide-react'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('candidate') // 'candidate' | 'recruiter'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1400)
    }, 800)
  }

  return (
    <div className="min-h-screen w-full bg-[#f8faff] flex flex-col justify-between p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Top Bar: Back to Home Link */}
      <div className="max-w-6xl mx-auto w-full pt-2">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CareerBridge</span>
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-[500px] mx-auto my-auto py-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100">
          
          {/* Logo Network Icon Badge */}
          <div className="flex justify-center mb-5">
            <Link to="/" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 shadow-xs hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2.5" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
                <path d="M12 6.5v3M12 14.5v3M6.5 12h3M14.5 12h3" />
              </svg>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-950 tracking-tight mb-1.5 leading-tight">
              Create your CareerBridge account
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Choose your role to get started
            </p>
          </div>

          {/* Success Notification */}
          {success ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Account Created Successfully!</h3>
              <p className="text-xs text-slate-500">
                Welcome to CareerBridge as a {role === 'candidate' ? 'Candidate' : 'Recruiter'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selector (Candidate vs Recruiter) */}
              <div className="grid grid-cols-2 gap-3.5 mb-6">
                
                {/* Candidate Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setRole('candidate')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRole('candidate'); }}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer text-left select-none flex flex-col justify-between ${
                    role === 'candidate'
                      ? 'border-[#FF5C00] bg-orange-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Top: Icon + Orange Active Dot */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5C00] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    {role === 'candidate' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C00]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 mb-0.5">Candidate</h3>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Find jobs and build your career.
                    </p>
                  </div>
                </div>

                {/* Recruiter Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setRole('recruiter')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRole('recruiter'); }}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer text-left select-none flex flex-col justify-between ${
                    role === 'recruiter'
                      ? 'border-[#FF5C00] bg-orange-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {role === 'recruiter' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C00]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 mb-0.5">Recruiter</h3>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Create jobs and find talented candidates.
                    </p>
                  </div>
                </div>

              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.vance@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Log In Link */}
              <div className="text-center pt-2 text-xs sm:text-[13px] text-slate-600 font-medium">
                <span>Already have an account? </span>
                <Link 
                  to="/signin" 
                  className="text-slate-900 hover:text-black font-bold transition-colors ml-0.5 underline decoration-slate-300 underline-offset-2"
                >
                  Log in
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full pb-2 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CareerBridge Inc. Modern Talent Infrastructure.
      </div>

    </div>
  )
}
