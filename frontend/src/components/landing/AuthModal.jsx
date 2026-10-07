import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Eye, EyeOff, ArrowRight, CheckCircle2, User, Building2 } from 'lucide-react'

export default function AuthModal({ isOpen, mode = 'login', onClose }) {
  const [activeTab, setActiveTab] = useState(mode) // 'login' | 'signup'
  const [role, setRole] = useState('candidate')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleAuth = (e) => {
    e.preventDefault()
    setError('')

    if (activeTab === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1200)
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl border border-slate-100 p-7 sm:p-9 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Logo Badge */}
        <div className="flex justify-center mb-4">
          <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center text-white shadow-xs">
            {activeTab === 'login' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
                <path d="M6 18a9 9 0 0 1 12 0" stroke="#FF5C00" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2.5" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
                <path d="M12 6.5v3M12 14.5v3M6.5 12h3M14.5 12h3" />
              </svg>
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight mb-1">
            {activeTab === 'login' ? 'CareerBridge' : 'Create your CareerBridge account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeTab === 'login' ? 'Sign in to access your portal' : 'Choose your role to get started'}
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'login' ? 'Signed In Successfully!' : 'Account Created!'}
            </h3>
            <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-3.5">
            
            {/* If Sign Up, show Role Selection */}
            {activeTab === 'signup' && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setRole('candidate')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left select-none ${
                    role === 'candidate'
                      ? 'border-[#FF5C00] bg-orange-50/20'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF5C00] flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    {role === 'candidate' && <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-950">Candidate</h4>
                  <p className="text-[10px] text-slate-500">Find jobs & career.</p>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setRole('recruiter')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left select-none ${
                    role === 'recruiter'
                      ? 'border-[#FF5C00] bg-orange-50/20'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    {role === 'recruiter' && <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-950">Recruiter</h4>
                  <p className="text-[10px] text-slate-500">Post jobs & talent.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder={activeTab === 'login' ? 'name@work.com' : 'alex.vance@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={activeTab === 'login' ? '••••••••' : 'Minimum 8 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'login' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-black accent-black"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent.'); }} className="text-slate-700 hover:text-black font-semibold">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer mt-3 flex items-center justify-center gap-2"
            >
              <span>
                {loading 
                  ? 'Processing...' 
                  : activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </span>
              {activeTab === 'signup' && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Toggle between Sign In and Sign Up */}
            <div className="text-center pt-2 text-xs text-slate-600">
              {activeTab === 'login' ? (
                <>
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setError(''); }}
                    className="text-[#FF5C00] hover:text-[#e05000] font-bold cursor-pointer ml-1"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className="text-slate-900 hover:text-black font-bold cursor-pointer underline ml-1"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  )
}
