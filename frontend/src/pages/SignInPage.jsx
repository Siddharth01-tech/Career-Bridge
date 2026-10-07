import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [forgotModal, setForgotModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1200)
    }, 800)
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setResetSent(true)
    setTimeout(() => {
      setResetSent(false)
      setForgotModal(false)
    }, 2000)
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
      <div className="w-full max-w-[460px] mx-auto my-auto py-8">
        <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100">
          
          {/* Logo Badge */}
          <div className="flex justify-center mb-5">
            <Link to="/" className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-md shadow-black/10 hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
                <path d="M6 18a9 9 0 0 1 12 0" stroke="#FF5C00" />
              </svg>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-950 tracking-tight mb-1.5">
              CareerBridge
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Sign in to access your portal
            </p>
          </div>

          {/* Success Notification */}
          {success ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Signed In Successfully!</h3>
              <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@work.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200/90 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white transition-all font-medium"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-black focus:ring-0 cursor-pointer accent-black"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-slate-700 hover:text-black font-semibold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-2 text-xs sm:text-[13px] text-slate-600 font-medium">
                <span>Don't have an account? </span>
                <Link 
                  to="/signup" 
                  className="text-[#FF5C00] hover:text-[#e05000] font-bold transition-colors ml-0.5"
                >
                  Sign Up
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Forgot Password Mini-Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
            {resetSent ? (
              <p className="text-xs text-emerald-600 font-semibold">
                Password reset link has been dispatched to {resetEmail || 'your email'}.
              </p>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered work email and we will send you a reset link.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@work.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-neutral-800 rounded-lg"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full pb-2 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CareerBridge Inc. Modern Talent Infrastructure.
      </div>

    </div>
  )
}
